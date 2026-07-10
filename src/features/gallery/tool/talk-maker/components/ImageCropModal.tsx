// src/features/gallery/tool/talk-maker/components/ImageCropModal.tsx
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

export type CropShape = 'circle' | 'rect';

/** 切り抜き枠（表示px）と出力サイズを形状ごとに固定する */
const CROP_CONFIG: Record<
  CropShape,
  {
    viewportW: number;
    viewportH: number;
    outputW: number;
    outputH: number;
    mimeType: 'image/png' | 'image/jpeg';
    title: string;
  }
> = {
  circle: {
    viewportW: 240,
    viewportH: 240,
    outputW: ICON_SIZE,
    outputH: ICON_SIZE,
    mimeType: 'image/png',
    title: 'アイコンの切り抜き',
  },
  rect: {
    // 380px幅のトーク画面に近いポートレート比率。bgSize:coverで最終表示されるため厳密な一致は不要
    viewportW: 220,
    viewportH: 300,
    outputW: 640,
    outputH: 880,
    mimeType: 'image/jpeg',
    title: '背景画像の切り抜き',
  },
};

type Props = {
  isOpen: boolean;
  /** 切り抜き対象の元画像（dataURL） */
  imageSrc: string | null;
  shape: CropShape;
  onClose: () => void;
  /** 切り抜き結果のdataURLを返す */
  onCropped: (dataUrl: string) => void;
};

/**
 * ドラッグ + ズームで画像を切り抜くモーダル。
 * 外部ライブラリを使わず、cover基準のスケール計算と canvas で実装する。
 * アイコン（正円）と背景（縦長矩形）の両方に対応する。
 */
export const ImageCropModal: FC<Props> = ({
  isOpen,
  imageSrc,
  shape,
  onClose,
  onCropped,
}) => {
  const { viewportW, viewportH, outputW, outputH, mimeType, title } =
    CROP_CONFIG[shape];

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

  // cover基準: zoom=1 で画像が枠いっぱいに収まる（短辺基準ではなく縦横それぞれで判定）
  const coverScale = naturalSize
    ? Math.max(viewportW / naturalSize.w, viewportH / naturalSize.h)
    : 1;
  const dispW = naturalSize ? naturalSize.w * coverScale * zoom : viewportW;
  const dispH = naturalSize ? naturalSize.h * coverScale * zoom : viewportH;

  const clampOffset = (x: number, y: number) => {
    const maxX = Math.max(0, (dispW - viewportW) / 2);
    const maxY = Math.max(0, (dispH - viewportH) / 2);
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
      clampOffset(
        dragStart.current.offsetX + dx,
        dragStart.current.offsetY + dy
      )
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
    const viewLeft = dispW / 2 - viewportW / 2 - offset.x;
    const viewTop = dispH / 2 - viewportH / 2 - offset.y;
    const srcX = viewLeft * pxPerCss;
    const srcY = viewTop * pxPerCss;
    const srcWidth = viewportW * pxPerCss;
    const srcHeight = viewportH * pxPerCss;

    const canvas = document.createElement('canvas');
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      img,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      0,
      0,
      outputW,
      outputH
    );
    onCropped(canvas.toDataURL(mimeType, 0.85));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4} maxW="340px">
        <ModalHeader fontSize="md">{title}</ModalHeader>
        <ModalBody>
          <Flex direction="column" align="center" gap={3}>
            <Box
              position="relative"
              w={`${viewportW}px`}
              h={`${viewportH}px`}
              borderRadius={shape === 'circle' ? 'full' : 'md'}
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
                  left: `${viewportW / 2 - dispW / 2 + offset.x}px`,
                  top: `${viewportH / 2 - dispH / 2 + offset.y}px`,
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
