import type { FretPosition, ResolvedDot } from '../types';

/**
 * 現在コードのポジションと次コードのポジションを比較し、
 * ゴーストドットのスタイルを決定して返す。
 * - 重複なし → 'ghost-filled'（透過円）
 * - 同弦・同フレット重複 → 'ghost-outline'（枠線のみ）
 * - fret === -1（ミュート）は除外
 */
export function resolveGhostDots(
  current: FretPosition[],
  next: FretPosition[]
): ResolvedDot[] {
  return next
    .filter((pos) => pos.fret !== -1)
    .map((pos) => {
      const isOverlap = current.some(
        (c) => c.string === pos.string && c.fret === pos.fret && c.fret !== -1
      );
      return {
        ...pos,
        style: isOverlap ? 'ghost-outline' : 'ghost-filled',
      } satisfies ResolvedDot;
    });
}

/** currentポジション（ミュート除外）を 'current' スタイルのResolvedDotに変換 */
export function resolveCurrentDots(positions: FretPosition[]): ResolvedDot[] {
  return positions
    .filter((pos) => pos.fret !== -1)
    .map((pos) => ({ ...pos, style: 'current' as const }));
}
