import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { isFinal, type OrderItem, type Pickup, type RiderOrder, type RStat } from '@/api/rider';
import { dateTime, initials, money } from '@/lib/format';
import { payText, RSTAT_LABEL } from '@/lib/labels';
import { useLang } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { Chip } from './ui';

/** Delivery step chip (website chip()). */
export function RChip({ rs }: { rs: RStat }) {
  const { t } = useLang();
  const [k, tone] = RSTAT_LABEL[rs];
  return <Chip label={t(k)} tone={tone} />;
}

const pad2 = (x: number) => (x < 10 ? '0' : '') + x;

/** Live mm:ss countdown to the deadline; orange in the last 5 minutes, red "Overdue" after it (website tickDl()). */
export function Countdown({ due }: { due: number }) {
  const { t, n } = useLang();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.round((due - now) / 1000);
  const over = diff < 0;
  const a = Math.abs(diff);
  const tone = over ? styles.dlOver : diff < 300 ? styles.dlSoon : null;
  const fg = over ? colors.danger : diff < 300 ? colors.warn : colors.primary;
  return (
    <View style={[styles.dl, tone]}>
      <Icon name="clock" size={16} color={fg} />
      <Txt size={13.5} weight="semibold" color={fg}>{`${over ? `${t('overdue')} ` : ''}${n(`${pad2(Math.floor(a / 60))}:${pad2(a % 60)}`)}`}</Txt>
    </View>
  );
}

/** "Collect ৳500" for cash on delivery, otherwise "Paid online" (website payBadge()). */
export function PayBadge({ o }: { o: RiderOrder }) {
  const { t, lang } = useLang();
  if (o.pay === 'cod')
    return (
      <View style={styles.cod}>
        <Txt size={14} color="#8a3d00">{t('collect')}</Txt>
        <Txt size={16.5} weight="bold" color="#8a3d00">{money(o.collect, lang)}</Txt>
      </View>
    );
  return (
    <View style={styles.paid}>
      <Icon name="check" size={15} color="#0b7a3b" />
      <Txt size={13.5} color="#0b7a3b">{payText(o.pay, t)}</Txt>
    </View>
  );
}

export const itemName = (it: OrderItem, lang: string) => (lang === 'bn' ? it.bn || it.n : it.n || it.bn);

function Thumb({ it, size }: { it: OrderItem; size: number }) {
  return (
    <View style={[styles.th, { width: size, height: size }]}>
      {it.img ? <Image source={{ uri: it.img }} style={{ width: size, height: size }} contentFit="cover" /> : <Txt size={13} color={colors.grey}>{it.e}</Txt>}
    </View>
  );
}

/** One product line with photo, variant, quantity x price and line total (website itRow()). */
export function ItemRow({ it }: { it: OrderItem }) {
  const { n, lang } = useLang();
  return (
    <View style={styles.it}>
      <Thumb it={it} size={48} />
      <View style={styles.flex}>
        <Txt weight="semibold" size={14.5}>{itemName(it, lang)}</Txt>
        {it.variant ? <Txt size={12.5} color={colors.grey}>{it.variant}</Txt> : null}
        <Txt size={13} color={colors.grey}>{`${n(it.q)} x ${money(it.unit, lang)}`}</Txt>
      </View>
      <Txt weight="bold" size={14.5}>{money(it.total, lang)}</Txt>
    </View>
  );
}

export const openLink = (url: string) => {
  if (url) void Linking.openURL(url);
};

/** Phone number as a button that starts a call (website .call). */
export function CallLink({ mobile }: { mobile: string }) {
  const { n } = useLang();
  const tel = mobile.replace(/[^\d+]/g, '');
  if (!tel) return <Txt size={14.5}>-</Txt>;
  return (
    <Pressable onPress={() => openLink(`tel:${tel}`)} style={styles.call} accessibilityRole="button" accessibilityLabel={mobile}>
      <Icon name="phone" size={17} color={colors.primary2} />
      <Txt weight="semibold" size={15} color={colors.primary2}>{n(mobile)}</Txt>
    </Pressable>
  );
}

