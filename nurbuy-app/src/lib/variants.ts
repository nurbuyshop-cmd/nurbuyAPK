import type { Variant, Variants } from '@/api/catalog';

/** Attribute names to pick by; falls back to the option keys of the variants. */
export function attrNames(vr: Variants): { n: string; t: 'chip' | 'color' }[] {
  if (vr.attrs.length) return vr.attrs;
  const keys = new Set<string>();
  vr.list.forEach((v) => Object.keys(v.o).forEach((k) => keys.add(k)));
  return [...keys].map((n) => ({ n, t: 'chip' as const }));
}

/** Values of one attribute in the seller's order. */
export function attrValues(vr: Variants, attr: string): string[] {
  const out: string[] = [];
  vr.list.forEach((v) => {
    const x = v.o[attr];
    if (x !== undefined && !out.includes(x)) out.push(x);
  });
  return out;
}

/** First variant in stock (or the first one) to preselect. */
export function defaultVariant(vr: Variants): Variant {
  return vr.list.find((v) => v.stock > 0) ?? (vr.list[0] as Variant);
}

/** Changing one attribute keeps the others when such a variant exists, otherwise takes the first variant with that value. */
export function pickVariant(vr: Variants, cur: Variant, attr: string, value: string): Variant {
  const others = Object.entries(cur.o).filter(([k]) => k !== attr);
  const exact = vr.list.find((v) => v.o[attr] === value && others.every(([k, x]) => v.o[k] === x));
  return exact ?? vr.list.find((v) => v.o[attr] === value) ?? cur;
}

/** Every variant with this value is sold out. */
export function valueSoldOut(vr: Variants, attr: string, value: string): boolean {
  return vr.list.filter((v) => v.o[attr] === value).every((v) => v.stock <= 0);
}
