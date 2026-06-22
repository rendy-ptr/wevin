import { z } from 'zod';

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama minimal 1 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z ]+$/, 'Nama hanya boleh mengandung huruf'),
});

export type UpdateNameFormValues = z.infer<typeof updateNameSchema>;

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

export const updateEmailSchema = z.object({
  email: z.email('Email tidak valid'),
});

export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
