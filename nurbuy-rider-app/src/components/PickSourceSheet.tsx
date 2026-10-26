import { useT } from '@/store/i18n';
import type { PickSource } from '@/lib/files';

import { Button } from './Button';
import { Sheet } from './Sheet';

/** Asks where a photo comes from: camera, gallery, or (for documents) a PDF file. */
export function PickSourceSheet({ title, pdf, onPick, onClose }: { title: string; pdf?: boolean; onPick: (s: PickSource) => void; onClose: () => void }) {
  const t = useT();
  const pick = (s: PickSource) => {
    onClose();
    onPick(s);
  };
  return (
    <Sheet title={title} onClose={onClose}>
      <Button label={t('takePhoto')} icon="camera" variant="secondary" onPress={() => pick('camera')} />
      <Button label={t('chooseGallery')} icon="img" variant="secondary" onPress={() => pick('gallery')} />
      {pdf ? <Button label={t('choosePdf')} icon="file" variant="secondary" onPress={() => pick('pdf')} /> : null}
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}
