import type { StringKey } from '@/i18n/en';
import { MAXVAR, usePForm } from '@/store/pform';

import { isMoney, isWhole, numText } from './format';

type Result = { ok: true; body: Record<string, unknown> } | { ok: false; msg?: StringKey };

/**
 * Checks the whole product form like the website's FORM.pf and vValidate(): marks wrong fields (errs, vbad)
 * and returns the request body when everything is right.
 */
export function checkProductForm(t: (k: StringKey) => string): Result {
  const s = usePForm.getState();
  const v = s.v;
  const errs: Record<string, string> = {};
  const mark = (k: string, m: StringKey) => {
    if (!errs[k]) errs[k] = t(m);
  };

  if (v.name.trim().length < 2) mark('name', 'fName');
  if (v.pcode.trim() && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,29}$/.test(v.pcode.trim())) mark('pcode', 'fPcode');
  if (!v.cat) mark('cat', 'fCat');

  const pr = numText(v.price);
  const ol = numText(v.old);
  const stk = numText(v.stock);
  const isVar = s.type === 'var';
  if (!isVar) {
    if (!isMoney(pr) || Number(pr) <= 0) mark('price', 'fPrice');
    if (ol !== '' && (!isMoney(ol) || (Number(ol) > 0 && Number(ol) < Number(pr)))) mark('old', 'fOld');
    if (s.so && (!isWhole(stk) || Number(stk) > 1000000)) mark('stock', 'fStock');
  }
  const mq = numText(v.max_q);
  if (mq !== '' && (!isWhole(mq) || Number(mq) > 99)) mark('max_q', 'fMaxQ');
  const tags = v.tags
    .split(/[,\n،]+/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (tags.length > 10) mark('tags', 'fTags10');
  else if (tags.some((x) => x.length > 30)) mark('tags', 'fTags30');

  if (s.imgs.some((x) => x.tmp)) {
    usePForm.setState({ errs });
    return { ok: false, msg: 'waitPhotos' };
  }
  const real = s.imgs.filter((x) => !x.tmp && x.name);
  if (!real.length) mark('imgs', 'fImgs');

  // variants
  let vbody: { price: number; old: number; stock: number; vr: unknown } | null = null;
  let vmsg: StringKey | undefined;
  const vbad: Record<string, string[]> = {};
  if (isVar) {
    if (!s.attrs.length || !s.attrs.every((a) => a.opts.length)) vmsg = 'vErrSetup';
    else if (s.dirty || !s.vars.length) vmsg = 'vErrGen';
    else if (s.vars.length > MAXVAR) vmsg = 'tooMany';
    else {
      const skus = new Set<string>();
      const out: Record<string, unknown>[] = [];
      let anyOn = false;
      const bad = (id: string, f: string) => {
        vbad[id] = [...(vbad[id] ?? []), f];
      };
      for (const x of s.vars) {
        const p = numText(x.price);
        const o = numText(x.old);
        const sv = numText(x.stock);
        const lw = numText(x.low);
        const pn = isMoney(p) ? Number(p) : NaN;
        const on = o === '' ? 0 : isMoney(o) ? Number(o) : NaN;
        if (Number.isNaN(pn) || pn <= 0) bad(x.id, 'price');
        if (Number.isNaN(on) || (on > 0 && !Number.isNaN(pn) && on < pn)) bad(x.id, 'old');
        if (s.so ? !isWhole(sv) || Number(sv) > 1000000 : sv !== '' && !isWhole(sv)) bad(x.id, 'stock');
        if (lw !== '' && !isWhole(lw)) bad(x.id, 'low');
        if (!x.name.trim()) bad(x.id, 'name');
        const sk = x.sku.trim();
        if (sk) {
          if (skus.has(sk.toLowerCase())) bad(x.id, 'sku');
          skus.add(sk.toLowerCase());
        }
        if (x.on) anyOn = true;
        out.push({
          id: x.id,
          name: x.name.trim(),
          o: x.o,
          sku: sk,
          price: pn,
          old: on,
          stock: s.so ? Number(sv) : 0,
          low: lw === '' ? 0 : Number(lw),
          img: x.img,
          bar: x.bar.trim(),
          wt: x.wt.trim(),
          on: x.on ? 1 : 0,
        });
      }
      if (Object.keys(vbad).length) vmsg = 'vErrFields';
      else if (!anyOn) vmsg = 'vErrOn';
      else {
        const hex: Record<string, string> = {};
        for (const a of s.attrs) if (a.t === 'color') for (const o of a.opts) hex[o] = s.hex[o] ?? '#888888';
        const act = out.filter((x) => x.on);
        let best = act[0] as { price: number; old: number };
        let total = 0;
        for (const x of act as { price: number; old: number; stock: number }[]) {
          if (x.price < best.price) best = x;
          total += x.stock;
        }
        vbody = { price: best.price, old: best.old, stock: total, vr: { a: s.attrs.map((a) => ({ n: a.n, t: a.t })), hex, v: out } };
      }
    }
  }

  usePForm.setState({ errs, vbad });
  if (Object.keys(errs).length) return { ok: false, msg: 'checkFields' };
  if (isVar && !vbody) return { ok: false, msg: vmsg };

  const root = s.meta?.cats.find((c) => c.n === v.cat);
  const cp = s.cp.filter(Boolean);
  const body: Record<string, unknown> = {
    pcode: v.pcode.trim(),
    name: v.name.trim(),
    bn: v.bn.trim(),
    cat: v.cat,
    cat_id: cp.length ? cp[cp.length - 1] : root ? root.id : null,
    v: 'min',
    price: Number(pr),
    old: ol === '' ? 0 : Number(ol),
    stock: s.so ? Number(stk) : 0,
    stock_on: s.so ? 1 : 0,
    max_q: mq === '' ? 0 : Number(mq),
    tags,
    about: v.about.trim(),
    about_bn: v.about_bn.trim(),
    sub: '',
    specs: s.specs.filter((r) => r.k.trim() && r.v.trim()).map((r) => [r.k.trim(), r.v.trim()]),
    imgs: real.map((x) => x.name),
    vr: null,
  };
  if (vbody) Object.assign(body, vbody);
  return { ok: true, body };
}
