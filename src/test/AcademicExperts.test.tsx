// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AcademicExperts from '../components/AcademicExperts';

describe('AcademicExperts', () => {
  it('renders the title', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Academic Experts Directory')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Leading scholars on China human rights • Verified research sources')).toBeTruthy();
  });

  it('renders statistics panel with category counts', () => {
    render(<AcademicExperts />);
    expect(screen.getAllByText('Xinjiang/Uyghur').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tibet').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CCP Targeted')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('placeholder')).toBe('Search by name, affiliation, or work...');
  });

  it('renders expertise filter select', () => {
    render(<AcademicExperts />);
    const filter = screen.getByLabelText('Expertise filter');
    expect(filter).toBeTruthy();
    expect(screen.getByText('All Expertise Areas')).toBeTruthy();
  });

  it('renders expert names', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Dr. Adrian Zenz')).toBeTruthy();
  });

  it('renders expert affiliations', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Victims of Communism Memorial Foundation')).toBeTruthy();
  });

  it('filters experts by search term', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Zenz' } });
    expect(screen.getByText('Dr. Adrian Zenz')).toBeTruthy();
  });

  it('shows no results message for unmatched search', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No experts found matching your criteria')).toBeTruthy();
  });

  it('expands expert details on click', () => {
    render(<AcademicExperts />);
    const expertName = screen.getByText('Dr. Adrian Zenz');
    const clickableRow = expertName.closest('.cursor-pointer');
    fireEvent.click(clickableRow);
    expect(screen.getByText('Key Works')).toBeTruthy();
  });

  it('renders footer note about scholars', () => {
    render(<AcademicExperts />);
    expect(screen.getByText(/scholars are recognized experts whose work has been cited/)).toBeTruthy();
  });
});
