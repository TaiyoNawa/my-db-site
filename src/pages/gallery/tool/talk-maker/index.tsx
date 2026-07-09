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
import { useEffect, useRef, useState } from 'react';
import {
  AiOutlineCheckSquare,
  AiOutlineDownload,
  AiOutlineExport,
  AiOutlineImport,
} from 'react-icons/ai';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { JsonImportModal } from '@/features/gallery/tool/talk-maker/components/JsonImportModal';
import { MessageComposer } from '@/features/gallery/tool/talk-maker/components/MessageComposer';
import { SelectionToolbar } from '@/features/gallery/tool/talk-maker/components/SelectionToolbar';
import { TalkPreview } from '@/features/gallery/tool/talk-maker/components/TalkPreview';
import { TalkSettingsForm } from '@/features/gallery/tool/talk-maker/components/TalkSettingsForm';
import { useTalkMakerStore } from '@/features/gallery/tool/talk-maker/hooks/useTalkMakerStore';
import { TalkMessage } from '@/features/gallery/tool/talk-maker/types';
import { exportTalkImage } from '@/features/gallery/tool/talk-maker/utils/exportImage';
import { serializeTalk } from '@/features/gallery/tool/talk-maker/utils/talkJson';

export default function TalkMakerPage() {
  const { isHeaderHidden } = useStickyHeader();
  const {
    messages,
    settings,
    initialized,
    addMessage,
    addImageMessage,
    updateMessage,
    updateMessages,
    removeMessage,
    removeMessages,
    importMessages,
    clearAll,
    updateSettings,
    addMember,
    updateMember,
    removeMember,
  } = useTalkMakerStore();

  const previewRef = useRef<HTMLDivElement>(null);
  const partialPreviewRef = useRef<HTMLDivElement>(null);
  const clearCancelRef = useRef<HTMLButtonElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    new Set()
  );
  // 部分エクスポート: 選択メッセージのみのプレビューを画面外に一時描画してキャプチャする
  const [partialMessages, setPartialMessages] = useState<TalkMessage[] | null>(
    null
  );
  const toast = useToast();

  const exportErrorToast = () =>
    toast({
      title: '画像の保存に失敗しました',
      description: '時間をおいて再度お試しください。',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

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
      exportErrorToast();
    } finally {
      setIsExporting(false);
    }
  };

  // 部分エクスポート: 画面外プレビューの描画完了を待ってからキャプチャする
  useEffect(() => {
    if (!partialMessages) return;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          if (partialPreviewRef.current) {
            await exportTalkImage(partialPreviewRef.current);
            toast({
              title: '選択部分の画像を保存しました',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch {
          exportErrorToast();
        } finally {
          setPartialMessages(null);
          setIsExporting(false);
        }
      })();
    }, 100);
    return () => clearTimeout(timer);
    // exportErrorToast/toast は毎レンダー新しい参照になるため依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partialMessages]);

  const handleExportSelected = () => {
    const selected = messages.filter((m) => selectedIds.has(m.id));
    if (selected.length === 0) return;
    setIsExporting(true);
    setPartialMessages(selected);
  };

  const handleJsonExport = () => {
    const json = serializeTalk(messages, settings.members);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'talk-maker.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const selectedIdArray = [...selectedIds];

  return (
    <>
      <GalleryMeta
        title="トーク画面メーカー | Haruhate"
        description="チャット風のトーク画面を自由に作成して、PNG画像として保存できる無料ツールです。グループチャット・画像送信・JSONインポートにも対応。"
        ogUrl="/gallery/tool/talk-maker"
        category="便利ツール"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box pb={{ base: '44px', md: '64px', lg: '80px' }}>
          {initialized && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* 左: プレビュー + 入力バー / 選択ツールバー */}
              <Box>
                <TalkPreview
                  ref={previewRef}
                  messages={messages}
                  settings={settings}
                  selectionMode={selectionMode}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onUpdateMessage={updateMessage}
                  onRemoveMessage={removeMessage}
                />
                {selectionMode ? (
                  <SelectionToolbar
                    selectedCount={selectedIds.size}
                    totalCount={messages.length}
                    onSelectAll={() =>
                      setSelectedIds(new Set(messages.map((m) => m.id)))
                    }
                    onClearSelection={() => setSelectedIds(new Set())}
                    onChangeSender={(sender) => {
                      updateMessages(selectedIdArray, { sender });
                    }}
                    onChangeTime={(time) => {
                      updateMessages(selectedIdArray, { time });
                    }}
                    onDelete={() => {
                      removeMessages(selectedIdArray);
                      setSelectedIds(new Set());
                    }}
                    onExportSelected={handleExportSelected}
                    onExit={exitSelectionMode}
                  />
                ) : (
                  <>
                    <MessageComposer
                      members={settings.members}
                      onSend={addMessage}
                      onSendImage={addImageMessage}
                    />
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      textAlign="center"
                      mt={2}
                    >
                      吹き出しをタップすると編集・削除ができます
                    </Text>
                  </>
                )}
              </Box>

              {/* 右: 設定 + 操作ボタン */}
              <Box>
                <TalkSettingsForm
                  settings={settings}
                  onChange={updateSettings}
                  onAddMember={addMember}
                  onUpdateMember={updateMember}
                  onRemoveMember={removeMember}
                />

                <Flex mt={4} gap={2} wrap="wrap">
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineDownload />}
                    colorScheme="pink"
                    onClick={() => void handleExport()}
                    isDisabled={messages.length === 0 || selectionMode}
                    isLoading={isExporting}
                    loadingText="保存中"
                    flex={{ base: '1 1 100%', md: '0 0 auto' }}
                  >
                    画像を保存
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineCheckSquare />}
                    colorScheme="teal"
                    variant={selectionMode ? 'solid' : 'outline'}
                    onClick={() =>
                      selectionMode
                        ? exitSelectionMode()
                        : setSelectionMode(true)
                    }
                    isDisabled={messages.length === 0}
                    flex={{ base: '1 1 45%', md: '0 0 auto' }}
                  >
                    {selectionMode ? '選択を終了' : '選択モード'}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineImport />}
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => setIsJsonModalOpen(true)}
                    flex={{ base: '1 1 45%', md: '0 0 auto' }}
                  >
                    JSONインポート
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineExport />}
                    colorScheme="teal"
                    variant="ghost"
                    onClick={handleJsonExport}
                    isDisabled={messages.length === 0}
                    flex={{ base: '1 1 45%', md: '0 0 auto' }}
                  >
                    JSONエクスポート
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => setIsClearConfirmOpen(true)}
                    isDisabled={messages.length === 0}
                    flex={{ base: '1 1 45%', md: '0 0 auto' }}
                  >
                    全て消去
                  </Button>
                </Flex>
              </Box>
            </SimpleGrid>
          )}
        </Box>
      </SectionWrapper>

      {/* 部分エクスポート用の画面外プレビュー */}
      {partialMessages && (
        <Box position="fixed" top={0} left="-9999px" w="380px">
          <TalkPreview
            ref={partialPreviewRef}
            messages={partialMessages}
            settings={settings}
            onUpdateMessage={() => undefined}
            onRemoveMessage={() => undefined}
          />
        </Box>
      )}

      {/* JSONインポートモーダル */}
      <JsonImportModal
        isOpen={isJsonModalOpen}
        members={settings.members}
        onClose={() => setIsJsonModalOpen(false)}
        onImport={(parsed, mode) => {
          importMessages(parsed.messages, parsed.members, mode);
          toast({
            title: `${parsed.messages.length}件のメッセージをインポートしました`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }}
      />

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
