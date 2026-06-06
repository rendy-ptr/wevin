import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { memberService } from '@/services/member.service';
import {
  createUpdateMemberSchema,
  updateMemberStatusSchema,
} from '@/validations/admin/create-update-member';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = withAuth(
  [ADMIN],
  async (
    request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();

    const parsed = createUpdateMemberSchema
      .omit({ email: true })
      .safeParse(body);

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

    const member = await memberService.update(
      Number(id),
      parsed.data,
      session.user.id,
    );

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  },
);

export const PATCH = withAuth(
  [ADMIN],
  async (
    request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();

    const parsed = updateMemberStatusSchema.safeParse(body);

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

    const member = await memberService.updateStatus(
      Number(id),
      parsed.data.status,
      session.user.id,
    );

    return NextResponse.json({
      success: true,
      message: 'Member status updated successfully',
      data: member,
    });
  },
);

export const DELETE = withAuth(
  [ADMIN],
  async (
    _request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const member = await memberService.delete(Number(id), session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
      data: member,
    });
  },
);
