import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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
          <div className="text-center py-12 text-gray-500" data-testid="loading-indicator">
            Loading your notes...
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
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-64"
              >
                <div className="p-5 flex-grow overflow-hidden">
                  <h3 className="text-lg font-medium text-gray-900 truncate mb-2">{note.title}</h3>
                  <div 
                    className="prose prose-sm text-gray-600 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-3">
                    <Link
                      to={`/note/edit/${note.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                      data-testid={`delete-note-${note.id}`}
                    >
                      Delete
                    </button>
                  </div>
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
