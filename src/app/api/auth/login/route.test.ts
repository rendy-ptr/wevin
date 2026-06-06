import { ADMIN } from '@/constants/role';
import { AppError } from '@/lib/errors';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { POST } from './route';

const mockLogin = mock((email, password) => {
  if (email === 'admin@wevin.com' && password === 'password123') {
    return Promise.resolve({
      sessionUser: {
        id: 1,
        name: 'Admin Wevin',
        email: 'admin@wevin.com',
        role: ADMIN,
      },
      redirectPath: '/dashboard/admin',
    });
  }
  throw new AppError('Email atau password salah', 400);
});

mock.module('@/services/auth.service', () => ({
  authService: {
    login: mockLogin,
  },
}));

describe('POST /api/auth/login (Login)', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('can login successfully with correct credentials', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@wevin.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('User logged in successfully');
    expect(body.data.user.role).toBe(ADMIN);
    expect(body.data.redirectPath).toBe('/dashboard/admin');
    expect(mockLogin).toHaveBeenCalledWith('admin@wevin.com', 'password123');
  });

  it('validation failed if email is invalid', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.errors).toBeDefined();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('returns 400 if credentials are wrong', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@wevin.com',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Email atau password salah');
    expect(mockLogin).toHaveBeenCalledWith('wrong@wevin.com', 'wrongpassword');
  });
});
