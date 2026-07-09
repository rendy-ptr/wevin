import { invitationService } from '@/services/invitation.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Invalid Slug' },
        { status: 400 },
      );
    }

    const result = await invitationService.getPublicInvitationBySlug(slug);

    return NextResponse.json({
      success: true,
      message: 'Invitation fetched successfully',
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch invitation',
      },
      { status: 404 },
    );
  }
}
