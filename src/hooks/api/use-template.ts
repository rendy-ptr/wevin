import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { TTemplate } from '@/types/template.type';
import { useQuery } from '@tanstack/react-query';

export const useGetTemplates = () => {
  return useQuery<TTemplate[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get(API_URL.TEMPLATE.GET);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as TTemplate[];
    },
  });
};

// export const useGetTemplateById = (id: number) => {
//   return useQuery<TTemplate>({
//     queryKey: ['templates', id],
//     queryFn: async () => {
//       const response = await api.get(API_URL.TEMPLATE.GET_BY_ID(id));
//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Gagal mengambil data');
//       }
//       return response.data.data as TTemplate;
//     },
//     enabled: !!id,
//     refetchOnWindowFocus: false,
//   });
// };
