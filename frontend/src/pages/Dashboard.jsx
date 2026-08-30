import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data.notes);
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note. Please try again.');
    }
  };

  const handleCardClick = (id) => {
    navigate(`/note/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Notes Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button 
              onClick={logout}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Notes</h2>
          <Link
            to="/note/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Create Note
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="loading-indicator">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-64 animate-pulse">
                <div className="p-5 flex-grow">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new note.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div 
                key={note.id}
                onClick={() => handleCardClick(note.id)}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col h-64"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // Ignore events that bubble up from child buttons
                  if (e.target.tagName.toLowerCase() === 'button') return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(note.id);
                  }
                }}
              >
                <div className="p-5 flex-grow overflow-hidden">
                  <h3 className="text-lg font-medium text-gray-900 truncate mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap">
                    {note.content
                      .replace(/<\/p>|<br\s*\/?>|<\/li>|<\/h[1-6]>/gi, '\n')
                      .replace(/<[^>]+>/g, '')
                      .replace(/\n\s*\n/g, '\n')
                      .trim()}
                  </p>
                </div>
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, note.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-900"
                    data-testid={`delete-note-${note.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
