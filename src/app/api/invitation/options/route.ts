import { MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { invitationService } from '@/services/invitation.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([MEMBER], async (request: NextRequest, session) => {
  const items = await invitationService.getInvitationOptions(session.user.id);

  return NextResponse.json({
    success: true,
    message: 'Invitation options fetched successfully',
    data: items,
  });
});
