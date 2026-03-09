// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ResearchDashboard from '../components/ResearchDashboard';

// Mock the research data module to control test data
vi.mock('../data/researchData', () => {
  const prisoners = [
    { name: 'Test Prisoner A', status: 'DETAINED', location: 'Beijing', sentence: 'Life sentence', latestNews: 'Appeal denied', healthStatus: 'Poor condition', sourceUrl: 'https://example.com/a' },
    { name: 'Test Prisoner B', status: 'RELEASED', location: 'Shanghai', sentence: 'Released after 5 years', latestNews: null, healthStatus: 'Unknown', sourceUrl: 'https://example.com/b' },
    { name: 'Test Prisoner C', status: 'DISAPPEARED', location: 'Urumqi', sentence: 'Unknown', latestNews: null, healthStatus: 'Unknown', sourceUrl: null }
  ];

  const news = [
    { topic: 'Uyghur Crisis', headline: 'New Satellite Evidence', summary: 'Camps expanded', date: '2024-12-01', source: 'Reuters', sourceUrl: 'https://reuters.com/a', significance: 'HIGH', internationalResponse: 'UN condemns', actionNeeded: 'Sanctions needed' },
    { topic: 'Hong Kong', headline: 'Trial Verdict', summary: 'Activists sentenced', date: '2024-11-15', source: 'BBC', sourceUrl: 'https://bbc.com/b', significance: 'MEDIUM', internationalResponse: 'N/A', actionNeeded: 'N/A' },
    { topic: 'Tibet', headline: 'Language Rights', summary: 'Schools mandate Mandarin', date: '2024-10-20', source: 'AP', sourceUrl: null, significance: 'HIGH', internationalResponse: 'EU statement', actionNeeded: 'Boycott urged' }
  ];

  const stations = [
    { country: 'Netherlands', city: 'Rotterdam', address: '123 Main St', status: 'CLOSED', closureDate: '2023-06', arrestsMade: 'Yes', arrestDetails: '2 suspects arrested', governmentResponse: 'Shut down by police', linkedTo: 'UFWD', latestNews: 'Investigation ongoing', sourceUrl: 'https://example.com/nl' },
    { country: 'Ireland', city: 'Dublin', address: 'Unknown', status: 'UNDER INVESTIGATION', closureDate: 'N/A', arrestsMade: 'No', arrestDetails: null, governmentResponse: 'Investigation launched', linkedTo: 'China Council', latestNews: null, sourceUrl: null },
    { country: 'USA', city: 'New York', address: '145 Chrystie St', status: 'OPERATING', closureDate: 'N/A', arrestsMade: 'No', arrestDetails: null, governmentResponse: 'FBI investigation', linkedTo: 'UFWD', latestNews: 'Arrests expected', sourceUrl: 'https://example.com/us' }
  ];

  return {
    politicalPrisoners: prisoners,
    recentNews: news,
    policeStations: stations,
    researchStats: {
      totalPrisoners: prisoners.length,
      prisonersByStatus: { detained: 1, released: 1, disappeared: 1, deceased: 0, exile: 0, atRisk: 0 },
      totalNewsTopics: news.length,
      highSignificanceNews: 2,
      totalPoliceStations: stations.length,
      stationsByStatus: { closed: 1, underInvestigation: 1, operating: 1, unknown: 0 },
      lastUpdated: '2024-12-15T00:00:00.000Z'
    }
  };
});

describe('ResearchDashboard', () => {
  // --- Header & Stats ---

  it('renders the header', () => {
    render(<ResearchDashboard />);
    expect(screen.getByText('Research Database')).toBeTruthy();
    expect(screen.getByText(/Verified data from parallel research/)).toBeTruthy();
  });

  it('renders overview stats', () => {
    render(<ResearchDashboard />);
    // "Political Prisoners" and "Police Stations" appear both as stat labels and tab buttons
    expect(screen.getAllByText('Political Prisoners').length).toBe(2);
    expect(screen.getByText('News Topics')).toBeTruthy();
    expect(screen.getAllByText('Police Stations').length).toBe(2);
    expect(screen.getByText('Data Quality')).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<ResearchDashboard />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getAllByText('Political Prisoners').length).toBe(2);
    expect(screen.getByText('Recent News')).toBeTruthy();
    expect(screen.getAllByText('Police Stations').length).toBe(2);
  });

  it('shows Overview tab content by default', () => {
    render(<ResearchDashboard />);
    expect(screen.getByText('Political Prisoners by Status')).toBeTruthy();
    expect(screen.getByText('Police Stations by Status')).toBeTruthy();
    expect(screen.getByText('High Priority News')).toBeTruthy();
  });

  it('does not show search bar on overview tab', () => {
    render(<ResearchDashboard />);
    expect(screen.queryByPlaceholderText('Search...')).toBeFalsy();
  });

  // --- Prisoners Tab ---

  it('switches to Political Prisoners tab', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]); // Tab button (not stat label)
    expect(screen.getByText('Test Prisoner A')).toBeTruthy();
    expect(screen.getByText('Test Prisoner B')).toBeTruthy();
    expect(screen.getByText('Test Prisoner C')).toBeTruthy();
  });

  it('shows search and filter on prisoners tab', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]);
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    expect(screen.getByLabelText('Status filter')).toBeTruthy();
  });

  it('filters prisoners by search term', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Beijing' } });
    expect(screen.getByText('Test Prisoner A')).toBeTruthy();
    expect(screen.queryByText('Test Prisoner B')).toBeFalsy();
    expect(screen.queryByText('Test Prisoner C')).toBeFalsy();
  });

  it('filters prisoners by status dropdown', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]);
    const statusSelect = screen.getByLabelText('Status filter');
    fireEvent.change(statusSelect, { target: { value: 'RELEASED' } });
    expect(screen.queryByText('Test Prisoner A')).toBeFalsy();
    expect(screen.getByText('Test Prisoner B')).toBeTruthy();
  });

  it('shows empty state when no prisoners match', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText('No prisoners found matching your criteria')).toBeTruthy();
  });

  it('shows health status when not Unknown', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Political Prisoners')[1]);
    expect(screen.getByText(/Poor condition/)).toBeTruthy();
  });

  // --- News Tab ---

  it('switches to Recent News tab', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getByText('Recent News'));
    expect(screen.getByText('New Satellite Evidence')).toBeTruthy();
    expect(screen.getByText('Trial Verdict')).toBeTruthy();
    expect(screen.getByText('Language Rights')).toBeTruthy();
  });

  it('shows international response when not N/A', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getByText('Recent News'));
    expect(screen.getByText('UN condemns')).toBeTruthy();
    expect(screen.queryByText('N/A')).toBeFalsy();
  });

  // --- Stations Tab ---

  it('switches to Police Stations tab', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Police Stations')[1]);
    expect(screen.getByText(/Netherlands - Rotterdam/)).toBeTruthy();
    expect(screen.getByText(/Ireland - Dublin/)).toBeTruthy();
  });

  it('filters stations by search term', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Police Stations')[1]);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Dublin' } });
    expect(screen.getByText(/Ireland - Dublin/)).toBeTruthy();
    expect(screen.queryByText(/Netherlands - Rotterdam/)).toBeFalsy();
  });

  it('shows empty state when no stations match', () => {
    render(<ResearchDashboard />);
    fireEvent.click(screen.getAllByText('Police Stations')[1]);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'nowhere' } });
    expect(screen.getByText('No stations found matching your criteria')).toBeTruthy();
  });
});
