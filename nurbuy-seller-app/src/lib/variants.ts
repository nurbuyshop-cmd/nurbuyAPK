import { attrDef, combos, MAXATTR, usePForm, vkey, vlabel, type Attr, type VarRow } from '@/store/pform';

import { numText } from './format';

/** Variant editing actions on the product form (website ACT.v*). Each returns an error key or '' when done. */

const st = () => usePForm.getState();

function changed(attrs: Attr[], hex = st().hex) {
  usePForm.setState({ attrs, hex, dirty: true });
}

export function addAttr(name: string): '' | 'upTo3' | 'alreadyAdded' {
  const s = st();
  const nm = name.trim().replace(/\s+/g, ' ');
  if (!nm) return '';
  if (s.attrs.length >= MAXATTR) return 'upTo3';
  if (s.attrs.some((a) => a.n.toLowerCase() === nm.toLowerCase())) return 'alreadyAdded';
  const d = attrDef(s.meta, nm);
  changed([...s.attrs, d ? { n: d.n, t: d.t, opts: [] } : { n: nm, t: 'chip', opts: [] }]);
  return '';
}

export function removeAttr(i: number) {
  changed(st().attrs.filter((_, k) => k !== i));
}

export function toggleOpt(ai: number, o: string) {
  const s = st();
  const a = s.attrs[ai];
  if (!a) return;
  const on = a.opts.includes(o);
  const hex = { ...s.hex };
  if (!on && a.t === 'color' && !hex[o]) {
    const h = attrDef(s.meta, a.n)?.opts.find((q) => q.n === o)?.hex;
    if (h) hex[o] = h;
  }
  changed(
    s.attrs.map((x, k) => (k === ai ? { ...x, opts: on ? x.opts.filter((y) => y !== o) : [...x.opts, o] } : x)),
    hex,
  );
}

/** Adds typed options (comma separated). Returns how many were added. */
export function addOpts(ai: number, text: string): number {
  const s = st();
  const a = s.attrs[ai];
  if (!a) return 0;
  const opts = [...a.opts];
  const hex = { ...s.hex };
  let added = 0;
  for (const raw of text.split(',')) {
    const x = raw.trim().replace(/\s+/g, ' ');
    if (!x || opts.length >= 50 || opts.some((o) => o.toLowerCase() === x.toLowerCase())) continue;
    opts.push(x);
    added++;
    if (a.t === 'color' && !hex[x]) hex[x] = '#888888';
  }
  if (added) changed(s.attrs.map((y, k) => (k === ai ? { ...y, opts } : y)), hex);
  return added;
}

export function setHex(o: string, h: string) {
  usePForm.setState({ hex: { ...st().hex, [o]: h } });
}

/** Variants that a new "Generate" would remove (their combination is no longer chosen). */
export function goneOnGenerate(): VarRow[] {
  const s = st();
  const keep = new Set(combos(s.attrs).map((c) => vkey(c, s.attrs)));
  return s.vars.filter((v) => !keep.has(vkey(v.o, s.attrs)));
}

/** Builds the variant list from the options; matching variants keep their data. Returns [total, new]. */
export function generate(): [number, number] {
  const s = st();
  const old = new Map<string, VarRow>();
  let dp = '';
  for (const v of s.vars) {
    old.set(vkey(v.o, s.attrs), v);
    if (!dp && v.price) dp = v.price;
  }
  let vmax = s.vmax;
  let added = 0;
  const vars = combos(s.attrs).map((c) => {
    const e = old.get(vkey(c, s.attrs));
    if (e) return e;
    added++;
    vmax++;
    return { id: `v${vmax}`, name: vlabel(c, s.attrs), o: c, sku: '', price: dp, old: '', stock: '0', low: '5', img: '', bar: '', wt: '', on: true };
  });
  usePForm.setState({ vars, vmax, sel: {}, dirty: false, vbad: {} });
  return [vars.length, added];
}

