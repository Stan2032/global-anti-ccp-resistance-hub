import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/DocumentaryList', () => ({ default: () => <div>DocumentaryList</div> }));
vi.mock('../components/ReadingList', () => ({ default: () => <div>ReadingList</div> }));
vi.mock('../components/GlossaryTerms', () => ({ default: () => <div>GlossaryTerms</div> }));
vi.mock('../components/VictimStories', () => ({ default: () => <div>VictimStories</div> }));
vi.mock('../components/ResearchPapers', () => ({ default: () => <div>ResearchPapers</div> }));
vi.mock('../components/FAQ', () => ({ default: () => <div>FAQ</div> }));
vi.mock('../components/LanguageGuide', () => ({ default: () => <div>LanguageGuide</div> }));
vi.mock('../components/DisinfoTracker', () => ({ default: () => <div>DisinfoTracker</div> }));
vi.mock('../components/SourceVerification', () => ({ default: () => <div>SourceVerification</div> }));
vi.mock('../components/InteractiveTimeline', () => ({ default: () => <div>InteractiveTimeline</div> }));
vi.mock('../components/MediaManipulation', () => ({ default: () => <div>MediaManipulation</div> }));
vi.mock('../components/AIDisinfoDetector', () => ({ default: () => <div>AIDisinfoDetector</div> }));
vi.mock('../components/ConfuciusInstitutes', () => ({ default: () => <div>ConfuciusInstitutes</div> }));
vi.mock('../components/AcademicExperts', () => ({ default: () => <div>AcademicExperts</div> }));
vi.mock('../components/MediaBiasGuide', () => ({ default: () => <div>MediaBiasGuide</div> }));
vi.mock('../components/HistoricalDocuments', () => ({ default: () => <div>HistoricalDocuments</div> }));
vi.mock('../components/EventCalendar', () => ({ default: () => <div>EventCalendar</div> }));
vi.mock('../components/SurvivorStories', () => ({ default: () => <div>SurvivorStories</div> }));

import EducationalResources from '../pages/EducationalResources';

const renderEducation = () => render(<EducationalResources />);

