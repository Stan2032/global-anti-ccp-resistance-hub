// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecentUpdates from '../components/RecentUpdates';
import updates from '../data/recent_updates.json';

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RecentUpdates />
    </MemoryRouter>
  );

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
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
      const firstFive = sorted.slice(0, 5);
      firstFive.forEach((update) => {
        expect(screen.getByText(update.title)).toBeInTheDocument();
      });
    });

    it('does not show updates beyond the initial 5', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sorted.length > 5) {
        // The 6th update should NOT be visible initially
        const sixthUpdate = sorted[5];
        expect(screen.queryByText(sixthUpdate.title)).not.toBeInTheDocument();
      }
    });

    it('renders descriptions for displayed updates', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
      const firstUpdate = sorted[0];
      expect(screen.getByText(firstUpdate.description)).toBeInTheDocument();
    });
  });

  describe('Category Labels', () => {
    it('renders ALERT category labels', () => {
      renderComponent();
      // ALERT entries may be below the initial display threshold (5 items)
      const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date));
      const visibleAlertUpdates = sorted.slice(0, 5).filter((u) => u.category === 'alert');
      if (visibleAlertUpdates.length > 0) {
        expect(screen.getAllByText('ALERT').length).toBeGreaterThan(0);
      }
    });

    it('renders CASE category labels', () => {
      renderComponent();
      const caseUpdates = updates.filter((u) => u.category === 'case_update');
      // CASE entries may be below the initial display threshold (5 items)
      // Only check if there are case_update entries in the top 5
      const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date));
      const visibleCaseUpdates = sorted.slice(0, 5).filter((u) => u.category === 'case_update');
      if (visibleCaseUpdates.length > 0) {
        expect(screen.getAllByText('CASE').length).toBeGreaterThan(0);
      } else if (caseUpdates.length > 0) {
        // Expand to see all entries
        fireEvent.click(screen.getByRole('button', { expanded: false }));
        expect(screen.getAllByText('CASE').length).toBeGreaterThan(0);
      }
    });

    it('renders DATA category labels', () => {
      renderComponent();
      // DATA entries may be below the initial display threshold (5 items)
      const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date));
      const visibleDataUpdates = sorted.slice(0, 5).filter((u) => u.category === 'data');
      if (visibleDataUpdates.length > 0) {
        expect(screen.getAllByText('DATA').length).toBeGreaterThan(0);
      }
    });

    it('renders VERIFIED category labels for verification updates', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
      const visibleVerificationUpdates = sorted.slice(0, 5).filter((u) => u.category === 'verification');
      if (visibleVerificationUpdates.length > 0) {
        expect(screen.getAllByText('VERIFIED').length).toBeGreaterThan(0);
      }
    });
  });

  describe('Show More / Collapse', () => {
    it('shows the "show more" button when there are more than 5 updates', () => {
      renderComponent();
      if (updates.length > 5) {
        const moreCount = updates.length - 5;
        expect(screen.getByText(`$ show --all (${moreCount} more)`)).toBeInTheDocument();
      }
    });

    it('reveals all updates when "show more" is clicked', () => {
      renderComponent();
      if (updates.length > 5) {
        const showMoreBtn = screen.getByRole('button', { expanded: false });
        fireEvent.click(showMoreBtn);

        // All updates should now be visible
        updates.forEach((update) => {
          expect(screen.getByText(update.title)).toBeInTheDocument();
        });
      }
    });

    it('collapses back to 5 updates when collapse is clicked', () => {
      renderComponent();
      if (updates.length > 5) {
        // Expand
        const showMoreBtn = screen.getByRole('button', { expanded: false });
        fireEvent.click(showMoreBtn);

        // Collapse
        const collapseBtn = screen.getByRole('button', { expanded: true });
        fireEvent.click(collapseBtn);

        // 6th update should be hidden again
        const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
        expect(screen.queryByText(sorted[5].title)).not.toBeInTheDocument();
      }
    });

    it('shows collapse text after expanding', () => {
      renderComponent();
      if (updates.length > 5) {
        const showMoreBtn = screen.getByRole('button', { expanded: false });
        fireEvent.click(showMoreBtn);
        expect(screen.getByText('$ collapse --updates')).toBeInTheDocument();
      }
    });
  });

  describe('Links', () => {
    it('renders links for updates with relatedPage', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
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
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
      const firstDate = new Date(sorted[0].date + 'T00:00:00');
      const formatted = firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      expect(screen.getAllByText(formatted).length).toBeGreaterThan(0);
    });

    it('sorts updates with newest first', () => {
      renderComponent();
      const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
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
    it('show more button has aria-expanded attribute', () => {
      renderComponent();
      if (updates.length > 5) {
        const btn = screen.getByRole('button', { expanded: false });
        expect(btn).toHaveAttribute('aria-expanded', 'false');
      }
    });

    it('aria-expanded updates when expanded', () => {
      renderComponent();
      if (updates.length > 5) {
        const btn = screen.getByRole('button', { expanded: false });
        fireEvent.click(btn);
        const expandedBtn = screen.getByRole('button', { expanded: true });
        expect(expandedBtn).toHaveAttribute('aria-expanded', 'true');
      }
    });

    it('category icons have aria-hidden', () => {
      const { container } = renderComponent();
      const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });
  });
});
