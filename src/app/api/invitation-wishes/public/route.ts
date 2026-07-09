import { invitationWishesService } from '@/services/invitation-wishes.service';
import { NextRequest, NextResponse } from 'next/server';

import { createWishSchema } from '@/validations/member/create-wish';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createWishSchema.safeParse({
      ...body,
      invitationId: Number(body.invitationId),
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

    const result = await invitationWishesService.submitPublicWish({
      invitationId: parsed.data.invitationId,
      guestName: parsed.data.guestName,
      message: parsed.data.message,
    });

    return NextResponse.json({
      success: true,
      message: 'Wish submitted successfully',
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit wish',
      },
      { status: 500 },
    );
  }
}
