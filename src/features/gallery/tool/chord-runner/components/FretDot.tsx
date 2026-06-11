import type { ResolvedDot } from '../types';

interface Props {
  cx: number;
  cy: number;
  r: number;
  variant: ResolvedDot['style'];
}

export function FretDot({ cx, cy, r, variant }: Props) {
  if (variant === 'current') {
    return <circle cx={cx} cy={cy} r={r} fill="#2D3748" opacity={1} />;
  }
  if (variant === 'ghost-filled') {
    return <circle cx={cx} cy={cy} r={r} fill="#718096" opacity={0.3} />;
  }
  // ghost-outline: 重複位置はドーナツ形状
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke="#718096"
      strokeWidth={2}
      opacity={0.5}
    />
  );
}
