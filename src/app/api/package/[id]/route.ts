import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import { BasePackageModel } from '@/types/package.type';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data: BasePackageModel | undefined;
  }>
> {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = createUpdatePackageSchema.safeParse(body);

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

    const packageData = await packageService.update(
      Number(id),
      parsed.data,
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Package updated successfully',
        data: packageData,
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
        data: undefined,
      },
      { status },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data: BasePackageModel | undefined;
  }>
> {
  try {
    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await params;
    const packageData = await packageService.delete(
      Number(id),
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Package deleted successfully',
        data: packageData,
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
        data: undefined,
      },
      { status },
    );
  }
}
