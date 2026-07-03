import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check: load user from localStorage if exists
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      toast.success(res.data.message || 'Login successful!');
      return loggedUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, address) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', { name, email, password, address });
      const { token, user: registeredUser } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      toast.success(res.data.message || 'Registration successful!');
      return registeredUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const res = await API.put('/auth/change-password', { oldPassword, newPassword });
      toast.success(res.data.message || 'Password changed successfully');
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update password.';
      toast.error(errorMsg);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
