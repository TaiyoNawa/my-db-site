import { StoryFn } from '@storybook/react';

import { BackButton } from './BackButton';

const Default = {
  title: 'components/button/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '前のページに戻る、もしくは指定したパスに遷移するボタンコンポーネント',
      },
    },
    nextjs: {
      appDirectory: true,
      router: {
        pathname: '/gallery/poll/[pollUid]',
        asPath: '/gallery/poll/some-poll-id',
        query: {
          pollUid: 'some-poll-id',
        },
      },
    },
  },
};

export default Default;

export const DefaultButton: StoryFn<typeof BackButton> = () => <BackButton />;

export const WithCustomText: StoryFn<typeof BackButton> = () => (
  <BackButton>カスタムテキスト</BackButton>
);

export const WithHref: StoryFn<typeof BackButton> = () => (
  <BackButton href="/gallery/poll">一覧に戻る</BackButton>
);
