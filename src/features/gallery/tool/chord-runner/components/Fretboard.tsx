import { useMemo } from 'react';

import { FretDot } from './FretDot';
import { resolveCurrentDots, resolveGhostDots } from '../utils/fretboardUtils';

import type { ChordDefinition } from '../types';

const SVG_WIDTH = 220;
const SVG_HEIGHT = 160;
const FRET_COUNT = 5;
const STRING_COUNT = 6;
const PADDING = { top: 20, bottom: 20, left: 30, right: 20 };

const INNER_WIDTH = SVG_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = SVG_HEIGHT - PADDING.top - PADDING.bottom;
const FRET_SPACING = INNER_WIDTH / FRET_COUNT;
const STRING_SPACING = INNER_HEIGHT / (STRING_COUNT - 1);
const DOT_RADIUS = 8;

/** 弦番号(1〜6)をY座標に変換。1弦=上(高音)、6弦=下(低音) */
function stringToY(string: number): number {
  return PADDING.top + (string - 1) * STRING_SPACING;
}

/** フレット番号(1〜5)をX座標に変換（開放弦=0はナットより左） */
function fretToX(fret: number): number {
  return PADDING.left + (fret - 0.5) * FRET_SPACING;
}

interface Props {
  currentChord: ChordDefinition | null;
  nextChord: ChordDefinition | null;
}

export function Fretboard({ currentChord, nextChord }: Props) {
  const currentDots = useMemo(
    () => (currentChord ? resolveCurrentDots(currentChord.positions) : []),
    [currentChord]
  );

  const ghostDots = useMemo(() => {
    if (!nextChord) return [];
    const current = currentChord?.positions ?? [];
    return resolveGhostDots(current, nextChord.positions);
  }, [currentChord, nextChord]);

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ maxWidth: SVG_WIDTH, display: 'block', margin: '0 auto' }}
      aria-label={currentChord ? `${currentChord.name}コードの指板` : '指板'}
    >
      {/* フレット縦線 */}
      {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={PADDING.left + i * FRET_SPACING}
          y1={PADDING.top}
          x2={PADDING.left + i * FRET_SPACING}
          y2={SVG_HEIGHT - PADDING.bottom}
          stroke={i === 0 ? '#1A202C' : '#CBD5E0'}
          strokeWidth={i === 0 ? 3 : 1}
        />
      ))}

      {/* 弦横線 */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={PADDING.left}
          y1={PADDING.top + i * STRING_SPACING}
          x2={SVG_WIDTH - PADDING.right}
          y2={PADDING.top + i * STRING_SPACING}
          stroke="#718096"
          strokeWidth={1}
        />
      ))}

      {/* フレット番号ラベル */}
      {Array.from({ length: FRET_COUNT }, (_, i) => (
        <text
          key={`fret-label-${i}`}
          x={PADDING.left + (i + 0.5) * FRET_SPACING}
          y={SVG_HEIGHT - 4}
          textAnchor="middle"
          fontSize={10}
          fill="#718096"
        >
          {i + 1}
        </text>
      ))}

      {/* 弦番号ラベル */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <text
          key={`string-label-${i}`}
          x={PADDING.left - 8}
          y={PADDING.top + i * STRING_SPACING + 4}
          textAnchor="middle"
          fontSize={9}
          fill="#A0AEC0"
        >
          {i + 1}
        </text>
      ))}

      {/* ゴーストドット（先に描画して後ろに回す） */}
      {ghostDots.map((dot, idx) => (
        <FretDot
          key={`ghost-${idx}`}
          cx={fretToX(dot.fret)}
          cy={stringToY(dot.string)}
          r={DOT_RADIUS}
          variant={dot.style}
        />
      ))}

      {/* 現在コードのドット */}
      {currentDots.map((dot, idx) => (
        <FretDot
          key={`current-${idx}`}
          cx={fretToX(dot.fret)}
          cy={stringToY(dot.string)}
          r={DOT_RADIUS}
          variant="current"
        />
      ))}

      {/* 開放弦マーク（○）: fret===0 の弦 */}
      {currentChord?.positions
        .filter((p) => p.fret === 0)
        .map((p, idx) => (
          <circle
            key={`open-${idx}`}
            cx={PADDING.left - 14}
            cy={stringToY(p.string)}
            r={5}
            fill="none"
            stroke="#2D3748"
            strokeWidth={1.5}
          />
        ))}

      {/* ミュート弦マーク（×）: fret===-1 の弦 */}
      {currentChord?.positions
        .filter((p) => p.fret === -1)
        .map((p, idx) => {
          const x = PADDING.left - 14;
          const y = stringToY(p.string);
          return (
            <g key={`mute-${idx}`}>
              <line
                x1={x - 4}
                y1={y - 4}
                x2={x + 4}
                y2={y + 4}
                stroke="#E53E3E"
                strokeWidth={1.5}
              />
              <line
                x1={x + 4}
                y1={y - 4}
                x2={x - 4}
                y2={y + 4}
                stroke="#E53E3E"
                strokeWidth={1.5}
              />
            </g>
          );
        })}
    </svg>
  );
}
