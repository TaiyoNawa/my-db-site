import { StoryFn } from '@storybook/react';

import { BackButton } from './BackButton';

const Default = {
  title: 'components/button/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '前のページに戻る、もしくは指定したパスに遷移するボタンコンポーネント',
      },
    },
    nextjs: {
      appDirectory: true,
      router: {
        pathname: '/gallery/tool/poll/[pollUid]',
        asPath: '/gallery/tool/poll/some-poll-id',
        query: { pollUid: 'some-poll-id' },
      },
    },
  },
};

export default Default;

export const Default_: StoryFn<typeof BackButton> = () => <BackButton />;

export const WithCustomText: StoryFn<typeof BackButton> = () => (
  <BackButton>カスタムテキスト</BackButton>
);

export const WithHref: StoryFn<typeof BackButton> = () => (
  <BackButton href="/gallery/tool/poll">アンケート一覧に戻る</BackButton>
);
