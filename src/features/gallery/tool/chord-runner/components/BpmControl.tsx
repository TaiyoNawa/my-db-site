import {
  Box,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';

const BPM_MIN = 40;
const BPM_MAX = 200;

interface Props {
  bpm: number;
  isPlaying: boolean;
  onChange: (bpm: number) => void;
}

export function BpmControl({ bpm, isPlaying, onChange }: Props) {
  const handleChange = (value: number) => {
    if (isNaN(value)) return;
    const clamped = Math.min(BPM_MAX, Math.max(BPM_MIN, value));
    onChange(clamped);
  };

  return (
    <Box>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="sm" fontWeight="bold" color="gray.600" minW="40px">
          BPM
        </Text>
        <NumberInput
          value={bpm}
          min={BPM_MIN}
          max={BPM_MAX}
          onChange={(_, val) => handleChange(val)}
          isDisabled={isPlaying}
          size="sm"
          w="80px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Slider
        value={bpm}
        min={BPM_MIN}
        max={BPM_MAX}
        onChange={handleChange}
        isDisabled={isPlaying}
        colorScheme="teal"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Flex justify="space-between" mt={1}>
        <Text fontSize="xs" color="gray.400">
          {BPM_MIN}
        </Text>
        <Text fontSize="xs" color="gray.400">
          {BPM_MAX}
        </Text>
      </Flex>
    </Box>
  );
}
