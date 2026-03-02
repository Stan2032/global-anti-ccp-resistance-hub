import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlossaryTerms from '../components/GlossaryTerms';

describe('GlossaryTerms', () => {
  // --- Structure ---

  it('renders the heading', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText('Glossary of Terms')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<GlossaryTerms />);
    expect(screen.getByPlaceholderText(/Search terms/)).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText('All Terms')).toBeTruthy();
    expect(screen.getByText('CCP Structure')).toBeTruthy();
    expect(screen.getByText('Laws & Policies')).toBeTruthy();
    expect(screen.getAllByText('Surveillance').length).toBeGreaterThanOrEqual(1);
  });

  it('renders glossary terms', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText('Chinese Communist Party (CCP)')).toBeTruthy();
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
  });

  it('renders Chinese characters', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText('中国共产党')).toBeTruthy();
  });

  it('displays term count', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText(/\d+ terms/)).toBeTruthy();
  });

  // --- Search ---

  it('filters terms by search query', () => {
    render(<GlossaryTerms />);
    const searchInput = screen.getByPlaceholderText(/Search terms/);
    fireEvent.change(searchInput, { target: { value: 'NSL' } });
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
  });

  it('filters terms by Chinese character search', () => {
    render(<GlossaryTerms />);
    const searchInput = screen.getByPlaceholderText(/Search terms/);
    fireEvent.change(searchInput, { target: { value: '国家安全法' } });
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
  });

  it('shows no results message for bad search', () => {
    render(<GlossaryTerms />);
    const searchInput = screen.getByPlaceholderText(/Search terms/);
    fireEvent.change(searchInput, { target: { value: 'zzzzzznotfound' } });
    expect(screen.getByText(/No terms found/)).toBeTruthy();
  });

  // --- Category Filter ---

  it('filters by category', () => {
    render(<GlossaryTerms />);
    fireEvent.click(screen.getByText('Laws & Policies'));
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
  });

  it('returns to all terms when All Terms is clicked', () => {
    render(<GlossaryTerms />);
    fireEvent.click(screen.getByText('Laws & Policies'));
    fireEvent.click(screen.getByText('All Terms'));
    expect(screen.getByText('Chinese Communist Party (CCP)')).toBeTruthy();
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
  });

  // --- Term Content ---

  it('renders definitions', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText(/ruling political party of the People/)).toBeTruthy();
  });

  it('renders pinyin', () => {
    render(<GlossaryTerms />);
    expect(screen.getByText(/Zhōngguó Gòngchǎndǎng/)).toBeTruthy();
  });
});
