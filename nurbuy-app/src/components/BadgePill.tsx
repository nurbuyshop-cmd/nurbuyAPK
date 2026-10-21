import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Badge } from '@/lib/products';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Txt } from './Txt';

/** Small label for a real sales or stock fact (see computeBadges). */
function BadgePillImpl({ badge, style }: { badge: Badge; style?: StyleProp<ViewStyle> }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  let text: string;
  let urgent = false;
  switch (badge.k) {
    case 'left':
      text = fmt(t('badgeLeft'), { n: badge.n }, lang);
      urgent = true;
      break;
    case 'sellingOut':
      text = t('badgeSellingOut');
      urgent = true;
      break;
    case 'best':
      text = t('badgeBest');
      break;
    case 'rank':
      text = fmt(t('badgeRank'), { n: badge.n, c: lang === 'bn' && badge.catBn ? badge.catBn : badge.cat }, lang);
      break;
    case 'sold':
      text = fmt(t('badgeSold'), { n: badge.n }, lang);
      break;
  }
  return (
    <View style={[styles.pill, urgent ? styles.urgent : styles.info, style]}>
      <Txt weight="bold" size={10.5} color={colors.white} numberOfLines={1}>{text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  urgent: { backgroundColor: colors.orange },
  info: { backgroundColor: colors.primary },
});

export const BadgePill = memo(BadgePillImpl);
