// src/features/gallery/tool/talk-maker/components/MessageComposer.tsx
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from 'react';
import { IoImageOutline, IoSend } from 'react-icons/io5';

import { Sender, TalkMember } from '../types';
import {
  MESSAGE_IMAGE_MAX_SIZE,
  downscaleImage,
  readFileAsDataUrl,
} from '../utils/image';

type Props = {
  members: TalkMember[];
  onSend: (sender: Sender, text: string, memberId?: string) => void;
  onSendImage: (sender: Sender, imageUrl: string, memberId?: string) => void;
};

export const MessageComposer: FC<Props> = ({
  members,
  onSend,
  onSendImage,
}) => {
  const [sender, setSender] = useState<Sender>('me');
  const [memberId, setMemberId] = useState<string | undefined>(undefined);
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const isGroup = members.length >= 2;
  // メンバー削除などで無効なIDになった場合は先頭メンバーへフォールバック
  const activeMemberId =
    memberId && members.some((m) => m.id === memberId)
      ? memberId
      : members[0]?.id;

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(sender, text, activeMemberId);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // IME変換確定のEnterで誤送信しないようにする
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 同じファイルを続けて選べるようにリセット
    if (!file) return;
    try {
      const raw = await readFileAsDataUrl(file);
      const resized = await downscaleImage(raw, MESSAGE_IMAGE_MAX_SIZE);
      onSendImage(sender, resized, activeMemberId);
    } catch {
      toast({
        title: '画像の読み込みに失敗しました',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      w="100%"
      maxW="380px"
      mx="auto"
      mt={2}
      p={2}
      gap={2}
      align="flex-end"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="sm"
      wrap="wrap"
    >
      <ButtonGroup size="sm" isAttached flexShrink={0}>
        <Button
          colorScheme="teal"
          variant={sender === 'other' ? 'solid' : 'outline'}
          onClick={() => setSender('other')}
        >
          相手
        </Button>
        <Button
          colorScheme="teal"
          variant={sender === 'me' ? 'solid' : 'outline'}
          onClick={() => setSender('me')}
        >
          自分
        </Button>
      </ButtonGroup>

      {/* グループかつ相手として送るときだけメンバーを選ぶ */}
      {isGroup && sender === 'other' && (
        <Select
          size="sm"
          w="110px"
          flexShrink={0}
          value={activeMemberId}
          onChange={(e) => setMemberId(e.target.value)}
          aria-label="送信メンバー"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      )}

      <Textarea
        size="sm"
        // Shift+Enter の改行入力が見切れないよう、行数に高さを追従させる（最大4行）
        rows={Math.min(text.split('\n').length, 4)}
        resize="none"
        placeholder="メッセージを入力（Enterで追加）"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        borderRadius="lg"
        flex={1}
        minW="120px"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleImageSelect(e)}
      />
      <IconButton
        aria-label="画像を送信"
        icon={<IoImageOutline />}
        size="sm"
        variant="ghost"
        colorScheme="teal"
        onClick={() => fileInputRef.current?.click()}
        flexShrink={0}
      />
      <IconButton
        aria-label="メッセージを追加"
        icon={<IoSend />}
        size="sm"
        colorScheme="teal"
        isDisabled={!text.trim()}
        onClick={handleSend}
        flexShrink={0}
      />
    </Flex>
  );
};
