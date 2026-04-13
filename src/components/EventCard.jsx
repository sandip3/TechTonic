import React from 'react'
import { Link } from 'react-router-dom'

const categoryColors = {
  Workshop:  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Hackathon: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Talk:      { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  Bootcamp:  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Seminar:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  Webinar:   { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200' },
  Other:     { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200' },
}

function formatDate(dateStr) {
  if (!dateStr) return 'Date TBD'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event, showActions, onDelete, onEdit }) {
  const colors = categoryColors[event.category] || categoryColors['Other']

  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Category badge */}
      <div className="flex items-center justify-between">
        <span
          className={`badge border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {event.category || 'Other'}
        </span>
        <span className="text-xs text-gray-400">
          {event.registrations?.length || 0} registered
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-display font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {event.title}
        </h3>
      </div>

      {/* Meta info */}
      <div className="space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.location || 'Location TBD'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>by {event.creatorName || 'Anonymous'}</span>
        </div>
      </div>

      {/* Description preview */}
      {event.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 mt-auto">
        <Link
          to={`/events/${event.id}`}
          className="btn-primary flex-1 text-center text-xs"
        >
          View Details
        </Link>

        {showActions && (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="btn-secondary text-xs px-3 py-2"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="text-xs px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
