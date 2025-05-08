import { render, screen } from '@testing-library/react';
import { IndexOfContent } from '../IndexOfContents';
import { vi, describe, it, expect } from 'vitest';

describe('IndexOfContents', () => {
  it('renders with headings', () => {
    const headings = [
      { text: 'Section 1', id: 'section-1' },
      { text: 'Section 2', id: 'section-2' },
    ];
    render(<IndexOfContent headings={headings} />);

    const heading1Link = screen.getByRole('link', { name: 'Section 1' });
    const heading2Link = screen.getByRole('link', { name: 'Section 2' });

    expect(heading1Link).toBeInTheDocument();
    expect(heading2Link).toBeInTheDocument();
    expect(heading1Link).toHaveAttribute('href', '#section-1');
    expect(heading2Link).toHaveAttribute('href', '#section-2');
  });

  it('renders nothing when no headings are provided', () => {
    const headings: any[] = [];
    const { container } = render(<IndexOfContent headings={headings} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render if headings array is empty', () => {
    const { container } = render(<IndexOfContent headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct number of links when multiple headings are provided', () => {
    const headings = [
      { text: 'Section 1', id: 'section-1' },
      { text: 'Section 2', id: 'section-2' },
      { text: 'Section 3', id: 'section-3' },
    ];
    render(<IndexOfContent headings={headings} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '#section-1');
    expect(links[1]).toHaveAttribute('href', '#section-2');
    expect(links[2]).toHaveAttribute('href', '#section-3');
  });

  it('renders with correct styles', () => {
    const headings = [
      { text: 'Section 1', id: 'section-1' },
      { text: 'Section 2', id: 'section-2' },
    ];
    const { container } = render(<IndexOfContent headings={headings} />);

    const box = container.querySelector('div');
    expect(box).toHaveStyle('border-left: 4px solid #4299E1');
  });
});
