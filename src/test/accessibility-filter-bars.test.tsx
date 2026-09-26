import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import ActivistToolkit from '../components/ActivistToolkit';
import ConfuciusInstitutes from '../components/ConfuciusInstitutes';
import DiasporaSupport from '../components/DiasporaSupport';
import DisinfoTracker from '../components/DisinfoTracker';
import DocumentaryList from '../components/DocumentaryList';
import DonationGuide from '../components/DonationGuide';
import EventCalendar from '../components/EventCalendar';
import FAQ from '../components/FAQ';
import IPACMembers from '../components/IPACMembers';
import MediaManipulation from '../components/MediaManipulation';
import SanctionsTracker from '../components/SanctionsTracker';
import SuccessStories from '../components/SuccessStories';
import SurvivorStories from '../components/SurvivorStories';
import ProfilesIndex from '../pages/profiles/ProfilesIndex';

/**
 * A row of buttons that narrows one list is a filter. These were marked up
 * as tabs, so a screen reader announced "tab, 1 of 6" and promised a panel
 * for each, with arrow keys to move between them. Neither existed. Each row
 * is now a named group of toggle buttons that say whether they are on.
 */
const FILTER_BARS: { component: string; ui: ReactElement; groups: string[] }[] = [
  { component: 'ActivistToolkit', ui: <ActivistToolkit />, groups: ['Filter resources by category'] },
  { component: 'ConfuciusInstitutes', ui: <ConfuciusInstitutes />, groups: ['Filter institutes by region'] },
  { component: 'DiasporaSupport', ui: <DiasporaSupport />, groups: ['Filter diaspora support by category'] },
  { component: 'DisinfoTracker', ui: <DisinfoTracker />, groups: ['Filter disinformation by topic'] },
  { component: 'DocumentaryList', ui: <DocumentaryList />, groups: ['Filter documentaries by topic'] },
  {
    component: 'DonationGuide',
    ui: <DonationGuide />,
    groups: ['Filter organizations by category', 'Filter organizations by cause'],
  },
  { component: 'EventCalendar', ui: <EventCalendar />, groups: ['Filter events by month'] },
  { component: 'FAQ', ui: <FAQ />, groups: ['Filter questions by topic'] },
  { component: 'IPACMembers', ui: <IPACMembers />, groups: ['Filter IPAC members by country'] },
  { component: 'MediaManipulation', ui: <MediaManipulation />, groups: ['Filter outlets by type'] },
  {
    component: 'SanctionsTracker',
    ui: <SanctionsTracker />,
    groups: ['Filter sanctions by country', 'Filter sanctions by type'],
  },
  { component: 'SuccessStories', ui: <SuccessStories />, groups: ['Filter victories by type'] },
  { component: 'SurvivorStories', ui: <SurvivorStories />, groups: ['Filter survivor stories by category'] },
  {
    component: 'ProfilesIndex',
    ui: <MemoryRouter><ProfilesIndex /></MemoryRouter>,
    groups: ['Filter profiles by region'],
  },
];

const pressed = (buttons: HTMLElement[]) =>
  buttons.filter(b => b.getAttribute('aria-pressed') === 'true');

describe('Filter bars are toggle buttons, not tabs', () => {
  for (const { component, ui, groups } of FILTER_BARS) {
    describe(component, () => {
      it('has no tab roles', () => {
        render(ui);
        expect(screen.queryAllByRole('tablist')).toHaveLength(0);
        expect(screen.queryAllByRole('tab')).toHaveLength(0);
        expect(screen.queryAllByRole('tabpanel')).toHaveLength(0);
      });

      for (const name of groups) {
        it(`"${name}" is a group of plain buttons, the first one on`, () => {
          render(ui);
          const buttons = within(screen.getByRole('group', { name })).getAllByRole('button');
          expect(buttons.length).toBeGreaterThan(1);
          for (const button of buttons) {
            expect(button.getAttribute('type'), button.textContent!).toBe('button');
            expect(button.getAttribute('aria-pressed'), button.textContent!).toMatch(/^(true|false)$/);
          }
          // Each filter starts on "All", so nothing is hidden from a reader
          // without JavaScript, for whom the buttons do nothing.
          expect(pressed(buttons)).toEqual([buttons[0]]);
        });

        it(`"${name}" turns on the filter clicked, and only that one`, () => {
          render(ui);
          const group = () => screen.getByRole('group', { name });
          const second = within(group()).getAllByRole('button')[1];
          fireEvent.click(second);
          const buttons = within(group()).getAllByRole('button');
          expect(pressed(buttons).map(b => b.textContent)).toEqual([second.textContent]);
        });
      }
    });
  }
});
