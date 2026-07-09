import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest, NextResponse } from 'next/server';

process.env.IMAGEKIT_PUBLIC_KEY = 'mock-public-key';
process.env.IMAGEKIT_PRIVATE_KEY = 'mock-private-key';
process.env.IMAGEKIT_URL_ENDPOINT = 'mock-endpoint';

let GET: { (request: NextRequest): Promise<NextResponse> };

const mockGetAuthenticationParameters = mock(() => ({
  token: 'mock-token',
  expire: 1234567890,
  signature: 'mock-signature',
}));

mock.module('@/lib/imagekit', () => ({
  imagekit: {
    getAuthenticationParameters: mockGetAuthenticationParameters,
  },
}));

describe('GET /api/imagekit/auth (ImageKit Auth)', () => {
  beforeEach(async () => {
    if (!GET) {
      const route = await import('./route');
      GET = route.GET;
    }
    mockGetAuthenticationParameters.mockClear();
  });

  it('anyone can get ImageKit authentication parameters', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/imagekit/auth'),
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.token).toBe('mock-token');
    expect(body.expire).toBe(1234567890);
    expect(body.signature).toBe('mock-signature');
    expect(mockGetAuthenticationParameters).toHaveBeenCalled();
  });
});
