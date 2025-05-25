import { Box, Text } from '@chakra-ui/react';
import { StoryFn } from '@storybook/react';
import React from 'react';

import { SectionWrapper } from './SectionWrapper';

const Default = {
  title: 'components/SectionWrapper',
  component: SectionWrapper,
  args: {
    backgroundColor: 'gray.80',
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'セクションのレイアウトを提供するコンポーネント',
      },
    },
  },
};

export default Default;

export const Template: StoryFn<typeof SectionWrapper> = (args) => (
  <SectionWrapper {...args}>
    <Box p={4} backgroundColor="white" borderRadius="md" shadow="md">
      <Text fontSize="lg" fontWeight="bold">
        セクションのコンテンツ
      </Text>
      <Text mt={2}>これは SectionWrapper のデフォルトのストーリーです。</Text>
    </Box>
  </SectionWrapper>
);
