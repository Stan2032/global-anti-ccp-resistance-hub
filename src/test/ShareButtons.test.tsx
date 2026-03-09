// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ShareButtons from '../components/ShareButtons';

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

  it('marks Signal as disabled (no web sharing)', () => {
    render(<ShareButtons />);
    // Signal should have a disabled title
    const showMore = screen.queryByTitle('More options');
    if (showMore) {
      fireEvent.click(showMore);
    }
    const signalLink = screen.getByTitle('Signal (not available for web sharing)');
    expect(signalLink).toBeTruthy();
  });

  // --- Compact mode ---

  it('shows only 4 platforms in compact mode', () => {
    render(<ShareButtons compact />);
    // Compact shows first 4 share links + copy button
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(4);
  });

  // --- Show more toggle ---

  it('shows "More options" button when more than 5 platforms exist', () => {
    render(<ShareButtons />);
    expect(screen.getByTitle('More options')).toBeTruthy();
  });

  it('shows all platforms after clicking "More options"', () => {
    render(<ShareButtons />);
    const showMore = screen.getByTitle('More options');
    fireEvent.click(showMore);
    // After expanding, should show Email and Signal
    expect(screen.getByTitle('Share on Email')).toBeTruthy();
    expect(screen.getByTitle('Signal (not available for web sharing)')).toBeTruthy();
  });

  // --- Custom props ---

  it('accepts custom title and text', () => {
    render(<ShareButtons title="Custom Title" text="Custom text for sharing" />);
    const twitterLink = screen.getByTitle('Share on Twitter/X');
    expect(twitterLink.getAttribute('href')).toContain('Custom%20text%20for%20sharing');
  });
});
