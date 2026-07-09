import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { packageService } from '@/services/package.service';
import { NextResponse } from 'next/server';

export const GET = withAuth([ADMIN], async () => {
  const packages = await packageService.getActiveWithBenefits();
  return NextResponse.json({
    success: true,
    message: 'Active packages fetched successfully',
    data: packages,
  });
});
