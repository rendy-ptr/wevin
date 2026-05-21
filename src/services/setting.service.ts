import { BusinessError } from '@/lib/errors';
import {
  sendUpdateNameAndEmailNotificationEmail,
  sendUpdatePasswordNotificationEmail,
} from '@/lib/mailer';
import { settingRepository } from '@/repositories/setting.repository';
import { ActivityFilterParams } from '@/types/activity.type';
import { TUser } from '@/types/user.type';
import bcrypt from 'bcryptjs';
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

  updateNameAndEmail: async ({
    id,
    name,
    email,
    userId,
  }: Pick<TUser, 'id' | 'name' | 'email'> & { userId: number }) => {
    const user = await settingRepository.updateNameAndEmail({
      id,
      name,
      email,
    });
    if (!user) {
      throw new BusinessError('User not found');
    }

    await sendUpdateNameAndEmailNotificationEmail({
      email: user.email,
      name: user.name,
    });

    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Memperbarui Nama dan Email`,
      });
    }
    return user;
  },

  getAllActivityLogs: async (params: ActivityFilterParams) => {
    return await settingRepository.getAllActivityLogs(params);
  },
};
