import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCalendar from '../components/EventCalendar';

describe('EventCalendar', () => {
  // --- Structure ---

  it('renders the heading', () => {
    render(<EventCalendar />);
    expect(screen.getByText('Resistance Calendar')).toBeTruthy();
  });

  it('renders the month legend', () => {
    render(<EventCalendar />);
    expect(screen.getByText('Commemoration')).toBeTruthy();
    expect(screen.getByText('Protest')).toBeTruthy();
    expect(screen.getByText('Solidarity')).toBeTruthy();
    expect(screen.getByText('Awareness')).toBeTruthy();
  });

  it('renders the "All Events" month filter button', () => {
    render(<EventCalendar />);
    expect(screen.getByText('All Events')).toBeTruthy();
  });

  it('renders month filter buttons', () => {
    render(<EventCalendar />);
    expect(screen.getByText('January')).toBeTruthy();
    expect(screen.getByText('June')).toBeTruthy();
    expect(screen.getByText('December')).toBeTruthy();
  });

  it('renders event cards', () => {
    render(<EventCalendar />);
    expect(screen.getByText('Tibetan Uprising Day')).toBeTruthy();
    expect(screen.getByText('Tiananmen Square Massacre Anniversary')).toBeTruthy();
  });

  // --- Filtering ---

  it('filters events when a month is selected', () => {
    render(<EventCalendar />);
    fireEvent.click(screen.getByText('June'));
    expect(screen.getByText('Tiananmen Square Massacre Anniversary')).toBeTruthy();
    expect(screen.queryByText('Taiwan New Year Solidarity')).toBeNull();
  });

  it('shows all events when "All Events" is clicked after filtering', () => {
    render(<EventCalendar />);
    fireEvent.click(screen.getByText('June'));
    fireEvent.click(screen.getByText('All Events'));
    expect(screen.getByText('Taiwan New Year Solidarity')).toBeTruthy();
    expect(screen.getByText('Tiananmen Square Massacre Anniversary')).toBeTruthy();
  });

  it('filters to March events correctly', () => {
    render(<EventCalendar />);
    fireEvent.click(screen.getByText('March'));
    expect(screen.getByText('Tibetan Uprising Day')).toBeTruthy();
    expect(screen.getByText('2008 Tibet Protests Anniversary')).toBeTruthy();
  });

  // --- Event Content ---

  it('renders event descriptions', () => {
    render(<EventCalendar />);
    expect(screen.getByText(/Anniversary of the 1959 Tibetan uprising/)).toBeTruthy();
  });

  it('renders suggested actions section', () => {
    render(<EventCalendar />);
    expect(screen.getAllByText('Suggested Actions:').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Copy All Dates button', () => {
    render(<EventCalendar />);
    expect(screen.getByText(/Copy All Dates/)).toBeTruthy();
  });
});
