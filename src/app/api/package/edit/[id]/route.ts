import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import { PackageWithRelationships } from '@/types/package.type';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data: PackageWithRelationships | undefined;
  }>
> {
  try {
    const { id } = await params;
    const packageData = await packageService.getWithRelationships(Number(id));

    return NextResponse.json(
      {
        success: true,
        message: 'Package fetched successfully',
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
