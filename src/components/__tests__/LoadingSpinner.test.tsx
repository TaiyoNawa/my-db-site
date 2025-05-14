//src/components/LoadingSpinner.test.tsx
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner.tsxのテスト', () => {
  it('レンダリングされる+Maxサイズが適切', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveStyle({
      maxWidth: '100%',
      overflow: 'hidden',
    });
  });
});
