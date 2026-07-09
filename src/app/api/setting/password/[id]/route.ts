import { ADMIN, MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { settingService } from '@/services/setting.service';
import { updatePasswordSchema } from '@/validations/admin/create-update-setting';
import { NextResponse } from 'next/server';

export const PATCH = withAuth(
  [ADMIN, MEMBER],
  async (
    request: Request,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 },
      );
    }

    const body = await request.json();

    const parsed = updatePasswordSchema.safeParse(body);

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

    const user = await settingService.updatePassword({
      id: Number(id),
      oldPassword: parsed.data.oldPassword,
      newPassword: parsed.data.password,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully',
        data: user,
      },
      { status: 200 },
    );
  },
);
