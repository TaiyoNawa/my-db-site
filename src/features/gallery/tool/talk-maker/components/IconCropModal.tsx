// src/features/gallery/tool/talk-maker/components/IconCropModal.tsx
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { FC, PointerEvent, useEffect, useRef, useState } from 'react';

import { ICON_SIZE, loadImage } from '../utils/image';

/** クロップ枠の表示サイズ（CSS px） */
const VIEWPORT = 240;

type Props = {
  isOpen: boolean;
  /** 切り抜き対象の元画像（dataURL） */
  imageSrc: string | null;
  onClose: () => void;
  /** 切り抜き結果（正方形PNGのdataURL）を返す */
  onCropped: (dataUrl: string) => void;
};

/**
 * ドラッグ + ズームでアイコンを正方形に切り抜くモーダル。
 * 外部ライブラリを使わず、cover基準のスケール計算と canvas で実装する。
 */
export const IconCropModal: FC<Props> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropped,
}) => {
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // 画像が変わったら寸法を取得して位置をリセット
  useEffect(() => {
    if (!imageSrc) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    void loadImage(imageSrc).then((img) =>
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    );
  }, [imageSrc]);

  if (!imageSrc) return null;

  // cover基準: zoom=1 で短辺がクロップ枠にぴったり合う
  const coverScale = naturalSize
    ? VIEWPORT / Math.min(naturalSize.w, naturalSize.h)
    : 1;
  const dispW = naturalSize ? naturalSize.w * coverScale * zoom : VIEWPORT;
  const dispH = naturalSize ? naturalSize.h * coverScale * zoom : VIEWPORT;

  const clampOffset = (x: number, y: number) => {
    const maxX = Math.max(0, (dispW - VIEWPORT) / 2);
    const maxY = Math.max(0, (dispH - VIEWPORT) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset(
      clampOffset(dragStart.current.offsetX + dx, dragStart.current.offsetY + dy)
    );
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const handleCrop = async () => {
    if (!naturalSize) return;
    const img = await loadImage(imageSrc);

    // 表示座標 → 元画像座標への変換（クロップ枠の左上を求める）
    const pxPerCss = 1 / (coverScale * zoom);
    const viewLeft = dispW / 2 - VIEWPORT / 2 - offset.x;
    const viewTop = dispH / 2 - VIEWPORT / 2 - offset.y;
    const srcX = viewLeft * pxPerCss;
    const srcY = viewTop * pxPerCss;
    const srcSize = VIEWPORT * pxPerCss;

    const canvas = document.createElement('canvas');
    canvas.width = ICON_SIZE;
    canvas.height = ICON_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      img,
      srcX,
      srcY,
      srcSize,
      srcSize,
      0,
      0,
      ICON_SIZE,
      ICON_SIZE
    );
    onCropped(canvas.toDataURL('image/png'));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4} maxW="340px">
        <ModalHeader fontSize="md">アイコンの切り抜き</ModalHeader>
        <ModalBody>
          <Flex direction="column" align="center" gap={3}>
            <Box
              position="relative"
              w={`${VIEWPORT}px`}
              h={`${VIEWPORT}px`}
              borderRadius="full"
              overflow="hidden"
              bg="gray.100"
              cursor="grab"
              sx={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* ドラッグ対象のプレビュー画像。next/imageはtransform操作に不向きなため使わない */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="切り抜きプレビュー"
                draggable={false}
                style={{
                  position: 'absolute',
                  width: `${dispW}px`,
                  height: `${dispH}px`,
                  maxWidth: 'none',
                  left: `${VIEWPORT / 2 - dispW / 2 + offset.x}px`,
                  top: `${VIEWPORT / 2 - dispH / 2 + offset.y}px`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </Box>
            <Text fontSize="xs" color="gray.500">
              ドラッグで位置調整・スライダーで拡大縮小
            </Text>
            <Slider
              aria-label="拡大縮小"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(v) => {
                setZoom(v);
                setOffset((prev) => clampOffset(prev.x, prev.y));
              }}
              colorScheme="teal"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
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
            onClick={() => void handleCrop()}
            isDisabled={!naturalSize}
          >
            切り抜く
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
