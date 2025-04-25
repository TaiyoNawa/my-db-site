import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CurrentLinkCopyButton } from '../CurrentLinkCopyButton';

describe('LinkCopyButton.tsxのテスト', () => {
  // Clipboard API のモック
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  // ChakraProvider でラップした render ヘルパー
  const renderWithChakra = (ui: React.ReactNode) =>
    render(<ChakraProvider>{ui}</ChakraProvider>);

  it('ボタンがアイコンと共に表示されている', () => {
    renderWithChakra(<CurrentLinkCopyButton />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('クリックすると"Copied!"が表示される', async () => {
    renderWithChakra(<CurrentLinkCopyButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.textContent).toBe('Copied!');
    });
  });
});
