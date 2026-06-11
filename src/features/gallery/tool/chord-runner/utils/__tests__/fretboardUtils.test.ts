import { describe, expect, it } from 'vitest';

import { resolveGhostDots } from '../fretboardUtils';

import type { FretPosition } from '../../types';

describe('resolveGhostDots', () => {
  it('重複なしのポジションは ghost-filled を返す', () => {
    const current: FretPosition[] = [{ string: 1, fret: 2 }];
    const next: FretPosition[] = [{ string: 3, fret: 1 }];

    const result = resolveGhostDots(current, next);

    expect(result).toHaveLength(1);
    expect(result[0]?.style).toBe('ghost-filled');
  });

  it('同弦・同フレット重複のポジションは ghost-outline を返す', () => {
    const current: FretPosition[] = [{ string: 2, fret: 3 }];
    const next: FretPosition[] = [{ string: 2, fret: 3 }];

    const result = resolveGhostDots(current, next);

    expect(result).toHaveLength(1);
    expect(result[0]?.style).toBe('ghost-outline');
  });

  it('ミュート弦（fret: -1）は結果から除外される', () => {
    const current: FretPosition[] = [{ string: 1, fret: 2 }];
    const next: FretPosition[] = [
      { string: 2, fret: 1 },
      { string: 6, fret: -1 },
    ];

    const result = resolveGhostDots(current, next);

    expect(result).toHaveLength(1);
    expect(result[0]?.string).toBe(2);
  });

  it('next が空配列の場合は空を返す', () => {
    const current: FretPosition[] = [{ string: 1, fret: 2 }];
    const result = resolveGhostDots(current, []);
    expect(result).toHaveLength(0);
  });
});
