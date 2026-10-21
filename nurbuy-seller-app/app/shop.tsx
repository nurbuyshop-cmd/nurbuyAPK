import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { mapsConfig, toHours, updateShop, type MapsConfig } from '@/api/shop';
import { uploadForSeller } from '@/api/seller';
import { Button } from '@/components/Button';
import { uploadErrorText } from '@/components/DocRows';
import { Icon } from '@/components/Icon';
import { PickSourceSheet } from '@/components/PickSourceSheet';
import { Sheet } from '@/components/Sheet';
import { ShopMap, type ShopMapHandle } from '@/components/ShopMap';
import { Switch } from '@/components/Switch';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { Avatar, Banner, Card, Chip } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { errorText, fieldText } from '@/lib/errors';
import { pickFile, type PickSource } from '@/lib/files';
import { useAuth } from '@/store/auth';
import { digits, useLang, type Lang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** Days in the website's order (Saturday first); i = JavaScript weekday (0 = Sunday). */
const DAYS: [number, StringKey][] = [
  [6, 'sat'],
  [0, 'sun'],
  [1, 'mon'],
  [2, 'tue'],
  [3, 'wed'],
  [4, 'thu'],
  [5, 'fri'],
];

type Day = { i: number; open: boolean; o: number; c: number };

/** 9:30 PM / রাত ৯:৩০ for minutes after midnight. */
function timeText(m: number, lang: Lang): string {
  const mm = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(mm / 60);
  const min = mm % 60;
  const h12 = h % 12 || 12;
  const t = `${h12}:${min < 10 ? '0' : ''}${min}`;
  if (lang === 'bn') {
    const p = h < 4 ? 'রাত' : h < 6 ? 'ভোর' : h < 12 ? 'সকাল' : h < 15 ? 'দুপুর' : h < 18 ? 'বিকাল' : h < 20 ? 'সন্ধ্যা' : 'রাত';
    return `${p} ${digits(t, lang)}`;
  }
  return `${t} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Opening hours, map pin with address, and the owner photo riders see (website scrShop()). */
export default function Shop() {
  const { t, f, lang } = useLang();
  const font = useInputFont();
  const seller = useAuth((s) => s.seller);
  const setSeller = useAuth((s) => s.setSeller);
  const [on, setOn] = useState(() => !!toHours(seller?.hours));
  const [days, setDays] = useState<Day[]>(() => {
    const h = toHours(seller?.hours);
    return DAYS.map(([i]): Day => {
      const x: [number, number] | null = h ? (h.d[i] ?? null) : [540, 1380];
      return { i, open: !!x, o: x ? x[0] : 540, c: x ? (x[1] >= 1440 ? x[1] - 1440 : x[1]) : 1380 };
    });
  });
  const [hErr, setHErr] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [timeFor, setTimeFor] = useState<{ k: number; which: 'o' | 'c' } | null>(null);

  const [cfg, setCfg] = useState<MapsConfig | null>(null);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(seller?.lat != null && seller?.lng != null ? { lat: seller.lat, lng: seller.lng } : null);
  const [addr, setAddr] = useState(seller?.address ?? '');
  const [addrDirty, setAddrDirty] = useState(false);
  const [mErr, setMErr] = useState('');
  const [mapDead, setMapDead] = useState(false);
  const [photoPick, setPhotoPick] = useState(false);
  const map = useRef<ShopMapHandle>(null);

  useEffect(() => {
    mapsConfig().then(setCfg, () => setCfg({ key: '', mapId: '' }));
  }, []);

  if (!seller) return null;

  const saveHours = async () => {
    setHErr('');
    let hours = null;
    if (on) {
      const d: ([number, number] | null)[] = [null, null, null, null, null, null, null];
      let any = false;
      for (const x of days) {
        if (!x.open) continue;
        if (x.o === x.c) return setHErr(t('fSameTime'));
        any = true;
        d[x.i] = [x.o, x.c === 0 ? 1440 : x.c];
      }
      if (!any) return setHErr(t('fOneDay'));
      hours = { d };
    }
    setBusy('hours');
    try {
      setSeller(await updateShop({ hours }));
      toast(t('hoursSaved'), 'ok');
    } catch (e) {
      setHErr(fieldText(e, t) || errorText(e, t));
    }
    setBusy(null);
  };

  const gps = async () => {
    setMErr('');
    setBusy('gps');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) throw new Error('denied');
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const lat = +p.coords.latitude.toFixed(7);
      const lng = +p.coords.longitude.toFixed(7);
      setPin({ lat, lng });
      map.current?.goTo(lat, lng);
      toast(t('locMoved'), 'ok', 4500);
    } catch {
      setMErr(t('locDenied'));
    }
    setBusy(null);
  };

  const saveLoc = async (clear: boolean) => {
    setMErr('');
    if (!clear && !pin) return setMErr(t('noPin'));
    setBusy(clear ? 'clr' : 'loc');
    try {
      const body = clear ? { lat: null, lng: null } : { lat: pin?.lat ?? null, lng: pin?.lng ?? null, ...(addr.trim() ? { address: addr.trim() } : {}) };
      const s = await updateShop(body);
      setSeller(s);
      if (clear) setPin(null);
      toast(clear ? t('locRemoved') : t('locSaved'), 'ok');
    } catch (e) {
      setMErr(fieldText(e, t) || errorText(e, t));
    }
    setBusy(null);
  };

  const uploadPhoto = async (src: PickSource) => {
    try {
      const file = await pickFile(src, 'logo', 'photo');
      if (!file) return;
      setBusy('photo');
      toast(t('uploadingPhoto'));
      setSeller(await uploadForSeller('photo', file));
      toast(t('photoUpdated'), 'ok');
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const setDay = (k: number, ch: Partial<Day>) => setDays((s) => s.map((d, j) => (j === k ? { ...d, ...ch } : d)));
  const sat = days[0];
  const tf = timeFor ? days[timeFor.k] : undefined;

  return (
    <View style={styles.flex}>
      <TopBar title={t('shopHoursLoc')} back backTo="/profile" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Card title={t('openingHours')} right={seller.open_now ? <Chip label={t('openNow')} tone="green" /> : <Chip label={t('closedNow')} tone="red" />}>
          <Txt size={13} color={colors.grey}>{t('hoursInfo')}</Txt>
          <View style={styles.swRow}>
            <Txt weight="semibold" size={15} style={styles.grow}>{t('setHours')}</Txt>
            <Switch value={on} label={t('setHours')} onChange={setOn} />
          </View>
          <Txt size={12.5} color={colors.grey}>{on ? t('hoursOnHint') : t('hoursOffHint')}</Txt>
          {on ? (
            <View style={styles.days}>
              {days.map((d, k) => {
                const label = DAYS[k]?.[1];
                return (
                  <View key={d.i} style={[styles.day, !d.open && styles.dayOff]}>
                    <Switch value={d.open} label={label ? t(label) : ''} onChange={(v) => setDay(k, { open: v })} />
                    <Txt weight="semibold" size={14} style={styles.dayName}>{label ? t(label) : ''}</Txt>
                    {d.open ? (
                      <View style={styles.times}>
                        <Pressable onPress={() => setTimeFor({ k, which: 'o' })} style={styles.time} accessibilityLabel={t('opens')}>
                          <Txt size={13} weight="semibold">{timeText(d.o, lang)}</Txt>
                        </Pressable>
                        <Txt color={colors.grey}>-</Txt>
                        <Pressable onPress={() => setTimeFor({ k, which: 'c' })} style={styles.time} accessibilityLabel={t('closes')}>
                          <Txt size={13} weight="semibold">{timeText(d.c, lang)}</Txt>
                        </Pressable>
                      </View>
                    ) : (
                      <Txt size={13} color={colors.grey} style={styles.grow}>{t('closedAllDay')}</Txt>
                    )}
                  </View>
                );
              })}
              <Button small variant="ghost" label={t('copySat')} onPress={() => sat && setDays((s) => s.map((d) => (d.open ? { ...d, o: sat.o, c: sat.c } : d)))} />
              <Txt size={12.5} color={colors.grey}>{t('midnightHint')}</Txt>
            </View>
          ) : null}
          {hErr ? <Txt size={13} color={colors.danger} style={styles.mt}>{hErr}</Txt> : null}
          <Button label={t('saveHours')} busy={busy === 'hours'} onPress={() => void saveHours()} style={styles.mt} />
        </Card>

        <Card title={t('mapTitle')}>
          <Txt size={13} color={colors.grey}>{t('mapInfo')}</Txt>
          <View style={styles.map}>
            {mapDead ? (
              <View style={styles.mapFail}>
                <Banner tone="warn">{t('mapFailed')}</Banner>
              </View>
            ) : cfg ? (
              <ShopMap
                ref={map}
                apiKey={cfg.key}
                mapId={cfg.mapId}
                lat={seller.lat}
                lng={seller.lng}
                lang={lang}
                searchPh={t('searchPlace')}
                onPin={(p) => {
                  setPin({ lat: p.lat, lng: p.lng });
                  if (p.full && !addrDirty) setAddr(p.full);
                }}
                onFail={() => setMapDead(true)}
              />
            ) : null}
          </View>
          <View style={styles.ll}>
            <Icon name="pin" size={16} color={colors.grey} />
            <Txt size={12.5} color={colors.grey} style={styles.grow}>
              {pin ? f('pinAt', { p: `${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}` }) : t('noPin')}
            </Txt>
          </View>
          <Txt weight="semibold" size={13.5} color="#333" style={styles.lab}>{t('addrFromPin')}</Txt>
          <TextInput
            value={addr}
            onChangeText={(x) => {
              setAddr(x);
              setAddrDirty(true);
            }}
            multiline
            style={[styles.addr, { fontFamily: font }]}
          />
          {mErr ? <Txt size={13} color={colors.danger} style={styles.mt}>{mErr}</Txt> : null}
          <View style={styles.row2}>
            <Button small variant="secondary" icon="pin" label={t('useMyLoc')} busy={busy === 'gps'} onPress={() => void gps()} style={styles.grow} />
            <Button small label={t('saveLoc')} busy={busy === 'loc'} onPress={() => void saveLoc(false)} style={styles.grow} />
          </View>
          {seller.lat != null ? (
            <View style={styles.row2}>
              <Button small variant="ghost" icon="globe" label={t('openGmaps')} onPress={() => void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${seller.lat},${seller.lng}`)} style={styles.grow} />
              <Button small variant="danger" icon="trash" label={t('removeLoc')} busy={busy === 'clr'} onPress={() => void saveLoc(true)} style={styles.grow} />
            </View>
          ) : null}
        </Card>

        <Card title={t('ownerPhoto')}>
          <View style={styles.photoRow}>
            <Avatar name={seller.owner_name} uri={seller.photo} size={64} />
            <Txt size={13} color={colors.grey} style={styles.grow}>{t('ownerPhotoInfo')}</Txt>
          </View>
          <Button small variant="secondary" icon="camera" label={seller.photo ? t('changePhoto') : t('addPhoto')} busy={busy === 'photo'} onPress={() => setPhotoPick(true)} style={styles.mt} />
        </Card>
      </ScrollView>

      {timeFor && tf ? (
        <TimeSheet
          title={timeFor.which === 'o' ? t('opens') : t('closes')}
          value={timeFor.which === 'o' ? tf.o : tf.c}
          onClose={() => setTimeFor(null)}
          onPick={(m) => {
            setDay(timeFor.k, timeFor.which === 'o' ? { o: m } : { c: m });
            setTimeFor(null);
          }}
        />
      ) : null}
      {photoPick ? <PickSourceSheet title={t('ownerPhoto')} onClose={() => setPhotoPick(false)} onPick={(s) => void uploadPhoto(s)} /> : null}
    </View>
  );
}

