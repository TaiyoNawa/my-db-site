import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { SpotifySearchTabs } from '../SpotifySearchTabs';

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('SpotifySearchTabs', () => {
  it('3つのタブが表示される', () => {
    renderWithChakra(<SpotifySearchTabs />);
    expect(screen.getByText(/楽曲/)).toBeInTheDocument();
    expect(screen.getByText(/プレイリスト/)).toBeInTheDocument();
    expect(screen.getByText(/アーティスト/)).toBeInTheDocument();
  });

  it('タブを切り替えると表示される検索フォームが変わる', () => {
    renderWithChakra(<SpotifySearchTabs />);
    const input0 = screen.getAllByPlaceholderText(/キーワードを入力/)[0];
    fireEvent.change(input0, { target: { value: 'test keyword0' } });
    expect(input0).toHaveValue('test keyword0');

    fireEvent.click(screen.getByText(/プレイリスト/));
    const input1 = screen.getAllByPlaceholderText(/キーワードを入力/)[1];
    fireEvent.change(input1, { target: { value: 'test keyword1' } });
    expect(input1).toHaveValue('test keyword1');

    fireEvent.click(screen.getByText(/アーティスト/));
    const input2 = screen.getAllByPlaceholderText(/キーワードを入力/)[2];
    fireEvent.change(input2, { target: { value: 'test keyword2' } });
    expect(input2).toHaveValue('test keyword2');
  });
});
