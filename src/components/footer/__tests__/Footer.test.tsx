// Footer.test.tsx
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { Footer } from '../Footer';

describe('Footer コンポーネント', () => {
  it('各セクションヘッダーが表示される', () => {
    render(<Footer />);

    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  it('著作権テキストが表示される', () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 TaiyoNawa. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it('リンクが正しく表示されている', () => {
    render(<Footer />);
    expect(screen.getByText('Overview')).toHaveAttribute('href', '#');
    expect(screen.getByText('Careers')).toHaveAttribute('href', '#');
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '#');
    expect(screen.getByText('Twitter')).toHaveAttribute('href', '#');
  });
});
