import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { sendOtpEmail } from '@/lib/mailer';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const sendOtpSchema = z.object({
  email: z.email('Format email tidak valid'),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await request.json();
    const { email } = sendOtpSchema.parse(body);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOtpEmail(email, otpCode);
    console.log(`[SIMULATED EMAIL] OTP for ${email} is: ${otpCode}`);

    const verificationToken = await new SignJWT({ email, otpCode })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    return NextResponse.json(
      {
        success: true,
        message: 'Kode OTP telah dikirim',
        data: { verificationToken },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const isAppError = error instanceof AppError;
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const status = isAppError ? error.statusCode : 500;

    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      { status },
    );
  }
}
