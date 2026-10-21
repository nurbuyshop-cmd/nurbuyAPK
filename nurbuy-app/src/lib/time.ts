import type { Hours } from '@/api/catalog';

/** [weekday (Sunday = 0), minutes since midnight] in Bangladesh time (UTC+6, no daylight saving). */
export function dhakaNow(ms = Date.now()): [number, number] {
  const d = new Date(ms + 6 * 3600 * 1000);
  return [d.getUTCDay(), d.getUTCHours() * 60 + d.getUTCMinutes()];
}

/** Same rule as the server (hours_open): no hours = always open; a day may close after midnight. */
export function isOpen(h: Hours | null, ms = Date.now()): boolean {
  if (!h) return true;
  const [dw, m] = dhakaNow(ms);
  const td = h[dw];
  if (td && m >= td[0] && (td[1] > td[0] ? m < td[1] : true)) return true;
  const yd = h[(dw + 6) % 7];
  return !!yd && yd[1] <= yd[0] && m < yd[1];
}

/** Next opening: days from today (0 = today) and the minute it opens. */
export function nextOpen(h: Hours | null, ms = Date.now()): { inDays: number; weekday: number; minute: number } | null {
  if (!h) return null;
  const [dw, m] = dhakaNow(ms);
  for (let k = 0; k < 8; k++) {
    const day = (dw + k) % 7;
    const d = h[day];
    if (d && (k > 0 || d[0] > m)) return { inDays: k, weekday: day, minute: d[0] };
  }
  return null;
}

/** "9:30 AM" style clock text for a minute of the day. */
export function clock(minute: number): string {
  const h24 = Math.floor(minute / 60) % 24;
  const mm = String(minute % 60).padStart(2, '0');
  const h12 = h24 % 12 || 12;
  return `${h12}:${mm} ${h24 < 12 ? 'AM' : 'PM'}`;
}
