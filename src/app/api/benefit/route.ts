import { AppError } from '@/lib/errors';
import { benefitService } from '@/services/benefit.service';
import { BenefitFilterParams } from '@/types/benefit.type';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    } as BenefitFilterParams;

    const data = await benefitService.getAll(filters);
    return NextResponse.json({
      success: true,
      message: 'Benefits fetched successfully',
      data: data,
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
