import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Supabase modules before importing component
vi.mock('../services/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));
vi.mock('../services/supabaseService', () => ({
  submitContactMessage: vi.fn(),
}));

import ContactForm from '../components/ContactForm';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { submitContactMessage } from '../services/supabaseService';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact form', () => {
    render(<ContactForm />);
    expect(screen.getByText('Contact Us')).toBeTruthy();
    expect(screen.getByText('Send Message')).toBeTruthy();
  });

  it('shows "Coming Soon" notice when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<ContactForm />);
    expect(screen.getByText('Form Not Yet Connected (Coming Soon)')).toBeTruthy();
  });

  it('hides "Coming Soon" notice when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<ContactForm />);
    expect(screen.queryByText('Form Not Yet Connected (Coming Soon)')).toBeNull();
  });

  it('shows "not yet active" footer when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<ContactForm />);
    expect(screen.getByText(/Form not yet active/)).toBeTruthy();
  });

  it('shows "Connected to secure backend" footer when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<ContactForm />);
    expect(screen.getByText(/Connected to secure backend/)).toBeTruthy();
  });

  it('submits without calling Supabase when not configured', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => {
      expect(screen.getByText('Message Received')).toBeTruthy();
    });
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('calls submitContactMessage when backend is connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitContactMessage.mockResolvedValue({ data: [{}], error: null });
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => {
      expect(screen.getByText('Message Received')).toBeTruthy();
    });
    expect(submitContactMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John',
        email: 'john@test.com',
        message: 'Hello there',
      })
    );
  });

  it('shows error message when Supabase submission fails', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitContactMessage.mockResolvedValue({ data: null, error: 'Database error' });
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => {
      expect(screen.getByText(/Database error/)).toBeTruthy();
    });
    // Should NOT navigate to success screen
    expect(screen.queryByText('Message Received')).toBeNull();
  });

  it('shows backend-aware success message when connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    submitContactMessage.mockResolvedValue({ data: [{}], error: null });
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => {
      expect(screen.getByText(/securely submitted/)).toBeTruthy();
    });
  });
});
