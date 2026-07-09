import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockExportGuests = mock(() =>
  Promise.resolve([{ id: 1, guestName: 'Budi', invitationId: 10 }]),
);

mock.module('@/services/invitation-guest.service', () => ({
  invitationGuestService: {
    export: mockExportGuests,
  },
}));

describe('GET /api/invitation-guest/export (Export Guests)', () => {
  beforeEach(() => {
    mockExportGuests.mockClear();
    mockSession = null;
  });

  it('member role can export guests', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/export?invitationId=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guests exported successfully');
    expect(body.data.length).toBe(1);
    expect(mockExportGuests).toHaveBeenCalledWith(mockSession.user.id);
  });

  it('admin role cannot export guests', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/export?invitationId=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockExportGuests).not.toHaveBeenCalled();
  });

  it('guest cannot export guests', async () => {
    mockSession = null;
    const request = new NextRequest(
      'http://localhost/api/invitation-guest/export?invitationId=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockExportGuests).not.toHaveBeenCalled();
  });
});
