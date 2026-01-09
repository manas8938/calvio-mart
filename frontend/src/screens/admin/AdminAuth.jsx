import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminSignup, adminLogin } from '../../api/api';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminAuth() {
  const location = useLocation();
  const initialMode = new URLSearchParams(location.search).get('mode') || 'signup';
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await adminSignup(form.email.trim().toLowerCase(), form.password, form.secretKey);
      toast.success('Admin account created — signing you in...');

      try {
        const res = await adminLogin(form.email.trim().toLowerCase(), form.password);
        const { token, user } = res.data;
        login(token, user);
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard' /* or '/admin' depending on your routes */);
      } catch (autoLoginErr) {
        console.warn('Auto-login failed:', autoLoginErr);
        toast('Account created — please sign in', { icon: 'ℹ️' });
        setMode('login');
      }
    } catch (err) {
      console.error('Signup error:', err?.response?.data ?? err);
      toast.error(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(form.email.trim().toLowerCase(), form.password);
      const { token, user } = res.data;
      login(token, user);
      toast.success('Signed in — welcome!');
      navigate('/admin/dashboard' /* adjust route */);
    } catch (err) {
      console.error('Login error:', err?.response?.data ?? err);
      toast.error(err?.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {mode === 'signup' ? 'Admin Signup' : 'Admin Sign In'}
          </h1>
          <p className="text-gray-600">
            {mode === 'signup' ? 'Create your admin account' : 'Sign in to Calvio Mart Dashboard'}
          </p>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={submitSignup} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@calviomart.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Admin Secret Key</label>
              <input
                name="secretKey"
                type="password"
                value={form.secretKey}
                onChange={handleChange}
                placeholder="Enter admin secret key"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Contact system admin for the secret key</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Admin Account'}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@calviomart.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Create an admin account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
