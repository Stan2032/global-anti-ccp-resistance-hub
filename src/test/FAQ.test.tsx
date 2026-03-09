// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FAQ from '../components/FAQ';

describe('FAQ', () => {
  // --- Structure ---

  it('renders the header', () => {
    render(<FAQ />);
    expect(screen.getByText('Frequently Asked Questions')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<FAQ />);
    expect(screen.getByText('Common questions for newcomers and activists')).toBeTruthy();
  });

  it('shows question count', () => {
    render(<FAQ />);
    expect(screen.getByText(/20 questions answered/)).toBeTruthy();
  });

  // --- Category Filters ---

  it('renders all category filter buttons', () => {
    render(<FAQ />);
    expect(screen.getByText('All Questions')).toBeTruthy();
    expect(screen.getByText('Getting Started')).toBeTruthy();
    expect(screen.getByText('Safety & Security')).toBeTruthy();
    expect(screen.getByText('Taking Action')).toBeTruthy();
    expect(screen.getByText('Understanding the Issues')).toBeTruthy();
  });

  it('shows all questions by default (all category)', () => {
    render(<FAQ />);
    // Check questions from different categories are visible
    expect(screen.getByText('What is the Global Anti-CCP Resistance Hub?')).toBeTruthy();
    expect(screen.getByText('Is it safe to use this platform?')).toBeTruthy();
    expect(screen.getByText('What can I actually do to help?')).toBeTruthy();
    expect(screen.getByText('What is happening to the Uyghurs?')).toBeTruthy();
  });

  it('filters to Getting Started category', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Getting Started'));
    expect(screen.getByText('What is the Global Anti-CCP Resistance Hub?')).toBeTruthy();
    expect(screen.getByText('How can I contribute to this platform?')).toBeTruthy();
    // Safety question should be hidden
    expect(screen.queryByText('Is it safe to use this platform?')).toBeNull();
  });

  it('filters to Safety & Security category', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Safety & Security'));
    expect(screen.getByText('Is it safe to use this platform?')).toBeTruthy();
    expect(screen.getByText(/What precautions should I take/)).toBeTruthy();
    // Getting Started question should be hidden
    expect(screen.queryByText('What is the Global Anti-CCP Resistance Hub?')).toBeNull();
  });

  it('filters to Taking Action category', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Taking Action'));
    expect(screen.getByText('What can I actually do to help?')).toBeTruthy();
    expect(screen.getByText(/Does contacting my representative/)).toBeTruthy();
  });

  it('filters to Understanding the Issues category', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Understanding the Issues'));
    expect(screen.getByText('What is happening to the Uyghurs?')).toBeTruthy();
    expect(screen.getByText(/What happened to Hong Kong/)).toBeTruthy();
    expect(screen.getByText('Is this anti-Chinese racism?')).toBeTruthy();
  });

  it('returns to all questions when All Questions is clicked', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Safety & Security'));
    expect(screen.queryByText('What is the Global Anti-CCP Resistance Hub?')).toBeNull();
    
    fireEvent.click(screen.getByText('All Questions'));
    expect(screen.getByText('What is the Global Anti-CCP Resistance Hub?')).toBeTruthy();
    expect(screen.getByText('Is it safe to use this platform?')).toBeTruthy();
  });

  // --- Accordion Behavior ---

  it('answers are hidden by default', () => {
    render(<FAQ />);
    // Answer text should not be visible (accordion collapsed)
    expect(screen.queryByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeNull();
  });

  it('clicking a question reveals its answer', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('What is the Global Anti-CCP Resistance Hub?'));
    expect(screen.getByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeTruthy();
  });

  it('clicking same question again hides the answer', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('What is the Global Anti-CCP Resistance Hub?'));
    expect(screen.getByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeTruthy();
    
    fireEvent.click(screen.getByText('What is the Global Anti-CCP Resistance Hub?'));
    expect(screen.queryByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeNull();
  });

  it('clicking a different question closes the first', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('What is the Global Anti-CCP Resistance Hub?'));
    expect(screen.getByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeTruthy();
    
    fireEvent.click(screen.getByText('Who created this platform and why?'));
    expect(screen.queryByText(/comprehensive resource for documenting CCP human rights abuses/)).toBeNull();
    expect(screen.getByText(/concerned individuals who believe in transparency/)).toBeTruthy();
  });

  // --- Content Quality ---

  it('does not contain CCP state media references (CPC terminology)', () => {
    const { container } = render(<FAQ />);
    const text = container.textContent;
    expect(text).not.toContain('CPC');
    expect(text).not.toContain('Chinese People\'s Consultative');
  });

  it('includes emergency contact information in safety FAQ', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText('Safety & Security'));
    fireEvent.click(screen.getByText('Are there emergency contacts for activists in danger?'));
    expect(screen.getByText(/Front Line Defenders/)).toBeTruthy();
    expect(screen.getByText(/353 1 210 0489/)).toBeTruthy();
  });

  // --- Footer Links ---

  it('renders Education Center and Resources links', () => {
    render(<FAQ />);
    expect(screen.getByText('Still have questions?')).toBeTruthy();
    const eduLink = screen.getByText('Education Center');
    expect(eduLink.closest('a').getAttribute('href')).toBe('/education');
    const resourcesLink = screen.getByText('Resources');
    expect(resourcesLink.closest('a').getAttribute('href')).toBe('/resources');
  });
});
