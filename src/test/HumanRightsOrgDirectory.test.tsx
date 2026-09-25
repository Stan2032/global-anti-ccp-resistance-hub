import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import HumanRightsOrgDirectory from '../components/HumanRightsOrgDirectory';
import { dataApi } from '../services/dataApi';

// Every card is a native <details>. Fails on none, so a check over each card
// cannot pass on an empty list.
const cards = (container: HTMLElement) => {
  const all = [...container.querySelectorAll('details')];
  expect(all.length, 'cards render as <details>').toBeGreaterThan(0);
  return all;
};

describe('HumanRightsOrgDirectory', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByText('Human Rights Organization Directory')).toBeTruthy();
  });

  it('renders the section with correct aria-label', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByLabelText('Human Rights Organization Directory')).toBeTruthy();
  });

  it('shows organization count in description', () => {
    render(<HumanRightsOrgDirectory />);
    const orgs = dataApi.getHumanRightsOrgs();
    expect(screen.getByText(new RegExp(`${orgs.length} verified organizations`))).toBeTruthy();
  });

  it('renders organization list', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const orgs = dataApi.getHumanRightsOrgs();
    // Should show at least one known org
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    // All orgs rendered as expandable buttons
    const expandable = cards(container);
    expect(expandable.length).toBe(orgs.length);
  });

  // --- dataApi methods ---

  it('dataApi.getHumanRightsOrgs returns all orgs', () => {
    const orgs = dataApi.getHumanRightsOrgs();
    expect(orgs.length).toBe(49);
    orgs.forEach((o) => {
      expect(o.organization).toBeTruthy();
    });
  });

  it('dataApi.getHumanRightsOrgsByFocus filters by focus area', () => {
    const uyghur = dataApi.getHumanRightsOrgsByFocus('Uyghur');
    expect(uyghur.length).toBeGreaterThan(0);
    uyghur.forEach((o) => {
      expect(o.focus_area).toBe('Uyghur');
    });
  });

  it('dataApi.getHumanRightsOrgsByType filters by type', () => {
    const research = dataApi.getHumanRightsOrgsByType('Research');
    expect(research.length).toBeGreaterThan(0);
    research.forEach((o) => {
      expect(o.org_type!.toLowerCase()).toContain('research');
    });
  });

  it('dataApi.searchHumanRightsOrgs searches across fields', () => {
    const results = dataApi.searchHumanRightsOrgs('Amnesty');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((o) => o.organization.includes('Amnesty'))).toBe(true);
  });

  it('dataApi.globalSearch includes human_rights_orgs', () => {
    const results = dataApi.globalSearch('Uyghur');
    expect(results.human_rights_orgs).toBeDefined();
    expect(results.human_rights_orgs.length).toBeGreaterThan(0);
  });

  it('dataApi.getDatasetSummary includes human_rights_orgs', () => {
    const summary = dataApi.getDatasetSummary();
    expect(summary.datasets.human_rights_orgs).toBeDefined();
    expect(summary.datasets.human_rights_orgs.count).toBe(49);
  });

  // --- Focus Area Filter ---

  it('renders focus area filter buttons', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByText('Filter by focus area')).toBeTruthy();
    // Uyghur should be present as a filter
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    expect(uyghurBtn).toBeTruthy();
  });

  it('no focus filter active by default', () => {
    render(<HumanRightsOrgDirectory />);
    const pressedButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') === 'true'
    );
    expect(pressedButtons.length).toBe(0);
  });

  it('clicking focus filter shows only that focus area', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    expect(uyghurBtn!.getAttribute('aria-pressed')).toBe('true');
    // Should only show Uyghur orgs now
    const uyghurOrgs = dataApi.getHumanRightsOrgsByFocus('Uyghur');
    const expandable = cards(container);
    expect(expandable.length).toBe(uyghurOrgs.length);
  });

  it('clicking same focus filter again clears it', () => {
    render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    expect(uyghurBtn!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(uyghurBtn!);
    expect(uyghurBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  // --- Type Filter ---

  it('renders type filter buttons', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByText('Filter by type')).toBeTruthy();
    // Advocacy type should exist
    const advocacyBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent === 'Advocacy'
    );
    expect(advocacyBtn).toBeTruthy();
  });

  it('clicking type filter filters the list', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const legalBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent === 'Legal'
    );
    fireEvent.click(legalBtn!);
    expect(legalBtn!.getAttribute('aria-pressed')).toBe('true');
    const legalOrgs = dataApi.getHumanRightsOrgsByType('Legal');
    const expandable = cards(container);
    expect(expandable.length).toBe(legalOrgs.length);
  });

  // --- Search ---

  it('renders search input', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByPlaceholderText('Search organizations...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByLabelText('Search organizations')).toBeTruthy();
  });

  it('search filters results by organization name', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'Amnesty' } });
    const expandable = cards(container);
    expect(expandable.length).toBeGreaterThan(0);
    expect(expandable.length).toBeLessThan(dataApi.getHumanRightsOrgs().length);
  });

  it('search is case-insensitive', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'amnesty' } });
    const expandable = cards(container);
    expect(expandable.length).toBeGreaterThan(0);
  });

  it('no-results state shows message', () => {
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'zzznonexistent999' } });
    expect(screen.getByText('No organizations match your search')).toBeTruthy();
  });

  // --- Combined Filters ---

  it('shows Clear button when filter is active', () => {
    render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('Clear button resets all filters', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    fireEvent.click(screen.getByText('Clear'));
    // All orgs should be shown again
    const expandable = cards(container);
    expect(expandable.length).toBe(dataApi.getHumanRightsOrgs().length);
  });

  // --- Native disclosure ---

  it('every org is a native disclosure, closed to start', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const all = cards(container);
    expect(all.length).toBe(dataApi.getHumanRightsOrgs().length);
    all.forEach((c) => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
    });
  });

  it('an org opens and closes natively', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const [first] = cards(container);
    fireEvent.click(first.querySelector('summary')!);
    expect(first.open).toBe(true);
    fireEvent.click(first.querySelector('summary')!);
    expect(first.open).toBe(false);
  });

  it('an org shows its key work, website and donate links without a click', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const first = within(cards(container)[0]);
    expect(first.getByText('Key Work')).toBeTruthy();
    expect(first.getByText('Website')).toBeTruthy();
    expect(first.getByText('Donate')).toBeTruthy();
  });



  it('opening one org leaves the others as they were', () => {
    // One-at-a-time was a JavaScript nicety; native disclosures open independently.
    const { container } = render(<HumanRightsOrgDirectory />);
    const [first, second] = cards(container);
    fireEvent.click(first.querySelector('summary')!);
    fireEvent.click(second.querySelector('summary')!);
    expect(first.open).toBe(true);
    expect(second.open).toBe(true);
  });

  // --- External Links ---

  it('external links open in new tab with noopener', () => {
    render(<HumanRightsOrgDirectory />);
    const external = screen.getAllByRole('link').filter(l => l.getAttribute('target') === '_blank');
    expect(external.length).toBeGreaterThan(0);
    external.forEach((link) => {
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });

  // --- Copy to Clipboard ---

  it('renders Copy button', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<HumanRightsOrgDirectory />);
    expect(screen.getByLabelText('Copy directory to clipboard')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<HumanRightsOrgDirectory />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('copy button changes aria-label after copying', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<HumanRightsOrgDirectory />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByLabelText('Copied to clipboard')).toBeTruthy();
  });

  // --- Footer ---

  it('renders footer with count', () => {
    render(<HumanRightsOrgDirectory />);
    const orgs = dataApi.getHumanRightsOrgs();
    expect(
      screen.getByText(new RegExp(`${orgs.length} of ${orgs.length} organizations shown`))
    ).toBeTruthy();
  });

  it('footer count updates when filtered', () => {
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'Amnesty' } });
    const orgs = dataApi.getHumanRightsOrgs();
    expect(screen.getByText(new RegExp(`of ${orgs.length} organizations shown`))).toBeTruthy();
  });

  // --- Data Integrity ---

  it('all orgs have required fields', () => {
    const orgs = dataApi.getHumanRightsOrgs();
    orgs.forEach((o) => {
      expect(o.organization).toBeTruthy();
      expect(o.focus_area).toBeTruthy();
    });
  });

  it('org focus areas are from known set', () => {
    const validFocus = ['Uyghur', 'Tibet', 'Hong Kong', 'General China', 'Legal', 'Media', 'Research', 'Taiwan'];
    const orgs = dataApi.getHumanRightsOrgs();
    orgs.forEach((o) => {
      expect(validFocus).toContain(o.focus_area);
    });
  });

  it('credibility values are valid', () => {
    const orgs = dataApi.getHumanRightsOrgs();
    orgs.forEach((o) => {
      if (o.credibility) {
        expect(['High', 'Medium', 'Low']).toContain(o.credibility);
      }
    });
  });

  // --- No CCP State Media ---

  it('component text never references CCP state media', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
    expect(text).not.toContain('china daily');
  });

  // --- Accessibility ---

  it('uses native disclosures, not JavaScript-only expanders', () => {
    const { container } = render(<HumanRightsOrgDirectory />);
    expect(cards(container).length).toBe(dataApi.getHumanRightsOrgs().length);
    expect(container.querySelectorAll('[aria-expanded], [aria-controls]')).toHaveLength(0);
  });

  it('search input is accessible', () => {
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByLabelText('Search organizations');
    expect(input.tagName).toBe('INPUT');
    expect((input as HTMLInputElement).type).toBe('text');
  });
});