export function setVar(id: string, field: keyof VarRow, val: string | boolean) {
  const s = st();
  const bad = s.vbad[id];
  usePForm.setState({
    vars: s.vars.map((v) => (v.id === id ? { ...v, [field]: val } : v)),
    vbad: bad && bad.includes(field) ? { ...s.vbad, [id]: bad.filter((f) => f !== field) } : s.vbad,
  });
}

export function removeVar(id: string) {
  const s = st();
  const vars = s.vars.filter((v) => v.id !== id);
  const sel = { ...s.sel };
  delete sel[id];
  usePForm.setState({ vars, sel, dirty: vars.length ? s.dirty : false });
}

export function toggleSel(id: string) {
  const sel = { ...st().sel };
  if (sel[id]) delete sel[id];
  else sel[id] = true;
  usePForm.setState({ sel });
}

export function selectAll(ids: string[], on: boolean) {
  const sel = { ...st().sel };
  for (const id of ids) {
    if (on) sel[id] = true;
    else delete sel[id];
  }
  usePForm.setState({ sel });
}

/** The variants a bulk action applies to: the selected ones, or all when nothing is selected. */
export function targets(): { list: VarRow[]; selected: boolean } {
  const s = st();
  const list = s.vars.filter((v) => s.sel[v.id]);
  return list.length ? { list, selected: true } : { list: s.vars, selected: false };
}

export function bulkEdit(b: { price: string; old: string; mode: 'set' | 'add'; stock: string; on: '' | '1' | '0' }): number {
  const ids = new Set(targets().list.map((v) => v.id));
  usePForm.setState({
    vars: st().vars.map((v) => {
      if (!ids.has(v.id)) return v;
      const n = { ...v };
      if (b.price) n.price = b.price;
      if (b.old) n.old = Number(b.old) > 0 ? b.old : '';
      if (b.stock) n.stock = String(b.mode === 'add' ? Math.max(0, (Number(numText(v.stock)) || 0) + Number(b.stock)) : Number(b.stock));
      if (b.on) n.on = b.on === '1';
      return n;
    }),
  });
  return ids.size;
}

/** PREFIX-BLA-M style SKUs, never repeating one already used (website FORM.vsku). */
export function makeSkus(prefix: string, mode: 'empty' | 'all') {
  const s = st();
  const pre = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const t = new Set(targets().list.map((v) => v.id));
  const used = new Set<string>();
  for (const v of s.vars) if (v.sku && (mode === 'empty' || !t.has(v.id))) used.add(v.sku.toUpperCase());
  let idx = 0;
  const vars = s.vars.map((v) => {
    if (!t.has(v.id)) return v;
    idx++;
    if (mode === 'empty' && v.sku) return v;
    const parts = s.attrs.map((a) => (v.o[a.n] ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || `V${idx}`);
    const base = [pre, ...parts].join('-');
    let sku = base;
    let k = 2;
    while (used.has(sku)) sku = `${base}-${k++}`;
    used.add(sku);
    return { ...v, sku };
  });
  usePForm.setState({ vars });
}

/** Sets a variant photo: on one variant, on all variants of its colour, or on every variant of a colour option. */
export function setVarImg(target: { vid: string; allColor: boolean } | { attr: string; opt: string }, url: string) {
  const s = st();
  const ca = s.attrs.find((a) => a.t === 'color');
  let pick: (v: VarRow) => boolean;
  if ('vid' in target) {
    const v = s.vars.find((x) => x.id === target.vid);
    if (!v) return;
    const col = ca ? v.o[ca.n] : undefined;
    pick = target.allColor && ca && col !== undefined ? (x) => x.o[ca.n] === col : (x) => x.id === target.vid;
  } else {
    pick = (x) => x.o[target.attr] === target.opt;
  }
  usePForm.setState({ vars: s.vars.map((x) => (pick(x) ? { ...x, img: url } : x)) });
}

export const isLow = (v: VarRow) => {
  const s = Number(numText(v.stock)) || 0;
  return s > 0 && s <= (Number(numText(v.low)) || 0);
};
export const isOut = (v: VarRow) => (Number(numText(v.stock)) || 0) <= 0;
