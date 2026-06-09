import { getRedirectPath, login, logout } from '@/lib/auth';
import { AuthError, BusinessError, NotFoundError } from '@/lib/errors';
import {
  sendResetPasswordLinkEmail,
  sendUpdatePasswordNotificationEmail,
} from '@/lib/mailer';
import { authRepository } from '@/repositories/auth.repository';
import { settingRepository } from '@/repositories/setting.repository';
import { ResetPasswordWithTokenFormValues } from '@/validations/auth';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
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
      createdAt: user.createdAt,
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
    return {
      success: true,
      message: 'User logged out successfully',
      data: null,
    };
  },

  forgotPasswordRequest: async (email: string) => {
    const user = await authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError('Email tidak ditemukan');
    }

    const verificationToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${verificationToken}`;

    await sendResetPasswordLinkEmail(email, resetLink);
    console.log(`[FORGOT PASSWORD] Reset link for ${email} is: ${resetLink}`);

    return { verificationToken };
  },

  resetPassword: async ({
    token,
    password,
  }: ResetPasswordWithTokenFormValues) => {
    let email: string;
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET),
        {
          algorithms: ['HS256'],
        },
      );
      email = payload.email as string;
    } catch {
      throw new BusinessError(
        'Token reset password kedaluwarsa atau tidak valid',
      );
    }

    const user = await authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await settingRepository.updatePassword({
      id: user.id,
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BusinessError('Gagal memperbarui password');
    }

    await sendUpdatePasswordNotificationEmail({
      email: updatedUser.email,
      name: updatedUser.name,
    });

    await activityService.log({
      userId: user.id,
      action: 'UPDATE',
      entityType: 'AUTH',
      details: `Mengatur ulang password melalui Lupa Password.`,
    });

    return updatedUser;
  },
};
