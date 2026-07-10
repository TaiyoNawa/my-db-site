// src/features/gallery/tool/talk-maker/components/JsonImportModal.tsx
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';

import { TalkMember } from '../types';
import { ParsedTalkJson, SAMPLE_TALK_JSON, parseTalkJson } from '../utils/talkJson';

type ImportMode = 'replace' | 'append';

type Props = {
  isOpen: boolean;
  members: TalkMember[];
  onClose: () => void;
  onImport: (parsed: ParsedTalkJson, mode: ImportMode) => void;
};

export const JsonImportModal: FC<Props> = ({
  isOpen,
  members,
  onClose,
  onImport,
}) => {
  const [raw, setRaw] = useState('');
  const [mode, setMode] = useState<ImportMode>('append');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // readAsText の結果は必ず string（ArrayBuffer になるのは readAsArrayBuffer のみ）
      setRaw(typeof reader.result === 'string' ? reader.result : '');
      setError(null);
    };
    reader.onerror = () => setError('ファイルの読み込みに失敗しました');
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      const parsed = parseTalkJson(raw, members);
      onImport(parsed, mode);
      setRaw('');
      setError(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'インポートに失敗しました');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader fontSize="md">JSONからトークをインポート</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xs" color="gray.600" mb={2}>
            sender には me / 自分 / other / 相手 のほか、メンバー名を直接書けます
            （未登録の名前は自動でメンバー追加）。time と read は省略可能です。
          </Text>
          <Textarea
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setError(null);
            }}
            placeholder={SAMPLE_TALK_JSON}
            rows={10}
            fontSize="xs"
            fontFamily="mono"
          />
          {error && (
            <Text fontSize="xs" color="red.500" mt={2}>
              {error}
            </Text>
          )}
          <Flex mt={3} justify="space-between" align="center" wrap="wrap" gap={2}>
            <RadioGroup
              value={mode}
              onChange={(v) => setMode(v as ImportMode)}
              size="sm"
            >
              <Flex gap={4}>
                <Radio value="append" colorScheme="teal">
                  今のトークに追記
                </Radio>
                <Radio value="replace" colorScheme="teal">
                  全て置き換え
                </Radio>
              </Flex>
            </RadioGroup>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleFileSelect}
            />
            <Button
              size="xs"
              leftIcon={<AiOutlineUpload />}
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              JSONファイルを選択
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            ml={2}
            onClick={handleImport}
            isDisabled={!raw.trim()}
          >
            インポート
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
