import { USER_ROLE_VALUES } from '@/db/schema';
import { TUserRole } from '@/types/user.type';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: TUserRole;
}

interface Session extends JWTPayload {
  user: SessionUser;
  expires: string;
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'configure-your-jwt-secret-key',
);

export async function encrypt(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
}

export async function decrypt(input: string): Promise<Session> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ['HS256'],
  });
  return payload as Session;
}

export async function login(user: SessionUser) {
  const expiresDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({
    user,
    expires: expiresDate.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    expires: expiresDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function requireAuth(role?: TUserRole) {
  const session = await getSession();

  if (!session) redirect('/login');
  if (role && session.user.role !== role) {
    redirect(
      getRedirectPath(
        session.user.role === USER_ROLE_VALUES.ADMIN
          ? USER_ROLE_VALUES.MEMBER
          : USER_ROLE_VALUES.ADMIN,
      ),
    );
  }

  return session;
}

export function getRedirectPath(role: TUserRole): string {
  return role === USER_ROLE_VALUES.ADMIN
    ? '/dashboard/admin'
    : '/dashboard/member';
}
