import { MEMBER } from '@/constants/role';
import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { withAuth } from '@/lib/with-auth';
import { invitationService } from '@/services/invitation.service';
import { createInvitationSchema } from '@/validations/member/create-update-invitation';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([MEMBER], async (request: NextRequest, session) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as InvitationStatusEnum | undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const result = await invitationService.getAllInvitations(session.user.id, {
    search,
    status,
    page,
    limit,
  });

  return NextResponse.json({
    success: true,
    message: 'Invitations fetched successfully',
    data: result,
  });
});

export const POST = withAuth(
  [MEMBER],
  async (request: NextRequest, session) => {
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

    const result = await invitationService.createInvitation(
      session.user.id,
      parsed.data,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Invitation created successfully',
        data: result,
      },
      { status: 201 },
    );
  },
);
