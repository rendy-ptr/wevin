import { BenefitType } from '@/constants/benefits';
import { AppError } from '@/lib/errors';
import { benefitService } from '@/services/benefit.service';
import { createUpdateBenefitSchema } from '@/validations/admin/create-update-benefit';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const type = (searchParams.get('type') as BenefitType) || undefined;

    const benefits = await benefitService.getAll(search, type);
    return NextResponse.json({
      success: true,
      message: 'Benefits fetched successfully',
      data: benefits,
    });
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createUpdateBenefitSchema.parse(body);
    const { name, description, key, type } = validatedData;

    const benefit = await benefitService.create({
      name,
      description,
      key,
      type,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Benefit created successfully',
        data: benefit,
      },
      { status: 201 },
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
