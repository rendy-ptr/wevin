import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useSendOtp, useUpdateEmail } from '@/hooks/api/use-setting';
import { useToast } from '@/hooks/use-toast';
import { BaseUserModel } from '@/types/user.type';
import {
  UpdateEmailFormValues,
  updateEmailSchema,
} from '@/validations/admin/create-update-setting';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditProfileEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Pick<BaseUserModel, 'email' | 'id'>;
}

export default function EditProfileEmailModal({
  isOpen,
  onClose,
  user,
}: EditProfileEmailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });
  const { mutate: updateEmail, isPending: isPendingUpdateEmail } =
    useUpdateEmail();
  const { mutate: sendOtp, isPending: isPendingSendOtp } = useSendOtp();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verificationToken, setVerificationToken] = useState<
    string | undefined
  >();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;

    const email = getValues('email');
    if (!email || email === user.email) {
      toast({
        variant: 'destructive',
        title: 'Email Sama',
        description: 'Email baru harus berbeda dengan email saat ini.',
      });
      return;
    }

    sendOtp(
      { email: email },
      {
        onSuccess: (res) => {
          setVerificationToken(res.data.verificationToken);
          setOtpSent(true);
          setCountdown(60);
          toast({
            title: 'Kode OTP Terkirim',
            description: 'Silakan periksa email Anda.',
          });
        },
        onError: (error) => {
          let message = 'Gagal mengirim kode OTP.';
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

  const handleUpdateNameAndEmail = (data: UpdateEmailFormValues) => {
    if (data.email !== user.email) {
      if (!otpSent || !verificationToken) {
        toast({
          variant: 'destructive',
          title: 'Perlu Verifikasi',
          description:
            'Silakan kirim dan masukkan kode verifikasi OTP terlebih dahulu.',
        });
        return;
      }
      if (otpCode.length !== 6) {
        toast({
          variant: 'destructive',
          title: 'Kode Tidak Lengkap',
          description: 'Silakan masukkan 6 digit kode OTP.',
        });
        return;
      }
    }

    updateEmail(
      {
        id: user.id,
        email: data.email,
        verificationToken,
        otpCode,
      },
      {
        onSuccess: (res) => {
          toast({
            title: 'Profil berhasil diperbarui',
            variant: 'default',
            description: `Profil ${res.data.name} berhasil diperbarui!`,
          });
          handleCloseModal();
          router.refresh();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui profil. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui profil. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui profil',
            description: message,
          });
        },
      },
    );
  };

  const handleCloseModal = () => {
    reset();
    setOtpSent(false);
    setOtpCode('');
    setVerificationToken(undefined);
    setCountdown(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(handleUpdateNameAndEmail)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Perbarui Email
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Ubah email akun Anda saat ini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="dialog-new-email"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Email Baru
              </Label>
              <div className="grid grid-cols-[5fr_1fr] gap-2">
                <Input
                  id="dialog-new-email"
                  type="email"
                  {...register('email')}
                  placeholder="Masukkan email baru..."
                  className="bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-border hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark relative h-11 cursor-pointer px-4 text-xs font-semibold transition-colors"
                  onClick={handleSendOtp}
                  disabled={isPendingSendOtp || (otpSent && countdown > 0)}
                >
                  {isPendingSendOtp ? (
                    <>
                      <span className="invisible text-transparent">
                        Kirim OTP
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </>
                  ) : otpSent && countdown > 0 ? (
                    `Tunggu ${countdown}s`
                  ) : otpSent && countdown === 0 ? (
                    'Kirim Ulang'
                  ) : (
                    'Kirim OTP'
                  )}
                </Button>
              </div>
              {errors.email && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-2">
                <div className="flex flex-col space-y-1">
                  <Label
                    htmlFor="dialog-otp"
                    className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                  >
                    Kode Verifikasi
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Masukkan 6 digit kode yang dikirim ke email baru Anda.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-10 w-10 text-sm" />
                      <InputOTPSlot index={1} className="h-10 w-10 text-sm" />
                      <InputOTPSlot index={2} className="h-10 w-10 text-sm" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="h-10 w-10 text-sm" />
                      <InputOTPSlot index={4} className="h-10 w-10 text-sm" />
                      <InputOTPSlot index={5} className="h-10 w-10 text-sm" />
                    </InputOTPGroup>
                  </InputOTP>

                  <span className="text-muted-foreground text-center text-xs font-medium">
                    Tidak menerima kode? Kirim ulang
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isPendingUpdateEmail || isPendingSendOtp}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Tutup
            </Button>
            <Button
              type="submit"
              disabled={isPendingUpdateEmail || isPendingSendOtp}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isPendingUpdateEmail ? (
                <>
                  <span className="invisible text-transparent">Simpan</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
