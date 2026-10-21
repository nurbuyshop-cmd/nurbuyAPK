import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { setStock, setVariantStock, type Product } from '@/api/products';
import { errorText, fieldText } from '@/lib/errors';
import { isWhole, money, numText } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, fonts } from '@/theme';

import { Button } from './Button';
import { Sheet } from './Sheet';
import { Switch } from './Switch';
import { Txt } from './Txt';

/** Stock of a simple product with - / + buttons (website ACT.pstock). */
export function StockSheet({ p, onClose, onSaved }: { p: Product; onClose: () => void; onSaved: (p: Product) => void }) {
  const { t, lang } = useLang();
  const [v, setV] = useState(String(p.stock));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const add = (d: number) => {
    const x = parseInt(numText(v), 10);
    setV(String(Math.max(0, (Number.isNaN(x) ? 0 : x) + d)));
    setErr('');
  };
  const save = async () => {
    const raw = numText(v);
    if (!isWhole(raw) || Number(raw) > 1000000) {
      setErr(t('fStock'));
      return;
    }
    setBusy(true);
    try {
      onSaved(await setStock(p.id, Number(raw)));
      toast(t('stockUpdated'), 'ok');
      onClose();
    } catch (e) {
      setBusy(false);
      toast(fieldText(e, t) || errorText(e, t), 'bad');
    }
  };
  return (
    <Sheet title={t('updateStock')} sub={lang === 'bn' && p.bn ? p.bn : p.name} onClose={onClose}>
      <View style={styles.stepper}>
        <Pressable onPress={() => add(-1)} style={styles.stepBtn} accessibilityLabel="-1">
          <Txt weight="bold" size={26} color={colors.primary} latin>−</Txt>
        </Pressable>
        <TextInput
          value={v}
          onChangeText={(x) => {
            setV(x);
            setErr('');
          }}
          keyboardType="number-pad"
          maxLength={7}
          style={styles.stepInput}
          accessibilityLabel={t('stock')}
        />
        <Pressable onPress={() => add(1)} style={styles.stepBtn} accessibilityLabel="+1">
          <Txt weight="bold" size={26} color={colors.primary} latin>+</Txt>
        </Pressable>
      </View>
      {err ? <Txt size={13} color={colors.danger} style={styles.center}>{err}</Txt> : null}
      <Txt size={12.5} color={colors.grey} style={styles.center}>{t('stockNow')}</Txt>
      <Button label={t('save')} busy={busy} onPress={() => void save()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** Stock and on/off of each variant, saved at once without a review (website vstkHtml()). */
export function VariantStockSheet({ p, onClose, onSaved }: { p: Product; onClose: () => void; onSaved: (p: Product) => void }) {
  const { t, lang } = useLang();
  const vs = p.vr?.v ?? [];
  const [rows, setRows] = useState(() => vs.map((v) => ({ id: v.id, stock: String(v.stock), on: v.on })));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    const out: { id: string; stock: number; on: number }[] = [];
    for (const r of rows) {
      const s = numText(r.stock);
      if (!isWhole(s) || Number(s) > 1000000) {
        setErr(t('fStock'));
        return;
      }
      out.push({ id: r.id, stock: Number(s), on: r.on ? 1 : 0 });
    }
    setBusy(true);
    try {
      onSaved(await setVariantStock(p.id, out));
      toast(t('stockUpdated'), 'ok');
      onClose();
    } catch (e) {
      setBusy(false);
      toast(fieldText(e, t) || errorText(e, t), 'bad');
    }
  };
  return (
    <Sheet title={t('updateVarStock')} sub={lang === 'bn' && p.bn ? p.bn : p.name} onClose={onClose}>
      {vs.map((v, i) => {
        const r = rows[i];
        if (!r) return null;
        return (
          <View key={v.id} style={styles.vrow}>
            <View style={styles.flex}>
              <Txt weight="semibold" size={14.5}>{v.name}</Txt>
              <Txt size={12.5} color={colors.grey}>{`${v.sku ? `${v.sku} - ` : ''}${money(v.price, lang)}`}</Txt>
            </View>
            <TextInput
              value={r.stock}
              onChangeText={(x) => {
                setRows((s) => s.map((y, k) => (k === i ? { ...y, stock: x } : y)));
                setErr('');
              }}
              keyboardType="number-pad"
              maxLength={7}
              style={styles.vin}
              accessibilityLabel={t('stock')}
            />
            <Switch value={r.on} label={t('active')} onChange={(on) => setRows((s) => s.map((y, k) => (k === i ? { ...y, on } : y)))} />
          </View>
        );
      })}
      {err ? <Txt size={13} color={colors.danger}>{err}</Txt> : null}
      <Button label={t('updateStock')} busy={busy} onPress={() => void save()} />
      <Txt size={12.5} color={colors.grey} style={styles.center}>{t('varStockNow')}</Txt>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  center: { textAlign: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  stepBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e8edff', alignItems: 'center', justifyContent: 'center' },
  stepInput: { width: 120, height: 56, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 14, textAlign: 'center', fontSize: 24, fontFamily: fonts.en.bold, color: colors.text },
  vrow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  vin: { width: 76, height: 44, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 10, textAlign: 'center', fontSize: 16, fontFamily: fonts.en.semibold, color: colors.text },
});
