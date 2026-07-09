// src/features/gallery/tool/talk-maker/components/MessageBubble.tsx
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FC, ReactNode, memo, useState } from 'react';
import { IoCall, IoCheckmarkCircle } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';

import {
  BackgroundTheme,
  CallStatus,
  TalkMember,
  TalkMessage,
  TalkSettings,
} from '../types';
import { CALL_STATUS_LABELS } from '../utils/presets';
import { normalizeTime } from '../utils/time';

type Props = {
  message: TalkMessage;
  theme: BackgroundTheme;
  settings: TalkSettings;
  /** 送信メンバー（sender==='other' のとき）。未指定時は settings.partnerIcon を使う */
  member?: TalkMember;
  /** 同一送信者の連投時は false にしてアイコンを省略する */
  showIcon: boolean;
  /** グループ時に吹き出しの上へメンバー名を表示する */
  showName?: boolean;
  /** 選択モード: タップが編集ではなく選択になる */
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onUpdate: (patch: Partial<Omit<TalkMessage, 'id'>>) => void;
  onDelete: () => void;
};

const MessageBubbleBase: FC<Props> = ({
  message,
  theme,
  settings,
  member,
  showIcon,
  showName = false,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  onUpdate,
  onDelete,
}) => {
  const isMe = message.sender === 'me';
  const isImage = Boolean(message.imageUrl);
  const isCall = message.kind === 'call';
  const callStatus: CallStatus = message.callStatus ?? 'completed';
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

  const avatarIcon = member?.icon ?? settings.partnerIcon;
  const avatarImage = member?.iconImage;

  const bubbleBody: ReactNode = isImage ? (
    <Image
      src={message.imageUrl}
      alt="送信画像"
      maxH="200px"
      borderRadius="12px"
      objectFit="cover"
    />
  ) : isCall ? (
    // 通話系は全ステータス共通で「アイコン(丸い濃色バッジ付き) + ラベル」の横並びにする
    <Flex align="center" gap={2}>
      <Flex
        w="26px"
        h="26px"
        borderRadius="full"
        align="center"
        justify="center"
        // ブランドやテーマの色に関わらず、地の色よりわずかに濃い丸を作れるよう半透明の黒を重ねる
        bg="blackAlpha.200"
        flexShrink={0}
      >
        <IoCall size={14} />
      </Flex>
      <Text fontSize="sm" whiteSpace="nowrap">
        {callStatus === 'completed'
          ? (message.callDuration ?? '0:00')
          : CALL_STATUS_LABELS[callStatus]}
      </Text>
    </Flex>
  ) : (
    message.text
  );

  const bubbleBox = (
    <Box
      as="button"
      type="button"
      position="relative"
      maxW="100%"
      bg={isImage ? 'transparent' : bubbleBg}
      color={bubbleColor}
      borderRadius={isImage ? '12px' : '16px'}
      px={isImage ? 0 : 3}
      // 通話の丸アイコンは行の高さが詰まって見えやすいため、縦方向に少し余裕を持たせる
      py={isImage ? 0 : isCall ? 3 : 2}
      fontSize="sm"
      textAlign="left"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      // 選択中はリングを重ねる（outlineはブラウザのフォーカス枠と競合するため使わない）
      boxShadow={
        selectionMode && isSelected
          ? '0 0 0 3px var(--chakra-colors-teal-400)'
          : 'sm'
      }
      cursor="pointer"
      transition="filter 0.15s, box-shadow 0.15s"
      _hover={{ filter: 'brightness(0.96)' }}
      // クリック後にブラウザのフォーカス枠が残ると見た目もPNG出力も汚れるため、
      // キーボード操作（focus-visible）のときだけ表示する
      _focus={{ outline: 'none' }}
      _focusVisible={{ boxShadow: 'outline' }}
      onClick={selectionMode ? onToggleSelect : undefined}
      _before={
        showIcon && !isImage
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
      {bubbleBody}
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
              overflow="hidden"
            >
              {avatarImage ? (
                <Image
                  src={avatarImage}
                  alt={member?.name ?? 'アイコン'}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                avatarIcon
              )}
            </Flex>
          )}
        </Box>
      )}

      {isMe && meta}

      {/* グループ時: 名前ラベル + 吹き出しを縦に積む */}
      {/* 吹き出し幅の上限はこの列で一元管理する（名前ラベルと揃えるため） */}
      <Flex direction="column" align={isMe ? 'flex-end' : 'flex-start'} maxW="70%">
        {showName && !isMe && member && (
          <Text
            fontSize="10px"
            color={theme.metaColor}
            mb="2px"
            lineHeight="1.2"
          >
            {member.name}
          </Text>
        )}
        {selectionMode ? (
          bubbleBox
        ) : (
          <Popover isLazy placement={isMe ? 'left' : 'right'}>
            <PopoverTrigger>{bubbleBox}</PopoverTrigger>
            <PopoverContent w="240px">
              <PopoverArrow />
              <PopoverBody>
                <VStack spacing={3} align="stretch">
                  {!isImage && !isCall && (
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
                  )}

                  {isCall && (
                    <Flex gap={2}>
                      <FormControl>
                        <FormLabel fontSize="xs" mb={1}>
                          通話の結果
                        </FormLabel>
                        <Select
                          size="sm"
                          value={callStatus}
                          onChange={(e) =>
                            onUpdate({
                              callStatus: e.target.value as CallStatus,
                            })
                          }
                        >
                          <option value="completed">通話時間</option>
                          <option value="missed">不在着信</option>
                          <option value="canceled">キャンセル</option>
                          <option value="noAnswer">応答なし</option>
                        </Select>
                      </FormControl>
                      {callStatus === 'completed' && (
                        <FormControl>
                          <FormLabel fontSize="xs" mb={1}>
                            通話時間
                          </FormLabel>
                          <Input
                            size="sm"
                            value={message.callDuration ?? ''}
                            placeholder="0:22"
                            onChange={(e) =>
                              onUpdate({ callDuration: e.target.value })
                            }
                          />
                        </FormControl>
                      )}
                    </Flex>
                  )}

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
                          onChange={(e) =>
                            onUpdate({ read: e.target.checked })
                          }
                          colorScheme="teal"
                        />
                      </FormControl>
                    )}
                  </Flex>

                  {/* グループ時は送信メンバーを変更できる */}
                  {!isMe && settings.members.length >= 2 && (
                    <FormControl>
                      <FormLabel fontSize="xs" mb={1}>
                        送信メンバー
                      </FormLabel>
                      <Select
                        size="sm"
                        value={member?.id ?? settings.members[0].id}
                        onChange={(e) =>
                          onUpdate({ memberId: e.target.value })
                        }
                      >
                        {settings.members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}

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
        )}
      </Flex>

      {!isMe && meta}
    </Flex>
  );
};

export const MessageBubble = memo(MessageBubbleBase);