describe('EducationalResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    renderEducation();
    expect(screen.getByText('Education Center')).toBeTruthy();
    expect(screen.getByText(/Comprehensive training modules/)).toBeTruthy();
  });

  // --- Statistics ---

  it('renders 3 stat cards', () => {
    renderEducation();
    expect(screen.getByText('Total Courses')).toBeTruthy();
    expect(screen.getByText('Resources')).toBeTruthy();
    expect(screen.getByText('Topics Covered')).toBeTruthy();
  });

  it('shows correct stat values', () => {
    renderEducation();
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(2); // Total Courses + Resources
    expect(screen.getByText('20+')).toBeTruthy();
  });

  // --- Tabs ---

  it('renders 4 tabs', () => {
    renderEducation();
    expect(screen.getByText('Learn')).toBeTruthy();
    expect(screen.getByText('Media')).toBeTruthy();
    expect(screen.getByText('Research')).toBeTruthy();
    expect(screen.getByText('Tools')).toBeTruthy();
  });

  it('does not render removed tabs (FAQ, History, Progress)', () => {
    renderEducation();
    // These should not be visible as standalone tabs
    const tabs = screen.getAllByRole('button');
    const tabLabels = tabs.map(t => t.textContent);
    expect(tabLabels).not.toContain('FAQ');
    expect(tabLabels).not.toContain('History');
    expect(tabLabels).not.toContain('Progress');
  });

  // --- Learn Tab (default) ---

  it('shows Learn tab by default with search', () => {
    renderEducation();
    expect(screen.getByLabelText('Search')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search courses...')).toBeTruthy();
  });

  it('shows 5 module cards', () => {
    renderEducation();
    expect(screen.getByText('Propaganda Detection Fundamentals')).toBeTruthy();
    expect(screen.getByText('Digital Security for Activists')).toBeTruthy();
    expect(screen.getByText('Hong Kong Democracy Movement History')).toBeTruthy();
    expect(screen.getByText('Uyghur Rights Advocacy')).toBeTruthy();
    expect(screen.getByText('Fact-Checking & Verification')).toBeTruthy();
  });

  it('shows 5 category filter buttons', () => {
    renderEducation();
    expect(screen.getByText('All Courses')).toBeTruthy();
    expect(screen.getByText('Propaganda Analysis')).toBeTruthy();
    expect(screen.getByText('Digital Security')).toBeTruthy();
    expect(screen.getByText('History & Context')).toBeTruthy();
    expect(screen.getByText('Advocacy & Skills')).toBeTruthy();
  });

  it('filters modules by category', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Propaganda Analysis'));
    expect(screen.getByText('Propaganda Detection Fundamentals')).toBeTruthy();
    expect(screen.queryByText('Digital Security for Activists')).toBeNull();
  });

  it('filters modules by search query', () => {
    renderEducation();
    const searchInput = screen.getByPlaceholderText('Search courses...');
    fireEvent.change(searchInput, { target: { value: 'Hong Kong' } });
    expect(screen.getByText('Hong Kong Democracy Movement History')).toBeTruthy();
    expect(screen.queryByText('Propaganda Detection Fundamentals')).toBeNull();
  });

  it('shows module details when clicked', () => {
    renderEducation();
    const module = screen.getByText('Propaganda Detection Fundamentals').closest('button');
    fireEvent.click(module);
    expect(screen.getAllByText('Topics Covered').length).toBeGreaterThanOrEqual(2); // stat card + details
    expect(screen.getByText('Narrative Techniques')).toBeTruthy();
    expect(screen.getByText('Visual Manipulation')).toBeTruthy();
    expect(screen.getByText(/Course content coming soon/)).toBeTruthy();
  });

  it('shows downloadable resources', () => {
    renderEducation();
    expect(screen.getByText('CCP Propaganda Analysis Report')).toBeTruthy();
    expect(screen.getByText('Digital Security Handbook')).toBeTruthy();
  });

  it('shows history content merged into Learn tab', () => {
    renderEducation();
    // History subsection headers should be visible in Learn tab
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });

  // --- Media Tab ---

  it('switches to Media tab', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Media'));
    // Should show section headers for media content
    expect(screen.getByText('── books ──')).toBeTruthy();
    expect(screen.getByText('── documentaries ──')).toBeTruthy();
    expect(screen.getByText('── propaganda_outlets ──')).toBeTruthy();
  });

  it('does not show removed podcasts section in Media tab', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Media'));
    expect(screen.queryByText('── podcasts ──')).toBeNull();
  });

  // --- Research Tab ---

  it('switches to Research tab', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Research'));
    expect(screen.getByText('── source_verification ──')).toBeTruthy();
  });

  it('does not show removed citation generator in Research tab', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Research'));
    expect(screen.queryByText('── citation_generator ──')).toBeNull();
  });

  // --- Tools Tab ---

  it('switches to Tools tab with FAQ merged in', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('── language_phrases ──')).toBeTruthy();
    expect(screen.getByText('── disinfo_tracker ──')).toBeTruthy();
    expect(screen.getByText('── ai_detector ──')).toBeTruthy();
    expect(screen.getByText('── confucius_institutes ──')).toBeTruthy();
    expect(screen.getByText('── faq ──')).toBeTruthy();
  });

  it('does not show removed knowledge quiz in Tools tab', () => {
    renderEducation();
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.queryByText('── knowledge_quiz ──')).toBeNull();
  });

  // --- Module card accessibility ---

  it('has aria-pressed on module cards', () => {
    renderEducation();
    const moduleCards = screen.getAllByText('Propaganda Detection Fundamentals');
    const moduleButton = moduleCards[0].closest('button');
    expect(moduleButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(moduleButton);
    // After click, the title appears twice (card + details), re-query
    const updatedCards = screen.getAllByText('Propaganda Detection Fundamentals');
    const updatedButton = updatedCards[0].closest('button');
    expect(updatedButton.getAttribute('aria-pressed')).toBe('true');
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = renderEducation();
    // motion.div would generate elements with data-projection-id or similar
    // Since we replaced all motion.div with div, there should be no motion attributes
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });
});
