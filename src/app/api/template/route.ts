import { ADMIN, MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { templateService } from '@/services/template.service';
import { NextResponse } from 'next/server';

export const GET = withAuth([ADMIN, MEMBER], async () => {
  const data = await templateService.getAll();
  return NextResponse.json({
    success: true,
    message: 'Templates fetched successfully',
    data,
  });
});
