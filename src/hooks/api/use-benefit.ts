import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { BenefitFilterParams, TBenefit } from '@/types/benefit.type';
import { useQuery } from '@tanstack/react-query';

export const useGetBenefits = ({
  search,
  type,
  page,
  limit,
}: BenefitFilterParams) => {
  return useQuery({
    queryKey: ['benefits', search, type, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.BENEFIT.GET, {
        params: { search, type, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as { items: TBenefit[]; total: number };
    },
  });
};
