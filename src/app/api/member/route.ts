import { AppError } from '@/lib/errors';
import { memberService } from '@/services/member.service';
import { MemberFilterParams } from '@/types/member.type';
import { createUpdateMemberSchema } from '@/validations/admin/create-update-member';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
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
    const validatedData = createUpdateMemberSchema.parse(body);
    const memberData = await memberService.create(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Member created successfully',
      data: memberData,
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
