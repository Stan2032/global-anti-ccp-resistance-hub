import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock lazy-loaded components (4 remaining after moves to Education page)
vi.mock('../components/DataExport', () => ({ default: () => <div>DataExport</div> }));
vi.mock('../components/CompanyTracker', () => ({ default: () => <div>CompanyTracker</div> }));
vi.mock('../components/ForcedLaborTracker', () => ({ default: () => <div>ForcedLaborTracker</div> }));
vi.mock('../components/LegalResourcesHub', () => ({ default: () => <div>LegalResourcesHub</div> }));

import ResistanceResources from '../pages/ResistanceResources';

const renderPage = () =>
  render(
    <MemoryRouter>
      <ResistanceResources />
    </MemoryRouter>
  );

describe('ResistanceResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    renderPage();
    expect(screen.getByText('Resource Hub')).toBeTruthy();
    expect(screen.getByText(/central navigation point/)).toBeTruthy();
  });

  // --- Security Notice ---

  it('renders security notice', () => {
    renderPage();
    expect(screen.getByText('Security First')).toBeTruthy();
    expect(screen.getByText(/use a VPN and Tor Browser/)).toBeTruthy();
  });

  // --- Resource Sections Grid ---

  it('renders all 6 resource section cards', () => {
    renderPage();
    expect(screen.getByText('Security & Privacy')).toBeTruthy();
    expect(screen.getByText('Take Action')).toBeTruthy();
    expect(screen.getByText('Organizations Directory')).toBeTruthy();
    expect(screen.getByText('Educational Resources')).toBeTruthy();
    expect(screen.getByText('Intelligence & News')).toBeTruthy();
    expect(screen.getByText('Community Support')).toBeTruthy();
  });

  it('renders navigation links for resource sections', () => {
    renderPage();
    expect(screen.getByText('Go to Security Center →')).toBeTruthy();
    expect(screen.getByText('Go to Take Action →')).toBeTruthy();
    expect(screen.getByText('Browse Directory →')).toBeTruthy();
    expect(screen.getByText('Go to Education Center →')).toBeTruthy();
    expect(screen.getByText('View Intelligence Feeds →')).toBeTruthy();
    expect(screen.getByText('Join Community →')).toBeTruthy();
  });

  it('renders highlight tags in resource sections', () => {
    renderPage();
    expect(screen.getByText('Tor Browser')).toBeTruthy();
    expect(screen.getByText('Contact Representatives')).toBeTruthy();
    expect(screen.getByText('24 Organizations')).toBeTruthy();
    expect(screen.getByText('21 Books')).toBeTruthy();
    expect(screen.getByText('Live RSS Feeds')).toBeTruthy();
    expect(screen.getByText('Diaspora Support')).toBeTruthy();
  });

  // --- Quick Documentation Tools ---

  it('renders quick documentation tools section', () => {
    renderPage();
    expect(screen.getByText('Quick Documentation Tools')).toBeTruthy();
    expect(screen.getByText('eyeWitness to Atrocities')).toBeTruthy();
    expect(screen.getByText('ProofMode')).toBeTruthy();
    expect(screen.getByText('Wayback Machine')).toBeTruthy();
    expect(screen.getByText('Archive.today')).toBeTruthy();
    expect(screen.getByText('Have I Been Pwned')).toBeTruthy();
    expect(screen.getByText('PrivacyTools.io')).toBeTruthy();
  });

  // --- Emergency Contacts ---

  it('renders emergency contacts section', () => {
    renderPage();
    expect(screen.getByText('Emergency Contacts')).toBeTruthy();
    expect(screen.getByText('Front Line Defenders')).toBeTruthy();
    expect(screen.getByText('Access Now Digital Security')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
  });

  it('renders emergency contact details', () => {
    renderPage();
    expect(screen.getByText('+353 1 210 0489')).toBeTruthy();
    expect(screen.getByText('help@accessnow.org')).toBeTruthy();
    expect(screen.getByText('contact@safeguarddefenders.com')).toBeTruthy();
  });

  // --- Lazy Component Sections ---

  it('renders loading states for lazy components', () => {
    renderPage();
    const loaders = screen.getAllByText('$ loading');
    expect(loaders.length).toBeGreaterThanOrEqual(4);
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = renderPage();
    // motion.div adds data-projection-id attribute — should be 0
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });

  // --- Aspirational components removed ---

  it('does not render removed aspirational components', () => {
    renderPage();
    // These should NOT appear as lazy-loaded content
    expect(screen.queryByText('Bookmarks')).toBeNull();
    expect(screen.queryByText('MediaGallery')).toBeNull();
  });

  // --- Footer ---

  it('renders footer note', () => {
    renderPage();
    expect(screen.getByText(/connects you to dedicated sections/)).toBeTruthy();
  });
});
