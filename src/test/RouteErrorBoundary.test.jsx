import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

// Component that throws during render
function ThrowingComponent({ error }) {
  throw error;
}

// Suppress console.error in tests since error boundaries log errors
const originalError = console.error;
beforeEach(() => { console.error = vi.fn(); });
afterEach(() => { console.error = originalError; });

describe('RouteErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <div>Page content</div>
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Page content')).toBeTruthy();
  });

  it('shows error UI when a render error occurs', () => {
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <ThrowingComponent error={new Error('Test render error')} />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Test render error')).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
    expect(screen.getByText('Go to Dashboard')).toBeTruthy();
  });

  it('shows chunk-load-specific message for dynamic import failures', () => {
    const chunkError = new Error('Loading chunk abc123 failed');
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <ThrowingComponent error={chunkError} />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Failed to load page')).toBeTruthy();
    expect(screen.getByText(/network interruption/)).toBeTruthy();
  });

  it('detects dynamically imported module errors', () => {
    const moduleError = new Error('Failed to fetch dynamically imported module');
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <ThrowingComponent error={moduleError} />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Failed to load page')).toBeTruthy();
  });

  it('has accessible retry and navigation buttons', () => {
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <ThrowingComponent error={new Error('test')} />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    const retryButton = screen.getByText('Try Again');
    const homeLink = screen.getByText('Go to Dashboard');
    expect(retryButton.tagName).toBe('BUTTON');
    expect(homeLink.tagName).toBe('A');
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});
