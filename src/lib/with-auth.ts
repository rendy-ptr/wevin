import { ADMIN, MEMBER } from '@/constants/role';
import { getSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { SessionUser } from '@/types/session.type';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler<T extends unknown[]> = (
  request: NextRequest,
  session: { user: SessionUser },
  ...args: T
) => Promise<Response> | Response;

export function withAuth<T extends unknown[]>(
  roles: (typeof ADMIN | typeof MEMBER)[],
  handler: RouteHandler<T>,
) {
  return async (request: NextRequest, ...args: T) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new AppError('Unauthorized', 401);
      }

      if (roles.length > 0 && !roles.includes(session.user.role)) {
        throw new AppError('Forbidden', 403);
      }

      return await handler(request, session as { user: SessionUser }, ...args);
    } catch (error: unknown) {
      const isAppError = error instanceof AppError;
      const message =
        error instanceof Error ? error.message : 'Internal Server Error';
      const status = isAppError ? error.statusCode : 500;

      return NextResponse.json(
        {
          success: false,
          message,
          data: null,
        },
        { status },
      );
    }
  };
}
