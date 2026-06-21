import {
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up a new user
  const signup = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(result.user, { displayName: name });
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: 'Email already exists',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Log in existing user
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
      };
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Log out current user
  const logout = async () => {
    await signOut(auth);
  };

  // Update user profile

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
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
