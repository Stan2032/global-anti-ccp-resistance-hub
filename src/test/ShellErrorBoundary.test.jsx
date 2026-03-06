import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ShellErrorBoundary from '../components/ShellErrorBoundary';

// Component that throws when shouldThrow is true
const ThrowingComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Shell component failure');
  }
  return <div>Shell content works</div>;
};

// Component that throws a non-Error object
const NonErrorThrower = () => {
  throw 'string error';
};

describe('ShellErrorBoundary', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ShellErrorBoundary>
        <div>Normal shell content</div>
      </ShellErrorBoundary>
    );
    expect(screen.getByText('Normal shell content')).toBeTruthy();
  });

  it('renders null when a child throws (silent failure)', () => {
    const { container } = render(
      <ShellErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ShellErrorBoundary>
    );
    // ShellErrorBoundary renders null on error — no visible content
    expect(container.innerHTML).toBe('');
  });

  it('does not crash the parent when child throws', () => {
    // Rendering should not throw
    expect(() => {
      render(
        <div>
          <div>Parent content</div>
          <ShellErrorBoundary>
            <ThrowingComponent shouldThrow={true} />
          </ShellErrorBoundary>
        </div>
      );
    }).not.toThrow();

    // Parent content should still be visible
    expect(screen.getByText('Parent content')).toBeTruthy();
  });

  it('logs error to console.error', () => {
    render(
      <ShellErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ShellErrorBoundary>
    );
    // React's error boundary mechanism calls console.error
    expect(console.error).toHaveBeenCalled();
  });

  it('handles non-Error thrown values', () => {
    const { container } = render(
      <ShellErrorBoundary>
        <NonErrorThrower />
      </ShellErrorBoundary>
    );
    // Should still render null without crashing
    expect(container.innerHTML).toBe('');
  });

  it('renders multiple children when no error', () => {
    render(
      <ShellErrorBoundary>
        <div>Child A</div>
        <div>Child B</div>
      </ShellErrorBoundary>
    );
    expect(screen.getByText('Child A')).toBeTruthy();
    expect(screen.getByText('Child B')).toBeTruthy();
  });

  it('isolates errors — sibling boundaries are unaffected', () => {
    render(
      <div>
        <ShellErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ShellErrorBoundary>
        <ShellErrorBoundary>
          <div>Sibling is fine</div>
        </ShellErrorBoundary>
      </div>
    );
    expect(screen.getByText('Sibling is fine')).toBeTruthy();
  });
});
