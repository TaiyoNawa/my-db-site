// src/features/gallery/tool/talk-maker/components/SystemMessage.tsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FC, memo, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { TalkMessage } from '../types';
import { normalizeTime } from '../utils/time';

type Props = {
  message: TalkMessage;
  /** 日付ラベルは時刻を出さないため、システムメッセージのみ参照する */
  showTime: boolean;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onUpdate: (patch: Partial<Omit<TalkMessage, 'id'>>) => void;
  onDelete: () => void;
};

/** 中央表示の日付ラベル・システムメッセージ（入室・退会など） */
const SystemMessageBase: FC<Props> = ({
  message,
  showTime,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  onUpdate,
  onDelete,
}) => {
  const isDate = message.kind === 'date';
  const [timeDraft, setTimeDraft] = useState(message.time);

  const commitTime = () => {
    const normalized = normalizeTime(timeDraft);
    if (normalized) {
      onUpdate({ time: normalized });
      setTimeDraft(normalized);
    } else {
      setTimeDraft(message.time);
    }
  };

  const pill = (
    <Box
      as="button"
      type="button"
      position="relative"
      maxW="85%"
      bg="blackAlpha.400"
      color="white"
      borderRadius={isDate ? 'full' : 'xl'}
      px={3}
      py={isDate ? '2px' : 2}
      fontSize="10px"
      textAlign="center"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      cursor="pointer"
      boxShadow={
        selectionMode && isSelected
          ? '0 0 0 3px var(--chakra-colors-teal-400)'
          : 'none'
      }
      transition="filter 0.15s, box-shadow 0.15s"
      _hover={{ filter: 'brightness(0.9)' }}
      _focus={{ outline: 'none' }}
      _focusVisible={{ boxShadow: 'outline' }}
      onClick={selectionMode ? onToggleSelect : undefined}
    >
      {!isDate && showTime && (
        <Text fontSize="10px" lineHeight="1.6">
          {message.time}
        </Text>
      )}
      {message.text}
      {selectionMode && isSelected && (
        <Box
          position="absolute"
          top="-8px"
          right="-8px"
          color="teal.400"
          bg="white"
          borderRadius="full"
          lineHeight={0}
        >
          <IoCheckmarkCircle size={20} />
        </Box>
      )}
    </Box>
  );

  return (
    <Flex justify="center" px={3} data-testid="system-message">
      {selectionMode ? (
        pill
      ) : (
        <Popover isLazy placement="bottom">
          <PopoverTrigger>{pill}</PopoverTrigger>
          <PopoverContent w="240px">
            <PopoverArrow />
            <PopoverBody>
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" mb={1}>
                    {isDate ? '日付ラベル' : 'システムメッセージ'}
                  </FormLabel>
                  <Textarea
                    size="sm"
                    rows={2}
                    value={message.text}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                  />
                </FormControl>
                {!isDate && (
                  <FormControl>
                    <FormLabel fontSize="xs" mb={1}>
                      時刻
                    </FormLabel>
                    <Input
                      size="sm"
                      value={timeDraft}
                      onChange={(e) => setTimeDraft(e.target.value)}
                      onBlur={commitTime}
                      placeholder="12:34"
                    />
                  </FormControl>
                )}
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<RiDeleteBin6Line />}
                  onClick={onDelete}
                >
                  削除
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
};

export const SystemMessage = memo(SystemMessageBase);
