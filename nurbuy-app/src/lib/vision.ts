import { requireOptionalNativeModule } from 'expo';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import type { Product } from '@/api/catalog';

type Label = { text: string; confidence: number };
type Seen = { labels: Label[]; lines: string[] };
type VisionModule = { analyze(uri: string): Promise<Seen> };

// the app's own on-device module (modules/nurbuy-vision); missing in Expo Go, so the feature hides itself there
const native = requireOptionalNativeModule<VisionModule>('NurbuyVision');

export const photoSearchSupported = native !== null;

export type PickResult = { uri: string } | { denied: true } | null;

/** Takes a photo (or picks one) with a crop step so the customer can frame just the product. Null when cancelled. */
export async function pickSearchPhoto(source: 'camera' | 'gallery'): Promise<PickResult> {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return { denied: true };
  }
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, quality: 0.9 };
  const r = source === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
  const asset = r.canceled ? null : r.assets[0];
  if (!asset) return null;
  // 1280 px is plenty for reading a label and keeps the recognition quick
  const img = await ImageManipulator.manipulate(asset.uri).resize({ width: Math.min(asset.width || 1280, 1280) }).renderAsync();
  const out = await img.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
  return { uri: out.uri };
}

// words printed on almost every pack that say nothing about which product it is
const STOP = new Set(
  (
    'the and for with from new best quality pure fresh made product products net weight wt price mrp best before ' +
    'exp mfg date batch ingredients nutrition facts per serving energy store cool dry place keep use only www com ' +
    'ltd limited company bangladesh dhaka imported packed marketed by contains free natural original premium ' +
    'gm gram grams ml ltr litre liter kg pcs pc pack'
  ).split(' '),
);

// a few everyday object names from the on-device labeller, mapped to words used in product titles and tags
const LABEL_WORDS: Record<string, string[]> = {
  shoe: ['shoe', 'shoes', 'sneaker', 'footwear', 'sandal'],
  footwear: ['shoe', 'shoes', 'sandal', 'footwear', 'slipper'],
  sock: ['sock', 'socks'],
  bag: ['bag', 'backpack', 'handbag'],
  handbag: ['bag', 'handbag', 'purse'],
  glasses: ['glasses', 'sunglass', 'sunglasses'],
  sunglasses: ['sunglass', 'sunglasses', 'glasses'],
  watch: ['watch'],
  jacket: ['jacket'],
  jeans: ['jeans', 'pant', 'pants'],
  shirt: ['shirt', 'tshirt', 't-shirt'],
  bottle: ['bottle'],
  cup: ['cup', 'mug'],
  fruit: ['fruit', 'fruits'],
  vegetable: ['vegetable', 'vegetables'],
  bread: ['bread', 'bun'],
  egg: ['egg', 'eggs'],
  cake: ['cake'],
  cookie: ['cookie', 'cookies', 'biscuit'],
  chocolate: ['chocolate'],
  mobile: ['mobile', 'phone'],
  cell: ['mobile', 'phone'],
  computer: ['computer', 'laptop'],
  toy: ['toy', 'toys'],
  flower: ['flower', 'flowers'],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9ঀ-৿]+/g, ' ').trim();
const words = (s: string) => norm(s).split(' ').filter(Boolean);

/** Readable words from the photo's text, most useful first (longer words carry the brand and product name). */
function textTokens(lines: string[]): string[] {
  const out = new Set<string>();
  for (const line of lines) {
    for (const w of words(line)) {
      const hasDigit = /\d/.test(w);
      if (STOP.has(w)) continue;
      if (hasDigit ? w.length < 2 || /^\d+$/.test(w) : w.length < 3) continue;
      out.add(w);
    }
  }
  return [...out].sort((a, b) => b.length - a.length).slice(0, 30);
}

/** True when the two words differ by at most one letter (catches small reading mistakes on long words). */
function near(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1 || a.charAt(0) !== b.charAt(0)) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a.charAt(i) === b.charAt(j)) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export type PhotoMatch = {
  /** best matches first */
  items: Product[];
  /** true when the printed text matched a product (brand or name), not only the kind of object */
  exact: boolean;
  /** words to show the customer as "found in your photo" */
  keywords: string[];
};

/** Ranks the catalog against what the phone saw: printed words count most, the object type helps. */
export function matchPhoto(all: Product[], seen: Seen): PhotoMatch {
  const tokens = textTokens(seen.lines);
  const labels = seen.labels
    .filter((l) => l.confidence >= 0.55)
    .slice(0, 5)
    .map((l) => ({ words: [...new Set(words(l.text).flatMap((w) => LABEL_WORDS[w] ?? [w]))], c: l.confidence, text: l.text }));

  const used = new Map<string, number>();
  const scored: { p: Product; s: number; text: number }[] = [];

  for (const p of all) {
    const hay = new Set(words(`${p.n} ${p.tags} ${p.sub} ${p.cat} ${p.pcode}`));
    if (!hay.size) continue;
    let text = 0;
    for (const t of tokens) {
      let got = 0;
      if (hay.has(t)) got = t.length >= 6 ? 4 : 3;
      else if (t.length >= 4) {
        for (const w of hay) {
          if (w.length >= 4 && (w.startsWith(t) || t.startsWith(w))) {
            got = 2;
            break;
          }
          if (t.length >= 5 && near(t, w)) got = 1.5;
        }
      }
      if (got) {
        text += got;
        used.set(t, (used.get(t) ?? 0) + 1);
      }
    }
    let kind = 0;
    for (const l of labels) if (l.words.some((w) => hay.has(w) || hay.has(`${w}s`))) kind += 2 * l.c;
    const s = text + kind;
    if (s >= 2) scored.push({ p, s, text });
  }

  scored.sort((a, b) => b.s - a.s || b.p.s30 - a.p.s30);
  const exact = (scored[0]?.text ?? 0) >= 3;
  // with a strong text match, drop the weak "same kind of thing" results that would only add noise
  const top = scored[0]?.s ?? 0;
  const items = scored.filter((x) => !exact || x.s >= Math.max(2, top * 0.25)).slice(0, 60).map((x) => x.p);

  // words that actually matched products are the useful ones to show (and to search again with)
  const keywords = [...used.entries()]
    .sort((a, b) => b[0].length - a[0].length)
    .map(([w]) => w)
    .slice(0, 5);
  for (const l of labels) if (keywords.length < 7 && !keywords.includes(l.text.toLowerCase())) keywords.push(l.text.toLowerCase());

  return { items, exact, keywords };
}

/** Reads the photo on the phone and finds matching products. */
export async function searchByPhoto(uri: string, all: Product[]): Promise<PhotoMatch> {
  if (!native) throw new Error('unsupported');
  return matchPhoto(all, await native.analyze(uri));
}
