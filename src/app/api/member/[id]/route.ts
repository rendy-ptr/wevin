import { userStatusEnum } from '@/db/schema';
import { AppError } from '@/lib/errors';
import { memberService } from '@/services/member.service';
import { TUserStatus } from '@/types/user.type';
import { createUpdateMemberSchema } from '@/validations/admin/create-update-member';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createUpdateMemberSchema
      .omit({ email: true })
      .parse(body);

    const member = await memberService.update(Number(id), validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Member updated successfully',
        data: member,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.issues,
        },
        { status: 400 },
      );
    }
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
    const { id } = await params;
    const member = await memberService.delete(Number(id));

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
