import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { Txt, useInputFont } from '@/components/Txt';
import { Card } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { useLang } from '@/store/i18n';
import { catName, newKey, usePForm, type FormV } from '@/store/pform';
import { colors } from '@/theme';

type FieldProps = { k: keyof FormV; label: string; hint?: string; required?: boolean; rows?: number; max?: number; kb?: 'decimal-pad' | 'number-pad'; caps?: 'words' | 'characters' };

/** A form field bound to the product form store. */
function PField({ k, label, hint, required, rows, max, kb, caps }: FieldProps) {
  const val = usePForm((s) => s.v[k]);
  const err = usePForm((s) => s.errs[k]);
  return (
    <Field
      label={label}
      hint={hint}
      required={required}
      rows={rows}
      maxLength={max}
      keyboardType={kb}
      autoCapitalize={caps ?? 'sentences'}
      value={val}
      onChangeText={(x) => usePForm.getState().setV(k, x)}
      error={err || undefined}
    />
  );
}

/** Name, Bengali name, product ID and the category (main + any deeper level, website subHtml()). */
export function BasicCard() {
  const { t, f, lang } = useLang();
  const meta = usePForm((s) => s.meta);
  const cat = usePForm((s) => s.v.cat);
  const cp = usePForm((s) => s.cp);
  const catErr = usePForm((s) => s.errs.cat);
  const cats = meta?.cats ?? [];
  const root = cats.find((c) => c.n === cat);

  // one optional dropdown per deeper level, as long as the chosen category has sub-categories
  const levels: { k: number; node: NonNullable<typeof root>; sel: number | null; names: string[] }[] = [];
  const names: string[] = root ? [catName(root, lang)] : [];
  let node = root;
  for (let k = 0; node && node.subs.length; k++) {
    const id = cp[k] ?? null;
    const nx = id ? node.subs.find((x) => x.id === id) : undefined;
    levels.push({ k, node, sel: nx ? nx.id : null, names: [...names] });
    if (!nx) break;
    names.push(catName(nx, lang));
    node = nx;
  }

  return (
    <Card title={t('basicInfo')}>
      <PField k="name" label={t('productName')} required max={150} caps="words" />
      <PField k="bn" label={t('bnName')} max={150} />
      <PField k="pcode" label={t('pcode')} max={30} caps="characters" hint={t('pcodeHint')} />
      {cats.length ? (
        <Select
          label={t('mainCategory')}
          required
          value={cat || null}
          placeholder={t('chooseCat')}
          options={cats.map((c) => ({ value: c.n, label: catName(c, lang) }))}
          onChange={(v) => usePForm.getState().setCat(v)}
          error={catErr || undefined}
        />
      ) : (
        <PField k="cat" label={t('category')} required max={120} />
      )}
      {levels.map((l) => (
        <Select
          key={`${l.k}-${l.node.id}`}
          label={l.k ? t('moreSpecific') : t('subCat')}
          value={l.sel ?? 0}
          options={[
            { value: 0, label: l.k ? f('keepCat', { c: l.names[l.names.length - 1] ?? '' }) : t('noSubCat') },
            ...l.node.subs.map((x) => ({ value: x.id, label: catName(x, lang) })),
          ]}
          onChange={(v) => usePForm.getState().setLevel(l.k, v || null)}
        />
      ))}
      {names.length > 1 ? <Txt size={12.5} color={colors.grey} style={styles.under}>{f('shownUnder', { p: names.join(' › ') })}</Txt> : null}
    </Card>
  );
}

