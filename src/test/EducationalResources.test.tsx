import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import educationalData from '../data/educational_modules.json';

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

const renderEducation = () => render(<MemoryRouter><EducationalResources /></MemoryRouter>);
/** The closed section listing the courses and downloads nobody wrote. */
const outlines = () => document.getElementById('course-outlines') as HTMLDetailsElement;

describe('EducationalResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    renderEducation();
    expect(screen.getByText('Education Center')).toBeTruthy();
    expect(screen.getByText(/History, testimony, research and tools/)).toBeTruthy();
  });

  it('renders the groups as headings', () => {
    renderEducation();
    expect(screen.getByText('── history_and_context ──')).toBeTruthy();
    expect(screen.getByText('── media ──')).toBeTruthy();
    expect(screen.getByText('── research ──')).toBeTruthy();
    expect(screen.getByText('── tools ──')).toBeTruthy();
    expect(screen.getByText('── not_yet_written ──')).toBeTruthy();
  });

  it('does not render removed tabs (FAQ, History, Progress)', () => {
    renderEducation();
    const labels = screen.queryAllByRole('button').map(b => b.textContent);
    expect(labels).not.toContain('FAQ');
    expect(labels).not.toContain('History');
    expect(labels).not.toContain('Progress');
  });

  // --- Courses and downloads that were never written ---
  // The page opened with "Total Courses 5 — Comprehensive modules",
  // "Resources 5 — Downloadable materials" and "Topics Covered 20+" (the data
  // lists 19), then five course cards with durations and lesson counts. Every
  // course ended "Course content coming soon", and every download was a
  // disabled icon with an invented file size.

  it('claims no courses, downloads or counts that do not exist', () => {
    const { container } = renderEducation();
    for (const claim of ['Total Courses', 'Downloadable materials', 'Comprehensive modules', 'Topics Covered', '20+']) {
      expect(screen.queryByText(claim), claim).toBeNull();
    }
    const text = container.textContent!;
    expect(text).not.toMatch(/Comprehensive training modules/);
    expect(text).not.toMatch(/Course content coming soon/);
    expect(text).not.toMatch(/\b\d+(\.\d+)? hours\b/);
    expect(text).not.toMatch(/\b\d+ lessons\b/);
    expect(text).not.toMatch(/\b\d+(\.\d+)? MB\b/);
  });

  it('lists every course outline in the page, labelled as never written', () => {
    renderEducation();
    const section = outlines();
    expect(section.tagName).toBe('DETAILS');
    expect(section.open).toBe(false);
    expect(section.querySelector('summary')!.textContent).toMatch(/never written/);
    const { modules } = educationalData;
    expect(modules.length).toBeGreaterThan(0);
    for (const module of modules) {
      const card = [...section.querySelectorAll('article')]
        .find(a => a.querySelector('h3')?.textContent === module.title);
      expect(card, module.title).toBeTruthy();
      expect(card!.textContent).toContain(module.description);
      for (const topic of module.topics) expect(card!.textContent).toContain(topic);
    }
  });

  it('lists the downloads as not existing, with nothing to click', () => {
    renderEducation();
    const section = outlines();
    const { resources } = educationalData;
    expect(resources.length).toBeGreaterThan(0);
    for (const resource of resources) expect(section.textContent).toContain(resource.title);
    expect(section.textContent).toMatch(/none of the downloads exists/);
    expect(section.querySelectorAll('button, a[download]')).toHaveLength(0);
  });

  // Each course card was a button that showed its topics in a panel below
  // the grid, so without JavaScript no topic could be read.
  it('shows each outline without a click: no module is a button, no search over them', () => {
    const { container } = renderEducation();
    expect(container.querySelectorAll('button[aria-pressed]')).toHaveLength(0);
    expect(screen.queryByLabelText('Search courses')).toBeNull();
  });

  it('shows history content merged into Learn tab', async () => {
    renderEducation();
    // HistoricalDocuments is lazy-loaded into the Learn tab; assert it
    // actually renders rather than the transient Suspense fallback, which
    // React does not guarantee is observable when the chunk resolves
    // immediately.
    expect(await screen.findByText('HistoricalDocuments')).toBeTruthy();
  });

  // --- Every section, without interaction ---

  /*
   * These four groups were JavaScript tabs, and only the active one was ever
   * rendered. The pre-rendered HTML therefore held the Learn panel and
   * nothing else: sixteen of the page's twenty-two sections never reached a
   * reader with JavaScript disabled, and the tab buttons did nothing when
   * clicked. This site tells readers in China to use Tor Browser on Safer or
   * Safest, which disables JavaScript.
   *
   * So the guarantee under test is no longer "clicking a tab reveals X" but
   * the stronger "X is already there". Nothing below clicks anything.
   */

  it('has every section present without any interaction', () => {
    renderEducation();
    for (const title of [
      // history_and_context
      'Interactive timeline', 'Survivor stories', 'Glossary',
      'Historical documents', 'Key dates', 'Survivor testimonies',
      // media
      'Books', 'Documentaries', 'Propaganda outlets', 'Media bias guide',
      'Video testimonials',
      // research
      'Content analytics', 'Timeline gap analysis', 'Research papers',
      'Source verification', 'Academic experts', 'Human rights organisations',
      // tools
      'Language phrases', 'Disinformation tracker', 'AI disinformation detector',
      'Confucius Institutes', 'FAQ',
      // not_yet_written
      'Course outlines',
    ]) {
      // queryAllByText, not getByText: a few titles also match the mocked
      // component's own output (the FAQ mock renders the text "FAQ").
      expect(
        screen.queryAllByText(title).length,
        `${title} is missing from the page`
      ).toBeGreaterThan(0);
    }
  });

  it('uses native <details> so the sections open without JavaScript', () => {
    const { container } = renderEducation();
    // The 22 sections and the course outlines; cards inside them (FAQ
    // answers, directory entries) are <details> too, and are not counted here.
    const sections = [...container.querySelectorAll('details')].filter(d => !d.parentElement!.closest('details'));
    expect(sections.length).toBe(23);
    // Collapsed, but in the document — folded, not withheld.
    expect(sections.filter(d => d.hasAttribute('open')).length).toBe(0);
    sections.forEach(d => expect(d.firstElementChild?.tagName).toBe('SUMMARY'));
  });

  // --- Sections deliberately removed earlier stay removed ---

  it('does not show the removed podcasts section', () => {
    renderEducation();
    expect(screen.queryByText('── podcasts ──')).toBeNull();
    expect(screen.queryByText('Podcasts')).toBeNull();
  });

  it('does not show the removed citation generator', () => {
    renderEducation();
    expect(screen.queryByText('── citation_generator ──')).toBeNull();
    expect(screen.queryByText('Citation generator')).toBeNull();
  });

  it('does not show the removed knowledge quiz', () => {
    renderEducation();
    expect(screen.queryByText('── knowledge_quiz ──')).toBeNull();
    expect(screen.queryByText('Knowledge quiz')).toBeNull();
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
