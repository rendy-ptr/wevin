import { AppError } from '@/lib/errors';
import { settingService } from '@/services/setting.service';
import { ActivityFilterParams } from '@/types/activity.type';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      userId: searchParams.get('userId')
        ? parseInt(searchParams.get('userId')!)
        : undefined,
      search: searchParams.get('search') || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
      action: searchParams.get('action') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    } as ActivityFilterParams;

    const data = await settingService.getAllActivityLogs(filters);
    return NextResponse.json({
      success: true,
      message: 'Activities Setting fetched successfully',
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
