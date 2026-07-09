'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '@/hooks/api/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { ArrowLeft, Heart, Loader2, MailOpen } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const {
    mutate: forgotPasswordMutation,
    isSuccess: isForgotPasswordSuccess,
    isPending: isForgotPasswordPending,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (payload: ForgotPasswordFormValues) => {
    forgotPasswordMutation(payload, {
      onSuccess: () => {
        toast({
          title: 'Email Terkirim',
          description: 'Link untuk mengatur ulang password telah dikirim.',
        });
      },
      onError: (error) => {
        let message = 'Gagal mengirim link. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal mengirim link',
          description: message,
        });
      },
    });
  };

  if (isForgotPasswordSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="bg-card border-border rounded-2xl border p-8 shadow-xl md:p-10">
            <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <MailOpen className="h-8 w-8 animate-pulse" />
            </div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Cek Email Anda
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Kami telah mengirimkan link untuk mengatur ulang password ke email
              Anda. Silakan ikuti tautan tersebut untuk menyelesaikan proses
              ini.
            </p>
            <Button
              className="bg-primary-dark hover:bg-primary-dark/90 h-12 w-full rounded-xl font-medium text-white transition-all duration-300"
              asChild
            >
              <Link href="/login">Kembali ke Halaman Masuk</Link>
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
              Lupa Password
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Masukkan email Anda untuk menerima link atur ulang password
            </p>
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

            <Button
              type="submit"
              className="bg-primary-dark hover:bg-primary-dark/90 h-12 w-full rounded-xl font-medium text-white transition-all duration-300"
              disabled={isForgotPasswordPending}
            >
              {isForgotPasswordPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Kirim Link Atur Ulang'
              )}
            </Button>

            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke halaman masuk
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
