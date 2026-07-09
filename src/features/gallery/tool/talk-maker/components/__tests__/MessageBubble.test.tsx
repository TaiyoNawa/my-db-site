// src/features/gallery/tool/talk-maker/components/__tests__/MessageBubble.test.tsx
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { TalkMessage } from '../../types';
import { DEFAULT_SETTINGS, getTheme } from '../../utils/presets';
import { MessageBubble } from '../MessageBubble';

const baseMessage: TalkMessage = {
  id: 'msg-1',
  sender: 'me',
  text: 'こんにちは',
  time: '12:34',
  read: true,
};

const defaultProps = {
  message: baseMessage,
  theme: getTheme('blue'),
  settings: DEFAULT_SETTINGS,
  showIcon: true,
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
};

describe('MessageBubble', () => {
  it('メッセージ本文が表示される', () => {
    render(<MessageBubble {...defaultProps} />);
    expect(screen.getByText('こんにちは')).toBeInTheDocument();
  });

  it('自分のメッセージには既読と時刻が表示される', () => {
    render(<MessageBubble {...defaultProps} />);
    expect(screen.getByText('既読')).toBeInTheDocument();
    expect(screen.getByText('12:34')).toBeInTheDocument();
  });

  it('相手のメッセージには既読が表示されない', () => {
    render(
      <MessageBubble
        {...defaultProps}
        message={{ ...baseMessage, sender: 'other' }}
      />
    );
    expect(screen.queryByText('既読')).not.toBeInTheDocument();
    expect(screen.getByText('12:34')).toBeInTheDocument();
  });

  it('showTime が false のとき時刻が表示されない', () => {
    render(
      <MessageBubble
        {...defaultProps}
        settings={{ ...DEFAULT_SETTINGS, showTime: false }}
      />
    );
    expect(screen.queryByText('12:34')).not.toBeInTheDocument();
  });

  it('showRead が false のとき既読が表示されない', () => {
    render(
      <MessageBubble
        {...defaultProps}
        settings={{ ...DEFAULT_SETTINGS, showRead: false }}
      />
    );
    expect(screen.queryByText('既読')).not.toBeInTheDocument();
  });

  it('相手のメッセージにはアイコンが表示される', () => {
    render(
      <MessageBubble
        {...defaultProps}
        message={{ ...baseMessage, sender: 'other' }}
      />
    );
    expect(
      screen.getByText(DEFAULT_SETTINGS.partnerIcon)
    ).toBeInTheDocument();
  });

  it('showIcon が false のときアイコンを省略する', () => {
    render(
      <MessageBubble
        {...defaultProps}
        message={{ ...baseMessage, sender: 'other' }}
        showIcon={false}
      />
    );
    expect(
      screen.queryByText(DEFAULT_SETTINGS.partnerIcon)
    ).not.toBeInTheDocument();
  });

  it('吹き出しをクリックすると編集ポップオーバーが開き、削除できる', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<MessageBubble {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByText('こんにちは'));
    await user.click(screen.getByText('このメッセージを削除'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('不正な時刻を入力してblurすると元の時刻に戻り、onUpdateは呼ばれない', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<MessageBubble {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByText('こんにちは'));
    const timeInput = screen.getByPlaceholderText('12:34');
    await user.clear(timeInput);
    await user.type(timeInput, '99:99');
    await user.tab();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(timeInput).toHaveValue('12:34');
  });

  it('省略形の時刻を入力してblurすると正規化されて反映される', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<MessageBubble {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByText('こんにちは'));
    const timeInput = screen.getByPlaceholderText('12:34');
    await user.clear(timeInput);
    await user.type(timeInput, '9:5');
    await user.tab();

    expect(onUpdate).toHaveBeenCalledWith({ time: '09:05' });
  });

  it('相手のメッセージの編集ポップオーバーには既読スイッチが表示されない', async () => {
    const user = userEvent.setup();
    render(
      <MessageBubble
        {...defaultProps}
        message={{ ...baseMessage, sender: 'other' }}
      />
    );

    await user.click(screen.getByText('こんにちは'));

    expect(screen.getByText('時刻')).toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: '既読' })
    ).not.toBeInTheDocument();
  });

  it('通話成立時は電話アイコンと通話時間を表示する', () => {
    render(
      <MessageBubble
        {...defaultProps}
        message={{
          ...baseMessage,
          text: '',
          kind: 'call',
          callStatus: 'completed',
          callDuration: '1:23',
        }}
      />
    );
    expect(screen.getByText('1:23')).toBeInTheDocument();
  });

  it.each([
    ['missed', '不在着信'],
    ['canceled', 'キャンセル'],
    ['noAnswer', '応答なし'],
  ] as const)('通話ステータス %s は「%s」と表示される', (status, label) => {
    render(
      <MessageBubble
        {...defaultProps}
        message={{
          ...baseMessage,
          text: '',
          kind: 'call',
          callStatus: status,
        }}
      />
    );
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('編集ポップオーバーから送信者を切り替えられる', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<MessageBubble {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByText('こんにちは'));
    await user.click(screen.getByRole('button', { name: '相手' }));

    expect(onUpdate).toHaveBeenCalledWith({ sender: 'other' });
  });
});
