import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/PetitionLinks', () => ({ default: () => <div>PetitionLinks</div> }));
vi.mock('../components/ForcedLabourList', () => ({ default: () => <div>ForcedLabourList</div> }));
vi.mock('../components/ContactRepresentatives', () => ({ default: () => <div>ContactRepresentatives</div> }));
vi.mock('../components/SuccessStories', () => ({ default: () => <div>SuccessStories</div> }));
vi.mock('../components/QuickFacts', () => ({ default: () => <div>QuickFacts</div> }));
vi.mock('../components/ActivistToolkit', () => ({ default: () => <div>ActivistToolkit</div> }));
vi.mock('../components/SanctionsTracker', () => ({ default: () => <div>SanctionsTracker</div> }));
vi.mock('../components/DonationGuide', () => ({ default: () => <div>DonationGuide</div> }));
vi.mock('../components/CompanyTracker', () => ({ default: () => <div>CompanyTracker</div> }));
vi.mock('../components/VolunteerSignup', () => ({ default: () => <div>VolunteerSignup</div> }));
vi.mock('../components/DiasporaSupport', () => ({ default: () => <div>DiasporaSupport</div> }));
vi.mock('../components/ShareButtons', () => ({ default: () => <div>ShareButtons</div> }));

import TakeAction from '../pages/TakeAction';

const renderTakeAction = () =>
  render(
    <MemoryRouter>
      <TakeAction />
    </MemoryRouter>
  );

// Each of the five actions is a native <details> whose summary holds its title.
const action = (title: string) => {
  const details = screen.getByText(title).closest('details');
  expect(details, `"${title}" is a <details>`).toBeTruthy();
  return details as HTMLDetailsElement;
};

