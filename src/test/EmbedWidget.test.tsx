import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmbedWidget from '../components/EmbedWidget';

// Mock clipboard API
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

describe('EmbedWidget', () => {
  it('renders the component header', () => {
    render(<EmbedWidget />);
    expect(screen.getByText('Embed Widgets')).toBeTruthy();
  });

  it('shows CC BY 4.0 license mention', () => {
    render(<EmbedWidget />);
    const matches = screen.getAllByText(/CC BY 4\.0/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 3 widget type buttons', () => {
    render(<EmbedWidget />);
    expect(screen.getByText('Political Prisoner Card')).toBeTruthy();
    expect(screen.getByText('Statistics Badge')).toBeTruthy();
    expect(screen.getByText('Alert Banner')).toBeTruthy();
  });

  it('has aria-pressed on widget type buttons', () => {
    const { container } = render(<EmbedWidget />);
    const buttons = container.querySelectorAll('[aria-pressed]');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('shows prisoner selector dropdown', () => {
    const { container } = render(<EmbedWidget />);
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it('renders preview section with toggle', () => {
    render(<EmbedWidget />);
    expect(screen.getByText('Preview')).toBeTruthy();
  });

  it('renders HTML code output section', () => {
    render(<EmbedWidget />);
    expect(screen.getByText('HTML Code')).toBeTruthy();
  });

  it('has a copy button with aria-label', () => {
    render(<EmbedWidget />);
    const copyBtn = screen.getByLabelText('Copy embed code to clipboard');
    expect(copyBtn).toBeTruthy();
  });

  it('generates HTML code containing Resistance Hub attribution', () => {
    const { container } = render(<EmbedWidget />);
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre.textContent).toContain('Resistance Hub');
  });

  it('generated code includes inline styles (no external CSS needed)', () => {
    const { container } = render(<EmbedWidget />);
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('style=');
  });

  it('generated code includes color scheme from design system', () => {
    const { container } = render(<EmbedWidget />);
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('#0a0e14');
  });

  it('can switch to Statistics Badge type', () => {
    const { container } = render(<EmbedWidget />);
    fireEvent.click(screen.getByText('Statistics Badge'));
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('CCP Human Rights Violations');
  });

  it('can switch to Alert Banner type', () => {
    const { container } = render(<EmbedWidget />);
    fireEvent.click(screen.getByText('Alert Banner'));
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('ALERT');
  });

  it('can switch back to Prisoner Card type', () => {
    const { container } = render(<EmbedWidget />);
    fireEvent.click(screen.getByText('Statistics Badge'));
    fireEvent.click(screen.getByText('Political Prisoner Card'));
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('Political Prisoner');
  });

  it('attribution note mentions no JavaScript required', () => {
    render(<EmbedWidget />);
    expect(screen.getByText(/No JavaScript required/)).toBeTruthy();
  });

  it('generated code links back to the platform', () => {
    const { container } = render(<EmbedWidget />);
    const pre = container.querySelector('pre');
    expect(pre.textContent).toContain('resistance-hub');
  });
});
