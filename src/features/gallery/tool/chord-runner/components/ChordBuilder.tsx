import { CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { CHORD_NAMES } from '../utils/chordData';

interface Props {
  sequence: string[];
  isPlaying: boolean;
  onAdd: (chordName: string) => void;
  onRemove: (index: number) => void;
}

export function ChordBuilder({ sequence, isPlaying, onAdd, onRemove }: Props) {
  const isFull = sequence.length >= 16;

  return (
    <Box>
      {/* コードボタン */}
      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
        コードを選んで追加
      </Text>
      <Wrap spacing={2} mb={4}>
        {CHORD_NAMES.map((name) => (
          <WrapItem key={name}>
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={() => onAdd(name)}
              isDisabled={isFull || isPlaying}
            >
              {name}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      {/* タイムライン */}
      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
        コード進行 ({sequence.length}/16)
      </Text>
      {sequence.length === 0 ? (
        <Text fontSize="sm" color="gray.400">
          コードを選んで追加してください
        </Text>
      ) : (
        <HStack spacing={2} wrap="wrap">
          {sequence.map((chordName, index) => (
            <Flex
              key={index}
              align="center"
              gap={1}
              bg="gray.100"
              borderRadius="md"
              px={2}
              py={1}
            >
              <Badge colorScheme="teal" fontSize="sm">
                {chordName}
              </Badge>
              <IconButton
                aria-label={`${chordName}を削除`}
                icon={<CloseIcon boxSize={2} />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => onRemove(index)}
                isDisabled={isPlaying}
              />
            </Flex>
          ))}
        </HStack>
      )}

      {isFull && (
        <Text fontSize="xs" color="orange.500" mt={1}>
          最大16コードです
        </Text>
      )}
    </Box>
  );
}
