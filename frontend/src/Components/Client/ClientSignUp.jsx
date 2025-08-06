import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ClientSignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    linkedin: '',
    photo: null,
  });

  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setMessage('Email and password are required.');
      return;
    }

    if (!isLogin && (!formData.name || !formData.address || !formData.linkedin)) {
      setMessage('Please fill in all required signup fields.');
      return;
    }

    const apiUrl = isLogin
      ? 'http://localhost:9000/api/client/login'
      : 'http://localhost:9000/api/client/register';

    try {
      setLoading(true);
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      const response = await axios.post(apiUrl, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message || 'Success');

      // ✅ Only navigate if client info is returned
      if (response.data.client) {
        const { name, email } = response.data.client;
        navigate('/client/dashboard', {
          state: {
            name,
            email,
          },
        });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 text-sm hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Client Login' : 'Client Signup'}
        </h2>

        {message && (
          <div className="text-center text-sm text-red-600 mb-3">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile Link"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-600"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-sm text-blue-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Login as Client'
              : 'Signup as Client'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
