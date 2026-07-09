import { MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { invitationGuestService } from '@/services/invitation-guest.service';
import { createUpdateInvitationGuestSchema } from '@/validations/member/create-update-guest';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = withAuth(
  [MEMBER],
  async (
    request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await params;
      const guestId = Number(id);

      if (isNaN(guestId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid ID' },
          { status: 400 },
        );
      }

      const body = await request.json();
      const parsed = createUpdateInvitationGuestSchema.safeParse(body);

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

      const updatedGuest = await invitationGuestService.update(
        guestId,
        parsed.data,
        session.user.id,
      );

      return NextResponse.json({
        success: true,
        message: 'Guest updated successfully',
        data: updatedGuest,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: (error as Error).message },
        { status: 404 },
      );
    }
  },
);

export const DELETE = withAuth(
  [MEMBER],
  async (
    _request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await params;
      const guestId = Number(id);

      if (isNaN(guestId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid ID' },
          { status: 400 },
        );
      }

      await invitationGuestService.delete(guestId, session.user.id);

      return NextResponse.json({
        success: true,
        message: 'Guest deleted successfully',
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: (error as Error).message },
        { status: 404 },
      );
    }
  },
);
