import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

const mockSubmitPublicWish = mock(() => Promise.resolve({ id: 1 }));

mock.module('@/services/invitation-wishes.service', () => ({
  invitationWishesService: {
    submitPublicWish: mockSubmitPublicWish,
  },
}));

describe('POST /api/invitation-wishes/public (Submit Wish)', () => {
  beforeEach(() => {
    mockSubmitPublicWish.mockClear();
  });

  const payload = {
    invitationId: 10,
    guestName: 'Budi Gunawan',
    message: 'Happy wedding!',
  };

  it('anyone can submit a wish (public route)', async () => {
    const request = new NextRequest(
      'http://localhost/api/invitation-wishes/public',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Wish submitted successfully');
    expect(mockSubmitPublicWish).toHaveBeenCalledWith(payload);
  });

  it('validation failed if guestName is too short', async () => {
    const invalidPayload = {
      ...payload,
      guestName: 'A',
    };
    const request = new NextRequest(
      'http://localhost/api/invitation-wishes/public',
      {
        method: 'POST',
        body: JSON.stringify(invalidPayload),
      },
    );
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockSubmitPublicWish).not.toHaveBeenCalled();
  });
});
