import { getSession, login } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { settingService } from '@/services/setting.service';
import { updateEmailSchema } from '@/validations/admin/create-update-setting';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const extendedSchema = updateEmailSchema.extend({
  verificationToken: z.string().optional(),
  otpCode: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    const { id } = await params;
    const body = await request.json();

    if (!session || session.user.id !== Number(id)) {
      throw new AppError('Unauthorized', 401);
    }

    const { email, verificationToken, otpCode } = extendedSchema.parse(body);

    const user = await settingService.updateEmail({
      id: Number(id),
      email,
      userId: session.user.id,
      verificationToken,
      otpCode,
    });

    await login({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      package: session.user.package,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Name and email updated successfully',
        data: user,
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
