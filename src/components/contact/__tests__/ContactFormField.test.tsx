// ContactFormField.test.tsx
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { ContactFormField } from '../ContactFormField';

describe('ContactFormField コンポーネント', () => {
  it('ラベルが表示される', () => {
    render(
      <ContactFormField label="お名前">
        <input />
      </ContactFormField>
    );
    expect(screen.getByText('お名前')).toBeInTheDocument();
  });

  it('isRequired=true のとき必須インジケーター（*）がラベルに表示される', () => {
    const { container } = render(
      <ContactFormField label="お名前" isRequired>
        <input />
      </ContactFormField>
    );
    // Chakra UI の FormLabel が必須フィールドに aria-hidden の * スパンを追加する
    expect(
      container.querySelector('.chakra-form__required-indicator')
    ).toBeInTheDocument();
  });

  it('errorMessage があるとエラーメッセージが表示される', () => {
    render(
      <ContactFormField label="お名前" errorMessage="お名前を入力してください。">
        <input />
      </ContactFormField>
    );
    expect(
      screen.getByText('お名前を入力してください。')
    ).toBeInTheDocument();
  });

  it('errorMessage がないとエラーメッセージは表示されない', () => {
    render(
      <ContactFormField label="お名前">
        <input />
      </ContactFormField>
    );
    expect(
      screen.queryByText('お名前を入力してください。')
    ).not.toBeInTheDocument();
  });

  it('children が表示される', () => {
    render(
      <ContactFormField label="お名前">
        <input placeholder="山田 太郎" />
      </ContactFormField>
    );
    expect(screen.getByPlaceholderText('山田 太郎')).toBeInTheDocument();
  });
});
