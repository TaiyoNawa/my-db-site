// src/features/gallery/tool/talk-maker/components/TalkPreview.tsx
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { IoCallOutline, IoChevronBack, IoMenuOutline } from 'react-icons/io5';

import { TalkMessage, TalkSettings } from '../types';
import { MessageBubble } from './MessageBubble';
import { getTheme } from '../utils/presets';

type Props = {
  messages: TalkMessage[];
  settings: TalkSettings;
  onUpdateMessage: (
    id: string,
    patch: Partial<Omit<TalkMessage, 'id'>>
  ) => void;
  onRemoveMessage: (id: string) => void;
};

/**
 * トーク画面のプレビュー本体。
 * この ref の DOM がそのまま PNG エクスポートの対象になるため、
 * 内部スクロールを持たせず全メッセージを描画する。
 */
export const TalkPreview = forwardRef<HTMLDivElement, Props>(
  function TalkPreview(
    { messages, settings, onUpdateMessage, onRemoveMessage },
    ref
  ) {
    const theme = getTheme(settings.themeId);

    return (
      <Box
        ref={ref}
        w="100%"
        maxW="380px"
        mx="auto"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="lg"
        data-testid="talk-preview"
      >
        {/* チャットヘッダー */}
        <Flex
          bg={theme.headerBg}
          color={theme.headerColor}
          align="center"
          px={3}
          py={2}
          gap={2}
        >
          <IoChevronBack size={20} />
          <Flex
            w="30px"
            h="30px"
            borderRadius="full"
            bg="whiteAlpha.300"
            align="center"
            justify="center"
            fontSize="18px"
            flexShrink={0}
          >
            {settings.partnerIcon}
          </Flex>
          <Text
            fontSize="sm"
            fontWeight="bold"
            noOfLines={1}
            flex={1}
            textAlign="left"
          >
            {settings.partnerName}
          </Text>
          <IoCallOutline size={18} />
          <IoMenuOutline size={20} />
        </Flex>

        {/* メッセージエリア */}
        <VStack
          bg={theme.bg}
          minH="360px"
          py={4}
          spacing="6px"
          align="stretch"
          justify={messages.length === 0 ? 'center' : 'flex-start'}
        >
          {messages.length === 0 ? (
            <Text
              fontSize="xs"
              color={theme.metaColor}
              textAlign="center"
              px={6}
            >
              下の入力欄からメッセージを追加してみましょう
            </Text>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                theme={theme}
                settings={settings}
                showIcon={
                  index === 0 || messages[index - 1].sender !== message.sender
                }
                onUpdate={(patch) => onUpdateMessage(message.id, patch)}
                onDelete={() => onRemoveMessage(message.id)}
              />
            ))
          )}
        </VStack>
      </Box>
    );
  }
);
