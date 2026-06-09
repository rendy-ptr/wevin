import { NotFoundError } from '@/lib/errors';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { POST } from './route';

const mockForgotPasswordRequest = mock((email: string) => {
  if (email === 'registered@example.com') {
    return Promise.resolve({ verificationToken: 'mock-jwt-token' });
  }
  if (email === 'notfound@example.com') {
    throw new NotFoundError('Email tidak ditemukan');
  }
  throw new Error('Database error');
});

mock.module('@/services/auth.service', () => ({
  authService: {
    forgotPasswordRequest: mockForgotPasswordRequest,
  },
}));

describe('POST /api/auth/forgot-password/verify-email (Request Reset Password Link)', () => {
  beforeEach(() => {
    mockForgotPasswordRequest.mockClear();
  });

  it('sends reset password link successfully for registered email', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'registered@example.com',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe(
      'Link reset password telah dikirim ke email Anda',
    );
    expect(mockForgotPasswordRequest).toHaveBeenCalledWith(
      'registered@example.com',
    );
  });

  it('fails validation when email format is invalid', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email-format',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('Format email tidak valid');
    expect(mockForgotPasswordRequest).not.toHaveBeenCalled();
  });

  it('returns 404 error when email is not registered', async () => {
    const request = new Request(
      'http://localhost/api/auth/forgot-password/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'notfound@example.com',
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Email tidak ditemukan');
    expect(mockForgotPasswordRequest).toHaveBeenCalledWith(
      'notfound@example.com',
    );
  });
});
