import { ADMIN, MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { settingService } from '@/services/setting.service';
import { ActivityFilterParams } from '@/types/activity.type';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(
  [ADMIN, MEMBER],
  async (request: NextRequest, session) => {
    const { searchParams } = new URL(request.url);
    const filters = {
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

    const data = await settingService.getSettingActivityLogs(
      filters,
      session.user.id,
    );
    return NextResponse.json({
      success: true,
      message: 'Setting activity logs fetched successfully',
      data: data,
    });
  },
);
