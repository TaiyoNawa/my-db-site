import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ResetButton } from '../ResetButton';

describe('ResetButton.tsxのテスト', () => {
  it('ボタンがアイコンと共に表示されている', () => {
    render(
      <ChakraProvider>
        <ResetButton onClick={() => {}} />
      </ChakraProvider>
    );
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
  it('クリックするとonClickが呼ばれる', async () => {
    const onClick = vi.fn();
    render(
      <ChakraProvider>
        <ResetButton onClick={onClick} />
      </ChakraProvider>
    );
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