describe('TakeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Hero Section ---

  it('renders the hero section', () => {
    renderTakeAction();
    expect(screen.getByText('Take Action Against CCP Authoritarianism')).toBeTruthy();
    expect(screen.getByText(/Five concrete ways you can help/)).toBeTruthy();
  });

  it('has hero action buttons', () => {
    renderTakeAction();
    expect(screen.getByText('See All Actions')).toBeTruthy();
    expect(screen.getByText('View Profiles')).toBeTruthy();
  });

  // --- Impact Stats ---

  it('renders all 4 impact statistics', () => {
    renderTakeAction();
    expect(screen.getByText('10,000+')).toBeTruthy();
    expect(screen.getByText('Political Prisoners Documented')).toBeTruthy();
    expect(screen.getByText('53')).toBeTruthy();
    expect(screen.getByText('Countries with CCP Police Stations')).toBeTruthy();
    expect(screen.getByText('1M+')).toBeTruthy();
    expect(screen.getByText('Uyghurs in Detention')).toBeTruthy();
    expect(screen.getByText('24')).toBeTruthy();
    expect(screen.getByText('Organizations in Our Directory')).toBeTruthy();
  });

  // --- Security Notice ---

  it('renders security notice', () => {
    renderTakeAction();
    expect(screen.getByText('Security Notice')).toBeTruthy();
    expect(screen.getByText(/If you are in China/)).toBeTruthy();
  });

  // --- Eight Actions ---

  it('renders the five actions heading', () => {
    renderTakeAction();
    expect(screen.getByText('Five Things You Can Do')).toBeTruthy();
  });

  it('shows all five actions, each a native disclosure closed to start', () => {
    // Three used to show until "$ show --all" was clicked, so a reader
    // without JavaScript got three of the five things.
    renderTakeAction();
    for (const title of ['DONATE TO VERIFIED ORGANIZATIONS', 'CONTACT YOUR REPRESENTATIVES', 'SIGN PETITIONS & BOYCOTT', 'SPREAD AWARENESS & SHOW SOLIDARITY', 'STAY INFORMED & STAY SECURE']) {
      const card = action(title);
      expect(card.firstElementChild?.tagName).toBe('SUMMARY');
      expect(card.open).toBe(false);
    }
    expect(screen.queryByText(/show --all/)).toBeNull();
  });


  // --- Native disclosure ---

  it('an action carries its links without a click', () => {
    renderTakeAction();
    const donate = within(action('DONATE TO VERIFIED ORGANIZATIONS'));
    expect(donate.getByText('Uyghur Human Rights Project')).toBeTruthy();
    expect(donate.getByText('Hong Kong Watch')).toBeTruthy();
    expect(donate.getByText('International Campaign for Tibet')).toBeTruthy();
    expect(donate.getAllByText('Safeguard Defenders').length).toBeGreaterThanOrEqual(1);
  });

  it('an action opens and closes natively', () => {
    renderTakeAction();
    const donate = action('DONATE TO VERIFIED ORGANIZATIONS');
    fireEvent.click(donate.querySelector('summary')!);
    expect(donate.open).toBe(true);
    fireEvent.click(donate.querySelector('summary')!);
    expect(donate.open).toBe(false);
  });

  it('shows stats in an action without a click', () => {
    renderTakeAction();
    expect(within(action('DONATE TO VERIFIED ORGANIZATIONS')).getByText(/29 in-depth reports/)).toBeTruthy();
  });

  it('shows sample message template for contact representatives', () => {
    renderTakeAction();
    const contact = within(action('CONTACT YOUR REPRESENTATIVES'));
    expect(contact.getByText('Sample Message:')).toBeTruthy();
    expect(contact.getByText(/I am writing to urge you/)).toBeTruthy();
  });

  it('shows companies to boycott list', () => {
    renderTakeAction();
    const petitions = within(action('SIGN PETITIONS & BOYCOTT'));
    expect(petitions.getByText('Companies to Avoid:')).toBeTruthy();
    expect(petitions.getByText('Shein')).toBeTruthy();
    expect(petitions.getByText('Temu')).toBeTruthy();
    expect(petitions.getByText('Hikvision')).toBeTruthy();
    expect(petitions.getByText('Huawei')).toBeTruthy();
  });

  it('shows recommended security tools', () => {
    renderTakeAction();
    const secure = within(action('STAY INFORMED & STAY SECURE'));
    expect(secure.getByText('Recommended Tools:')).toBeTruthy();
    // 'Signal' appears in both tools and action links, so check for at least one
    expect(secure.getAllByText('Signal').length).toBeGreaterThanOrEqual(1);
    expect(secure.getByText('Tor Browser')).toBeTruthy();
    expect(secure.getByText('ProtonMail')).toBeTruthy();
  });

  it('uses native disclosures, not JavaScript-only expanders', () => {
    renderTakeAction();
    const grid = document.getElementById('actions')!;
    expect(grid.querySelectorAll('details')).toHaveLength(5);
    expect(grid.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });

  // --- Emergency Contacts ---

  it('renders emergency contacts section', () => {
    renderTakeAction();
    expect(screen.getByText('Emergency Contacts')).toBeTruthy();
    expect(screen.getByText(/facing immediate danger/)).toBeTruthy();
  });

  it('lists all 3 emergency contacts', () => {
    renderTakeAction();
    // 'Safeguard Defenders' appears both in emergency contacts and expanded action links
    expect(screen.getAllByText('Safeguard Defenders').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Freedom House')).toBeTruthy();
    expect(screen.getByText('Front Line Defenders')).toBeTruthy();
  });

  it('links to emergency contact websites', () => {
    renderTakeAction();
    const frontLine = screen.getByText('Front Line Defenders').closest('a');
    expect(frontLine!.getAttribute('href')).toBe('https://www.frontlinedefenders.org/en/emergency-contact');
    expect(frontLine!.getAttribute('rel')).toContain('noopener');
  });

  // --- Lazy-loaded Sections ---

  it('renders suspense fallbacks for lazy-loaded sections', () => {
    renderTakeAction();
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });
});
