import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ManganimeSearchTabs } from '../ManganimeSearchTabs';

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('ManganimeSearchTabs.tsxのテスト', () => {
  it('3つのタブが表示される', () => {
    renderWithChakra(<ManganimeSearchTabs />);
    expect(screen.getAllByText(/マンガ/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/アニメ/)[0]).toBeInTheDocument();
  });

  it('タブを切り替えると表示される検索フォームが変わる', () => {
    renderWithChakra(<ManganimeSearchTabs />);
    const input0 = screen.getAllByPlaceholderText(/キーワードを入力/)[0];
    fireEvent.change(input0, { target: { value: 'test keyword0' } });
    expect(input0).toHaveValue('test keyword0');

    fireEvent.click(screen.getAllByText(/アニメ/)[0]);
    const input1 = screen.getAllByPlaceholderText(/キーワードを入力/)[1];
    fireEvent.change(input1, { target: { value: 'test keyword1' } });
    expect(input1).toHaveValue('test keyword1');
  });
});
