import { memo, useId } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

type Props = { value: number; size?: number };

const STAR = 'M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.5 5.8 21l1.4-7L2 9.3l7-.8z';
const XS = [0, 24, 48, 72, 96];

/**
 * Five stars filled to the rating (rounded to a half star), brand blue on grey like the website.
 * Drawn as one small vector image (cards show many of these, so ten separate images per rating were costly).
 */
function StarsImpl({ value, size = 14 }: Props) {
  const pct = Math.max(0, Math.min(1, Math.round(value * 2) / 2 / 5));
  const id = `st${useId().replace(/[^A-Za-z0-9]/g, '')}`;
  return (
    <Svg width={size * 5} height={size} viewBox="0 0 120 24" accessibilityLabel={`${value} / 5`}>
      <Defs>
        <ClipPath id={id}>
          <Rect x={0} y={0} width={120 * pct} height={24} />
        </ClipPath>
      </Defs>
      {XS.map((x) => <Path key={x} d={STAR} fill="#d5d9e6" transform={`translate(${x} 0)`} />)}
      <G clipPath={`url(#${id})`}>
        {XS.map((x) => <Path key={x} d={STAR} fill={colors.primary} transform={`translate(${x} 0)`} />)}
      </G>
    </Svg>
  );
}

export const Stars = memo(StarsImpl);
