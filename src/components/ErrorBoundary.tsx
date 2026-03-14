/**
 * ErrorBoundary — Top-level React error boundary for crash recovery.
 *
 * Catches rendering errors anywhere in the component tree and displays a
 * user-friendly fallback UI with a "Try Again" button that resets state
 * without a full page reload.
 *
 * @module ErrorBoundary
 */
import React from 'react';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary that catches rendering errors and displays
 * a user-friendly fallback with a "Try Again" option that resets state
 * without requiring a full page reload.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactNode} Children or error fallback UI
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('boundary', 'Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0a0e14] min-h-screen flex items-center justify-center flex-col text-white p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h1>
          <p className="text-slate-400 max-w-md text-center mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              aria-label="Try again — reset the application"
              className="px-6 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              aria-label="Reload page"
              className="px-6 py-3 bg-[#111820] hover:bg-[#1c2a35] font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
