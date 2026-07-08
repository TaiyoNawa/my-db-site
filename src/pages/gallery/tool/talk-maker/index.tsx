// pages/gallery/tool/talk-maker/index.tsx
import { DeleteIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { MessageComposer } from '@/features/gallery/tool/talk-maker/components/MessageComposer';
import { TalkPreview } from '@/features/gallery/tool/talk-maker/components/TalkPreview';
import { TalkSettingsForm } from '@/features/gallery/tool/talk-maker/components/TalkSettingsForm';
import { useTalkMakerStore } from '@/features/gallery/tool/talk-maker/hooks/useTalkMakerStore';
import { exportTalkImage } from '@/features/gallery/tool/talk-maker/utils/exportImage';

export default function TalkMakerPage() {
  const { isHeaderHidden } = useStickyHeader();
  const {
    messages,
    settings,
    initialized,
    addMessage,
    updateMessage,
    removeMessage,
    clearAll,
    updateSettings,
  } = useTalkMakerStore();

  const previewRef = useRef<HTMLDivElement>(null);
  const clearCancelRef = useRef<HTMLButtonElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await exportTalkImage(previewRef.current);
      toast({
        title: '画像を保存しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: '画像の保存に失敗しました',
        description: '時間をおいて再度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <GalleryMeta
        title="トーク画面メーカー | Haruhate"
        description="チャット風のトーク画面を自由に作成して、PNG画像として保存できる無料ツールです。"
        ogUrl="/gallery/tool/talk-maker"
        category="便利ツール"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box pb={{ base: '44px', md: '64px', lg: '80px' }}>
          {initialized && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* 左: プレビュー + 入力バー */}
              <Box>
                <TalkPreview
                  ref={previewRef}
                  messages={messages}
                  settings={settings}
                  onUpdateMessage={updateMessage}
                  onRemoveMessage={removeMessage}
                />
                <MessageComposer onSend={addMessage} />
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textAlign="center"
                  mt={2}
                >
                  吹き出しをタップすると編集・削除ができます
                </Text>
              </Box>

              {/* 右: 設定 + 操作ボタン */}
              <Box>
                <TalkSettingsForm settings={settings} onChange={updateSettings} />
                <Flex
                  mt={4}
                  gap={2}
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                >
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineDownload />}
                    colorScheme="pink"
                    onClick={() => void handleExport()}
                    isDisabled={messages.length === 0}
                    isLoading={isExporting}
                    loadingText="保存中"
                    w={{ base: '100%', md: 'auto' }}
                  >
                    画像を保存
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => setIsClearConfirmOpen(true)}
                    isDisabled={messages.length === 0}
                    w={{ base: '100%', md: 'auto' }}
                  >
                    全て消去
                  </Button>
                </Flex>
              </Box>
            </SimpleGrid>
          )}
        </Box>
      </SectionWrapper>

      {/* 全消去確認ダイアログ */}
      <AlertDialog
        isOpen={isClearConfirmOpen}
        leastDestructiveRef={clearCancelRef}
        onClose={() => setIsClearConfirmOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="md">全て消去</AlertDialogHeader>
            <AlertDialogBody fontSize="sm">
              全てのメッセージを削除しますか？この操作は元に戻せません。
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={clearCancelRef}
                size="sm"
                onClick={() => setIsClearConfirmOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                ml={2}
                onClick={() => {
                  clearAll();
                  setIsClearConfirmOpen(false);
                }}
              >
                消去する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
