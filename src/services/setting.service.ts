import { BusinessError } from '@/lib/errors';
import {
  sendUpdateEmailNotificationEmail,
  sendUpdateNameNotificationEmail,
  sendUpdatePasswordNotificationEmail,
} from '@/lib/mailer';
import { settingRepository } from '@/repositories/setting.repository';
import { ActivityFilterParams } from '@/types/activity.type';
import { BaseUserModel } from '@/types/user.type';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { activityService } from './activity.service';

export const settingService = {
  updatePassword: async ({
    id,
    oldPassword,
    newPassword,
  }: Pick<BaseUserModel, 'id'> & {
    oldPassword: string;
    newPassword: string;
  }) => {
    const passwordUser = await settingRepository.getPassword(id);
    if (!passwordUser) {
      throw new BusinessError('Password user not found');
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      passwordUser.password,
    );

    if (!isPasswordValid) {
      throw new BusinessError('Old Password Not Valid');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedPassword = await settingRepository.updatePassword({
      id,
      password: hashedPassword,
    });

    if (!updatedPassword) {
      throw new BusinessError('Failed to update password');
    }

    await sendUpdatePasswordNotificationEmail({
      email: updatedPassword.email,
      name: updatedPassword.name,
    });

    await activityService.log({
      userId: updatedPassword.id,
      action: 'UPDATE',
      entityType: 'MEMBER',
      entityId: id,
      details: `Memperbarui Password`,
    });

    return updatedPassword;
  },

  updateEmail: async ({
    id,
    email,
    verificationToken,
    otpCode,
  }: Pick<BaseUserModel, 'id' | 'email'> & {
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

    const updatedEmail = await settingRepository.updateEmail({
      id,
      email,
    });

    if (!updatedEmail) {
      throw new BusinessError('Failed to update email');
    }

    await sendUpdateEmailNotificationEmail({
      email: updatedEmail.email,
      name: updatedEmail.name,
    });

    await activityService.log({
      userId: updatedEmail.id,
      action: 'UPDATE',
      entityType: 'MEMBER',
      entityId: id,
      details: `Memperbarui Email`,
    });
    return updatedEmail;
  },

  updateName: async ({ id, name }: Pick<BaseUserModel, 'id' | 'name'>) => {
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

    await activityService.log({
      userId: updatedUser.id,
      action: 'UPDATE',
      entityType: 'MEMBER',
      entityId: id,
      details: `Memperbarui Nama`,
    });

    return updatedUser;
  },

  getSettingActivityLogs: async (
    params: ActivityFilterParams,
    userId: number,
  ) => {
    return await settingRepository.getSettingActivityLogs(params, userId);
  },
};
