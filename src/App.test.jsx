import { render, screen } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Torq home screen', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main home page content', () => {
    render(<App />);

    expect(screen.getByText(/keep the ride ready/i)).toBeInTheDocument();
    expect(screen.getByText(/maintenance status/i)).toBeInTheDocument();
    expect(screen.getByText(/built for glasgow riders/i)).toBeInTheDocument();
  });

  it('restores a signed-in session from the stored token', async () => {
    localStorage.setItem('torq_token', 'test-token');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ user: { id: 1, email: 'rider@example.com', display_name: 'Rider' } }),
      })
    );

    render(<App />);

    // The header and the mobile menu drawer both render the signed-in state.
    expect((await screen.findAllByText(/signed in/i)).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rider').length).toBeGreaterThan(0);
  });
});
