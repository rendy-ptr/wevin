import {
  sendAccountEmail,
  sendDeletionNotificationEmail,
  sendStatusNotificationEmail,
  sendUpdateNotificationEmail,
} from '@/lib/mailer';
import { memberRepository } from '@/repositories/member.repository';
import { packageRepository } from '@/repositories/package.repository';
import { activityService } from '@/services/activity.service';
import { MemberFilterParams } from '@/types/member.type';
import { TUserStatus } from '@/types/user.type';
import { CreateUpdateMemberFormValues } from '@/validations/admin/create-update-member';
import bcrypt from 'bcryptjs';

export const memberService = {
  getAll: async (params: MemberFilterParams) => {
    return await memberRepository.getAll(params);
  },

  create: async (payload: CreateUpdateMemberFormValues, userId?: number) => {
    const plainPassword = Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = await memberRepository.create({
      ...payload,
      password: hashedPassword,
    });
    const pkg = await packageRepository.getById(payload.packageId);

    await sendAccountEmail(
      newUser.email,
      newUser.name,
      plainPassword,
      pkg?.name || 'No Package',
    );

    if (userId) {
      await activityService.log({
        userId,
        action: 'CREATE',
        entityType: 'MEMBER',
        entityId: newUser.id,
        details: `Menambahkan member baru: ${newUser.name} (${newUser.email})`,
      });
    }

    return newUser;
  },

  update: async (
    id: number,
    payload: Omit<CreateUpdateMemberFormValues, 'email'>,
    userId?: number,
  ) => {
    const pkg = await packageRepository.getById(payload.packageId);
    const updatedUser = await memberRepository.update(id, payload);
    await sendUpdateNotificationEmail(
      updatedUser.email,
      updatedUser.name,
      pkg?.name || 'No Package',
    );
    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Memperbarui data member: ${updatedUser.name}`,
      });
    }

    return updatedUser;
  },

  delete: async (id: number, userId?: number) => {
    const deletedUser = await memberRepository.delete(id);
    await sendDeletionNotificationEmail(deletedUser.email, deletedUser.name);
    if (userId) {
      await activityService.log({
        userId,
        action: 'DELETE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Menghapus member: ${deletedUser.name} (${deletedUser.email})`,
      });
    }

    return deletedUser;
  },

  updateStatus: async (id: number, status: TUserStatus, userId?: number) => {
    const updatedUser = await memberRepository.updateStatus(id, status);
    await sendStatusNotificationEmail(
      updatedUser.email,
      updatedUser.name,
      status,
    );
    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: id,
        details: `Mengubah status member ${updatedUser.name} menjadi ${status}`,
      });
    }

    return updatedUser;
  },
};
