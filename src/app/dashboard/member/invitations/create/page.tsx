'use client';

import { Button } from '@/components/ui/button';
import { useGetTemplates } from '@/hooks/api/use-template';
import { usePermission } from '@/hooks/use-permission';
import { useSession } from '@/hooks/use-session';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import InvitationBookPreview from '@/components/dashboard/member/invitation/create/invitation-book-preview';
import InvitationBookStep from '@/components/dashboard/member/invitation/create/invitation-book-step';
import InvitationFeaturesStep from '@/components/dashboard/member/invitation/create/invitation-features-step';
import InvitationTemplateStep from '@/components/dashboard/member/invitation/create/invitation-template-step';

import {
  createUpdateInvitationBookSchema,
  createUpdateInvitationFeatureSchema,
  createUpdateInvitationSchema,
} from '@/validations/member/create-update-invitation';

const createInvitationSchema = createUpdateInvitationSchema
  .extend(createUpdateInvitationBookSchema.shape)
  .extend(createUpdateInvitationFeatureSchema.shape);
function InvitationFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get('step')) || 1;
  const totalSteps = 3;

  const { user, isLoading: isLoadingSession } = useSession();
  const { hasTemplate, isLoading: isLoadingPermissions } = usePermission();
  const { data: templatesData = [], isLoading: isLoadingTemplates } =
    useGetTemplates();

  const methods = useForm({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      templateId: 1,

      prefixTitle: 'The Wedding of',
      coverGreeting: 'With Love,',
      coverQuote:
        '"Two souls with but a single thought, two hearts that beat as one."',
      groomName: '',
      brideName: '',
      eventDate: '',
      placement: 'Hotel Grand Ballroom, Jakarta',

      openingGreeting: 'Bismillahirrahmanirrahim',
      openingMessage:
        'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
      groomFullName: '',
      groomParents: '',
      brideFullName: '',
      brideParents: '',
      akadDate: '',
      akadTime: '',
      akadLocation: '',
      akadAddress: '',
      akadMapsUrl: '',
      resepsiDate: '',
      resepsiTime: '',
      resepsiLocation: '',
      resepsiAddress: '',
      resepsiMapsUrl: '',
      closingMessage:
        'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
      closingGreeting:
        'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.',
      enabledFeatures: {},
      gallery: [],
      musicUrl: '',
      liveStreamUrl: '',
    },
  });

  const { reset } = methods;
  const isDraftLoadedRef = useRef(false);
  const values = useWatch({ control: methods.control });

  useEffect(() => {
    const saved = localStorage.getItem('wevin_invitation_draft_values');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          reset(parsed);
        }
      } catch (error) {
        console.error('Failed to load form draft:', error);
      }
    }
    isDraftLoadedRef.current = true;
  }, [reset]);

  useEffect(() => {
    if (isDraftLoadedRef.current) {
      localStorage.setItem(
        'wevin_invitation_draft_values',
        JSON.stringify(values),
      );
    }
  }, [values]);

  const setStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', step.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await methods.trigger(['templateId']);
      if (isValid) {
        setStep(2);
      }
    } else if (currentStep === 2) {
      const isValid = await methods.trigger([
        'eventDate',
        'prefixTitle',
        'groomName',
        'brideName',
        'coverGreeting',
        'coverQuote',
        'placement',
      ]);
      if (isValid) {
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleCreate = (data: z.infer<typeof createInvitationSchema>) => {
    console.log('Submitted Data:', data);
    alert('Form valid! Siap dikirim ke API oleh backend integration.');
    localStorage.removeItem('wevin_invitation_draft_values');
  };

  const allowedTemplates = templatesData.filter((template) =>
    hasTemplate(template.id),
  );

  if (isLoadingSession || isLoadingPermissions || isLoadingTemplates) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin opacity-80" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            Memuat konfigurasi paket member...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="border-border/40 border-b pb-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/member/invitations">
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-10 w-10 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h2 className="text-foreground font-serif text-xl font-bold tracking-tight">
                  Buat Undangan Baru
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Paket aktif Anda:{' '}
                  <span className="text-primary font-bold">
                    {user?.package?.name || 'Free Plan'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleCreate)}
              className={`grid grid-cols-1 items-start gap-8 ${currentStep === 3 ? '' : 'lg:grid-cols-12'}`}
            >
              <div
                className={`space-y-8 ${currentStep === 3 ? 'mx-auto w-full max-w-4xl' : 'lg:col-span-7'}`}
              >
                <div className="border-border/40 flex items-center justify-between border-b pb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Step {currentStep} of {totalSteps}
                    </span>
                    <span className="bg-border h-1.5 w-1.5 rounded-full" />
                    <span className="text-primary text-xs font-bold">
                      {currentStep === 1 && 'Template & Desain Sampul'}
                      {currentStep === 2 && 'Detail Buku Undangan'}
                      {currentStep === 3 && 'Fitur & Galeri'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i + 1 === currentStep
                            ? 'bg-primary w-8'
                            : i + 1 < currentStep
                              ? 'bg-primary/45 w-4'
                              : 'bg-secondary w-4'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-12">
                  {currentStep === 1 && (
                    <InvitationTemplateStep
                      allowedTemplates={allowedTemplates}
                      errors={methods.formState.errors}
                    />
                  )}

                  {currentStep === 2 && (
                    <InvitationBookStep errors={methods.formState.errors} />
                  )}

                  {currentStep === 3 && (
                    <InvitationFeaturesStep errors={methods.formState.errors} />
                  )}
                </div>

                <div className="border-border/40 mt-12 flex items-center justify-end gap-3 border-t py-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
                    >
                      Kembali
                    </Button>
                  ) : (
                    <Link href="/dashboard/member/invitations">
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
                      >
                        Batal
                      </Button>
                    </Link>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
                    >
                      Lanjut
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Simpan Undangan
                    </Button>
                  )}
                </div>
              </div>

              {currentStep < 3 && (
                <div className="border-border/40 bg-secondary/[0.15] flex min-h-[520px] flex-col items-center justify-center rounded-3xl border p-6 py-10 shadow-sm lg:sticky lg:top-8 lg:col-span-5">
                  <div className="mb-6 text-center">
                    <h4 className="text-foreground font-serif text-sm font-bold">
                      Live Preview Sampul
                    </h4>
                    <p className="text-muted-foreground text-[10px]">
                      Tampilan sampul buku undangan digital Anda
                    </p>
                  </div>
                  <InvitationBookPreview templates={templatesData} />
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
}

export default function InvitationForm() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin opacity-80" />
            <p className="text-muted-foreground mt-4 text-sm font-medium">
              Memuat konfigurasi...
            </p>
          </div>
        </div>
      }
    >
      <InvitationFormContent />
    </Suspense>
  );
}
