import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { checkZone, fetchMapsConfig, type Areas, type Place, type ZoneQuote } from '@/api/geo';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { MapPicker, type MapPickerHandle } from '@/components/MapPicker';
import { PlaceSelect } from '@/components/PlaceSelect';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { savedAddresses, storeAddress } from '@/lib/addresses';
import { money } from '@/lib/money';
import { useAuth } from '@/store/auth';
import { useI18n, fmt, useT } from '@/store/i18n';
import { selectedPlaces, useLocation, type Pin } from '@/store/location';
import { toast } from '@/store/toast';
import { colors, radius, shadow, TOUCH } from '@/theme';

const norm = (s: string) => s.trim().toLowerCase();

/** The District > Thana > Village choice matching the area names the admin gave a zone (as far as they match). */
function selFromZone(areas: Areas | null, z: ZoneQuote['zone']): number[] | null {
  if (!areas || !z) return null;
  const find = (list: Place[], name?: string) => (name?.trim() ? list.find((x) => norm(x.n) === norm(name) || norm(x.bn) === norm(name)) : undefined);
  const d = find(areas.districts, z.district);
  if (!d) return null;
  const thanas = areas.kids[String(d.id)] ?? [];
  const t = find(thanas, z.thana);
  if (t) {
    const v = find(areas.kids[String(t.id)] ?? [], z.village);
    return v ? [d.id, t.id, v.id] : [d.id, t.id];
  }
  // the zone's thana is written differently from the list: find its village under any thana of the district
  for (const th of thanas) {
    const v = find(areas.kids[String(th.id)] ?? [], z.village);
    if (v) return [d.id, th.id, v.id];
  }
  return [d.id];
}

/**
 * Delivery location. Zones mode: the customer pins the door on the map and the server says the zone, charge and minutes;
 * the zone's district / thana / village then fill the lists.
 * Both modes: District > Thana / Upazila > Village / Area lists (required in areas mode) and the customer's own address line (optional).
 * With ?force=1 (first visit in areas mode) the screen cannot be closed until all levels are chosen.
 */
