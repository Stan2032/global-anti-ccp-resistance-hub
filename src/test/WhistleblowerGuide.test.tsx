import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WhistleblowerGuide from '../components/WhistleblowerGuide';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('WhistleblowerGuide', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders the section title', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByText('Whistleblower Security Guide')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByRole('region', { name: 'Whistleblower Security Guide' })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/protocols/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/submission channels/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/political prisoners/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Critical Warning ───────────────────────────────────
  it('displays critical security warning', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByText('CRITICAL SECURITY WARNING')).toBeTruthy();
  });

  it('warning mentions Tor Browser', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/Tor Browser/).length).toBeGreaterThanOrEqual(1);
  });

  it('warning mentions Tails OS', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/Tails/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat Bar ───────────────────────────────────────────
  it('displays security protocols stat', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/security protocols/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays critical-priority stat', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/critical-priority/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays submission channels stat', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/submission channels/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays verified secure stat', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/verified secure/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays legal frameworks stat', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/legal frameworks/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Risk Distribution ──────────────────────────────────
  it('renders risk distribution cards', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText('Critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('High').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThanOrEqual(1);
  });

  it('shows protocol count in distribution cards', () => {
    render(<WhistleblowerGuide />);
    const protocolLabels = screen.getAllByText(/protocols?$/);
    expect(protocolLabels.length).toBeGreaterThanOrEqual(1);
  });

  // ── View Toggle ────────────────────────────────────────
  it('renders all 3 view buttons', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByText('Security Protocols')).toBeTruthy();
    expect(screen.getByText('Submission Channels')).toBeTruthy();
    expect(screen.getByText('Legal Protections')).toBeTruthy();
  });

  it('Security Protocols is default active view', () => {
    render(<WhistleblowerGuide />);
    const btn = screen.getByText('Security Protocols');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('switching to Submission Channels view works', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Submission Channels'));
    const btn = screen.getByText('Submission Channels');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('switching to Legal Protections view works', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Legal Protections'));
    const btn = screen.getByText('Legal Protections');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  // ── Search ─────────────────────────────────────────────
  it('renders search input', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByPlaceholderText('Search protocols, channels, legal frameworks...')).toBeTruthy();
  });

  it('search filters protocol results', () => {
    render(<WhistleblowerGuide />);
    const input = screen.getByPlaceholderText('Search protocols, channels, legal frameworks...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('No protocols match your search')).toBeTruthy();
  });

  it('search filters channel results', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Submission Channels'));
    const input = screen.getByPlaceholderText('Search protocols, channels, legal frameworks...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('No channels match your search')).toBeTruthy();
  });

  it('search filters legal results', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Legal Protections'));
    const input = screen.getByPlaceholderText('Search protocols, channels, legal frameworks...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('No legal frameworks match your search')).toBeTruthy();
  });

  // ── Category Filter ────────────────────────────────────
  it('renders category filter dropdown', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByLabelText('Filter by protocol category')).toBeTruthy();
  });

  it('category filter contains All Categories option', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByText('All Categories')).toBeTruthy();
  });

  it('category filter contains Identity Protection', () => {
    render(<WhistleblowerGuide />);
    const select = screen.getByLabelText('Filter by protocol category');
    const options = select.querySelectorAll('option');
    const labels = Array.from(options).map(o => o.textContent);
    expect(labels).toContain('Identity Protection');
    expect(labels).toContain('Secure Communications');
    expect(labels).toContain('Document Handling');
  });

  // ── Protocol Cards ─────────────────────────────────────
  it('renders protocol cards with names', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/Tor Browser/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tails/).length).toBeGreaterThanOrEqual(1);
  });

  it('protocol cards have risk labels', () => {
    render(<WhistleblowerGuide />);
    const labels = screen.getAllByText(/^CRITICAL$/);
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a protocol shows detail', () => {
    render(<WhistleblowerGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('collapsing an expanded protocol works', () => {
    render(<WhistleblowerGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanded protocol shows source attribution', () => {
    render(<WhistleblowerGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(screen.getAllByText(/Source:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Submission Channels View ───────────────────────────
  it('channels view shows organization names', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Submission Channels'));
    expect(screen.getAllByText(/Guardian/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Washington Post/).length).toBeGreaterThanOrEqual(1);
  });

  it('channels show trust levels', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Submission Channels'));
    expect(screen.getAllByText(/VERIFIED/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a channel shows URL', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Submission Channels'));
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(screen.getAllByText(/Access:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Legal Protections View ─────────────────────────────
  it('legal view shows framework names', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Legal Protections'));
    expect(screen.getAllByText(/Whistleblower Protection/).length).toBeGreaterThanOrEqual(1);
  });

  it('legal view shows jurisdictions', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Legal Protections'));
    expect(screen.getAllByText(/United States/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/European Union/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a legal framework shows detail', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByText('Legal Protections'));
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(screen.getAllByText(/Source:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Copy Report ────────────────────────────────────────
  it('renders copy report button', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByLabelText('Copy intelligence report to clipboard')).toBeTruthy();
  });

  it('clicking copy report writes to clipboard', async () => {
    render(<WhistleblowerGuide />);
    const btn = screen.getByLabelText('Copy intelligence report to clipboard');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const clipboardText = (navigator.clipboard.writeText as any).mock.calls.at(-1)[0];
    expect(clipboardText).toContain('WHISTLEBLOWER SECURITY GUIDE');
    expect(clipboardText).toContain('CC BY 4.0');
  });

  it('copy report contains critical warning', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByLabelText('Copy intelligence report to clipboard'));
    const clipboardText = (navigator.clipboard.writeText as any).mock.calls.at(-1)[0];
    expect(clipboardText).toContain('CRITICAL SECURITY WARNING');
    expect(clipboardText).toContain('VERIFIED SUBMISSION CHANNELS');
  });

  // ── Data Integrity ─────────────────────────────────────
  it('has at least 14 OpSec protocols', () => {
    render(<WhistleblowerGuide />);
    const region = screen.getByRole('region', { name: 'Whistleblower Security Guide' });
    const text = region.textContent;
    const match = text.match(/(\d+)\s+security protocols/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(14);
  });

  it('has at least 10 submission channels', () => {
    render(<WhistleblowerGuide />);
    const region = screen.getByRole('region', { name: 'Whistleblower Security Guide' });
    const text = region.textContent;
    const match = text.match(/(\d+)\s+submission channels/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(10);
  });

  it('has at least 5 legal frameworks', () => {
    render(<WhistleblowerGuide />);
    const region = screen.getByRole('region', { name: 'Whistleblower Security Guide' });
    const text = region.textContent;
    const match = text.match(/(\d+)\s+legal frameworks/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(5);
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media as sources', () => {
    render(<WhistleblowerGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) fireEvent.click(expandBtns[0]);
    const region = screen.getByRole('region', { name: 'Whistleblower Security Guide' });
    const text = region.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain("people's daily");
    expect(text).not.toContain('china daily');
  });

  // ── Footer ─────────────────────────────────────────────
  it('shows Tier 1-2 attribution', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/Tier 1-2 sources only/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows CC BY 4.0 license', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThanOrEqual(1);
  });

  it('footer shows cross-reference data counts', () => {
    render(<WhistleblowerGuide />);
    const region = screen.getByRole('region', { name: 'Whistleblower Security Guide' });
    expect(region.textContent).toContain('political prisoners');
    expect(region.textContent).toContain('legal cases');
    expect(region.textContent).toContain('international responses');
  });

  // ── Accessibility ──────────────────────────────────────
  it('search input has aria-label', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByLabelText('Search whistleblower security data')).toBeTruthy();
  });

  it('view toggle group has aria-label', () => {
    render(<WhistleblowerGuide />);
    expect(screen.getByRole('group', { name: 'View options' })).toBeTruthy();
  });

  it('view buttons have aria-pressed attribute', () => {
    render(<WhistleblowerGuide />);
    const viewBtns = screen.getByRole('group', { name: 'View options' }).querySelectorAll('button');
    viewBtns.forEach(btn => {
      expect(btn.getAttribute('aria-pressed')).toBeTruthy();
    });
  });

  it('protocol cards have aria-expanded attribute', () => {
    render(<WhistleblowerGuide />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
