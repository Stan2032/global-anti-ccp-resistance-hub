import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import GenocideLegalFramework from '../components/GenocideLegalFramework';
import { cardsIn, expectDisclosureSections, inSection } from './helpers/disclosure';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

const violationCard = (article: string) =>
  cardsIn('Legal Violations').find(c => c.querySelector('summary')!.textContent!.includes(article))!;

describe('GenocideLegalFramework', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  it('renders section with correct aria-label', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByLabelText('Genocide Legal Framework')).toBeTruthy();
  });

  it('renders heading with title', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('Genocide Legal Framework')).toBeTruthy();
  });

  it('renders description with data counts', () => {
    render(<GenocideLegalFramework />);
    const desc = screen.getByText(/Mapping \d+ documented CCP violations/);
    expect(desc).toBeTruthy();
    expect(desc.textContent).toMatch(/prisoners/);
    expect(desc.textContent).toMatch(/facilities/);
    expect(desc.textContent).toMatch(/companies/);
  });

  // === STATS BAR ===
  it('displays stats bar with violation count', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('Violations Documented')).toBeTruthy();
    expect(screen.getAllByText('Critical').length).toBeGreaterThan(0);
    expect(screen.getByText('Legal Instruments')).toBeTruthy();
    expect(screen.getAllByText('Genocide Recognitions').length).toBeGreaterThan(0);
    expect(screen.getByText('Evidence Points')).toBeTruthy();
  });

  it('shows correct number of legal instruments', () => {
    render(<GenocideLegalFramework />);
    const stat = screen.getByText('Legal Instruments').parentElement!;
    expect(within(stat).getByText('5')).toBeTruthy(); // 5 non-'all' categories
  });

  it('shows genocide recognition count', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('10')).toBeTruthy(); // 10 recognitions
  });

  // === SECTIONS ===
  it('renders both views as native disclosure sections', () => {
    render(<GenocideLegalFramework />);
    expectDisclosureSections(['Legal Violations', 'Genocide Recognitions']);
  });

  it('keeps the violations search inside the Legal Violations section', () => {
    render(<GenocideLegalFramework />);
    expect(inSection('Legal Violations').getByLabelText('Search legal violations')).toBeTruthy();
  });

  it('shows the Genocide Recognitions section without interaction', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    expect(section.getByText(/formal genocide recognitions/)).toBeTruthy();
    expect(section.getByText('United States')).toBeTruthy();
    expect(section.getByText('Canada')).toBeTruthy();
  });

  // === FILTERS ===
  it('renders search input', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByLabelText('Search legal violations')).toBeTruthy();
  });

  it('renders legal instrument filter dropdown', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByLabelText('Filter by legal instrument')).toBeTruthy();
  });

  it('filters violations by search query', () => {
    render(<GenocideLegalFramework />);
    const search = screen.getByLabelText('Search legal violations');
    fireEvent.change(search, { target: { value: 'Xinjiang' } });
    const countText = screen.getByText(/of \d+ violations shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match![1])).toBeLessThan(12);
    expect(parseInt(match![1])).toBeGreaterThan(0);
  });

  it('filters by legal instrument dropdown', () => {
    render(<GenocideLegalFramework />);
    const select = screen.getByLabelText('Filter by legal instrument');
    fireEvent.change(select, { target: { value: 'genocide' } });
    const countText = screen.getByText(/of \d+ violations shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match![1])).toBeGreaterThan(0);
    expect(parseInt(match![1])).toBeLessThan(12);
  });

  // === CATEGORY BUTTONS ===
  it('renders category filter buttons', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByLabelText('Filter Genocide Convention')).toBeTruthy();
    expect(screen.getByLabelText('Filter Convention against Torture')).toBeTruthy();
    expect(screen.getByLabelText('Filter ICCPR')).toBeTruthy();
    expect(screen.getByLabelText('Filter Forced Labor Conventions')).toBeTruthy();
    expect(screen.getByLabelText('Filter Minority Rights')).toBeTruthy();
  });

  it('toggles category when clicking category button', () => {
    render(<GenocideLegalFramework />);
    const btn = screen.getByLabelText('Filter Genocide Convention');
    fireEvent.click(btn);
    const countText = screen.getByText(/of \d+ violations shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match![1])).toBeGreaterThan(0);
    expect(parseInt(match![1])).toBeLessThan(12);
    // Click again to reset
    fireEvent.click(btn);
    const resetText = screen.getByText(/of \d+ violations shown/);
    const resetMatch = resetText.textContent.match(/^(\d+)/);
    expect(parseInt(resetMatch![1])).toBeGreaterThanOrEqual(10);
  });

  // === VIOLATION CARDS ===
  it('renders violation cards with article numbers', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('Article II(a)')).toBeTruthy();
    expect(screen.getByText('Article II(b)')).toBeTruthy();
  });

  it('shows severity badges on violation cards', () => {
    render(<GenocideLegalFramework />);
    const critical = screen.getAllByText('critical');
    expect(critical.length).toBeGreaterThan(0);
  });

  it('shows evidence point counts on each card', () => {
    render(<GenocideLegalFramework />);
    const evidenceTexts = screen.getAllByText(/\d+ evidence points/);
    expect(evidenceTexts.length).toBeGreaterThan(0);
  });

  it('shows recognition count on each card', () => {
    render(<GenocideLegalFramework />);
    const recognitionTexts = screen.getAllByText(/\d+ recognitions/);
    expect(recognitionTexts.length).toBeGreaterThan(0);
  });

  // === NATIVE DISCLOSURE ===
  it('violation cards are native disclosures, closed to start', () => {
    const { container } = render(<GenocideLegalFramework />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const cards = cardsIn('Legal Violations');
    expect(cards.length).toBeGreaterThanOrEqual(10);
    cards.forEach(c => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
    });
  });

  it('every violation card carries its legal text and documented CCP actions without a click', () => {
    render(<GenocideLegalFramework />);
    cardsIn('Legal Violations').forEach(c => {
      expect(within(c).getByText('Legal Text')).toBeTruthy();
      expect(within(c).getByText('Documented CCP Actions')).toBeTruthy();
    });
  });

  it('every violation card carries its key findings without a click', () => {
    render(<GenocideLegalFramework />);
    cardsIn('Legal Violations').forEach(c => expect(within(c).getByText('Key Findings')).toBeTruthy());
  });

  it('every violation card carries its cross-referenced evidence without a click', () => {
    render(<GenocideLegalFramework />);
    cardsIn('Legal Violations').forEach(c => expect(within(c).getByText('Cross-Referenced Evidence')).toBeTruthy());
  });

  it('the Article II(a) card carries its legal and evidentiary sources without a click', () => {
    render(<GenocideLegalFramework />);
    expect(within(violationCard('Article II(a)')).getByText('Legal and Evidentiary Sources')).toBeTruthy();
  });

  it('a violation card opens and closes natively', () => {
    render(<GenocideLegalFramework />);
    const card = violationCard('Article II(a)');
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  // === COPY REPORT ===
  it('renders copy report button', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByLabelText('Copy legal framework report')).toBeTruthy();
  });

  it('copies report to clipboard', async () => {
    render(<GenocideLegalFramework />);
    const copyBtn = screen.getByLabelText('Copy legal framework report');
    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
    const clipText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(clipText).toContain('CCP VIOLATIONS OF INTERNATIONAL LAW');
    expect(clipText).toContain('CC BY 4.0');
  });

  it('shows copied confirmation', async () => {
    render(<GenocideLegalFramework />);
    const copyBtn = screen.getByLabelText('Copy legal framework report');
    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
    });
  });

  // === GENOCIDE RECOGNITIONS VIEW ===
  it('shows all recognition countries', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    expect(section.getByText('United States')).toBeTruthy();
    expect(section.getByText('Canada')).toBeTruthy();
    expect(section.getByText('Netherlands')).toBeTruthy();
    expect(section.getByText('France')).toBeTruthy();
  });

  it('shows Uyghur Tribunal in recognitions', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    expect(section.getByText('Uyghur Tribunal')).toBeTruthy();
  });

  it('shows China Tribunal in recognitions', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    expect(section.getByText('China Tribunal')).toBeTruthy();
  });

  it('shows recognition years', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    const years = section.getAllByText('2021');
    expect(years.length).toBeGreaterThan(0);
  });

  it('shows recognition types', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    expect(section.getByText('Genocide declaration')).toBeTruthy();
    expect(section.getAllByText('Parliamentary motion').length).toBeGreaterThan(0);
  });

  // === FOOTER ===
  it('renders footer with data source counts', () => {
    render(<GenocideLegalFramework />);
    const footerTexts = screen.getAllByText(/political prisoners/);
    expect(footerTexts.length).toBeGreaterThan(0);
  });

  it('renders Tier 1-2 source attribution', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText(/Tier 1-2 verified/)).toBeTruthy();
  });

  it('renders CC BY 4.0 license', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText(/CC BY 4\.0/)).toBeTruthy();
  });

  // === DATA INTEGRITY ===
  it('has at least 10 legal violations documented', () => {
    render(<GenocideLegalFramework />);
    const countText = screen.getByText(/of \d+ violations shown/);
    const match = countText.textContent.match(/of (\d+)/);
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(10);
  });

  it('has all 5 legal instrument categories represented', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getAllByText(/Genocide Convention/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Convention against Torture/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ICCPR/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Forced Labor/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Minority Rights/).length).toBeGreaterThanOrEqual(1);
  });

  it('cross-references at least 3 evidence types', () => {
    // Across the framework, not per card: Article II(a) draws on two.
    render(<GenocideLegalFramework />);
    const types = new Set(cardsIn('Legal Violations').flatMap(c =>
      [...within(c).getByText('Cross-Referenced Evidence').nextElementSibling!.children]
        .map(chip => chip.textContent!.split(':')[0])));
    expect(types.size).toBeGreaterThanOrEqual(3);
  });

  it('has at least 8 genocide recognition entries', () => {
    render(<GenocideLegalFramework />);
    const section = inSection('Genocide Recognitions');
    const countText = section.getByText(/\d+ formal genocide recognitions/);
    const match = countText.textContent.match(/(\d+)/);
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(8);
  });

  // === COMBINED SEARCH + CATEGORY FILTER ===
  it('combined category + search filters narrow results', () => {
    render(<GenocideLegalFramework />);
    const select = screen.getByLabelText('Filter by legal instrument');
    fireEvent.change(select, { target: { value: 'genocide' } });
    const search = screen.getByLabelText('Search legal violations');
    fireEvent.change(search, { target: { value: 'zzz_nonexistent_term' } });
    const countText = screen.getByText(/of \d+ violations shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match![1])).toBe(0);
  });

  // === SPECIFIC LEGAL CONTENT ===
  it('includes Genocide Convention articles II(a) through II(e)', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('Article II(a)')).toBeTruthy();
    expect(screen.getByText('Article II(b)')).toBeTruthy();
    expect(screen.getByText('Article II(c)')).toBeTruthy();
    expect(screen.getByText('Article II(d)')).toBeTruthy();
    expect(screen.getByText('Article II(e)')).toBeTruthy();
  });

  it('includes Convention against Torture articles', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getAllByText('Article 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Article 3')).toBeTruthy();
  });

  it('includes ICCPR articles', () => {
    render(<GenocideLegalFramework />);
    expect(screen.getByText('Article 9')).toBeTruthy();
    expect(screen.getByText('Article 18')).toBeTruthy();
    expect(screen.getByText('Article 19')).toBeTruthy();
  });
});
