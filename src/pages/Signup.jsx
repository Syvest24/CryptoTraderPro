import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'trader'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase?.auth?.signUp({
        email: formData?.email,
        password: formData?.password,
        options: {
          data: {
            full_name: formData?.fullName,
            role: formData?.role
          }
        }
      });

      if (error) {
        if (error?.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setError(error?.message);
        }
        return;
      }

      if (data?.user && !data?.user?.email_confirmed_at) {
        setSuccess('Account created successfully! Please check your email and click the confirmation link to complete your registration.');
      } else if (data?.user) {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        return;
      }
      
      setError('Something went wrong. Please try again.');
      console.error('JavaScript error in signup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground">Create your Trading Pro account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start managing your trading portfolio today
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-card shadow-lg rounded-lg p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                <div className="flex items-start">
                  <span className="font-medium">Error:</span>
                  <span className="ml-2 flex-1">{error}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(error)}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-card-foreground mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData?.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData?.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-card-foreground mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData?.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="trader">Trader</option>
                <option value="manager">Portfolio Manager</option>
                <option value="admin">Administrator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData?.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData?.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;