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

const mockGetInvitationOptions = mock(() =>
  Promise.resolve([{ id: 1, title: 'My Wedding', slug: 'my-wedding' }]),
);

mock.module('@/services/invitation.service', () => ({
  invitationService: {
    getInvitationOptions: mockGetInvitationOptions,
  },
}));

describe('GET /api/invitation/options (Get Invitation Options)', () => {
  beforeEach(() => {
    mockGetInvitationOptions.mockClear();
    mockSession = null;
  });

  it('member role can get invitation options', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest('http://localhost/api/invitation/options');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation options fetched successfully');
    expect(body.data.length).toBe(1);
    expect(mockGetInvitationOptions).toHaveBeenCalledWith(mockSession.user.id);
  });

  it('admin role cannot get invitation options', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/invitation/options');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetInvitationOptions).not.toHaveBeenCalled();
  });

  it('guest cannot get invitation options', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/invitation/options');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetInvitationOptions).not.toHaveBeenCalled();
  });
});
