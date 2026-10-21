import { API_BASE } from '@/config';

const SIZES = [160, 320, 480, 640, 960] as const;
const UPLOAD = /^https:\/\/apin\.nurbuy\.com\/uploads\/([A-Za-z0-9_-]{1,80}\.(?:jpe?g|png|webp))$/i;

/**
 * Small cached copy of an uploaded photo (GET /thumb/{width}/{file}) for lists; the server falls back to the original
 * when it cannot resize. Other addresses are returned unchanged.
 */
export function thumb(url: string, width: number): string {
  const m = UPLOAD.exec(url);
  if (!m) return url;
  const w = SIZES.find((s) => s >= width) ?? 960;
  return `${API_BASE}/thumb/${w}/${m[1]}`;
}
