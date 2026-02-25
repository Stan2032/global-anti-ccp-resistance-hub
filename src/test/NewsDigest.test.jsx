import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Supabase modules before importing component
vi.mock('../services/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));
vi.mock('../services/supabaseService', () => ({
  subscribeNewsletter: vi.fn(),
}));

import NewsDigest from '../components/NewsDigest';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { subscribeNewsletter } from '../services/supabaseService';

describe('NewsDigest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the newsletter form', () => {
    render(<NewsDigest />);
    expect(screen.getByText('Resistance News Digest')).toBeTruthy();
    expect(screen.getByText('Subscribe to News Digest')).toBeTruthy();
  });

  it('shows "Coming Soon" notice when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<NewsDigest />);
    expect(screen.getByText('Newsletter Coming Soon')).toBeTruthy();
  });

  it('hides "Coming Soon" notice when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<NewsDigest />);
    expect(screen.queryByText('Newsletter Coming Soon')).toBeNull();
  });

  it('shows "not yet active" footer when backend is not connected', () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<NewsDigest />);
    expect(screen.getByText(/Newsletter not yet active/)).toBeTruthy();
  });

  it('shows "Connected to secure backend" footer when backend is connected', () => {
    isSupabaseConfigured.mockReturnValue(true);
    render(<NewsDigest />);
    expect(screen.getByText(/Connected to secure backend/)).toBeTruthy();
  });

  it('submits without calling Supabase when not configured', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    render(<NewsDigest />);

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByText('Subscribe to News Digest'));

    await waitFor(() => {
      // Shows the post-submit screen
      expect(screen.getByText(/In the meantime, follow these trusted sources/)).toBeTruthy();
    });
    expect(subscribeNewsletter).not.toHaveBeenCalled();
  });

  it('calls subscribeNewsletter when backend is connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    subscribeNewsletter.mockResolvedValue({ data: [{}], error: null });
    render(<NewsDigest />);

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByText('Subscribe to News Digest'));

    await waitFor(() => {
      expect(screen.getByText("You're Subscribed!")).toBeTruthy();
    });
    expect(subscribeNewsletter).toHaveBeenCalledWith('user@example.com');
  });

  it('shows error message when Supabase subscription fails', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    subscribeNewsletter.mockResolvedValue({ data: null, error: 'Network error' });
    render(<NewsDigest />);

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByText('Subscribe to News Digest'));

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeTruthy();
    });
    // Should NOT navigate to success screen
    expect(screen.queryByText("You're Subscribed!")).toBeNull();
  });

  it('shows backend-aware success message when connected', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    subscribeNewsletter.mockResolvedValue({ data: [{}], error: null });
    render(<NewsDigest />);

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByText('Subscribe to News Digest'));

    await waitFor(() => {
      expect(screen.getByText(/Your email has been added to our newsletter list/)).toBeTruthy();
    });
  });
});
