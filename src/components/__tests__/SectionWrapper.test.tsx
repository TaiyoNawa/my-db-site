import { Box } from '@chakra-ui/react';
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { SectionWrapper } from '../SectionWrapper';

describe('SectionWrapper コンポーネント', () => {
  it('子要素（children）が正しくレンダリングされる', () => {
    render(
      <SectionWrapper backgroundColor="gray.100">
        <Box data-testid="child-content">テストコンテンツ</Box>
      </SectionWrapper>
    );

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent('テストコンテンツ');
  });
});
