// src/features/gallery/tool/es-counter/components/EsCounterPanel.stories.tsx
import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import React from 'react';

import { EsCounterPanel } from './EsCounterPanel';
import { DEFAULT_SETTINGS } from '../utils/presets';

const defaultPanel = {
  id: 'story-panel-1',
  title: '',
  text: '',
  settings: DEFAULT_SETTINGS,
  isPreviewVisible: false,
};

const Default = {
  title: 'features/gallery/tool/es-counter/EsCounterPanel',
  component: EsCounterPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ES文字数カウンターの単一パネルコンポーネント。テキスト入力・文字数表示・設定・プレビュー・並び替え・削除を提供。',
      },
    },
  },
  args: {
    canMoveLeft: false,
    canMoveRight: false,
    canDelete: false,
    onTextChange: action('onTextChange'),
    onTitleChange: action('onTitleChange'),
    onSettingsChange: action('onSettingsChange'),
    onTogglePreview: action('onTogglePreview'),
    onMoveLeft: action('onMoveLeft'),
    onMoveRight: action('onMoveRight'),
    onDelete: action('onDelete'),
    onCopy: action('onCopy'),
  },
};

export default Default;

export const Empty: StoryFn<typeof EsCounterPanel> = (args) => (
  <EsCounterPanel {...args} />
);
Empty.args = {
  panel: defaultPanel,
};
Empty.storyName = '空のパネル';

export const WithText: StoryFn<typeof EsCounterPanel> = (args) => (
  <EsCounterPanel {...args} />
);
WithText.args = {
  panel: {
    ...defaultPanel,
    title: '自己PR（マイナビ）',
    text: '私はチームワークを大切にしています。学生時代に所属していたサークルでは副代表を務め、メンバー間の意見調整や企画立案を担当しました。この経験から、異なる意見を持つ人々をまとめ、共通の目標に向かって進む力を養いました。',
  },
};
WithText.storyName = 'テキストあり';

export const WithPreview: StoryFn<typeof EsCounterPanel> = (args) => (
  <EsCounterPanel {...args} />
);
WithPreview.args = {
  panel: {
    ...defaultPanel,
    title: '志望動機',
    text: '私はチームワークを大切にしています。学生時代に所属していたサークルでは副代表を務め、メンバー間の意見調整や企画立案を担当しました。この経験から、異なる意見を持つ人々をまとめ、共通の目標に向かって進む力を養いました。',
    isPreviewVisible: true,
  },
};
WithPreview.storyName = 'プレビューON';

export const OverLimit: StoryFn<typeof EsCounterPanel> = (args) => (
  <EsCounterPanel {...args} />
);
OverLimit.args = {
  panel: {
    ...defaultPanel,
    title: '自己PR（200文字制限）',
    text: '私はチームワークを大切にしています。学生時代に所属していたサークルでは副代表を務め、メンバー間の意見調整や企画立案を担当しました。この経験から、異なる意見を持つ人々をまとめ、共通の目標に向かって進む力を養いました。貴社においても、この経験を活かしてチームに貢献したいと思います。',
    settings: { ...DEFAULT_SETTINGS, maxLength: 200 },
    isPreviewVisible: true,
  },
};
OverLimit.storyName = '文字数超過';

export const Movable: StoryFn<typeof EsCounterPanel> = (args) => (
  <EsCounterPanel {...args} />
);
Movable.args = {
  panel: { ...defaultPanel, title: '中間パネル' },
  canMoveLeft: true,
  canMoveRight: true,
  canDelete: true,
};
Movable.storyName = '移動・削除ボタン有効';
