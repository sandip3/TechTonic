import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import Community from './pages/Community'
import Profile from './pages/Profile'

// Pages that show the Navbar (not Dashboard / profile which have Sidebar)
const PAGES_WITH_NAVBAR = ['/', '/events', '/community', '/login', '/signup']

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages — show Navbar */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Landing />
          </>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/events"
        element={
          <>
            <Navbar />
            <Events />
          </>
        }
      />
      <Route
        path="/events/:id"
        element={
          <>
            <Navbar />
            <EventDetails />
          </>
        }
      />
      <Route
        path="/community"
        element={
          <>
            <Navbar />
            <Community />
          </>
        }
      />

      {/* Protected pages — use Sidebar inside, no Navbar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-6xl font-bold text-gray-200 mb-3">404</p>
                <p className="text-gray-500 mb-4">Page not found.</p>
                <a href="/" className="btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          </>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <AppRoutes />
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
