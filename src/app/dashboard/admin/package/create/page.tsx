'use client';

import PackageForm from '@/components/dashboard/admin/package-form';
import { API_URL } from '@/constants/url';
import { useCreatePackage } from '@/hooks/api/use-package';
import { useToast } from '@/hooks/use-toast';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function CreatePackagePage() {
  const { toast } = useToast();
  const router = useRouter();

  const createMutation = useCreatePackage();

  const onSubmit = (data: CreateUpdatePackageFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast({
          title: 'Paket berhasil ditambahkan',
          variant: 'default',
          description: `Paket ${res.data.name} berhasil ditambahkan!`,
        });
        router.push(API_URL.PACKAGE.INDEX);
      },
      onError: (error) => {
        let message = 'Gagal menambahkan paket. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message =
            error.response?.data?.message ||
            'Gagal menambahkan paket. Silakan coba lagi.';
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menambahkan paket',
          description: message,
        });
      },
    });
  };

  return (
    <PackageForm
      title="Tambah Paket Baru"
      onSubmit={onSubmit}
      isLoading={createMutation.isPending}
    />
  );
}
