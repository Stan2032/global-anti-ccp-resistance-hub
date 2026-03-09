import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SafetyChecklist from '../components/SafetyChecklist';

describe('SafetyChecklist', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // --- Heading ---

  it('renders the heading', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText('Personal Safety Checklist')).toBeTruthy();
  });

  it('renders the description', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText(/Protect yourself while advocating for human rights/)).toBeTruthy();
  });

  // --- Checklist items ---

  it('renders digital security items by default', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText('Use a VPN')).toBeTruthy();
    expect(screen.getByText('Install Tor Browser')).toBeTruthy();
    expect(screen.getByText('Enable 2FA on all accounts')).toBeTruthy();
  });

  it('renders priority badges', () => {
    render(<SafetyChecklist />);
    expect(screen.getAllByText('critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('high').length).toBeGreaterThanOrEqual(1);
  });

  // --- Toggle/check functionality ---

  it('toggles a checklist item when clicked', () => {
    render(<SafetyChecklist />);
    const vpnText = screen.getByText('Use a VPN');
    // Find the toggle button closest to this item
    const toggleBtn = vpnText!.closest('.flex-1')!.parentElement!.querySelector('button');
    fireEvent.click(toggleBtn!);
    expect(toggleBtn!.textContent).toBe('✓');
  });

  it('untoggling a checked item removes the checkmark', () => {
    render(<SafetyChecklist />);
    const vpnText = screen.getByText('Use a VPN');
    const toggleBtn = vpnText!.closest('.flex-1')!.parentElement!.querySelector('button');
    fireEvent.click(toggleBtn!);
    expect(toggleBtn!.textContent).toBe('✓');
    fireEvent.click(toggleBtn!);
    expect(toggleBtn!.textContent).toBe('');
  });

  // --- Category tabs ---

  it('renders category tab buttons', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText('Digital Security')).toBeTruthy();
    expect(screen.getByText('Physical Safety')).toBeTruthy();
    expect(screen.getByText('Communication')).toBeTruthy();
    expect(screen.getByText('Travel Safety')).toBeTruthy();
  });

  it('switches to communication items when tab is clicked', () => {
    render(<SafetyChecklist />);
    fireEvent.click(screen.getByText('Communication'));
    expect(screen.getByText('Use Signal for messaging')).toBeTruthy();
    expect(screen.getByText('Enable disappearing messages')).toBeTruthy();
    // Digital item should be hidden
    expect(screen.queryByText('Install Tor Browser')).toBeNull();
  });

  // --- Progress ---

  it('renders overall progress section', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText('Overall Progress')).toBeTruthy();
    expect(screen.getByText(/0\/39 items/)).toBeTruthy();
  });

  // --- Emergency resources ---

  it('renders emergency resources section', () => {
    render(<SafetyChecklist />);
    expect(screen.getByText('Emergency Resources')).toBeTruthy();
    expect(screen.getByText(/Front Line Defenders/)).toBeTruthy();
  });
});
