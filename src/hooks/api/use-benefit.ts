import { BenefitType } from '@/constants/benefits';
import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { Benefit } from '@/types/benefit.type';
import { CreateUpdateBenefitFormValues } from '@/validations/admin/create-update-benefit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetBenefits = (
  search?: string,
  type?: BenefitType,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: ['benefits', search, type, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.BENEFIT.GET, {
        params: { search, type, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as { items: Benefit[]; total: number };
    },
  });
};

export const useCreateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateBenefitFormValues) => {
      const response = await api.post(API_URL.BENEFIT.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
    },
  });
};

export const useUpdateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateUpdateBenefitFormValues & { id: number }) => {
      const response = await api.put(API_URL.BENEFIT.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
    },
  });
};

export const useDeleteBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.BENEFIT.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
    },
  });
};
