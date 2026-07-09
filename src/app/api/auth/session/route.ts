import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: 'User is not authenticated',
        user: null,
      },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: 'User is authenticated',
      user: session.user,
    },
    { status: 200 },
  );
}