/** Blue (or outlined) button that opens Google Maps (website .nav). */
export function NavButton({ label, url, outline, icon = 'nav' }: { label: string; url: string; outline?: boolean; icon?: 'nav' | 'pin' }) {
  return (
    <Pressable onPress={() => openLink(url)} style={({ pressed }) => [styles.nav, outline && styles.navO, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={label}>
      <Icon name={icon} size={19} color={outline ? colors.primary2 : colors.white} />
      <Txt weight="semibold" size={15} color={outline ? colors.primary2 : colors.white}>{label}</Txt>
    </Pressable>
  );
}

/** One pickup shop: logo, seller with a call button, address, map links and what to collect there (website stopHtml()). */
export function PickupStop({ st, i, count, final }: { st: Pickup; i: number; count: number; final: boolean }) {
  const { t, f } = useLang();
  const nav = final ? '' : st.nav;
  return (
    <View style={[styles.stop, i > 0 && styles.stopNext]}>
      <View style={styles.row}>
        <View style={styles.lg}>
          {st.logo ? <Image source={{ uri: st.logo }} style={styles.lgImg} contentFit="cover" /> : <Txt weight="bold" size={16} color={colors.primary2} latin>{initials(st.name || '?')}</Txt>}
        </View>
        <View style={styles.flex}>
          <Txt size={12} color={colors.grey}>{count > 1 ? f('pickupNofM', { i: i + 1, n: count }) : t('pickupShop')}</Txt>
          <Txt weight="bold" size={15.5}>{st.name || t('notSpecified')}</Txt>
        </View>
      </View>
      {st.owner ? (
        <View style={styles.owner}>
          <View style={styles.ph}>{st.photo ? <Image source={{ uri: st.photo }} style={styles.phImg} contentFit="cover" /> : null}</View>
          <View style={styles.flex}>
            <Txt size={12.5} color={colors.grey}>{t('seller')}</Txt>
            <Txt weight="semibold" size={14.5}>{st.owner}</Txt>
          </View>
          {st.mobile ? <CallLink mobile={st.mobile} /> : null}
        </View>
      ) : null}
      {st.address ? (
        <View style={styles.ad}>
          <Icon name="pin" size={18} color={colors.grey} />
          <Txt size={14} style={styles.flex}>{st.address}</Txt>
        </View>
      ) : null}
      {st.lat === null && !final ? <Txt size={12.5} color={colors.grey} style={styles.mt4}>{t('shopNoPin')}</Txt> : null}
      {nav || st.map ? (
        <View style={styles.two}>
          {st.map ? (
            <View style={styles.flex}>
              <NavButton label={t('map')} url={st.map} outline icon="pin" />
            </View>
          ) : null}
          {nav ? (
            <View style={styles.flex}>
              <NavButton label={t('navigate')} url={nav} />
            </View>
          ) : null}
        </View>
      ) : null}
      {st.items.length ? (
        <View style={styles.col}>
          <Txt size={13} color={colors.grey} style={styles.colH}>{t('collectHere')}</Txt>
          {st.items.map((it, k) => (
            <ItemRow key={k} it={it} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** Order card for the lists and history (website ocard()). */
export function OrderCard({ o, hist }: { o: RiderOrder; hist?: boolean }) {
  const { t, n, f, lang } = useLang();
  const shops = o.pickups.length > 1 ? o.pickups.map((x) => x.name).join(' + ') : o.pickups[0]?.name || o.pickup.name || t('pickupNotSet');
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })}
      style={({ pressed }) => [styles.oc, pressed && styles.ocPressed]}
      accessibilityRole="button"
      accessibilityLabel={`#${o.id}`}
    >
      <View style={styles.row}>
        <Txt weight="bold" size={15} style={styles.flex} numberOfLines={1}>{`#${n(o.id)}`}</Txt>
        <RChip rs={o.rstat} />
      </View>
      <View style={styles.ln}>
        <Txt weight="semibold" size={14.5} style={styles.flex}>{o.customer.name}</Txt>
        <Txt size={12.5} color={colors.grey}>{t('minutes')}</Txt>
      </View>
      <View style={styles.ln}>
        <Icon name="shop" size={18} color={colors.grey} />
        <Txt size={14} style={styles.flex} numberOfLines={2}>{shops}</Txt>
        {o.multi ? <Chip label={f('nShops', { n: o.pickups.length })} tone="amber" /> : null}
      </View>
      <View style={styles.ln}>
        <Icon name="pin" size={18} color={colors.grey} />
        <Txt size={14} style={styles.flex} numberOfLines={2}>{o.delivery.address}</Txt>
      </View>
      {o.items.length ? (
        <View style={styles.thumbs}>
          {o.items.slice(0, 5).map((it, i) => (
            <Thumb key={i} it={it} size={40} />
          ))}
          {o.items.length > 5 ? (
            <View style={[styles.th, styles.more]}>
              <Txt size={12} color={colors.grey}>{`+${n(o.items.length - 5)}`}</Txt>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={styles.ft}>
        {hist ? (
          <>
            <Txt weight="bold" size={15}>{money(o.total, lang)}</Txt>
            <Txt size={12.5} color={colors.grey} style={styles.right}>{dateTime(o.updated_at, lang)}</Txt>
          </>
        ) : (
          <>
            <PayBadge o={o} />
            <View style={styles.flex} />
            {o.deadline && !isFinal(o.rstat) ? <Countdown due={o.deadline} /> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  right: { flex: 1, textAlign: 'right' },
  mt4: { marginTop: 4 },
  pressed: { opacity: 0.8 },
  dl: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.infoBg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  dlSoon: { backgroundColor: colors.warnBg },
  dlOver: { backgroundColor: colors.dangerBg },
  cod: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.warnBg, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 4 },
  paid: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.okBg, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 5 },
  th: { borderRadius: 9, backgroundColor: '#f1f3f9', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  more: { width: 40, height: 40 },
  it: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef1f8' },
  call: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, borderRadius: 14, backgroundColor: colors.primary2 },
  navO: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary2 },
  stop: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: 12 },
  stopNext: { marginTop: 10 },
  lg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#eef1f8', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  lgImg: { width: 48, height: 48 },
  owner: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, borderStyle: 'dashed' },
  ph: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eef1f8', overflow: 'hidden' },
  phImg: { width: 38, height: 38 },
  ad: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 9 },
  two: { flexDirection: 'row', gap: 8, marginTop: 10 },
  col: { marginTop: 10, backgroundColor: '#f8f9fd', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  colH: { marginTop: 6, marginBottom: 2 },
  oc: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  ocPressed: { backgroundColor: '#fafbff' },
  ln: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 7 },
  thumbs: { flexDirection: 'row', gap: 6, marginTop: 9 },
  ft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 11, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, flexWrap: 'wrap' },
});