/** Simple / variable, stock tracking, price, old price, stock and the per-order limit. */
export function PriceCard() {
  const { t } = useLang();
  const type = usePForm((s) => s.type);
  const so = usePForm((s) => s.so);
  const set = usePForm((s) => s.set);
  return (
    <Card title={t('pricingStock')}>
      <Txt weight="semibold" size={13.5} color="#333" style={styles.lab}>{t('productType')}</Txt>
      <View style={styles.seg}>
        {(['simple', 'var'] as const).map((k) => {
          const on = type === k;
          return (
            <Pressable key={k} onPress={() => set({ type: k })} style={[styles.segBtn, on && styles.segOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
              <Txt weight="bold" size={14.5} color={on ? colors.white : colors.text}>{k === 'simple' ? t('simple') : t('variable')}</Txt>
            </Pressable>
          );
        })}
      </View>
      <Txt size={12.5} color={colors.grey} style={styles.hint}>{type === 'var' ? t('variableHint') : t('simpleHint')}</Txt>

      <View style={styles.swRow}>
        <Txt weight="semibold" size={14.5} style={styles.flex}>{t('trackStock')}</Txt>
        <Switch value={so} label={t('trackStock')} onChange={(v) => set({ so: v })} />
      </View>
      <Txt size={12.5} color={colors.grey} style={styles.hint}>{so ? t('trackOn') : t('trackOff')}</Txt>

      {type === 'simple' ? (
        <>
          <View style={styles.two}>
            <View style={styles.flex}>
              <PField k="price" label={t('sellPrice')} required max={12} kb="decimal-pad" />
            </View>
            <View style={styles.flex}>
              <PField k="old" label={t('oldPriceOpt')} max={12} kb="decimal-pad" />
            </View>
          </View>
          {so ? <PField k="stock" label={t('stockQty')} required max={7} kb="number-pad" /> : null}
        </>
      ) : null}
      <PField k="max_q" label={t('maxQ')} max={2} kb="number-pad" hint={t('maxQHint')} />
    </Card>
  );
}

export function DescCard() {
  const { t } = useLang();
  return (
    <Card title={t('description')}>
      <PField k="about" label={t('aboutEn')} rows={5} max={3000} />
      <PField k="about_bn" label={t('aboutBn')} rows={5} max={3000} hint={t('aboutHint')} />
    </Card>
  );
}

export function TagsCard() {
  const { t } = useLang();
  return (
    <Card title={t('tagsTitle')}>
      <PField k="tags" label={t('tags')} max={400} hint={t('tagsHint')} />
    </Card>
  );
}

/** Key / value rows shown as a table on the product page (max 20). */
export function SpecsCard() {
  const { t } = useLang();
  const font = useInputFont();
  const specs = usePForm((s) => s.specs);
  const setRow = (key: string, part: 'k' | 'v', val: string) => usePForm.setState({ specs: usePForm.getState().specs.map((r) => (r.key === key ? { ...r, [part]: val } : r)) });
  return (
    <Card title={t('specsTitle')}>
      <Txt size={13} color={colors.grey} style={styles.specSub}>{t('specsSub')}</Txt>
      {specs.map((r) => (
        <View key={r.key} style={styles.specRow}>
          <TextInput value={r.k} onChangeText={(x) => setRow(r.key, 'k', x)} maxLength={60} placeholder={t('specKeyPh')} placeholderTextColor="#9aa1b8" style={[styles.specIn, styles.specK, { fontFamily: font }]} />
          <TextInput value={r.v} onChangeText={(x) => setRow(r.key, 'v', x)} maxLength={200} placeholder={t('specValPh')} placeholderTextColor="#9aa1b8" style={[styles.specIn, styles.specV, { fontFamily: font }]} />
          <Pressable onPress={() => usePForm.setState({ specs: usePForm.getState().specs.filter((x) => x.key !== r.key) })} style={styles.specX} accessibilityLabel={t('remove')}>
            <Icon name="x" size={17} color={colors.grey} />
          </Pressable>
        </View>
      ))}
      {specs.length < 20 ? (
        <Button small variant="secondary" icon="plus" label={t('addSpec')} onPress={() => usePForm.setState({ specs: [...usePForm.getState().specs, { key: newKey(), k: '', v: '' }] })} />
      ) : null}
    </Card>
  );
}

/** Coloured note at the top of the form (website pfBanner()). */
export function StatusNote() {
  const { t } = useLang();
  const p = usePForm((s) => s.p);
  const box = (tone: 'info' | 'warn' | 'bad', key: StringKey) => (
    <View style={[styles.note, tone === 'warn' ? styles.noteWarn : tone === 'bad' ? styles.noteBad : styles.noteInfo]}>
      <Icon name={tone === 'warn' ? 'clock' : 'info'} size={19} color={tone === 'warn' ? colors.warn : colors.primary} />
      <Txt size={14} style={styles.flex}>{t(key)}</Txt>
    </View>
  );
  if (!p) return box('info', 'pfNewBanner');
  if (p.status === 'rejected')
    return (
      <View style={styles.gap}>
        <View style={styles.rsn}>
          <Txt weight="bold" size={13} color={colors.danger}>{t('pfRejectedBy')}</Txt>
          <Txt size={15}>{p.reject_reason || '-'}</Txt>
        </View>
        {box('warn', 'pfFixSave')}
      </View>
    );
  if (p.status === 'pending') return box('warn', 'pfPending');
  return (
    <View style={styles.gap}>
      {box('info', 'pfLiveNote')}
      {p.chg ? box('warn', 'pfChgNote') : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  gap: { gap: 8 },
  under: { marginTop: -4, marginBottom: 4 },
  lab: { marginBottom: 6 },
  seg: { flexDirection: 'row', backgroundColor: '#eef0f6', borderRadius: 12, padding: 4, gap: 4 },
  segBtn: { flex: 1, minHeight: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.primary },
  hint: { marginTop: 5, marginBottom: 12 },
  swRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  two: { flexDirection: 'row', gap: 10 },
  specSub: { marginBottom: 10 },
  specRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  specIn: { height: 46, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 10, paddingHorizontal: 10, fontSize: 14.5, color: '#111', backgroundColor: '#fafbff' },
  specK: { flex: 1, minWidth: 0 },
  specV: { flex: 1.4, minWidth: 0 },
  specX: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 12 },
  noteInfo: { backgroundColor: colors.infoBg },
  noteWarn: { backgroundColor: colors.warnBg },
  noteBad: { backgroundColor: colors.dangerBg },
  rsn: { backgroundColor: colors.dangerBg, borderRadius: 14, padding: 14, gap: 4, borderLeftWidth: 4, borderLeftColor: colors.danger },
});
