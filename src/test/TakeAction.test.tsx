import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders first 3 action titles by default', () => {
    renderTakeAction();
    expect(screen.getByText('DONATE TO VERIFIED ORGANIZATIONS')).toBeTruthy();
    expect(screen.getByText('CONTACT YOUR REPRESENTATIVES')).toBeTruthy();
    expect(screen.getByText('SIGN PETITIONS & BOYCOTT')).toBeTruthy();
    // Actions 4-5 hidden behind "Show more"
    expect(screen.queryByText('SPREAD AWARENESS & SHOW SOLIDARITY')).toBeNull();
  });

  it('shows all 5 actions after clicking "show all"', () => {
    renderTakeAction();
    const showAllBtn = screen.getByText(/show --all 5 actions/);
    fireEvent.click(showAllBtn);
    expect(screen.getByText('DONATE TO VERIFIED ORGANIZATIONS')).toBeTruthy();
    expect(screen.getByText('SIGN PETITIONS & BOYCOTT')).toBeTruthy();
    expect(screen.getByText('SPREAD AWARENESS & SHOW SOLIDARITY')).toBeTruthy();
    expect(screen.getByText('STAY INFORMED & STAY SECURE')).toBeTruthy();
  });

  it('collapses back to 3 actions after clicking "show less"', () => {
    renderTakeAction();
    fireEvent.click(screen.getByText(/show --all 5 actions/));
    expect(screen.getByText('SPREAD AWARENESS & SHOW SOLIDARITY')).toBeTruthy();
    fireEvent.click(screen.getByText('$ show --less'));
    expect(screen.queryByText('SPREAD AWARENESS & SHOW SOLIDARITY')).toBeNull();
  });

  // --- Expandable Actions ---

  it('expands action when clicked', () => {
    renderTakeAction();
    const donateButton = screen.getByText('DONATE TO VERIFIED ORGANIZATIONS').closest('button');
    fireEvent.click(donateButton);
    // Should show the action links
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
    expect(screen.getByText('International Campaign for Tibet')).toBeTruthy();
    expect(screen.getAllByText('Safeguard Defenders').length).toBeGreaterThanOrEqual(1);
  });

  it('collapses action when clicked again', () => {
    renderTakeAction();
    const donateButton = screen.getByText('DONATE TO VERIFIED ORGANIZATIONS').closest('button');
    fireEvent.click(donateButton);
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    fireEvent.click(donateButton);
    expect(screen.queryByText('Uyghur Human Rights Project')).toBeNull();
  });

  it('shows stats in expanded action', () => {
    renderTakeAction();
    const donateButton = screen.getByText('DONATE TO VERIFIED ORGANIZATIONS').closest('button');
    fireEvent.click(donateButton);
    expect(screen.getByText(/29 in-depth reports/)).toBeTruthy();
  });

  it('shows sample message template for contact representatives', () => {
    renderTakeAction();
    const contactButton = screen.getByText('CONTACT YOUR REPRESENTATIVES').closest('button');
    fireEvent.click(contactButton);
    expect(screen.getByText('Sample Message:')).toBeTruthy();
    expect(screen.getByText(/I am writing to urge you/)).toBeTruthy();
  });

  it('shows companies to boycott list', () => {
    renderTakeAction();
    const petitionButton = screen.getByText('SIGN PETITIONS & BOYCOTT').closest('button');
    fireEvent.click(petitionButton);
    expect(screen.getByText('Companies to Avoid:')).toBeTruthy();
    expect(screen.getByText('Shein')).toBeTruthy();
    expect(screen.getByText('Temu')).toBeTruthy();
    expect(screen.getByText('Hikvision')).toBeTruthy();
    expect(screen.getByText('Huawei')).toBeTruthy();
  });

  it('shows recommended security tools', () => {
    renderTakeAction();
    fireEvent.click(screen.getByText(/show --all 5 actions/));
    const secureButton = screen.getByText('STAY INFORMED & STAY SECURE').closest('button');
    fireEvent.click(secureButton);
    expect(screen.getByText('Recommended Tools:')).toBeTruthy();
    // 'Signal' appears in both tools and action links, so check for at least one
    expect(screen.getAllByText('Signal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Tor Browser')).toBeTruthy();
    expect(screen.getByText('ProtonMail')).toBeTruthy();
  });

  it('has aria-expanded attributes on action buttons', () => {
    renderTakeAction();
    const donateButton = screen.getByText('DONATE TO VERIFIED ORGANIZATIONS').closest('button');
    expect(donateButton.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(donateButton);
    expect(donateButton.getAttribute('aria-expanded')).toBe('true');
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
    expect(frontLine.getAttribute('href')).toBe('https://www.frontlinedefenders.org/en/emergency-contact');
    expect(frontLine.getAttribute('rel')).toContain('noopener');
  });

  // --- Lazy-loaded Sections ---

  it('renders suspense fallbacks for lazy-loaded sections', () => {
    renderTakeAction();
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });
});
