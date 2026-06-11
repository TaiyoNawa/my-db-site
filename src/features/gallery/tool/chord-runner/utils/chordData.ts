import type { ChordDefinition } from '../types';

export const CHORD_DATA: Record<string, ChordDefinition> = {
  C: {
    name: 'C',
    audioNote: 'C3',
    positions: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
      { string: 1, fret: 0 },
      { string: 3, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  G: {
    name: 'G',
    audioNote: 'G2',
    positions: [
      { string: 6, fret: 3, finger: 2 },
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 0 },
      { string: 3, fret: 0 },
      { string: 2, fret: 0 },
      { string: 1, fret: 3, finger: 3 },
    ],
  },
  D: {
    name: 'D',
    audioNote: 'D3',
    positions: [
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: -1 },
      { string: 6, fret: -1 },
    ],
  },
  A: {
    name: 'A',
    audioNote: 'A2',
    positions: [
      { string: 2, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 4, fret: 2, finger: 4 },
      { string: 5, fret: 0 },
      { string: 1, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  E: {
    name: 'E',
    audioNote: 'E2',
    positions: [
      { string: 3, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 2, finger: 3 },
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 6, fret: 0 },
    ],
  },
  Am: {
    name: 'Am',
    audioNote: 'A2',
    positions: [
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 },
      { string: 5, fret: 0 },
      { string: 1, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  Dm: {
    name: 'Dm',
    audioNote: 'D3',
    positions: [
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: -1 },
      { string: 6, fret: -1 },
    ],
  },
  Em: {
    name: 'Em',
    audioNote: 'E2',
    positions: [
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 2, finger: 3 },
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 6, fret: 0 },
    ],
  },
  F: {
    name: 'F',
    audioNote: 'F2',
    // バレーコード: 1フレット全弦バレー + 通常押さえ
    positions: [
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 3, finger: 4 },
      { string: 5, fret: 3, finger: 3 },
      { string: 6, fret: 1, finger: 1 },
    ],
  },
  Bm: {
    name: 'Bm',
    audioNote: 'B2',
    // バレーコード: 2フレット全弦バレー
    positions: [
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 3, finger: 2 },
      { string: 3, fret: 4, finger: 4 },
      { string: 4, fret: 4, finger: 3 },
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: -1 },
    ],
  },
};

export const CHORD_NAMES = Object.keys(CHORD_DATA);
