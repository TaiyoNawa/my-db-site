// pages/gallery/tool/es-counter/index.tsx
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlinePlus,
  AiOutlineSetting,
} from 'react-icons/ai';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { ConfirmDialog } from '@/features/gallery/tool/es-counter/components/ConfirmDialog';
import { CountSettingsForm } from '@/features/gallery/tool/es-counter/components/CountSettingsForm';
import { EsCounterPanel } from '@/features/gallery/tool/es-counter/components/EsCounterPanel';
import { SmoothCollapse } from '@/features/gallery/tool/es-counter/components/SmoothCollapse';
import { useEsCounterStore } from '@/features/gallery/tool/es-counter/hooks/useEsCounterStore';
import { DEFAULT_SETTINGS } from '@/features/gallery/tool/es-counter/utils/presets';

export default function EsCounterPage() {
  const { isHeaderHidden } = useStickyHeader();
  const {
    panels,
    initialized,
    canAddPanel,
    allPreviewVisible,
    addPanel,
    removePanel,
    updatePanelText,
    updatePanelTitle,
    updatePanelSettings,
    togglePreview,
    toggleAllPreviews,
    applySettingsToAll,
    movePanel,
    clearAll,
    resetAll,
  } = useEsCounterStore();

  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard.writeText(text);
  }, []);

  const handleApplyGlobalSettings = () => {
    applySettingsToAll(globalSettings);
    // 設定画面は閉じない（引き続き調整できるように）
  };

  return (
    <>
      <GalleryMeta
        title="ES文字数カウンター | Haruhate"
        description="エントリーシートに特化した文字数カウントツールです。"
        ogUrl="/gallery/tool/es-counter"
        category="便利ツール"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box pb={{ base: '44px', md: '64px', lg: '80px' }}>
          {initialized && (
            <>
              {/* パネル一覧 */}
              <SimpleGrid
                columns={{ base: 1, lg: panels.length >= 2 ? 2 : 1 }}
                spacing={4}
              >
                {panels.map((panel, index) => (
                  <EsCounterPanel
                    key={panel.id}
                    panel={panel}
                    canMoveLeft={index > 0}
                    canMoveRight={index < panels.length - 1}
                    canDelete={panels.length > 1}
                    onTextChange={(text) => updatePanelText(panel.id, text)}
                    onTitleChange={(title) => updatePanelTitle(panel.id, title)}
                    onSettingsChange={(settings) =>
                      updatePanelSettings(panel.id, settings)
                    }
                    onTogglePreview={() => togglePreview(panel.id)}
                    onMoveLeft={() => movePanel(panel.id, 'left')}
                    onMoveRight={() => movePanel(panel.id, 'right')}
                    onDelete={() => removePanel(panel.id)}
                    onCopy={() => handleCopy(panel.text)}
                  />
                ))}
              </SimpleGrid>

              {/* パネル追加ボタン（パネル直後・横線の上） */}
              {canAddPanel && (
                <Flex justify="center" mt={4}>
                  <Button
                    size="sm"
                    leftIcon={<AiOutlinePlus />}
                    onClick={addPanel}
                    colorScheme="pink"
                    variant="outline"
                    w={{ base: '100%', md: 'auto' }}
                  >
                    パネルを追加
                  </Button>
                </Flex>
              )}

              <Divider mt={4} />

              {/* ===== 共通操作バー ===== */}
              <Flex
                mt={4}
                gap={2}
                align="center"
                direction={{ base: 'column', md: 'row' }}
                justify={{ base: 'center', md: 'space-between' }}
              >
                {/* 左グループ: まとめて設定 / まとめてプレビュー */}
                <Flex
                  gap={2}
                  direction={{ base: 'column', md: 'row' }}
                  w={{ base: '100%', md: 'auto' }}
                  align="center"
                >
                  <Button
                    size="sm"
                    leftIcon={<AiOutlineSetting />}
                    onClick={() => setIsGlobalSettingsOpen((v) => !v)}
                    colorScheme="teal"
                    w={{ base: '100%', md: 'auto' }}
                  >
                    まとめて設定
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={
                      allPreviewVisible ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
                    onClick={() => toggleAllPreviews(!allPreviewVisible)}
                    colorScheme="pink"
                    variant="solid"
                    w={{ base: '100%', md: 'auto' }}
                  >
                    まとめてプレビュー
                  </Button>
                </Flex>

                {/* 右グループ: 全消去 */}
                <Flex
                  gap={2}
                  direction={{ base: 'column', md: 'row' }}
                  w={{ base: '100%', md: 'auto' }}
                  align="center"
                >
                  <Button
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    onClick={() => setIsClearConfirmOpen(true)}
                    colorScheme="red"
                    variant="ghost"
                    w={{ base: '100%', md: 'auto' }}
                  >
                    全て消去
                  </Button>
                </Flex>
              </Flex>

              {/* まとめて設定パネル（上方向に展開） */}
              <SmoothCollapse isOpen={isGlobalSettingsOpen}>
                <Box
                  mt={4}
                  pt={4}
                  px={4}
                  pb={0}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="white"
                  boxShadow="sm"
                >
                  <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
                    まとめて設定（全パネルに適用）
                  </Text>
                  <CountSettingsForm
                    settings={globalSettings}
                    onChange={setGlobalSettings}
                  />
                  <Flex my={3} gap={2} justify="flex-end">
                    <Button
                      size="sm"
                      colorScheme="gray"
                      onClick={() => setIsGlobalSettingsOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={handleApplyGlobalSettings}
                    >
                      全パネルに適用
                    </Button>
                  </Flex>
                </Box>
              </SmoothCollapse>
            </>
          )}
        </Box>
      </SectionWrapper>

      {/* 全消去確認ダイアログ */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="全リセット / 全削除"
        body="全てのパネルをリセットまたは削除しますか？入力済みのテキストは失われます。"
        confirmLabel="全て消去する"
        onConfirm={clearAll}
        onReset={resetAll}
        onClose={() => setIsClearConfirmOpen(false)}
      />
    </>
  );
}
