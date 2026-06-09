import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Format email tidak valid'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
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
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordWithTokenSchema = resetPasswordSchema.extend({
  token: z.string(),
});

export type ResetPasswordWithTokenFormValues = z.infer<
  typeof resetPasswordWithTokenSchema
>;
