import { RSVPStatusEnum } from '@/enums/invitation.enum';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

const mockSubmitPublicRSVP = mock(() => Promise.resolve({ id: 1 }));

mock.module('@/services/invitation-rsvp.service', () => ({
  invitationRSVPService: {
    submitPublicRSVP: mockSubmitPublicRSVP,
  },
}));

describe('POST /api/invitation-rsvp/public (Submit RSVP)', () => {
  beforeEach(() => {
    mockSubmitPublicRSVP.mockClear();
  });

  const payload = {
    invitationId: 10,
    guestName: 'Budi Gunawan',
    status: RSVPStatusEnum.Present,
    guestCount: 2,
  };

  it('anyone can submit RSVP (public route)', async () => {
    const request = new NextRequest(
      'http://localhost/api/invitation-rsvp/public',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('RSVP submitted successfully');
    expect(mockSubmitPublicRSVP).toHaveBeenCalledWith(payload);
  });

  it('validation failed if guestName is too short', async () => {
    const invalidPayload = {
      ...payload,
      guestName: 'A',
    };
    const request = new NextRequest(
      'http://localhost/api/invitation-rsvp/public',
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
    expect(mockSubmitPublicRSVP).not.toHaveBeenCalled();
  });
});
