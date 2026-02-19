import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  SkipLinks,
  VisuallyHidden,
  LiveRegion,
  AccessibleProgress,
  AccessibleAlert,
} from '../components/Accessibility';

describe('SkipLinks', () => {
  it('should render skip to main content link', () => {
    render(<SkipLinks />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('should render skip to navigation link', () => {
    render(<SkipLinks />);
    const link = screen.getByText('Skip to navigation');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#navigation');
  });
});

describe('VisuallyHidden', () => {
  it('should render children with sr-only class', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const el = screen.getByText('Hidden text');
    expect(el).toBeTruthy();
    expect(el.className).toContain('sr-only');
  });

  it('should render as custom element type', () => {
    render(<VisuallyHidden as="div">Hidden div</VisuallyHidden>);
    const el = screen.getByText('Hidden div');
    expect(el.tagName).toBe('DIV');
  });

  it('should default to span element', () => {
    render(<VisuallyHidden>Hidden span</VisuallyHidden>);
    const el = screen.getByText('Hidden span');
    expect(el.tagName).toBe('SPAN');
  });
});

describe('LiveRegion', () => {
  it('should render with polite aria-live by default', () => {
    render(<LiveRegion message="Update available" />);
    const el = screen.getByText('Update available');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should render with assertive aria-live when priority is assertive', () => {
    render(<LiveRegion message="Critical alert" priority="assertive" />);
    const el = screen.getByText('Critical alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
  });

  it('should render with role=status for polite priority', () => {
    render(<LiveRegion message="Status update" />);
    const el = screen.getByText('Status update');
    expect(el.getAttribute('role')).toBe('status');
  });

  it('should render with role=status for assertive priority', () => {
    render(<LiveRegion message="Alert!" priority="assertive" />);
    const el = screen.getByText('Alert!');
    expect(el.getAttribute('role')).toBe('status');
  });
});

describe('AccessibleProgress', () => {
  it('should render with correct aria attributes', () => {
    render(<AccessibleProgress value={50} max={100} label="Loading" />);
    const el = screen.getByRole('progressbar');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-valuenow')).toBe('50');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('should default max to 100', () => {
    render(<AccessibleProgress value={75} label="Progress" />);
    const el = screen.getByRole('progressbar');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });
});

describe('AccessibleAlert', () => {
  it('should render with alert role', () => {
    render(<AccessibleAlert title="Warning">Content</AccessibleAlert>);
    const el = screen.getByRole('alert');
    expect(el).toBeTruthy();
  });

  it('should render title and children', () => {
    render(<AccessibleAlert title="Test Alert">Alert body text</AccessibleAlert>);
    expect(screen.getByText('Test Alert')).toBeTruthy();
    expect(screen.getByText('Alert body text')).toBeTruthy();
  });

  it('should apply info type by default', () => {
    const { container } = render(
      <AccessibleAlert title="Info">Details</AccessibleAlert>
    );
    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).toBeTruthy();
  });
});
