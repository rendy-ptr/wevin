import { AppError } from '@/lib/errors';
import { authService } from '@/services/auth.service';
import { resetPasswordWithTokenSchema } from '@/validations/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordWithTokenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const { token, password, confirmPassword } = parsed.data;

    await authService.resetPassword({
      token,
      password,
      confirmPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password berhasil diatur ulang',
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
