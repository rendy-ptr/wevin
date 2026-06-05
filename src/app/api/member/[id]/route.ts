import { userStatusEnum } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { memberService } from '@/services/member.service';
import { TUserStatus } from '@/types/user.type';
import { createUpdateMemberSchema } from '@/validations/admin/create-update-member';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = createUpdateMemberSchema
      .omit({ email: true })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          data: undefined,
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    const member = await memberService.update(
      Number(id),
      parsed.data,
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Member updated successfully',
        data: member,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!userStatusEnum.enumValues.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 },
      );
    }

    const member = await memberService.updateStatus(
      Number(id),
      status as TUserStatus,
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Member status updated successfully',
        data: member,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await params;
    const member = await memberService.delete(Number(id), session.user.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Member deleted successfully',
        data: member,
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
