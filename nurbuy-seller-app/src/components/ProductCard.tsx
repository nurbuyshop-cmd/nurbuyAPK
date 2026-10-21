import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { setHidden, type Product } from '@/api/products';
import { errorText } from '@/lib/errors';
import { money, priceRange } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Txt } from './Txt';
import { Chip } from './ui';

type Props = { p: Product; onChanged: (p: Product) => void; onStock: (p: Product) => void; onDelete: (p: Product) => void; onBoost: (p: Product) => void };

/** One product with its status, stock and quick buttons (website pcard()). */
function ProductCardImpl({ p, onChanged, onStock, onDelete, onBoost }: Props) {
  const { t, f, lang } = useLang();
  const [busy, setBusy] = useState(false);
  const img = p.img_urls[0];
  const name = lang === 'bn' && p.bn ? p.bn : p.name;
  const vars = p.vr?.v ?? [];
  const open = () => router.push({ pathname: '/product/[id]', params: { id: String(p.id) } });

  const toggle = async () => {
    setBusy(true);
    try {
      const np = await setHidden(p.id, !p.hidden);
      toast(p.hidden ? t('liveAgain') : t('hiddenNow'), 'ok');
      onChanged(np);
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setBusy(false);
  };

  const live = vars.filter((v) => v.on);
  const price = vars.length ? priceRange((live.length ? live : vars).map((v) => v.price), lang) : money(p.price, lang);

  return (
    <View style={styles.card}>
      <Pressable onPress={open} style={styles.top} accessibilityRole="button">
        <View style={styles.img}>{img ? <Image source={{ uri: img }} style={styles.imgIn} contentFit="cover" /> : <Icon name="img" size={28} color={colors.grey} />}</View>
        <View style={styles.flex}>
          <Txt weight="semibold" size={15} numberOfLines={2}>{name}</Txt>
          <View style={styles.priceRow}>
            <Txt weight="bold" size={15.5} color={colors.primary}>{price}</Txt>
            {!vars.length && p.old > 0 ? <Txt size={13} color={colors.grey} style={styles.old}>{money(p.old, lang)}</Txt> : null}
          </View>
          <View style={styles.stockRow}>
            {!p.stock_on ? (
              <Txt size={12.5} color={colors.grey}>{t('noStockLimit')}</Txt>
            ) : (
              <Txt size={12.5} weight="semibold" color={p.stock === 0 ? colors.danger : p.stock <= 5 ? colors.warn : colors.grey}>
                {p.stock === 0 ? t('outOfStock') : f('stockN', { n: p.stock })}
              </Txt>
            )}
            {p.max_q > 0 ? <Txt size={12.5} color={colors.grey}>{` · ${f('maxPerOrder', { n: p.max_q })}`}</Txt> : null}
          </View>
          <View style={styles.chips}>
            {p.status === 'pending' ? (
              <Chip label={t('stPReview')} tone="amber" />
            ) : p.status === 'rejected' ? (
              <Chip label={t('stRejectedP')} tone="red" />
            ) : p.hidden ? (
              <Chip label={t('stHidden')} tone="grey" />
            ) : (
              <Chip label={t('stLive')} tone="green" />
            )}
            {p.status === 'active' && p.chg ? <Chip label={t('stEditReview')} tone="amber" /> : null}
            {vars.length ? <Chip label={f('nVariants', { n: vars.length })} tone="purple" /> : null}
          </View>
        </View>
      </Pressable>
      {p.status === 'rejected' && p.reject_reason ? (
        <View style={styles.rsn}>
          <Txt weight="bold" size={12.5} color={colors.danger}>{t('reason')}</Txt>
          <Txt size={14}>{p.reject_reason}</Txt>
        </View>
      ) : null}
      <View style={styles.acts}>
        <Button small variant="secondary" icon="edit" label={t('edit')} onPress={open} style={styles.act} />
        {p.stock_on ? <Button small variant="secondary" icon="box" label={t('stock')} onPress={() => onStock(p)} style={styles.act} /> : null}
        {p.status === 'active' ? (
          <Button small variant="secondary" icon={p.hidden ? 'eye' : 'eyeOff'} label={p.hidden ? t('show') : t('hide')} busy={busy} onPress={() => void toggle()} style={styles.act} />
        ) : null}
        <Pressable onPress={() => onDelete(p)} style={styles.del} accessibilityRole="button" accessibilityLabel={t('delete')}>
          <Icon name="trash" size={19} color={colors.danger} />
        </Pressable>
      </View>
      {p.status === 'active' && !p.hidden ? <Button small variant="orange" icon="bolt" label={t('boost')} onPress={() => onBoost(p)} /> : null}
    </View>
  );
}

export const ProductCard = memo(ProductCardImpl);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, gap: 10, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  top: { flexDirection: 'row', gap: 12 },
  img: { width: 84, height: 84, borderRadius: 12, backgroundColor: '#eef1f8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imgIn: { width: 84, height: 84 },
  flex: { flex: 1, minWidth: 0, gap: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  old: { textDecorationLine: 'line-through' },
  stockRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  rsn: { backgroundColor: colors.dangerBg, borderRadius: 10, padding: 10, gap: 2 },
  acts: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  act: { flex: 1, paddingHorizontal: 6 },
  del: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.dangerBg, alignItems: 'center', justifyContent: 'center' },
});
