'use client';

import { Button } from '@/components/ui/button';
import {
  useGetInvitationById,
  useUpdateInvitation,
} from '@/hooks/api/use-invitation';
import { useGetTemplates } from '@/hooks/api/use-template';
import { usePermission } from '@/hooks/use-permission';
import { useSession } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';

import InvitationTemplateStep from '@/components/dashboard/member/invitation/create/steps/step-1-template';
import InvitationProfilesStep from '@/components/dashboard/member/invitation/create/steps/step-2-profiles';
import InvitationTextsStep from '@/components/dashboard/member/invitation/create/steps/step-3-texts';
import InvitationEventsStep from '@/components/dashboard/member/invitation/create/steps/step-4-events';
import InvitationGalleryStep from '@/components/dashboard/member/invitation/create/steps/step-5-gallery';
import InvitationFeaturesStep from '@/components/dashboard/member/invitation/create/steps/step-6-features';
import InvitationPublishStep from '@/components/dashboard/member/invitation/create/steps/step-7-publish';
import { DEFAULT_INVITATION_VALUES } from '@/constants/invitation.constant';
import {
  createInvitationSchema,
  CreateUpdateInvitationFormValues,
} from '@/validations/member/create-update-invitation';

const STEP_FIELDS: Record<number, (keyof CreateUpdateInvitationFormValues)[]> =
  {
    1: ['templateId'],
    2: [
      'groomName',
      'groomFullName',
      'groomParents',
      'brideName',
      'brideFullName',
      'brideParents',
    ],
    3: [
      'prefixTitle',
      'coverGreeting',
      'coverQuote',
      'openingGreeting',
      'openingMessage',
      'closingGreeting',
      'closingMessage',
    ],
    4: ['events'],
    5: ['gallery'],
    6: ['musicUrl', 'liveStreamUrl', 'enabledFeatures'],
    7: ['status', 'recipientName'],
  };

function EditInvitationFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const currentStep = Number(searchParams.get('step')) || 1;
  const invitationId = Number(params.id);
  const totalSteps = 7;

  const { user, isLoading: isLoadingSession } = useSession();
  const { hasTemplate, isLoading: isLoadingPermissions } = usePermission();

  const { toast } = useToast();
  const { data: templatesData = [], isLoading: isLoadingTemplates } =
    useGetTemplates();

  const { data: initialData, isLoading: isLoadingData } =
    useGetInvitationById(invitationId);

  const { mutate: updateInvitation, isPending: isUpdating } =
    useUpdateInvitation();

  const methods = useForm({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: DEFAULT_INVITATION_VALUES,
    mode: 'onChange',
  });

  const { reset } = methods;
  const isDataLoadedRef = useRef(false);

  useEffect(() => {
    if (initialData && !isDataLoadedRef.current) {
      reset({
        ...DEFAULT_INVITATION_VALUES,
        ...initialData,
      });
      isDataLoadedRef.current = true;
    }
  }, [initialData, reset]);

  const setStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', step.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      if (currentStep === 4) {
        const currentEvents = methods.getValues('events') || [];
        if (currentEvents.length === 0) {
          methods.setError('events', {
            type: 'manual',
            message: 'Minimal harus ada 1 acara (misal: Akad/Pemberkatan)',
          });
          return;
        }
      }

      if (currentStep === 5) {
        const currentGallery = methods.getValues('gallery') || [];
        if (currentGallery.length === 0) {
          methods.setError('gallery', {
            type: 'manual',
            message: 'Minimal harus mengunggah 1 foto galeri',
          });
          return;
        }
      }

      const isValid = await methods.trigger(fieldsToValidate, {
        shouldFocus: true,
      });
      if (isValid) setStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleUpdate = (data: CreateUpdateInvitationFormValues) => {
    if (!invitationId) return;

    updateInvitation(
      { id: invitationId, data },
      {
        onSuccess: () => {
          toast({
            title: 'Undangan berhasil diperbarui',
            variant: 'default',
            description: `Undangan ${data.groomName} & ${data.brideName} berhasil disimpan!`,
          });
          router.push('/dashboard/member/invitations');
        },
        onError: (error) => {
          let message = 'Gagal memperbarui undangan. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui undangan. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui',
            description: message,
          });
        },
      },
    );
  };

  const onFormError = (errors: FieldErrors) => {
    console.log('Form validation errors:', errors);
    toast({
      title: 'Validasi Gagal',
      description:
        'Mohon periksa kembali form Anda. Pastikan semua data acara, nama mempelai, dan salam sudah terisi.',
      variant: 'destructive',
    });
  };

  if (
    isLoadingSession ||
    isLoadingPermissions ||
    isLoadingTemplates ||
    isLoadingData
  ) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin opacity-80" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            Memuat data undangan...
          </p>
        </div>
      </div>
    );
  }

  if (!invitationId) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            ID Undangan tidak ditemukan.
          </p>
          <Link href="/dashboard/member/invitations">
            <Button className="mt-4">Kembali</Button>
          </Link>
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
                  Edit Undangan
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
              onSubmit={methods.handleSubmit(handleUpdate, onFormError)}
              className="mx-auto w-full max-w-4xl space-y-8"
            >
              <div>
                <div className="border-border/40 mb-6 flex items-center justify-between border-b pb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Step {currentStep} of {totalSteps}
                    </span>
                    <span className="bg-border h-1.5 w-1.5 rounded-full" />
                    <span className="text-primary text-xs font-bold">
                      {currentStep === 1 && 'Template & Desain Sampul'}
                      {currentStep === 2 && 'Data Identitas Mempelai'}
                      {currentStep === 3 && 'Kata & Pesan Sambutan'}
                      {currentStep === 4 && 'Jadwal & Lokasi Acara'}
                      {currentStep === 5 && 'Galeri Foto'}
                      {currentStep === 6 && 'Fitur & Media Tambahan'}
                      {currentStep === 7 && 'Review & Publish'}
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
                      allTemplates={templatesData}
                      checkTemplateAllowed={hasTemplate}
                    />
                  )}

                  {currentStep === 2 && <InvitationProfilesStep />}

                  {currentStep === 3 && <InvitationTextsStep />}

                  {currentStep === 4 && <InvitationEventsStep />}

                  {currentStep === 5 && <InvitationGalleryStep />}

                  {currentStep === 6 && <InvitationFeaturesStep />}

                  {currentStep === 7 && <InvitationPublishStep />}
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
                        type="button"
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
                      Selanjutnya
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
}

export default function EditInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
        </div>
      }
    >
      <EditInvitationFormContent />
    </Suspense>
  );
}
