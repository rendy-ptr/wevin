import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockLogout = mock(() =>
  Promise.resolve({
    success: true,
    message: 'User logged out successfully',
    data: null,
  }),
);

mock.module('@/services/auth.service', () => ({
  authService: {
    logout: mockLogout,
  },
}));

describe('POST /api/auth/logout (Logout)', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockSession = null;
  });

  it('admin role can logout successfully', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/auth/logout');
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('User logged out successfully');
    expect(mockLogout).toHaveBeenCalledWith(mockSession.user.id);
  });

  it('member role can logout successfully', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest('http://localhost/api/auth/logout');
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('User logged out successfully');
    expect(mockLogout).toHaveBeenCalledWith(mockSession.user.id);
  });

  it('guest cannot logout', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/auth/logout');
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
