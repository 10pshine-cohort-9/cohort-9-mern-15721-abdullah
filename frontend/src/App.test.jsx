import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the axios api service to avoid import.meta errors in Jest
jest.mock('./services/api', () => ({
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

test('renders App and redirects to login when unauthenticated', () => {
  render(<App />);
  // When unauthenticated, ProtectedRoute redirects to /login, which renders the Login form
  const heading = screen.getByText(/Welcome Back/i);
  expect(heading).toBeInTheDocument();
});
