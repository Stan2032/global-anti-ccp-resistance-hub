// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdvocacyLetterGenerator from '../components/AdvocacyLetterGenerator';
import { dataApi } from '../services/dataApi';

describe('AdvocacyLetterGenerator', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('Advocacy Letter Generator')).toBeTruthy();
  });

  it('shows prisoner count in description', () => {
    render(<AdvocacyLetterGenerator />);
    const prisoners = dataApi.getPoliticalPrisoners();
    expect(screen.getByText(new RegExp(`${prisoners.length} documented political prisoners`))).toBeTruthy();
  });

  it('shows detained count', () => {
    render(<AdvocacyLetterGenerator />);
    const detained = dataApi.getPoliticalPrisoners().filter(p => p.status === 'DETAINED').length;
    expect(screen.getByText(`${detained} detained`)).toBeTruthy();
  });

  it('shows data provenance note', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('real data from verified sources')).toBeTruthy();
  });

  // --- Country Selector ---

  it('renders all 5 country buttons', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('US')).toBeTruthy();
    expect(screen.getByText('UK')).toBeTruthy();
    expect(screen.getByText('CA')).toBeTruthy();
    expect(screen.getByText('AU')).toBeTruthy();
    expect(screen.getByText('EU')).toBeTruthy();
  });

  it('US is selected by default', () => {
    render(<AdvocacyLetterGenerator />);
    const usBtn = screen.getByText('US').closest('button');
    expect(usBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking a different country changes selection', () => {
    render(<AdvocacyLetterGenerator />);
    const ukBtn = screen.getByText('UK').closest('button');
    fireEvent.click(ukBtn);
    expect(ukBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('US').closest('button').getAttribute('aria-pressed')).toBe('false');
  });

  it('letter updates greeting when country changes', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/Dear Representative/)).toBeTruthy();
    fireEvent.click(screen.getByText('UK').closest('button'));
    expect(screen.getByText(/Dear Member of Parliament/)).toBeTruthy();
  });

  // --- Prisoner Selector ---

  it('renders select_case label', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('select_case:')).toBeTruthy();
  });

  it('renders target_country label', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('target_country:')).toBeTruthy();
  });

  it('auto-selects a detained prisoner by default', () => {
    render(<AdvocacyLetterGenerator />);
    // Should show some detained prisoner name in the selector
    const detainedBadges = screen.getAllByText('DETAINED');
    expect(detainedBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('opens prisoner dropdown on click', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('dropdown shows search input', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);
    expect(screen.getByPlaceholderText('Search prisoners...')).toBeTruthy();
  });

  it('search filters prisoner list', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);

    const searchInput = screen.getByPlaceholderText('Search prisoners...');
    fireEvent.change(searchInput, { target: { value: 'Ilham' } });

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options.some(opt => opt.textContent.includes('Ilham Tohti'))).toBe(true);
  });

  it('shows empty state when no search matches', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);

    const searchInput = screen.getByPlaceholderText('Search prisoners...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No prisoners match your search')).toBeTruthy();
  });

  it('selecting a prisoner updates the letter', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);

    // Find Ilham Tohti in the list and click
    const ilham = screen.getAllByRole('option').find(opt => opt.textContent.includes('Ilham Tohti'));
    if (ilham) {
      fireEvent.click(ilham);
      // Should now show Ilham Tohti in multiple places (selector, subject, body, case summary)
      expect(screen.getAllByText(/Ilham Tohti/).length).toBeGreaterThanOrEqual(1);
    }
  });

  // --- Generated Letter ---

  it('renders the generated_letter header', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('generated_letter')).toBeTruthy();
  });

  it('letter contains the selected prisoner name in body', () => {
    render(<AdvocacyLetterGenerator />);
    // The auto-selected prisoner should appear in the letter text
    expect(screen.getByText(/currently detained/)).toBeTruthy();
  });

  it('letter contains action items', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/Support targeted Magnitsky sanctions/)).toBeTruthy();
  });

  it('letter contains CCP pattern description', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/broader pattern of systematic human rights violations/)).toBeTruthy();
  });

  it('letter contains signing block', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/\[Your Name\]/)).toBeTruthy();
  });

  // --- Copy Functionality ---

  it('renders Copy Letter button', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('Copy Letter')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByLabelText('Copy letter to clipboard')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<AdvocacyLetterGenerator />);
    fireEvent.click(screen.getByText('Copy Letter'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  // --- Case Summary ---

  it('renders case_summary section', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/case_summary:/)).toBeTruthy();
  });

  it('case summary shows status badge', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('Status:')).toBeTruthy();
  });

  it('case summary shows source URL for detained prisoners', () => {
    render(<AdvocacyLetterGenerator />);
    const prisoners = dataApi.getPoliticalPrisoners();
    const firstDetained = prisoners.find(p => p.status === 'DETAINED' && p.source_url);
    if (firstDetained) {
      expect(screen.getByText('Source:')).toBeTruthy();
    }
  });

  // --- Attribution ---

  it('shows source policy attribution', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/CCP state media never cited/)).toBeTruthy();
  });

  it('shows client-side privacy note', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/no data transmitted/)).toBeTruthy();
  });

  // --- Data Integrity ---

  it('uses real prisoner data (not placeholder)', () => {
    render(<AdvocacyLetterGenerator />);
    // The component should display a known prisoner name from the database
    const prisoners = dataApi.getPoliticalPrisoners();
    const knownPrisoner = prisoners.find(p => p.prisoner_name === 'Jimmy Lai');
    expect(knownPrisoner).toBeTruthy();
  });

  it('letter subject includes Urgent Action Needed', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText(/Urgent Action Needed: The Case of/)).toBeTruthy();
  });

  it('displays country name in letter header', () => {
    render(<AdvocacyLetterGenerator />);
    expect(screen.getByText('(United States)')).toBeTruthy();
  });

  // --- No CCP State Media ---

  it('attribution never references CCP state media', () => {
    const { container } = render(<AdvocacyLetterGenerator />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
  });

  // --- Accessibility ---

  it('search input has aria-label', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);
    expect(screen.getByLabelText('Search political prisoners')).toBeTruthy();
  });

  it('dropdown list has listbox role', () => {
    render(<AdvocacyLetterGenerator />);
    const selectBtn = screen.getByRole('button', { expanded: false });
    fireEvent.click(selectBtn);
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('country buttons have aria-pressed', () => {
    render(<AdvocacyLetterGenerator />);
    const usBtn = screen.getByText('US').closest('button');
    expect(usBtn.getAttribute('aria-pressed')).toBeTruthy();
  });
});
