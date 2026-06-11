import { useCallback, useRef, useState } from 'react';

import { useAudioPlayer } from './useAudioPlayer';
import { CHORD_DATA } from '../utils/chordData';

export function usePracticeSession() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [bpm, setBpm] = useState(80);
  const [beatsPerChord, setBeatsPerChord] = useState<2 | 4>(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { startTransport, stopTransport, playChordNote } = useAudioPlayer();

  // Tone コールバック内で最新の sequence / beatsPerChord を参照するため ref を使う
  const sequenceRef = useRef(sequence);
  sequenceRef.current = sequence;
  const beatsPerChordRef = useRef(beatsPerChord);
  beatsPerChordRef.current = beatsPerChord;
  const currentIndexRef = useRef(0);

  const start = useCallback(async () => {
    if (sequence.length === 0) return;
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    // 楽観的UI更新: Transport開始前にボタンを disabled にする
    setIsPlaying(true);

    try {
      await startTransport(bpm, beatsPerChord, (beatIndex: number) => {
        const seq = sequenceRef.current;
        const bpc = beatsPerChordRef.current;

        if (beatIndex % bpc === 0) {
          const idx = Math.floor(beatIndex / bpc) % seq.length;
          currentIndexRef.current = idx;
          setCurrentIndex(idx);

          // コード音を再生
          const chordName = seq[idx];
          if (chordName) {
            const chord = CHORD_DATA[chordName];
            if (chord) playChordNote(chord.audioNote);
          }
        }
      });
    } catch {
      // Tone.js 読み込み失敗時は UI を元に戻す
      setIsPlaying(false);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }
  }, [bpm, beatsPerChord, sequence, startTransport, playChordNote]);

  const stop = useCallback(() => {
    stopTransport();
    setIsPlaying(false);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
  }, [stopTransport]);

  const addChord = useCallback((chordName: string) => {
    setSequence((prev) => (prev.length < 16 ? [...prev, chordName] : prev));
  }, []);

  const removeChord = useCallback((index: number) => {
    setSequence((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    sequence,
    bpm,
    beatsPerChord,
    isPlaying,
    currentIndex,
    setBpm,
    setBeatsPerChord,
    start,
    stop,
    addChord,
    removeChord,
  };
}
