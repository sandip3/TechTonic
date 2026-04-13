import React, { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/EventCard'

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Talk', 'Bootcamp', 'Seminar', 'Webinar', 'Other']

export default function Events() {
  const { events } = useEvents()
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const filtered = useMemo(() => {
    let result = [...events]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      )
    }

    if (category !== 'All') {
      result = result.filter((e) => e.category === category)
    }

    if (location.trim()) {
      const loc = location.toLowerCase()
      result = result.filter((e) => e.location?.toLowerCase().includes(loc))
    }

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.registrations?.length || 0) - (a.registrations?.length || 0))
    }

    return result
  }, [events, search, category, location, sortBy])

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setLocation('')
    setSortBy('date')
  }

  const hasFilters = search || category !== 'All' || location

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900">Tech Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="card p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-sm">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="label">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Event name, topic..."
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="label">Category</label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                        category === cat
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, college..."
                  className="input-field"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="label">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="date">Date (Upcoming first)</option>
                  <option value="newest">Newest added</option>
                  <option value="popular">Most popular</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Events grid */}
          <main className="flex-1">
            {/* Category tabs (mobile-friendly) */}
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="card p-10 text-center">
                <svg
                  className="w-10 h-10 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 text-sm mb-1">No events match your filters.</p>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
