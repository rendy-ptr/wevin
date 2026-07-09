import { invitationRSVPService } from '@/services/invitation-rsvp.service';
import { NextRequest, NextResponse } from 'next/server';

import { createRSVPSchema } from '@/validations/member/create-rsvp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invitationId = Number(body.invitationId);
    const guestCount = Number(body.guestCount);

    const parsed = createRSVPSchema.safeParse({
      ...body,
      invitationId,
      guestCount,
    });

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

    const result = await invitationRSVPService.submitPublicRSVP({
      invitationId: parsed.data.invitationId,
      guestName: parsed.data.guestName,
      status: parsed.data.status,
      guestCount: parsed.data.guestCount,
      reason: parsed.data.reason,
    });

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit RSVP',
      },
      { status: 500 },
    );
  }
}
