import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CensorshipCircumventionGuide from '../components/CensorshipCircumventionGuide';
import { disclosureFor, expectDisclosureSections, inSection } from './helpers/disclosure';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('CensorshipCircumventionGuide', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders the section title', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByText('Censorship Circumvention Guide')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByRole('region', { name: 'Censorship Circumvention Guide' })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/censorship methods/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/circumvention tools/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/political prisoners/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat Bar ───────────────────────────────────────────
  it('displays censorship methods stat', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/censorship methods/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays critical-risk methods stat', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/critical-risk methods/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays circumvention tools stat', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/circumvention tools/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays recommended tools stat', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/recommended tools/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays censorship categories stat', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/censorship categories/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Risk Distribution ──────────────────────────────────
  it('renders risk level summary cards', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText('Critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('High').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThanOrEqual(1);
  });

  it('displays method count for each risk level', () => {
    render(<CensorshipCircumventionGuide />);
    const methodLabels = screen.getAllByText(/methods?$/);
    expect(methodLabels.length).toBeGreaterThanOrEqual(3);
  });

  // ── Sections ──────────────────────────────────────────
  it('renders every view as a native disclosure section', () => {
    render(<CensorshipCircumventionGuide />);
    expectDisclosureSections(['Censorship Methods', 'Circumvention Tools', 'Safety Guide']);
  });

  // ── Search & Filters ──────────────────────────────────
  it('renders search input', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByPlaceholderText('Search methods, tools, techniques...')).toBeTruthy();
  });

  it('renders category filter dropdown inside the Censorship Methods section', () => {
    render(<CensorshipCircumventionGuide />);
    expect(inSection('Censorship Methods').getByLabelText('Filter censorship methods by category')).toBeTruthy();
  });

  it('renders risk level filter dropdown inside the Censorship Methods section', () => {
    render(<CensorshipCircumventionGuide />);
    expect(inSection('Censorship Methods').getByLabelText('Filter censorship methods by risk level')).toBeTruthy();
  });

  it('search filters method list', () => {
    render(<CensorshipCircumventionGuide />);
    const input = screen.getByPlaceholderText('Search methods, tools, techniques...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No methods match your filters')).toBeTruthy();
  });

  it('search for DNS shows results', () => {
    render(<CensorshipCircumventionGuide />);
    const input = screen.getByPlaceholderText('Search methods, tools, techniques...');
    fireEvent.change(input, { target: { value: 'DNS' } });
    expect(screen.queryByText('No methods match your filters')).toBeFalsy();
  });

  // ── Censorship Methods View ────────────────────────────
  it('renders censorship category headers', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText('Great Firewall').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Content Filtering').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('VPN Crackdowns').length).toBeGreaterThanOrEqual(1);
  });

  it('renders method names within categories', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByText('IP Address Blocking')).toBeTruthy();
    expect(screen.getByText('DNS Poisoning')).toBeTruthy();
    expect(screen.getByText('Deep Packet Inspection')).toBeTruthy();
  });

  it('clicking a method expands it', () => {
    render(<CensorshipCircumventionGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking expanded method collapses it', () => {
    render(<CensorshipCircumventionGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanded method shows source attribution', () => {
    render(<CensorshipCircumventionGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(screen.getAllByText(/Sources:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Circumvention Tools View ───────────────────────────
  it('tools view shows tool names', () => {
    render(<CensorshipCircumventionGuide />);
    const section = inSection('Circumvention Tools');
    expect(section.getByText('Tor Browser')).toBeTruthy();
    expect(section.getByText('Signal')).toBeTruthy();
    expect(section.getByText('Psiphon')).toBeTruthy();
  });

  it('tools view shows safety ratings', () => {
    render(<CensorshipCircumventionGuide />);
    const section = inSection('Circumvention Tools');
    expect(section.getAllByText('Recommended').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Use with Caution').length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a tool shows pros and cons', () => {
    render(<CensorshipCircumventionGuide />);
    const section = inSection('Circumvention Tools');
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(section.getByText('Pros')).toBeTruthy();
    expect(section.getByText('Cons')).toBeTruthy();
  });

  // ── Safety Guide View ──────────────────────────────────
  it('safety view shows critical warning', () => {
    render(<CensorshipCircumventionGuide />);
    const section = inSection('Safety Guide');
    expect(section.getByText('CRITICAL SAFETY WARNING')).toBeTruthy();
  });

  it('safety view shows safety sections', () => {
    render(<CensorshipCircumventionGuide />);
    const section = inSection('Safety Guide');
    expect(section.getByText('Before You Start')).toBeTruthy();
    expect(section.getByText('Tool Selection')).toBeTruthy();
    expect(section.getByText('Operational Security')).toBeTruthy();
    expect(section.getByText('If Detained')).toBeTruthy();
  });

  it('safety view mentions political prisoner count', () => {
    render(<CensorshipCircumventionGuide />);
    expect(disclosureFor('Safety Guide').textContent).toContain('political prisoners');
  });

  // ── Clipboard ──────────────────────────────────────────
  it('renders copy report button', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByLabelText('Copy intelligence report to clipboard')).toBeTruthy();
  });

  it('clicking copy button copies report', async () => {
    render(<CensorshipCircumventionGuide />);
    const btn = screen.getByLabelText('Copy intelligence report to clipboard');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const text = vi.mocked(navigator.clipboard.writeText).mock.calls[vi.mocked(navigator.clipboard.writeText).mock.calls.length - 1][0];
    expect(text).toContain('CENSORSHIP CIRCUMVENTION GUIDE');
    expect(text).toContain('Censorship methods documented');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Data Integrity ─────────────────────────────────────
  it('has at least 15 censorship methods', () => {
    render(<CensorshipCircumventionGuide />);
    const container = screen.getByRole('region', { name: 'Censorship Circumvention Guide' });
    const match = container.textContent.match(/(\d+)\s+censorship methods/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(15);
  });

  it('has at least 8 circumvention tools', () => {
    render(<CensorshipCircumventionGuide />);
    const container = screen.getByRole('region', { name: 'Censorship Circumvention Guide' });
    const match = container.textContent.match(/(\d+)\s+circumvention tools/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(8);
  });

  it('has at least 5 recommended tools', () => {
    render(<CensorshipCircumventionGuide />);
    const container = screen.getByRole('region', { name: 'Censorship Circumvention Guide' });
    const match = container.textContent.match(/(\d+)\s+recommended tools/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(5);
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media', () => {
    render(<CensorshipCircumventionGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) fireEvent.click(expandBtns[0]);
    const container = screen.getByRole('region', { name: 'Censorship Circumvention Guide' });
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('cgtn');
    expect(text).not.toContain('global times');
    expect(text).not.toContain("people's daily");
    expect(text).not.toContain('china daily');
  });

  // ── Footer ─────────────────────────────────────────────
  it('renders footer with data attribution', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getAllByText(/Tier 1-2 sources only/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThanOrEqual(1);
  });

  it('footer shows cross-reference counts', () => {
    render(<CensorshipCircumventionGuide />);
    const container = screen.getByRole('region', { name: 'Censorship Circumvention Guide' });
    expect(container.textContent).toContain('political prisoners');
    expect(container.textContent).toContain('international responses');
    expect(container.textContent).toContain('legal cases');
  });

  // ── Accessibility ──────────────────────────────────────
  it('search input has aria-label', () => {
    render(<CensorshipCircumventionGuide />);
    expect(screen.getByLabelText('Search censorship circumvention data')).toBeTruthy();
  });

  it('method cards have aria-expanded attribute', () => {
    render(<CensorshipCircumventionGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
