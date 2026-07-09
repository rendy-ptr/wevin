import { decrypt } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN, MEMBER } from './constants/role';

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;
  const user = session?.user;

  if (path.startsWith('/dashboard')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.nextUrl));

    if (path.startsWith('/dashboard/admin') && user.role !== ADMIN) {
      return NextResponse.redirect(new URL('/dashboard/member', req.nextUrl));
    }
    if (path.startsWith('/dashboard/member') && user.role !== MEMBER) {
      return NextResponse.redirect(new URL('/dashboard/admin', req.nextUrl));
    }
  }

  if ((path === '/login' || path === '/register') && user) {
    const dest = user.role === ADMIN ? '/dashboard/admin' : '/dashboard/member';
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
