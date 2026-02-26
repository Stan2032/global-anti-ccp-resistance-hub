import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Error boundary for lazy-loaded route components.
 * Catches chunk-load failures and renders a recoverable error UI
 * within the existing page layout (preserving navigation).
 * 
 * This is critical for users in censored regions where network
 * interruptions can prevent lazy chunks from loading.
 */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to fetch');

    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route error boundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-lg p-8">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white mb-3">
              {this.state.isChunkError ? 'Failed to load page' : 'Something went wrong'}
            </h2>
            <p className="text-slate-400 mb-6">
              {this.state.isChunkError
                ? 'This page could not be loaded. This may be due to a network interruption or connection issue. Please check your connection and try again.'
                : (this.state.error?.message || 'An unexpected error occurred while loading this page.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              <Link
                to="/"
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111820] hover:bg-[#1c2a35] text-white font-medium transition-colors"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
