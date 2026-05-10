'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/api/use-auth';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, type LoginFormValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        toast({
          title: 'Login berhasil',
          variant: 'default',
          description: `Selamat datang kembali, ${res.data.user.name}!`,
        });

        router.push(res.data.redirectPath);
      },
      onError: (error) => {
        let message = 'Gagal login. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message =
            error.response?.data?.message || 'Email atau password salah';
        }
        toast({
          variant: 'destructive',
          title: 'Gagal login',
          description: message,
        });
      },
    });
  };

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
                  'Configure on ENV'}
              </span>
            </Link>
            <p className="text-muted-foreground">Masuk ke dashboard Anda</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="nama@email.com"
                className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl ${
                  errors.email ? 'border-destructive' : ''
                }`}
              />
              {errors.email && (
                <p className="text-destructive text-xs italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary-dark text-sm transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
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

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="bg-primary-dark hover:bg-primary-dark/90 h-12 w-full rounded-xl text-lg font-medium text-white transition-all duration-300"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card text-muted-foreground px-4">atau</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-3 text-sm">
              Belum punya akun?
            </p>
            <Button
              variant="outline"
              asChild
              className="border-border hover:bg-secondary h-12 w-full rounded-xl"
            >
              <Link href="/#pricing">Hubungi Admin untuk Mendaftar</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
