import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import { PackageFilterParams } from '@/types/package.type';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    } as PackageFilterParams;

    const packageData = await packageService.getAll(filters);
    return NextResponse.json({
      success: true,
      message: 'Packages fetched successfully',
      data: packageData,
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
    const validatedData = createUpdatePackageSchema.parse(body);
    const { name, description, isActive, price, benefits } = validatedData;

    const packageData = await packageService.create({
      name,
      description,
      isActive,
      price,
      benefits,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Package created successfully',
        data: packageData,
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
