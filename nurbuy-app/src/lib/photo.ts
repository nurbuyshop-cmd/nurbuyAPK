import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/**
 * Lets the customer pick a photo and shrinks it like the website does:
 * profile photo square, 512 px; cover 1600 px wide. Both are uploaded as JPEG files
 * (the host's security filter refuses "data:image" text, so photos never go inside the profile JSON).
 * Returns null when the customer cancels.
 */
export async function pickPhoto(kind: 'avatar' | 'cover'): Promise<{ uri: string } | null> {
  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: kind === 'avatar' ? [1, 1] : [16, 7],
    quality: 1,
  });
  const asset = r.canceled ? null : r.assets[0];
  if (!asset) return null;
  const ctx = ImageManipulator.manipulate(asset.uri).resize({ width: kind === 'avatar' ? 512 : 1600 });
  const img = await ctx.renderAsync();
  const out = await img.saveAsync({ format: SaveFormat.JPEG, compress: kind === 'avatar' ? 0.85 : 0.8 });
  return { uri: out.uri };
}
