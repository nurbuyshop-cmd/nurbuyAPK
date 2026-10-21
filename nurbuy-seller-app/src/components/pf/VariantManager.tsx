import { Image } from 'expo-image';
import { memo, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { PickSourceSheet } from '@/components/PickSourceSheet';
import { Select } from '@/components/Select';
import { Sheet } from '@/components/Sheet';
import { Switch } from '@/components/Switch';
import { Txt, useInputFont } from '@/components/Txt';
import { Card, Chip } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { isMoney, numText, priceRange } from '@/lib/format';
import { bulkEdit, isLow, isOut, makeSkus, removeVar, selectAll, setVar, setVarImg, targets, toggleSel } from '@/lib/variants';
import { useLang } from '@/store/i18n';
import { optLabel, usePForm, type VarRow } from '@/store/pform';
import { toast } from '@/store/toast';
import { colors, fonts } from '@/theme';

import { addPhotos } from './PhotosCard';
import { Swatch } from './VariantSetup';

type VFilter = 'all' | 'on' | 'off' | 'low' | 'out';
type VSort = 'def' | 'name' | 'pl' | 'ph' | 'sl';
const PAGE = 20;

type ImgTarget = { vid: string } | { attr: string; opt: string };

/** The generated variants: summary, colour photos, search, filters, bulk edit, SKUs and one card each (website drawVarMgr()). */
export function VariantManager() {
  const { t, f, n, lang } = useLang();
  const font = useInputFont();
  const meta = usePForm((s) => s.meta);
  const vars = usePForm((s) => s.vars);
  const attrs = usePForm((s) => s.attrs);
  const hex = usePForm((s) => s.hex);
  const so = usePForm((s) => s.so);
  const sel = usePForm((s) => s.sel);
  const [q, setQ] = useState('');
  const [vf, setVf] = useState<VFilter>('all');
  const [vs, setVs] = useState<VSort>('def');
  const [shown, setShown] = useState(PAGE);
  const [bulk, setBulk] = useState(false);
  const [sku, setSku] = useState(false);
  const [img, setImg] = useState<ImgTarget | null>(null);

  const list = useMemo(() => {
    const qq = q.toLowerCase();
    let r = vars.filter((v) => {
      if (qq && !`${v.name} ${v.sku} ${v.bar}`.toLowerCase().includes(qq)) return false;
      if (vf === 'on') return v.on;
      if (vf === 'off') return !v.on;
      if (vf === 'low') return isLow(v);
      if (vf === 'out') return isOut(v);
      return true;
    });
    const P = (v: VarRow) => Number(numText(v.price)) || 0;
    const S = (v: VarRow) => Number(numText(v.stock)) || 0;
    if (vs === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else if (vs === 'pl') r = [...r].sort((a, b) => P(a) - P(b));
    else if (vs === 'ph') r = [...r].sort((a, b) => P(b) - P(a));
    else if (vs === 'sl') r = [...r].sort((a, b) => S(a) - S(b));
    return r;
  }, [vars, q, vf, vs]);

  if (!vars.length) {
    return (
      <Card title={t('variants')}>
        <Txt size={14} color={colors.grey}>{t('varsEmpty')}</Txt>
      </Card>
    );
  }

  const on = vars.filter((v) => v.on);
  const stock = on.reduce((x, v) => x + (Number(numText(v.stock)) || 0), 0);
  const prices = on.map((v) => numText(v.price)).filter(isMoney).map(Number);
  const ca = attrs.find((a) => a.t === 'color');
  const selCount = vars.filter((v) => sel[v.id]).length;
  const allSel = list.length > 0 && list.every((v) => sel[v.id]);
  const filters: [VFilter, StringKey][] = [['all', 'pfAll'], ['on', 'vfActive'], ['off', 'vfInactive'], ['low', 'vfLow'], ['out', 'vfOut']];

  return (
    <Card title={t('variants')}>
      <View style={styles.sum}>
        <Txt size={13.5} weight="semibold">{f('varSummary', { n: vars.length, a: on.length, s: stock })}</Txt>
        <Txt size={13.5} weight="bold" color={colors.primary}>{`${t('price')} ${priceRange(prices, lang)}`}</Txt>
      </View>

      {ca && ca.opts.length ? (
        <>
          <Txt size={13} color={colors.grey} style={styles.mt}>{t('colorPhotos')}</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cimgs}>
            {ca.opts.map((o) => {
              const u = vars.find((v) => v.o[ca.n] === o && v.img)?.img;
              return (
                <Pressable key={o} onPress={() => setImg({ attr: ca.n, opt: o })} style={styles.cimg} accessibilityRole="button">
                  <View style={styles.cth}>{u ? <Image source={{ uri: u }} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Icon name="img" size={22} color={colors.grey} />}</View>
                  <View style={styles.cnm}>
                    <Swatch hex={hex[o] ?? '#888888'} size={11} />
                    <Txt size={12} numberOfLines={1}>{optLabel(meta, ca.n, o, lang)}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.grey} />
        <TextInput value={q} onChangeText={setQ} placeholder={t('searchVars')} placeholderTextColor="#9aa1b8" style={[styles.searchIn, { fontFamily: font }]} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map(([k, label]) => (
          <Pressable key={k} onPress={() => setVf(k)} style={[styles.fc, vf === k && styles.fcOn]} accessibilityRole="button">
            <Txt size={13} weight="semibold" color={vf === k ? colors.white : colors.text}>{t(label)}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      <Select
        label=""
        value={vs}
        options={[
          { value: 'def', label: t('sortDef') },
          { value: 'name', label: t('sortName') },
          { value: 'pl', label: t('sortPl') },
          { value: 'ph', label: t('sortPh') },
          { value: 'sl', label: t('sortSl') },
        ]}
        onChange={(v) => setVs(v)}
      />
      <View style={styles.tools}>
        <Pressable onPress={() => selectAll(list.map((v) => v.id), !allSel)} style={styles.selAll} accessibilityRole="checkbox" accessibilityState={{ checked: allSel }}>
          <Check on={allSel} />
          <Txt size={14}>{t('selectAll')}</Txt>
        </Pressable>
        <Button small variant="secondary" icon="edit" label={`${t('bulkEdit')}${selCount ? ` (${n(selCount)})` : ''}`} onPress={() => setBulk(true)} />
        <Button small variant="secondary" icon="tag" label={t('genSkus')} onPress={() => setSku(true)} />
      </View>

      {list.length ? (
        <View style={styles.list}>
          {list.slice(0, shown).map((v) => (
            <VariantCard key={v.id} id={v.id} so={so} onImg={() => setImg({ vid: v.id })} />
          ))}
          {list.length > shown ? <Button variant="secondary" label={f('showMore', { n: list.length - shown })} onPress={() => setShown(shown + PAGE)} /> : null}
        </View>
      ) : (
        <Txt size={14} color={colors.grey} style={styles.mt}>{t('noVarsMatch')}</Txt>
      )}

      {bulk ? <BulkSheet onClose={() => setBulk(false)} /> : null}
      {sku ? <SkuSheet onClose={() => setSku(false)} /> : null}
      {img ? <VarImageSheet target={img} onClose={() => setImg(null)} /> : null}
    </Card>
  );
}

function Check({ on }: { on: boolean }) {
  return <View style={[styles.check, on && styles.checkOn]}>{on ? <Icon name="check" size={15} color={colors.white} strokeWidth={3} /> : null}</View>;
}

/** Small labelled input inside a variant card. */
function VIn({ label, value, onChange, bad, kb, max, ph }: { label: string; value: string; onChange: (v: string) => void; bad?: boolean; kb?: 'decimal-pad' | 'number-pad'; max?: number; ph?: string }) {
  const font = useInputFont();
  return (
    <View style={styles.vin}>
      <Txt size={12} color={colors.grey} numberOfLines={1}>{label}</Txt>
      <TextInput value={value} onChangeText={onChange} keyboardType={kb} maxLength={max ?? 40} placeholder={ph} placeholderTextColor="#9aa1b8" autoCapitalize="none" style={[styles.vinIn, { fontFamily: kb ? fonts.en.semibold : font }, bad && styles.bad]} />
    </View>
  );
}

const VariantCard = memo(function VariantCard({ id, so, onImg }: { id: string; so: boolean; onImg: () => void }) {
  const { t, lang } = useLang();
  const font = useInputFont();
  const v = usePForm((s) => s.vars.find((x) => x.id === id));
  const attrs = usePForm((s) => s.attrs);
  const hex = usePForm((s) => s.hex);
  const meta = usePForm((s) => s.meta);
  const picked = usePForm((s) => !!s.sel[id]);
  const bad = usePForm((s) => s.vbad[id]);
  const [more, setMore] = useState(false);
  if (!v) return null;
  const isBad = (f: string) => !!bad?.includes(f);
  const set = (f: keyof VarRow) => (x: string) => setVar(id, f, x);
  return (
    <View style={[styles.vcard, !v.on && styles.vcardOff]}>
      <View style={styles.vtop}>
        <Pressable onPress={() => toggleSel(id)} hitSlop={6} accessibilityRole="checkbox" accessibilityState={{ checked: picked }}>
          <Check on={picked} />
        </Pressable>
        <Pressable onPress={onImg} style={styles.vth} accessibilityLabel={t('varImage')}>
          {v.img ? <Image source={{ uri: v.img }} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Icon name="camera" size={20} color={colors.grey} />}
        </Pressable>
        <View style={styles.flex}>
          <TextInput value={v.name} onChangeText={set('name')} maxLength={120} accessibilityLabel={t('variantName')} style={[styles.vname, { fontFamily: font }, isBad('name') && styles.bad]} />
          <View style={styles.tags}>
            {attrs.map((a) => {
              const o = v.o[a.n] ?? '';
              const hx = a.t === 'color' ? hex[o] : undefined;
              return (
                <View key={a.n} style={styles.vtag}>
                  {hx ? <Swatch hex={hx} size={10} /> : null}
                  <Txt size={11.5}>{optLabel(meta, a.n, o, lang)}</Txt>
                </View>
              );
            })}
            {so && isOut(v) ? <Chip label={t('outOfStock')} tone="red" /> : so && isLow(v) ? <Chip label={t('lowStock')} tone="amber" /> : null}
          </View>
        </View>
        <Switch value={v.on} label={t('active')} onChange={(x) => setVar(id, 'on', x)} />
      </View>
      <View style={styles.grid}>
        <VIn label={t('sellPrice')} value={v.price} onChange={set('price')} kb="decimal-pad" max={12} bad={isBad('price')} />
        <VIn label={t('oldPrice')} value={v.old} onChange={set('old')} kb="decimal-pad" max={12} bad={isBad('old')} />
        {so ? <VIn label={t('stock')} value={v.stock} onChange={set('stock')} kb="number-pad" max={7} bad={isBad('stock')} /> : null}
        <VIn label="SKU" value={v.sku} onChange={set('sku')} bad={isBad('sku')} />
      </View>
      <Pressable onPress={() => setMore(!more)} style={styles.moreBtn} accessibilityRole="button">
        <Txt size={13} color={colors.primary} weight="semibold">{more ? t('lessVar') : t('moreVar')}</Txt>
      </Pressable>
      {more || isBad('low') ? (
        <>
          <View style={styles.grid}>
            <VIn label={t('lowAlert')} value={v.low} onChange={set('low')} kb="number-pad" max={5} bad={isBad('low')} />
            <VIn label={t('barcode')} value={v.bar} onChange={set('bar')} />
            <VIn label={t('weight')} value={v.wt} onChange={set('wt')} max={20} ph="500g" />
          </View>
          <Button small variant="danger" icon="trash" label={t('removeVar')} onPress={() => removeVar(id)} />
        </>
      ) : null}
    </View>
  );
});

function TargetNote() {
  const { f } = useLang();
  const tg = targets();
  return <Txt size={13} color={colors.grey}>{tg.selected ? f('appliesSel', { n: tg.list.length }) : f('appliesAll', { n: tg.list.length })}</Txt>;
}

function BulkSheet({ onClose }: { onClose: () => void }) {
  const { t, f } = useLang();
  const [b, setB] = useState({ price: '', old: '', mode: 'set' as 'set' | 'add', stock: '', on: '' as '' | '1' | '0' });
  const [err, setErr] = useState<{ price?: string; old?: string; stock?: string }>({});
  const apply = () => {
    const price = numText(b.price);
    const old = numText(b.old);
    const stock = numText(b.stock);
    const e: typeof err = {};
    if (price !== '' && (!isMoney(price) || Number(price) <= 0)) e.price = t('fPrice');
    if (old !== '' && !isMoney(old)) e.old = t('fOld');
    if (stock !== '' && !(b.mode === 'add' ? /^-?\d+$/ : /^\d+$/).test(stock)) e.stock = t('fStock');
    setErr(e);
    if (Object.keys(e).length) return;
    const c = bulkEdit({ price, old, mode: b.mode, stock, on: b.on });
    toast(f('updatedN', { n: c }), 'ok');
    onClose();
  };
  return (
    <Sheet title={t('bulkEdit')} onClose={onClose}>
      <TargetNote />
      <Txt size={13} color={colors.grey}>{t('keepEmpty')}</Txt>
      <Field label={t('sellPrice')} value={b.price} onChangeText={(x) => setB({ ...b, price: x })} keyboardType="decimal-pad" error={err.price} />
      <Field label={t('oldClears')} value={b.old} onChangeText={(x) => setB({ ...b, old: x })} keyboardType="decimal-pad" error={err.old} />
      <Select label={t('stockMode')} value={b.mode} options={[{ value: 'set', label: t('setTo') }, { value: 'add', label: t('addSub') }]} onChange={(x) => setB({ ...b, mode: x })} />
      <Field label={t('quantity')} value={b.stock} onChangeText={(x) => setB({ ...b, stock: x })} keyboardType="numbers-and-punctuation" error={err.stock} />
      <Select
        label={t('status')}
        value={b.on}
        options={[
          { value: '', label: t('keepAsIs') },
          { value: '1', label: t('setActive') },
          { value: '0', label: t('setInactive') },
        ]}
        onChange={(x) => setB({ ...b, on: x })}
      />
      <Button label={t('apply')} onPress={apply} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

function SkuSheet({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const name = usePForm((s) => s.v.name);
  const [pre, setPre] = useState(() => name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'SKU');
  const [mode, setMode] = useState<'empty' | 'all'>('empty');
  const [err, setErr] = useState('');
  const go = () => {
    if (!pre.toUpperCase().replace(/[^A-Z0-9]/g, '')) {
      setErr(t('enterPrefix'));
      return;
    }
    makeSkus(pre, mode);
    toast(t('skusDone'), 'ok');
    onClose();
  };
  return (
    <Sheet title={t('genSkus')} onClose={onClose}>
      <TargetNote />
      <Txt size={13} color={colors.grey}>{t('skuExample')}</Txt>
      <Field label={t('prefix')} required value={pre} onChangeText={setPre} maxLength={12} autoCapitalize="characters" error={err} />
      <Select label={t('existingSkus')} value={mode} options={[{ value: 'empty', label: t('fillEmpty') }, { value: 'all', label: t('overwriteAll') }]} onChange={setMode} />
      <Button label={t('generate')} onPress={go} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** Picks a variant photo from the product photos, uploads a new one, or clears it (website vImgSheet()). */
function VarImageSheet({ target, onClose }: { target: ImgTarget; onClose: () => void }) {
  const { t, f, lang } = useLang();
  const all = usePForm((s) => s.imgs);
  const imgs = all.filter((x) => !x.tmp);
  const meta = usePForm((s) => s.meta);
  const ca = usePForm((s) => s.attrs.find((a) => a.t === 'color'));
  const v = usePForm((s) => ('vid' in target ? s.vars.find((x) => x.id === target.vid) : undefined));
  const [allColor, setAllColor] = useState(true);
  const [pick, setPick] = useState(false);
  const colorOfV = ca && v ? v.o[ca.n] : undefined;
  const apply = (url: string) => {
    setVarImg('vid' in target ? { vid: target.vid, allColor: allColor && colorOfV !== undefined } : target, url);
    onClose();
  };
  const title = 'vid' in target ? v?.name ?? '' : optLabel(meta, target.attr, target.opt, lang);
  return (
    <Sheet title={t('varImage')} sub={title} onClose={onClose}>
      <View style={styles.pgrid}>
        {imgs.map((x) => (
          <Pressable key={x.key} onPress={() => apply(x.url)} style={styles.ptile} accessibilityRole="button">
            <Image source={{ uri: x.url }} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Pressable>
        ))}
        <Pressable onPress={() => setPick(true)} style={[styles.ptile, styles.padd]} accessibilityRole="button">
          <Icon name="camera" size={24} color={colors.primary} />
          <Txt size={12} color={colors.primary} weight="semibold">{t('upload')}</Txt>
        </Pressable>
      </View>
      {'vid' in target && ca && colorOfV !== undefined ? (
        <Pressable onPress={() => setAllColor(!allColor)} style={styles.selAll} accessibilityRole="checkbox" accessibilityState={{ checked: allColor }}>
          <Check on={allColor} />
          <Txt size={14}>{f('applyColorAll', { c: optLabel(meta, ca.n, colorOfV, lang) })}</Txt>
        </Pressable>
      ) : null}
      <Button variant="danger" label={t('noImage')} onPress={() => apply('')} />
      {pick ? (
        <PickSourceSheet
          title={t('upload')}
          onClose={() => setPick(false)}
          onPick={(s) => {
            toast(t('uploading'));
            void addPhotos(s === 'camera' ? 'camera' : 'gallery', t).then((done) => {
              const first = done[0];
              if (first) apply(first.url);
            });
          }}
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  mt: { marginTop: 10 },
  sum: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6, padding: 10, borderRadius: 10, backgroundColor: '#f4f6fc' },
  cimgs: { gap: 8, paddingVertical: 8 },
  cimg: { width: 78, gap: 4 },
  cth: { width: 78, height: 78, borderRadius: 10, backgroundColor: '#eef1f8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cnm: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: '#dfe3f1', marginTop: 10, backgroundColor: '#fafbff' },
  searchIn: { flex: 1, fontSize: 14.5, color: colors.text, paddingVertical: 0 },
  filters: { gap: 6, paddingVertical: 10 },
  fc: { minHeight: 36, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', backgroundColor: colors.white },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tools: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: -4 },
  selAll: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingRight: 6 },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#b9c1d9', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  list: { gap: 10, marginTop: 10 },
  vcard: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 10, gap: 8, backgroundColor: colors.white },
  vcardOff: { backgroundColor: '#f7f7fa', opacity: 0.8 },
  vtop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vth: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#eef1f8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  vname: { height: 38, borderWidth: 1, borderColor: '#e1e5f0', borderRadius: 8, paddingHorizontal: 8, fontSize: 14, color: '#111' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4, alignItems: 'center' },
  vtag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: '#eef0f6' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vin: { flexBasis: '47%', flexGrow: 1, gap: 2 },
  vinIn: { height: 42, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 9, paddingHorizontal: 9, fontSize: 14.5, color: '#111', backgroundColor: '#fafbff' },
  bad: { borderColor: colors.danger, backgroundColor: '#fff5f6' },
  moreBtn: { minHeight: 34, justifyContent: 'center' },
  pgrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ptile: { width: 86, height: 86, borderRadius: 12, overflow: 'hidden', backgroundColor: '#eef1f8' },
  padd: { alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#b9c4ea' },
});
