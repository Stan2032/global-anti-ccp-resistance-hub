import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/EventCalendar', () => ({ default: () => <div>EventCalendar</div> }));
vi.mock('../components/DiasporaSupport', () => ({ default: () => <div>DiasporaSupport</div> }));
vi.mock('../components/ReportSighting', () => ({ default: () => <div>ReportSighting</div> }));
vi.mock('../components/SurvivorStories', () => ({ default: () => <div>SurvivorStories</div> }));
vi.mock('../components/VolunteerSignup', () => ({ default: () => <div>VolunteerSignup</div> }));
vi.mock('../components/ContactForm', () => ({ default: () => <div>ContactForm</div> }));

import CommunitySupport from '../pages/CommunitySupport';

describe('CommunitySupport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('Community Support Network')).toBeTruthy();
    expect(screen.getByText(/Mutual aid network connecting activists/)).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders 4 tabs', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('Support')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByText('Stories')).toBeTruthy();
    expect(screen.getByText('Report')).toBeTruthy();
  });

  it('does not render removed tabs (Volunteer, Contact as separate tabs)', () => {
    render(<CommunitySupport />);
    const allButtons = screen.getAllByRole('button');
    const tabTexts = allButtons.map(b => b.textContent);
    expect(tabTexts).not.toContain('Volunteer');
    expect(tabTexts).not.toContain('Contact');
  });

  // --- Default Support Tab ---

  it('defaults to Support tab with resources', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('── support_resources ──')).toBeTruthy();
    expect(screen.getByText('Emergency Relocation Guide')).toBeTruthy();
    expect(screen.getByText('Trauma Support Resources')).toBeTruthy();
    expect(screen.getByText('Legal Support Directory')).toBeTruthy();
    expect(screen.getByText('Fundraising Toolkit')).toBeTruthy();
  });

  it('shows volunteer signup section on Support tab', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('── volunteer_signup ──')).toBeTruthy();
  });

  it('shows contact form section on Support tab', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('── contact_form ──')).toBeTruthy();
  });

  it('renders read_guide buttons for resources', () => {
    render(<CommunitySupport />);
    const guideButtons = screen.getAllByText('$ read_guide');
    expect(guideButtons.length).toBe(4);
  });

  // --- Events Tab ---

  it('switches to Events tab', () => {
    render(<CommunitySupport />);
    fireEvent.click(screen.getByText('Events'));
    // EventCalendar is lazy — Suspense fallback shows
    const loaders = screen.getAllByText('$ loading');
    expect(loaders.length).toBeGreaterThanOrEqual(1);
  });

  // --- Stories Tab ---

  it('switches to Stories tab', () => {
    render(<CommunitySupport />);
    fireEvent.click(screen.getByText('Stories'));
    const loaders = screen.getAllByText('$ loading');
    expect(loaders.length).toBeGreaterThanOrEqual(1);
  });

  // --- Report Tab ---

  it('switches to Report tab', () => {
    render(<CommunitySupport />);
    fireEvent.click(screen.getByText('Report'));
    expect(screen.getByText('── diaspora_support ──')).toBeTruthy();
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = render(<CommunitySupport />);
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });

  // --- No fake data ---

  it('does not render fake support requests', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('Legal Support for Hong Kong Activist')).toBeNull();
    expect(screen.queryByText('Emergency Relocation Assistance')).toBeNull();
  });

  it('does not render fake volunteer profiles', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('Anonymous Volunteer')).toBeNull();
    expect(screen.queryByText('47')).toBeNull(); // completedTasks
  });

  it('does not render fake community statistics', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('8,734')).toBeNull();
    expect(screen.queryByText('Active Members')).toBeNull();
    expect(screen.queryByText('Requests Fulfilled')).toBeNull();
  });
});
