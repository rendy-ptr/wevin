import { decrypt } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function authMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (path.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (session) {
    if (path.startsWith('/dashboard/admin') && session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/member', req.nextUrl));
    }

    if (path === '/login') {
      const dest =
        session.user.role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/member';
      return NextResponse.redirect(new URL(dest, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
