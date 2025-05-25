import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import Stack from '../../manga/Stack';

const images = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
  },
];

describe('Stack.tsxのテスト', () => {
  it('imageが表示される', () => {
    render(<Stack cardsData={images} />);
    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(images.length);
  });
});
