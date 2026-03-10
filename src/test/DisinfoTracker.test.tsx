import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DisinfoTracker from '../components/DisinfoTracker';

describe('DisinfoTracker', () => {
  it('renders the heading', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText('Disinformation Tracker')).toBeTruthy();
  });

  it('renders the description text', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText(/Identify and counter CCP propaganda/)).toBeTruthy();
  });

  it('renders detailed intro paragraph', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText(/The CCP spends billions on propaganda/)).toBeTruthy();
  });

  it('renders all category buttons', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Uyghur')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
    expect(screen.getByText('Taiwan')).toBeTruthy();
    expect(screen.getByText('COVID-19')).toBeTruthy();
    expect(screen.getByText('General')).toBeTruthy();
  });

  it('renders all disinformation alerts by default', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText(/Vocational training centers/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong protesters are violent terrorists/)).toBeTruthy();
    expect(screen.getByText(/Taiwan has always been part of China/)).toBeTruthy();
    expect(screen.getByText(/Tibet was peacefully liberated/)).toBeTruthy();
    expect(screen.getByText(/COVID-19 originated from a US military lab/)).toBeTruthy();
  });

  it('filters alerts when Uyghur category is clicked', () => {
    render(<DisinfoTracker />);
    fireEvent.click(screen.getByText('Uyghur'));
    expect(screen.getByText(/Vocational training centers/)).toBeTruthy();
    expect(screen.getByText(/Uyghur birth rate decline/)).toBeTruthy();
    expect(screen.queryByText(/Taiwan has always been part of China/)).toBeNull();
    expect(screen.queryByText(/COVID-19 originated from a US military lab/)).toBeNull();
  });

  it('filters alerts when Hong Kong category is clicked', () => {
    render(<DisinfoTracker />);
    fireEvent.click(screen.getByText('Hong Kong'));
    expect(screen.getByText(/Hong Kong protesters are violent terrorists/)).toBeTruthy();
    expect(screen.getByText(/Jimmy Lai is a criminal/)).toBeTruthy();
    expect(screen.queryByText(/Tibet was peacefully liberated/)).toBeNull();
  });

  it('filters alerts when COVID-19 category is clicked', () => {
    render(<DisinfoTracker />);
    fireEvent.click(screen.getByText('COVID-19'));
    expect(screen.getByText(/COVID-19 originated from a US military lab/)).toBeTruthy();
    expect(screen.queryByText(/Vocational training centers/)).toBeNull();
  });

  it('shows all alerts again when All is clicked after filtering', () => {
    render(<DisinfoTracker />);
    fireEvent.click(screen.getByText('Tibet'));
    expect(screen.queryByText(/COVID-19 originated from a US military lab/)).toBeNull();
    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText(/COVID-19 originated from a US military lab/)).toBeTruthy();
  });

  it('renders severity badges', () => {
    render(<DisinfoTracker />);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThan(0);
  });

  it('renders fact-checking resources section', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText('Fact-Checking Resources')).toBeTruthy();
    expect(screen.getByText('ASPI - CCP Influence Tracking')).toBeTruthy();
    expect(screen.getByText('China Digital Times')).toBeTruthy();
    expect(screen.getByText('ProPublica - China Propaganda')).toBeTruthy();
    expect(screen.getByText('EU DisinfoLab')).toBeTruthy();
  });

  it('renders "How to Counter Disinformation" section', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText('How to Counter Disinformation')).toBeTruthy();
    expect(screen.getByText(/Don't amplify/)).toBeTruthy();
    expect(screen.getByText(/Lead with truth/)).toBeTruthy();
  });

  it('renders stats row with Claims Tracked, Critical Alerts, and Widespread', () => {
    render(<DisinfoTracker />);
    expect(screen.getByText('Claims Tracked')).toBeTruthy();
    expect(screen.getByText('Critical Alerts')).toBeTruthy();
    expect(screen.getByText('Widespread')).toBeTruthy();
  });
});
