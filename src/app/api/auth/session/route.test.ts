import { ADMIN } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { GET } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

describe('GET /api/auth/session (Get Session)', () => {
  beforeEach(() => {
    mockSession = null;
  });

  it('returns user session if authenticated', async () => {
    mockSession = {
      user: {
        id: 1,
        email: 'admin@wevin.com',
        role: ADMIN,
      },
    };

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('User is authenticated');
    expect(body.user).toEqual(mockSession.user);
  });

  it('returns 401 if unauthenticated', async () => {
    mockSession = null;

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('User is not authenticated');
    expect(body.user).toBeNull();
  });
});
