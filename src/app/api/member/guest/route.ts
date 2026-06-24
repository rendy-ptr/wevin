import { MEMBER } from '@/constants/role';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { withAuth } from '@/lib/with-auth';
import { invitationGuestService } from '@/services/invitation-guest.service';
import { GuestFilterParams } from '@/types/guest.type';
import { createUpdateInvitationGuestSchema } from '@/validations/member/create-update-guest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = withAuth([MEMBER], async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const filters: GuestFilterParams = {
    search: searchParams.get('search') || undefined,
    invitationId:
      searchParams.get('invitationId') &&
      !isNaN(Number(searchParams.get('invitationId')))
        ? Number(searchParams.get('invitationId'))
        : undefined,
    status: (searchParams.get('status') as GuestStatusEnum) || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  };

  const guestData = await invitationGuestService.getAll(filters);

  return NextResponse.json({
    success: true,
    message: 'Guests fetched successfully',
    data: guestData,
  });
});

export const POST = withAuth(
  [MEMBER],
  async (request: NextRequest, session) => {
    const body = await request.json();

    if (Array.isArray(body)) {
      const parsedArray = z
        .array(createUpdateInvitationGuestSchema)
        .safeParse(body);
      if (!parsedArray.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed for bulk insert',
            errors: parsedArray.error.issues,
          },
          { status: 400 },
        );
      }
      const guestData = await invitationGuestService.createMany(
        parsedArray.data,
        session.user.id,
      );
      return NextResponse.json({
        success: true,
        message: 'Guests created successfully',
        data: guestData,
      });
    }

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

    const guestData = await invitationGuestService.create(
      parsed.data,
      session.user.id,
    );
    return NextResponse.json({
      success: true,
      message: 'Guest created successfully',
      data: guestData,
    });
  },
);
