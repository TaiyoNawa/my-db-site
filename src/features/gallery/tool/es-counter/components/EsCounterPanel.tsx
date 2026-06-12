// src/features/gallery/tool/es-counter/components/EsCounterPanel.tsx
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineSetting,
} from 'react-icons/ai';
import {
  MdContentCopy,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { CountSettings, Panel } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { CountSettingsForm } from './CountSettingsForm';
import { SmoothCollapse } from './SmoothCollapse';
import { TextVisualizer } from './TextVisualizer';
import { countChars } from '../utils/countChars';

type Props = {
  panel: Panel;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  canDelete: boolean;
  onTextChange: (text: string) => void;
  onTitleChange: (title: string) => void;
  onSettingsChange: (settings: CountSettings) => void;
  onTogglePreview: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDelete: () => void;
  onCopy: () => void;
};

export const EsCounterPanel: FC<Props> = ({
  panel,
  canMoveLeft,
  canMoveRight,
  canDelete,
  onTextChange,
  onTitleChange,
  onSettingsChange,
  onTogglePreview,
  onMoveLeft,
  onMoveRight,
  onDelete,
  onCopy,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const count = countChars(panel.text, panel.settings);
  const isOver =
    panel.settings.maxLength !== null && count > panel.settings.maxLength;

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      w="100%"
      bg="white"
      boxShadow="sm"
      data-testid="es-counter-panel"
    >
      <VStack spacing={3} align="stretch">
        {/* タイトル入力 */}
        <Input
          placeholder="タイトルを入力（例: 自己PR）"
          value={panel.title}
          onChange={(e) => onTitleChange(e.target.value)}
          variant="flushed"
          fontWeight="bold"
          size="sm"
          data-testid="panel-title-input"
        />

        {/* 文字数表示 */}
        <Flex justify="flex-end">
          <Text
            fontSize="sm"
            color={isOver ? 'red.500' : 'gray.500'}
            fontWeight={isOver ? 'bold' : 'normal'}
            data-testid="char-count"
          >
            {count.toLocaleString()}文字
            {panel.settings.maxLength !== null &&
              ` / ${panel.settings.maxLength.toLocaleString()}文字`}
            {isOver && '（超過）'}
          </Text>
        </Flex>

        {/* テキストエリア */}
        <Textarea
          value={panel.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="ここにES文章を入力..."
          minH="200px"
          resize="vertical"
          fontSize="sm"
          lineHeight="1.8"
          data-testid="panel-textarea"
        />

        {/* プレビュー（読み取り専用感・薄い表示） */}
        <SmoothCollapse isOpen={panel.isPreviewVisible}>
          <TextVisualizer text={panel.text} settings={panel.settings} />
        </SmoothCollapse>

        {/* カウント設定 */}
        <SmoothCollapse isOpen={isSettingsOpen}>
          <CountSettingsForm
            settings={panel.settings}
            onChange={onSettingsChange}
          />
        </SmoothCollapse>

        {/* パネル下のボタン群 */}
        <Flex
          justify={{ base: 'center', md: 'space-between' }}
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={2}
          pt={1}
        >
          {/* 左側: 操作ボタン（sm以下は縦並び幅100%・中央揃え） */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={1}
            w={{ base: '100%', md: 'auto' }}
            align="center"
          >
            <Button
              size="sm"
              leftIcon={<AiOutlineSetting />}
              onClick={() => setIsSettingsOpen((v) => !v)}
              colorScheme="teal"
              w={{ base: '100%', md: 'auto' }}
            >
              設定
            </Button>
            <Button
              size="sm"
              leftIcon={
                panel.isPreviewVisible ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )
              }
              onClick={onTogglePreview}
              colorScheme="pink"
              variant="solid"
              w={{ base: '100%', md: 'auto' }}
            >
              プレビュー
            </Button>
            <Tooltip label="クリップボードにコピー">
              <Button
                size="sm"
                leftIcon={<MdContentCopy />}
                onClick={onCopy}
                colorScheme="blue"
                variant="solid"
                w={{ base: '100%', md: 'auto' }}
              >
                コピー
              </Button>
            </Tooltip>
          </Flex>

          {/* 右側: 移動・削除ボタン */}
          <ButtonGroup size="sm" spacing={1} justifyContent="center">
            <Tooltip label="前と入れ替え">
              <IconButton
                aria-label="前と入れ替え"
                icon={<MdKeyboardArrowLeft />}
                onClick={onMoveLeft}
                isDisabled={!canMoveLeft}
                variant="ghost"
                colorScheme="gray"
              />
            </Tooltip>
            <Tooltip label="次と入れ替え">
              <IconButton
                aria-label="次と入れ替え"
                icon={<MdKeyboardArrowRight />}
                onClick={onMoveRight}
                isDisabled={!canMoveRight}
                variant="ghost"
                colorScheme="gray"
              />
            </Tooltip>
            <Tooltip label="リセット / 削除">
              <IconButton
                aria-label="リセット / 削除"
                icon={<RiDeleteBin6Line />}
                onClick={() => setIsDeleteConfirmOpen(true)}
                isDisabled={!canDelete}
                variant="ghost"
                colorScheme="red"
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
      </VStack>

      {/* パネル削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="リセット / 削除"
        body={`このパネルをリセットまたは削除しますか？入力済みのテキストは失われます。`}
        confirmLabel="削除する"
        onConfirm={onDelete}
        onReset={() => {
          onTitleChange('');
          onTextChange('');
        }}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />
    </Box>
  );
};
