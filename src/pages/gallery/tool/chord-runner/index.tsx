import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { BpmControl } from '@/features/gallery/tool/chord-runner/components/BpmControl';
import { ChordBuilder } from '@/features/gallery/tool/chord-runner/components/ChordBuilder';
import { Fretboard } from '@/features/gallery/tool/chord-runner/components/Fretboard';
import { PlaybackControls } from '@/features/gallery/tool/chord-runner/components/PlaybackControls';
import { usePracticeSession } from '@/features/gallery/tool/chord-runner/hooks/usePracticeSession';
import { CHORD_DATA } from '@/features/gallery/tool/chord-runner/utils/chordData';

export default function ChordRunnerPage() {
  const { isHeaderHidden } = useStickyHeader();

  const {
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
  } = usePracticeSession();

  const currentChordName = sequence[currentIndex] ?? null;
  const nextChordName = sequence.length > 1
    ? sequence[(currentIndex + 1) % sequence.length]
    : null;

  const currentChord = currentChordName ? (CHORD_DATA[currentChordName] ?? null) : null;
  const nextChord = nextChordName ? (CHORD_DATA[nextChordName] ?? null) : null;

  return (
    <>
      <GalleryMeta
        title="Chord Runner | Haruhate"
        description="ギターのコードチェンジ練習ツール。コード進行を組んでBPMに合わせてループ練習できます。"
        ogUrl="/gallery/tool/chord-runner"
        category="便利ツール"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box pb={{ base: '44px', md: '64px', lg: '80px' }}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={1}>
                Chord Runner
              </Heading>
              <Text fontSize="sm" color="gray.500">
                コード進行を組んで、BPMに合わせてコードチェンジを練習しよう。
              </Text>
            </Box>

            {/* 指板表示 */}
            <Box
              borderWidth={1}
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
              bg="white"
              boxShadow="sm"
            >
              <Flex align="center" justify="space-between" mb={3}>
                <Box>
                  <Text fontSize="xs" color="gray.400" mb={1}>
                    現在のコード
                  </Text>
                  <Heading size="lg" color="gray.800">
                    {currentChordName ?? '—'}
                  </Heading>
                </Box>
                {nextChordName && (
                  <Box textAlign="right">
                    <Text fontSize="xs" color="gray.400" mb={1}>
                      次のコード
                    </Text>
                    <Heading size="lg" color="gray.400">
                      {nextChordName}
                    </Heading>
                  </Box>
                )}
              </Flex>
              <Fretboard currentChord={currentChord} nextChord={nextChord} />
            </Box>

            <Divider />

            {/* コード進行ビルダー */}
            <ChordBuilder
              sequence={sequence}
              isPlaying={isPlaying}
              onAdd={addChord}
              onRemove={removeChord}
            />

            <Divider />

            {/* BPM設定 */}
            <BpmControl bpm={bpm} isPlaying={isPlaying} onChange={setBpm} />

            {/* 再生コントロール */}
            <PlaybackControls
              isPlaying={isPlaying}
              beatsPerChord={beatsPerChord}
              canPlay={sequence.length > 0}
              onPlay={() => void start()}
              onStop={stop}
              onBeatsPerChordChange={setBeatsPerChord}
            />
          </VStack>
        </Box>
      </SectionWrapper>
    </>
  );
}
