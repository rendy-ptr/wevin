import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { Package, PackageFilterParams } from '@/types/package.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPackages = ({
  search,
  status,
  page = 1,
  limit = 10,
}: PackageFilterParams) => {
  return useQuery({
    queryKey: ['packages', search, status, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.PACKAGE.GET, {
        params: { search, status, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as { items: Package[]; total: number };
    },
  });
};

export const useGetPackageById = (id: number) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const response = await api.get(API_URL.PACKAGE.GET_BY_ID(id));
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdatePackageFormValues) => {
      const response = await api.post(API_URL.PACKAGE.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateUpdatePackageFormValues & { id: number }) => {
      const response = await api.put(API_URL.PACKAGE.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['package', variables.id] });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.PACKAGE.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
