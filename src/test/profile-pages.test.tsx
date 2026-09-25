import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Import all 15 profile pages
import AgnesChowProfile from '../pages/profiles/AgnesChowProfile';
import BennyTaiProfile from '../pages/profiles/BennyTaiProfile';
import CardinalZenProfile from '../pages/profiles/CardinalZenProfile';
import GaoZhishengProfile from '../pages/profiles/GaoZhishengProfile';
import GuiMinhaiProfile from '../pages/profiles/GuiMinhaiProfile';
import IlhamTohtiProfile from '../pages/profiles/IlhamTohtiProfile';
import JimmyLaiProfile from '../pages/profiles/JimmyLaiProfile';
import JoshuaWongProfile from '../pages/profiles/JoshuaWongProfile';
import LiuXiaoboProfile from '../pages/profiles/LiuXiaoboProfile';
import NathanLawProfile from '../pages/profiles/NathanLawProfile';
import PanchenLamaProfile from '../pages/profiles/PanchenLamaProfile';
import RenZhiqiangProfile from '../pages/profiles/RenZhiqiangProfile';
import TashiWangchukProfile from '../pages/profiles/TashiWangchukProfile';
import XuZhiyongProfile from '../pages/profiles/XuZhiyongProfile';
import ZhangZhanProfile from '../pages/profiles/ZhangZhanProfile';
import ChowHangTungProfile from '../pages/profiles/ChowHangTungProfile';

const renderWithRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

// All 16 profiles with expected data
// statusText: what to search for in rendered output (some profiles render status differently)
// backLink: the "Back to..." text varies by profile
const PROFILES = [
  { Component: AgnesChowProfile, name: 'Agnes Chow', chinese: '周庭', statusText: 'EXILED', backLink: 'Back to Profiles' },
  { Component: BennyTaiProfile, name: 'Benny Tai', chinese: '戴耀廷', statusText: 'IMPRISONED', backLink: 'Back to Profiles' },
  { Component: CardinalZenProfile, name: 'Cardinal Joseph Zen', chinese: '陳日君', statusText: 'AT RISK', backLink: 'Back to Profiles' },
  { Component: GaoZhishengProfile, name: 'Gao Zhisheng', chinese: '高智晟', statusText: 'DISAPPEARED', backLink: 'Back to Profiles' },
  { Component: GuiMinhaiProfile, name: 'Gui Minhai', chinese: '桂民海', statusText: 'IMPRISONED', backLink: 'Back to Profiles' },
  { Component: IlhamTohtiProfile, name: 'Ilham Tohti', chinese: '伊力哈木·土赫提', statusText: 'IMPRISONED', backLink: 'Back to Political Prisoners' },
  { Component: JimmyLaiProfile, name: 'Jimmy Lai', chinese: '黎智英', statusText: 'IMPRISONED', backLink: 'Back to Political Prisoners' },
  { Component: JoshuaWongProfile, name: 'Joshua Wong', chinese: '黃之鋒', statusText: 'IMPRISONED', backLink: 'Back to Political Prisoners' },
  { Component: LiuXiaoboProfile, name: 'Liu Xiaobo', chinese: '刘晓波', statusText: 'DECEASED', backLink: 'Back to Take Action' },
  { Component: NathanLawProfile, name: 'Nathan Law', chinese: '羅冠聰', statusText: 'EXILED', backLink: 'Back to Profiles' },
  { Component: PanchenLamaProfile, name: 'Gedhun Choekyi Nyima', chinese: null, statusText: 'ENFORCED DISAPPEARANCE', backLink: 'Back to Take Action' },
  { Component: RenZhiqiangProfile, name: 'Ren Zhiqiang', chinese: '任志强', statusText: 'IMPRISONED', backLink: 'Back to Profiles' },
  { Component: TashiWangchukProfile, name: 'Tashi Wangchuk', chinese: '扎西文色', statusText: 'RELEASED', backLink: 'Back to Profiles' },
  { Component: XuZhiyongProfile, name: 'Xu Zhiyong', chinese: '许志永', statusText: 'IMPRISONED', backLink: 'Back to Profiles' },
  { Component: ZhangZhanProfile, name: 'Zhang Zhan', chinese: '张展', statusText: 'IMPRISONED', backLink: 'Back to Profiles' },
  { Component: ChowHangTungProfile, name: 'Chow Hang-Tung', chinese: '鄒幸彤', statusText: 'DETAINED', backLink: 'Back to Profiles' },
];

