import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import GlobalSearch, { useGlobalSearch } from '../components/GlobalSearch';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearch(props = {}) {
  return render(
    <MemoryRouter>
      <GlobalSearch isOpen={true} onClose={vi.fn()} {...props} />
    </MemoryRouter>
  );
}

describe('GlobalSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ═══════════════════════════════════════════════════════════
  // 1. RENDERING
  // ═══════════════════════════════════════════════════════════

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <GlobalSearch isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders search modal when isOpen is true', () => {
    renderSearch();
    expect(screen.getByLabelText('Global search')).toBeTruthy();
  });

  it('renders search input with correct placeholder', () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');
    expect(input.getAttribute('placeholder')).toContain('Search');
  });

  it('shows quick links when no query is entered', () => {
    renderSearch();
    expect(screen.getByText('Quick Links')).toBeTruthy();
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Take Action')).toBeTruthy();
    expect(screen.getByText('Report Incident')).toBeTruthy();
    expect(screen.getByText('Security Quiz')).toBeTruthy();
  });

  it('shows keyboard shortcut hints in footer', () => {
    renderSearch();
    expect(screen.getByText('Navigate')).toBeTruthy();
    expect(screen.getByText('Select')).toBeTruthy();
  });

  // ═══════════════════════════════════════════════════════════
  // 2. SEARCH FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════

  it('returns results matching page titles', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Dashboard' } });
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('Dashboard')).toBeTruthy();
  });

  it('returns results matching profile names', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Jimmy Lai' } });
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
  });

  it('returns results matching keywords', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'xinjiang' } });
      vi.advanceTimersByTime(200);
    });

    // Uyghur Genocide topic and Ilham Tohti profile both have xinjiang keyword
    const results = screen.getAllByRole('option');
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "No results found" for non-matching query', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'zzzznonexistent' } });
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText(/No results found/)).toBeTruthy();
  });

  it('limits results to 10 items maximum', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    // 'a' matches many entries
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
      vi.advanceTimersByTime(200);
    });

    const results = screen.queryAllByRole('option');
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it('clears results when query is emptied', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Dashboard' } });
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
      vi.advanceTimersByTime(200);
    });

    // Quick Links shown instead of results
    expect(screen.getByText('Quick Links')).toBeTruthy();
  });

  // ═══════════════════════════════════════════════════════════
  // 3. SEARCH SCORING
  // ═══════════════════════════════════════════════════════════

  it('ranks title matches higher than keyword matches', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'security' } });
      vi.advanceTimersByTime(200);
    });

    const results = screen.getAllByRole('option');
    // "Security Center" (title match) should appear before "Security Quiz" (keyword match)
    const firstResultText = results[0].textContent;
    expect(firstResultText).toContain('Security Center');
  });

  it('ranks title-starts-with matches higher than contains matches', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'take' } });
      vi.advanceTimersByTime(200);
    });

    const results = screen.getAllByRole('option');
    // "Take Action" (starts with) should be first
    expect(results[0].textContent).toContain('Take Action');
  });

  // ═══════════════════════════════════════════════════════════
  // 4. KEYBOARD NAVIGATION
  // ═══════════════════════════════════════════════════════════

  it('navigates results with ArrowDown key', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hong kong' } });
      vi.advanceTimersByTime(200);
    });

    const results = screen.getAllByRole('option');
    expect(results[0].getAttribute('aria-selected')).toBe('true');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    const updatedResults = screen.getAllByRole('option');
    expect(updatedResults[1].getAttribute('aria-selected')).toBe('true');
    expect(updatedResults[0].getAttribute('aria-selected')).toBe('false');
  });

  it('navigates results with ArrowUp key', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hong kong' } });
      vi.advanceTimersByTime(200);
    });

    // Move down then back up
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    const results = screen.getAllByRole('option');
    expect(results[0].getAttribute('aria-selected')).toBe('true');
  });

  it('does not go below last result with ArrowDown', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Dashboard' } });
      vi.advanceTimersByTime(200);
    });

    const resultCount = screen.getAllByRole('option').length;

    // Press down more times than there are results
    await act(async () => {
      for (let i = 0; i < resultCount + 5; i++) {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      }
    });

    const results = screen.getAllByRole('option');
    const lastResult = results[results.length - 1];
    expect(lastResult.getAttribute('aria-selected')).toBe('true');
  });

  it('does not go above first result with ArrowUp', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Dashboard' } });
      vi.advanceTimersByTime(200);
    });

    // Press up multiple times from first position
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    const results = screen.getAllByRole('option');
    expect(results[0].getAttribute('aria-selected')).toBe('true');
  });

  it('navigates to selected result on Enter', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Dashboard' } });
      vi.advanceTimersByTime(200);
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(onClose).toHaveBeenCalled();
  });

  // ═══════════════════════════════════════════════════════════
  // 5. CLICK INTERACTIONS
  // ═══════════════════════════════════════════════════════════

  it('navigates when result is clicked', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'prisoners' } });
      vi.advanceTimersByTime(200);
    });

    const firstResult = screen.getAllByRole('option')[0];
    fireEvent.click(firstResult);

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('closes modal when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    // Backdrop is the first fixed overlay div
    const backdrop = container.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates via quick link click', () => {
    renderSearch();

    // Quick links are visible when no query
    const prisonersLink = screen.getByText('Political Prisoners');
    fireEvent.click(prisonersLink.closest('button'));

    expect(mockNavigate).toHaveBeenCalledWith('/prisoners');
  });

  // ═══════════════════════════════════════════════════════════
  // 6. ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════

  it('has role="listbox" on results container', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'security' } });
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('has role="option" on each result item', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'security' } });
      vi.advanceTimersByTime(200);
    });

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    options.forEach(opt => {
      expect(opt.getAttribute('aria-selected')).toBeDefined();
    });
  });

  it('marks exactly one result as aria-selected at a time', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hong kong' } });
      vi.advanceTimersByTime(200);
    });

    const selected = screen.getAllByRole('option').filter(
      opt => opt.getAttribute('aria-selected') === 'true'
    );
    expect(selected.length).toBe(1);
  });

  // ═══════════════════════════════════════════════════════════
  // 7. SEARCH INDEX COMPLETENESS
  // ═══════════════════════════════════════════════════════════

  it('indexes all 10 main pages', async () => {
    const pages = [
      'Dashboard', 'Intelligence Feeds', 'Resistance Directory',
      'Political Prisoners', 'Take Action', 'Community',
      'Resources', 'Education Center', 'Security Center', 'Profiles',
    ];

    for (const page of pages) {
      renderSearch();
      const input = screen.getByLabelText('Global search');
      await act(async () => {
        fireEvent.change(input, { target: { value: page } });
        vi.advanceTimersByTime(200);
      });
      const resultTexts = screen.getAllByRole('option').map(el => el.textContent);
      expect(
        resultTexts.some(t => t.includes(page)),
        `Missing page: ${page}`
      ).toBe(true);
      // cleanup for next iteration
      document.body.innerHTML = '';
    }
  });

  it('indexes all 15 prisoner profiles', async () => {
    const profiles = [
      'Jimmy Lai', 'Ilham Tohti', 'Joshua Wong', 'Gedhun Choekyi Nyima',
      'Liu Xiaobo', 'Gui Minhai', 'Zhang Zhan', 'Gao Zhisheng',
      'Agnes Chow', 'Nathan Law', 'Benny Tai', 'Cardinal Zen',
      'Tashi Wangchuk', 'Ren Zhiqiang', 'Xu Zhiyong',
    ];

    for (const name of profiles) {
      renderSearch();
      const input = screen.getByLabelText('Global search');
      await act(async () => {
        fireEvent.change(input, { target: { value: name } });
        vi.advanceTimersByTime(200);
      });
      const resultTexts = screen.getAllByRole('option').map(el => el.textContent);
      expect(
        resultTexts.some(t => t.includes(name)),
        `Missing profile: ${name}`
      ).toBe(true);
      document.body.innerHTML = '';
    }
  });

  // ═══════════════════════════════════════════════════════════
  // 8. DEBOUNCE BEHAVIOUR
  // ═══════════════════════════════════════════════════════════

  it('debounces search with 150ms delay', async () => {
    renderSearch();
    const input = screen.getByLabelText('Global search');

    fireEvent.change(input, { target: { value: 'Dashboard' } });

    // Before debounce fires, no results yet (just quick links still showing)
    expect(screen.queryByRole('listbox')).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // After debounce, results should appear
    expect(screen.getByRole('listbox')).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════
// useGlobalSearch HOOK
// ═══════════════════════════════════════════════════════════

describe('useGlobalSearch hook', () => {
  function TestComponent() {
    const { isOpen, open, close } = useGlobalSearch();
    return (
      <div>
        <span data-testid="state">{String(isOpen)}</span>
        <button onClick={open}>Open</button>
        <button onClick={close}>Close</button>
      </div>
    );
  }

  it('starts closed', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('state').textContent).toBe('false');
  });

  it('opens with open()', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('state').textContent).toBe('true');
  });

  it('closes with close()', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.getByTestId('state').textContent).toBe('false');
  });

  it('toggles with Ctrl+K keyboard shortcut', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('state').textContent).toBe('false');

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByTestId('state').textContent).toBe('true');

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByTestId('state').textContent).toBe('false');
  });

  it('toggles with Meta+K (macOS) keyboard shortcut', () => {
    render(<TestComponent />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByTestId('state').textContent).toBe('true');
  });
});
