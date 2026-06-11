import { useCallback, useEffect, useRef } from 'react';

type OnBeatCallback = (beatIndex: number) => void;

export function useAudioPlayer() {
  // Tone.js モジュールを保持する ref（dynamic import で遅延取得）
  const toneRef = useRef<typeof import('tone') | null>(null);
  const metroSynthRef = useRef<import('tone').Synth | null>(null);
  const chordSynthRef = useRef<import('tone').Synth | null>(null);
  const isInitializedRef = useRef(false);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;
    // SSRガード
    if (typeof window === 'undefined') return;

    try {
      const Tone = await import('tone');
      toneRef.current = Tone;

      // メトロノーム音: 短くシャープな高音
      metroSynthRef.current = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
      }).toDestination();

      // コード音: やや柔らかいサイン波
      chordSynthRef.current = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.5 },
      }).toDestination();

      isInitializedRef.current = true;
    } catch (e) {
      console.error('[ChordRunner] Tone.js の読み込みに失敗しました', e);
      throw e;
    }
  }, []);

  const startTransport = useCallback(
    async (bpm: number, beatsPerChord: number, onBeat: OnBeatCallback) => {
      await initialize();
      const Tone = toneRef.current;
      if (!Tone) return;

      // AudioContext をユーザー操作起点で開始する
      await Tone.start();

      Tone.Transport.bpm.value = bpm;
      Tone.Transport.cancel();

      let beatCount = 0;

      Tone.Transport.scheduleRepeat((time: number) => {
        // メトロノームクリック音
        metroSynthRef.current?.triggerAttackRelease('C6', '16n', time);

        onBeat(beatCount);
        beatCount++;

        // beatsPerChord 拍ごとにコード音（ルートノートは onBeat 側で処理）
      }, '4n');

      Tone.Transport.start();
    },
    [initialize]
  );

  const stopTransport = useCallback(() => {
    const Tone = toneRef.current;
    if (!Tone) return;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }, []);

  /** 現在のコードのルートノートを鳴らす */
  const playChordNote = useCallback((note: string) => {
    if (!chordSynthRef.current) return;
    chordSynthRef.current.triggerAttackRelease(note, '4n');
  }, []);

  useEffect(() => {
    return () => {
      const Tone = toneRef.current;
      if (Tone) {
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }
      metroSynthRef.current?.dispose();
      chordSynthRef.current?.dispose();
    };
  }, []);

  return { startTransport, stopTransport, playChordNote };
}
