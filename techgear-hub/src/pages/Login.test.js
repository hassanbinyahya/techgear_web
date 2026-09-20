import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';

describe('Login form', () => {
  test('shows and hides password text when toggle is clicked', async () => {
    const login = jest.fn().mockResolvedValue({
      success: true,
      user: { email: 'Admin321@gmail.com', role: 'admin' },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login, user: null, loading: false }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
