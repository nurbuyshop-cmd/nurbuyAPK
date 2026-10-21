import { isObj, num, str } from '@/lib/guards';

import { api } from './api';

export type Review = { name: string; stars: number; text: string; date: number; img: string };

export type Reviews = {
  avg: number;
  count: number;
  /** stars (1..5) -> number of reviews */
  dist: Record<1 | 2 | 3 | 4 | 5, number>;
  list: Review[];
  mine: { stars: number; text: string } | null;
  /** the signed-in customer received this product and may write a review */
  can: boolean;
};

function toReviews(v: unknown): Reviews {
  const o = isObj(v) ? v : {};
  const d = isObj(o.dist) ? o.dist : {};
  return {
    avg: num(o.avg),
    count: num(o.count),
    dist: { 1: num(d[1]), 2: num(d[2]), 3: num(d[3]), 4: num(d[4]), 5: num(d[5]) },
    list: Array.isArray(o.list)
      ? o.list.filter(isObj).map((x) => ({ name: str(x.n), stars: num(x.s), text: str(x.t), date: num(x.d), img: str(x.img) }))
      : [],
    mine: isObj(o.mine) ? { stars: num(o.mine.s), text: str(o.mine.t) } : null,
    can: o.can === true,
  };
}

export async function fetchReviews(pid: string): Promise<Reviews> {
  return toReviews(await api('GET', `/reviews/${encodeURIComponent(pid)}`));
}

export async function postReview(pid: string, stars: number, text: string): Promise<Reviews> {
  return toReviews(await api('POST', `/reviews/${encodeURIComponent(pid)}`, { body: { s: stars, t: text } }));
}
