import { ADMIN, MEMBER } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { authService } from '@/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withAuth(
  [ADMIN, MEMBER],
  async (_request: NextRequest, session) => {
    const result = await authService.logout(session.user.id);

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: result.data,
      },
      { status: 200 },
    );
  },
);
