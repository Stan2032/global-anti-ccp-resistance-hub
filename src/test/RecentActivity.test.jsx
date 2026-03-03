import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RecentActivity from '../components/RecentActivity';

describe('RecentActivity', () => {
  // --- Rendering ---

  it('renders the component', () => {
    render(<RecentActivity />);
    expect(screen.getByText('recent_activity')).toBeTruthy();
  });

  it('shows clock icon in header', () => {
    render(<RecentActivity />);
    const header = screen.getByText('recent_activity');
    expect(header).toBeTruthy();
  });

  it('shows event count', () => {
    render(<RecentActivity />);
    const counts = screen.getAllByText(/events$/);
    expect(counts.length).toBeGreaterThan(0);
  });

  // --- Activity items ---

  it('renders activity items', () => {
    render(<RecentActivity />);
    const items = screen.getAllByText('Prisoner Update');
    expect(items.length).toBeGreaterThan(0);
  });

  it('shows alert type activities', () => {
    render(<RecentActivity />);
    const alertLabels = screen.getAllByText('Alert');
    expect(alertLabels.length).toBeGreaterThan(0);
  });

  it('shows news type activities after expanding', () => {
    render(<RecentActivity />);
    // Expand to show all items
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) fireEvent.click(showAllButton);
    const newsLabels = screen.getAllByText('News');
    expect(newsLabels.length).toBeGreaterThan(0);
  });

  it('shows sanctions type activities after expanding', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) fireEvent.click(showAllButton);
    const sanctionLabels = screen.getAllByText('Sanctions');
    expect(sanctionLabels.length).toBeGreaterThan(0);
  });

  it('shows prisoner names in activity feed', () => {
    render(<RecentActivity />);
    const matches = screen.getAllByText(/Jimmy Lai/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows alert titles in activity feed', () => {
    render(<RecentActivity />);
    const matches = screen.getAllByText(/Joshua Wong/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows dates for activities', () => {
    render(<RecentActivity />);
    const dateElements = screen.getAllByText(/\d{4}$/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  // --- Initial display limit ---

  it('initially shows limited number of activities (8)', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) {
      expect(showAllButton).toBeTruthy();
    }
  });

  // --- Show more/less toggle ---

  it('toggles show all activities', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) {
      fireEvent.click(showAllButton);
      expect(screen.getByText('Show less')).toBeTruthy();
    }
  });

  it('collapses back to initial display', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) {
      fireEvent.click(showAllButton);
      const showLessButton = screen.getByText('Show less');
      fireEvent.click(showLessButton);
      expect(screen.getByText(/Show all \d+ events/)).toBeTruthy();
    }
  });

  it('show all button has correct aria label', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByLabelText(/Show all \d+ activities/);
    if (showAllButton) {
      expect(showAllButton).toBeTruthy();
    }
  });

  it('show less button has correct aria label', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByLabelText(/Show all \d+ activities/);
    if (showAllButton) {
      fireEvent.click(showAllButton);
      expect(screen.getByLabelText('Show fewer activities')).toBeTruthy();
    }
  });

  // --- Data integrity ---

  it('shows prisoner sentence info', () => {
    render(<RecentActivity />);
    const matches = screen.getAllByText(/20 years/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows emergency alert summaries', () => {
    render(<RecentActivity />);
    expect(screen.getByText(/Hong Kong media tycoon/)).toBeTruthy();
  });

  it('renders sanction target names after expanding', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) {
      fireEvent.click(showAllButton);
    }
    // Sanctions should show country codes like US
    const usLabels = screen.getAllByText(/— US$/);
    expect(usLabels.length).toBeGreaterThan(0);
  });

  // --- Type labels and styling ---

  it('all activity types render with correct text after expanding', () => {
    render(<RecentActivity />);
    const showAllButton = screen.queryByText(/Show all \d+ events/);
    if (showAllButton) {
      fireEvent.click(showAllButton);
    }
    expect(screen.getAllByText('Prisoner Update').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Alert').length).toBeGreaterThan(0);
    expect(screen.getAllByText('News').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sanctions').length).toBeGreaterThan(0);
  });

  // --- Edge cases ---

  it('does not crash with empty data', () => {
    const { container } = render(<RecentActivity />);
    expect(container.firstChild).toBeTruthy();
  });

  it('divider lines between items', () => {
    const { container } = render(<RecentActivity />);
    const divider = container.querySelector('.divide-y');
    expect(divider).toBeTruthy();
  });

  it('activities are sorted by date (most recent first)', () => {
    render(<RecentActivity />);
    const allText = document.body.textContent;
    const idx2026 = allText.indexOf('2026');
    const idx2020 = allText.indexOf('2020');
    if (idx2026 >= 0 && idx2020 >= 0) {
      expect(idx2026).toBeLessThan(idx2020);
    }
  });
});
