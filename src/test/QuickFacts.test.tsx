import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import QuickFacts from '../components/QuickFacts';

// Mock clipboard API
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
  vi.clearAllMocks();
});

describe('QuickFacts', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<QuickFacts />);
    expect(screen.getByText('Quick Facts')).toBeTruthy();
    expect(screen.getByText('Shareable statistics to spread awareness')).toBeTruthy();
  });

  it('renders instructions text', () => {
    render(<QuickFacts />);
    expect(screen.getByText(/Share a fact from its card/)).toBeTruthy();
  });

  // --- All 8 Fact Cards ---

  it('renders all 8 fact categories', () => {
    render(<QuickFacts />);
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Overseas Police Stations')).toBeTruthy();
    expect(screen.getByText('Uyghur Detention')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Forced Labor')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
    expect(screen.getByText('Transnational Repression')).toBeTruthy();
    expect(screen.getByText('Press Freedom')).toBeTruthy();
  });

  it('renders all 8 statistics', () => {
    render(<QuickFacts />);
    expect(screen.getByText('1,000+')).toBeTruthy();
    expect(screen.getByText('102+')).toBeTruthy();
    expect(screen.getByText('1-3 Million')).toBeTruthy();
    expect(screen.getByText('260+')).toBeTruthy();
    expect(screen.getByText('83')).toBeTruthy();
    expect(screen.getByText('29 Years')).toBeTruthy();
    expect(screen.getByText('230,000+')).toBeTruthy();
    expect(screen.getByText('#179')).toBeTruthy();
  });

  it('renders descriptions for all facts', () => {
    render(<QuickFacts />);
    expect(screen.getByText('Political prisoners currently detained in China')).toBeTruthy();
    expect(screen.getByText('CCP police stations operating in 53 countries')).toBeTruthy();
    expect(screen.getByText(/Uyghurs detained in "re-education" camps/)).toBeTruthy();
    expect(screen.getByText('Political prisoners under National Security Law')).toBeTruthy();
    expect(screen.getByText('Global brands linked to Uyghur forced labor')).toBeTruthy();
    expect(screen.getByText(/Gedhun Choekyi Nyima.*held since age 6/)).toBeTruthy();
    expect(screen.getByText(/People "persuaded" to return to China/)).toBeTruthy();
    expect(screen.getByText(/China's ranking out of 180 countries/)).toBeTruthy();
  });

  // --- Sources ---

  it('renders source attributions for all facts', () => {
    render(<QuickFacts />);
    expect(screen.getByText(/Dui Hua Foundation/)).toBeTruthy();
    // Safeguard Defenders appears twice (facts 2 and 7)
    expect(screen.getAllByText(/Safeguard Defenders/).length).toBe(2);
    expect(screen.getByText(/Multiple sources including ASPI/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong Watch/)).toBeTruthy();
    expect(screen.getByText(/ASPI Uyghurs for Sale Report/)).toBeTruthy();
    expect(screen.getByText(/International Campaign for Tibet/)).toBeTruthy();
    expect(screen.getByText(/Reporters Without Borders/)).toBeTruthy();
  });

  it('source links use HTTPS and open in new tab', () => {
    render(<QuickFacts />);
    const duiHuaLink = screen.getByText(/Dui Hua Foundation/);
    expect(duiHuaLink.getAttribute('target')).toBe('_blank');
    expect(duiHuaLink.getAttribute('rel')).toContain('noopener');
    expect(duiHuaLink.getAttribute('href')).toBe('https://duihua.org/');
  });

  // --- Copy to Clipboard ---

  // Copying was a click on the card itself: a <div> no keyboard could reach.
  // Each card has a real Copy button now, rendered once JavaScript runs.
  const copyButtonFor = (stat: string) => screen.getByRole('button', { name: new RegExp(`^Copy fact: .*, ${stat.replace('+', '\\+')}$`) });

  it('copies fact to clipboard with its Copy button', async () => {
    render(<QuickFacts />);
    fireEvent.click(copyButtonFor('1,000+'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(clipboardText).toContain('Political Prisoners');
    expect(clipboardText).toContain('1,000+');
    expect(clipboardText).toContain('Dui Hua Foundation');
    expect(clipboardText).not.toContain('#');
  });

  it('the Copy button says "Copied!" and keeps focus where it was', async () => {
    render(<QuickFacts />);
    const button = copyButtonFor('1,000+');
    expect(button.textContent).toBe('Copy');
    button.focus();
    fireEvent.click(button);
    await vi.waitFor(() => {
      expect(button.textContent).toBe('✓ Copied!');
    });
    expect(document.activeElement).toBe(button);
  });

  it('leaves the Copy buttons out of the pre-rendered page, where they could do nothing', () => {
    const html = renderToString(<QuickFacts />);
    expect(html).not.toMatch(/Copy fact:/);
    expect(html).toContain('twitter.com/intent/tweet');
  });

  it('no card is itself clickable', () => {
    const { container } = render(<QuickFacts />);
    expect(container.querySelectorAll('div[class*="cursor-pointer"], div[aria-label]')).toHaveLength(0);
  });

  it('clipboard text does not include hashtags', async () => {
    render(<QuickFacts />);
    fireEvent.click(copyButtonFor('102+'));

    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(clipboardText).toContain('CCP police stations');
    expect(clipboardText).not.toContain('#');
  });

  // --- Twitter Share ---

  it('renders Twitter share links for all facts', () => {
    render(<QuickFacts />);
    const shareLinks = screen.getAllByTitle('Share on Twitter');
    expect(shareLinks.length).toBe(8);
    for (const link of shareLinks) expect(link.tagName).toBe('A');
  });

  // Sharing was a button that called window.open, so it did nothing
  // without JavaScript. It is a plain link now.
  it('Twitter share is a link to the intent URL, opening in a new tab', () => {
    render(<QuickFacts />);
    const link = screen.getByRole('link', { name: 'Share on Twitter: Political Prisoners' });
    expect(link.getAttribute('href')).toContain('twitter.com/intent/tweet');
    expect(link.getAttribute('href')).toContain('Political%20Prisoners');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  // --- Usage Tips ---

  it('renders usage tips section', () => {
    render(<QuickFacts />);
    expect(screen.getByText('How to Use These Facts')).toBeTruthy();
    expect(screen.getByText('Social Media')).toBeTruthy();
    expect(screen.getByText('Presentations')).toBeTruthy();
    expect(screen.getByText('Letters & Emails')).toBeTruthy();
  });

  // --- No CCP State Media ---

  it('does not reference CCP state media', () => {
    render(<QuickFacts />);
    const html = document.body.innerHTML.toLowerCase();
    expect(html).not.toContain('xinhua');
    expect(html).not.toContain('cgtn');
    expect(html).not.toContain('global times');
  });
});
