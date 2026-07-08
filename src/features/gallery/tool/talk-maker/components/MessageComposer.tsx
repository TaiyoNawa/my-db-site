// src/features/gallery/tool/talk-maker/components/MessageComposer.tsx
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { FC, KeyboardEvent, useState } from 'react';
import { IoSend } from 'react-icons/io5';

import { Sender } from '../types';

type Props = {
  onSend: (sender: Sender, text: string) => void;
};

export const MessageComposer: FC<Props> = ({ onSend }) => {
  const [sender, setSender] = useState<Sender>('me');
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(sender, text);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // IME変換確定のEnterで誤送信しないようにする
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
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
