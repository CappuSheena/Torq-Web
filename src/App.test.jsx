import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Torq home screen', () => {
  it('renders the main home page content', () => {
    render(<App />);

    expect(screen.getByText(/keep the ride ready/i)).toBeInTheDocument();
    expect(screen.getByText(/maintenance status/i)).toBeInTheDocument();
    expect(screen.getByText(/bike snapshot/i)).toBeInTheDocument();
  });
});
