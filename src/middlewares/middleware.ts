import { decrypt } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
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

    if (
      path.startsWith('/dashboard/member') &&
      session.user.role !== 'member'
    ) {
      return NextResponse.redirect(new URL('/dashboard/admin', req.nextUrl));
    }

    if (path === '/login' || path === '/register') {
      const redirectPath =
        session.user.role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/member';
      return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
