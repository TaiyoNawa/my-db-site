import { StoryFn } from '@storybook/react';
import React from 'react';

import { PollCard } from './PollCard';

const PollCardDefault = {
  title: 'gallery/PollCard',
  component: PollCard,
  args: {
    eyeCatch: '/sample/image1.png',
    title: 'あなたの好きな色は何ですか？',
    description:
      '色の好みに関するアンケートです。性別や年齢による傾向の違いについても調査しています。回答は匿名で行われ、統計的な分析にのみ使用されます。',
    url: '/gallery/poll/sample-poll',
    numberOfQuestions: 5,
    deadline: '2200-08-20T15:00:00Z',
    isVotingOpen: true,
  },
  argTypes: {
    eyeCatch: {
      description: 'アンケートのアイキャッチ画像のパス',
    },
    title: {
      description: 'アンケートのタイトル',
    },
    description: {
      description: 'アンケートの説明',
    },
    url: {
      description: 'アンケートのURL',
    },
    numberOfQuestions: {
      description: 'アンケートの質問数',
      control: { type: 'number', min: 1, max: 20 },
    },
    deadline: {
      description: 'アンケートの締切日時（ISO形式）',
      control: 'text',
    },
    isVotingOpen: {
      description: '投票受付中かどうか',
      control: 'boolean',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'アンケートカードコンポーネント',
      },
    },
  },
};

export default PollCardDefault;

export const Default: StoryFn<typeof PollCard> = (args) => (
  <PollCard {...args} />
);

export const VotingClosed: StoryFn<typeof PollCard> = (args) => (
  <PollCard {...args} title="投票終了したアンケート" isVotingOpen={false} />
);

export const NoDeadline: StoryFn<typeof PollCard> = (args) => (
  <PollCard {...args} title="締切なしのアンケート" deadline={null} />
);

export const LongTitle: StoryFn<typeof PollCard> = (args) => (
  <PollCard
    {...args}
    title="とても長いタイトルのアンケートです。このタイトルは40文字を超えているので省略されて表示されるはずです。"
  />
);

export const LongDescription: StoryFn<typeof PollCard> = (args) => (
  <PollCard
    {...args}
    description="とても長い説明文のアンケートです。この説明文は40文字を超えているので省略されて表示されるはずです。詳細な説明が必要な場合は、アンケートページで確認してください。"
  />
);
