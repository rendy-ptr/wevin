import { ADMIN, MEMBER } from '@/constants/role';
import { sendOtpEmail } from '@/lib/mailer';
import { withAuth } from '@/lib/with-auth';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sendOtpSchema = z.object({
  email: z.email('Format email tidak valid'),
});

export const POST = withAuth([ADMIN, MEMBER], async (request: NextRequest) => {
  const body = await request.json();
  const parsed = sendOtpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        data: undefined,
        errors: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await sendOtpEmail(parsed.data.email, otpCode);
  console.log(`[SIMULATED EMAIL] OTP for ${parsed.data.email} is: ${otpCode}`);

  const verificationToken = await new SignJWT({
    email: parsed.data.email,
    otpCode,
  })
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
});
