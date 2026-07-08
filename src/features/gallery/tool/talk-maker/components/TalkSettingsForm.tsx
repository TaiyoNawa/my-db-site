// src/features/gallery/tool/talk-maker/components/TalkSettingsForm.tsx
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Switch,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';

import { TalkSettings } from '../types';
import { PARTNER_ICON_OPTIONS, THEMES } from '../utils/presets';

type Props = {
  settings: TalkSettings;
  onChange: (patch: Partial<TalkSettings>) => void;
};

export const TalkSettingsForm: FC<Props> = ({ settings, onChange }) => {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
        トーク画面の設定
      </Text>

      <FormControl mb={3}>
        <FormLabel fontSize="xs" mb={1}>
          相手の名前
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
          相手のアイコン
        </FormLabel>
        <SimpleGrid columns={6} spacing={1} mb={2}>
          {PARTNER_ICON_OPTIONS.map((icon) => (
            <Flex
              key={icon}
              as="button"
              type="button"
              aria-label={`アイコン ${icon}`}
              align="center"
              justify="center"
              h="32px"
              fontSize="20px"
              borderRadius="md"
              border="2px solid"
              borderColor={
                settings.partnerIcon === icon ? 'teal.400' : 'transparent'
              }
              bg="gray.50"
              _hover={{ bg: 'gray.100' }}
              onClick={() => onChange({ partnerIcon: icon })}
            >
              {icon}
            </Flex>
          ))}
        </SimpleGrid>
        <Input
          size="sm"
          value={settings.partnerIcon}
          onChange={(e) => onChange({ partnerIcon: e.target.value })}
          maxLength={2}
          w="80px"
          textAlign="center"
        />
      </FormControl>

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
    </Box>
  );
};
