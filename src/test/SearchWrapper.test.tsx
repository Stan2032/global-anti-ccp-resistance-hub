import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import SearchWrapper, { SearchButton } from '../components/SearchWrapper';

describe('SearchButton', () => {
  it('renders with search text', () => {
    render(<SearchButton onClick={() => {}} />);
    expect(screen.getByText('Search...')).toBeTruthy();
  });

  it('has correct aria-label', () => {
    render(<SearchButton onClick={() => {}} />);
    expect(screen.getByLabelText('Open search (Ctrl+K)')).toBeTruthy();
  });

  it('shows keyboard shortcut hint', () => {
    render(<SearchButton onClick={() => {}} />);
    expect(screen.getByText('⌘K')).toBeTruthy();
  });

  it('accepts custom className', () => {
    const { container } = render(<SearchButton onClick={() => {}} className="w-80" />);
    const button = container.querySelector('button');
    expect(button!.className).toContain('w-80');
  });

  it('renders SVG search icon', () => {
    const { container } = render(<SearchButton onClick={() => {}} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

describe('SearchWrapper', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <SearchWrapper>
          <div>Content</div>
        </SearchWrapper>
      </MemoryRouter>
    );
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('passes openSearch function to render prop children', () => {
    let receivedOpenSearch = false;
    render(
      <MemoryRouter>
        <SearchWrapper>
          {({ openSearch }) => {
            receivedOpenSearch = typeof openSearch === 'function';
            return <div>Functional Content</div>;
          }}
        </SearchWrapper>
      </MemoryRouter>
    );
    expect(receivedOpenSearch).toBe(true);
    expect(screen.getByText('Functional Content')).toBeTruthy();
  });
});
