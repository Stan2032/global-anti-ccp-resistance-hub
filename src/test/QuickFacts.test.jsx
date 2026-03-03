import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
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
    expect(screen.getByText(/Click any fact card to copy it/)).toBeTruthy();
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

  it('copies fact to clipboard when card is clicked', async () => {
    render(<QuickFacts />);
    // Click the first fact card (Political Prisoners)
    const statElement = screen.getByText('1,000+');
    const card = statElement.closest('div[class*="cursor-pointer"]');
    fireEvent.click(card);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const clipboardText = navigator.clipboard.writeText.mock.calls[0][0];
    expect(clipboardText).toContain('Political Prisoners');
    expect(clipboardText).toContain('1,000+');
    expect(clipboardText).toContain('Dui Hua Foundation');
    expect(clipboardText).not.toContain('#');
  });

  it('shows "Copied!" indicator after clicking a card', async () => {
    render(<QuickFacts />);
    expect(screen.queryByText('Copied!')).toBeFalsy();

    const statElement = screen.getByText('1,000+');
    const card = statElement.closest('div[class*="cursor-pointer"]');
    fireEvent.click(card);

    // Wait for the async clipboard promise to resolve
    await vi.waitFor(() => {
      expect(screen.getByText('Copied!')).toBeTruthy();
    });
  });

  it('clipboard text does not include hashtags', async () => {
    render(<QuickFacts />);
    const statElement = screen.getByText('102+');
    const card = statElement.closest('div[class*="cursor-pointer"]');
    fireEvent.click(card);

    const clipboardText = navigator.clipboard.writeText.mock.calls[0][0];
    expect(clipboardText).toContain('CCP police stations');
    expect(clipboardText).not.toContain('#');
  });

  // --- Twitter Share ---

  it('renders Twitter share buttons for all facts', () => {
    render(<QuickFacts />);
    const shareButtons = screen.getAllByTitle('Share on Twitter');
    expect(shareButtons.length).toBe(8);
  });

  it('Twitter share opens a new window', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    render(<QuickFacts />);
    const shareButtons = screen.getAllByTitle('Share on Twitter');
    fireEvent.click(shareButtons[0]);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain('twitter.com/intent/tweet');
    expect(url).toContain('Political%20Prisoners');
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
