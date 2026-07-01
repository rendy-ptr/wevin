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

const mockGetInvitationById = mock((id: number, _userId: number) => {
  if (id === 1) {
    return Promise.resolve({
      id: 1,
      slug: 'romeo-juliet',
      groomName: 'Romeo',
      brideName: 'Juliet',
    });
  }
  return Promise.reject(
    new Error('Invitation not found or unauthorized access.'),
  );
});

mock.module('@/services/invitation.service', () => ({
  invitationService: {
    getInvitationById: mockGetInvitationById,
  },
}));

describe('GET /api/invitation/[id] (Get Invitation By ID)', () => {
  beforeEach(() => {
    mockGetInvitationById.mockClear();
    mockSession = null;
  });

  it('member role can get their own invitation', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation fetched successfully');
    expect(body.data.slug).toBe('romeo-juliet');

    expect(mockGetInvitationById).toHaveBeenCalledWith(1, 1);
  });

  it('admin role cannot get invitation', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });

  it('guest cannot get invitation', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/abc');
    const response = await GET(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });
});
