'use client';

import PackageForm from '@/components/dashboard/admin/package-form';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import { Package } from '@/types/package.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPackagePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [formattedInitialData, setFormattedInitialData] =
    useState<CreateUpdatePackageFormValues | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`/api/package/${id}`);
        if (response.data.success) {
          const pkg = response.data.data;
          setPackageData(pkg);

          setFormattedInitialData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price,
            isActive: pkg.isActive,
            benefits: (pkg.benefits || []).map(
              (b: { benefitId: number; value: string }) => ({
                benefitId: b.benefitId,
                value: b.value,
              }),
            ),
          });
        }
      } catch {
        toast({
          variant: 'destructive',
          title: 'Gagal memuat paket',
          description:
            'Data paket tidak ditemukan atau terjadi kesalahan server.',
        });
        router.push('/dashboard/admin/package');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchPackage();
  }, [id, router, toast]);

  const handleSubmit = async (data: CreateUpdatePackageFormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/package/${id}`, data);
      if (response.data.success) {
        toast({
          title: 'Paket diperbarui',
          description: 'Perubahan paket telah berhasil disimpan.',
        });
        router.push('/dashboard/admin/package');
      }
    } catch (error) {
      let message = 'Gagal memperbarui paket.';
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast({
        variant: 'destructive',
        title: 'Gagal memperbarui paket',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground font-medium">
          Memuat data paket...
        </p>
      </div>
    );
  }

  if (!formattedInitialData) return null;

  return (
    <PackageForm
      title={`Edit Paket: ${packageData?.name}`}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      initialData={formattedInitialData}
    />
  );
}
