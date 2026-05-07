import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createUpdatePackageSchema.parse(body);

    const packageData = await packageService.update(Number(id), validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Package updated successfully',
        data: packageData,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const packageData = await packageService.delete(Number(id));

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
        data: null,
      },
      { status },
    );
  }
}
