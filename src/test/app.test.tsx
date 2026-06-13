import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '@/pages/WelcomePage';

describe('app smoke test', () => {
  it('renders the Heli welcome page with modes and scenarios', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Heli' })).toBeTruthy();
    // Both modes offered
    expect(screen.getByRole('radio', { name: /story mode/i })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /training mode/i })).toBeTruthy();
    // Both scenarios now playable
    expect(screen.getByText(/Jamie's Story/)).toBeTruthy();
    expect(screen.getByText(/Lazlo's Story/)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /begin simulation/i }).length).toBeGreaterThanOrEqual(1);
  });
});
