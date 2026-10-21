import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { Txt, useInputFont } from '@/components/Txt';
import { Banner, Card, Chip } from '@/components/ui';
import { addAttr, addOpts, generate, goneOnGenerate, removeAttr, setHex, toggleOpt } from '@/lib/variants';
import { useLang } from '@/store/i18n';
import { attrCatalog, attrDef, attrLabel, MAXATTR, MAXVAR, optLabel, SWATCHES, usePForm } from '@/store/pform';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** Small round colour dot. */
export function Swatch({ hex, size = 14 }: { hex: string; size?: number }) {
  return <View style={[styles.sw, { width: size, height: size, borderRadius: size / 2, backgroundColor: hex }]} />;
}

/** Text box with an Add button (custom attribute / option). */
function AddRow({ ph, label, onAdd }: { ph: string; label: string; onAdd: (text: string) => boolean }) {
  const font = useInputFont();
  const [v, setV] = useState('');
  const go = () => {
    if (onAdd(v)) setV('');
  };
  return (
    <View style={styles.addRow}>
      <TextInput value={v} onChangeText={setV} placeholder={ph} placeholderTextColor="#9aa1b8" maxLength={40} onSubmitEditing={go} returnKeyType="done" style={[styles.addIn, { fontFamily: font }]} />
      <Button small variant="secondary" icon="plus" label={label} onPress={go} />
    </View>
  );
}

