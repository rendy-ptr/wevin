import { ADMIN, MEMBER } from '@/constants/role';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { DELETE, PUT } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGuestData = {
  id: 1,
  invitationId: 10,
  guestName: 'Budi Gunawan',
  phoneNumber: '08123456789',
  status: GuestStatusEnum.Idle,
};

const mockUpdateGuest = mock(() => Promise.resolve(mockGuestData));
const mockDeleteGuest = mock(() => Promise.resolve());

mock.module('@/services/invitation-guest.service', () => ({
  invitationGuestService: {
    update: mockUpdateGuest,
    delete: mockDeleteGuest,
  },
}));

describe('PUT /api/invitation-guest/[id] (Update Guest)', () => {
  beforeEach(() => {
    mockUpdateGuest.mockClear();
    mockSession = null;
  });

  const payload = {
    invitationId: 10,
    guestName: 'Budi Gunawan Edit',
    phoneNumber: '08123456789',
    status: GuestStatusEnum.Idle,
  };

  it('member role can update guest', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guest updated successfully');
    expect(mockUpdateGuest).toHaveBeenCalledWith(
      1,
      payload,
      mockSession.user.id,
    );
  });

  it('admin role cannot update guest', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockUpdateGuest).not.toHaveBeenCalled();
  });

  it('guest cannot update guest', async () => {
    mockSession = null;
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockUpdateGuest).not.toHaveBeenCalled();
  });

  it('returns 400 if validation fails', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const invalidPayload = {
      guestName: 'A',
    };
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'PUT',
      body: JSON.stringify(invalidPayload),
    });
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockUpdateGuest).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      `http://localhost/api/invitation-guest/abc`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');
    expect(mockUpdateGuest).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/invitation-guest/[id] (Delete Guest)', () => {
  beforeEach(() => {
    mockDeleteGuest.mockClear();
    mockSession = null;
  });

  it('member role can delete guest', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guest deleted successfully');
    expect(mockDeleteGuest).toHaveBeenCalledWith(1, mockSession.user.id);
  });

  it('admin role cannot delete guest via this route', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(`http://localhost/api/invitation-guest/1`, {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockDeleteGuest).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      `http://localhost/api/invitation-guest/abc`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');
    expect(mockDeleteGuest).not.toHaveBeenCalled();
  });
});
