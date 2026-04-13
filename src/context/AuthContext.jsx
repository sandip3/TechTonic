import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('techtonic_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('techtonic_session');
      }
    }
    setLoading(false);
  }, []);

  // Get all registered users from localStorage
  const getUsers = () => {
    const users = localStorage.getItem('techtonic_users');
    return users ? JSON.parse(users) : [];
  };

  // Save users array to localStorage
  const saveUsers = users => {
    localStorage.setItem('techtonic_users', JSON.stringify(users));
  };

  // Sign up a new user
  const signup = (name, email, password) => {
    const users = getUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      role: email === 'admin@gmail.com' ? 'admin' : 'user',
      bio: '',
      skills: '',
      college: '',
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    // Auto login after signup
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem('techtonic_session', JSON.stringify(sessionUser));

    return { success: true };
  };

  // Log in existing user
  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const sessionUser = { ...user };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem('techtonic_session', JSON.stringify(sessionUser));

    return { success: true };
  };

  // Log out current user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('techtonic_session');
  };

  // Update user profile
  const updateProfile = updates => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) return { success: false, message: 'User not found.' };

    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    saveUsers(users);

    const sessionUser = { ...updatedUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem('techtonic_session', JSON.stringify(sessionUser));

    return { success: true };
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
