import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { SecondHeader } from '../SecondHeader';

const testProps = {
  title: 'テストタイトル',
};

describe('SecondHeader.tsxのテスト', () => {
  it('テキスト表示されていること', () => {
    render(<SecondHeader {...testProps} />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
