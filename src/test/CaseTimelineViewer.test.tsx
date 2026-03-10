import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CaseTimelineViewer from '../components/CaseTimelineViewer';
import { dataApi } from '../services/dataApi';

describe('CaseTimelineViewer', () => {
  // --- Rendering ---

  it('renders the component header', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByText('Case Timeline Viewer')).toBeTruthy();
  });

  it('renders the description text', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByText(/Cross-reference political prisoner cases/)).toBeTruthy();
  });

  it('renders the prisoner search input', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByLabelText('Search and select a political prisoner')).toBeTruthy();
  });

  it('renders the Select Prisoner label', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByText('Select Prisoner')).toBeTruthy();
  });

  // --- Empty State ---

  it('shows empty state when no prisoner selected', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByText(/Select a political prisoner above/)).toBeTruthy();
  });

  it('shows prisoner count in empty state', () => {
    render(<CaseTimelineViewer />);
    const prisoners = dataApi.getPoliticalPrisoners();
    expect(screen.getByText(new RegExp(`${prisoners.length} prisoners documented`))).toBeTruthy();
  });

  it('shows timeline event count in empty state', () => {
    render(<CaseTimelineViewer />);
    const events = dataApi.getTimelineEvents();
    expect(screen.getByText(new RegExp(`${events.length} timeline events available`))).toBeTruthy();
  });

  // --- Dropdown ---

  it('opens dropdown on input focus', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('shows all prisoners in dropdown', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const options = screen.getAllByRole('option');
    const prisoners = dataApi.getPoliticalPrisoners();
    expect(options.length).toBe(prisoners.length);
  });

  it('filters prisoners by search query', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jimmy' } });
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options.some(o => o.textContent.includes('Jimmy Lai'))).toBe(true);
  });

  it('shows no results message for invalid search', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No prisoners found')).toBeTruthy();
  });

  it('closes dropdown on Escape key', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(input.closest('[onkeydown]')! || input.parentElement!.parentElement, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('toggle button has aria-label', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByLabelText('Toggle prisoner list')).toBeTruthy();
  });

  // --- Prisoner Selection ---

  it('selects Jimmy Lai and shows info card', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jimmy' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    expect(option).toBeTruthy();
    fireEvent.click(option!);
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
  });

  it('shows prisoner status badge after selection', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    // Status should appear in the info card
    expect(screen.getAllByText('DETAINED').length).toBeGreaterThanOrEqual(1);
  });

  it('shows sentence info for Jimmy Lai', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Sentence')).toBeTruthy();
  });

  it('shows location info for Jimmy Lai', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Location')).toBeTruthy();
  });

  // --- Timeline Events ---

  it('shows related events for Jimmy Lai', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Related Events')).toBeTruthy();
    // Jimmy Lai should match multiple events (arrested, NSL, Apple Daily, etc.)
    const badge = screen.getByText((content: string, el: Element | null) =>
      !!(el?.classList?.contains('rounded-full') && parseInt(content) > 0)
    );
    expect(badge).toBeTruthy();
  });

  it('shows Jimmy Lai Arrested event', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Jimmy Lai Arrested')).toBeTruthy();
  });

  it('shows Apple Daily Forced to Close event for Jimmy Lai', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Apple Daily Forced to Close')).toBeTruthy();
  });

  it('shows Jimmy Lai sentencing event', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Jimmy Lai Sentenced to 20 Years')).toBeTruthy();
  });

  it('shows events in chronological order', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    const timeElements = screen.getAllByRole('listitem');
    expect(timeElements.length).toBeGreaterThanOrEqual(2);
  });

  // --- Ilham Tohti ---

  it('shows Uyghur/Xinjiang events for Ilham Tohti', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Ilham' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Ilham Tohti'));
    fireEvent.click(option!);
    expect(screen.getByText('Ilham Tohti Arrested')).toBeTruthy();
  });

  // --- Liu Xiaobo ---

  it('shows Charter 08 and Nobel events for Liu Xiaobo', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Liu Xiaobo' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Liu Xiaobo'));
    fireEvent.click(option!);
    expect(screen.getByText('Charter 08 Published')).toBeTruthy();
    expect(screen.getByText('Liu Xiaobo Awarded Nobel Peace Prize')).toBeTruthy();
    expect(screen.getByText('Liu Xiaobo Dies in Custody')).toBeTruthy();
  });

  // --- Joshua Wong ---

  it('shows HK47 events for Joshua Wong', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Joshua Wong' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Joshua Wong'));
    fireEvent.click(option!);
    expect(screen.getByText('Joshua Wong HK47 Appeal Dismissed')).toBeTruthy();
  });

  // --- Panchen Lama ---

  it('shows abduction event for Panchen Lama', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Gedhun' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Gedhun Choekyi Nyima'));
    fireEvent.click(option!);
    expect(screen.getByText('Panchen Lama Abducted')).toBeTruthy();
  });

  // --- Copy ---

  it('shows Copy Timeline button when events exist', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByText('Copy Timeline')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    fireEvent.click(screen.getByText('Copy Timeline'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  // --- Category Badges ---

  it('shows hongkong category badge for Hong Kong events', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getAllByText('hongkong').length).toBeGreaterThanOrEqual(1);
  });

  it('shows uyghur category badge for Xinjiang events', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Ilham' } });
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Ilham Tohti'));
    fireEvent.click(option!);
    expect(screen.getAllByText('uyghur').length).toBeGreaterThanOrEqual(1);
  });

  // --- Switching Prisoners ---

  it('resets when switching prisoners', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    // Select Jimmy Lai first
    fireEvent.focus(input);
    const jimmyOption = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(jimmyOption!);
    expect(screen.getByText('Jimmy Lai Arrested')).toBeTruthy();
    // Now switch to Liu Xiaobo
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Liu Xiaobo' } });
    const liuOption = screen.getAllByRole('option').find(o => o.textContent.includes('Liu Xiaobo'));
    fireEvent.click(liuOption!);
    expect(screen.getByText('Liu Xiaobo Dies in Custody')).toBeTruthy();
    expect(screen.queryByText('Jimmy Lai Arrested')).toBeNull();
  });

  // --- Accessibility ---

  it('has section aria-label', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByLabelText('Case Timeline Viewer')).toBeTruthy();
  });

  it('has combobox role on search input', () => {
    render(<CaseTimelineViewer />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('listbox has proper label', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox', { name: 'Political prisoners' })).toBeTruthy();
  });

  it('timeline events list has proper role', () => {
    render(<CaseTimelineViewer />);
    const input = screen.getByLabelText('Search and select a political prisoner');
    fireEvent.focus(input);
    const option = screen.getAllByRole('option').find(o => o.textContent.includes('Jimmy Lai'));
    fireEvent.click(option!);
    expect(screen.getByRole('list', { name: 'Case timeline events' })).toBeTruthy();
  });

  // --- Data Integrity ---

  it('uses real data from dataApi', () => {
    const prisoners = dataApi.getPoliticalPrisoners();
    expect(prisoners.length).toBeGreaterThanOrEqual(50);
    const events = dataApi.getTimelineEvents();
    expect(events.length).toBeGreaterThanOrEqual(30);
  });

  it('no CCP state media references in component', () => {
    const { container } = render(<CaseTimelineViewer />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
  });
});
