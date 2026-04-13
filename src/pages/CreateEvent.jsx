import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

const CATEGORIES = ['Workshop', 'Hackathon', 'Talk', 'Bootcamp', 'Seminar', 'Webinar', 'Other'];

const defaultForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'Workshop',
};

export default function CreateEvent() {
  const { currentUser } = useAuth();
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (form.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.date) newErrors.date = 'Date is required.';
    if (!form.location.trim()) newErrors.location = 'Location is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    return newErrors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const event = addEvent({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    });
    setLoading(false);
    setSubmitted(true);

    setTimeout(() => {
      navigate(`/events/${event.id}`);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-1">Event Created!</h2>
            <p className="text-gray-500 text-sm">Redirecting to your event page...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in the details and publish your event to the community.
            </p>
          </div>

          {/* Form */}
          <div className="card p-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-5">
              {/* Title */}
              <div>
                <label
                  className="label"
                  htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. React Workshop for Beginners"
                  className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                <p className="text-xs text-gray-400 mt-1">{form.title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label
                  className="label"
                  htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell people what this event is about, what they'll learn, who should attend..."
                  className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="label"
                    htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`input-field ${errors.date ? 'border-red-400' : ''}`}
                  />
                  {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label
                    className="label"
                    htmlFor="time">
                    Time <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  className="label"
                  htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. SVNIT Surat, Lab 201 or Online (Zoom)"
                  className={`input-field ${errors.location ? 'border-red-400' : ''}`}
                />
                {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
              </div>

              {/* Category */}
              <div>
                <label
                  className="label"
                  htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-field">
                  {CATEGORIES.map(cat => (
                    <option
                      key={cat}
                      value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
              </div>

              {/* Organizer info (read-only) */}
              <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                <p className="text-xs text-gray-500">
                  This event will be published under your name:{' '}
                  <strong className="text-gray-700">{currentUser?.name}</strong>
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-2.5 disabled:opacity-60">
                  {loading ? 'Publishing...' : 'Publish Event'}
                </button>
                <Link
                  to="/dashboard"
                  className="btn-secondary flex-1 text-center py-2.5">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Tips */}
          <div className="mt-4 card p-4 bg-blue-50 border-blue-100">
            <p className="text-xs font-medium text-blue-800 mb-1">Tips for a good event listing</p>
            <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
              <li>Write a clear title that describes the event topic</li>
              <li>Mention prerequisites (e.g. "Basic Python knowledge required")</li>
              <li>Include what attendees will gain or build</li>
              <li>Specify if it's online or offline with clear location details</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
