import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecentUpdates from '../components/RecentUpdates';
import updates from '../data/recent_updates.json';

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RecentUpdates />
    </MemoryRouter>
  );

// Updates after the newest five sit in one native <details>.
const earlier = () => {
  const details = screen.getByText(/\$ show --all/).closest('details');
  expect(details, 'the earlier updates are a <details>').toBeTruthy();
  return details as HTMLDetailsElement;
};

describe('RecentUpdates', () => {
  describe('Rendering', () => {
    it('renders the section header', () => {
      renderComponent();
      expect(screen.getByText('recent_updates')).toBeInTheDocument();
    });

    it('shows the entry count', () => {
      renderComponent();
      expect(screen.getByText(`${updates.length} entries`)).toBeInTheDocument();
    });

    it('renders the first 5 updates by default', () => {
      renderComponent();
      // Sort updates by date descending to match component behavior
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const firstFive = sorted.slice(0, 5);
      firstFive.forEach((update) => {
        expect(screen.getByText(update.title)).toBeInTheDocument();
      });
    });

    it('keeps the earlier updates in the page, folded away', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      expect(sorted.length).toBeGreaterThan(5);
      const sixth = screen.getByText(sorted[5].title);
      expect(sixth.closest('details')).toBe(earlier());
      expect(earlier().open).toBe(false);
    });

    it('renders descriptions for displayed updates', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const firstUpdate = sorted[0];
      expect(screen.getByText(firstUpdate.description)).toBeInTheDocument();
    });
  });

  describe('Category Labels', () => {
    it('renders an ALERT label for every alert', () => {
      renderComponent();
      expect(updates.filter((u) => u.category === 'alert').length).toBeGreaterThan(0);
      expect(screen.getAllByText('ALERT')).toHaveLength(updates.filter((u) => u.category === 'alert').length);
    });

    it('renders a CASE label for every case update', () => {
      renderComponent();
      expect(updates.filter((u) => u.category === 'case_update').length).toBeGreaterThan(0);
      expect(screen.getAllByText('CASE')).toHaveLength(updates.filter((u) => u.category === 'case_update').length);
    });

    it('renders a DATA label for every data update', () => {
      renderComponent();
      expect(updates.filter((u) => u.category === 'data').length).toBeGreaterThan(0);
      expect(screen.getAllByText('DATA').length).toBeGreaterThanOrEqual(updates.filter((u) => u.category === 'data').length);
    });

    it('renders a VERIFIED label for every verification update', () => {
      renderComponent();
      expect(screen.queryAllByText('VERIFIED')).toHaveLength(updates.filter((u) => u.category === 'verification').length);
    });
  });

  describe('Show More / Collapse', () => {
    it('says how many earlier updates are folded away', () => {
      renderComponent();
      expect(updates.length).toBeGreaterThan(5);
      expect(within(earlier().querySelector('summary')!).getByText(`$ show --all (${updates.length - 5} more)`)).toBeInTheDocument();
    });

    it('has every update in the page without a click', () => {
      renderComponent();
      updates.forEach((update) => {
        expect(screen.getByText(update.title)).toBeInTheDocument();
      });
    });

    it('opens and folds the earlier updates natively', () => {
      renderComponent();
      fireEvent.click(earlier().querySelector('summary')!);
      expect(earlier().open).toBe(true);
      fireEvent.click(earlier().querySelector('summary')!);
      expect(earlier().open).toBe(false);
    });

    it('offers "$ collapse --updates" once open', () => {
      // The two labels swap with CSS (summary-open:), which jsdom does not apply.
      renderComponent();
      const collapse = within(earlier().querySelector('summary')!).getByText('$ collapse --updates');
      expect(collapse.className).toMatch(/(^|\s)hidden(\s|$)/);
      expect(collapse.className).toContain('summary-open:inline');
    });
  });

  describe('Links', () => {
    it('renders links for updates with relatedPage', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const firstFive = sorted.slice(0, 5);
      const linkedUpdates = firstFive.filter((u) => u.relatedPage);

      linkedUpdates.forEach((update) => {
        const link = screen.getByText(update.title).closest('a');
        expect(link).toHaveAttribute('href', update.relatedPage);
      });
    });
  });

  describe('Dates', () => {
    it('renders formatted dates for displayed updates', () => {
      renderComponent();
      // Check that at least one formatted date appears (e.g. "Mar 3, 2026")
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const firstDate = new Date(sorted[0].date + 'T00:00:00');
      const formatted = firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      expect(screen.getAllByText(formatted).length).toBeGreaterThan(0);
    });

    it('sorts updates with newest first', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const firstTitle = sorted[0].title;
      const secondTitle = sorted[1].title;
      // First entry should appear before second in the DOM
      const firstEl = screen.getByText(firstTitle);
      const secondEl = screen.getByText(secondTitle);
      expect(firstEl.compareDocumentPosition(secondEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('Data Integrity', () => {
    it('all updates have required fields', () => {
      updates.forEach((update) => {
        expect(update.id).toBeTruthy();
        expect(update.date).toBeTruthy();
        expect(update.category).toBeTruthy();
        expect(update.title).toBeTruthy();
        expect(update.description).toBeTruthy();
      });
    });

    it('all dates are valid ISO format', () => {
      updates.forEach((update) => {
        expect(update.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsed = new Date(update.date);
        expect(parsed.toString()).not.toBe('Invalid Date');
      });
    });

    it('all IDs are unique', () => {
      const ids = updates.map((u) => u.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all categories are valid', () => {
      const validCategories = ['alert', 'data', 'verification', 'case_update', 'new_case', 'new_entry', 'report'];
      updates.forEach((update) => {
        expect(validCategories).toContain(update.category);
      });
    });

    it('contains at least 10 updates', () => {
      expect(updates.length).toBeGreaterThanOrEqual(10);
    });

    it('no entries reference CCP state media sources', () => {
      updates.forEach((update) => {
        const text = (update.description + update.title).toLowerCase();
        expect(text).not.toContain('xinhua');
        expect(text).not.toContain('global times');
        expect(text).not.toContain('people\'s daily');
        expect(text).not.toContain('cgtn');
        expect(text).not.toContain('china daily');
      });
    });
  });

  describe('Accessibility', () => {
    it('uses a native disclosure, not a JavaScript-only toggle', () => {
      const { container } = renderComponent();
      expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
      expect(earlier().firstElementChild?.tagName).toBe('SUMMARY');
    });

    it('category icons have aria-hidden', () => {
      const { container } = renderComponent();
      const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });
  });
});
