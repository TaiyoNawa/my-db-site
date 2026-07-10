// src/features/gallery/tool/talk-maker/components/MessageBubble.stories.tsx
import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import React from 'react';

import { MessageBubble } from './MessageBubble';
import { TalkMessage } from '../types';
import { DEFAULT_SETTINGS, getTheme } from '../utils/presets';

const baseMessage: TalkMessage = {
  id: 'story-msg-1',
  sender: 'me',
  text: 'こんにちは！今日ひま？',
  time: '12:34',
  read: true,
};

const Default = {
  title: 'features/gallery/tool/talk-maker/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'トーク画面メーカーの吹き出しコンポーネント。タップで編集ポップオーバーが開き、本文・時刻・送信者の変更と削除ができる。',
      },
    },
  },
  args: {
    theme: getTheme('blue'),
    settings: DEFAULT_SETTINGS,
    showIcon: true,
    onUpdate: action('onUpdate'),
    onDelete: action('onDelete'),
  },
};

export default Default;

export const Me: StoryFn<typeof MessageBubble> = (args) => (
  <MessageBubble {...args} />
);
Me.args = {
  message: baseMessage,
};

export const Other: StoryFn<typeof MessageBubble> = (args) => (
  <MessageBubble {...args} />
);
Other.args = {
  message: { ...baseMessage, sender: 'other' },
};

export const LongText: StoryFn<typeof MessageBubble> = (args) => (
  <MessageBubble {...args} />
);
LongText.args = {
  message: {
    ...baseMessage,
    text: '長文のメッセージも折り返して表示されます。改行も\nそのまま反映されます。',
  },
};
