import { useQuery } from '@tanstack/react-query';

import { fetchNotifs } from '@/api/notifications';
import { useAuth } from '@/store/auth';

/** The customer's notification centre; checked every minute while signed in (unread count for the bell). */
export function useNotifs() {
  const status = useAuth((s) => s.status);
  return useQuery({ queryKey: ['notifs'], queryFn: fetchNotifs, enabled: status === 'user', refetchInterval: 60_000 });
}
