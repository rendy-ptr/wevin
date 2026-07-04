import { MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { invitationService } from '@/services/invitation.service';
import { createInvitationSchema } from '@/validations/member/create-update-invitation';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(
  [MEMBER],
  async (
    _request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 },
      );
    }

    const result = await invitationService.getInvitationById(
      Number(id),
      session.user.id,
    );

    return NextResponse.json({
      success: true,
      message: 'Invitation fetched successfully',
      data: result,
    });
  },
);

export const PUT = withAuth(
  [MEMBER],
  async (
    request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 },
      );
    }

    const body = await request.json();

    const parsed = createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const result = await invitationService.updateInvitation(
      Number(id),
      session.user.id,
      parsed.data,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Invitation updated successfully',
        data: result,
      },
      { status: 200 },
    );
  },
);

export const DELETE = withAuth(
  [MEMBER],
  async (
    _request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 },
      );
    }

    const invitationData = await invitationService.deleteInvitation(
      Number(id),
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Invitation deleted successfully',
        data: invitationData,
      },
      { status: 200 },
    );
  },
);
