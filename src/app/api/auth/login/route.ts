import { AppError } from '@/lib/errors';
import { authService } from '@/services/auth.service';
import { loginSchema } from '@/validations/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

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

    const { sessionUser, redirectPath } = await authService.login(
      parsed.data.email,
      parsed.data.password,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User logged in successfully',
        data: { user: sessionUser, redirectPath },
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
