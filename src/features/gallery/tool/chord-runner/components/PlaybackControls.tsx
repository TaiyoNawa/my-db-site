import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { AiOutlinePause, AiOutlinePlayCircle } from 'react-icons/ai';

interface Props {
  isPlaying: boolean;
  beatsPerChord: 2 | 4;
  canPlay: boolean;
  onPlay: () => void;
  onStop: () => void;
  onBeatsPerChordChange: (beats: 2 | 4) => void;
}

export function PlaybackControls({
  isPlaying,
  beatsPerChord,
  canPlay,
  onPlay,
  onStop,
  onBeatsPerChordChange,
}: Props) {
  return (
    <Flex align="center" gap={4} wrap="wrap">
      {/* 再生・停止ボタン */}
      {isPlaying ? (
        <Button
          colorScheme="red"
          leftIcon={<AiOutlinePause />}
          onClick={onStop}
        >
          停止
        </Button>
      ) : (
        <Button
          colorScheme="teal"
          leftIcon={<AiOutlinePlayCircle />}
          onClick={() => void onPlay()}
          isDisabled={!canPlay}
        >
          再生
        </Button>
      )}

      {/* 拍数切り替え */}
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color="gray.600">
          拍数:
        </Text>
        <ButtonGroup size="sm" isAttached>
          <Button
            colorScheme={beatsPerChord === 2 ? 'teal' : 'gray'}
            variant={beatsPerChord === 2 ? 'solid' : 'outline'}
            onClick={() => onBeatsPerChordChange(2)}
            isDisabled={isPlaying}
          >
            2拍
          </Button>
          <Button
            colorScheme={beatsPerChord === 4 ? 'teal' : 'gray'}
            variant={beatsPerChord === 4 ? 'solid' : 'outline'}
            onClick={() => onBeatsPerChordChange(4)}
            isDisabled={isPlaying}
          >
            4拍
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
