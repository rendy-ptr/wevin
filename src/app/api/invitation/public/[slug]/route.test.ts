import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET } from './route';

const mockGetPublicInvitationBySlug = mock(() =>
  Promise.resolve({ id: 1, title: 'My Wedding', slug: 'my-wedding' }),
);

mock.module('@/services/invitation.service', () => ({
  invitationService: {
    getPublicInvitationBySlug: mockGetPublicInvitationBySlug,
  },
}));

describe('GET /api/invitation/public/[slug] (Get Public Invitation by Slug)', () => {
  beforeEach(() => {
    mockGetPublicInvitationBySlug.mockClear();
  });

  it('anyone can get public invitation by slug', async () => {
    const request = new NextRequest(
      'http://localhost/api/invitation/public/my-wedding',
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'my-wedding' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation fetched successfully');
    expect(body.data.slug).toBe('my-wedding');
    expect(mockGetPublicInvitationBySlug).toHaveBeenCalledWith('my-wedding');
  });

  it('returns 400 if slug is not provided', async () => {
    const request = new NextRequest('http://localhost/api/invitation/public/');
    const response = await GET(request, {
      params: Promise.resolve({ slug: '' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid Slug');
    expect(mockGetPublicInvitationBySlug).not.toHaveBeenCalled();
  });
});
