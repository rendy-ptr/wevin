import { GuestStatusEnum } from '@/enums/invitation.enum';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

const mockUpdateStatus = mock(() => Promise.resolve({ success: true }));

mock.module('@/services/invitation-guest.service', () => ({
  invitationGuestService: {
    updateStatusByInvitationAndName: mockUpdateStatus,
  },
}));

describe('POST /api/invitation-guest/public/status (Update Guest Status)', () => {
  beforeEach(() => {
    mockUpdateStatus.mockClear();
  });

  const payload = {
    invitationId: 10,
    guestName: 'Budi Gunawan',
    status: GuestStatusEnum.Opened,
  };

  it('anyone can update guest status to Opened or Responded (public route)', async () => {
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/public/status',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guest status updated successfully');
    expect(mockUpdateStatus).toHaveBeenCalledWith(
      payload.invitationId,
      payload.guestName,
      payload.status,
    );
  });

  it('validation failed if status is not Opened or Responded', async () => {
    const invalidPayload = {
      ...payload,
      status: 'RandomStatus',
    };
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/public/status',
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
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('validation failed if guestName is too short', async () => {
    const invalidPayload = {
      ...payload,
      guestName: 'A',
    };
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/public/status',
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
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });
});
