import { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Shape =
  | { p: string; evenodd?: boolean }
  | { c: [number, number, number] }
  | { r: [number, number, number, number, number] };

/** Filled icons draw with fill, the rest are 24px line icons (stroke). Paths are copied from the website. */
type Def = { fill?: boolean; s: Shape[] };

const ICONS = {
  // bottom tab bar (filled, from the website's phone nav)
  navHome: { fill: true, s: [{ p: 'M12 3L2 12h3v8h5v-6h4v6h5v-8h3z' }] },
  navCategory: { fill: true, s: [{ p: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' }] },
  navWallet: { fill: true, s: [{ p: 'M3 6a2 2 0 012-2h13v3H5v1h15a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2zm14 7a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z' }] },
  navCart: { fill: true, s: [{ p: 'M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM1 2v2h2l3.6 7.6-1.4 2.4A2 2 0 007 17h12v-2H7.4l1.1-2h7.5a2 2 0 001.7-1l3.6-6.5A1 1 0 0020.4 4H5.2l-.9-2z' }] },
  navOrders: { fill: true, s: [{ p: 'M5 2h14a1 1 0 011 1v19l-3-2-2.5 2-2.5-2-2.5 2L7 20l-3 2V3a1 1 0 011-1zm3 5v2h8V7zm0 4v2h8v-2zm0 4v2h5v-2z', evenodd: true }] },
  navProfile: { fill: true, s: [{ p: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-8 10v-2a6 6 0 016-6h4a6 6 0 016 6v2z' }] },

  // line icons (UICP set)
  bolt: { s: [{ p: 'M13 2L4 14h7l-1 8 9-12h-7z' }] },
  car: { s: [{ p: 'M5 17H4.5A1.5 1.5 0 0 1 3 15.5V12l2-5.2A2 2 0 0 1 6.9 5.5h10.2A2 2 0 0 1 19 6.8L21 12v3.5a1.5 1.5 0 0 1-1.5 1.5H19' }, { c: [7.5, 17, 2] }, { c: [16.5, 17, 2] }, { p: 'M9.5 17h5M3 12h18' }] },
  heart: { s: [{ p: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z' }] },
  shield: { s: [{ p: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z' }, { p: 'M12 8v5M12 16.5v.01' }] },
  phone: { s: [{ p: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' }] },
  globe: { s: [{ c: [12, 12, 9] }, { p: 'M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18' }] },
  eye: { s: [{ p: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z' }, { c: [12, 12, 3] }] },
  eyeOff: { s: [{ p: 'M3 3l18 18M10.6 6.1A9.5 9.5 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.8M6.3 7.7A16 16 0 002 12s4 7 10 7a9.5 9.5 0 004-.9' }] },
  x: { s: [{ p: 'M6 6l12 12M18 6L6 18' }] },
  user: { s: [{ c: [12, 8, 4] }, { p: 'M4 21c0-4 3.5-6 8-6s8 2 8 6' }] },
  check: { s: [{ p: 'M5 12.5l4.5 4.5L19 7.5' }] },
  back: { s: [{ p: 'M15 5l-7 7 7 7' }] },
  chevron: { s: [{ p: 'M9 5l7 7-7 7' }] },
  mail: { s: [{ r: [3, 5, 18, 14, 2] }, { p: 'M3 7l9 6 9-6' }] },
  star: { fill: true, s: [{ p: 'M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.5 5.8 21l1.4-7L2 9.3l7-.8z' }] },
  heartOn: { fill: true, s: [{ p: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z' }] },
  clock: { s: [{ c: [12, 12, 9] }, { p: 'M12 7v5l3 2' }] },
  scooter: { s: [{ c: [6, 17, 3] }, { c: [18, 17, 3] }, { p: 'M6 17l3-7h5l4 7M9 10L8 7H5M14 10l-1-3h3' }] },
  plus: { s: [{ p: 'M12 5v14M5 12h14' }] },
  minus: { s: [{ p: 'M5 12h14' }] },
  search: { s: [{ c: [11, 11, 7] }, { p: 'M21 21l-4.3-4.3' }] },
  share: { s: [{ c: [18, 5, 3] }, { c: [6, 12, 3] }, { c: [18, 19, 3] }, { p: 'M8.6 13.5l6.8 4M15.4 6.5l-6.8 4' }] },
  store: { s: [{ p: 'M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 14v7h14v-7' }] },
  pin: { s: [{ p: 'M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z' }, { c: [12, 10, 2.5] }] },
  truck: { s: [{ p: 'M3 6h11v10H3zM14 9h4l3 3v4h-7' }, { c: [7, 17.5, 1.8] }, { c: [17, 17.5, 1.8] }] },
  ticket: { s: [{ p: 'M3 9V6h18v3a3 3 0 0 0 0 6v3H3v-3a3 3 0 0 0 0-6z' }, { p: 'M9.5 14.5l5-5M9.5 9.5v.01M14.5 14.5v.01' }] },
  copy: { s: [{ r: [9, 9, 12, 12, 2] }, { p: 'M5 15V5a2 2 0 0 1 2-2h8' }] },
  grid: { s: [{ r: [3, 3, 7, 7, 1] }, { r: [14, 3, 7, 7, 1] }, { r: [3, 14, 7, 7, 1] }, { r: [14, 14, 7, 7, 1] }] },
  flame: { s: [{ p: 'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z' }] },
  spark: { s: [{ p: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z' }] },
  bag: { s: [{ p: 'M6 7h12l1 14H5zM9 7a3 3 0 0 1 6 0' }] },
  bell: { s: [{ p: 'M18 16v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1z' }, { p: 'M10 21a2 2 0 0 0 4 0' }] },
  playFill:{ fill: true, s: [{ p: 'M8 5v14l11-7z' }] },
  pauseFill: { fill: true, s: [{ p: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' }] },
  mic: { s: [{ r: [9, 3, 6, 11, 3] }, { p: 'M5 11a7 7 0 0 0 14 0M12 18v3' }] },
  send: { fill: true, s: [{ p: 'M3 20.5l18-8.5L3 3.5l2 7 9 1.5-9 1.5z' }] },
  image: { s: [{ r: [3, 4, 18, 16, 2] }, { c: [9, 10, 2] }, { p: 'M21 16l-5-5-9 9' }] },
  chat: { s: [{ p: 'M4 5h16v11H9l-5 4z' }, { p: 'M8 9.5h8M8 12.5h5' }] },
  tool: { s: [{ p: 'M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z' }] },
  cam: { s: [{ p: 'M4 8h3l2-3h6l2 3h3v11H4z' }, { c: [12, 13.5, 3.5] }] },
  pen: { s: [{ p: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4' }] },
  lock: { s: [{ r: [5, 11, 14, 10, 2] }, { p: 'M8 11V8a4 4 0 0 1 8 0v3' }] },
  trash: { s: [{ p: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6' }] },
  info: { s: [{ c: [12, 12, 9] }, { p: 'M12 11v6M12 7.5v.01' }] },
  ret: { s: [{ p: 'M9 14L4 9l5-5' }, { p: 'M4 9h10a6 6 0 0 1 0 12h-3' }] },
  logout: { s: [{ p: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11' }] },
  cart: { s: [{ c: [9, 20, 1.5] }, { c: [18, 20, 1.5] }, { p: 'M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6' }] },
  box: { s: [{ p: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8' }] },
  ok: { s: [{ c: [12, 12, 9] }, { p: 'M8 12.5l2.7 2.7L16 9.5' }] },
  wallet: { s: [{ p: 'M5 7V6a2 2 0 012-2h10v3' }, { r: [3, 7, 18, 13, 2.5] }, { c: [16.5, 13.5, 1.2] }] },
  users: { s: [{ c: [9, 8, 3.5] }, { p: 'M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5' }] },
} satisfies Record<string, Def>;

export type IconName = keyof typeof ICONS;

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

function IconImpl({ name, size = 24, color = '#151a2d', strokeWidth = 1.8 }: Props) {
  const def: Def = ICONS[name];
  const paint = def.fill
    ? { fill: color, stroke: 'none' }
    : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {def.s.map((s, i) => {
        if ('p' in s) return <Path key={i} d={s.p} fillRule={s.evenodd ? 'evenodd' : undefined} {...paint} />;
        if ('c' in s) return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} {...paint} />;
        return <Rect key={i} x={s.r[0]} y={s.r[1]} width={s.r[2]} height={s.r[3]} rx={s.r[4]} {...paint} />;
      })}
    </Svg>
  );
}

export const Icon = memo(IconImpl);
