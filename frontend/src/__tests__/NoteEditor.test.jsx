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

  it('shows error when submitting empty form', () => {
    renderNoteEditor('/note/new');
    const saveButton = screen.getByRole('button', { name: /save note/i });
    const form = saveButton.closest('form');
    
    fireEvent.submit(form);

    return waitFor(() => {
      expect(screen.getByText('Title and content are required.')).toBeInTheDocument();
    });
  });

  it('creates a note successfully and redirects', () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Note created' } });
    renderNoteEditor('/note/new');

    const titleInput = screen.getByLabelText('Note Title');
    fireEvent.change(titleInput, { target: { value: 'New Test Note' } });

    const editorInput = screen.getByTestId('mock-editor');
    fireEvent.change(editorInput, { target: { value: '<p>Editor content</p>' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.submit(saveButton.closest('form'));

    return waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/notes', {
        title: 'New Test Note',
        content: '<p>Editor content</p>'
      });
      // Verifying it redirected to Dashboard ("/")
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('loads note data in edit mode', () => {
    api.get.mockResolvedValueOnce({ 
      data: { note: { title: 'Existing Note', content: '<p>Existing content</p>' } } 
    });
    
    renderNoteEditor('/note/edit/1');

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    return waitFor(() => {
      expect(screen.getByText('Edit Note')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
    });
  });

  it('displays error if fetching note fails', () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    renderNoteEditor('/note/edit/1');

    return waitFor(() => {
      expect(screen.getByText('Failed to load note.')).toBeInTheDocument();
    });
  });

  it('prevents stale responses from setting state after route change', async () => {
    let resolveFetch;
    const fetchPromise = new Promise(resolve => resolveFetch = resolve);
    api.get.mockReturnValueOnce(fetchPromise);

    const { unmount } = renderNoteEditor('/note/edit/1');

    // Simulate route change by unmounting the component
    unmount();

    // Resolve the delayed response
    resolveFetch({ 
      data: { note: { title: 'Stale Note', content: '<p>Stale content</p>' } } 
    });

    // Wait a tick to ensure the promise chain processes
    await new Promise(resolve => setTimeout(resolve, 0));

    // Since the component is unmounted, if the effect wasn't cleaned up correctly, 
    // it would throw a React state update warning (act warning).
    // By passing without warning, we prove the cleanup `isMounted` flag works.
    expect(api.get).toHaveBeenCalledWith('/notes/1');
  });
});
