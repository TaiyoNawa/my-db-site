// src/features/gallery/tool/es-counter/components/TextVisualizer.stories.tsx
import { StoryFn } from '@storybook/react';
import React from 'react';

import { DEFAULT_SETTINGS } from '../utils/presets';
import { TextVisualizer } from './TextVisualizer';

const Default = {
  title: 'features/gallery/tool/es-counter/TextVisualizer',
  component: TextVisualizer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ES文章をN文字ごとに色分けプレビュー表示するコンポーネント。最大文字数超過部分は赤背景で表示。',
      },
    },
  },
  args: {
    settings: DEFAULT_SETTINGS,
  },
};

export default Default;

export const Empty: StoryFn<typeof TextVisualizer> = (args) => (
  <TextVisualizer {...args} />
);
Empty.args = {
  text: '',
  settings: DEFAULT_SETTINGS,
};
Empty.storyName = '空テキスト（プレースホルダー表示）';

export const Normal: StoryFn<typeof TextVisualizer> = (args) => (
  <TextVisualizer {...args} />
);
Normal.args = {
  text: '私はチームワークを大切にしています。学生時代に所属していたサークルでは副代表を務め、メンバー間の意見調整や企画立案を担当しました。この経験から、異なる意見を持つ人々をまとめ、共通の目標に向かって進む力を養いました。貴社においても、この経験を活かしてチームに貢献したいと思います。',
  settings: DEFAULT_SETTINGS,
};
Normal.storyName = '通常テキスト（100文字ごと色分け）';

export const WithMaxLength: StoryFn<typeof TextVisualizer> = (args) => (
  <TextVisualizer {...args} />
);
WithMaxLength.args = {
  text: '私はチームワークを大切にしています。この文章が最大文字数を超えた部分から赤背景で表示されます。超過した部分は赤いハイライトで示され、文字数オーバーを一目で確認できます。',
  settings: { ...DEFAULT_SETTINGS, maxLength: 50 },
};
WithMaxLength.storyName = '最大文字数超過（赤背景）';

export const WithNewline: StoryFn<typeof TextVisualizer> = (args) => (
  <TextVisualizer {...args} />
);
WithNewline.args = {
  text: '1行目のテキストです。\n2行目のテキストです。\n3行目のテキストです。',
  settings: { ...DEFAULT_SETTINGS, newlineMode: '1' },
};
WithNewline.storyName = '改行あり（改行1文字）';
