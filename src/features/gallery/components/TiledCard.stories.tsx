import { Heading } from '@chakra-ui/react';

import TiltedCard from './TiltedCard';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof TiltedCard> = {
  title: 'components/TiltedCard',
  component: TiltedCard,
  tags: ['autodocs'],
  args: {
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58',
    altText: 'Kendrick Lamar - GNX Album Cover',
    captionText: 'Kendrick Lamar - GNX',
    containerHeight: '300px',
    containerWidth: '300px',
    imageHeight: '300px',
    imageWidth: '300px',
    rotateAmplitude: 12,
    scaleOnHover: 1.2,
    showMobileWarning: false,
    showTooltip: true,
    displayOverlayContent: true,
    overlayContent: (
      <Heading fontSize="sm" paddingTop={30} paddingLeft={30}>
        Kendrick Lamar - GNX
      </Heading>
    ),
  },
  argTypes: {
    imageSrc: { control: 'text', description: '表示する画像のURL' },
    altText: { control: 'text', description: '画像の代替テキスト' },
    captionText: {
      control: 'text',
      description: '画像にホバーしたときのキャプション',
    },
    containerHeight: { control: 'text', description: 'コンテナの高さ' },
    containerWidth: { control: 'text', description: 'コンテナの幅' },
    imageHeight: { control: 'text', description: '画像の高さ' },
    imageWidth: { control: 'text', description: '画像の幅' },
    scaleOnHover: { control: 'number', description: 'ホバー時の拡大率' },
    rotateAmplitude: {
      control: 'number',
      description: '回転の振れ幅（左右/上下）',
    },
    showMobileWarning: {
      control: 'boolean',
      description: 'モバイル警告の表示',
    },
    showTooltip: { control: 'boolean', description: 'キャプションの表示' },
    displayOverlayContent: {
      control: 'boolean',
      description: 'オーバーレイ表示の有無',
    },
    overlayContent: {
      control: false,
      description: 'オーバーレイ内の任意のReactノード',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ホバー時に傾きと拡大がつくインタラクティブなカード。オーバーレイとキャプションが表示可能。',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof TiltedCard> = (args) => (
  <TiltedCard {...args} />
);
