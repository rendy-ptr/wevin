import api from '@/lib/axios';
import { Package } from '@/types/package.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPackages = (
  search?: string,
  isActive?: boolean,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: ['packages', search, isActive, page, limit],
    queryFn: async () => {
      const response = await api.get('/api/package', {
        params: { search, isActive, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as { items: Package[]; total: number };
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/package/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
