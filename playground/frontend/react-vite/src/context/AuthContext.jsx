import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { initCsrf } from '../services/csrf';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);


  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    
    const init = async () => {
      await initCsrf();
      await checkAuth();
    };
    init();
  }, []);

  const signin = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/signin', { email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Signed in successfully!');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Signin failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/signup', { username, email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const signout = async () => {
    try {
      await api.post('/auth/signout');
    } catch (err) {
      console.error('Signout request failed', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Signed out successfully!');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, authLoading, error, signin, signup, signout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
