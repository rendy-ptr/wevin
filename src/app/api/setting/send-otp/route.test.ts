import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { Mock, beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockSendOtpEmail = mock(() => Promise.resolve()) as Mock<
  (email: string, otpCode: string) => Promise<void>
>;

mock.module('@/lib/mailer', () => ({
  sendOtpEmail: mockSendOtpEmail,
}));

describe('POST /api/setting/send-otp (Send OTP)', () => {
  beforeEach(() => {
    mockSendOtpEmail.mockClear();
    mockSession = null;
  });

  const payload = {
    email: 'test@example.com',
  };

  it('admin role can request otp successfully', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/setting/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Kode OTP telah dikirim');
    expect(body.data.verificationToken).toBeDefined();

    expect(mockSendOtpEmail).toHaveBeenCalledTimes(1);
    expect(mockSendOtpEmail).toHaveBeenCalledWith(
      payload.email,
      expect.stringMatching(/^\d{6}$/),
    );
  });

  it('member role can request otp successfully', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest('http://localhost/api/setting/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Kode OTP telah dikirim');
    expect(body.data.verificationToken).toBeDefined();

    expect(mockSendOtpEmail).toHaveBeenCalledTimes(1);
    expect(mockSendOtpEmail).toHaveBeenCalledWith(
      payload.email,
      expect.stringMatching(/^\d{6}$/),
    );
  });

  it('guest cannot request otp', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/setting/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockSendOtpEmail).not.toHaveBeenCalled();
  });

  it('validation failed if email is invalid format', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const invalidPayload = {
      email: 'invalid-email',
    };
    const request = new NextRequest('http://localhost/api/setting/send-otp', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockSendOtpEmail).not.toHaveBeenCalled();
  });
});
