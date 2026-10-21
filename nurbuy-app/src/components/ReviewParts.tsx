import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Review, Reviews } from '@/api/reviews';
import { shortDate } from '@/lib/dates';
import { digits, useI18n, useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Stars } from './Stars';
import { Txt } from './Txt';

const AV_BG = ['#dbe7ff', '#ffe4d6', '#e0f5e9', '#f3e1ff', '#fff1c9', '#d9f1f5'];

/** Average, total and one bar per star count. */
export function RatingSummary({ rv }: { rv: Reviews }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  return (
    <View style={styles.sum}>
      <View style={styles.avg}>
        <Txt weight="bold" size={34}>{digits(rv.avg.toFixed(1), lang)}</Txt>
        <Stars value={rv.avg} size={15} />
        <Txt size={12.5} color={colors.grey}>{digits(rv.count, lang) + ' ' + t('ratings')}</Txt>
      </View>
      <View style={styles.bars}>
        {([5, 4, 3, 2, 1] as const).map((n) => {
          const pct = rv.count ? Math.round((rv.dist[n] * 100) / rv.count) : 0;
          return (
            <View key={n} style={styles.barRow}>
              <Txt size={12.5} style={styles.barN}>{digits(n, lang)}</Txt>
              <Icon name="star" size={11} color={colors.primary} />
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%` }]} />
              </View>
              <Txt size={12} color={colors.grey} style={styles.pct}>{digits(pct, lang)}%</Txt>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ReviewRowImpl({ r }: { r: Review }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  let h = 0;
  for (let i = 0; i < r.name.length; i++) h = (h * 31 + r.name.charCodeAt(i)) % 997;
  return (
    <View style={styles.row}>
      <View style={[styles.av, { backgroundColor: AV_BG[h % AV_BG.length] }]}>
        {r.img ? (
          <Image source={r.img} style={styles.avImg} contentFit="cover" accessibilityIgnoresInvertColors />
        ) : (
          <Txt weight="bold" size={15} color={colors.primary}>{(r.name.trim()[0] ?? '?').toUpperCase()}</Txt>
        )}
      </View>
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Txt weight="bold" size={14}>{r.name}</Txt>
          <Txt size={11.5} color="#12a150">{'✓ ' + t('verifiedBuyer')}</Txt>
        </View>
        <View style={styles.nameRow}>
          <Stars value={r.stars} size={12} />
          <Txt size={12} color="#8a8f9c">{shortDate(r.date * 1000, lang)}</Txt>
        </View>
        {r.text ? <Txt size={14} color="#333" style={styles.text}>{r.text}</Txt> : null}
      </View>
    </View>
  );
}

export const ReviewRow = memo(ReviewRowImpl);

const styles = StyleSheet.create({
  sum: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  avg: { alignItems: 'center', gap: 2, minWidth: 92 },
  bars: { flex: 1, gap: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  barN: { width: 12, textAlign: 'right' },
  track: { flex: 1, height: 7, borderRadius: 4, backgroundColor: '#eceef4', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  pct: { width: 38, textAlign: 'right' },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  av: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avImg: { width: 40, height: 40 },
  flex: { flex: 1, minWidth: 0, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  text: { lineHeight: 20, marginTop: 2 },
});
