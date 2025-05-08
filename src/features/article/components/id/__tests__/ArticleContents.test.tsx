import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import { ArticleContents } from '../ArticleContents';
import { generateAnchorId } from '../ArticleContents';

describe('ArticleContents', () => {
  test('renders with markdown content', () => {
    const markdown = '# Test Heading\n\nThis is a test paragraph.';
    render(<ArticleContents markdown={markdown} />);
    const headingElement = screen.getByText('Test Heading');
    const paragraphElement = screen.getByText('This is a test paragraph.');
    expect(headingElement).toBeInTheDocument();
    expect(paragraphElement).toBeInTheDocument();
  });

  test('generates table of contents for h2 headings', () => {
    const markdown = '## Section 1\n\nContent 1\n\n## Section 2\n\nContent 2';
    render(<ArticleContents markdown={markdown} />);
    const section1Link = screen.getByRole('link', { name: 'Section 1' });
    const section2Link = screen.getByRole('link', { name: 'Section 2' });
    expect(section1Link).toBeInTheDocument();
    expect(section2Link).toBeInTheDocument();
    expect(section1Link).toHaveAttribute('href', '#Section1');
    expect(section2Link).toHaveAttribute('href', '#Section2');
  });

  test('removes whitespace and encodes special characters', () => {
    const result = generateAnchorId('Section 1 & 特殊!');
    expect(result).toBe('Section1%26%E7%89%B9%E6%AE%8A!');
  });

  test('renders without table of contents when no h2 headings exist', () => {
    render(<ArticleContents markdown={'# Only H1\n\nText'} />);
    // `IndexOfContent`が空になる（空のulやdivになるなど）ことを確認
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders markdown with GFM features like tables and checkboxes', () => {
    const markdown = `
  | Column A | Column B |
  |----------|----------|
  | A1       | B1       |
  
  - [x] Done
  - [ ] Not done
  
  \`\`\`js
  console.log('hello');
  \`\`\`
    `;
    render(<ArticleContents markdown={markdown} />);

    expect(screen.getByText('Column A')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText("console.log('hello');")).toBeInTheDocument();
  });

  test('adds id to h2 headings', () => {
    const markdown = '## Section Heading';
    render(<ArticleContents markdown={markdown} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'SectionHeading');
  });
});
