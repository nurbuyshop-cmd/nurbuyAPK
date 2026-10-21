/** Normalises a Bangladeshi mobile number the same way the server does: strips spaces, dashes and the +88/88 prefix. */
export function normalizeMobile(m: string): string {
  let v = m.replace(/[\s\-().]+/g, '');
  if (v.startsWith('+88')) v = v.slice(3);
  else if (v.startsWith('88') && v.length === 13) v = v.slice(2);
  return v;
}

/** 01XXXXXXXXX (11 digits). */
export function isMobile(m: string): boolean {
  return /^01[0-9]{9}$/.test(normalizeMobile(m));
}

export function isEmail(e: string): boolean {
  return e.length <= 190 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
