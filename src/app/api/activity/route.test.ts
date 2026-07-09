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

const mockGetAll = mock(() =>
  Promise.resolve({
    items: [
      {
        id: 1,
        userId: 1,
        action: 'CREATE',
        entityType: 'member',
        entityId: 1,
        details: 'Member created successfully',
        createdAt: new Date(),
        user: {
          id: 99,
          name: 'Budi Santoso',
          email: 'budi@example.com',
          role: ADMIN,
        },
      },
    ],
    total: 1,
  }),
);

mock.module('@/services/activity.service', () => ({
  activityService: {
    getAll: mockGetAll,
  },
}));

describe('GET /api/activity (Get All Activities)', () => {
  beforeEach(() => {
    mockGetAll.mockClear();
    mockSession = null;
  });

  it('admin role can get all activities', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/activity?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Activities fetched successfully');
    expect(body.data.items).toHaveLength(1);

    expect(mockGetAll).toHaveBeenCalledWith({
      search: undefined,
      packageId: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('member role cannot get all activities', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      'http://localhost/api/activity?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  it('guest cannot get all activities', async () => {
    mockSession = null;
    const request = new NextRequest(
      'http://localhost/api/activity?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAll).not.toHaveBeenCalled();
  });
});
