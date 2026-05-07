'use client';

import PackageForm from '@/components/dashboard/admin/package-form';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePackagePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: CreateUpdatePackageFormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/package', data);
      if (response.data.success) {
        toast({
          title: 'Paket dibuat',
          description: 'Paket baru telah berhasil ditambahkan.',
        });
        router.push('/dashboard/admin/package');
      }
    } catch (error) {
      let message = 'Gagal membuat paket.';
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast({
        variant: 'destructive',
        title: 'Gagal membuat paket',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PackageForm
      title="Tambah Paket Baru"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
