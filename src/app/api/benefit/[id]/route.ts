import { AppError } from '@/lib/errors';
import { benefitService } from '@/services/benefit.service';
import { createUpdateBenefitSchema } from '@/validations/admin/create-update-benefit';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createUpdateBenefitSchema.parse(body);

    const benefit = await benefitService.update(Number(id), validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Benefit updated successfully',
        data: benefit,
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
    const benefit = await benefitService.delete(Number(id));

    return NextResponse.json(
      {
        success: true,
        message: 'Benefit deleted successfully',
        data: benefit,
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
