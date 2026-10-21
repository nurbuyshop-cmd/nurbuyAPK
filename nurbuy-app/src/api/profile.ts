import type { Obj } from '@/lib/guards';

import { api } from './api';

/**
 * Replaces the customer's profile JSON (wishlist, saved addresses, preferences...). Max 1 MB.
 * Any old photo kept as "data:" text is left out: the host's security filter refuses a request containing it,
 * which would make every profile save (wishlist, addresses...) fail.
 */
export async function saveProfile(profile: Obj): Promise<void> {
  const clean: Obj = {};
  for (const [k, v] of Object.entries(profile)) {
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    clean[k] = v;
  }
  await api('PUT', '/me/profile', { body: { profile: clean } });
}
