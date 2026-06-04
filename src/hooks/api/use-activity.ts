import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { ActivityFilterParams, ActivityIndexItem } from '@/types/activity.type';
import { useQuery } from '@tanstack/react-query';

export const useGetActivities = ({
  search,
  startDate,
  endDate,
  action,
  page,
  limit,
}: ActivityFilterParams) => {
  return useQuery({
    queryKey: ['activities', search, startDate, endDate, action, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.ACTIVITY.GET, {
        params: { search, startDate, endDate, action, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as {
        items: ActivityIndexItem[];
        total: number;
      };
    },
  });
};
