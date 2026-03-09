import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OverseasPoliceStationTracker from '../components/OverseasPoliceStationTracker';
import { dataApi } from '../services/dataApi';

describe('OverseasPoliceStationTracker', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByText('CCP Overseas Police Stations')).toBeTruthy();
  });

  it('renders the section with correct aria-label', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByLabelText('Overseas Police Station Tracker')).toBeTruthy();
  });

  it('shows station count in description', () => {
    render(<OverseasPoliceStationTracker />);
    const stations = dataApi.getPoliceStations();
    expect(screen.getByText(new RegExp(`${stations.length} documented stations`))).toBeTruthy();
  });

  it('shows country count in description', () => {
    render(<OverseasPoliceStationTracker />);
    const countries = new Set(dataApi.getPoliceStations().map((s) => s.country));
    expect(screen.getByText(new RegExp(`${countries.size} countries`))).toBeTruthy();
  });

  // --- dataApi methods ---

  it('dataApi.getPoliceStations returns all stations', () => {
    const stations = dataApi.getPoliceStations();
    expect(stations.length).toBe(30);
    stations.forEach((s) => {
      expect(s.country).toBeTruthy();
      expect(s.city).toBeTruthy();
    });
  });

  it('dataApi.getPoliceStationsByCountry filters by country', () => {
    const uk = dataApi.getPoliceStationsByCountry('United Kingdom');
    expect(uk.length).toBeGreaterThan(0);
    uk.forEach((s) => {
      expect(s.country).toBe('United Kingdom');
    });
  });

  it('dataApi.getPoliceStationsByCountry returns empty for unknown country', () => {
    const none = dataApi.getPoliceStationsByCountry('Atlantis');
    expect(none.length).toBe(0);
  });

  it('dataApi.getPoliceStationsByStatus filters by status', () => {
    const closed = dataApi.getPoliceStationsByStatus('CLOSED');
    expect(closed.length).toBeGreaterThan(0);
    closed.forEach((s) => {
      expect(s.status).toBe('CLOSED');
    });
  });

  it('dataApi.getPoliceStationsByStatus is case-insensitive', () => {
    const closed = dataApi.getPoliceStationsByStatus('closed');
    expect(closed.length).toBeGreaterThan(0);
    closed.forEach((s) => {
      expect(s.status).toBe('CLOSED');
    });
  });

  it('dataApi.searchPoliceStations searches across fields', () => {
    const results = dataApi.searchPoliceStations('London');
    expect(results.length).toBeGreaterThan(0);
  });

  it('dataApi.globalSearch includes police_stations', () => {
    const results = dataApi.globalSearch('London');
    expect(results.police_stations).toBeDefined();
    expect(results.police_stations.length).toBeGreaterThan(0);
  });

  it('dataApi.getDatasetSummary includes police_stations', () => {
    const summary = dataApi.getDatasetSummary();
    expect(summary.datasets.police_stations).toBeDefined();
    expect(summary.datasets.police_stations.count).toBe(30);
  });

  // --- Status Summary ---

  it('renders status filter buttons', () => {
    render(<OverseasPoliceStationTracker />);
    // Status labels appear in the filter buttons
    const pressedButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(pressedButtons.length).toBe(4);
  });

  it('shows correct status counts', () => {
    render(<OverseasPoliceStationTracker />);
    const closed = dataApi.getPoliceStationsByStatus('CLOSED');
    // The count appears as a stat number
    const closedCountElements = screen.getAllByText(String(closed.length));
    expect(closedCountElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders status distribution bar', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByLabelText('Status distribution')).toBeTruthy();
  });

  // --- Status Filtering ---

  it('no status filter active by default', () => {
    render(<OverseasPoliceStationTracker />);
    const pressedButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') === 'true'
    );
    expect(pressedButtons.length).toBe(0);
  });

  it('clicking status filter shows only that status', () => {
    render(<OverseasPoliceStationTracker />);
    const closedBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Closed')
    );
    fireEvent.click(closedBtn!);
    expect(closedBtn!.getAttribute('aria-pressed')).toBe('true');
    const closed = dataApi.getPoliceStationsByStatus('CLOSED');
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBe(closed.length);
  });

  it('clicking same status filter again clears it', () => {
    render(<OverseasPoliceStationTracker />);
    const closedBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Closed')
    );
    fireEvent.click(closedBtn!);
    expect(closedBtn!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(closedBtn!);
    expect(closedBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows Clear button when filter is active', () => {
    render(<OverseasPoliceStationTracker />);
    const closedBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Closed')
    );
    fireEvent.click(closedBtn!);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('Clear button resets filter', () => {
    render(<OverseasPoliceStationTracker />);
    const closedBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Closed')
    );
    fireEvent.click(closedBtn!);
    fireEvent.click(screen.getByText('Clear'));
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBe(dataApi.getPoliceStations().length);
  });

  // --- Search ---

  it('renders search input', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByPlaceholderText('Search by country, city, response...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByLabelText('Search police stations')).toBeTruthy();
  });

  it('search filters results by country', () => {
    render(<OverseasPoliceStationTracker />);
    const input = screen.getByPlaceholderText('Search by country, city, response...');
    fireEvent.change(input, { target: { value: 'Canada' } });
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
    expect(expandable.length).toBeLessThan(dataApi.getPoliceStations().length);
  });

  it('search is case-insensitive', () => {
    render(<OverseasPoliceStationTracker />);
    const input = screen.getByPlaceholderText('Search by country, city, response...');
    fireEvent.change(input, { target: { value: 'canada' } });
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
  });

  it('no-results state shows message', () => {
    render(<OverseasPoliceStationTracker />);
    const input = screen.getByPlaceholderText('Search by country, city, response...');
    fireEvent.change(input, { target: { value: 'zzznonexistent999' } });
    expect(screen.getByText('No stations match your search')).toBeTruthy();
  });

  // --- Expand/Collapse ---

  it('all stations collapsed by default', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('clicking a station expands its details', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('expanded station shows government response', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Government Response')).toBeTruthy();
  });

  it('expanded station shows latest news', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Latest News')).toBeTruthy();
  });

  it('expanded station shows source link', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Source')).toBeTruthy();
  });

  it('clicking expanded station collapses it', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanding different station collapses previous one', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandable.length >= 2) {
      fireEvent.click(expandable[0]);
      expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandable[1]);
      expect(expandable[0].getAttribute('aria-expanded')).toBe('false');
      expect(expandable[1].getAttribute('aria-expanded')).toBe('true');
    }
  });

  // --- External Links ---

  it('external links open in new tab with noopener', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      if (link.getAttribute('target') === '_blank') {
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      }
    });
  });

  // --- Copy to Clipboard ---

  it('renders Copy button', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getByLabelText('Copy station data to clipboard')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<OverseasPoliceStationTracker />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('copy button changes aria-label after copying', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<OverseasPoliceStationTracker />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByLabelText('Copied to clipboard')).toBeTruthy();
  });

  // --- Footer ---

  it('renders footer with count', () => {
    render(<OverseasPoliceStationTracker />);
    const stations = dataApi.getPoliceStations();
    expect(
      screen.getByText(new RegExp(`${stations.length} of ${stations.length} stations shown`))
    ).toBeTruthy();
  });

  it('footer count updates when filtered', () => {
    render(<OverseasPoliceStationTracker />);
    const input = screen.getByPlaceholderText('Search by country, city, response...');
    fireEvent.change(input, { target: { value: 'Canada' } });
    const stations = dataApi.getPoliceStations();
    expect(screen.getByText(new RegExp(`of ${stations.length} stations shown`))).toBeTruthy();
  });

  it('footer mentions transnational repression', () => {
    render(<OverseasPoliceStationTracker />);
    expect(screen.getAllByText(/transnational repression/).length).toBeGreaterThanOrEqual(1);
  });

  // --- Data Integrity ---

  it('all stations have required fields', () => {
    const stations = dataApi.getPoliceStations();
    stations.forEach((s) => {
      expect(s.country).toBeTruthy();
      expect(s.city).toBeTruthy();
      expect(s.status).toBeTruthy();
    });
  });

  it('station statuses are from known set', () => {
    const validStatuses = ['CLOSED', 'UNDER INVESTIGATION', 'OPERATING', 'UNKNOWN'];
    const stations = dataApi.getPoliceStations();
    stations.forEach((s) => {
      expect(validStatuses).toContain(s.status);
    });
  });

  it('stations span multiple countries', () => {
    const stations = dataApi.getPoliceStations();
    const countries = new Set(stations.map((s) => s.country));
    expect(countries.size).toBeGreaterThanOrEqual(20);
  });

  // --- Accessibility ---

  it('station rows have aria-expanded and aria-controls', () => {
    render(<OverseasPoliceStationTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-controls')).toBeTruthy();
    });
  });

  it('search input is accessible', () => {
    render(<OverseasPoliceStationTracker />);
    const input = screen.getByLabelText('Search police stations');
    expect(input.tagName).toBe('INPUT');
    expect((input as HTMLInputElement).type).toBe('text');
  });

  // --- No CCP State Media ---

  it('component text never references CCP state media', () => {
    const { container } = render(<OverseasPoliceStationTracker />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
    expect(text).not.toContain('china daily');
  });
});
