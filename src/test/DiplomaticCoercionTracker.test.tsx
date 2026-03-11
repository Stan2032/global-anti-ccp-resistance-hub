import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DiplomaticCoercionTracker from '../components/DiplomaticCoercionTracker';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('DiplomaticCoercionTracker', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders the section title', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByText('Diplomatic Coercion Tracker')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/coercion incidents/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/international responses/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/sanctions/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat Bar ───────────────────────────────────────────
  it('displays countries targeted stat', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/countries targeted/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays coercion incidents stat', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/coercion incidents/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays hostage diplomacy stat', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/hostage diplomacy/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays trade restrictions stat', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/trade restrictions/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays firm responses stat', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/firm responses/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Severity Distribution ──────────────────────────────
  it('renders severity level summary cards', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText('Severe').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Significant').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Low').length).toBeGreaterThanOrEqual(1);
  });

  it('displays country count for each severity level', () => {
    render(<DiplomaticCoercionTracker />);
    const countryLabels = screen.getAllByText(/countries?$/);
    expect(countryLabels.length).toBeGreaterThanOrEqual(4);
  });

  // ── View Toggle ────────────────────────────────────────
  it('renders all view toggle buttons', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByText('Country Overview')).toBeTruthy();
    expect(screen.getByText('Coercion Tactics')).toBeTruthy();
    expect(screen.getByText('Response Outcomes')).toBeTruthy();
  });

  it('Country Overview is active by default', () => {
    render(<DiplomaticCoercionTracker />);
    const btn = screen.getByText('Country Overview').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Coercion Tactics switches view', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Coercion Tactics'));
    const btn = screen.getByText('Coercion Tactics').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Response Outcomes switches view', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Response Outcomes'));
    const btn = screen.getByText('Response Outcomes').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  // ── Search & Filters ──────────────────────────────────
  it('renders search input', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByPlaceholderText('Search countries, incidents, triggers...')).toBeTruthy();
  });

  it('renders severity filter dropdown', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByLabelText('Filter by severity')).toBeTruthy();
  });

  it('renders coercion type filter dropdown', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByLabelText('Filter by coercion type')).toBeTruthy();
  });

  it('search filters country list', () => {
    render(<DiplomaticCoercionTracker />);
    const input = screen.getByPlaceholderText('Search countries, incidents, triggers...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No countries match your filters')).toBeTruthy();
  });

  it('search for Australia shows results', () => {
    render(<DiplomaticCoercionTracker />);
    const input = screen.getByPlaceholderText('Search countries, incidents, triggers...');
    fireEvent.change(input, { target: { value: 'Australia' } });
    expect(screen.queryByText('No countries match your filters')).toBeFalsy();
  });

  // ── Country Cards ──────────────────────────────────────
  it('renders country cards in overview', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
  });

  it('clicking a country card expands it', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking expanded country card collapses it', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanded card shows coercion incident details', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    // Should show Trigger and Coercion Incidents sections
    expect(screen.getAllByText(/Trigger/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Coercion Incidents/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanded card shows source attribution', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    // Should show "Source:" for incident citations
    expect(screen.getAllByText(/Source:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Coercion Tactics View ──────────────────────────────
  it('tactics view shows coercion type headers', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Coercion Tactics'));
    expect(screen.getAllByText('Trade Restrictions').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hostage Diplomacy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Diplomatic Threats').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Economic Leverage').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Political Interference').length).toBeGreaterThanOrEqual(1);
  });

  it('tactics view shows country counts per tactic', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Coercion Tactics'));
    const countLabels = screen.getAllByText(/\d+ countr/);
    expect(countLabels.length).toBeGreaterThan(0);
  });

  it('tactics view shows year for incidents', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Coercion Tactics'));
    // Should show year labels (e.g., 2020, 2021, etc.)
    expect(screen.getAllByText(/20\d\d:/).length).toBeGreaterThan(0);
  });

  // ── Response Outcomes View ─────────────────────────────
  it('outcomes view shows response categories', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Response Outcomes'));
    expect(screen.getAllByText('Firm Stance').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mixed Response').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Conceded').length).toBeGreaterThanOrEqual(1);
  });

  it('outcomes view shows country details under response categories', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Response Outcomes'));
    // Should show "Trigger:" for at least one country
    expect(screen.getAllByText(/Trigger:/).length).toBeGreaterThan(0);
  });

  // ── Clipboard ──────────────────────────────────────────
  it('renders copy report button', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByLabelText('Copy intelligence report to clipboard')).toBeTruthy();
  });

  it('clicking copy button copies report', async () => {
    render(<DiplomaticCoercionTracker />);
    const btn = screen.getByLabelText('Copy intelligence report to clipboard');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const lastCall = vi.mocked(navigator.clipboard.writeText).mock.calls;
    const text = lastCall[lastCall.length - 1][0];
    expect(text).toContain('DIPLOMATIC COERCION TRACKER');
    expect(text).toContain('Countries targeted');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Data Integrity ─────────────────────────────────────
  it('displays real country names', () => {
    render(<DiplomaticCoercionTracker />);
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    expect(container.textContent).toContain('Australia');
    expect(container.textContent).toContain('Canada');
    expect(container.textContent).toContain('Lithuania');
  });

  it('has at least 15 countries tracked', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThanOrEqual(15);
  });

  it('has at least 40 total coercion incidents', () => {
    render(<DiplomaticCoercionTracker />);
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    // Stats bar shows "N coercion incidents"
    const match = container.textContent.match(/(\d+)\s+coercion incidents/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(40);
  });

  it('tracks hostage diplomacy specifically', () => {
    render(<DiplomaticCoercionTracker />);
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    // References to documented hostage diplomacy (Two Michaels, Gui Minhai)
    fireEvent.click(screen.getByText('Coercion Tactics'));
    expect(container.textContent).toContain('Hostage Diplomacy');
  });

  it('includes documented trade restriction cases', () => {
    render(<DiplomaticCoercionTracker />);
    fireEvent.click(screen.getByText('Coercion Tactics'));
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    expect(container.textContent).toContain('Trade Restrictions');
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media', () => {
    render(<DiplomaticCoercionTracker />);
    // Expand all to check sources
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) fireEvent.click(expandBtns[0]);
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('cgtn');
    expect(text).not.toContain('global times');
    expect(text).not.toContain("people's daily");
    expect(text).not.toContain('china daily');
  });

  // ── Footer ─────────────────────────────────────────────
  it('renders footer with data attribution', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getAllByText(/Tier 1-2 sources only/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThanOrEqual(1);
  });

  it('footer shows cross-reference counts', () => {
    render(<DiplomaticCoercionTracker />);
    const container = screen.getByRole('region', { name: 'Diplomatic Coercion Tracker' });
    expect(container.textContent).toContain('international responses');
    expect(container.textContent).toContain('sanctions');
    expect(container.textContent).toContain('police stations');
    expect(container.textContent).toContain('political prisoners');
  });

  // ── Accessibility ──────────────────────────────────────
  it('search input has aria-label', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByLabelText('Search diplomatic coercion data')).toBeTruthy();
  });

  it('view toggle group has aria-label', () => {
    render(<DiplomaticCoercionTracker />);
    expect(screen.getByRole('group', { name: 'View options' })).toBeTruthy();
  });

  it('view buttons have aria-pressed attribute', () => {
    render(<DiplomaticCoercionTracker />);
    const viewBtns = screen.getByRole('group', { name: 'View options' }).querySelectorAll('button');
    viewBtns.forEach(btn => {
      expect(btn.getAttribute('aria-pressed')).toBeTruthy();
    });
  });

  it('country cards have aria-expanded attribute', () => {
    render(<DiplomaticCoercionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
