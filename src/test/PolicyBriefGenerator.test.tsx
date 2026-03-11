import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PolicyBriefGenerator from '../components/PolicyBriefGenerator';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('PolicyBriefGenerator', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the section title', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Policy Brief Generator')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByRole('region', { name: 'Policy Brief Generator' })).toBeTruthy();
  });

  it('renders description with dataset count', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getAllByText(/verified datasets/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat bar ───────────────────────────────────────────

  it('displays prisoners documented stat', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getAllByText(/prisoners documented/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays sanctions tracked stat', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/sanctions tracked/)).toBeTruthy();
  });

  it('displays legal cases stat', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/legal cases/)).toBeTruthy();
  });

  it('displays companies assessed stat', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/companies assessed/)).toBeTruthy();
  });

  // ── Audience selector ──────────────────────────────────

  it('renders all 4 audience buttons', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Legislators')).toBeTruthy();
    expect(screen.getByText('Diplomats')).toBeTruthy();
    expect(screen.getByText('Corporate Compliance')).toBeTruthy();
    expect(screen.getByText('Civil Society')).toBeTruthy();
  });

  it('Legislators is active by default', () => {
    render(<PolicyBriefGenerator />);
    const btn = screen.getByText('Legislators').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Diplomats changes audience', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Diplomats'));
    const btn = screen.getByText('Diplomats').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Corporate Compliance changes audience', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Corporate Compliance'));
    const btn = screen.getByText('Corporate Compliance').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Civil Society changes audience', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Civil Society'));
    const btn = screen.getByText('Civil Society').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows audience descriptions', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Parliamentary members and legislative staff')).toBeTruthy();
    expect(screen.getByText('Foreign ministry officials and international organizations')).toBeTruthy();
  });

  // ── Topic selector ─────────────────────────────────────

  it('renders all 6 topic buttons', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Political Detention')).toBeTruthy();
    expect(screen.getByText('Forced Labor & Supply Chains')).toBeTruthy();
    expect(screen.getByText('Transnational Repression')).toBeTruthy();
    expect(screen.getByText('Genocide Recognition')).toBeTruthy();
    expect(screen.getByText('Hong Kong National Security Law')).toBeTruthy();
    expect(screen.getByText('Sanctions & Accountability')).toBeTruthy();
  });

  it('Political Detention is active by default', () => {
    render(<PolicyBriefGenerator />);
    const btn = screen.getByText('Political Detention').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking a topic changes selection', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Forced Labor & Supply Chains'));
    const btn = screen.getByText('Forced Labor & Supply Chains').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  // ── Topic search ───────────────────────────────────────

  it('renders search input for topics', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByPlaceholderText('Search topics...')).toBeTruthy();
  });

  it('search has aria-label', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByLabelText('Search policy topics')).toBeTruthy();
  });

  it('search filters topics', () => {
    render(<PolicyBriefGenerator />);
    const input = screen.getByPlaceholderText('Search topics...');
    fireEvent.change(input, { target: { value: 'Genocide' } });
    expect(screen.getByText('Genocide Recognition')).toBeTruthy();
    expect(screen.queryByText('Political Detention')).toBeNull();
  });

  it('search shows empty state when no match', () => {
    render(<PolicyBriefGenerator />);
    const input = screen.getByPlaceholderText('Search topics...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText(/No topics match/)).toBeTruthy();
  });

  // ── Generated brief ────────────────────────────────────

  it('displays brief title for default selection', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Legislative Action Required: Political Detention/)).toBeTruthy();
  });

  it('brief title changes with audience', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Diplomats'));
    expect(screen.getByText(/Diplomatic Brief: Political Prisoners/)).toBeTruthy();
  });

  it('brief title changes with topic', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Transnational Repression'));
    expect(screen.getByText(/Legislative Brief: CCP Transnational Repression/)).toBeTruthy();
  });

  it('displays Executive Summary heading', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Executive Summary')).toBeTruthy();
  });

  it('executive summary contains data', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/documented political prisoners/)).toBeTruthy();
  });

  it('displays audience label in brief metadata', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Audience: Legislators/)).toBeTruthy();
  });

  it('displays generated date', () => {
    render(<PolicyBriefGenerator />);
    const today = new Date().toISOString().slice(0, 10);
    expect(screen.getByText(new RegExp(`Generated: ${today}`))).toBeTruthy();
  });

  // ── Key findings section ───────────────────────────────

  it('displays Key Findings heading with count', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Key Findings/)).toBeTruthy();
  });

  it('key findings are expanded by default', () => {
    render(<PolicyBriefGenerator />);
    const findingsBtn = screen.getByText(/Key Findings/).closest('button');
    expect(findingsBtn!.getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking Key Findings collapses section', () => {
    render(<PolicyBriefGenerator />);
    const findingsBtn = screen.getByText(/Key Findings/).closest('button');
    fireEvent.click(findingsBtn!);
    expect(findingsBtn!.getAttribute('aria-expanded')).toBe('false');
  });

  // ── Recommendations section ────────────────────────────

  it('displays Recommendations heading with count', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Recommendations/)).toBeTruthy();
  });

  it('recommendations are expanded by default', () => {
    render(<PolicyBriefGenerator />);
    const recBtn = screen.getByText(/Recommendations/).closest('button');
    expect(recBtn!.getAttribute('aria-expanded')).toBe('true');
  });

  it('shows legislator-specific recommendations by default', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Magnitsky-style sanctions/)).toBeTruthy();
  });

  it('diplomat recommendations shown when selected', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Diplomats'));
    expect(screen.getByText(/bilateral and multilateral forums/)).toBeTruthy();
  });

  it('corporate recommendations shown when selected', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Corporate Compliance'));
    expect(screen.getByText(/enhanced due diligence/)).toBeTruthy();
  });

  it('civil society recommendations shown when selected', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Civil Society'));
    expect(screen.getByText(/coordinated social media campaigns/)).toBeTruthy();
  });

  // ── Evidence citations ─────────────────────────────────

  it('displays Evidence Citations heading', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Evidence Citations/)).toBeTruthy();
  });

  it('citations are collapsed by default', () => {
    render(<PolicyBriefGenerator />);
    const citBtn = screen.getByText(/Evidence Citations/).closest('button');
    expect(citBtn!.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking citations expands section', () => {
    render(<PolicyBriefGenerator />);
    const citBtn = screen.getByText(/Evidence Citations/).closest('button');
    fireEvent.click(citBtn!);
    expect(citBtn!.getAttribute('aria-expanded')).toBe('true');
  });

  // ── Copy to clipboard ─────────────────────────────────

  it('renders copy button', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText('Copy brief')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByLabelText('Copy brief to clipboard')).toBeTruthy();
  });

  it('copies brief to clipboard', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Copy brief'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const text = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(text).toContain('POLICY BRIEF');
    expect(text).toContain('EXECUTIVE SUMMARY');
    expect(text).toContain('KEY FINDINGS');
    expect(text).toContain('RECOMMENDATIONS');
  });

  // ── Topic-audience combinations ────────────────────────

  it('Hong Kong NSL + Legislator brief', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Hong Kong National Security Law'));
    expect(screen.getByText(/Legislative Brief: Hong Kong National Security Law/)).toBeTruthy();
    expect(screen.getByText(/National Security Law has been used/)).toBeTruthy();
  });

  it('Sanctions + Diplomat brief', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Sanctions & Accountability'));
    fireEvent.click(screen.getByText('Diplomats'));
    expect(screen.getByText(/Multilateral Sanctions Coordination/)).toBeTruthy();
  });

  it('Forced Labor + Corporate brief', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Forced Labor & Supply Chains'));
    fireEvent.click(screen.getByText('Corporate Compliance'));
    expect(screen.getByText(/Compliance Advisory: Forced Labor Supply Chain/)).toBeTruthy();
  });

  it('Genocide + Civil Society brief', () => {
    render(<PolicyBriefGenerator />);
    fireEvent.click(screen.getByText('Genocide Recognition'));
    fireEvent.click(screen.getByText('Civil Society'));
    expect(screen.getByText(/Advocacy Brief: Supporting Genocide Recognition/)).toBeTruthy();
  });

  // ── Data quality ───────────────────────────────────────

  it('no CCP state media cited', () => {
    render(<PolicyBriefGenerator />);
    const allText = document.body.textContent;
    expect(allText).not.toContain('Xinhua');
    expect(allText).not.toContain('CGTN');
    expect(allText).not.toContain('Global Times');
  });

  // ── Footer ─────────────────────────────────────────────

  it('shows source attribution', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/Tier 1-2 sources only/)).toBeTruthy();
  });

  it('shows CC BY 4.0 license', () => {
    render(<PolicyBriefGenerator />);
    expect(screen.getByText(/CC BY 4.0/)).toBeTruthy();
  });
});
