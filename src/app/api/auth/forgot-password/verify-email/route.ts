import { AppError } from '@/lib/errors';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema } from '@/validations/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Format email tidak valid',
        },
        { status: 400 },
      );
    }

    await authService.forgotPasswordRequest(parsed.data.email);
    return NextResponse.json(
      {
        success: true,
        message: 'Link reset password telah dikirim ke email Anda',
        data: null,
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
