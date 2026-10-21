import { Pressable, StyleSheet, View } from 'react-native';

import { colors, TOUCH } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type Props = { title: string; icon?: IconName; action?: { label: string; onPress: () => void }; extra?: { label: string; onPress: () => void } };

/** "Hot Deals ........ View All >" row above a home section. */
export function SectionHeader({ title, icon, action, extra }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.title}>
        {icon ? <Icon name={icon} size={20} color={colors.text} /> : null}
        <Txt weight="bold" size={18} numberOfLines={1} style={styles.flex}>{title}</Txt>
      </View>
      {action ? (
        <Pressable onPress={action.onPress} hitSlop={8} style={styles.link} accessibilityRole="button">
          <Txt weight="semibold" size={14} color={colors.grey}>{action.label + ' >'}</Txt>
        </Pressable>
      ) : null}
      {extra ? (
        <Pressable onPress={extra.onPress} hitSlop={8} style={styles.link} accessibilityRole="button">
          <Txt weight="semibold" size={14} color={colors.grey}>{extra.label}</Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 8, gap: 12 },
  title: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  flex: { flexShrink: 1 },
  link: { minHeight: TOUCH, justifyContent: 'center' },
});
