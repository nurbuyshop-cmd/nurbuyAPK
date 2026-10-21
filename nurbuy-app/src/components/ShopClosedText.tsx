import type { ShopState } from '@/lib/products';
import { clock } from '@/lib/time';
import { digits, fmt, useI18n, useT, weekday } from '@/store/i18n';

import { Txt } from './Txt';

/** "Opens today at 9:00 AM" for a closed shop; nothing when it is open or has no next opening. */
export function ShopClosedText({ state, size, color }: { state: ShopState; size: number; color: string }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  if (state.open || !state.next) return null;
  const n = state.next;
  const time = digits(clock(n.minute), lang);
  const text =
    n.inDays === 0
      ? fmt(t('opensToday'), { t: time }, lang)
      : n.inDays === 1
        ? fmt(t('opensTomorrow'), { t: time }, lang)
        : fmt(t('opensDay'), { d: weekday(n.weekday, lang), t: time }, lang);
  return <Txt size={size} color={color} numberOfLines={1}>{text}</Txt>;
}
