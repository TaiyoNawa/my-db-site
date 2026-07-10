// src/features/gallery/tool/talk-maker/components/TalkSettingsForm.tsx
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, FC, ReactNode, useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { FontId, TalkMember, TalkSettings } from '../types';
import { CropShape, ImageCropModal } from './ImageCropModal';
import { readFileAsDataUrl } from '../utils/image';
import {
  FONTS,
  PARTNER_ICON_OPTIONS,
  THEMES,
  getIconFontSize,
} from '../utils/presets';

type Props = {
  settings: TalkSettings;
  onChange: (patch: Partial<TalkSettings>) => void;
  onAddMember: () => void;
  onUpdateMember: (id: string, patch: Partial<Omit<TalkMember, 'id'>>) => void;
  onRemoveMember: (id: string) => void;
};

/** 画像を選択して dataURL を返す小さなアップロードボタン */
const ImagePickButton: FC<{
  children: ReactNode;
  onPick: (dataUrl: string) => void;
  size?: string;
}> = ({ children, onPick, size = 'xs' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      onPick(await readFileAsDataUrl(file));
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
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleChange(e)}
      />
      <Button
        size={size}
        leftIcon={<AiOutlineUpload />}
        variant="outline"
        colorScheme="teal"
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
    </>
  );
};

