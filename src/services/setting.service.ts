import { BusinessError } from '@/lib/errors';
import {
  sendUpdateEmailNotificationEmail,
  sendUpdateNameNotificationEmail,
  sendUpdatePasswordNotificationEmail,
} from '@/lib/mailer';
import { settingRepository } from '@/repositories/setting.repository';
import { ActivityFilterParams } from '@/types/activity.type';
import { TUser } from '@/types/user.type';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { activityService } from './activity.service';

export const settingService = {
  getSessionUser: async (id: number) => {
    const user = await settingRepository.getSessionUser(id);
    if (!user) {
      throw new BusinessError('User not found');
    }
    return user;
  },

  updatePassword: async ({
    id,
    oldPassword,
    newPassword,
    userId,
  }: Pick<TUser, 'id'> & {
    oldPassword: string;
    newPassword: string;
    userId: number;
  }) => {
    const user = await settingRepository.getSessionUser(id);
    if (!user) {
      throw new BusinessError('User not found');
    }

    const passwordUser = await settingRepository.getPassword(user.id);
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      passwordUser?.password || '',
    );
    if (!isPasswordValid) {
      throw new BusinessError('Old Password Not Valid');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await settingRepository.updatePassword({
      id,
      password: hashedPassword,
    });

    await sendUpdatePasswordNotificationEmail({
      email: user.email,
      name: user.name,
    });

    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Memperbarui Password`,
      });
    }

    return user;
  },

  updateEmail: async ({
    id,
    email,
    userId,
    verificationToken,
    otpCode,
  }: Pick<TUser, 'id' | 'email'> & {
    userId: number;
    verificationToken: string | undefined;
    otpCode: string | undefined;
  }) => {
    if (!verificationToken || !otpCode) {
      throw new BusinessError('Email verification code is required');
    }

    try {
      const { payload } = await jwtVerify(
        verificationToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
        {
          algorithms: ['HS256'],
        },
      );
      if (payload.otpCode !== otpCode || payload.email !== email) {
        throw new BusinessError('Kode OTP tidak valid atau salah');
      }
    } catch (error) {
      if (error instanceof BusinessError) throw error;
      throw new BusinessError('Kode OTP kedaluwarsa atau tidak valid');
    }

    const user = await settingRepository.updateEmail({
      id,
      email,
    });
    if (!user) {
      throw new BusinessError('User not found');
    }

    await sendUpdateEmailNotificationEmail({
      email: user.email,
      name: user.name,
    });

    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Memperbarui Email`,
      });
    }
    return user;
  },

  updateName: async ({
    id,
    name,
    userId,
  }: Pick<TUser, 'id' | 'name'> & {
    userId: number;
  }) => {
    const updatedUser = await settingRepository.updateName({
      id,
      name,
    });
    if (!updatedUser) {
      throw new BusinessError('User not found');
    }

    await sendUpdateNameNotificationEmail({
      email: updatedUser.email,
      name: updatedUser.name,
    });

    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Memperbarui Nama`,
      });
    }

    return updatedUser;
  },

  getAllActivityLogs: async (params: ActivityFilterParams) => {
    return await settingRepository.getAllActivityLogs(params);
  },
};