describe('Profile Pages — All 16', () => {
  // ─── RENDER & HEADER ────────────────────────────────────────
  describe.each(PROFILES)('$name', ({ Component, name, chinese, statusText, backLink }) => {
    it('renders without crashing', () => {
      const { container } = renderWithRouter(<Component />);
      expect(container.querySelector('div')).toBeTruthy();
    });

    it('displays the person\'s name', () => {
      renderWithRouter(<Component />);
      const nameElements = screen.getAllByText(name);
      expect(nameElements.length).toBeGreaterThanOrEqual(1);
    });

    if (chinese) {
      it('displays Chinese name', () => {
        renderWithRouter(<Component />);
        expect(screen.getByText(chinese)).toBeTruthy();
      });
    }

    it('shows a status indicator', () => {
      renderWithRouter(<Component />);
      expect(screen.getByText((content) => content.includes(statusText))).toBeTruthy();
    });

    it('has a back navigation link', () => {
      renderWithRouter(<Component />);
      expect(screen.getByText(backLink)).toBeTruthy();
    });

    /*
     * These sections used to be JavaScript tabs, and only the active one was
     * ever rendered. Four of the five — the charges and verdict, the CCP
     * narrative analysis, the international response, and the SOURCES — were
     * absent from the pre-rendered HTML and unreachable for a reader with
     * JavaScript disabled. On a site whose credibility rests on its sourcing,
     * the source list required JavaScript to see.
     *
     * So these assert presence, not clicking. Nothing below clicks anything.
     */

    it('has its sources present without any interaction', () => {
      renderWithRouter(<Component />);
      const ccpElements = screen.getAllByText((content) =>
        content.includes('CCP state media') || content.includes('CCP state outlets') || content.includes('non-CCP media')
      );
      expect(ccpElements.length).toBeGreaterThanOrEqual(1);
    });

    it('opens on the timeline and has substantial content', () => {
      const { container } = renderWithRouter(<Component />);
      expect(container.textContent.length).toBeGreaterThan(200);
      const open = container.querySelectorAll('details[open]');
      expect(open.length, 'exactly one section should start open').toBe(1);
      expect(open[0].querySelector('summary')?.textContent).toMatch(/timeline/i);
    });

    it('has at least 4 sections, all as native <details>', () => {
      const { container } = renderWithRouter(<Component />);
      const details = container.querySelectorAll('details');
      expect(details.length).toBeGreaterThanOrEqual(4);
      // A <summary> per section: the browser's own control, which works with
      // JavaScript disabled. A React-state tab bar would not.
      expect(container.querySelectorAll('details > summary').length).toBe(details.length);
      // And no tab machinery left behind.
      expect(container.querySelectorAll('[role="tab"]').length).toBe(0);
    });

    it('contains no activist hashtags in rendered content', () => {
      const { container } = renderWithRouter(<Component />);
      const text = container.textContent;
      expect(text).not.toMatch(/#(?:Free|Stand|Save|Stop|Support|Resist|Boycott|End|Protect|Justice)[A-Z]/);
    });
  });
});

describe('Profile Pages — Accessibility', () => {
  it('every profile exposes its sections as native disclosures', () => {
    PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      const details = container.querySelectorAll('details');
      expect(details.length, `${name}: no <details> sections`).toBeGreaterThanOrEqual(4);
      details.forEach(d => {
        expect(d.firstElementChild?.tagName.toLowerCase(), `${name}: <details> without a leading <summary>`).toBe('summary');
      });
      unmount();
    });
  });

  it('no profile hides content behind a JavaScript-only tab', () => {
    // The whole point. role="tab" here would mean the other panels are not
    // rendered, which is how four of five sections went missing for readers
    // with JavaScript disabled.
    PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      expect(container.querySelectorAll('[role="tab"]').length, `${name}: still has ARIA tabs`).toBe(0);
      expect(container.querySelectorAll('[role="tabpanel"]').length, `${name}: still has a tabpanel`).toBe(0);
      unmount();
    });
  });

  it('no profile hides content behind a JavaScript-only expander', () => {
    // The same failure one level down: a button with aria-expanded renders its
    // panel only after a click, so timeline details, their sources and extra
    // narratives never reached a reader with JavaScript off. Everything on a
    // profile opens natively now.
    PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      expect(container.querySelectorAll('[aria-expanded]').length, `${name}: still has a JS-only expander`).toBe(0);
      unmount();
    });
  });

  it('every timeline event carries its detail and source without a click', () => {
    PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      const events = container.querySelectorAll('ol > li > details');
      expect(events.length, `${name}: no timeline events`).toBeGreaterThanOrEqual(8);
      const sourced = [...events].filter(d => d.querySelector('a[href^="http"]'));
      expect(sourced.length, `${name}: timeline events carry no sources`).toBeGreaterThan(0);
      unmount();
    });
  });

  it('all profiles include a GlobalDisclaimer', () => {
    PROFILES.forEach(({ Component, name }) => {
      const { unmount } = renderWithRouter(<Component />);
      // getAllBy: with every section rendered rather than just the active
      // tab, the verification wording can legitimately appear more than once.
      expect(screen.getAllByText(/verification notice/i).length, `${name}: missing GlobalDisclaimer`).toBeGreaterThanOrEqual(1);
      unmount();
    });
  });
});

