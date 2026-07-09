import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

// App uses react-router hooks (useNavigate, <Routes>), so it needs a Router
// ancestor in tests the same way main.jsx provides one via <BrowserRouter>.
function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

describe('Torq home screen', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main home page content', () => {
    renderApp();

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

    renderApp();

    // The header and the mobile menu drawer both render the signed-in state.
    expect((await screen.findAllByText(/signed in/i)).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rider').length).toBeGreaterThan(0);
  });
});
