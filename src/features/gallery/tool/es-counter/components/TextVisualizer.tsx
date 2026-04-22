// src/features/gallery/tool/es-counter/components/TextVisualizer.tsx
import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, Fragment } from 'react';

import { CountSettings } from '../types';
import { countChars, splitIntoSegments } from '../utils/countChars';

type Props = {
  text: string;
  settings: CountSettings;
};


export const TextVisualizer: FC<Props> = ({ text, settings }) => {
  const totalCount = countChars(text, settings);
  const { maxLength, counterUnit } = settings;
  const isOver = maxLength !== null && totalCount > maxLength;

  if (!text) {
    return (
      <Box
        p={3}
        bg="gray.50"
        borderRadius="md"
        fontSize="sm"
        color="gray.300"
        data-testid="text-visualizer-empty"
      >
        テキストを入力するとここにプレビューが表示されます
      </Box>
    );
  }

  const segments = splitIntoSegments(text, settings);

  return (
    <Box
      position="relative"
      pt={7}
      px={3}
      pb={0}
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.200"
      borderRadius="md"
      fontSize="sm"
      lineHeight="1.8"
      wordBreak="break-all"
      opacity={0.75}
      data-testid="text-visualizer"
    >
      {/* 右上に総文字数表示 */}
      <Flex position="absolute" top={1.5} right={2} align="center" gap={1}>
        <Text
          fontSize="xs"
          color={isOver ? 'red.400' : 'gray.400'}
          fontWeight={isOver ? 'bold' : 'normal'}
          userSelect="none"
        >
          {totalCount.toLocaleString()}文字
          {maxLength !== null && ` / ${maxLength.toLocaleString()}文字`}
        </Text>
        <Text fontSize="xs" color="gray.300" userSelect="none">
          プレビュー
        </Text>
      </Flex>

      {/* 色分けテキスト本体 */}
      {segments.map((seg, i) => {
        const isSegOver = maxLength !== null && seg.endCount > maxLength;
        const bg = isSegOver ? 'red.100' : 'transparent';
        // counterUnit が設定されている場合のみ、セグメント末尾に累積文字数ラベルを表示
        const showLabel = counterUnit !== null && i < segments.length - 1;

        return (
          <Box as="span" key={`${seg.endCount}-${i}`} bg={bg} display="inline">
            {seg.text.split('\n').map((line, j, arr) => (
              <Fragment key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </Fragment>
            ))}
            {showLabel && (
              <Box
                as="sup"
                fontSize="9px"
                color={isSegOver ? 'red.400' : 'gray.400'}
                verticalAlign="super"
                userSelect="none"
                mx="1px"
              >
                {seg.endCount}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
