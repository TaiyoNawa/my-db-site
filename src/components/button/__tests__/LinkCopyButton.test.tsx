import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { LinkCopyButton } from '../LinkCopyButton';

const testProps = {
  href: 'https://github.com',
};
const renderWithChakra = (ui: React.ReactNode) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('LinkCopyButton.tsxのテスト', () => {
  // Clipboard API のモック
  beforeEach(() => {
    //clipboard関数をモックしないと、Copied!"が表示されない
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('ボタンがアイコンと共に表示されている', () => {
    renderWithChakra(<LinkCopyButton href={testProps.href} />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
  it('クリックすると"Copied!"が表示される', async () => {
    renderWithChakra(<LinkCopyButton href={testProps.href} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });
});
