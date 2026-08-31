import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoteEditor from '../pages/NoteEditor';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';

jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
}));

jest.mock('../components/RichTextEditor', () => {
  return function MockRichTextEditor({ content, onChange }) {
    return <textarea data-testid="mock-editor" value={content} onChange={e => onChange(e.target.value)} />;
  };
});

const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };

beforeEach(() => {
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const renderNoteEditor = (route = '/note/new') => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/note/new" element={<NoteEditor />} />
          <Route path="/note/edit/:id" element={<NoteEditor />} />
          <Route path="/" element={<div data-testid="dashboard-page">Dashboard</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('NoteEditor Component', () => {
  it('renders create note form correctly', () => {
    renderNoteEditor('/note/new');
    expect(screen.getByText('Create New Note')).toBeInTheDocument();
    expect(screen.getByLabelText('Note Title')).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    renderNoteEditor('/note/new');
    const saveButton = screen.getByRole('button', { name: /save note/i });
    const form = saveButton.closest('form');
    
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Title and content are required.')).toBeInTheDocument();
    });
  });

  it('creates a note successfully and redirects', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Note created' } });
    renderNoteEditor('/note/new');

    const titleInput = screen.getByLabelText('Note Title');
    fireEvent.change(titleInput, { target: { value: 'New Test Note' } });

    const editorInput = screen.getByTestId('mock-editor');
    fireEvent.change(editorInput, { target: { value: '<p>Editor content</p>' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.submit(saveButton.closest('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/notes', {
        title: 'New Test Note',
        content: '<p>Editor content</p>'
      });
      // Verifying it redirected to Dashboard ("/")
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('loads note data in edit mode', async () => {
    api.get.mockResolvedValueOnce({ 
      data: { note: { title: 'Existing Note', content: '<p>Existing content</p>' } } 
    });
    
    renderNoteEditor('/note/edit/1');

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Edit Note')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
    });
  });

  it('displays error if fetching note fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    renderNoteEditor('/note/edit/1');

    await waitFor(() => {
      expect(screen.getByText('Failed to load note.')).toBeInTheDocument();
    });
  });
});
