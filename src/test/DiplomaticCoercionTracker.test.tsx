import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DiplomaticCoercionTracker from '../components/DiplomaticCoercionTracker';
import { cardsIn, disclosureFor, expectDisclosureSections, inSection } from './helpers/disclosure';

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

  // ── Sections ──────────────────────────────────────────
  it('renders every view as a native disclosure section', () => {
    render(<DiplomaticCoercionTracker />);
    expectDisclosureSections(['Country Overview', 'Coercion Tactics', 'Response Outcomes']);
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
  it('renders country cards as native disclosures', () => {
    render(<DiplomaticCoercionTracker />);
    const cards = cardsIn('Country Overview');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => expect(card.firstElementChild?.tagName).toBe('SUMMARY'));
  });

  it('a country card opens and closes natively', () => {
    render(<DiplomaticCoercionTracker />);
    const [card] = cardsIn('Country Overview');
    expect(card.open).toBe(false);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  it('every country card carries its incidents without a click', () => {
    render(<DiplomaticCoercionTracker />);
    cardsIn('Country Overview').forEach(card => expect(card.textContent).toMatch(/Coercion Incidents/));
  });

  it('every country card cites a source for its incidents', () => {
    render(<DiplomaticCoercionTracker />);
    cardsIn('Country Overview').forEach(card => expect(card.textContent).toMatch(/Source:/));
  });


  // ── Coercion Tactics View ──────────────────────────────
  it('tactics view shows coercion type headers', () => {
    render(<DiplomaticCoercionTracker />);
    const section = inSection('Coercion Tactics');
    expect(section.getAllByText('Trade Restrictions').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Hostage Diplomacy').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Diplomatic Threats').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Economic Leverage').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Political Interference').length).toBeGreaterThanOrEqual(1);
  });

  it('tactics view shows country counts per tactic', () => {
    render(<DiplomaticCoercionTracker />);
    const section = inSection('Coercion Tactics');
    const countLabels = section.getAllByText(/\d+ countr/);
    expect(countLabels.length).toBeGreaterThan(0);
  });

  it('tactics view shows year for incidents', () => {
    render(<DiplomaticCoercionTracker />);
    const section = inSection('Coercion Tactics');
    // Should show year labels (e.g., 2020, 2021, etc.)
    expect(section.getAllByText(/20\d\d:/).length).toBeGreaterThan(0);
  });

  // ── Response Outcomes View ─────────────────────────────
  it('outcomes view shows response categories', () => {
    render(<DiplomaticCoercionTracker />);
    const section = inSection('Response Outcomes');
    expect(section.getAllByText('Firm Stance').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Mixed Response').length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText('Conceded').length).toBeGreaterThanOrEqual(1);
  });

  it('outcomes view shows country details under response categories', () => {
    render(<DiplomaticCoercionTracker />);
    const section = inSection('Response Outcomes');
    // Should show "Trigger:" for at least one country
    expect(section.getAllByText(/Trigger:/).length).toBeGreaterThan(0);
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
    expect(cardsIn('Country Overview').length).toBeGreaterThanOrEqual(15);
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
    // References to documented hostage diplomacy (Two Michaels, Gui Minhai)
    expect(disclosureFor('Coercion Tactics').textContent).toContain('Hostage Diplomacy');
  });

  it('includes documented trade restriction cases', () => {
    render(<DiplomaticCoercionTracker />);
    expect(disclosureFor('Coercion Tactics').textContent).toContain('Trade Restrictions');
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media', () => {
    render(<DiplomaticCoercionTracker />);
    // Every card's sources are in the page, not only the first one opened.
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

  it('uses native disclosure cards, not JavaScript-only expanders', () => {
    const { container } = render(<DiplomaticCoercionTracker />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });
});
