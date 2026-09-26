import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ResearchDashboard from '../components/ResearchDashboard';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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
  const search = () => screen.getByLabelText('Search prisoners and police stations');

  // --- Header & Stats ---

  it('renders the header', () => {
    render(<ResearchDashboard />);
    expect(screen.getByText('Research Database')).toBeTruthy();
    expect(screen.getByText(/Verified data from parallel research/)).toBeTruthy();
  });

  it('renders overview stats', () => {
    render(<ResearchDashboard />);
    // "Political Prisoners" and "Police Stations" appear both as stat labels and section titles
    expect(screen.getAllByText('Political Prisoners').length).toBe(2);
    expect(screen.getByText('News Topics')).toBeTruthy();
    expect(screen.getAllByText('Police Stations').length).toBe(2);
    expect(screen.getByText('Data Quality')).toBeTruthy();
  });

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<ResearchDashboard />);
    expectDisclosureSections(['Overview', 'Political Prisoners', 'Recent News', 'Police Stations']);
  });

  it('shows the Overview section', () => {
    render(<ResearchDashboard />);
    const section = inSection('Overview');
    expect(section.getByText('Political Prisoners by Status')).toBeTruthy();
    expect(section.getByText('Police Stations by Status')).toBeTruthy();
    expect(section.getByText('High Priority News')).toBeTruthy();
  });

  it('labels the search box with what it searches', () => {
    render(<ResearchDashboard />);
    expect(search().getAttribute('placeholder')).toBe('Search prisoners and police stations...');
  });

  // --- Political Prisoners ---

  it('shows the Political Prisoners section without interaction', () => {
    render(<ResearchDashboard />);
    const section = inSection('Political Prisoners');
    expect(section.getByText('Test Prisoner A')).toBeTruthy();
    expect(section.getByText('Test Prisoner B')).toBeTruthy();
    expect(section.getByText('Test Prisoner C')).toBeTruthy();
  });

  it('keeps the prisoner status filter inside the prisoners section', () => {
    render(<ResearchDashboard />);
    expect(inSection('Political Prisoners').getByLabelText('Filter prisoners by status')).toBeTruthy();
  });

  it('filters prisoners by search term', () => {
    render(<ResearchDashboard />);
    fireEvent.change(search(), { target: { value: 'Beijing' } });
    const section = inSection('Political Prisoners');
    expect(section.getByText('Test Prisoner A')).toBeTruthy();
    expect(section.queryByText('Test Prisoner B')).toBeFalsy();
    expect(section.queryByText('Test Prisoner C')).toBeFalsy();
  });

  it('filters prisoners by status dropdown', () => {
    render(<ResearchDashboard />);
    const section = inSection('Political Prisoners');
    fireEvent.change(section.getByLabelText('Filter prisoners by status'), { target: { value: 'RELEASED' } });
    expect(section.queryByText('Test Prisoner A')).toBeFalsy();
    expect(section.getByText('Test Prisoner B')).toBeTruthy();
  });

  it('prisoner status filter leaves the police stations alone', () => {
    render(<ResearchDashboard />);
    fireEvent.change(screen.getByLabelText('Filter prisoners by status'), { target: { value: 'RELEASED' } });
    const stations = inSection('Police Stations');
    expect(stations.getByText(/Netherlands - Rotterdam/)).toBeTruthy();
    expect(stations.getByText(/Ireland - Dublin/)).toBeTruthy();
    expect(stations.getByText(/USA - New York/)).toBeTruthy();
  });

  it('shows empty state when no prisoners match', () => {
    render(<ResearchDashboard />);
    fireEvent.change(search(), { target: { value: 'nonexistent' } });
    expect(inSection('Political Prisoners').getByText('No prisoners found matching your criteria')).toBeTruthy();
  });

  it('shows health status when not Unknown', () => {
    render(<ResearchDashboard />);
    expect(inSection('Political Prisoners').getByText(/Poor condition/)).toBeTruthy();
  });

  // --- Recent News ---

  it('shows the Recent News section without interaction', () => {
    render(<ResearchDashboard />);
    const section = inSection('Recent News');
    expect(section.getAllByText('New Satellite Evidence').length).toBeGreaterThan(0);
    expect(section.getByText('Trial Verdict')).toBeTruthy();
    expect(section.getAllByText('Language Rights').length).toBeGreaterThan(0);
  });

  it('shows international response when not N/A', () => {
    render(<ResearchDashboard />);
    const section = inSection('Recent News');
    expect(section.getByText('UN condemns')).toBeTruthy();
    expect(section.queryByText('N/A')).toBeFalsy();
  });

  // --- Police Stations ---

  it('shows the Police Stations section without interaction', () => {
    render(<ResearchDashboard />);
    const section = inSection('Police Stations');
    expect(section.getByText(/Netherlands - Rotterdam/)).toBeTruthy();
    expect(section.getByText(/Ireland - Dublin/)).toBeTruthy();
  });

  it('filters stations by search term', () => {
    render(<ResearchDashboard />);
    fireEvent.change(search(), { target: { value: 'Dublin' } });
    const section = inSection('Police Stations');
    expect(section.getByText(/Ireland - Dublin/)).toBeTruthy();
    expect(section.queryByText(/Netherlands - Rotterdam/)).toBeFalsy();
  });

  it('filters stations by status dropdown without touching the prisoners', () => {
    render(<ResearchDashboard />);
    const section = inSection('Police Stations');
    fireEvent.change(section.getByLabelText('Filter police stations by status'), { target: { value: 'CLOSED' } });
    expect(section.getByText(/Netherlands - Rotterdam/)).toBeTruthy();
    expect(section.queryByText(/Ireland - Dublin/)).toBeFalsy();
    expect(inSection('Political Prisoners').getByText('Test Prisoner A')).toBeTruthy();
  });

  it('shows empty state when no stations match', () => {
    render(<ResearchDashboard />);
    fireEvent.change(search(), { target: { value: 'nowhere' } });
    expect(inSection('Police Stations').getByText('No stations found matching your criteria')).toBeTruthy();
  });
});
