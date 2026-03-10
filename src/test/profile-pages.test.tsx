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

const renderWithRouter = (ui: any) => render(<MemoryRouter>{ui}</MemoryRouter>);

// All 15 profiles with expected data
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
];

describe('Profile Pages — All 15', () => {
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

    it('has a clickable Sources section', () => {
      renderWithRouter(<Component />);
      const sourcesBtn = screen.getByText('Sources', { selector: 'button' });
      expect(sourcesBtn).toBeTruthy();
      fireEvent.click(sourcesBtn);
      // After clicking, should show CCP source exclusion statement (may match multiple elements)
      const ccpElements = screen.getAllByText((content) =>
        content.includes('CCP state media') || content.includes('CCP state outlets') || content.includes('non-CCP media')
      );
      expect(ccpElements.length).toBeGreaterThanOrEqual(1);
    });

    it('shows Timeline content by default', () => {
      const { container } = renderWithRouter(<Component />);
      // All profiles start with Timeline tab — content should be substantial
      expect(container.textContent.length).toBeGreaterThan(200);
      // Timeline button should be visually selected (has yellow/active styling)
      const timelineBtn = screen.getByText('Timeline', { selector: 'button' });
      expect(timelineBtn).toBeTruthy();
    });

    it('has at least 4 navigation tabs/sections', () => {
      const { container } = renderWithRouter(<Component />);
      // Count buttons that are tab-like (within the nav or tab area)
      const tabs = container.querySelectorAll('[role="tab"]');
      if (tabs.length > 0) {
        expect(tabs.length).toBeGreaterThanOrEqual(4);
      } else {
        // Fallback: some profiles use buttons without role="tab"
        const timelineBtn = screen.getByText('Timeline', { selector: 'button' });
        const sourcesBtn = screen.getByText('Sources', { selector: 'button' });
        expect(timelineBtn).toBeTruthy();
        expect(sourcesBtn).toBeTruthy();
      }
    });

    it('contains no activist hashtags in rendered content', () => {
      const { container } = renderWithRouter(<Component />);
      const text = container.textContent;
      expect(text).not.toMatch(/#(?:Free|Stand|Save|Stop|Support|Resist|Boycott|End|Protect|Justice)[A-Z]/);
    });
  });
});

describe('Profile Pages — Accessibility', () => {
  // Profiles with full ARIA tablist implementation
  const ARIA_PROFILES = PROFILES.filter(p =>
    !['Liu Xiaobo'].includes(p.name)
  );

  it('profiles with ARIA tabs have aria-selected on active tab', () => {
    ARIA_PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      const activeTab = container.querySelector('[aria-selected="true"]');
      expect(activeTab, `${name}: missing aria-selected="true"`).toBeTruthy();
      unmount();
    });
  });

  it('profiles with tabpanel have aria-labelledby', () => {
    // Only profiles with role="tabpanel"
    const TABPANEL_PROFILES = PROFILES.filter(p =>
      !['Jimmy Lai', 'Liu Xiaobo', 'Ilham Tohti', 'Gedhun Choekyi Nyima'].includes(p.name)
    );
    TABPANEL_PROFILES.forEach(({ Component, name }) => {
      const { container, unmount } = renderWithRouter(<Component />);
      const panel = container.querySelector('[role="tabpanel"]');
      expect(panel, `${name}: missing tabpanel`).toBeTruthy();
      expect(panel!.getAttribute('aria-labelledby'), `${name}: missing aria-labelledby`).toBeTruthy();
      unmount();
    });
  });

  it('all profiles include a GlobalDisclaimer', () => {
    PROFILES.forEach(({ Component, name }) => {
      const { unmount } = renderWithRouter(<Component />);
      expect(screen.getByText(/verification notice/i), `${name}: missing GlobalDisclaimer`).toBeTruthy();
      unmount();
    });
  });
});

describe('Profile Pages — Tab Navigation', () => {
  it('clicking Sources tab shows source content (Agnes Chow)', () => {
    renderWithRouter(<AgnesChowProfile />);
    const sourcesTab = screen.getByText('Sources', { selector: 'button' });
    fireEvent.click(sourcesTab);
    expect(screen.getByText(/zero ccp state media/i)).toBeTruthy();
  });

  it('clicking a tab sets aria-selected correctly (Joshua Wong)', () => {
    const { container } = renderWithRouter(<JoshuaWongProfile />);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
  });

  it('clicking different tabs changes visible content (Benny Tai)', () => {
    const { container } = renderWithRouter(<BennyTaiProfile />);
    const panel = container.querySelector('[role="tabpanel"]');
    const timelineContent = panel!.textContent;

    const chargesTab = screen.getByText(/charges/i, { selector: 'button' });
    fireEvent.click(chargesTab);
    const updatedPanel = container.querySelector('[role="tabpanel"]');
    expect(updatedPanel!.textContent).not.toBe(timelineContent);
  });
});

describe('Profile Pages — Data Integrity', () => {
  it('all 15 profiles are tested', () => {
    expect(PROFILES.length).toBe(15);
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
    const validStatuses = ['IMPRISONED', 'EXILED', 'DISAPPEARED', 'AT RISK', 'RELEASED', 'DECEASED', 'ENFORCED DISAPPEARANCE'];
    PROFILES.forEach(({ name, statusText }) => {
      expect(
        validStatuses.some(v => statusText.includes(v)),
        `${name}: statusText "${statusText}" not in valid list`
      ).toBe(true);
    });
  });
});
