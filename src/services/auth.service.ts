import { getRedirectPath, login, logout } from '@/lib/auth';
import { AuthError, NotFoundError } from '@/lib/errors';
import { authRepository } from '@/repositories/auth.repository';
import bcrypt from 'bcryptjs';
import { activityService } from './activity.service';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    const redirectPath = getRedirectPath(user.role);

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      package: user.profile?.package
        ? {
            id: user.profile.package.id,
            name: user.profile.package.name,
            benefits: user.profile.package.benefits.map((b) => ({
              benefitKey: b.benefitKey,
              toggleValue: b.toggleValue,
              quotaValue: b.quotaValue,
            })),
            templateIds: user.profile.package.templates.map(
              (t) => t.templateId,
            ),
          }
        : null,
    };

    await login(sessionUser);

    await activityService.log({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'AUTH',
      details: `${user.name} berhasil login.`,
    });

    return { sessionUser, redirectPath };
  },

  logout: async (userId?: number) => {
    await logout();

    if (userId) {
      await activityService.log({
        userId,
        action: 'LOGOUT',
        entityType: 'AUTH',
        details: `Berhasil logout.`,
      });
    }
    return { success: true };
  },
};
