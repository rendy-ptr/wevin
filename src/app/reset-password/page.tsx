'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/api/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { CheckCircle2, Eye, EyeOff, Heart, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Token reset password tidak valid atau tidak ditemukan.',
      });
      return;
    }

    resetPasswordMutation.mutate(
      {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast({
            title: 'Berhasil',
            description: 'Password Anda telah berhasil diatur ulang.',
          });
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        },
        onError: (error) => {
          let message = 'Gagal mengatur ulang password.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal',
            description: message,
          });
        },
      },
    );
  };

  const toggleShowPassword = (type: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="bg-card border-border rounded-2xl border p-8 shadow-xl md:p-10">
            <Lock className="text-destructive mx-auto mb-6 h-16 w-16" />
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Token Tidak Valid
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Link reset password tidak valid, rusak, atau telah kedaluwarsa.
              Silakan ajukan permohonan baru.
            </p>
            <Button className="h-12 w-full rounded-xl" asChild>
              <Link href="/forgot-password">Minta Link Baru</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="bg-card border-border rounded-2xl border p-8 shadow-xl md:p-10">
            <CheckCircle2 className="text-primary mx-auto mb-6 h-16 w-16" />
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Password Diperbarui!
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Password Anda telah berhasil diatur ulang. Anda akan dialihkan ke
              halaman masuk dalam beberapa saat...
            </p>
            <Button
              className="h-12 w-full rounded-xl"
              onClick={() => router.push('/login')}
            >
              Masuk Sekarang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card border-border rounded-2xl border p-8 shadow-xl md:p-10">
          <div className="mb-8 text-center">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <Heart className="text-primary fill-primary h-8 w-8" />
              <span className="text-foreground font-serif text-2xl font-bold">
                {process.env.NEXT_PUBLIC_APP_ALIAS ||
                  process.env.NEXT_PUBLIC_APP_NAME ||
                  'Wevin'}
              </span>
            </Link>
            <h1 className="text-foreground mt-2 text-xl font-semibold">
              Atur Ulang Password
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Masukkan password baru Anda di bawah ini
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password Baru
              </Label>
              <div className="relative">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword.password ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('password')}
                  className="text-muted-foreground hover:text-foreground absolute top-3.5 right-3"
                  aria-label={
                    showPassword.password ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword.password ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground font-medium"
              >
                Konfirmasi Password Baru
              </Label>
              <div className="relative">
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password baru"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-10 ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirmPassword')}
                  className="text-muted-foreground hover:text-foreground absolute top-3.5 right-3"
                  aria-label={
                    showPassword.confirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs italic">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="bg-primary-dark hover:bg-primary-dark/90 h-12 w-full rounded-xl font-medium text-white transition-all duration-300"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Atur Ulang Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
