import { useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { events, deleteEvent, updateEvent } = useEvents();

  if (!currentUser) {
    return null;
  }

  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Events created by this user
  const myEvents = events.filter(e => e.creatorId === currentUser?.id);
  const allEvents = events;

  // Events this user registered for
  const registeredEvents = events.filter(
    e => e.creatorId !== currentUser?.id && e.registrations?.includes(currentUser?.id)
  );

  const stats = [
    { label: 'Events Created', value: myEvents.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    {
      label: 'Registrations',
      value: registeredEvents.length,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Attendees',
      value: myEvents.reduce((sum, e) => sum + (e.registrations?.length || 0), 0),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const handleDeleteClick = id => setDeleteConfirm(id);

  const handleDeleteConfirm = () => {
    deleteEvent(deleteConfirm);
    setDeleteConfirm(null);
    showSuccess('Event deleted.');
  };

  const handleEditClick = event => {
    setEditingEvent(event.id);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || '',
      location: event.location,
      category: event.category,
    });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    if (!editForm.title || !editForm.date || !editForm.location) {
      return;
    }
    updateEvent(editingEvent, editForm);
    setEditingEvent(null);
    showSuccess('Event updated successfully!');
  };

  const showSuccess = msg => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const CATEGORIES = ['Workshop', 'Hackathon', 'Talk', 'Bootcamp', 'Seminar', 'Webinar', 'Other'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Welcome back, {currentUser?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Here's an overview of your activity on TechTonic.
            </p>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-md">
              {successMsg}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map(stat => (
              <div
                key={stat.label}
                className={`card p-5 ${stat.bg}`}>
                <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Events */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-900">My Events</h2>
              <Link
                to="/create-event"
                className="btn-primary text-sm">
                + Create New
              </Link>
            </div>

            {myEvents.length === 0 ?
              <div className="card p-8 text-center">
                <svg
                  className="w-10 h-10 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-gray-500 text-sm mb-3">You haven't created any events yet.</p>
                <Link
                  to="/create-event"
                  className="btn-primary text-sm">
                  Create your first event
                </Link>
              </div>
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={
                      currentUser?.role === 'admin' || event.creatorId === currentUser?.id
                    }
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            }
          </section>

          {/* All Events (Admin View) */}
          {currentUser?.role === 'admin' && (
            <section className="mb-8">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
                All Events (Admin)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={true}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Registered Events */}
          {registeredEvents.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
                Events I'm Attending
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display font-semibold text-gray-900 mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone. The event will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="btn-danger flex-1">
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 py-8 overflow-auto">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl my-auto">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Edit Event</h3>
            <form
              onSubmit={handleEditSubmit}
              className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="input-field resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date *</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Time</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="label">Location *</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="input-field">
                  {CATEGORIES.map(c => (
                    <option
                      key={c}
                      value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex-1">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
