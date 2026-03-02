import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LanguageSelector from '../components/LanguageSelector';
import { LanguageProvider } from '../contexts/LanguageContext';

const renderWithProvider = () =>
  render(
    <LanguageProvider>
      <LanguageSelector />
    </LanguageProvider>
  );

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('renders the language button', () => {
    renderWithProvider();
    expect(screen.getByText('English')).toBeTruthy();
  });

  it('does not show dropdown initially', () => {
    renderWithProvider();
    expect(screen.queryByText('简体中文')).toBeNull();
  });

  it('opens dropdown when button is clicked', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText('简体中文')).toBeTruthy();
  });

  it('shows all available languages in dropdown', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('English'));
    expect(screen.getAllByText('English').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('简体中文')).toBeTruthy();
    expect(screen.getByText('繁體中文')).toBeTruthy();
    expect(screen.getByText('Tiếng Việt')).toBeTruthy();
    expect(screen.getByText('한국어')).toBeTruthy();
    expect(screen.getByText('日本語')).toBeTruthy();
  });

  it('shows checkmark for current language', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText('✓')).toBeTruthy();
  });

  it('closes dropdown when a language is selected', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText('简体中文')).toBeTruthy();
    fireEvent.click(screen.getByText('简体中文'));
    // After selecting, dropdown should close — other languages disappear
    expect(screen.queryByText('繁體中文')).toBeNull();
  });

  it('closes dropdown when backdrop overlay is clicked', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText('简体中文')).toBeTruthy();
    // Click the fixed overlay (backdrop)
    const overlay = document.querySelector('.fixed.inset-0');
    fireEvent.click(overlay);
    expect(screen.queryByText('简体中文')).toBeNull();
  });
});
