import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { fetchPrivateFile } from '@/api/api';
import { docKindsFor, filePath, upload, type Rider, type UploadKind } from '@/api/rider';
import type { StringKey } from '@/i18n/en';
import { errorText, fieldText } from '@/lib/errors';
import { pickFile, PrepError, type PickSource } from '@/lib/files';
import { DOC_LABEL } from '@/lib/labels';
import { useAuth } from '@/store/auth';
import { useT } from '@/store/i18n';
import { usePhoto } from '@/store/photo';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

import { Button } from './Button';
import { PickSourceSheet } from './PickSourceSheet';
import { Sheet } from './Sheet';
import { Txt } from './Txt';
import { Chip } from './ui';

/** Message for a file that could not be prepared or uploaded. */
export function uploadErrorText(e: unknown, t: (k: StringKey) => string): string {
  if (e instanceof PrepError) return t(e.kind === 'big' ? 'prepBig' : e.kind === 'type' ? 'prepType' : 'prepBad');
  return fieldText(e, t) || errorText(e, t);
}

/** Photo / NID / license rows with View and (optionally) Upload / Replace buttons (website docRows()). */
export function DocRows({ rider, canEdit }: { rider: Rider; canEdit: boolean }) {
  const t = useT();
  const setRider = useAuth((s) => s.setRider);
  const [busy, setBusy] = useState<string | null>(null);
  const [pickFor, setPickFor] = useState<UploadKind | null>(null);
  const [shown, setShown] = useState<{ kind: UploadKind; type: string; dataUrl: string } | null>(null);
  const kinds: UploadKind[] = ['photo', ...docKindsFor(rider.vehicle_type)];

  const view = async (k: UploadKind) => {
    setBusy(`v${k}`);
    try {
      const f = await fetchPrivateFile(filePath(k));
      setShown({ kind: k, ...f });
    } catch {
      toast(t('cantOpenFile'), 'bad');
    }
    setBusy(null);
  };

  const replace = async (k: UploadKind, src: PickSource) => {
    try {
      const f = await pickFile(src, k === 'photo' ? 'photo' : 'doc', k);
      if (!f) return;
      setBusy(`u${k}`);
      setRider(await upload(k, f));
      if (k === 'photo') void usePhoto.getState().load(true);
      toast(t('upUploaded'), 'ok');
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
    setBusy(null);
  };

  return (
    <View>
      {kinds.map((k) => {
        const has = k === 'photo' ? rider.has_photo : rider.docs[k];
        return (
          <View key={k} style={styles.row}>
            <View style={styles.top}>
              <Txt size={14.5} weight="medium" style={styles.flex}>{t(DOC_LABEL[k])}</Txt>
              {has ? <Chip label={t('upUploaded')} tone="green" /> : <Chip label={t('missing')} tone="red" />}
            </View>
            {has || canEdit ? (
              <View style={styles.btns}>
                {has ? <Button small variant="secondary" icon="eye" label={t('view')} busy={busy === `v${k}`} onPress={() => void view(k)} style={styles.flex} /> : null}
                {canEdit ? (
                  <Button small variant="secondary" label={has ? t('replace') : t('upload')} busy={busy === `u${k}`} onPress={() => setPickFor(k)} style={styles.flex} />
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
      {pickFor ? (
        <PickSourceSheet title={t(DOC_LABEL[pickFor])} pdf={pickFor !== 'photo'} onClose={() => setPickFor(null)} onPick={(s) => void replace(pickFor, s)} />
      ) : null}
      {shown ? (
        <Sheet title={t(DOC_LABEL[shown.kind])} onClose={() => setShown(null)}>
          {shown.type.startsWith('image/') ? (
            <Image source={{ uri: shown.dataUrl }} style={styles.img} contentFit="contain" />
          ) : (
            <Txt size={14.5} color={colors.grey}>{t('pdfFile')}</Txt>
          )}
          <Button label={t('close')} variant="secondary" onPress={() => setShown(null)} />
        </Sheet>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f8', gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btns: { flexDirection: 'row', gap: 8 },
  flex: { flex: 1, minWidth: 0 },
  img: { width: '100%', aspectRatio: 1.4, borderRadius: 12, backgroundColor: '#f4f6fb' },
});
