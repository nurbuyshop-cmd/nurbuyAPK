import { Pressable, StyleSheet } from 'react-native';

import { useFollows } from '@/store/follows';
import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Follow / Following toggle for a shop; a guest is asked to log in first. */
export function FollowButton({ storeId, compact }: { storeId: string; compact?: boolean }) {
  const t = useT();
  const on = useFollows((s) => s.ids.includes(storeId));
  const toggle = useFollows((s) => s.toggle);
  return (
    <Pressable
      onPress={() => toggle(storeId)}
      style={[styles.btn, on && styles.on, compact && styles.compact]}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={on ? t('followingBtn') : t('follow')}
    >
      <Icon name={on ? 'heartOn' : 'heart'} size={16} color={on ? colors.white : colors.primary} strokeWidth={2.2} />
      {compact ? null : <Txt weight="bold" size={13} color={on ? colors.white : colors.primary}>{on ? t('followingBtn') : t('follow')}</Txt>}
    </Pressable>
  );
}

/** Follower count, updated right after a follow tap. */
export function useFollowerCount(storeId: string, catalogCount: number): number {
  return useFollows((s) => s.counts[storeId]) ?? catalogCount;
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.white },
  on: { backgroundColor: colors.primary },
  compact: { width: TOUCH - 6, height: TOUCH - 6, paddingHorizontal: 0, justifyContent: 'center', borderRadius: (TOUCH - 6) / 2 },
});
