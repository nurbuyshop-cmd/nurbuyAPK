import * as DocumentPicker from 'expo-document-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import type { LocalFile } from '@/api/seller';

export type PickSource = 'camera' | 'gallery' | 'pdf';

/** Why a picked file cannot be used (shown with the matching message). */
export class PrepError extends Error {
  constructor(readonly kind: 'big' | 'type' | 'bad') {
    super(kind);
  }
}

const MB = 1024 * 1024;

type Preset = { maxSide: number; quality: number; crop?: [number, number] };

/** Sizes like the website: documents and products 1600 px, cover 2000 px wide, logo square. */
const PRESETS = {
  doc: { maxSide: 1600, quality: 0.85 },
  product: { maxSide: 1600, quality: 0.85, crop: [1, 1] },
  logo: { maxSide: 512, quality: 0.85, crop: [1, 1] },
  cover: { maxSide: 2000, quality: 0.85, crop: [16, 5] },
} satisfies Record<string, Preset>;

export type PresetName = keyof typeof PRESETS;

/**
 * Lets the seller take or choose a photo (or a PDF for documents) and shrinks photos to JPEG like the website does.
 * Returns null when the seller cancels. Throws PrepError for files that cannot be used.
 */
export async function pickFile(source: PickSource, preset: PresetName, name: string): Promise<LocalFile | null> {
  const p: Preset = PRESETS[preset];
  if (source === 'pdf') {
    const r = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true, multiple: false });
    const a = r.canceled ? null : r.assets[0];
    if (!a) return null;
    if ((a.size ?? 0) > 4 * MB) throw new PrepError('big');
    return { uri: a.uri, name: `${name}.pdf`, type: 'application/pdf' };
  }
  const opts: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: !!p.crop,
    aspect: p.crop,
    quality: 1,
  };
  let r: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;
    r = await ImagePicker.launchCameraAsync(opts);
  } else {
    r = await ImagePicker.launchImageLibraryAsync(opts);
  }
  const asset = r.canceled ? null : r.assets[0];
  if (!asset) return null;
  if ((asset.fileSize ?? 0) > 10 * MB) throw new PrepError('big');
  if (asset.type && asset.type !== 'image') throw new PrepError('type');
  return shrink(asset.uri, asset.width, asset.height, p, name);
}

/**
 * Product photos: the gallery allows several at once (up to `max`); the camera takes one. Each is shrunk to a
 * 1600 px JPEG. Returns [] when the seller cancels.
 */
export async function pickPhotos(source: 'camera' | 'gallery', max: number): Promise<LocalFile[]> {
  const p: Preset = PRESETS.product;
  let r: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return [];
    r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  } else {
    r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1, allowsMultipleSelection: max > 1, selectionLimit: max, orderedSelection: true });
  }
  if (r.canceled) return [];
  const out: LocalFile[] = [];
  for (const a of r.assets.slice(0, max)) {
    if ((a.fileSize ?? 0) > 10 * MB) throw new PrepError('big');
    out.push(await shrink(a.uri, a.width, a.height, p, `product${out.length + 1}`));
  }
  return out;
}

async function shrink(uri: string, w: number, h: number, p: Preset, name: string): Promise<LocalFile> {
  try {
    const ctx = ImageManipulator.manipulate(uri);
    const side = Math.max(w, h);
    if (side > p.maxSide) ctx.resize(w >= h ? { width: p.maxSide } : { height: p.maxSide });
    const img = await ctx.renderAsync();
    const out = await img.saveAsync({ format: SaveFormat.JPEG, compress: p.quality });
    return { uri: out.uri, name: `${name}.jpg`, type: 'image/jpeg' };
  } catch {
    throw new PrepError('bad');
  }
}
