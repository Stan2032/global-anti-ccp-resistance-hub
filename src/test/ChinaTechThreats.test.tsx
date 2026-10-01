import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ChinaTechThreats from '../components/ChinaTechThreats';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<ChinaTechThreats />);
    expectDisclosureSections(['Surveillance Tech', 'Critical Infrastructure', 'Data Collection', 'Global Response']);
  });

  // --- Surveillance Tech ---

  it('shows surveillance companies in the Surveillance Tech section', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Surveillance Tech');
    expect(section.getByText('Sanctioned Surveillance Companies')).toBeTruthy();
    expect(section.getByText('Huawei')).toBeTruthy();
    expect(section.getByText('Hikvision')).toBeTruthy();
    expect(section.getByText('SenseTime')).toBeTruthy();
    expect(section.getByText('DJI')).toBeTruthy();
  });

  it('shows threat levels for surveillance companies', () => {
    render(<ChinaTechThreats />);
    // CRITICAL, HIGH, MEDIUM appear as badges
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('MEDIUM').length).toBeGreaterThan(0);
  });

  // --- Critical Infrastructure ---

  it('shows the Critical Infrastructure section without interaction', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Critical Infrastructure');
    expect(section.getByText('Critical Infrastructure Risks')).toBeTruthy();
    expect(section.getByText('5G Networks')).toBeTruthy();
    expect(section.getByText('Ports & Shipping')).toBeTruthy();
    expect(section.getByText('Smart Cities')).toBeTruthy();
  });

  it('shows risk levels in the Critical Infrastructure section', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Critical Infrastructure');
    expect(section.getAllByText(/CRITICAL RISK/).length).toBeGreaterThanOrEqual(2);
    expect(section.getAllByText(/HIGH RISK/).length).toBeGreaterThanOrEqual(1);
  });

  // --- Data Collection ---

  it('shows the Data Collection section without interaction', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Data Collection');
    expect(section.getByText('Data Collection Risks')).toBeTruthy();
    expect(section.getByText('TikTok')).toBeTruthy();
    expect(section.getByText('WeChat')).toBeTruthy();
    expect(section.getByText('BGI Genomics')).toBeTruthy();
    expect(section.getByText('Temu/Pinduoduo')).toBeTruthy();
    expect(section.getByText('Shein')).toBeTruthy();
  });

  it('shows BGI genomics warning', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Data Collection');
    expect(section.getByText(/BGI Genomics Warning/)).toBeTruthy();
    expect(section.getByText(/genetic data from millions/)).toBeTruthy();
  });

  // --- Global Response ---

  it('shows the Global Response section without interaction', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Global Response');
    expect(section.getByText('Global Response to China Tech')).toBeTruthy();
    expect(section.getByText('USA')).toBeTruthy();
    expect(section.getByText('UK')).toBeTruthy();
    expect(section.getByText('India')).toBeTruthy();
  });

  it('shows actionable advice in the Global Response section', () => {
    render(<ChinaTechThreats />);
    const section = inSection('Global Response');
    expect(section.getByText('✅ What You Can Do')).toBeTruthy();
    expect(section.getByText(/Avoid Chinese-made surveillance cameras/)).toBeTruthy();
  });

  // --- Sections stay mounted ---

  it('opening one section hides nothing in the others', () => {
    render(<ChinaTechThreats />);
    fireEvent.click(screen.getByText('Data Collection'));
    expect(inSection('Surveillance Tech').getByText('Sanctioned Surveillance Companies')).toBeTruthy();
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
    expect(aspiLink!.getAttribute('target')).toBe('_blank');
    expect(aspiLink!.getAttribute('rel')).toContain('noopener');
    expect(aspiLink!.getAttribute('href')).toBe('https://www.aspi.org.au/report/mapping-chinas-tech-giants');
  });
});
