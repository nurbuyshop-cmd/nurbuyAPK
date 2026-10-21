import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { fetchPrivateFile } from '@/api/api';
import { DOC_KINDS, uploadForSeller, type DocKind, type Seller } from '@/api/seller';
import type { StringKey } from '@/i18n/en';
import { errorText, fieldText } from '@/lib/errors';
import { pickFile, PrepError, type PickSource } from '@/lib/files';
import { useAuth } from '@/store/auth';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

import { Button } from './Button';
import { PickSourceSheet } from './PickSourceSheet';
import { Sheet } from './Sheet';
import { Txt } from './Txt';
import { Chip } from './ui';

export const DOC_LABEL: Record<DocKind, StringKey> = { nid_front: 'docNidFront', nid_back: 'docNidBack', license: 'docLicense' };

/** Message for a file that could not be prepared or uploaded. */
export function uploadErrorText(e: unknown, t: (k: StringKey) => string): string {
  if (e instanceof PrepError) return t(e.kind === 'big' ? 'prepBig' : e.kind === 'type' ? 'prepType' : 'prepBad');
  return fieldText(e, t) || errorText(e, t);
}

/** NID / trade license rows with View and (optionally) Upload / Replace buttons (website docRows()). */
export function DocRows({ seller, canEdit }: { seller: Seller; canEdit: boolean }) {
  const t = useT();
  const setSeller = useAuth((s) => s.setSeller);
  const [busy, setBusy] = useState<string | null>(null);
  const [pickFor, setPickFor] = useState<DocKind | null>(null);
  const [shown, setShown] = useState<{ kind: DocKind; type: string; dataUrl: string } | null>(null);

  const view = async (k: DocKind) => {
    setBusy(`v${k}`);
    try {
      const f = await fetchPrivateFile(`/seller/file?kind=${k}`);
      setShown({ kind: k, ...f });
    } catch {
      toast(t('cantOpenFile'), 'bad');
    }
    setBusy(null);
  };

  const replace = async (k: DocKind, src: PickSource) => {
    try {
      const f = await pickFile(src, 'doc', k);
      if (!f) return;
      setBusy(`u${k}`);
      setSeller(await uploadForSeller(k, f));
      toast(t('upUploaded'), 'ok');
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
    setBusy(null);
  };

  return (
    <View>
      {DOC_KINDS.map((k) => {
        const has = seller.docs[k];
        return (
          <View key={k} style={styles.row}>
            <View style={styles.top}>
              <Txt size={14.5} weight="medium" style={styles.flex}>
                {t(DOC_LABEL[k])}
                {k === 'license' ? <Txt size={12.5} color={colors.grey}>{` (${t('optional')})`}</Txt> : null}
              </Txt>
              {has ? <Chip label={t('upUploaded')} tone="green" /> : <Chip label={t(k === 'license' ? 'notAdded' : 'missing')} tone={k === 'license' ? 'grey' : 'red'} />}
            </View>
            <View style={styles.btns}>
              {has ? <Button small variant="secondary" icon="eye" label={t('view')} busy={busy === `v${k}`} onPress={() => void view(k)} style={styles.flex} /> : null}
              {canEdit ? (
                <Button small variant="secondary" label={has ? t('replace') : t('upload')} busy={busy === `u${k}`} onPress={() => setPickFor(k)} style={styles.flex} />
              ) : null}
            </View>
          </View>
        );
      })}
      {pickFor ? (
        <PickSourceSheet title={t(DOC_LABEL[pickFor])} pdf onClose={() => setPickFor(null)} onPick={(s) => void replace(pickFor, s)} />
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
