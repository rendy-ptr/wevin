import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { memberService } from '@/services/member.service';
import { MemberFilterParams } from '@/types/member.type';
import { createUpdateMemberSchema } from '@/validations/admin/create-update-member';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([ADMIN], async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const packageIdRaw = searchParams.get('packageId');
  const filters = {
    search: searchParams.get('search') || undefined,
    packageId:
      packageIdRaw && !isNaN(Number(packageIdRaw))
        ? Number(packageIdRaw)
        : undefined,
    status: searchParams.get('status') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  } as MemberFilterParams;

  const memberData = await memberService.getAll(filters);
  return NextResponse.json({
    success: true,
    message: 'Members fetched successfully',
    data: memberData,
  });
});

export const POST = withAuth([ADMIN], async (request: NextRequest, session) => {
  const body = await request.json();
  const parsed = createUpdateMemberSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        data: undefined,
        errors: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const memberData = await memberService.create(parsed.data, session.user.id);
  return NextResponse.json({
    success: true,
    message: 'Member created successfully',
    data: memberData,
  });
});
