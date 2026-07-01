import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { PATCH } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

const responseUpdatePasswordData = {
  id: 1,
  email: 'test@test.com',
  name: 'test',
};

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockUpdatePassword = mock(() =>
  Promise.resolve(responseUpdatePasswordData),
);

mock.module('@/services/setting.service', () => ({
  settingService: {
    updatePassword: mockUpdatePassword,
  },
}));

describe('PATCH /api/setting/password/[id] (Update Password)', () => {
  beforeEach(() => {
    mockUpdatePassword.mockClear();
    mockSession = null;
  });

  const payload = {
    id: 1,
    oldPassword: 'oldpassword',
    password: 'newpassword',
    confirmPassword: 'newpassword',
  };

  it('admin role can update password', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/setting/password/${payload.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Password updated successfully');
    expect(body.data).toEqual(responseUpdatePasswordData);
    expect(mockUpdatePassword).toHaveBeenCalledWith({
      id: payload.id,
      oldPassword: payload.oldPassword,
      newPassword: payload.password,
    });
  });

  it('member role can update password', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/setting/password/${payload.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Password updated successfully');
    expect(body.data).toEqual(responseUpdatePasswordData);
    expect(mockUpdatePassword).toHaveBeenCalledWith({
      id: payload.id,
      oldPassword: payload.oldPassword,
      newPassword: payload.password,
    });
  });

  it('guest cannot update password', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/setting/password/${payload.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const invalidPayload = {
      ...payload,
      password: '',
    };
    const request = new NextRequest(
      `http://localhost/api/setting/password/${invalidPayload.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(invalidPayload),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: invalidPayload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/setting/password/abc',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });
});
