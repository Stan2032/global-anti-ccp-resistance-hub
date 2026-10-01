import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ShareButtons from '../components/ShareButtons';
import { SITE_URL } from '../utils/site';

describe('ShareButtons', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  // --- Rendering ---

  it('renders share links for major platforms', () => {
    render(<ShareButtons />);
    expect(screen.getByTitle('Share on Twitter/X')).toBeTruthy();
    expect(screen.getByTitle('Share on Facebook')).toBeTruthy();
    expect(screen.getByTitle('Share on LinkedIn')).toBeTruthy();
    expect(screen.getByTitle('Share on Telegram')).toBeTruthy();
    expect(screen.getByTitle('Share on WhatsApp')).toBeTruthy();
  });

  it('renders copy link button', () => {
    render(<ShareButtons />);
    expect(screen.getByTitle('Copy link')).toBeTruthy();
  });

  it('shows platform names in full mode', () => {
    render(<ShareButtons />);
    expect(screen.getByText('Twitter/X')).toBeTruthy();
    expect(screen.getByText('Facebook')).toBeTruthy();
    expect(screen.getByText('LinkedIn')).toBeTruthy();
    expect(screen.getByText('Telegram')).toBeTruthy();
    expect(screen.getByText('WhatsApp')).toBeTruthy();
  });

  it('does not render hashtags (removed as performative activism)', () => {
    render(<ShareButtons />);
    expect(screen.queryByText(/#Free/)).toBeNull();
    expect(screen.queryByText(/#Stand/)).toBeNull();
  });

  // --- Links ---

  it('opens share links in new tab with noopener', () => {
    render(<ShareButtons />);
    const twitterLink = screen.getByTitle('Share on Twitter/X');
    expect(twitterLink.getAttribute('target')).toBe('_blank');
    expect(twitterLink.getAttribute('rel')).toContain('noopener');
  });

  it('twitter share URL does not include hashtags', () => {
    render(<ShareButtons />);
    const twitterLink = screen.getByTitle('Share on Twitter/X');
    expect(twitterLink.getAttribute('href')).toContain('twitter.com/intent/tweet');
    expect(twitterLink.getAttribute('href')).not.toContain('hashtags=');
  });

  it('email share URL uses mailto: protocol', () => {
    render(<ShareButtons />);
    // Email may be hidden behind "show more" — use showMore to ensure all visible
    const showMore = screen.queryByTitle('More options');
    if (showMore) {
      fireEvent.click(showMore);
    }
    const emailLink = screen.getByTitle('Share on Email');
    expect(emailLink.getAttribute('href')).toContain('mailto:');
  });

  // --- Signal disabled ---

  it('offers no dead placeholder links', () => {
    // Signal has no web share link; it used to show as a disabled link to a
    // made-up number. Every link offered now goes somewhere.
    const { container } = render(<ShareButtons />);
    // Check every option the component can show, including any behind a toggle.
    const more = screen.queryByTitle('More options');
    if (more) fireEvent.click(more);
    expect(screen.queryByTitle(/Signal/)).toBeNull();
    const links = [...container.querySelectorAll('a')];
    expect(links.length).toBeGreaterThan(0);
    links.forEach(a => expect(a.getAttribute('href')).not.toBe('#'));
  });

  it('shares the canonical site URL by default, not window.location', () => {
    // Pre-rendered pages have no window, so the old default left every link
    // for a reader without JavaScript sharing an empty URL.
    render(<ShareButtons />);
    expect(screen.getByTitle('Share on Facebook').getAttribute('href'))
      .toBe(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`);
  });

  it('shares the URL it is given', () => {
    render(<ShareButtons url={`${SITE_URL}/take-action`} />);
    expect(screen.getByTitle('Share on Telegram').getAttribute('href'))
      .toContain(`url=${encodeURIComponent(`${SITE_URL}/take-action`)}`);
  });

  it('leaves the copy button out of the server HTML, where it could not work', () => {
    const html = renderToString(<ShareButtons />);
    expect(html).toContain('Share on Facebook');
    expect(html).not.toContain('Copy link');
  });

  // --- Compact mode ---

  it('shows only 4 platforms in compact mode', () => {
    render(<ShareButtons compact />);
    // Compact shows first 4 share links + copy button
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(4);
  });

  // --- Show more toggle ---

  it('shows every platform in full mode, with nothing to expand', () => {
    const { container } = render(<ShareButtons />);
    for (const name of ['Twitter/X', 'Facebook', 'LinkedIn', 'Telegram', 'WhatsApp', 'Email']) {
      expect(screen.getByTitle(`Share on ${name}`)).toBeTruthy();
    }
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });

  // --- Custom props ---

  it('accepts custom title and text', () => {
    render(<ShareButtons title="Custom Title" text="Custom text for sharing" />);
    const twitterLink = screen.getByTitle('Share on Twitter/X');
    expect(twitterLink.getAttribute('href')).toContain('Custom%20text%20for%20sharing');
  });
});
