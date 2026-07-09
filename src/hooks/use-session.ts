import { API_URL } from '@/constants/url';
import { SessionUser } from '@/types/session.type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useSession() {
  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await axios.get<{ user: SessionUser | null }>(
        API_URL.AUTH.SESSION,
      );
      return response.data.user;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });

  return {
    user: data ?? null,
    isLoading,
    isLoggedIn: !!data,
  };
}
