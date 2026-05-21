import { getSession } from '@/lib/auth';
import { settingService } from '@/services/setting.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not authenticated',
          data: null,
        },
        { status: 401 },
      );
    }

    const user = await settingService.getSessionUser(session.user.id);
    return NextResponse.json({
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
