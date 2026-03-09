// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ReadingList from '../components/ReadingList';

describe('ReadingList', () => {
  // --- Heading ---

  it('renders the heading', () => {
    render(<ReadingList />);
    expect(screen.getByText('Essential Reading List')).toBeTruthy();
  });

  it('renders the description with book count', () => {
    render(<ReadingList />);
    expect(screen.getByText(/essential books for understanding CCP human rights abuses/)).toBeTruthy();
  });

  // --- Book list ---

  it('renders book titles', () => {
    render(<ReadingList />);
    expect(screen.getByText(/In the Camps/)).toBeTruthy();
    expect(screen.getByText(/Unfree Speech/)).toBeTruthy();
    expect(screen.getByText(/Bloody Harvest/)).toBeTruthy();
  });

  it('renders book authors', () => {
    render(<ReadingList />);
    expect(screen.getByText('Darren Byler')).toBeTruthy();
    expect(screen.getAllByText('Joshua Wong').length).toBeGreaterThanOrEqual(1);
  });

  it('renders relevance badges', () => {
    render(<ReadingList />);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThanOrEqual(1);
  });

  // --- Category filtering ---

  it('renders category filter buttons', () => {
    render(<ReadingList />);
    expect(screen.getByText(/All Books/)).toBeTruthy();
    expect(screen.getByText(/Uyghur\/Xinjiang/)).toBeTruthy();
    expect(screen.getAllByText(/Hong Kong/).length).toBeGreaterThanOrEqual(1);
  });

  it('filters books by category when a filter button is clicked', () => {
    render(<ReadingList />);
    // Click Uyghur/Xinjiang category
    const uyghurBtn = screen.getByText(/Uyghur\/Xinjiang/);
    fireEvent.click(uyghurBtn);
    // Uyghur books should be visible
    expect(screen.getByText(/In the Camps/)).toBeTruthy();
    // Hong Kong book should not be visible
    expect(screen.queryByText(/Unfree Speech/)).toBeNull();
  });

  it('returns to all books when All Books is clicked', () => {
    render(<ReadingList />);
    const uyghurBtn = screen.getByText(/Uyghur\/Xinjiang/);
    fireEvent.click(uyghurBtn);
    expect(screen.queryByText(/Unfree Speech/)).toBeNull();
    fireEvent.click(screen.getByText(/All Books/));
    expect(screen.getByText(/Unfree Speech/)).toBeTruthy();
  });

  // --- Sorting ---

  it('sorts books by year when sort option is changed', () => {
    render(<ReadingList />);
    const sortSelect = screen.getByLabelText('Sort');
    fireEvent.change(sortSelect, { target: { value: 'year' } });
    // All books should still be present after sorting
    expect(screen.getByText(/In the Camps/)).toBeTruthy();
    expect(screen.getByText(/Bloody Harvest/)).toBeTruthy();
  });

  // --- Reading tips ---

  it('renders the reading tips section', () => {
    render(<ReadingList />);
    expect(screen.getByText('Reading Tips')).toBeTruthy();
    expect(screen.getByText(/Start with books marked/)).toBeTruthy();
  });

  // --- Links ---

  it('renders Goodreads and Library links for books', () => {
    render(<ReadingList />);
    const goodreadsLinks = screen.getAllByText('Goodreads');
    expect(goodreadsLinks.length).toBeGreaterThanOrEqual(1);
    const libraryLinks = screen.getAllByText('Library');
    expect(libraryLinks.length).toBeGreaterThanOrEqual(1);
  });
});
