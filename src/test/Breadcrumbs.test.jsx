import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const renderAtPath = (path) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Breadcrumbs />
    </MemoryRouter>
  );
};

describe('Breadcrumbs', () => {
  it('renders nothing on the dashboard (root)', () => {
    const { container } = renderAtPath('/');
    expect(container.querySelector('nav')).toBeFalsy();
  });

  it('renders breadcrumb nav on sub-pages', () => {
    renderAtPath('/intelligence');
    expect(screen.getByLabelText('Breadcrumb')).toBeTruthy();
  });

  it('shows home link', () => {
    renderAtPath('/intelligence');
    expect(screen.getByLabelText('Dashboard')).toBeTruthy();
  });

  it('shows current page label', () => {
    renderAtPath('/intelligence');
    expect(screen.getByText('Intelligence')).toBeTruthy();
  });

  it('marks last crumb as current page', () => {
    renderAtPath('/intelligence');
    expect(screen.getByText('Intelligence').getAttribute('aria-current')).toBe('page');
  });

  it('renders nested breadcrumbs for profile pages', () => {
    renderAtPath('/profiles/jimmy-lai');
    expect(screen.getByText('Profiles')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
  });

  it('makes non-last crumbs clickable links', () => {
    renderAtPath('/profiles/jimmy-lai');
    const profilesLink = screen.getByText('Profiles');
    // Non-last crumb should be a link (no aria-current)
    expect(profilesLink.getAttribute('aria-current')).toBeFalsy();
    expect(profilesLink.closest('a')).toBeTruthy();
  });

  it('renders for take-action page', () => {
    renderAtPath('/take-action');
    expect(screen.getByText('Take Action')).toBeTruthy();
  });

  it('renders for security page', () => {
    renderAtPath('/security');
    expect(screen.getByText('Security')).toBeTruthy();
  });

  it('renders for education page', () => {
    renderAtPath('/education');
    expect(screen.getByText('Education')).toBeTruthy();
  });

  it('handles unknown paths gracefully', () => {
    renderAtPath('/some-unknown-path');
    // Should title-case the segment
    expect(screen.getByText('Some Unknown Path')).toBeTruthy();
  });
});
