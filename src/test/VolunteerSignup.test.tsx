import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Supabase modules before importing component
vi.mock('../services/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));
vi.mock('../services/supabaseService', () => ({
  submitVolunteerSignup: vi.fn(),
}));

import VolunteerSignup from '../components/VolunteerSignup';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { submitVolunteerSignup } from '../services/supabaseService';

describe('VolunteerSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the volunteer form', () => {
    render(<VolunteerSignup />);
    expect(screen.getByText('Volunteer With Us')).toBeTruthy();
    expect(screen.getByText('Submit Volunteer Application')).toBeTruthy();
  });

  it('shows "Coming Soon" notice when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<VolunteerSignup />);
    expect(screen.getByText('Form Not Yet Connected (Coming Soon)')).toBeTruthy();
  });

  it('hides "Coming Soon" notice when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<VolunteerSignup />);
    expect(screen.queryByText('Form Not Yet Connected (Coming Soon)')).toBeNull();
  });

  it('shows "not yet active" footer when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<VolunteerSignup />);
    expect(screen.getByText(/Form not yet active/)).toBeTruthy();
  });

  it('shows "Connected to secure backend" footer when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<VolunteerSignup />);
    expect(screen.getByText(/Connected to secure backend/)).toBeTruthy();
  });

  it('submits without calling Supabase when not configured', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<VolunteerSignup />);

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText('Availability *'), { target: { value: '1-5' } });
    fireEvent.click(screen.getByText('Submit Volunteer Application'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Interest!')).toBeTruthy();
    });
    expect(submitVolunteerSignup).not.toHaveBeenCalled();
  });

  it('calls submitVolunteerSignup when backend is connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitVolunteerSignup.mockResolvedValue({ data: [{}], error: null });
    render(<VolunteerSignup />);

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText('Availability *'), { target: { value: '1-5' } });
    fireEvent.click(screen.getByText('Submit Volunteer Application'));

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Interest!')).toBeTruthy();
    });
    expect(submitVolunteerSignup).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane',
        email: 'jane@test.com',
        availability: '1-5',
      })
    );
  });

  it('shows error message when Supabase submission fails', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitVolunteerSignup.mockResolvedValue({ data: null, error: 'Database error' });
    render(<VolunteerSignup />);

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText('Availability *'), { target: { value: '1-5' } });
    fireEvent.click(screen.getByText('Submit Volunteer Application'));

    await waitFor(() => {
      expect(screen.getByText(/Database error/)).toBeTruthy();
    });
    // Should NOT navigate to success screen
    expect(screen.queryByText('Thank You for Your Interest!')).toBeNull();
  });

  it('shows backend-aware success message when connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitVolunteerSignup.mockResolvedValue({ data: [{}], error: null });
    render(<VolunteerSignup />);

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText('Availability *'), { target: { value: '1-5' } });
    fireEvent.click(screen.getByText('Submit Volunteer Application'));

    await waitFor(() => {
      expect(screen.getByText(/securely submitted/)).toBeTruthy();
    });
  });
});