export default function LocationScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const { force, mode, i } = useLocalSearchParams<{ force?: string; mode?: string; i?: string }>();
  const st = useLocation();
  // ?mode=addr: the same page edits a saved address of the profile (index i, -1 = new) instead of the delivery location
  const addrMode = mode === 'addr';
  const addrIndex = addrMode ? Number(i ?? -1) : -1;
  const [init] = useState(() => {
    if (!addrMode) return { sel: st.sel, pin: st.pin, line: st.line, landmark: st.pin?.landmark ?? '' };
    const { list, parts } = savedAddresses(useAuth.getState().profile);
    const text = addrIndex >= 0 ? list[addrIndex] ?? '' : '';
    const p = parts.find((x) => x.t === text);
    if (p) return { sel: p.sel, pin: p.pin ?? null, line: p.area, landmark: p.det };
    // a new address starts from the current delivery area; an old text-only address goes into the address line
    return { sel: addrIndex >= 0 ? [] : st.sel, pin: addrIndex >= 0 ? null : st.pin, line: text, landmark: '' };
  });
  const zonesMode = !!st.zones?.active;
  const maps = useQuery({ queryKey: ['maps'], queryFn: fetchMapsConfig, enabled: zonesMode, staleTime: 3600_000 });
  const mapRef = useRef<MapPickerHandle>(null);

  // the first-visit picker cannot be left with the back button
  useEffect(() => {
    if (!force) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [force]);

  const [sel, setSel] = useState<number[]>(init.sel);
  const [pin, setPin] = useState<Pin | null>(init.pin);
  const [quote, setQuote] = useState<ZoneQuote | null>(init.pin === st.pin ? st.quote : null);
  const [checked, setChecked] = useState(!!init.pin && init.pin === st.pin);
  const [line, setLine] = useState(init.line);
  // no landmark field any more; one saved earlier is kept as it was
  const [landmark] = useState(init.landmark);
  const [mapFailed, setMapFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const places = selectedPlaces(st.areas, sel);
  const lists: Place[][] = st.areas ? [st.areas.districts, places[0] ? st.areas.kids[String(places[0].id)] ?? [] : [], places[1] ? st.areas.kids[String(places[1].id)] ?? [] : []] : [[], [], []];
  const need = st.areas?.need ?? 3;
  const areaOk = places.length >= Math.min(need, 3);
  const pinOk = !!pin && !!quote;
  // the map is shown when its key arrived and Google accepted it; otherwise say so (it used to just disappear)
  const showMap = zonesMode && !!maps.data?.key && !mapFailed;
  const mapBroken = zonesMode && (mapFailed || maps.isError || (maps.isSuccess && !maps.data.key));
  const hasText = !!(line.trim() || landmark.trim() || pin?.full || places.length);
  const canSave = addrMode ? (!!pin || areaOk) && hasText : zonesMode ? pinOk || (mapBroken && areaOk) : areaOk;

  const center = useMemo(() => {
    if (init.pin) return { lat: init.pin.lat, lng: init.pin.lng, zoom: 17 };
    const z = st.zones?.zones[0]?.poly;
    if (z?.length) return { lat: z.reduce((a, p) => a + p[0], 0) / z.length, lng: z.reduce((a, p) => a + p[1], 0) / z.length, zoom: 14 };
    const c = maps.data?.centers[0];
    return c ? { lat: c.lat, lng: c.lng, zoom: c.zoom } : { lat: 23.8103, lng: 90.4125, zoom: 12 };
  }, [init.pin, st.zones, maps.data]);

  const onPin = async (p: Pin) => {
    setPin(p);
    try {
      const q = await checkZone(p.lat, p.lng, 0, []);
      setQuote(q.inside ? q : null);
      // the zone's district / thana / village fill the lists below
      const s = q.inside ? selFromZone(useLocation.getState().areas, q.zone) : null;
      if (s) setSel(s);
    } catch {
      setQuote(null);
    }
    setChecked(true);
  };

  // the customer's real position from the phone's GPS: moves the map there, or (without a map) becomes the pin directly
  const [locating, setLocating] = useState(false);
  const goToMine = async () => {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') return toast(t('locDenied'));
    setLocating(true);
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      if (showMap) mapRef.current?.goTo(lat, lng);
      else await onPin({ lat, lng, acc: accuracy ?? undefined, full: `${t('myLocation')} (${lat.toFixed(5)}, ${lng.toFixed(5)})` });
      toast(t('locFound'));
    } catch {
      toast(t('locDenied'));
    } finally {
      setLocating(false);
    }
  };

  const pickLevel = (lvl: number, p: Place) => setSel([...sel.slice(0, lvl), p.id]);

  // saved address of the profile: one line of text (house / road, landmark, then village, thana, district or the map address)
  const saveAddress = async () => {
    const names = [...places].reverse().map((p) => (lang === 'bn' ? p.bn : p.n));
    const text = [line.trim(), landmark.trim(), ...(names.length ? names : pin?.full ? [pin.full] : [])].filter(Boolean).join(', ');
    setBusy(true);
    const ok = await storeAddress(addrIndex, {
      t: text,
      sel: places.map((p) => p.id),
      area: line.trim(),
      det: landmark.trim(),
      ...(pin ? { pin: { ...pin, landmark: landmark.trim() || undefined } } : {}),
    });
    setBusy(false);
    toast(ok ? t('saved') : t('errGeneric'));
    if (ok) router.back();
  };

  const save = async () => {
    if (addrMode) return saveAddress();
    setBusy(true);
    st.setSel(sel);
    st.setLine(line.trim());
    if (zonesMode && pin) await st.setPin({ ...pin, landmark: landmark.trim() || undefined });
    setBusy(false);
    toast(t('locUpdated'));
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const zoneName = quote?.zone ? (lang === 'bn' ? quote.zone.bn : quote.zone.name) : '';

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {force ? (
        <View style={[styles.forceHead, { paddingTop: insets.top + 14 }]}>
          <Txt weight="bold" size={20}>{t('chooseArea')}</Txt>
          <Txt size={13.5} color={colors.grey}>{t('chooseAreaSub')}</Txt>
        </View>
      ) : (
        <TopBar title={addrMode ? (addrIndex < 0 ? t('addAddress') : t('editAddress')) : t('locTitle')} />
      )}
      {showMap && maps.data ? (
        <View style={styles.mapBox}>
          <MapPicker
            ref={mapRef}
            apiKey={maps.data.key}
            mapId={maps.data.mapId}
            center={center}
            zones={st.zones?.zones ?? []}
            lang={lang}
            searchPh={t('mapSearchPh')}
            onPin={(p) => void onPin(p)}
            onError={() => setMapFailed(true)}
          />
          <Pressable style={styles.me} onPress={() => void goToMine()} accessibilityRole="button">
            <Icon name="pin" size={18} color={colors.primary} />
            <Txt weight="bold" size={13} color={colors.primary}>{t('myLocation')}</Txt>
          </Pressable>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        {mapBroken ? (
          <View style={styles.card}>
            <Txt size={13.5} color={colors.danger}>{t('mapError')}</Txt>
            <Button
              label={t('retry')}
              variant="link"
              onPress={() => {
                setMapFailed(false);
                void maps.refetch();
              }}
            />
          </View>
        ) : null}

        {/* the phone's own position, also when the map is not available */}
        {zonesMode ? (
          <Pressable style={styles.gps} onPress={() => void goToMine()} disabled={locating} accessibilityRole="button">
            <View style={styles.gpsIc}>
              {locating ? <ActivityIndicator color={colors.primary} /> : <Icon name="pin" size={22} color={colors.primary} />}
            </View>
            <View style={styles.flex}>
              <Txt weight="bold" size={15} color={colors.primary}>{t('myLocation')}</Txt>
              <Txt size={12.5} color={colors.grey}>{t('myLocationSub')}</Txt>
            </View>
          </Pressable>
        ) : null}

        {zonesMode && (showMap || pin) ? (
          <View style={styles.card}>
            <Txt size={14} color={pin?.full ? colors.text : colors.grey}>{pin?.full || t('moveMap')}</Txt>
            {checked && pin ? (
              quote ? (
                <View style={styles.ok}>
                  <Txt weight="bold" size={13.5} color={colors.okText}>{zoneName}</Txt>
                  <Txt size={13} color={colors.okText}>{fmt(t('zoneInfo'), { fee: money(quote.fee, lang), eta: quote.eta }, lang)}</Txt>
                  {quote.minOrder ? <Txt size={13} color={colors.okText}>{fmt(t('minOrderN'), { v: money(quote.minOrder, lang) }, lang)}</Txt> : null}
                </View>
              ) : (
                <View style={styles.bad}>
                  <Txt weight="bold" size={13.5} color={colors.danger}>{t('outsideZone')}</Txt>
                </View>
              )
            ) : null}
          </View>
        ) : null}

        <View style={styles.card}>
          {[t('district'), t('thana'), t('village')].slice(0, Math.min(need, 3)).map((label, i) => (
            <PlaceSelect key={label} label={label} value={places[i]} options={lists[i] ?? []} disabled={i > places.length} onPick={(p) => pickLevel(i, p)} />
          ))}
          <Txt weight="bold" size={13} color="#333" style={styles.label}>{t('addrLineOpt')}</Txt>
          <TextInput value={line} onChangeText={setLine} placeholder={t('addrLine')} placeholderTextColor="#9aa1b8" style={[styles.input, { fontFamily: font }]} maxLength={200} />
        </View>

        <Button label={addrMode ? t('save') : t('confirmLoc')} onPress={() => void save()} disabled={!canSave} busy={busy} style={styles.save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  forceHead: { backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 12, gap: 4 },
  content: { gap: 10, paddingTop: 10 },
  mapBox: { height: '42%', backgroundColor: '#e8eaf0' },
  me: {
    position: 'absolute',
    right: 12,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: TOUCH,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  flex: { flex: 1, minWidth: 0 },
  gps: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 12, padding: 12, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#eef0fa' },
  gpsIc: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginHorizontal: 12, gap: 4, ...shadow.card },
  ok: { backgroundColor: colors.okBg, borderRadius: 10, padding: 10, marginTop: 8, gap: 2 },
  bad: { backgroundColor: colors.dangerBg, borderRadius: 10, padding: 10, marginTop: 8 },
  label: { marginBottom: 6, marginTop: 10 },
  input: { height: 50, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 14, fontSize: 15, backgroundColor: '#fafbff', color: colors.text },
  save: { marginHorizontal: 12, marginTop: 6 },
});
