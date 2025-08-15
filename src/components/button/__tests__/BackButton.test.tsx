import { describe, it, expect, vi } from 'vitest';

import { fireEvent, render, screen } from '@/test/test-utils';

import { BackButton } from '../BackButton';

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('BackButton.tsxのテスト', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  it('デフォルトのテキストで正しくレンダリングされる', () => {
    render(<BackButton />);
    expect(screen.getByRole('button', { name: /戻る/i })).toBeInTheDocument();
  });

  it('カスタムのテキストで正しくレンダリングされる', () => {
    render(<BackButton>Go Back</BackButton>);
    expect(
      screen.getByRole('button', { name: /Go Back/i })
    ).toBeInTheDocument();
  });

  it('クリック時にrouter.back()が呼ばれる (hrefなし)', () => {
    render(<BackButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('クリック時にrouter.push(href)が呼ばれる (hrefあり)', () => {
    const href = '/gallery/poll';
    render(<BackButton href={href} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(href);
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});
