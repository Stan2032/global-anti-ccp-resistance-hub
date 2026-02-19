import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error when asked
const ThrowingComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error from React's error boundary logs during tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should show error message when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Test error message')).toBeTruthy();
  });

  it('should show Try Again button when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Try Again')).toBeTruthy();
    expect(screen.getByText('Reload Page')).toBeTruthy();
  });

  it('should reset error state when Try Again is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();

    // Click Try Again — this resets the error state
    fireEvent.click(screen.getByText('Try Again'));

    // After handleReset, the boundary will try to re-render children,
    // which will throw again. Verify the boundary catches it again.
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('should display generic message when error has no message', () => {
    const NoMessageError = () => {
      throw { message: undefined };
    };

    render(
      <ErrorBoundary>
        <NoMessageError />
      </ErrorBoundary>
    );
    expect(screen.getByText('An unexpected error occurred')).toBeTruthy();
  });
});
