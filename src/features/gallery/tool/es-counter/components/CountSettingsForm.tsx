// src/features/gallery/tool/es-counter/components/CountSettingsForm.tsx
import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';

import { CountSettings } from '../types';

type Props = {
  settings: CountSettings;
  onChange: (settings: CountSettings) => void;
};

export const CountSettingsForm: FC<Props> = ({ settings, onChange }) => {
  return (
    <VStack
      align="start"
      spacing={3}
      pt={3}
      px={3}
      pb={0}
      bg="gray.50"
      borderRadius="md"
      w="100%"
    >
      <HStack spacing={4} w="100%" align="start">
        <FormControl flex={1}>
          <FormLabel fontSize="xs" color="gray.600" mb={1}>
            改行の扱い
          </FormLabel>
          <Select
            size="sm"
            value={settings.newlineMode}
            onChange={(e) =>
              onChange({
                ...settings,
                newlineMode: e.target.value as '0' | '1' | '2',
              })
            }
          >
            <option value="0">0文字</option>
            <option value="1">1文字</option>
            <option value="2">2文字</option>
          </Select>
        </FormControl>

        <FormControl flex={1}>
          <FormLabel fontSize="xs" color="gray.600" mb={1}>
            最大文字数
          </FormLabel>
          <Input
            size="sm"
            type="number"
            placeholder="制限なし"
            value={settings.maxLength ?? ''}
            min={1}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...settings,
                maxLength: val === '' ? null : parseInt(val, 10),
              });
            }}
          />
        </FormControl>
      </HStack>

      <HStack spacing={4} w="100%" align="start">
        <FormControl flex={1}>
          <FormLabel fontSize="xs" color="gray.600" mb={1}>
            カウント単位（N文字ごとにラベル表示）
          </FormLabel>
          <Input
            size="sm"
            type="number"
            placeholder="表示しない"
            value={settings.counterUnit !== null ? String(settings.counterUnit) : ''}
            min={1}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...settings,
                counterUnit: val === '' ? null : parseInt(val, 10),
              });
            }}
          />
        </FormControl>
        <FormControl flex={1} />
      </HStack>

      <FormControl>
        <Checkbox
          size="sm"
          isChecked={settings.countSpaces}
          onChange={(e) =>
            onChange({ ...settings, countSpaces: e.target.checked })
          }
        >
          スペース（半角・全角）をカウントする
        </Checkbox>
      </FormControl>
    </VStack>
  );
};
