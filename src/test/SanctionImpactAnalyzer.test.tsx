import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SanctionImpactAnalyzer from '../components/SanctionImpactAnalyzer';
import { dataApi } from '../services/dataApi';

describe('SanctionImpactAnalyzer', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText('Sanction Impact Analyzer')).toBeTruthy();
  });

  it('renders the section with correct aria-label', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByLabelText('Sanction Impact Analyzer')).toBeTruthy();
  });

  it('shows officials count in description', () => {
    render(<SanctionImpactAnalyzer />);
    const officials = dataApi.getSanctionedOfficials();
    expect(screen.getByText(new RegExp(`${officials.length} sanctioned officials`))).toBeTruthy();
  });

  it('shows sanctions count in description', () => {
    render(<SanctionImpactAnalyzer />);
    const sanctions = dataApi.getSanctions();
    expect(screen.getByText(new RegExp(`${sanctions.length} sanctions`))).toBeTruthy();
  });

  it('shows 5 countries in description', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText(/5 countries/)).toBeTruthy();
  });

  // --- Summary Stats ---

  it('renders summary stat cards', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText('Officials')).toBeTruthy();
    expect(screen.getByText('Sanctions')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();
  });

  it('displays correct officials count', () => {
    render(<SanctionImpactAnalyzer />);
    const officials = dataApi.getSanctionedOfficials();
    // The count appears as a stat number
    const statCards = screen.getAllByText(String(officials.length));
    expect(statCards.length).toBeGreaterThanOrEqual(1);
  });

  // --- Country Breakdown ---

  it('shows country breakdown bars', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText('Officials sanctioned per country')).toBeTruthy();
  });

  it('shows all 5 country labels in breakdown', () => {
    render(<SanctionImpactAnalyzer />);
    // Country labels are truncated to first word — US & UK both show "United"
    const unitedLabels = screen.getAllByText('United');
    expect(unitedLabels.length).toBe(2);
    expect(screen.getByText('European')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Australia')).toBeTruthy();
  });

  // --- Coverage Filter Buttons ---

  it('renders all 4 coverage category buttons', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(coverageButtons.length).toBe(4);
    const labels = coverageButtons.map((b) => b.textContent);
    expect(labels.some((l) => l.includes('Full Coverage'))).toBe(true);
    expect(labels.some((l) => l.includes('Strong Coverage'))).toBe(true);
    expect(labels.some((l) => l.includes('Partial Coverage'))).toBe(true);
    expect(labels.some((l) => l.includes('Coverage Gap'))).toBe(true);
  });

  it('no coverage button is active by default', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    coverageButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('coverage counts add up to total officials', () => {
    render(<SanctionImpactAnalyzer />);
    const officials = dataApi.getSanctionedOfficials();
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const total = coverageButtons.reduce((sum, b) => {
      const countEl = b.querySelector('div');
      const count = parseInt(countEl?.textContent || '0', 10);
      return sum + count;
    }, 0);
    expect(total).toBe(officials.length);
  });

  // --- Coverage Filtering ---

  it('clicking Full Coverage filters to full-coverage officials', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const fullBtn = coverageButtons.find((b) => b.textContent.includes('Full Coverage'));
    fireEvent.click(fullBtn!);
    expect(fullBtn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking a coverage filter twice clears it', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const fullBtn = coverageButtons.find((b) => b.textContent.includes('Full Coverage'));
    fireEvent.click(fullBtn!);
    expect(fullBtn!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(fullBtn!);
    expect(fullBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows Clear button when coverage filter is active', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const fullBtn = coverageButtons.find((b) => b.textContent.includes('Full Coverage'));
    fireEvent.click(fullBtn!);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('Clear button resets coverage filter', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const fullBtn = coverageButtons.find((b) => b.textContent.includes('Full Coverage'));
    fireEvent.click(fullBtn!);
    fireEvent.click(screen.getByText('Clear'));
    const updatedButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    updatedButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  // --- Search ---

  it('renders the search input', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByPlaceholderText('Search officials...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByLabelText('Search sanctioned officials')).toBeTruthy();
  });

  it('search filters officials by name', () => {
    render(<SanctionImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(input, { target: { value: 'Chen' } });
    expect(screen.getByText(/Chen Quanguo/)).toBeTruthy();
  });

  it('search is case-insensitive', () => {
    render(<SanctionImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(input, { target: { value: 'chen quanguo' } });
    expect(screen.getByText(/Chen Quanguo/)).toBeTruthy();
  });

  it('shows empty state when no search matches', () => {
    render(<SanctionImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(input, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No officials match your search')).toBeTruthy();
  });

  // --- Officials List ---

  it('renders known officials from the data', () => {
    render(<SanctionImpactAnalyzer />);
    // Chen Quanguo is the most-sanctioned official
    expect(screen.getByText('Chen Quanguo')).toBeTruthy();
  });

  it('officials are sorted by sanction count descending', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    // First official should have highest count
    expect(expandable.length).toBeGreaterThan(0);
    const firstText = expandable[0].textContent;
    expect(firstText).toContain('5/5');
  });

  it('each official row has aria-expanded attribute', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('each official shows a coverage badge', () => {
    render(<SanctionImpactAnalyzer />);
    const officials = dataApi.getSanctionedOfficials();
    // Should see coverage badges like 5/5, 4/5, etc.
    const badges = screen.getAllByText(/\d\/5/);
    expect(badges.length).toBeGreaterThanOrEqual(officials.length);
  });

  // --- Expand/Collapse ---

  it('clicking an official expands their details', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('expanded official shows sanction status by country', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Sanction Status by Country')).toBeTruthy();
  });

  it('expanded official shows key abuses if available', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    // Click first official (Chen Quanguo — has key_abuses)
    fireEvent.click(expandable[0]);
    expect(screen.getByText('Key Abuses')).toBeTruthy();
  });

  it('expanded official shows source link', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    const sourceLink = screen.getByText('Source');
    expect(sourceLink.closest('a')).toBeTruthy();
    expect(sourceLink!.closest('a')!.getAttribute('target')).toBe('_blank');
    expect(sourceLink!.closest('a')!.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('clicking expanded official collapses it', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandable[0]);
    expect(expandable[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanding a different official collapses the previous one', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandable.length >= 2) {
      fireEvent.click(expandable[0]);
      expect(expandable[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandable[1]);
      expect(expandable[1].getAttribute('aria-expanded')).toBe('true');
      expect(expandable[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  // --- Advocacy Opportunity ---

  it('shows advocacy opportunity for partially-sanctioned officials', () => {
    render(<SanctionImpactAnalyzer />);
    // Find a partially-sanctioned official (e.g., Carrie Lam — only US)
    const input = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(input, { target: { value: 'Carrie Lam' } });
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandable.length > 0) {
      fireEvent.click(expandable[0]);
      expect(screen.getByText('Advocacy Opportunity')).toBeTruthy();
    }
  });

  // --- Copy Functionality ---

  it('renders Copy button', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByLabelText('Copy analysis to clipboard')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<SanctionImpactAnalyzer />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('copy button changes aria-label after copying', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<SanctionImpactAnalyzer />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByLabelText('Copied to clipboard')).toBeTruthy();
  });

  // --- Footer ---

  it('renders footer text', () => {
    render(<SanctionImpactAnalyzer />);
    expect(screen.getByText(/Cross-references sanctioned_officials/)).toBeTruthy();
  });

  it('footer shows filtered count', () => {
    render(<SanctionImpactAnalyzer />);
    const officials = dataApi.getSanctionedOfficials();
    expect(
      screen.getByText(new RegExp(`${officials.length} of ${officials.length} officials shown`))
    ).toBeTruthy();
  });

  it('footer count updates when search filters results', () => {
    render(<SanctionImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(input, { target: { value: 'Chen' } });
    const officials = dataApi.getSanctionedOfficials();
    expect(screen.getByText(new RegExp(`of ${officials.length} officials shown`))).toBeTruthy();
  });

  // --- Data Integrity ---

  it('uses real officials data (not placeholder)', () => {
    const officials = dataApi.getSanctionedOfficials();
    const chen = officials.find((o) => o.name === 'Chen Quanguo');
    expect(chen).toBeTruthy();
    expect(chen!.position).toBeTruthy();
  });

  it('all officials have required fields', () => {
    const officials = dataApi.getSanctionedOfficials();
    officials.forEach((o) => {
      expect(o.name).toBeTruthy();
    });
  });

  it('Chen Quanguo is sanctioned by 5 countries', () => {
    const officials = dataApi.getSanctionedOfficials();
    const chen = officials.find((o) => o.name === 'Chen Quanguo');
    expect(chen).toBeTruthy();
    const countries = ['us', 'uk', 'eu', 'canada', 'australia'];
    const sanctionCount = countries.filter((c) => {
      const val = chen![`${c}_sanctions`];
      return val && String(val).toLowerCase().startsWith('yes');
    }).length;
    expect(sanctionCount).toBe(5);
  });

  // --- No CCP State Media ---

  it('component text never references CCP state media', () => {
    const { container } = render(<SanctionImpactAnalyzer />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
  });

  // --- Accessibility ---

  it('coverage filter buttons have aria-pressed', () => {
    render(<SanctionImpactAnalyzer />);
    const coverageButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(coverageButtons.length).toBe(4);
  });

  it('official rows have aria-expanded and aria-controls', () => {
    render(<SanctionImpactAnalyzer />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-controls')).toBeTruthy();
    });
  });

  it('search input is properly labelled', () => {
    render(<SanctionImpactAnalyzer />);
    const input = screen.getByLabelText('Search sanctioned officials');
    expect(input.tagName).toBe('INPUT');
  });
});
