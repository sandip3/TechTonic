import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'

export default function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const { events } = useEvents()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    college: currentUser?.college || '',
    skills: currentUser?.skills || '',
  })
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const myEvents = events.filter((e) => e.creatorId === currentUser?.id)
  const registeredEvents = events.filter(
    (e) => e.registrations?.includes(currentUser?.id) && e.creatorId !== currentUser?.id
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const result = updateProfile({
      name: form.name.trim(),
      bio: form.bio.trim(),
      college: form.college.trim(),
      skills: form.skills.trim(),
    })

    if (result.success) {
      setEditing(false)
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setForm({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      college: currentUser?.college || '',
      skills: currentUser?.skills || '',
    })
    setErrors({})
  }

  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your public profile and account info.</p>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-md">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Profile card */}
            <div className="md:col-span-2">
              <div className="card p-6">

                {/* Avatar + name */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 text-2xl font-bold font-display uppercase">
                      {currentUser?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-xl text-gray-900">{currentUser?.name}</h2>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Member since {joinedDate}</p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-secondary text-sm shrink-0"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="label" htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="label" htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell the community a bit about yourself..."
                        className="input-field resize-none"
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="college">College / University</label>
                      <input
                        id="college"
                        name="college"
                        type="text"
                        value={form.college}
                        onChange={handleChange}
                        placeholder="e.g. SVNIT Surat"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="skills">Skills / Interests</label>
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="e.g. React, Python, Machine Learning"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="submit" className="btn-primary flex-1">
                        Save Changes
                      </button>
                      <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Bio */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bio</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {currentUser?.bio || (
                          <span className="text-gray-400 italic">No bio added yet. Click Edit Profile to add one.</span>
                        )}
                      </p>
                    </div>

                    {/* College */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">College</p>
                      <p className="text-sm text-gray-700">
                        {currentUser?.college || <span className="text-gray-400 italic">Not specified</span>}
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                      {currentUser?.skills ? (
                        <div className="flex flex-wrap gap-1.5">
                          {currentUser.skills.split(',').map((skill, i) => (
                            <span key={i} className="badge bg-blue-50 text-blue-700 border border-blue-100">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats sidebar */}
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="font-display font-semibold text-gray-800 text-sm mb-3">Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Events created</span>
                    <span className="font-display font-bold text-blue-600">{myEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Events registered</span>
                    <span className="font-display font-bold text-green-600">{registeredEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total attendees</span>
                    <span className="font-display font-bold text-purple-600">
                      {myEvents.reduce((sum, e) => sum + (e.registrations?.length || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-display font-semibold text-gray-800 text-sm mb-3">Account</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-700 break-all">{currentUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Member since</p>
                    <p className="text-gray-700">{joinedDate}</p>
                  </div>
                </div>
              </div>

              <div className="card p-4 bg-amber-50 border-amber-100">
                <p className="text-xs font-medium text-amber-800 mb-1">Note</p>
                <p className="text-xs text-amber-700">
                  Your profile info is stored locally on your device using localStorage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
