import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WhistleblowerGuide from '../components/WhistleblowerGuide';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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

  // ── Sections ──────────────────────────────────────────
  it('renders every view as a native disclosure section', () => {
    render(<WhistleblowerGuide />);
    expectDisclosureSections(['Security Protocols', 'Submission Channels', 'Legal Protections']);
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
    const section = inSection('Submission Channels');
    const input = screen.getByPlaceholderText('Search protocols, channels, legal frameworks...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(section.getByText('No channels match your search')).toBeTruthy();
  });

  it('search filters legal results', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Legal Protections');
    const input = screen.getByPlaceholderText('Search protocols, channels, legal frameworks...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(section.getByText('No legal frameworks match your search')).toBeTruthy();
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
    const section = inSection('Submission Channels');
    expect(section.getAllByText(/Guardian/).length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText(/Washington Post/).length).toBeGreaterThanOrEqual(1);
  });

  it('channels show trust levels', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Submission Channels');
    expect(section.getAllByText(/VERIFIED/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a channel shows URL', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Submission Channels');
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(section.getAllByText(/Access:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Legal Protections View ─────────────────────────────
  it('legal view shows framework names', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Legal Protections');
    expect(section.getAllByText(/Whistleblower Protection/).length).toBeGreaterThanOrEqual(1);
  });

  it('legal view shows jurisdictions', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Legal Protections');
    expect(section.getAllByText(/United States/).length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText(/European Union/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a legal framework shows detail', () => {
    render(<WhistleblowerGuide />);
    const section = inSection('Legal Protections');
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(section.getAllByText(/Source:/).length).toBeGreaterThanOrEqual(1);
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
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)![0];
    expect(clipboardText).toContain('WHISTLEBLOWER SECURITY GUIDE');
    expect(clipboardText).toContain('CC BY 4.0');
  });

  it('copy report contains critical warning', () => {
    render(<WhistleblowerGuide />);
    fireEvent.click(screen.getByLabelText('Copy intelligence report to clipboard'));
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)![0];
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
