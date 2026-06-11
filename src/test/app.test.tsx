import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '@/pages/WelcomePage';

describe('app smoke test', () => {
  it('renders the welcome page', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Safeguarding Simulation/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /begin simulation/i })).toBeTruthy();
  });
});
