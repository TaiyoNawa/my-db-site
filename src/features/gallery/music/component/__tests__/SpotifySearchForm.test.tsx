import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { SpotifySearchForm } from '../SpotifySearchForm';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('SpotifySearchForm', () => {
  it('入力フィールドと検索ボタンが表示される', () => {
    renderWithChakra(<SpotifySearchForm onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/キーワード/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('検索ボタンを押すと onSearch が呼ばれる', () => {
    const mockSearch = vi.fn();
    renderWithChakra(<SpotifySearchForm onSearch={mockSearch} />);

    const input = screen.getByPlaceholderText(/キーワード/i);
    fireEvent.change(input, { target: { value: 'YOASOBI' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSearch).toHaveBeenCalledWith('YOASOBI');
  });

  it('空文字の場合は onSearch が呼ばれない', () => {
    const mockSearch = vi.fn();
    renderWithChakra(<SpotifySearchForm onSearch={mockSearch} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSearch).not.toHaveBeenCalled();
  });
});
