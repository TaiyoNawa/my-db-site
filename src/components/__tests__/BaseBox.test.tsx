// __tests__/BaseBox.test.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BaseBox } from '@/components/BaseBox';

describe('BaseBox.tsxのテスト', () => {
  it('子要素を正しく表示する', () => {
    render(
      <ChakraProvider>
        <BaseBox>テストコンテンツ</BaseBox>
      </ChakraProvider>
    );

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });

  it('渡したprops（例えば幅）を適用できる', () => {
    const { container } = render(
      <ChakraProvider>
        <BaseBox w="60%">幅確認</BaseBox>
      </ChakraProvider>
    );

    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle({
      width: '60%',
    });
  });
});