/** Picks a time: hour (12-hour), minute (5-minute steps) and AM / PM. */
function TimeSheet({ title, value, onPick, onClose }: { title: string; value: number; onPick: (m: number) => void; onClose: () => void }) {
  const { t, n, lang } = useLang();
  const h0 = Math.floor((value % 1440) / 60);
  const [h12, setH12] = useState(h0 % 12 || 12);
  const [min, setMin] = useState(Math.round((value % 60) / 5) * 5 % 60);
  const [pm, setPm] = useState(h0 >= 12);
  const total = ((h12 % 12) + (pm ? 12 : 0)) * 60 + min;
  const chip = (label: string, on: boolean, press: () => void, key: string) => (
    <Pressable key={key} onPress={press} style={[styles.tchip, on && styles.tchipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
      <Txt weight="semibold" size={14.5} color={on ? colors.white : colors.text}>{label}</Txt>
    </Pressable>
  );
  return (
    <Sheet title={title} sub={timeText(total, lang)} onClose={onClose}>
      <Txt weight="semibold" size={13.5} color={colors.grey}>{t('hour')}</Txt>
      <View style={styles.tgrid}>{Array.from({ length: 12 }, (_, i) => i + 1).map((h) => chip(n(h), h === h12, () => setH12(h), `h${h}`))}</View>
      <Txt weight="semibold" size={13.5} color={colors.grey}>{t('minute')}</Txt>
      <View style={styles.tgrid}>{Array.from({ length: 12 }, (_, i) => i * 5).map((m) => chip(n(m < 10 ? `0${m}` : m), m === min, () => setMin(m), `m${m}`))}</View>
      <View style={styles.tgrid}>
        {chip(t('am'), !pm, () => setPm(false), 'am')}
        {chip(t('pm'), pm, () => setPm(true), 'pm')}
      </View>
      <Button label={t('done')} onPress={() => onPick(total)} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  grow: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 12, paddingBottom: 40 },
  mt: { marginTop: 10 },
  swRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  days: { gap: 6, marginTop: 10 },
  day: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 50, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  dayOff: { opacity: 0.7 },
  dayName: { width: 86 },
  times: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  time: { minHeight: 38, paddingHorizontal: 8, borderRadius: 9, borderWidth: 1.5, borderColor: '#dfe3f1', justifyContent: 'center', backgroundColor: '#fafbff' },
  map: { height: 320, marginTop: 10, borderRadius: 14, overflow: 'hidden', backgroundColor: '#e8eaf0' },
  mapFail: { flex: 1, justifyContent: 'center', padding: 10 },
  ll: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  lab: { marginTop: 10, marginBottom: 6 },
  addr: { minHeight: 64, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, padding: 12, fontSize: 15, color: '#111', backgroundColor: '#fafbff', textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 8, marginTop: 10 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tgrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tchip: { minWidth: 52, minHeight: 42, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  tchipOn: { backgroundColor: colors.primary },
});
