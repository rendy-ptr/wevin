'use client';

import PackageForm from '@/components/dashboard/admin/package-form';
import { API_URL } from '@/constants/url';
import { useGetPackageById, useUpdatePackage } from '@/hooks/api/use-package';
import { useToast } from '@/hooks/use-toast';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function EditPackagePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: pkg,
    isLoading: isFetching,
    isError,
  } = useGetPackageById(Number(id));

  const updateMutation = useUpdatePackage();

  const formattedInitialData = useMemo(() => {
    if (!pkg) return undefined;
    return {
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      status: pkg.status,
      benefits: (pkg.benefits || []).map(
        (b: { benefitId: number; value: string }) => ({
          benefitId: b.benefitId,
          value: b.value,
        }),
      ),
    };
  }, [pkg]);

  const onSubmit = (data: CreateUpdatePackageFormValues) => {
    updateMutation.mutate(
      { id: Number(id), ...data },
      {
        onSuccess: () => {
          toast({
            title: 'Paket diperbarui',
            description: 'Data paket telah berhasil diperbarui.',
          });
          router.push(API_URL.PACKAGE.INDEX);
        },
        onError: (error) => {
          let message = 'Gagal memperbarui paket.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui paket',
            description: message,
          });
        },
      },
    );
  };

  if (isFetching) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin opacity-20" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Memuat data paket...
        </p>
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="bg-destructive/10 text-destructive rounded-full p-4">
          <Loader2 className="h-8 w-8 rotate-45" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Data paket tidak ditemukan</h2>
          <p className="text-muted-foreground text-sm">
            Gagal memuat data dari server. Silakan coba lagi nanti.
          </p>
        </div>
        <button
          onClick={() => router.push(API_URL.PACKAGE.INDEX)}
          className="text-primary mt-4 text-sm font-bold hover:underline"
        >
          Kembali ke Daftar Paket
        </button>
      </div>
    );
  }

  return (
    <PackageForm
      title={`Edit Paket: ${pkg.name}`}
      onSubmit={onSubmit}
      isLoading={updateMutation.isPending}
      initialData={formattedInitialData}
    />
  );
}
