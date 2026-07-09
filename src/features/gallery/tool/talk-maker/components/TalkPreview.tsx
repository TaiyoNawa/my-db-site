// src/features/gallery/tool/talk-maker/components/TalkPreview.tsx
import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { forwardRef } from 'react';
import {
  IoCallOutline,
  IoChevronBack,
  IoMenuOutline,
  IoSearchOutline,
} from 'react-icons/io5';

import { TalkMessage, TalkSettings } from '../types';
import { MessageBubble } from './MessageBubble';
import { SystemMessage } from './SystemMessage';
import { getFont, getTheme } from '../utils/presets';

/** 中央表示（日付・システム）のメッセージか */
const isCenteredMessage = (m: TalkMessage) =>
  m.kind === 'date' || m.kind === 'system';

type Props = {
  messages: TalkMessage[];
  settings: TalkSettings;
  selectionMode?: boolean;
  selectedIds?: ReadonlySet<string>;
  onToggleSelect?: (id: string) => void;
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
    {
      messages,
      settings,
      selectionMode = false,
      selectedIds,
      onToggleSelect,
      onUpdateMessage,
      onRemoveMessage,
    },
    ref
  ) {
    const theme = getTheme(settings.themeId);
    const isGroup = settings.members.length >= 2;

    const resolveMember = (message: TalkMessage) =>
      settings.members.find((m) => m.id === message.memberId) ??
      settings.members[0];

    return (
      <Box
        ref={ref}
        w="100%"
        maxW="380px"
        mx="auto"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="lg"
        fontFamily={getFont(settings.fontId).fontFamily}
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
            overflow="hidden"
          >
            {settings.partnerIconImage ? (
              <Image
                src={settings.partnerIconImage}
                alt="トークアイコン"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            ) : (
              settings.partnerIcon
            )}
          </Flex>
          <Text
            fontSize="sm"
            fontWeight="bold"
            noOfLines={1}
            flex={1}
            textAlign="left"
          >
            {settings.partnerName}
            {isGroup && ` (${settings.members.length + 1})`}
          </Text>
          <IoSearchOutline size={18} />
          <IoCallOutline size={18} />
          <IoMenuOutline size={20} />
        </Flex>

        {/* メッセージエリア */}
        <VStack
          bg={theme.bg}
          bgImage={
            settings.backgroundImage
              ? `url(${settings.backgroundImage})`
              : undefined
          }
          bgSize="cover"
          bgPosition="center"
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
            messages.map((message, index) => {
              if (isCenteredMessage(message)) {
                return (
                  <SystemMessage
                    key={message.id}
                    message={message}
                    showTime={settings.showTime}
                    selectionMode={selectionMode}
                    isSelected={selectedIds?.has(message.id) ?? false}
                    onToggleSelect={
                      onToggleSelect
                        ? () => onToggleSelect(message.id)
                        : undefined
                    }
                    onUpdate={(patch) => onUpdateMessage(message.id, patch)}
                    onDelete={() => onRemoveMessage(message.id)}
                  />
                );
              }
              const prev = messages[index - 1];
              // 日付・システムを挟んだら連投扱いをリセットしてアイコンを出し直す
              const isGroupStart =
                index === 0 ||
                isCenteredMessage(prev) ||
                prev.sender !== message.sender ||
                prev.memberId !== message.memberId;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  theme={theme}
                  settings={settings}
                  member={
                    message.sender === 'other'
                      ? resolveMember(message)
                      : undefined
                  }
                  showIcon={isGroupStart}
                  showName={isGroup && isGroupStart}
                  selectionMode={selectionMode}
                  isSelected={selectedIds?.has(message.id) ?? false}
                  onToggleSelect={
                    onToggleSelect ? () => onToggleSelect(message.id) : undefined
                  }
                  onUpdate={(patch) => onUpdateMessage(message.id, patch)}
                  onDelete={() => onRemoveMessage(message.id)}
                />
              );
            })
          )}
        </VStack>
      </Box>
    );
  }
);
