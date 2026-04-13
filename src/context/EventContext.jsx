import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext(null);

// Seed data so the app is not empty on first run
const SEED_EVENTS = [
  {
    id: 'event_seed_1',
    title: 'React & Modern Frontend Workshop',
    description:
      'A hands-on workshop covering React hooks, state management with Context API, and building real-world applications. Perfect for students who want to level up their frontend skills.',
    date: '2025-08-15',
    time: '10:00',
    location: 'SVNIT Surat, Lab 201',
    category: 'Workshop',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event_seed_2',
    title: 'Open Source Contribution Drive',
    description:
      'Join us for a full-day hackathon where you contribute to real open source projects on GitHub. Mentors will guide you through your first pull request!',
    date: '2025-08-22',
    time: '09:00',
    location: 'Online (Discord)',
    category: 'Hackathon',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event_seed_3',
    title: 'AI & Machine Learning Talk',
    description: `An introductory session on Artificial Intelligence and Machine Learning concepts. We'll cover supervised learning, neural networks, and career paths in AI.`,
    date: '2025-09-05',
    time: '14:00',
    location: 'DDIT, Nadiad – Seminar Hall',
    category: 'Talk',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event_seed_4',
    title: 'DSA Bootcamp – Crack Placement Season',
    description:
      'A 3-day intensive bootcamp on Data Structures and Algorithms. Focus on arrays, trees, graphs, and dynamic programming. Ideal for students preparing for placements.',
    date: '2025-09-18',
    time: '09:00',
    location: 'SCET Surat, Room 301',
    category: 'Bootcamp',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event_seed_5',
    title: 'Web3 & Blockchain Seminar',
    description:
      'Explore the world of blockchain, smart contracts on Ethereum, and decentralized apps. No prior experience needed — just curiosity!',
    date: '2025-10-01',
    time: '11:00',
    location: 'CHARUSAT, Anand',
    category: 'Seminar',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event_seed_6',
    title: 'UI/UX Design for Developers',
    description: `Learn the basics of user experience and interface design. We'll use Figma to design mockups and talk about design principles every developer should know.`,
    date: '2025-10-10',
    time: '13:00',
    location: 'Online (Zoom)',
    category: 'Workshop',
    creatorId: 'seed',
    creatorName: 'TechTonic Team',
    registrations: [],
    createdAt: new Date().toISOString(),
  },
];

const SEED_POSTS = [
  {
    id: 'post_seed_1',
    title: 'How I built my first open source project',
    content: `I always thought contributing to open source was only for senior developers. Turns out, even a second-year student can make meaningful contributions. Here's what I learned...`,
    authorId: 'seed',
    authorName: 'Rahul Sharma',
    tags: 'open source, git, github',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: 12,
  },
  {
    id: 'post_seed_2',
    title: 'Resources I used to learn React in 30 days',
    content:
      'React was intimidating at first but with the right resources it became much clearer. I used the official docs, a few YouTube channels, and built 3 small projects. Sharing my roadmap here.',
    authorId: 'seed',
    authorName: 'Priya Mehta',
    tags: 'react, javascript, learning',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 8,
  },
  {
    id: 'post_seed_3',
    title: 'Tips for surviving your first hackathon',
    content:
      'Hackathons are intense but so rewarding. My biggest mistake in my first one was trying to build too much. Scope it down, focus on the core idea, and make sure you have a working demo.',
    authorId: 'seed',
    authorName: 'Arjun Patel',
    tags: 'hackathon, tips, teamwork',
    createdAt: new Date().toISOString(),
    likes: 15,
  },
];

const SEED_COMMENTS = {
  event_seed_1: [
    {
      id: 'cmt_1',
      userId: 'seed',
      userName: 'Ananya K.',
      text: 'Really looking forward to this one! Will there be any hands-on coding?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'cmt_2',
      userId: 'seed',
      userName: 'Dev Organizer',
      text: 'Yes! About 60% of the session will be hands-on. Bring your laptop.',
      createdAt: new Date().toISOString(),
    },
  ],
  event_seed_2: [
    {
      id: 'cmt_3',
      userId: 'seed',
      userName: 'Rohan M.',
      text: 'Do we need prior open source experience for this?',
      createdAt: new Date().toISOString(),
    },
  ],
};

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  // Load data from localStorage or use seed data on first run
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('techtonic_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(SEED_EVENTS);
        localStorage.setItem('techtonic_events', JSON.stringify(SEED_EVENTS));
      }

      const storedPosts = localStorage.getItem('techtonic_posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(SEED_POSTS);
        localStorage.setItem('techtonic_posts', JSON.stringify(SEED_POSTS));
      }

      const storedComments = localStorage.getItem('techtonic_comments');
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments(SEED_COMMENTS);
        localStorage.setItem('techtonic_comments', JSON.stringify(SEED_COMMENTS));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setEvents(SEED_EVENTS);
      setPosts(SEED_POSTS);
      setComments(SEED_COMMENTS);
    }
  }, []);

  const saveEvents = data => {
    setEvents(data);
    localStorage.setItem('techtonic_events', JSON.stringify(data));
  };

  // ── Events ───────────────────────────────────────────

  const addEvent = eventData => {
    const newEvent = {
      ...eventData,
      id: 'event_' + Date.now(),
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...events];
    saveEvents(updated);
    return newEvent;
  };

  const updateEvent = (id, eventData) => {
    const updated = events.map(e => (e.id === id ? { ...e, ...eventData } : e));
    saveEvents(updated);
  };

  const deleteEvent = id => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  const registerForEvent = (eventId, userId) => {
    const updated = events.map(e => {
      if (e.id === eventId) {
        const already = e.registrations.includes(userId);
        const registrations =
          already ? e.registrations.filter(r => r !== userId) : [...e.registrations, userId];
        return { ...e, registrations };
      }
      return e;
    });
    saveEvents(updated);
  };

  const getEventById = id => events.find(e => e.id === id);

  // ── Comments ─────────────────────────────────────────

  const addComment = (eventId, comment) => {
    const newComment = {
      ...comment,
      id: 'cmt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...comments,
      [eventId]: [...(comments[eventId] || []), newComment],
    };
    setComments(updated);
    localStorage.setItem('techtonic_comments', JSON.stringify(updated));
  };

  const getComments = eventId => comments[eventId] || [];

  // ── Community Posts ───────────────────────────────────

  const addPost = postData => {
    const newPost = {
      ...postData,
      id: 'post_' + Date.now(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('techtonic_posts', JSON.stringify(updated));
    return newPost;
  };

  const likePost = postId => {
    const updated = posts.map(p => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    setPosts(updated);
    localStorage.setItem('techtonic_posts', JSON.stringify(updated));
  };

  const value = {
    events,
    posts,
    comments,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventById,
    addComment,
    getComments,
    addPost,
    likePost,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
