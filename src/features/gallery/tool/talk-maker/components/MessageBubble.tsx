// src/features/gallery/tool/talk-maker/components/MessageBubble.tsx
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FC, memo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { BackgroundTheme, TalkMessage, TalkSettings } from '../types';
import { normalizeTime } from '../utils/time';

type Props = {
  message: TalkMessage;
  theme: BackgroundTheme;
  settings: TalkSettings;
  /** 同一送信者の連投時は false にしてアイコンを省略する */
  showIcon: boolean;
  onUpdate: (patch: Partial<Omit<TalkMessage, 'id'>>) => void;
  onDelete: () => void;
};

const MessageBubbleBase: FC<Props> = ({
  message,
  theme,
  settings,
  showIcon,
  onUpdate,
  onDelete,
}) => {
  const isMe = message.sender === 'me';
  const bubbleBg = isMe ? theme.myBubbleBg : theme.otherBubbleBg;
  const bubbleColor = isMe ? theme.myBubbleColor : theme.otherBubbleColor;

  // 時刻はバリデーションが必要なため、確定するまでローカルで保持する
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

  // 時刻・既読のメタ情報（自分は吹き出しの左、相手は右に置く）
  const meta = (settings.showTime || (isMe && settings.showRead)) && (
    <VStack
      spacing={0}
      alignItems={isMe ? 'flex-end' : 'flex-start'}
      justifyContent="flex-end"
      flexShrink={0}
    >
      {isMe && settings.showRead && message.read && (
        <Text fontSize="10px" color={theme.metaColor} lineHeight="1.4">
          既読
        </Text>
      )}
      {settings.showTime && (
        <Text fontSize="10px" color={theme.metaColor} lineHeight="1.4">
          {message.time}
        </Text>
      )}
    </VStack>
  );

  return (
    <Flex
      justify={isMe ? 'flex-end' : 'flex-start'}
      align="flex-end"
      gap="4px"
      px={3}
      data-testid="message-bubble"
    >
      {!isMe && (
        <Box w="32px" flexShrink={0} alignSelf="flex-start">
          {showIcon && (
            <Flex
              w="32px"
              h="32px"
              borderRadius="full"
              bg="whiteAlpha.900"
              align="center"
              justify="center"
              fontSize="20px"
              boxShadow="sm"
            >
              {settings.partnerIcon}
            </Flex>
          )}
        </Box>
      )}

      {isMe && meta}

      <Popover isLazy placement={isMe ? 'left' : 'right'}>
        <PopoverTrigger>
          <Box
            as="button"
            type="button"
            position="relative"
            maxW="70%"
            bg={bubbleBg}
            color={bubbleColor}
            borderRadius="16px"
            px={3}
            py={2}
            fontSize="sm"
            textAlign="left"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            boxShadow="sm"
            cursor="pointer"
            transition="filter 0.15s"
            _hover={{ filter: 'brightness(0.96)' }}
            _before={
              showIcon
                ? {
                    content: '""',
                    position: 'absolute',
                    top: '6px',
                    ...(isMe
                      ? {
                          right: '-6px',
                          borderLeft: `10px solid ${bubbleBg}`,
                        }
                      : {
                          left: '-6px',
                          borderRight: `10px solid ${bubbleBg}`,
                        }),
                    borderBottom: '10px solid transparent',
                  }
                : undefined
            }
          >
            {message.text}
          </Box>
        </PopoverTrigger>
        <PopoverContent w="240px">
          <PopoverArrow />
          <PopoverBody>
            <VStack spacing={3} align="stretch">
              <FormControl>
                <FormLabel fontSize="xs" mb={1}>
                  メッセージ
                </FormLabel>
                <Textarea
                  size="sm"
                  rows={2}
                  value={message.text}
                  onChange={(e) => onUpdate({ text: e.target.value })}
                />
              </FormControl>

              <Flex gap={2}>
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
                {/* 既読は自分のメッセージにしか表示されないため、トグルも自分のときのみ出す */}
                {isMe && (
                  <FormControl>
                    <FormLabel fontSize="xs" mb={1}>
                      既読
                    </FormLabel>
                    <Switch
                      isChecked={message.read}
                      onChange={(e) => onUpdate({ read: e.target.checked })}
                      colorScheme="teal"
                    />
                  </FormControl>
                )}
              </Flex>

              <ButtonGroup size="xs" isAttached w="100%">
                <Button
                  flex={1}
                  colorScheme="teal"
                  variant={isMe ? 'outline' : 'solid'}
                  onClick={() => onUpdate({ sender: 'other' })}
                >
                  相手
                </Button>
                <Button
                  flex={1}
                  colorScheme="teal"
                  variant={isMe ? 'solid' : 'outline'}
                  onClick={() => onUpdate({ sender: 'me' })}
                >
                  自分
                </Button>
              </ButtonGroup>

              <Button
                size="xs"
                colorScheme="red"
                variant="ghost"
                leftIcon={<RiDeleteBin6Line />}
                onClick={onDelete}
              >
                このメッセージを削除
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {!isMe && meta}
    </Flex>
  );
};

export const MessageBubble = memo(MessageBubbleBase);
