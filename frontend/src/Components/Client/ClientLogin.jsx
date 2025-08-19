import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'; // Corrected import path

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://freelance-client-3029.onrender.com/api/client/login',
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

  // Variants for the main container animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for individual form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-gray-950 flex items-center justify-center px-4 font-sans text-white">
      <motion.div
        className="w-full max-w-lg bg-green-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-green-800"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-green-400 text-sm flex items-center gap-2 hover:text-green-300 transition-colors duration-200"
          variants={itemVariants}
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.h2
          className="text-4xl font-extrabold text-white mb-8 text-center"
          variants={itemVariants}
        >
          Client Login
        </motion.h2>

        {error && (
          <motion.div
            className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form className="space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm text-green-200 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="client@example.com"
              className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm text-green-200 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            variants={itemVariants}
          >
            Login as Client
          </motion.button>
        </motion.form>

        <motion.p className="mt-8 text-center text-sm text-green-400" variants={itemVariants}>
          Don't have an account?{' '}
          <motion.button
            onClick={() => navigate('/client/signup')}
            className="text-green-400 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign up here
          </motion.button>
        </motion.p>
      </motion.div>
    </div>
  );
}
