/**
 * ShellErrorBoundary — Lightweight error boundary for non-critical shell components.
 *
 * Unlike the full ErrorBoundary, this silently swallows errors and renders
 * nothing, preventing a broken shell component (search modal, PWA banner, etc.)
 * from crashing the entire app layout.
 *
 * @module ShellErrorBoundary
 */
import React from 'react';
import { logger } from '../utils/logger';

interface ShellErrorBoundaryProps {
  children: React.ReactNode;
}

interface ShellErrorBoundaryState {
  hasError: boolean;
}

/**
 * Lightweight error boundary for non-critical shell components
 * (search modal, PWA banner, quick start guide, etc.)
 *
 * Unlike the full ErrorBoundary (full-screen error), this silently
 * catches errors and renders nothing — preventing a broken shell
 * component from crashing the entire app layout.
 *
 * Critical for censored-region users where chunk-load failures
 * on non-essential components shouldn't block main content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactNode|null} Children or null on error
 */
class ShellErrorBoundary extends React.Component<ShellErrorBoundaryProps, ShellErrorBoundaryState> {
  constructor(props: ShellErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ShellErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.warn('shell-boundary', 'Shell component error (non-critical):', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default ShellErrorBoundary;
