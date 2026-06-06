import { ADMIN, MEMBER } from '@/constants/role';
import { login } from '@/lib/auth';
import { withAuth } from '@/lib/with-auth';
import { settingService } from '@/services/setting.service';
import { updateEmailSchema } from '@/validations/admin/create-update-setting';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const extendedSchema = updateEmailSchema.extend({
  verificationToken: z.string().optional(),
  otpCode: z.string().optional(),
});

export const PATCH = withAuth(
  [ADMIN, MEMBER],
  async (
    request: Request,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();

    const parsed = extendedSchema.safeParse(body);

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

    const user = await settingService.updateEmail({
      id: Number(id),
      email: parsed.data.email,
      verificationToken: parsed.data.verificationToken,
      otpCode: parsed.data.otpCode,
    });

    await login({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      package: session.user.package,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email updated successfully',
        data: user,
      },
      { status: 200 },
    );
  },
);
