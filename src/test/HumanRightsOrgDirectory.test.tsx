import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HumanRightsOrgDirectory from '../components/HumanRightsOrgDirectory';
import { dataApi } from '../services/dataApi';

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
    render(<HumanRightsOrgDirectory />);
    const orgs = dataApi.getHumanRightsOrgs();
    // Should show at least one known org
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    // All orgs rendered as expandable buttons
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
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
    render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    expect(uyghurBtn!.getAttribute('aria-pressed')).toBe('true');
    // Should only show Uyghur orgs now
    const uyghurOrgs = dataApi.getHumanRightsOrgsByFocus('Uyghur');
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
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
    render(<HumanRightsOrgDirectory />);
    const legalBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent === 'Legal'
    );
    fireEvent.click(legalBtn!);
    expect(legalBtn!.getAttribute('aria-pressed')).toBe('true');
    const legalOrgs = dataApi.getHumanRightsOrgsByType('Legal');
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
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
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'Amnesty' } });
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
    expect(expandable.length).toBeLessThan(dataApi.getHumanRightsOrgs().length);
  });

  it('search is case-insensitive', () => {
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(input, { target: { value: 'amnesty' } });
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
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
    render(<HumanRightsOrgDirectory />);
    const uyghurBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Uyghur')
    );
    fireEvent.click(uyghurBtn!);
    fireEvent.click(screen.getByText('Clear'));
    // All orgs should be shown again
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBe(dataApi.getHumanRightsOrgs().length);
  });

  // --- Expand/Collapse ---

  it('all orgs collapsed by default', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('clicking an org expands its details', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('expanded org shows key work', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Key Work')).toBeTruthy();
  });

  it('expanded org shows website link', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Website')).toBeTruthy();
  });

  it('expanded org shows donate link', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Donate')).toBeTruthy();
  });

  it('clicking expanded org collapses it', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanding different org collapses previous one', () => {
    render(<HumanRightsOrgDirectory />);
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
    render(<HumanRightsOrgDirectory />);
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

  it('org rows have aria-expanded and aria-controls', () => {
    render(<HumanRightsOrgDirectory />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-controls')).toBeTruthy();
    });
  });

  it('search input is accessible', () => {
    render(<HumanRightsOrgDirectory />);
    const input = screen.getByLabelText('Search organizations');
    expect(input.tagName).toBe('INPUT');
    expect((input as HTMLInputElement).type).toBe('text');
  });
});
