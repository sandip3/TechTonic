import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

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

const categoryColors = {
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  Hackathon: 'bg-orange-50 text-orange-700 border-orange-200',
  Talk: 'bg-green-50 text-green-700 border-green-200',
  Bootcamp: 'bg-purple-50 text-purple-700 border-purple-200',
  Seminar: 'bg-teal-50 text-teal-700 border-teal-200',
  Webinar: 'bg-pink-50 text-pink-700 border-pink-200',
  Other: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, addComment, getComments } = useEvents();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const event = getEventById(id);
  const comments = getComments(id);

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [registered, setRegistered] = useState(
    currentUser ? event?.registrations?.includes(currentUser.id) : false
  );

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center card p-10 max-w-sm mx-auto">
          <p className="text-gray-500 mb-4">Event not found.</p>
          <Link
            to="/events"
            className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isRegistered = currentUser && event.registrations?.includes(currentUser.id);
  const colors = categoryColors[event.category] || categoryColors['Other'];

  const handleRegister = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    registerForEvent(event.id, currentUser.id);
    setRegistered(!registered);
  };

  const handleComment = e => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    addComment(id, {
      userId: currentUser.id,
      userName: currentUser.name,
      text: commentText.trim(),
    });
    setCommentText('');
    setCommentError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Event header */}
            <div className="card p-6">
              <span className={`badge border ${colors} mb-3`}>{event.category || 'Other'}</span>
              <h1 className="font-display text-2xl font-bold text-gray-900 leading-snug mb-4">
                {event.title}
              </h1>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {formatDate(event.date)}
                    {event.time ? ` at ${event.time}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    Organized by <strong>{event.creatorName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-3">About this Event</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Comments */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-4">
                Discussion ({comments.length})
              </h2>

              {/* Comment form */}
              <form
                onSubmit={handleComment}
                className="mb-5">
                {!currentUser && (
                  <p className="text-sm text-gray-500 mb-2">
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline">
                      Log in
                    </Link>{' '}
                    to join the discussion.
                  </p>
                )}
                <textarea
                  value={commentText}
                  onChange={e => {
                    setCommentText(e.target.value);
                    setCommentError('');
                  }}
                  placeholder={
                    currentUser ? 'Ask a question or share a thought...' : 'Log in to comment'
                  }
                  disabled={!currentUser}
                  rows={3}
                  className="input-field resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                {commentError && <p className="text-xs text-red-600 mt-1">{commentError}</p>}
                {currentUser && (
                  <button
                    type="submit"
                    className="btn-primary mt-2 text-sm">
                    Post Comment
                  </button>
                )}
              </form>

              {/* Comment list */}
              {comments.length === 0 ?
                <p className="text-sm text-gray-400 text-center py-4">
                  No comments yet. Be the first to start the discussion!
                </p>
              : <div className="space-y-4">
                  {comments.map(comment => (
                    <div
                      key={comment.id}
                      className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-gray-600 text-xs font-semibold uppercase">
                          {comment.userName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-gray-800">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Register card */}
            <div className="card p-5">
              <div className="text-center mb-4">
                <p className="text-2xl font-display font-bold text-gray-900">
                  {event.registrations?.length || 0}
                </p>
                <p className="text-sm text-gray-500">people registered</p>
              </div>

              <button
                onClick={handleRegister}
                className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isRegistered ?
                    'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  : 'btn-primary'
                }`}>
                {isRegistered ? '✓ Registered (Click to cancel)' : 'Register for Event'}
              </button>

              {!currentUser && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline">
                    Log in
                  </Link>{' '}
                  to register
                </p>
              )}
            </div>

            {/* Event details card */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-gray-800 mb-3 text-sm">
                Event Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                  <p className="text-gray-700 mt-0.5">{formatDate(event.date)}</p>
                </div>
                {event.time && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
                    <p className="text-gray-700 mt-0.5">{event.time}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                  <p className="text-gray-700 mt-0.5">{event.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Category</p>
                  <p className="text-gray-700 mt-0.5">{event.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Organizer</p>
                  <p className="text-gray-700 mt-0.5">{event.creatorName}</p>
                </div>
              </div>
            </div>

            {/* Share prompt */}
            <div className="card p-4 bg-blue-50 border-blue-100">
              <p className="text-xs text-blue-700 font-medium mb-1">Share this event</p>
              <p className="text-xs text-blue-600">
                Copy the URL and share it with your classmates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
