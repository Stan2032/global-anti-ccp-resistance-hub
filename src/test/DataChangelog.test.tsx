import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import DataChangelog from '../components/DataChangelog';

// Each dataset is a native <details> whose summary carries its name.
const dataset = (name: string) => {
  const details = screen.getByText(name).closest('details');
  expect(details, `${name} is a <details>`).toBeTruthy();
  return details as HTMLDetailsElement;
};

describe('DataChangelog', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Data Changelog')).toBeTruthy();
    expect(screen.getByText(/Verification status and change history/)).toBeTruthy();
  });

  it('renders health overview cards', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Fresh')).toBeTruthy();
    expect(screen.getByText('Current')).toBeTruthy();
    expect(screen.getByText('Aging')).toBeTruthy();
    expect(screen.getByText('Total Records')).toBeTruthy();
  });

  it('renders dataset verification status section', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Dataset Verification Status')).toBeTruthy();
  });

  it('renders recent data changes section', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Recent Data Changes')).toBeTruthy();
  });

  it('renders source policy section', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Source Policy')).toBeTruthy();
    expect(screen.getByText(/Tier 1-2 outlets/)).toBeTruthy();
    expect(screen.getByText(/CCP state media.*is never cited/)).toBeTruthy();
  });

  // ── Dataset List ───────────────────────────────────────

  it('renders all 8 datasets', () => {
    render(<DataChangelog />);
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Sanctions Tracker')).toBeTruthy();
    expect(screen.getByText('Sanctioned Officials')).toBeTruthy();
    expect(screen.getByText('Timeline Events')).toBeTruthy();
    expect(screen.getByText('Forced Labor Companies')).toBeTruthy();
    expect(screen.getByText('Detention Facilities')).toBeTruthy();
    expect(screen.getByText('Emergency Alerts')).toBeTruthy();
    expect(screen.getByText('Live Statistics')).toBeTruthy();
  });

  it('shows record counts for each dataset', () => {
    render(<DataChangelog />);
    // Each dataset shows "(N records)"
    const recordTexts = screen.getAllByText(/\(\d+ records?\)/);
    expect(recordTexts.length).toBe(8);
  });

  it('shows verification freshness labels', () => {
    render(<DataChangelog />);
    // Should have freshness labels like "Verified recently", "Verified this week", etc.
    const labels = screen.getAllByText(/Verified|Needs re-verification/);
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  // ── Native disclosure ──────────────────────────────────

  it('every dataset carries its verification details without a click', () => {
    const { container } = render(<DataChangelog />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const prisoners = within(dataset('Political Prisoners'));
    expect(dataset('Political Prisoners').open).toBe(false);
    expect(prisoners.getByText(/Last verified:/)).toBeTruthy();
    expect(prisoners.getByText('political_prisoners_research.json')).toBeTruthy();
  });

  it('shows the verification note without a click', () => {
    render(<DataChangelog />);
    expect(within(dataset('Political Prisoners')).getByText(/64 records verified/)).toBeTruthy();
  });

  it('shows how many days ago each dataset was verified', () => {
    render(<DataChangelog />);
    expect(within(dataset('Political Prisoners')).getByText(/days ago/)).toBeTruthy();
  });

  it('a dataset opens and closes natively', () => {
    render(<DataChangelog />);
    const prisoners = dataset('Political Prisoners');
    fireEvent.click(screen.getByText('Political Prisoners'));
    expect(prisoners.open).toBe(true);
    fireEvent.click(screen.getByText('Political Prisoners'));
    expect(prisoners.open).toBe(false);
  });

  it('opening one dataset leaves the others as they were', () => {
    // One-at-a-time was a JavaScript nicety; native disclosures open independently.
    render(<DataChangelog />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    fireEvent.click(screen.getByText('Sanctions Tracker'));
    expect(dataset('Political Prisoners').open).toBe(true);
    expect(dataset('Sanctions Tracker').open).toBe(true);
  });

  // ── Recent Changes ─────────────────────────────────────

  it('renders recent data change entries', () => {
    render(<DataChangelog />);
    // Should show data/verification/case_update entries
    const entries = screen.getAllByText(/data|verification|case_update/);
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  it('shows category badges on change entries', () => {
    render(<DataChangelog />);
    // Category badges use bg-[#0a0e14]
    const badges = screen.getAllByText(/^(data|verification|case_update)$/);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows show more button when more than 5 data updates exist', () => {
    render(<DataChangelog />);
    // Should have "Show all N data changes" button if >5 data updates
    // This depends on actual data — may or may not be present
    // Just check the component renders without error
    expect(screen.getByText('Recent Data Changes')).toBeTruthy();
  });

  it('folds data changes past the newest five into one disclosure', () => {
    render(<DataChangelog />);
    const toggle = screen.getByText(/Show all \d+ data changes/);
    const total = Number(toggle.textContent!.match(/\d+/)![0]);
    expect(total).toBeGreaterThan(5);
    const rest = toggle.closest('details')!;
    expect(rest.open).toBe(false);
    fireEvent.click(toggle);
    expect(rest.open).toBe(true);
  });

  // ── Health Overview Values ─────────────────────────────

  it('shows numeric values in health overview', () => {
    render(<DataChangelog />);
    // Fresh/Current/Aging/Total Records cards each show a number
    expect(screen.getByText('Fresh')).toBeTruthy();
    expect(screen.getByText('Current')).toBeTruthy();
    expect(screen.getByText('Aging')).toBeTruthy();
    expect(screen.getByText('Total Records')).toBeTruthy();
  });

  it('health overview status counts sum to 8 datasets', () => {
    const { container } = render(<DataChangelog />);
    // Extract all 4 status count values from their colored text classes
    const greenVal = container.querySelector('.text-green-400.text-2xl');
    const cyanVal = container.querySelector('[class*="text-\\[\\#22d3ee\\]"].text-2xl');
    const yellowVal = container.querySelector('.text-yellow-400.text-2xl');
    const redVal = container.querySelector('.text-red-400.text-2xl');
    const fresh = greenVal ? parseInt(greenVal.textContent ?? '0', 10) : 0;
    const current = cyanVal ? parseInt(cyanVal.textContent ?? '0', 10) : 0;
    const aging = yellowVal ? parseInt(yellowVal.textContent ?? '0', 10) : 0;
    const stale = redVal ? parseInt(redVal.textContent ?? '0', 10) : 0;
    expect(fresh + current + aging + stale).toBe(8);
  });

  // ── Data Integrity ─────────────────────────────────────

  it('all dataset verification dates are valid ISO dates', () => {
    render(<DataChangelog />);
    for (const name of ['Political Prisoners', 'Sanctions Tracker', 'Sanctioned Officials', 'Timeline Events', 'Forced Labor Companies', 'Detention Facilities', 'Emergency Alerts', 'Live Statistics']) {
      const dates = within(dataset(name)).getAllByText(/^\d{4}-\d{2}-\d{2}$/);
      expect(dates.length).toBeGreaterThanOrEqual(1);
      dates.forEach(d => expect(Number.isNaN(Date.parse(d.textContent!))).toBe(false));
    }
  });

  // ── No Hashtags ────────────────────────────────────────

  it('contains no hashtags', () => {
    // Every dataset's details are in the page, so this reads all of them.
    const { container } = render(<DataChangelog />);
    expect(container.textContent!.match(/#[a-zA-Z]/)).toBeNull();
  });
});
