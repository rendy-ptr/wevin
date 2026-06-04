import { useSession } from '@/hooks/use-session';
import { createPermission } from '@/lib/permission';

export function usePermission() {
  const { user, isLoading } = useSession();

  return {
    isLoading,
    ...createPermission(user?.package ?? null),
  };
}
