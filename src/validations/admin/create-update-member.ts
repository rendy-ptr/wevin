import { z } from 'zod';

export const createUpdateMemberSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z.email('Email tidak valid'),
  packageId: z.number().int().positive('Paket harus dipilih'),
});

export type CreateUpdateMemberFormValues = z.infer<
  typeof createUpdateMemberSchema
>;

export const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter')
      .regex(/[a-zA-Z]/, 'Password harus mengandung huruf'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter')
      .regex(/[a-zA-Z]/, 'Password harus mengandung huruf'),
    confirmPassword: z
      .string()
      .min(8, 'Konfirmasi password minimal 8 karakter')
      .max(100, 'Konfirmasi password maksimal 100 karakter')
      .regex(/[a-zA-Z]/, 'Konfirmasi password harus mengandung huruf'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password !== data.oldPassword, {
    message: 'Password baru tidak boleh sama dengan password lama',
    path: ['password'],
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export const updateNameAndEmailSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z.email('Email tidak valid'),
});

export type UpdateNameAndEmailFormValues = z.infer<
  typeof updateNameAndEmailSchema
>;
