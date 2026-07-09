
import { invitationGuestService } from '@/services/invitation-guest.service';
import { updateStatusSchema } from '@/validations/member/create-update-guest';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

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


    const result = await invitationGuestService.updateStatusByInvitationAndName(
      parsed.data.invitationId,
      parsed.data.guestName,
      parsed.data.status,
    );

    return NextResponse.json({
      success: true,
      message: 'Guest status updated successfully',
      data: result,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update status';
    const statusCode = errMessage === 'Tamu tidak ditemukan dalam daftar undangan.' ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        message: errMessage,
      },
      { status: statusCode },
    );
  }
}
