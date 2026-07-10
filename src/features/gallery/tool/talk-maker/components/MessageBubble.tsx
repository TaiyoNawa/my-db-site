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
import {
  CALL_STATUS_LABELS,
  DEFAULT_CALL_COMPLETED_TEXT,
  getIconFontSize,
} from '../utils/presets';
import { normalizeTime } from '../utils/time';

type Props = {
  message: TalkMessage;
  theme: BackgroundTheme;
  settings: TalkSettings;
  /** 送信メンバー（sender==='other' のとき。呼び出し側で必ず解決して渡すこと） */
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

  const avatarIcon = member?.icon ?? '';
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
    <Flex align="center" gap="10px">
      <Flex
        w="28px"
        h="28px"
        borderRadius="full"
        align="center"
        justify="center"
        // ブランドやテーマの色に関わらず、地の色よりわずかに濃い丸を作れるよう半透明の黒を重ねる
        bg="blackAlpha.200"
        flexShrink={0}
      >
        <IoCall size={15} />
      </Flex>
      {callStatus === 'completed' ? (
        // 通話成立時は「通話メッセージ + その下に小さく通話時間」の2段構成
        <VStack align="flex-start" spacing="1px">
          <Text fontSize="12px" whiteSpace="pre-wrap">
            {message.text || DEFAULT_CALL_COMPLETED_TEXT}
          </Text>
          <Text fontSize="xs" opacity={0.65}>
            {message.callDuration ?? '0:00'}
          </Text>
        </VStack>
      ) : (
        <Text fontSize="12px" whiteSpace="nowrap">
          {CALL_STATUS_LABELS[callStatus]}
        </Text>
      )}
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
      // 通話バブルは丸アイコン分、詰まって見えやすいため上下左右に少し余裕を持たせる
      px={isImage ? 0 : isCall ? 4 : 3}
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
      // 吹き出しの尻尾（下記_beforeで6px突き出す）がアバターの円に重なって
      // 視覚的に欠けて見えないよう、余白を尻尾の突き出し幅以上に確保する
      gap="8px"
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
              fontSize={getIconFontSize(avatarIcon, 20)}
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
      <Flex
        direction="column"
        align={isMe ? 'flex-end' : 'flex-start'}
        maxW="70%"
        // 親(横並びFlex)の flex item として、デフォルトの min-width:auto の
        // ままだと長い区切りのないテキスト（スペースなしの日本語連文等）で
        // maxW が無視されて吹き出しが伸び、時刻が右に押し出されて改行される。
        // minW={0} で明示的に縮小を許可し、wordBreak による折り返しを効かせる。
        minW={0}
      >
        {showName && !isMe && member && (
          <Text
            fontSize="10px"
            color={theme.metaColor}
            mb="2px"
            lineHeight="1.2"
            // 列（Flex direction="column"）は align が flex-start/flex-end のため
            // 子要素は横方向にstretchされず、幅を明示しないと内容に合わせて
            // 際限なく伸びてしまう。maxW="100%" で列の幅を継承させたうえで
            // 折り返す（吹き出し本文の maxW="100%" と同じ対応）
            maxW="100%"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
          >
            {member.name}
          </Text>
        )}
        {/*
          時刻(meta)は列全体ではなく、この行の中で吹き出し自身と並べて配置する。
          列は名前ラベルの幅にも合わせて伸びるため、列の外に時刻を置くと
          （名前ラベルが長い時に）吹き出しではなく列の右端に時刻が寄ってしまう。
          alignSelf="stretch" + minW={0} で列の幅いっぱいまで使えるようにしつつ、
          中身は吹き出しの実際の幅に合わせて詰める。
        */}
        <Flex
          align="flex-end"
          gap="4px"
          alignSelf="stretch"
          minW={0}
          justify={isMe ? 'flex-end' : 'flex-start'}
        >
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

                    {isCall && callStatus === 'completed' && (
                      <FormControl>
                        <FormLabel fontSize="xs" mb={1}>
                          通話メッセージ
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
                            onChange={(e) => {
                              const next = e.target.value as CallStatus;
                              onUpdate({
                                callStatus: next,
                                // completedへ切り替えた際、文言が空だとバブルが寂しいのでデフォルト文を補う
                                ...(next === 'completed' && !message.text
                                  ? { text: DEFAULT_CALL_COMPLETED_TEXT }
                                  : {}),
                              });
                            }}
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
          {!isMe && meta}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const MessageBubble = memo(MessageBubbleBase);
