import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';

jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
}));

const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };

// Mock localStorage and AuthContext initialization
beforeEach(() => {
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const renderDashboard = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  it('renders loading state initially', async () => {
    api.get.mockResolvedValueOnce({ data: { notes: [] } });
    renderDashboard();
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders empty state when no notes exist', async () => {
    api.get.mockResolvedValueOnce({ data: { notes: [] } });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No notes')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating a new note.')).toBeInTheDocument();
    });
  });

  it('renders notes successfully', async () => {
    const mockNotes = [
      { id: '1', title: 'First Note', content: '<p>Content 1</p>', createdAt: '2023-01-01T00:00:00.000Z' },
      { id: '2', title: 'Second Note', content: '<p>Content 2</p>', createdAt: '2023-01-02T00:00:00.000Z' }
    ];
    api.get.mockResolvedValueOnce({ data: { notes: mockNotes } });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Failed to load notes. Please try again later.')).toBeInTheDocument();
    });
  });

  it('deletes a note successfully', async () => {
    const mockNotes = [
      { id: '1', title: 'First Note', content: '<p>Content 1</p>', createdAt: '2023-01-01T00:00:00.000Z' }
    ];
    api.get.mockResolvedValueOnce({ data: { notes: mockNotes } });
    api.delete.mockResolvedValueOnce({});
    
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-note-1'));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/notes/1');
      expect(screen.queryByText('First Note')).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