describe('Profile Pages — Sections', () => {
  it('Agnes Chow shows source content without clicking', () => {
    renderWithRouter(<AgnesChowProfile />);
    expect(screen.getAllByText(/zero ccp state media/i).length).toBeGreaterThanOrEqual(1);
  });

  it('Joshua Wong opens on the timeline with the rest collapsed', () => {
    const { container } = renderWithRouter(<JoshuaWongProfile />);
    const details = [...container.querySelectorAll('details')];
    expect(details.filter(d => d.hasAttribute('open')).length).toBe(1);
    expect(details.length).toBeGreaterThanOrEqual(4);
  });

  it('Benny Tai has every section in the document at once', () => {
    const { container } = renderWithRouter(<BennyTaiProfile />);
    const summaries = [...container.querySelectorAll('details > summary')].map(s => s.textContent ?? '');
    expect(summaries.length).toBeGreaterThanOrEqual(4);
    expect(summaries.some(t => /timeline/i.test(t))).toBe(true);
    expect(summaries.some(t => /charge/i.test(t))).toBe(true);
    expect(summaries.some(t => /source/i.test(t))).toBe(true);
  });
});

describe('Profile Pages — Data Integrity', () => {
  it('all 16 profiles are tested', () => {
    expect(PROFILES.length).toBe(16);
  });

  it('no two profiles share the same name', () => {
    const names = PROFILES.map(p => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('no two profiles share the same Chinese name', () => {
    const chineseNames = PROFILES.filter(p => p.chinese).map(p => p.chinese);
    expect(new Set(chineseNames).size).toBe(chineseNames.length);
  });

  it('all profile statuses are recognized values', () => {
    const validStatuses = ['IMPRISONED', 'EXILED', 'DISAPPEARED', 'AT RISK', 'RELEASED', 'DECEASED', 'ENFORCED DISAPPEARANCE', 'DETAINED'];
    PROFILES.forEach(({ name, statusText }) => {
      expect(
        validStatuses.some(v => statusText.includes(v)),
        `${name}: statusText "${statusText}" not in valid list`
      ).toBe(true);
    });
  });
});
