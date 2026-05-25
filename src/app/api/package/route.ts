import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import {
  BasePackageModel,
  PackageFilterParams,
  PackageIndexItem,
} from '@/types/package.type';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data: { items: PackageIndexItem[]; total: number } | undefined;
  }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') || undefined,
      isPopular: searchParams.get('isPopular') || undefined,
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
        data: undefined,
      },
      { status },
    );
  }
}

export async function POST(request: Request): Promise<
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

    const body = await request.json();
    const parsed = createUpdatePackageSchema.safeParse(body);

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

    const { name, description, isActive, price, benefits, templateIds } =
      parsed.data;

    const packageData = await packageService.create(
      {
        name,
        description,
        isActive,
        price,
        benefits,
        templateIds,
      },
      session.user.id,
    );
    return NextResponse.json(
      {
        success: true,
        message: 'Package created successfully',
        data: packageData,
      },
      { status: 201 },
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
