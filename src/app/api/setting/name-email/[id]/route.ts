import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { settingService } from '@/services/setting.service';
import { updateNameAndEmailSchema } from '@/validations/admin/create-update-member';
import { NextResponse } from 'next/server';

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

    const { name, email } = updateNameAndEmailSchema.parse(body);

    const user = await settingService.updateNameAndEmail({
      id: Number(id),
      name,
      email,
      userId: session.user.id,
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
