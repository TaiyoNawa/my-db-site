// src/features/gallery/tool/talk-maker/components/TalkPreview.stories.tsx
import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import React from 'react';

import { TalkPreview } from './TalkPreview';
import { TalkMessage } from '../types';
import { DEFAULT_SETTINGS } from '../utils/presets';

const sampleMessages: TalkMessage[] = [
  {
    id: 'story-1',
    sender: 'other',
    text: 'こんにちは！',
    time: '12:30',
    read: true,
  },
  {
    id: 'story-2',
    sender: 'other',
    text: '今日ひま？',
    time: '12:30',
    read: true,
  },
  {
    id: 'story-3',
    sender: 'me',
    text: 'ひまだよ〜\nどこか行く？',
    time: '12:34',
    read: true,
  },
  {
    id: 'story-4',
    sender: 'other',
    text: '映画観に行こう！',
    time: '12:35',
    read: true,
  },
];

const Default = {
  title: 'features/gallery/tool/talk-maker/TalkPreview',
  component: TalkPreview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'トーク画面メーカーのプレビュー本体。この DOM がそのまま PNG エクスポートの対象になる。連続する同一送信者のアイコンは省略される。',
      },
    },
  },
  args: {
    settings: DEFAULT_SETTINGS,
    onUpdateMessage: action('onUpdateMessage'),
    onRemoveMessage: action('onRemoveMessage'),
  },
};

export default Default;

export const Conversation: StoryFn<typeof TalkPreview> = (args) => (
  <TalkPreview {...args} />
);
Conversation.args = {
  messages: sampleMessages,
};

export const Empty: StoryFn<typeof TalkPreview> = (args) => (
  <TalkPreview {...args} />
);
Empty.args = {
  messages: [],
};

export const DarkTheme: StoryFn<typeof TalkPreview> = (args) => (
  <TalkPreview {...args} />
);
DarkTheme.args = {
  messages: sampleMessages,
  settings: { ...DEFAULT_SETTINGS, themeId: 'dark' },
};

export const NoMeta: StoryFn<typeof TalkPreview> = (args) => (
  <TalkPreview {...args} />
);
NoMeta.args = {
  messages: sampleMessages,
  settings: { ...DEFAULT_SETTINGS, showTime: false, showRead: false },
};
