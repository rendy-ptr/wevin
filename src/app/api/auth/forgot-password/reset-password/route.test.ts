import { BusinessError } from '@/lib/errors';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { POST } from './route';

const mockResetPassword = mock(({ token }) => {
  if (token === 'valid-token') {
    return Promise.resolve({ id: 1, email: 'user@example.com' });
  }
  if (token === 'expired-token') {
    throw new BusinessError(
      'Token reset password kedaluwarsa atau tidak valid',
    );
  }
  throw new Error('Database error');
});

mock.module('@/services/auth.service', () => ({
  authService: {
    resetPassword: mockResetPassword,
  },
}));

describe('POST /api/auth/forgot-password/reset-password (Reset Password)', () => {
  beforeEach(() => {
    mockResetPassword.mockClear();
  });

  it('resets password successfully with valid token and matching passwords', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          password: 'newpassword123',
          confirmPassword: 'newpassword123',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Password berhasil diatur ulang');
    expect(mockResetPassword).toHaveBeenCalledWith({
      token: 'valid-token',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    });
  });

  it('fails validation when passwords do not match', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          password: 'newpassword123',
          confirmPassword: 'differentpassword',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('fails validation when token is missing', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          password: 'newpassword123',
          confirmPassword: 'newpassword123',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('returns error when token is expired or invalid', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          token: 'expired-token',
          password: 'newpassword123',
          confirmPassword: 'newpassword123',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.message).toBe(
      'Token reset password kedaluwarsa atau tidak valid',
    );
    expect(mockResetPassword).toHaveBeenCalledWith({
      token: 'expired-token',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    });
  });
});
