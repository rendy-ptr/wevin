import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { PATCH } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

const responseUpdateEmailData = {
  id: 1,
  email: 'test@test.com',
  name: 'test',
  createdAt: new Date(),
  role: MEMBER,
};

const mockLogin = mock(() => Promise.resolve());

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
  login: mockLogin,
}));

const mockUpdateEmail = mock(() => Promise.resolve(responseUpdateEmailData));

mock.module('@/services/setting.service', () => ({
  settingService: {
    updateEmail: mockUpdateEmail,
  },
}));

describe('PATCH /api/setting/email/[id] (Update Email)', () => {
  beforeEach(() => {
    mockUpdateEmail.mockClear();
    mockLogin.mockClear();
    mockSession = null;
  });

  const payload = {
    id: 1,
    email: 'test@test.com',
    verificationToken: 'verificationToken',
    otpCode: 'otpCode',
  };

  it('admin role can update email', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/setting/email/${payload.id}`,
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
    expect(body.message).toBe('Email updated successfully');
    expect(body.data).toEqual({
      ...responseUpdateEmailData,
      createdAt: responseUpdateEmailData.createdAt.toISOString(),
    });
    expect(mockUpdateEmail).toHaveBeenCalledWith(payload);
    expect(mockLogin).toHaveBeenCalledWith(responseUpdateEmailData);
  });

  it('member role can update email', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/setting/email/${payload.id}`,
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
    expect(body.message).toBe('Email updated successfully');
    expect(body.data).toEqual({
      ...responseUpdateEmailData,
      createdAt: responseUpdateEmailData.createdAt.toISOString(),
    });
    expect(mockUpdateEmail).toHaveBeenCalledWith(payload);
    expect(mockLogin).toHaveBeenCalledWith(responseUpdateEmailData);
  });

  it('guest cannot update email', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/setting/email/${payload.id}`,
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
    expect(mockUpdateEmail).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const invalidPayload = {
      ...payload,
      email: 'invalid-email',
    };
    const request = new NextRequest(
      `http://localhost/api/setting/email/${invalidPayload.id}`,
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
    expect(mockUpdateEmail).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
