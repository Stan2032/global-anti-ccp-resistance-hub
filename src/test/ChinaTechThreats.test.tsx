// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ChinaTechThreats from '../components/ChinaTechThreats';

describe('ChinaTechThreats', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('China Tech Threats')).toBeTruthy();
    expect(screen.getByText('Surveillance technology and critical infrastructure risks')).toBeTruthy();
  });

  it('renders header statistics', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('Sanctioned Companies')).toBeTruthy();
    expect(screen.getByText('Countries Affected')).toBeTruthy();
    expect(screen.getByText('Safe City Projects')).toBeTruthy();
    expect(screen.getByText('2B+')).toBeTruthy();
    expect(screen.getByText('App Users at Risk')).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('Surveillance Tech')).toBeTruthy();
    expect(screen.getByText('Critical Infrastructure')).toBeTruthy();
    expect(screen.getByText('Data Collection')).toBeTruthy();
    expect(screen.getByText('Global Response')).toBeTruthy();
  });

  // --- Surveillance Tech Tab (Default) ---

  it('shows surveillance companies on default tab', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('Sanctioned Surveillance Companies')).toBeTruthy();
    expect(screen.getByText('Huawei')).toBeTruthy();
    expect(screen.getByText('Hikvision')).toBeTruthy();
    expect(screen.getByText('SenseTime')).toBeTruthy();
    expect(screen.getByText('DJI')).toBeTruthy();
  });

  it('shows threat levels for surveillance companies', () => {
    render(<ChinaTechThreats />);
    // CRITICAL, HIGH, MEDIUM appear as badges
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('MEDIUM')).toBeTruthy();
  });

  // --- Critical Infrastructure Tab ---

  it('switches to Critical Infrastructure tab', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Critical Infrastructure'));
    expect(screen.getByText('Critical Infrastructure Risks')).toBeTruthy();
    expect(screen.getByText('5G Networks')).toBeTruthy();
    expect(screen.getByText('Ports & Shipping')).toBeTruthy();
    expect(screen.getByText('Smart Cities')).toBeTruthy();
  });

  it('shows risk levels on infrastructure tab', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Critical Infrastructure'));
    expect(screen.getAllByText(/CRITICAL RISK/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/HIGH RISK/).length).toBeGreaterThanOrEqual(1);
  });

  // --- Data Collection Tab ---

  it('switches to Data Collection tab', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Data Collection'));
    expect(screen.getByText('Data Collection Risks')).toBeTruthy();
    expect(screen.getByText('TikTok')).toBeTruthy();
    expect(screen.getByText('WeChat')).toBeTruthy();
    expect(screen.getByText('BGI Genomics')).toBeTruthy();
    expect(screen.getByText('Temu/Pinduoduo')).toBeTruthy();
    expect(screen.getByText('Shein')).toBeTruthy();
  });

  it('shows BGI genomics warning', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Data Collection'));
    expect(screen.getByText(/BGI Genomics Warning/)).toBeTruthy();
    expect(screen.getByText(/genetic data from millions/)).toBeTruthy();
  });

  // --- Global Response Tab ---

  it('switches to Global Response tab', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Global Response'));
    expect(screen.getByText('Global Response to China Tech')).toBeTruthy();
    expect(screen.getByText('USA')).toBeTruthy();
    expect(screen.getByText('UK')).toBeTruthy();
    expect(screen.getByText('India')).toBeTruthy();
  });

  it('shows actionable advice on Global Response tab', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Global Response'));
    expect(screen.getByText('✅ What You Can Do')).toBeTruthy();
    expect(screen.getByText(/Avoid Chinese-made surveillance cameras/)).toBeTruthy();
  });

  // --- Tab Isolation ---

  it('hides surveillance content when switching tabs', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('Sanctioned Surveillance Companies')).toBeTruthy();
    fireEvent.click(screen.getByText('Data Collection'));
    expect(screen.queryByText('Sanctioned Surveillance Companies')).toBeFalsy();
  });

  // --- Resources ---

  it('renders resource links', () => {
    render(<ChinaTechThreats />);
    expect(screen.getByText('ASPI Tech Tracker')).toBeTruthy();
    expect(screen.getByText('CSIS Digital Silk Road')).toBeTruthy();
    expect(screen.getByText('US Entity List')).toBeTruthy();
  });

  it('resource links open in new tab', () => {
    render(<ChinaTechThreats />);
    const aspiLink = screen.getByText('ASPI Tech Tracker').closest('a');
    expect(aspiLink.getAttribute('target')).toBe('_blank');
    expect(aspiLink.getAttribute('rel')).toContain('noopener');
    expect(aspiLink.getAttribute('href')).toBe('https://www.aspi.org.au/report/mapping-chinas-tech-giants');
  });
});
