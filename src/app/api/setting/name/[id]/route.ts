import { ADMIN, MEMBER } from '@/constants/role';
import { login } from '@/lib/auth';
import { withAuth } from '@/lib/with-auth';
import { settingService } from '@/services/setting.service';
import { updateNameSchema } from '@/validations/admin/create-update-setting';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = withAuth(
  [ADMIN, MEMBER],
  async (
    request: NextRequest,
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
    const parsed = updateNameSchema.safeParse(body);

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

    const user = await settingService.updateName({
      id: Number(id),
      name: parsed.data.name,
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
        message: 'Name updated successfully',
        data: user,
      },
      { status: 200 },
    );
  },
);
