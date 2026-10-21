import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { uploadProductPhoto } from '@/api/products';
import { uploadErrorText } from '@/components/DocRows';
import { Icon } from '@/components/Icon';
import { PickSourceSheet } from '@/components/PickSourceSheet';
import { Txt } from '@/components/Txt';
import { Card } from '@/components/ui';
import { pickPhotos } from '@/lib/files';
import { useLang } from '@/store/i18n';
import { newKey, usePForm, type Photo } from '@/store/pform';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

const MAX = 5;

const update = (key: string, fn: (p: Photo) => Photo | null) => {
  const imgs = usePForm.getState().imgs;
  if (!imgs.some((x) => x.key === key)) return; // the form was closed meanwhile
  usePForm.setState({ imgs: imgs.map(fn).filter((x): x is Photo => !!x) });
};

/** Uploads picked photos one by one into new slots at the end of the list; returns the uploaded ones. */
export async function addPhotos(src: 'camera' | 'gallery', t: Parameters<typeof uploadErrorText>[1]): Promise<Photo[]> {
  const room = MAX - usePForm.getState().imgs.length;
  if (room <= 0) {
    toast(t('max5'), 'bad');
    return [];
  }
  let files;
  try {
    files = await pickPhotos(src, room);
  } catch (e) {
    toast(uploadErrorText(e, t), 'bad');
    return [];
  }
  const slots = files.map(() => ({ key: newKey(), name: '', url: '', tmp: true, p: 0 }));
  usePForm.setState({ imgs: [...usePForm.getState().imgs, ...slots] });
  const done: Photo[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const slot = slots[i];
    if (!f || !slot) continue;
    try {
      const r = await uploadProductPhoto(f, (p) => update(slot.key, (x) => (x.key === slot.key ? { ...x, p } : x)));
      const ph = { key: slot.key, name: r.name, url: r.url };
      update(slot.key, (x) => (x.key === slot.key ? ph : x));
      done.push(ph);
    } catch (e) {
      update(slot.key, (x) => (x.key === slot.key ? null : x));
      toast(uploadErrorText(e, t), 'bad');
    }
  }
  const errs = usePForm.getState().errs;
  if (errs.imgs && done.length) usePForm.setState({ errs: { ...errs, imgs: '' } });
  return done;
}

/** 1 to 5 photos; the first is the main one (website drawPhotos()). */
export function PhotosCard() {
  const { t, n } = useLang();
  const imgs = usePForm((s) => s.imgs);
  const err = usePForm((s) => s.errs.imgs);
  const [pick, setPick] = useState(false);

  const remove = (key: string) => usePForm.setState({ imgs: usePForm.getState().imgs.filter((x) => x.key !== key) });
  const makeMain = (key: string) => {
    const all = usePForm.getState().imgs;
    const x = all.find((y) => y.key === key);
    if (x) usePForm.setState({ imgs: [x, ...all.filter((y) => y.key !== key)] });
  };

  return (
    <Card>
      <Txt weight="bold" size={16.5}>
        {t('photos')}
        <Txt color={colors.danger}> *</Txt>
      </Txt>
      <Txt size={13} color={colors.grey} style={styles.sub}>{t('photosSub')}</Txt>
      <View style={styles.grid}>
        {imgs.map((x, i) => (
          <View key={x.key} style={[styles.tile, i === 0 && !x.tmp && styles.mainTile]}>
            {x.tmp ? (
              <View style={styles.center}>
                <ActivityIndicator color={colors.primary} />
                <Txt size={12} color={colors.grey}>{`${n(Math.round((x.p ?? 0) * 100))}%`}</Txt>
              </View>
            ) : (
              <>
                <Image source={{ uri: x.url }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <Pressable onPress={() => remove(x.key)} style={styles.x} accessibilityLabel={t('remove')} hitSlop={6}>
                  <Icon name="x" size={14} color={colors.white} strokeWidth={3} />
                </Pressable>
                {i === 0 ? (
                  <View style={styles.mk}>
                    <Txt weight="bold" size={11} color={colors.white}>{t('main')}</Txt>
                  </View>
                ) : (
                  <Pressable onPress={() => makeMain(x.key)} style={styles.mkBtn} accessibilityRole="button">
                    <Txt weight="semibold" size={11} color={colors.white}>{t('makeMain')}</Txt>
                  </Pressable>
                )}
              </>
            )}
          </View>
        ))}
        {imgs.length < MAX ? (
          <Pressable onPress={() => setPick(true)} style={[styles.tile, styles.add, !!err && styles.addBad]} accessibilityRole="button" accessibilityLabel={t('addPhoto')}>
            <Icon name="camera" size={26} color={colors.primary} />
            <Txt weight="semibold" size={12.5} color={colors.primary}>{t('addPhoto')}</Txt>
          </Pressable>
        ) : null}
      </View>
      {err ? <Txt size={13} color={colors.danger} style={styles.sub}>{err}</Txt> : null}
      {pick ? <PickSourceSheet title={t('addPhoto')} onClose={() => setPick(false)} onPick={(s) => void addPhotos(s === 'camera' ? 'camera' : 'gallery', t)} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  sub: { marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  tile: { width: '30.5%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#eef1f8' },
  mainTile: { borderWidth: 2.5, borderColor: colors.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  x: { position: 'absolute', top: 5, right: 5, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  mk: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.primary, paddingVertical: 3, alignItems: 'center' },
  mkBtn: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 5, alignItems: 'center' },
  add: { alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#b9c4ea', backgroundColor: '#f7f9ff' },
  addBad: { borderColor: colors.danger },
});
