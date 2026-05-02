import { AppError } from '@/lib/errors';
import { authService } from '@/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await authService.logout();

    return NextResponse.json(
      {
        success: true,
        message: 'User logged out successfully',
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
