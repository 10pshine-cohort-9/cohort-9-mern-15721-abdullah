import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { AuthProvider } from '../context/AuthContext';

// Mock the axios api service
jest.mock('../services/api', () => ({
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

import api from '../services/api';

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Auth Components', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Component', () => {
    it('renders login form correctly', () => {
      renderWithProviders(<Login />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('displays error on failed login', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { error: 'Invalid credentials' } }
      });

      renderWithProviders(<Login />);
      
      fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Register Component', () => {
    it('renders register form correctly', () => {
      renderWithProviders(<Register />);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    });
  });
});
