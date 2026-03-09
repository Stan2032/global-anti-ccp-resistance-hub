// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';

describe('KeyboardShortcutsHelp', () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    mockClose.mockClear();
  });

  // --- Rendering ---

  it('returns null when isOpen is false', () => {
    const { container } = render(<KeyboardShortcutsHelp isOpen={false} onClose={mockClose} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog when isOpen is true', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renders keyboard shortcuts title', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    expect(screen.getByText('$ keyboard_shortcuts')).toBeTruthy();
  });

  it('renders all navigation shortcuts', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    expect(screen.getByText('Toggle this help')).toBeTruthy();
    expect(screen.getByText('Open search')).toBeTruthy();
    expect(screen.getByText('Go to Dashboard')).toBeTruthy();
    expect(screen.getByText('Go to Intelligence')).toBeTruthy();
    expect(screen.getByText('Go to Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Go to Profiles')).toBeTruthy();
    expect(screen.getByText('Go to Take Action')).toBeTruthy();
    expect(screen.getByText('Go to Education')).toBeTruthy();
    expect(screen.getByText('Go to Security')).toBeTruthy();
    expect(screen.getByText('Close modal')).toBeTruthy();
  });

  it('renders key indicators for g-prefix shortcuts', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    // Multiple "then" connectors for multi-key shortcuts
    const thenElements = screen.getAllByText('then');
    expect(thenElements.length).toBeGreaterThanOrEqual(7);
  });

  it('renders close button', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    expect(screen.getByLabelText('Close')).toBeTruthy();
  });

  // --- Interaction ---

  it('calls onClose when close button is clicked', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    // Click the backdrop (the element behind the dialog)
    const backdrop = screen.getByRole('dialog').parentElement.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ? key is pressed while open', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    fireEvent.keyDown(document, { key: '?' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('renders hint text about closing', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockClose} />);
    expect(screen.getByText(/to close/)).toBeTruthy();
  });
});
