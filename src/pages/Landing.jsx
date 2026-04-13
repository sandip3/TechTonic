import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'

const CATEGORY_FILTERS = ['All', 'Workshop', 'Hackathon', 'Talk', 'Bootcamp', 'Seminar', 'Webinar']

export default function Landing() {
  const { events } = useEvents()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/events?search=${encodeURIComponent(search)}`)
  }

  // Show 3 most recent events as preview
  const previewEvents = events.slice(0, 3)

  const stats = [
    { label: 'Events Listed', value: events.length + '+' },
    { label: 'Categories', value: '6' },
    { label: 'Cities', value: '10+' },
    { label: 'Community Members', value: '200+' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-5 border border-blue-100">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              For students & developers
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Discover Tech Events
              <br />
              <span className="text-blue-600">Near You</span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
              Find workshops, hackathons, talks and bootcamps. Connect with the
              developer community around you.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, topics, locations..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {CATEGORY_FILTERS.slice(1).map((cat) => (
                <Link
                  key={cat}
                  to={`/events?category=${cat}`}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-white"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 text-sm mt-0.5">Latest tech events in your area</p>
          </div>
          <Link to="/events" className="btn-secondary text-sm">
            View all →
          </Link>
        </div>

        {previewEvents.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">No events yet. Be the first to create one!</p>
            {currentUser && (
              <Link to="/create-event" className="btn-primary mt-4 inline-block">
                Create Event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      {!currentUser && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-blue-600 rounded-lg p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Join TechTonic Today
            </h2>
            <p className="text-blue-100 mb-6 text-sm">
              Create events, connect with developers, and grow your skills.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/events"
                className="border border-blue-400 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Sign Up',
              desc: 'Create a free account with your email. It takes less than a minute.',
            },
            {
              step: '02',
              title: 'Discover Events',
              desc: 'Browse workshops, hackathons, and talks. Filter by category or location.',
            },
            {
              step: '03',
              title: 'Participate & Connect',
              desc: 'Register for events, comment, and connect with other tech enthusiasts.',
            },
          ].map((item) => (
            <div key={item.step} className="card p-5">
              <span className="text-3xl font-display font-bold text-blue-100">{item.step}</span>
              <h3 className="font-display font-semibold text-gray-900 mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">TT</span>
            </div>
            <span className="font-display font-bold text-gray-700 text-sm">TechTonic</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 TechTonic. Built for students, by students.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/events" className="hover:text-gray-600">Events</Link>
            <Link to="/community" className="hover:text-gray-600">Community</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
