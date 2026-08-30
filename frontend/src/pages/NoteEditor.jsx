import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!id;

  useEffect(() => {
    let isMounted = true;

    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        if (isMounted) {
          setTitle(response.data.note.title);
          setContent(response.data.note.content);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load note.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isEditMode) {
      setLoading(true);
      fetchNote();
    } else {
      setTitle('');
      setContent('');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    const plainTextContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !plainTextContent) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/notes/${id}`, { title, content });
      } else {
        await api.post('/notes', { title, content });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save note.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-500" data-testid="loading-indicator">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium flex items-center">
            &larr; Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Note' : 'Create New Note'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Note Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note Content
              </label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NoteEditor;
