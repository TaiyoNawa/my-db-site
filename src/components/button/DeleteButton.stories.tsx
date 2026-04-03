import { HStack, Text } from '@chakra-ui/react';
import { StoryFn } from '@storybook/react';

import { DeleteButton } from './DeleteButton';

const Default = {
  title: 'components/button/DeleteButton',
  component: DeleteButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '削除操作に使う赤いゴーストボタン。質問・選択肢の削除などに使用。',
      },
    },
  },
};

export default Default;

export const Default_: StoryFn<typeof DeleteButton> = () => (
  <DeleteButton aria-label="削除" />
);

export const WithSize: StoryFn<typeof DeleteButton> = () => (
  <HStack spacing={4}>
    <Text fontSize="sm" color="gray.500">sm:</Text>
    <DeleteButton aria-label="小さい削除ボタン" size="sm" />
    <Text fontSize="sm" color="gray.500">md (default):</Text>
    <DeleteButton aria-label="通常削除ボタン" />
    <Text fontSize="sm" color="gray.500">lg:</Text>
    <DeleteButton aria-label="大きい削除ボタン" size="lg" />
  </HStack>
);
