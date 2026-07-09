import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

const getSettingActivityLogsData = {
  id: 1,
  userId: 1,
  action: 'LOGIN',
  entityType: 'MEMBER',
  entityId: 1,
  details: 'Member logged in',
  createdAt: new Date(),
  user: {
    name: 'Budi',
    email: 'budi@example.com',
    role: MEMBER,
  },
};

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGetSettingActivityLogs = mock(() =>
  Promise.resolve(getSettingActivityLogsData),
);

mock.module('@/services/setting.service', () => ({
  settingService: {
    getSettingActivityLogs: mockGetSettingActivityLogs,
  },
}));

describe('GET /api/setting/logs (Get All Setting Activity Logs)', () => {
  beforeEach(() => {
    mockGetSettingActivityLogs.mockClear();
    mockSession = null;
  });

  it('admin role can get setting activity logs', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/setting/logs?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Setting activity logs fetched successfully');
    expect(body.data).toEqual({
      ...getSettingActivityLogsData,
      createdAt: getSettingActivityLogsData.createdAt.toISOString(),
    });
    expect(mockGetSettingActivityLogs).toHaveBeenCalledWith(
      {
        search: undefined,
        startDate: undefined,
        endDate: undefined,
        action: undefined,
        page: 1,
        limit: 10,
      },
      mockSession.user.id,
    );
  });

  it('member role can get setting activity logs', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      'http://localhost/api/setting/logs?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Setting activity logs fetched successfully');
    expect(body.data).toEqual({
      ...getSettingActivityLogsData,
      createdAt: getSettingActivityLogsData.createdAt.toISOString(),
    });
    expect(mockGetSettingActivityLogs).toHaveBeenCalledWith(
      {
        search: undefined,
        startDate: undefined,
        endDate: undefined,
        action: undefined,
        page: 1,
        limit: 10,
      },
      mockSession.user.id,
    );
  });

  it('guest cannot get setting activity logs', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/setting/logs');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetSettingActivityLogs).not.toHaveBeenCalled();
  });
});
