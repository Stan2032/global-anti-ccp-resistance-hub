import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalDisclaimer from '../components/ui/GlobalDisclaimer';

describe('GlobalDisclaimer', () => {
  it('should render the default verify type', () => {
    render(<GlobalDisclaimer />);
    expect(screen.getByText('Verification Notice')).toBeTruthy();
    expect(screen.getByText(/Always verify information/)).toBeTruthy();
  });

  it('should render verify type with correct content', () => {
    render(<GlobalDisclaimer type="verify" />);
    expect(screen.getByText('Verification Notice')).toBeTruthy();
  });

  it('should render sensitive type', () => {
    render(<GlobalDisclaimer type="sensitive" />);
    expect(screen.getByText('Security Notice')).toBeTruthy();
    expect(screen.getByText(/Verify organizations/)).toBeTruthy();
  });

  it('should render changing type', () => {
    render(<GlobalDisclaimer type="changing" />);
    expect(screen.getByText('Information Notice')).toBeTruthy();
    expect(screen.getByText(/Situations may change/)).toBeTruthy();
  });

  it('should render security type', () => {
    render(<GlobalDisclaimer type="security" />);
    expect(screen.getByText('Security Reminder')).toBeTruthy();
    expect(screen.getByText(/security precautions/)).toBeTruthy();
  });

  it('should render compact version without title', () => {
    const { container } = render(<GlobalDisclaimer type="verify" compact />);
    // Compact renders as a <p> element, not a <div> with title
    expect(container.querySelector('p')).toBeTruthy();
    expect(screen.queryByText('Verification Notice')).toBeNull();
  });

  it('should fall back to verify type for unknown type', () => {
    render(<GlobalDisclaimer type="unknown" />);
    expect(screen.getByText('Verification Notice')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(<GlobalDisclaimer className="custom-class" />);
    expect(container.firstChild.classList.contains('custom-class')).toBe(true);
  });
});
