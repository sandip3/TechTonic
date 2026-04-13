# TechTonic 🚀

A simple tech event discovery and community platform built for college students and developers.

Built with **React 18 + Vite + Tailwind CSS**. All data is stored in `localStorage` (no backend required).

---

## Project Structure

```
techtonic/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx               ← Entry point
    ├── App.jsx                ← Routes setup
    ├── index.css              ← Global styles + Tailwind
    ├── context/
    │   ├── AuthContext.jsx    ← Auth state (login, signup, logout)
    │   └── EventContext.jsx   ← Events, comments, community posts
    ├── components/
    │   ├── Navbar.jsx         ← Top navigation bar
    │   ├── Sidebar.jsx        ← Dashboard sidebar
    │   ├── EventCard.jsx      ← Reusable event card
    │   └── ProtectedRoute.jsx ← Route guard for auth
    └── pages/
        ├── Landing.jsx        ← Home / hero page
        ├── Login.jsx          ← Login form
        ├── Signup.jsx         ← Signup form
        ├── Events.jsx         ← All events + filters
        ├── EventDetails.jsx   ← Single event + comments
        ├── Dashboard.jsx      ← User dashboard (sidebar)
        ├── CreateEvent.jsx    ← Create event form
        ├── Community.jsx      ← Community posts
        └── Profile.jsx        ← User profile + edit
```

---

## Features

### Authentication
- Sign up with name, email, password
- Login / Logout
- Session persisted in `localStorage`
- Protected routes (redirect to login if not logged in)
- User info shown in Navbar

### Events System
- 6 seed events loaded on first run
- Create, edit, delete events (only your own)
- Register / unregister for events
- Filter by category, location, and date
- Search events from the hero search bar

### Discussion System
- Comments per event
- Any logged-in user can comment
- Stored in `localStorage`

### Community Posts
- Any user can write a post
- Like posts (tracked per session)
- Search posts by title, content, tags, or author

### Profile
- View and edit your name, bio, college, skills
- Activity stats (events created, registered, total attendees)
- Saved to `localStorage`

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## localStorage Keys Used

| Key | Contents |
|-----|----------|
| `techtonic_users` | Array of all registered users |
| `techtonic_session` | Currently logged-in user (no password) |
| `techtonic_events` | All events (seed + user-created) |
| `techtonic_comments` | Object: eventId → comments array |
| `techtonic_posts` | Community posts array |
| `techtonic_liked_posts` | Array of post IDs liked by current user |

---

## Tech Stack

- **React 18** – Functional components, hooks
- **React Router v6** – Client-side routing
- **Tailwind CSS v3** – Utility-first styling
- **Vite** – Fast dev server and build tool
- **localStorage** – Client-side data persistence

No TypeScript. No backend. Pure JavaScript (.js / .jsx) only.

---

## Pages & Routes

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/events` | Events list | No |
| `/events/:id` | Event details | No (login to register/comment) |
| `/community` | Community posts | No (login to post) |
| `/dashboard` | Dashboard | ✅ Yes |
| `/create-event` | Create event | ✅ Yes |
| `/profile` | Profile | ✅ Yes |

---

## How to Reset Data

Open browser DevTools → Application → Local Storage → Delete all `techtonic_*` keys → Refresh.
The seed data will be loaded again automatically.

---

*Built as a college project. Functional, clean, and easy to explain.*

## Limitations
- This project uses localStorage (no backend)
- It is a frontend prototype
- Not suitable for production use
