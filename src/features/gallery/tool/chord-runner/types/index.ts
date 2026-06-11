/** ギター弦ごとの押さえ方。string: 1=1弦(高音)〜6=6弦(低音)、fret: 0=開放弦、-1=ミュート */
export interface FretPosition {
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fret: number;
  finger?: 1 | 2 | 3 | 4;
}

/** コード定義データ */
export interface ChordDefinition {
  name: string;
  positions: FretPosition[];
  /** Tone.js Synth に渡すルートノート e.g. "C3" */
  audioNote: string;
}

/** ゴーストドットのスタイルを付加したポジション */
export interface ResolvedDot extends FretPosition {
  style: 'current' | 'ghost-filled' | 'ghost-outline';
}

/** 練習セッションの状態 */
export interface PracticeSession {
  sequence: string[];
  bpm: number;
  beatsPerChord: 2 | 4;
  isPlaying: boolean;
  currentIndex: number;
}
