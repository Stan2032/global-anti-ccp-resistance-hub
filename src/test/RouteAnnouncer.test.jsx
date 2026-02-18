import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouteAnnouncer from '../components/RouteAnnouncer';

function renderWithRouter(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <RouteAnnouncer />
    </MemoryRouter>
  );
}

describe('RouteAnnouncer', () => {
  it('announces the dashboard route', () => {
    renderWithRouter(['/']);
    expect(screen.getByRole('status')).toHaveTextContent('Navigated to Dashboard');
  });

  it('announces the prisoners route', () => {
    renderWithRouter(['/prisoners']);
    expect(screen.getByRole('status')).toHaveTextContent('Navigated to Political Prisoners');
  });

  it('announces unknown routes with a generic label', () => {
    renderWithRouter(['/some-unknown-page']);
    expect(screen.getByRole('status')).toHaveTextContent('Navigated to Page');
  });

  it('has aria-live="polite" for non-intrusive announcements', () => {
    renderWithRouter(['/']);
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });
});
