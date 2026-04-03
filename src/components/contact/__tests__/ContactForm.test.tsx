// ContactForm.test.tsx
import { fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { ContactForm } from '../ContactForm';

const mockPush = vi.fn();

vi.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

/** フォーム要素を取得して submit イベントを発火するヘルパー */
const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (!form) throw new Error('form 要素が見つかりません');
  fireEvent.submit(form);
};

describe('ContactForm コンポーネント', () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.restoreAllMocks();
  });

  // ── レンダリング ────────────────────────────────────────
  it('各フィールドのラベルが表示される', () => {
    render(<ContactForm />);
    // 必須フィールドのラベルには Chakra UI が aria-hidden の「*」スパンを付加するため
    // exact: false で部分一致させる
    expect(screen.getByText('お名前(匿名可)', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('メールアドレス(任意)')).toBeInTheDocument();
    expect(screen.getByText('種別', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('内容', { exact: false })).toBeInTheDocument();
  });

  it('送信ボタンが表示される', () => {
    render(<ContactForm />);
    expect(
      screen.getByRole('button', { name: '送信する' })
    ).toBeInTheDocument();
  });

  it('種別セレクトボックスにカテゴリが表示される', () => {
    render(<ContactForm />);
    expect(screen.getByRole('option', { name: 'お問い合わせ' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '要望' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '報告' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'その他' })).toBeInTheDocument();
  });

  // ── バリデーション ─────────────────────────────────────
  it('名前未入力で送信するとバリデーションエラーが表示される', async () => {
    const { container } = render(<ContactForm />);
    fireEvent.change(
      screen.getByPlaceholderText('お問い合わせ内容をご記入ください。（1000文字以内）'),
      { target: { value: 'テスト内容' } }
    );
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText('お名前を入力してください。')).toBeInTheDocument();
    });
  });

  it('内容未入力で送信するとバリデーションエラーが表示される', async () => {
    const { container } = render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText('山田 太郎'), {
      target: { value: 'テスト太郎' },
    });
    submitForm(container);
    await waitFor(() => {
      expect(
        screen.getByText('お問い合わせ内容を入力してください。')
      ).toBeInTheDocument();
    });
  });

  it('不正なメールアドレス形式でバリデーションエラーが表示される', async () => {
    const { container } = render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText('山田 太郎'), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('お問い合わせ内容をご記入ください。（1000文字以内）'),
      { target: { value: 'テスト内容' } }
    );
    submitForm(container);
    await waitFor(() => {
      expect(
        screen.getByText('正しいメールアドレス形式で入力してください。')
      ).toBeInTheDocument();
    });
  });

  // ── 送信成功 ────────────────────────────────────────────
  it('送信成功時に /contact/thanks へ遷移する', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: '受け付けました。' }),
    } as Response);

    const { container } = render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText('山田 太郎'), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('お問い合わせ内容をご記入ください。（1000文字以内）'),
      { target: { value: 'テスト内容' } }
    );
    submitForm(container);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/contact/thanks');
    });
  });

  // ── 送信失敗 ────────────────────────────────────────────
  it('APIエラー時にalertが表示される', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: '送信に失敗しました。' }),
    } as Response);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    const { container } = render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText('山田 太郎'), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('お問い合わせ内容をご記入ください。（1000文字以内）'),
      { target: { value: 'テスト内容' } }
    );
    submitForm(container);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('送信に失敗しました。');
    });
  });
});
