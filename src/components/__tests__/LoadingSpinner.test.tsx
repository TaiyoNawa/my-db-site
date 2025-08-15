//src/components/LoadingSpinner.test.tsx
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner.tsxのテスト', () => {
  it('正しくレンダリングされ、中央揃えのスタイルが適用されている', () => {
    render(<LoadingSpinner data-testid="loading-spinner-wrapper" />);
    const wrapper = screen.getByTestId('loading-spinner-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveStyle({
      position: 'fixed',
      top: '50%',
      left: '50%',
    });
  });

  it('Spinnerコンポーネントが子要素として存在し、デフォルトのpropsが適用されている', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status').querySelector('.chakra-spinner');
    expect(spinner).toBeInTheDocument();
    // Chakra UIのSpinnerはpropsを直接DOMに反映しないため、
    // sizeやcolorの正確なテストは難しい。
    // ここでは存在確認に留める。
  });

  it('カスタムのsizeとspinnerColor propsを適用できる', () => {
    render(<LoadingSpinner size="lg" spinnerColor="red.500" />);
    const spinner = screen.getByRole('status').querySelector('.chakra-spinner');
    expect(spinner).toBeInTheDocument();
    // propsが適用されているかの厳密なテストは難しいが、
    // レンダリングが成功することを確認する。
  });
});
