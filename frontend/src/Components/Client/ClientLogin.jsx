import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa6';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:9000/api/client/login',
        { email, password },
        { withCredentials: true }
      );
      console.log('✅ Login successful:', res.data);
      navigate('/client/dashboard', {
        state: {
          name: res.data.client.name,
          email: res.data.client.email
        },
      });
    } catch (err) {
      console.error('❌ Login error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-400 flex items-center justify-center px-4 font-sans">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-600 text-sm flex items-center gap-2 hover:underline"
          variants={itemVariants}
        >
          <FaArrowLeft /> Back
        </motion.button>

        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          variants={itemVariants}
        >
          Client Login
        </motion.h2>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form className="space-y-6" onSubmit={handleSubmit} variants={itemVariants}>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="client@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            Login as Client
          </motion.button>
        </motion.form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <motion.button
            onClick={() => navigate('/client/signup')}
            className="text-green-600 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign up here
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
}
