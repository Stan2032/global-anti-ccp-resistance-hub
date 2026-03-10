import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import VideoTestimonials from '../components/VideoTestimonials';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('VideoTestimonials', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the section title', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('Video Testimonials')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<VideoTestimonials />);
    expect(screen.getByRole('region', { name: 'Video Testimonials' })).toBeTruthy();
  });

  it('renders description with total count', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText(/10 verified testimonies/)).toBeTruthy();
  });

  it('renders content advisory banner', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('Content Advisory')).toBeTruthy();
  });

  it('renders consent verification badge', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText(/All testimonials verified/)).toBeTruthy();
  });

  // ── Testimonial data ──────────────────────────────────

  it('renders all 10 testimonials by default', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Gulbahar Haitiwaji')).toBeTruthy();
    expect(screen.getByText('Sayragul Sauytbay')).toBeTruthy();
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.getByText('Glaciar Chow')).toBeTruthy();
    expect(screen.getByText('Dolkun Isa')).toBeTruthy();
    expect(screen.getByText('Lobsang Sangay')).toBeTruthy();
    expect(screen.getByText('Jewher Ilham')).toBeTruthy();
    expect(screen.getByText('Chen Guangcheng')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai (Pre-detention)')).toBeTruthy();
  });

  it('shows VERIFIED badge for each testimonial', () => {
    render(<VideoTestimonials />);
    const badges = screen.getAllByText('VERIFIED');
    expect(badges.length).toBe(10);
  });

  it('shows result count', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('Showing 10 of 10 testimonials')).toBeTruthy();
  });

  // ── Category filters ──────────────────────────────────

  it('renders all category filter buttons', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('All Testimonies')).toBeTruthy();
    expect(screen.getByText('Detention Survivors')).toBeTruthy();
    expect(screen.getByText('Political Persecution')).toBeTruthy();
    expect(screen.getByText('Advocates & Experts')).toBeTruthy();
    expect(screen.getByText('Family Members')).toBeTruthy();
  });

  it('filters by Detention Survivors category', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Detention Survivors'));
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Gulbahar Haitiwaji')).toBeTruthy();
    expect(screen.getByText('Sayragul Sauytbay')).toBeTruthy();
    expect(screen.queryByText('Joshua Wong')).toBeFalsy();
    expect(screen.queryByText('Dolkun Isa')).toBeFalsy();
  });

  it('filters by Political Persecution category', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Political Persecution'));
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.getByText('Glaciar Chow')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai (Pre-detention)')).toBeTruthy();
    expect(screen.queryByText('Tursunay Ziawudun')).toBeFalsy();
  });

  it('filters by Advocates & Experts category', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Advocates & Experts'));
    expect(screen.getByText('Dolkun Isa')).toBeTruthy();
    expect(screen.getByText('Lobsang Sangay')).toBeTruthy();
    expect(screen.getByText('Chen Guangcheng')).toBeTruthy();
    expect(screen.queryByText('Glaciar Chow')).toBeFalsy();
  });

  it('filters by Family Members category', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Family Members'));
    expect(screen.getByText('Jewher Ilham')).toBeTruthy();
    expect(screen.queryByText('Joshua Wong')).toBeFalsy();
  });

  it('resets filter when clicking All Testimonies', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Detention Survivors'));
    expect(screen.queryByText('Joshua Wong')).toBeFalsy();
    fireEvent.click(screen.getByText('All Testimonies'));
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
  });

  it('shows category counts in filter buttons', () => {
    render(<VideoTestimonials />);
    // Multiple (10) — one in categories, one in regions
    expect(screen.getAllByText('(10)').length).toBeGreaterThanOrEqual(1);
    // Detention survivors = 3
    expect(screen.getAllByText('(3)').length).toBeGreaterThanOrEqual(1);
  });

  // ── Region filters ────────────────────────────────────

  it('renders region filter buttons', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('All Regions')).toBeTruthy();
    expect(screen.getAllByText('East Turkestan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tibet').length).toBeGreaterThanOrEqual(1);
  });

  it('filters by East Turkestan region', () => {
    render(<VideoTestimonials />);
    // Click the region button (first occurrence that's a button)
    const regionBtns = screen.getAllByText('East Turkestan');
    const btn = regionBtns.find((el) => el.closest('button[aria-pressed]'));
    fireEvent.click(btn || regionBtns[0]);
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Dolkun Isa')).toBeTruthy();
    expect(screen.queryByText('Joshua Wong')).toBeFalsy();
    expect(screen.queryByText('Lobsang Sangay')).toBeFalsy();
  });

  it('filters by Hong Kong region', () => {
    render(<VideoTestimonials />);
    const regionBtns = screen.getAllByText('Hong Kong');
    const btn = regionBtns.find((el) => el.closest('button[aria-pressed]'));
    fireEvent.click(btn || regionBtns[0]);
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.getByText('Glaciar Chow')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai (Pre-detention)')).toBeTruthy();
    expect(screen.queryByText('Tursunay Ziawudun')).toBeFalsy();
  });

  // ── Search ─────────────────────────────────────────────

  it('renders search input', () => {
    render(<VideoTestimonials />);
    expect(screen.getByPlaceholderText('Search by name, region, source...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<VideoTestimonials />);
    expect(screen.getByLabelText('Search testimonials')).toBeTruthy();
  });

  it('filters by search query', () => {
    render(<VideoTestimonials />);
    const input = screen.getByPlaceholderText('Search by name, region, source...');
    fireEvent.change(input, { target: { value: 'BBC' } });
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai (Pre-detention)')).toBeTruthy();
    expect(screen.queryByText('Dolkun Isa')).toBeFalsy();
  });

  it('shows empty state when no results', () => {
    render(<VideoTestimonials />);
    const input = screen.getByPlaceholderText('Search by name, region, source...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText(/No testimonials match your filters/)).toBeTruthy();
  });

  it('search is case-insensitive', () => {
    render(<VideoTestimonials />);
    const input = screen.getByPlaceholderText('Search by name, region, source...');
    fireEvent.change(input, { target: { value: 'joshua' } });
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
  });

  // ── Expand/collapse ────────────────────────────────────

  it('cards start collapsed', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('clicking a card expands it', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking an expanded card collapses it', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('only one card can be expanded at a time', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[1]);
    expect(expandBtns[1].getAttribute('aria-expanded')).toBe('true');
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  // ── Content warnings ───────────────────────────────────

  it('shows content warning when card is expanded', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(screen.getByText('Content Warning')).toBeTruthy();
    expect(screen.getByText('I understand — show details')).toBeTruthy();
  });

  it('dismissing warning reveals details', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    fireEvent.click(screen.getByText('I understand — show details'));
    expect(screen.getByText('Consent Verified')).toBeTruthy();
    expect(screen.queryByText('I understand — show details')).toBeFalsy();
  });

  // ── Source links ───────────────────────────────────────

  it('shows source link after warning dismissed', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    fireEvent.click(screen.getByText('I understand — show details'));
    expect(screen.getByText(/Watch on/)).toBeTruthy();
  });

  it('source links open in new tab', () => {
    render(<VideoTestimonials />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    fireEvent.click(screen.getByText('I understand — show details'));
    const link = screen.getByText(/Watch on/).closest('a');
    expect(link!.getAttribute('target')).toBe('_blank');
    expect(link!.getAttribute('rel')).toContain('noopener');
  });

  // ── Copy to clipboard ─────────────────────────────────

  it('renders copy button', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText('Copy list')).toBeTruthy();
  });

  it('copies to clipboard on click', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Copy list'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const text = (navigator.clipboard.writeText as any).mock.calls[0][0];
    expect(text).toContain('Video Testimonials');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Privacy & attribution ──────────────────────────────

  it('shows privacy footer', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText(/Privacy-first/)).toBeTruthy();
    expect(screen.getByText(/No embedded players/)).toBeTruthy();
  });

  it('shows CC BY 4.0 attribution', () => {
    render(<VideoTestimonials />);
    expect(screen.getByText(/CC BY 4.0/)).toBeTruthy();
  });

  // ── Data quality ───────────────────────────────────────

  it('all testimonials have Tier 1-2 sources', () => {
    render(<VideoTestimonials />);
    // No CCP state media should appear
    expect(screen.queryByText(/Xinhua/)).toBeFalsy();
    expect(screen.queryByText(/CGTN/)).toBeFalsy();
    expect(screen.queryByText(/Global Times/)).toBeFalsy();
    expect(screen.queryByText(/People's Daily/)).toBeFalsy();
  });

  it('all testimonials have consent verified flag', () => {
    render(<VideoTestimonials />);
    // All 10 should have VERIFIED badge
    expect(screen.getAllByText('VERIFIED').length).toBe(10);
  });

  it('testimonials span multiple regions', () => {
    render(<VideoTestimonials />);
    // Check multiple regions are represented
    const allText = document.body.textContent;
    expect(allText).toContain('East Turkestan');
    expect(allText).toContain('Hong Kong');
    expect(allText).toContain('Tibet');
    expect(allText).toContain('Mainland China');
  });

  // ── Combined filters ───────────────────────────────────

  it('category + search filters combine', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Political Persecution'));
    const input = screen.getByPlaceholderText('Search by name, region, source...');
    fireEvent.change(input, { target: { value: 'Wong' } });
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.queryByText('Glaciar Chow')).toBeFalsy();
    expect(screen.queryByText('Tursunay Ziawudun')).toBeFalsy();
  });

  it('region + category filters combine', () => {
    render(<VideoTestimonials />);
    fireEvent.click(screen.getByText('Advocates & Experts'));
    const regionBtns = screen.getAllByText('East Turkestan');
    const btn = regionBtns.find((el) => el.closest('button[aria-pressed]'));
    fireEvent.click(btn || regionBtns[0]);
    expect(screen.getByText('Dolkun Isa')).toBeTruthy();
    expect(screen.queryByText('Lobsang Sangay')).toBeFalsy();
    expect(screen.queryByText('Chen Guangcheng')).toBeFalsy();
  });
});
