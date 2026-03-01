import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Supabase modules before importing component
vi.mock('../services/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));
vi.mock('../services/supabaseService', () => ({
  submitIncidentReport: vi.fn(),
}));

import IncidentReportForm from '../components/IncidentReportForm';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { submitIncidentReport } from '../services/supabaseService';

describe('IncidentReportForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Step 1: Incident Type ---

  it('renders the form header', () => {
    render(<IncidentReportForm />);
    expect(screen.getByText('Report CCP Harassment or Transnational Repression')).toBeTruthy();
  });

  it('renders all 9 incident types', () => {
    render(<IncidentReportForm />);
    expect(screen.getByText('CCP Overseas Police Station Activity')).toBeTruthy();
    expect(screen.getByText('Surveillance / Monitoring')).toBeTruthy();
    expect(screen.getByText('Harassment / Intimidation')).toBeTruthy();
    expect(screen.getByText('Threats to Family in China')).toBeTruthy();
    expect(screen.getByText('Cyber Attack / Hacking')).toBeTruthy();
    expect(screen.getByText('Academic Interference')).toBeTruthy();
    expect(screen.getByText('Media / Censorship')).toBeTruthy();
    expect(screen.getByText('Economic Coercion')).toBeTruthy();
    expect(screen.getByText('Other')).toBeTruthy();
  });

  it('disables Continue button when no incident type selected', () => {
    render(<IncidentReportForm />);
    const continueBtn = screen.getByText('Continue');
    expect(continueBtn.disabled).toBe(true);
  });

  it('enables Continue button after selecting an incident type', () => {
    render(<IncidentReportForm />);
    const radio = screen.getByDisplayValue('surveillance');
    fireEvent.click(radio);
    const continueBtn = screen.getByText('Continue');
    expect(continueBtn.disabled).toBe(false);
  });

  it('shows step indicators (1, 2, 3)', () => {
    render(<IncidentReportForm />);
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Incident Type')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  // --- Step 2: Details ---

  it('navigates to Step 2 when Continue is clicked', () => {
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('harassment'));
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText('Incident Details')).toBeTruthy();
    expect(screen.getByLabelText('Location')).toBeTruthy();
    expect(screen.getByLabelText('Date of Incident')).toBeTruthy();
    expect(screen.getByLabelText('Description')).toBeTruthy();
  });

  it('shows Back button on Step 2', () => {
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('harassment'));
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText('Back')).toBeTruthy();
  });

  it('navigates back to Step 1 when Back is clicked on Step 2', () => {
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('harassment'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('What type of incident are you reporting?')).toBeTruthy();
  });

  // --- Step 3: Contact & Submit ---

  function goToStep3() {
    render(<IncidentReportForm />);
    // Step 1: select type
    fireEvent.click(screen.getByDisplayValue('police_station'));
    fireEvent.click(screen.getByText('Continue'));
    // Step 2: fill description
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Observed intimidation tactics' } });
    fireEvent.click(screen.getByText('Continue'));
  }

  it('navigates to Step 3 with consent and submit', () => {
    goToStep3();
    expect(screen.getByText('Contact & Submission')).toBeTruthy();
    expect(screen.getByText('Submit Anonymously')).toBeTruthy();
    expect(screen.getByText('Consent to Share Data')).toBeTruthy();
  });

  it('shows report summary on Step 3', () => {
    goToStep3();
    expect(screen.getByText('Report Summary')).toBeTruthy();
    expect(screen.getByText('CCP Overseas Police Station Activity')).toBeTruthy();
  });

  it('hides email field when anonymous is checked (default)', () => {
    goToStep3();
    expect(screen.queryByLabelText('Contact Email')).toBeNull();
  });

  it('shows email field when anonymous is unchecked', () => {
    goToStep3();
    // Uncheck anonymous (it's checked by default)
    fireEvent.click(screen.getByRole('checkbox', { name: /Submit Anonymously/i }));
    expect(screen.getByLabelText('Contact Email')).toBeTruthy();
  });

  it('Submit button is disabled without consent', () => {
    goToStep3();
    const submitBtn = screen.getByText('Submit Securely');
    expect(submitBtn.closest('button').disabled).toBe(true);
  });

  // --- Backend integration ---

  it('shows "Coming Soon" notice when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<IncidentReportForm />);
    expect(screen.getByText('Form Not Yet Connected (Coming Soon)')).toBeTruthy();
  });

  it('hides "Coming Soon" notice when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<IncidentReportForm />);
    expect(screen.queryByText('Form Not Yet Connected (Coming Soon)')).toBeNull();
  });

  it('shows "not yet active" footer when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<IncidentReportForm />);
    expect(screen.getByText(/Form not yet active/)).toBeTruthy();
  });

  it('shows "Connected to secure backend" footer when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<IncidentReportForm />);
    expect(screen.getByText(/Connected to secure backend/)).toBeTruthy();
  });

  // --- Submission ---

  it('submits without calling Supabase when not configured', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<IncidentReportForm />);
    // Navigate to step 3
    fireEvent.click(screen.getByDisplayValue('surveillance'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Being followed' } });
    fireEvent.click(screen.getByText('Continue'));
    // Check consent and submit
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Report')).toBeTruthy();
    });
    expect(submitIncidentReport).not.toHaveBeenCalled();
  });

  it('calls submitIncidentReport when backend is connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitIncidentReport.mockResolvedValue({ data: [{}], error: null });
    render(<IncidentReportForm />);
    // Navigate to step 3
    fireEvent.click(screen.getByDisplayValue('cyber_attack'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Account compromised' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Berlin, Germany' } });
    fireEvent.click(screen.getByText('Continue'));
    // Check consent and submit
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Report')).toBeTruthy();
    });
    expect(submitIncidentReport).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Account compromised',
        incidentType: 'cyber_attack',
        location: 'Berlin, Germany',
      })
    );
  });

  it('shows error message when Supabase submission fails', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitIncidentReport.mockResolvedValue({ data: null, error: 'Database error' });
    render(<IncidentReportForm />);
    // Navigate to step 3
    fireEvent.click(screen.getByDisplayValue('harassment'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Threatening messages' } });
    fireEvent.click(screen.getByText('Continue'));
    // Check consent and submit
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText(/Database error/)).toBeTruthy();
    });
    // Should NOT navigate to success screen
    expect(screen.queryByText('Thank You for Your Report')).toBeNull();
  });

  it('shows success screen with reporting organizations', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('other'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Other incident' } });
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Report')).toBeTruthy();
    });
    expect(screen.getByText('Report Directly To:')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('FBI Tips')).toBeTruthy();
    expect(screen.getByText('Human Rights Watch')).toBeTruthy();
  });

  it('resets form when "Submit Another Report" is clicked', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('surveillance'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Report')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Submit Another Report'));
    // Should be back to step 1
    expect(screen.getByText('What type of incident are you reporting?')).toBeTruthy();
  });

  it('shows backend-aware success message when connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitIncidentReport.mockResolvedValue({ data: [{}], error: null });
    render(<IncidentReportForm />);
    fireEvent.click(screen.getByDisplayValue('academic'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Research interference' } });
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByRole('checkbox', { name: /Consent to Share Data/i }));
    fireEvent.click(screen.getByText('Submit Securely'));

    await waitFor(() => {
      expect(screen.getByText(/securely submitted/)).toBeTruthy();
    });
  });
});
