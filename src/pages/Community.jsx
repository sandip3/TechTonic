import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Community() {
  const { posts, addPost, likePost } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return null;
  }

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [errors, setErrors] = useState({});
  const [likedPosts, setLikedPosts] = useState(() => {
    const stored = localStorage.getItem('techtonic_liked_posts');
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState('');

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredPosts = sortedPosts.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.tags?.toLowerCase().includes(q) ||
      p.authorName?.toLowerCase().includes(q)
    );
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.content.trim()) e.content = 'Content is required.';
    if (form.content.trim().length < 20) e.content = 'Please write at least 20 characters.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addPost({
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
    });
    setForm({ title: '', content: '', tags: '' });
    setShowForm(false);
  };

  const handleLike = postId => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (likedPosts.includes(postId)) return; // already liked
    likePost(postId);
    const updated = [...likedPosts, postId];
    setLikedPosts(updated);
    localStorage.setItem('techtonic_liked_posts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Community</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Share ideas, resources, and experiences with fellow developers.
            </p>
          </div>
          {currentUser ?
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm">
              {showForm ? 'Cancel' : '+ New Post'}
            </button>
          : <Link
              to="/login"
              className="btn-primary text-sm">
              Log in to Post
            </Link>
          }
        </div>

        {/* Create post form */}
        {showForm && (
          <div className="card p-5 mb-6 border-blue-100 bg-blue-50">
            <h2 className="font-display font-semibold text-gray-900 mb-4">
              Share with the Community
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. How I learned React in 30 days"
                  className={`input-field ${errors.title ? 'border-red-400' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="label">Content *</label>
                <textarea
                  name="content"
                  rows={5}
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your thoughts, tips, resources, or story..."
                  className={`input-field resize-none ${errors.content ? 'border-red-400' : ''}`}
                />
                {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
              </div>
              <div>
                <label className="label">
                  Tags{' '}
                  <span className="text-gray-400 font-normal">(optional, comma separated)</span>
                </label>
                <input
                  name="tags"
                  type="text"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="react, javascript, open source"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary">
                  Publish Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input-field max-w-sm"
          />
        </div>

        {/* Posts list */}
        {filteredPosts.length === 0 ?
          <div className="card p-10 text-center">
            <p className="text-gray-500 text-sm mb-2">No posts found.</p>
            {currentUser && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-sm">
                Write the first post
              </button>
            )}
          </div>
        : <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="card p-5 hover:shadow-md transition-shadow">
                {/* Author + time */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 text-xs font-semibold uppercase">
                      {post.authorName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">{post.authorName}</span>
                    <span className="text-xs text-gray-400 ml-2">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-gray-900 text-base mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Content preview */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.content}</p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="badge bg-gray-100 text-gray-600">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      likedPosts.includes(post.id) ?
                        'text-blue-600 font-medium'
                      : 'text-gray-400 hover:text-blue-500'
                    }`}>
                    <svg
                      className="w-4 h-4"
                      fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>
                      {post.likes || 0} {(post.likes || 0) === 1 ? 'like' : 'likes'}
                    </span>
                  </button>

                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-400">Posted by {post.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