export const TalkSettingsForm: FC<Props> = ({
  settings,
  onChange,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}) => {
  // クロップモーダル: 対象画像・形状・適用先をセットで持つ
  const [cropState, setCropState] = useState<{
    src: string;
    shape: CropShape;
    apply: (dataUrl: string) => void;
  } | null>(null);

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      overflow="hidden"
    >
      <Accordion allowMultiple defaultIndex={[0]}>
        {/* ===== 基本設定 ===== */}
        <AccordionItem border="none">
          <AccordionButton>
            <Text flex={1} textAlign="left" fontSize="sm" fontWeight="bold">
              基本設定
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <FormControl mb={3}>
              <FormLabel fontSize="xs" mb={1}>
                トーク名（1対1なら相手の名前）
              </FormLabel>
              <Input
                size="sm"
                value={settings.partnerName}
                onChange={(e) => onChange({ partnerName: e.target.value })}
                maxLength={20}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel fontSize="xs" mb={1}>
                フォント
              </FormLabel>
              <Select
                size="sm"
                value={settings.fontId}
                onChange={(e) =>
                  onChange({ fontId: e.target.value as FontId })
                }
              >
                {FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Flex gap={6}>
              <FormControl display="flex" alignItems="center" w="auto">
                <FormLabel fontSize="xs" mb={0} mr={2}>
                  時刻を表示
                </FormLabel>
                <Switch
                  size="sm"
                  colorScheme="teal"
                  isChecked={settings.showTime}
                  onChange={(e) => onChange({ showTime: e.target.checked })}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center" w="auto">
                <FormLabel fontSize="xs" mb={0} mr={2}>
                  既読を表示
                </FormLabel>
                <Switch
                  size="sm"
                  colorScheme="teal"
                  isChecked={settings.showRead}
                  onChange={(e) => onChange({ showRead: e.target.checked })}
                />
              </FormControl>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        {/* ===== 背景 ===== */}
        <AccordionItem>
          <AccordionButton>
            <Text flex={1} textAlign="left" fontSize="sm" fontWeight="bold">
              背景
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <FormControl mb={3}>
              <FormLabel fontSize="xs" mb={1}>
                背景テーマ
              </FormLabel>
              <Flex gap={2}>
                {THEMES.map((theme) => (
                  <Flex
                    key={theme.id}
                    as="button"
                    type="button"
                    aria-label={`テーマ ${theme.label}`}
                    direction="column"
                    align="center"
                    gap={1}
                    onClick={() => onChange({ themeId: theme.id })}
                  >
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      bg={theme.bg}
                      border="3px solid"
                      borderColor={
                        settings.themeId === theme.id ? 'teal.400' : 'gray.200'
                      }
                    />
                    <Text fontSize="10px" color="gray.600">
                      {theme.label}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="xs" mb={1}>
                背景画像（テーマ色の上に表示）
              </FormLabel>
              {settings.backgroundImage ? (
                <Flex align="center" gap={2}>
                  <Image
                    src={settings.backgroundImage}
                    alt="背景画像"
                    w="60px"
                    h="36px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onChange({ backgroundImage: undefined })}
                  >
                    背景画像を解除
                  </Button>
                </Flex>
              ) : (
                <ImagePickButton
                  size="sm"
                  onPick={(src) =>
                    setCropState({
                      src,
                      shape: 'rect',
                      apply: (cropped) =>
                        onChange({ backgroundImage: cropped }),
                    })
                  }
                >
                  背景画像をアップロード
                </ImagePickButton>
              )}
            </FormControl>
          </AccordionPanel>
        </AccordionItem>

        {/* ===== メンバー ===== */}
        <AccordionItem>
          <AccordionButton>
            <Text flex={1} textAlign="left" fontSize="sm" fontWeight="bold">
              メンバー（2人以上でグループ表示）
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex direction="column" gap={2}>
              {settings.members.map((member) => (
                <Flex key={member.id} align="center" gap={2}>
                  <Popover placement="bottom-start" isLazy>
                    <PopoverTrigger>
                      <Flex
                        as="button"
                        type="button"
                        aria-label={`${member.name} のアイコンを変更`}
                        w="30px"
                        h="30px"
                        borderRadius="full"
                        bg="gray.100"
                        align="center"
                        justify="center"
                        fontSize={getIconFontSize(member.icon, 18)}
                        flexShrink={0}
                        overflow="hidden"
                        border="2px solid transparent"
                        _hover={{ borderColor: 'teal.400' }}
                      >
                        {member.iconImage ? (
                          <Image
                            src={member.iconImage}
                            alt={member.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        ) : (
                          member.icon
                        )}
                      </Flex>
                    </PopoverTrigger>
                    <PopoverContent w="220px">
                      <PopoverArrow />
                      <PopoverBody>
                        <SimpleGrid columns={6} spacing={1} mb={2}>
                          {PARTNER_ICON_OPTIONS.map((icon) => (
                            <Flex
                              key={icon}
                              as="button"
                              type="button"
                              aria-label={`アイコン ${icon}`}
                              align="center"
                              justify="center"
                              h="28px"
                              fontSize="18px"
                              borderRadius="md"
                              border="2px solid"
                              borderColor={
                                !member.iconImage && member.icon === icon
                                  ? 'teal.400'
                                  : 'transparent'
                              }
                              bg="gray.50"
                              _hover={{ bg: 'gray.100' }}
                              onClick={() =>
                                onUpdateMember(member.id, {
                                  icon,
                                  iconImage: undefined,
                                })
                              }
                            >
                              {icon}
                            </Flex>
                          ))}
                        </SimpleGrid>
                        <Flex gap={2} align="center">
                          <Input
                            size="sm"
                            value={member.icon}
                            onChange={(e) =>
                              onUpdateMember(member.id, {
                                icon: e.target.value,
                              })
                            }
                            maxLength={2}
                            w="52px"
                            textAlign="center"
                            aria-label={`${member.name} の絵文字アイコン`}
                          />
                          {member.iconImage ? (
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() =>
                                onUpdateMember(member.id, {
                                  iconImage: undefined,
                                })
                              }
                            >
                              画像解除
                            </Button>
                          ) : (
                            <ImagePickButton
                              size="xs"
                              onPick={(src) =>
                                setCropState({
                                  src,
                                  shape: 'circle',
                                  apply: (cropped) =>
                                    onUpdateMember(member.id, {
                                      iconImage: cropped,
                                    }),
                                })
                              }
                            >
                              画像を使う
                            </ImagePickButton>
                          )}
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Input
                    size="sm"
                    value={member.name}
                    onChange={(e) =>
                      onUpdateMember(member.id, { name: e.target.value })
                    }
                    maxLength={20}
                    flex={1}
                  />
                  <IconButton
                    aria-label={`${member.name} を削除`}
                    icon={<RiDeleteBin6Line />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    isDisabled={settings.members.length <= 1}
                    onClick={() => onRemoveMember(member.id)}
                  />
                </Flex>
              ))}
              <Button
                size="xs"
                leftIcon={<AiOutlinePlus />}
                variant="outline"
                colorScheme="teal"
                alignSelf="flex-start"
                onClick={onAddMember}
              >
                メンバーを追加
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* 画像切り抜きモーダル（アイコン=circle / 背景=rect） */}
      <ImageCropModal
        isOpen={cropState !== null}
        imageSrc={cropState?.src ?? null}
        shape={cropState?.shape ?? 'circle'}
        onClose={() => setCropState(null)}
        onCropped={(dataUrl) => cropState?.apply(dataUrl)}
      />
    </Box>
  );
};
