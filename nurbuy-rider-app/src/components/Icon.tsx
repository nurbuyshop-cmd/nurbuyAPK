import { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Shape = { p: string } | { c: [number, number, number] } | { r: [number, number, number, number, number] };

/** Filled icons draw with fill, the rest are 24px line icons (stroke). Paths are copied from the seller and rider websites. */
type Def = { fill?: boolean; s: Shape[] };

const ICONS = {
  // bottom bar (filled)
  navHome: { fill: true, s: [{ p: 'M12 3L2 12h3v8h5v-6h4v6h5v-8h3z' }] },
  navBox: { fill: true, s: [{ p: 'M12 2l9 5v10l-9 5-9-5V7zm0 2.3L5.6 7.8 12 11.3l6.4-3.5zM4.5 9.4v6.7l6.75 3.7v-6.7zm15 0l-6.75 3.7v6.7l6.75-3.7z' }] },
  navOrders: { fill: true, s: [{ p: 'M5 2h14a1 1 0 011 1v19l-3-2-2.5 2-2.5-2-2.5 2L7 20l-3 2V3a1 1 0 011-1zm3 5v2h8V7zm0 4v2h8v-2zm0 4v2h5v-2z' }] },
  navHistory: { fill: true, s: [{ p: 'M12 2a10 10 0 110 20 10 10 0 010-20zm-1.1 4.5v6.6l5.2 3.1 1.1-1.8-4.1-2.4V6.5z' }] },
  navBell: { fill: true, s: [{ p: 'M12 2a6 6 0 00-6 6c0 6.2-3 8.6-3 8.6V18h18v-1.4S18 14.2 18 8a6 6 0 00-6-6zm-2.6 17.5a2.7 2.7 0 005.2 0z' }] },
  navProfile: { fill: true, s: [{ p: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-8 10v-2a6 6 0 016-6h4a6 6 0 016 6v2z' }] },

  // line icons
  home: { s: [{ p: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' }] },
  list: { s: [{ p: 'M8 6h13M8 12h13M8 18h13' }, { c: [3.5, 6, 1] }, { c: [3.5, 12, 1] }, { c: [3.5, 18, 1] }] },
  bell: { s: [{ p: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' }, { p: 'M13.7 21a2 2 0 0 1-3.4 0' }] },
  user: { s: [{ c: [12, 8, 4] }, { p: 'M4 21a8 8 0 0 1 16 0' }] },
  shop: { s: [{ p: 'M3 9l1-5h16l1 5' }, { p: 'M4 9v11h16V9' }, { p: 'M9 20v-6h6v6' }, { p: 'M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0' }] },
  check: { s: [{ p: 'M20 6L9 17l-5-5' }] },
  x: { s: [{ p: 'M18 6L6 18M6 6l12 12' }] },
  clock: { s: [{ c: [12, 12, 9] }, { p: 'M12 7v5l3 2' }] },
  bolt: { s: [{ p: 'M13 2L3 14h8l-1 8 10-12h-8z' }] },
  eye: { s: [{ p: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z' }, { c: [12, 12, 3] }] },
  eyeOff: { s: [{ p: 'M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 5.1A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22' }] },
  camera: { s: [{ p: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' }, { c: [12, 13, 4] }] },
  back: { s: [{ p: 'M15 18l-6-6 6-6' }] },
  refresh: { s: [{ p: 'M23 4v6h-6M1 20v-6h6' }, { p: 'M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15' }] },
  logout: { s: [{ p: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' }] },
  edit: { s: [{ p: 'M12 20h9' }, { p: 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' }] },
  lock: { s: [{ r: [4, 11, 16, 10, 2] }, { p: 'M8 11V7a4 4 0 0 1 8 0v4' }] },
  alert: { s: [{ p: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z' }, { p: 'M12 9v4M12 17h.01' }] },
  box: { s: [{ p: 'M21 8l-9-5-9 5v8l9 5 9-5z' }, { p: 'M3.3 7.5L12 12.5l8.7-5M12 22V12.5' }] },
  file: { s: [{ p: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }, { p: 'M14 2v6h6' }] },
  globe: { s: [{ c: [12, 12, 10] }, { p: 'M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20' }] },
  chevron: { s: [{ p: 'M9 6l6 6-6 6' }] },
  info: { s: [{ c: [12, 12, 10] }, { p: 'M12 16v-4M12 8h.01' }] },
  trash: { s: [{ p: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14' }] },
  plus: { s: [{ p: 'M12 5v14M5 12h14' }] },
  search: { s: [{ c: [11, 11, 7] }, { p: 'M21 21l-4.3-4.3' }] },
  img: { s: [{ r: [3, 3, 18, 18, 2] }, { c: [8.5, 8.5, 1.5] }, { p: 'M21 15l-5-5L5 21' }] },
  tag: { s: [{ p: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z' }, { c: [7, 7, 1.5] }] },
  wallet: { s: [{ p: 'M5 7V6a2 2 0 012-2h10v3' }, { r: [3, 7, 18, 13, 2.5] }, { c: [16.5, 13.5, 1.2] }] },
  receipt: { s: [{ p: 'M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z' }, { p: 'M9 7h6M9 11h6M9 15h4' }] },
  pin: { s: [{ p: 'M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z' }, { c: [12, 9.5, 2.5] }] },
  history: { s: [{ p: 'M3 12a9 9 0 1 0 3-6.7L3 8' }, { p: 'M3 3v5h5' }, { p: 'M12 7v5l3 2' }] },
  phone: { s: [{ p: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z' }] },
  nav: { s: [{ p: 'M3 11l19-9-9 19-2-8z' }] },
  bag: { s: [{ p: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }, { p: 'M3 6h18M16 10a4 4 0 0 1-8 0' }] },
  bank: { s: [{ p: 'M3 10l9-6 9 6' }, { p: 'M5 10v8M9 10v8M15 10v8M19 10v8' }, { p: 'M3 20h18' }] },
  up: { s: [{ p: 'M12 19V5M5 12l7-7 7 7' }] },
  cycle: { s: [{ c: [5.5, 17, 3.5] }, { c: [18.5, 17, 3.5] }, { p: 'M5.5 17L9 8h5l4.5 9M9 8l3 9M14 8l-1-3h-2' }] },
  bike: { s: [{ c: [5.5, 17, 3] }, { c: [18.5, 17, 3] }, { p: 'M5.5 17l3-6h6l4 6M14.5 11l-1.5-4h-3M16 7h3' }] },
  car: { s: [{ p: 'M5 17H3v-5l2-5h14l2 5v5h-2' }, { c: [7.5, 17, 2] }, { c: [16.5, 17, 2] }, { p: 'M9.5 17h5M3 12h18' }] },
} satisfies Record<string, Def>;

export type IconName = keyof typeof ICONS;

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

function IconImpl({ name, size = 24, color = '#151a2d', strokeWidth = 1.9 }: Props) {
  const def: Def = ICONS[name];
  const paint = def.fill
    ? { fill: color, stroke: 'none' }
    : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {def.s.map((s, i) => {
        if ('p' in s) return <Path key={i} d={s.p} fillRule={def.fill ? 'evenodd' : undefined} {...paint} />;
        if ('c' in s) return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} {...paint} />;
        return <Rect key={i} x={s.r[0]} y={s.r[1]} width={s.r[2]} height={s.r[3]} rx={s.r[4]} {...paint} />;
      })}
    </Svg>
  );
}

export const Icon = memo(IconImpl);
