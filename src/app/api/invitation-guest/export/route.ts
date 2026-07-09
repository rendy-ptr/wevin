import { MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { invitationGuestService } from '@/services/invitation-guest.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([MEMBER], async (request: NextRequest, session) => {
  const data = await invitationGuestService.export(session.user.id);

  return NextResponse.json({
    success: true,
    message: 'Guests exported successfully',
    data,
  });
});