/** Step 1-3 of variants: attributes, their options and colours, then Generate (website drawVarSetup()). */
export function VariantSetup() {
  const { t, n, f, lang } = useLang();
  const meta = usePForm((s) => s.meta);
  const attrs = usePForm((s) => s.attrs);
  const hex = usePForm((s) => s.hex);
  const cat = usePForm((s) => s.v.cat);
  const dirty = usePForm((s) => s.dirty);
  const hasVars = usePForm((s) => s.vars.length > 0);
  const [showAll, setShowAll] = useState(false);
  const [confirm, setConfirm] = useState(0);
  const [colorFor, setColorFor] = useState<string | null>(null);

  const chosen = new Set(attrs.map((a) => a.n.toLowerCase()));
  const sug = attrCatalog(meta).filter((a) => !chosen.has(a.n.toLowerCase()) && (!a.cats.length || (!!cat && a.cats.includes(cat))));
  const oth = attrCatalog(meta).filter((a) => !chosen.has(a.n.toLowerCase()) && !sug.includes(a));
  const total = attrs.reduce((x, a) => x * a.opts.length, 1);
  const ready = attrs.length > 0 && attrs.every((a) => a.opts.length);

  const tryAdd = (name: string): boolean => {
    const e = addAttr(name);
    if (e) toast(t(e), 'bad');
    return !e;
  };

  const doGenerate = () => {
    if (!ready) {
      toast(t('needOpts'), 'bad');
      return;
    }
    if (total > MAXVAR) {
      toast(t('tooMany'), 'bad');
      return;
    }
    const gone = goneOnGenerate().length;
    if (gone) {
      setConfirm(gone);
      return;
    }
    run();
  };
  const run = () => {
    const [all, added] = generate();
    toast(f('varsReady', { n: all, a: added }), 'ok');
  };

  const chip = (name: string, label: string, onPress: () => void, on = false, swatch?: string, ghost = false) => (
    <Pressable key={name} onPress={onPress} style={[styles.chip, on && styles.chipOn, ghost && styles.chipGhost]} accessibilityRole="button" accessibilityState={{ selected: on }}>
      {swatch ? <Swatch hex={swatch} /> : !on && !ghost ? <Icon name="plus" size={14} color={colors.primary} /> : null}
      <Txt size={13.5} weight="semibold" color={on ? colors.white : colors.primary}>{label}</Txt>
    </Pressable>
  );

  return (
    <Card title={t('attrsTitle')}>
      <Txt size={13} color={colors.grey} style={styles.sub}>{t('attrsSub')}</Txt>
      {attrs.length < MAXATTR ? (
        <View style={styles.block}>
          <Txt size={13} color={colors.grey}>{cat ? f('suggestedFor', { c: cat }) : t('addAttr')}</Txt>
          <View style={styles.chips}>
            {sug.map((a) => chip(a.n, lang === 'bn' && a.bn ? a.bn : a.n, () => tryAdd(a.n)))}
            {showAll ? oth.map((a) => chip(a.n, lang === 'bn' && a.bn ? a.bn : a.n, () => tryAdd(a.n))) : null}
            {oth.length ? chip('_more', showAll ? t('fewerAttrs') : f('moreAttrs', { n: oth.length }), () => setShowAll(!showAll), false, undefined, true) : null}
          </View>
          <AddRow ph={t('customAttrPh')} label={t('customAttr')} onAdd={tryAdd} />
        </View>
      ) : null}

      {attrs.map((a, ai) => {
        const d = attrDef(meta, a.n);
        const list = [...(d?.opts.map((o) => o.n) ?? [])];
        for (const o of a.opts) if (!list.includes(o)) list.push(o);
        const isC = a.t === 'color';
        return (
          <View key={a.n} style={styles.attr}>
            <View style={styles.attrHead}>
              <Txt weight="bold" size={15}>{attrLabel(meta, a.n, lang)}</Txt>
              {isC ? <Chip label={t('colorChip')} tone="purple" /> : null}
              <Txt size={12.5} color={colors.grey} style={styles.flex}>{f('nSelected', { n: a.opts.length })}</Txt>
              <Pressable onPress={() => removeAttr(ai)} style={styles.x} accessibilityLabel={t('remove')}>
                <Icon name="x" size={17} color={colors.grey} />
              </Pressable>
            </View>
            <View style={styles.chips}>
              {list.map((o) => {
                const on = a.opts.includes(o);
                const hx = hex[o] ?? d?.opts.find((q) => q.n === o)?.hex;
                return chip(o, optLabel(meta, a.n, o, lang), () => toggleOpt(ai, o), on, isC && hx ? hx : undefined);
              })}
            </View>
            <AddRow ph={isC ? t('customColorPh') : t('customOptPh')} label={t('add')} onAdd={(x) => addOpts(ai, x) > 0} />
            {isC && a.opts.length ? (
              <View style={styles.colors}>
                {a.opts.map((o) => (
                  <Pressable key={o} onPress={() => setColorFor(o)} style={styles.colorRow} accessibilityRole="button">
                    <Swatch hex={hex[o] ?? '#888888'} size={26} />
                    <Txt size={14.5} weight="semibold" style={styles.flex}>{optLabel(meta, a.n, o, lang)}</Txt>
                    <Txt size={13} color={colors.primary}>{t('colorPick')}</Txt>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      {dirty && hasVars ? <Banner tone="warn">{t('optsChanged')}</Banner> : null}
      <Button icon="refresh" label={`${t('genVariants')}${ready ? ` (${n(total)})` : ''}`} disabled={!ready} onPress={doGenerate} style={styles.gen} />
      {total > MAXVAR ? <Txt size={13} color={colors.danger}>{t('tooMany')}</Txt> : null}

      {confirm ? (
        <Sheet title={f('removeVarsQ', { n: confirm })} sub={t('removeVarsSub')} onClose={() => setConfirm(0)}>
          <Button
            label={t('generate')}
            onPress={() => {
              setConfirm(0);
              run();
            }}
          />
          <Button label={t('cancel')} variant="secondary" onPress={() => setConfirm(0)} />
        </Sheet>
      ) : null}
      {colorFor ? (
        <Sheet title={t('colorPick')} sub={colorFor} onClose={() => setColorFor(null)}>
          <View style={styles.palette}>
            {SWATCHES.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  setHex(colorFor, c);
                  setColorFor(null);
                }}
                style={[styles.palBtn, hex[colorFor]?.toLowerCase() === c && styles.palOn]}
                accessibilityLabel={c}
              >
                <Swatch hex={c} size={40} />
              </Pressable>
            ))}
          </View>
        </Sheet>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  sub: { marginBottom: 10 },
  block: { gap: 8, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 38, paddingHorizontal: 12, borderRadius: 19, backgroundColor: colors.infoBg, borderWidth: 1, borderColor: '#cdd6ff' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipGhost: { backgroundColor: colors.white, borderStyle: 'dashed' },
  sw: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  addIn: { flex: 1, minWidth: 0, height: 44, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 10, paddingHorizontal: 10, fontSize: 14.5, color: '#111', backgroundColor: '#fafbff' },
  attr: { borderTopWidth: 1, borderTopColor: '#eef0f6', paddingTop: 12, marginTop: 12, gap: 8 },
  attrHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  x: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  colors: { gap: 6, marginTop: 4 },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#f6f7fb' },
  gen: { marginTop: 14 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  palBtn: { padding: 4, borderRadius: 26, borderWidth: 2, borderColor: 'transparent' },
  palOn: { borderColor: colors.primary },
});
