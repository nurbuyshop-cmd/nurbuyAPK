import { Linking, Pressable, StyleSheet, View } from 'react-native';

import type { SellerNotif } from '@/api/seller';
import { ago } from '@/lib/format';
import { openPanelLink } from '@/lib/links';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

function iconOf(kind: string): IconName {
  return kind === 'order' ? 'list' : kind === 'boost' ? 'bolt' : kind === 'wallet' ? 'wallet' : 'bell';
}

/** Notification cards (website msgCards()); a card with a link opens that page of the app. */
export function NotifCards({ list }: { list: SellerNotif[] }) {
  const { t, lang } = useLang();
  return (
    <View style={styles.list}>
      {list.map((x) => {
        const link = x.url;
        const open = link
          ? () => {
              if (/^https?:\/\//.test(link)) void Linking.openURL(link);
              else openPanelLink(link);
            }
          : undefined;
        return (
          <Pressable key={x.id} onPress={open} disabled={!open} style={({ pressed }) => [styles.card, !x.read && styles.unread, pressed && styles.pressed]}>
            <View style={[styles.ic, !x.read && styles.icUn]}>
              <Icon name={iconOf(x.kind)} size={19} color={x.read ? colors.grey : colors.primary} />
            </View>
            <View style={styles.flex}>
              <Txt weight="bold" size={14.5}>{x.title}</Txt>
              {x.body ? <Txt size={14} color="#3c4257">{x.body}</Txt> : null}
              <Txt size={12} color={colors.grey}>
                {ago(x.at, lang)}
                {open ? ` · ${t('open')} ›` : ''}
              </Txt>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  unread: { backgroundColor: '#f5f7ff', borderColor: '#cdd6ff' },
  pressed: { opacity: 0.7 },
  ic: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  icUn: { backgroundColor: colors.infoBg },
  flex: { flex: 1, minWidth: 0, gap: 2 },
});
