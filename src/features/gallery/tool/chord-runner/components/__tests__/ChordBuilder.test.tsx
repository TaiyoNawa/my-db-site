import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { ChordBuilder } from '../ChordBuilder';

const defaultProps = {
  sequence: [],
  isPlaying: false,
  onAdd: vi.fn(),
  onRemove: vi.fn(),
};

describe('ChordBuilder', () => {
  it('10種類のコードボタンが表示される', () => {
    render(<ChordBuilder {...defaultProps} />);
    const chordNames = ['C', 'G', 'D', 'A', 'E', 'Am', 'Dm', 'Em', 'F', 'Bm'];
    for (const name of chordNames) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('コードボタンをクリックすると onAdd が呼ばれる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ChordBuilder {...defaultProps} onAdd={onAdd} />);
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(onAdd).toHaveBeenCalledWith('C');
  });

  it('sequence.length >= 16 でボタンが disabled になる', () => {
    const fullSequence = Array(16).fill('C');
    render(<ChordBuilder {...defaultProps} sequence={fullSequence} />);
    const button = screen.getByRole('button', { name: 'G' });
    expect(button).toBeDisabled();
  });

  it('タイムライン上の削除ボタンクリックで onRemove が呼ばれる', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <ChordBuilder
        {...defaultProps}
        sequence={['C', 'G']}
        onRemove={onRemove}
      />
    );
    const deleteButtons = screen.getAllByRole('button', { name: /を削除/ });
    await user.click(deleteButtons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });
});
