import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { activityService } from '@/services/activity.service';
import { ActivityFilterParams } from '@/types/activity.type';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([ADMIN], async (request: NextRequest) => {
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

  const data = await activityService.getAll(filters);
  return NextResponse.json({
    success: true,
    message: 'Activities fetched successfully',
    data: data,
  });
});
