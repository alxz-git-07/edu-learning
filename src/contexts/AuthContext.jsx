import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = useCallback(async function() {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function() {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // REGISTER FUNCTION
  const register = useCallback(async function(userData) {
    try {
      const data = await authService.register(userData);
      toast.success('Registration successful! Please login.');
      return { success: true, data };
    } catch (error) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const login = useCallback(async function(email, password) {
    try {
      const data = await authService.login(email, password);
      const { access_token, user } = data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      
      toast.success('Welcome back! 🎉');
      return { success: true, user };
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(function() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  }, []);

  const resetPassword = useCallback(async function(email) {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset link sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    resetPassword,
    isAuthenticated: !!user,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
