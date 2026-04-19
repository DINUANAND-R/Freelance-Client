import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:9000/admin/login', formData);
      const { token, message } = response.data;

      // Optionally store token in localStorage
      localStorage.setItem('adminToken', token);

      console.log(message);
      navigate('/admin/dashboard', { state: { email: formData.email } });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-teal-950 flex items-center justify-center px-4 relative font-sans text-white">
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300 transition"
        variants={itemVariants}
      >
        {/* Inline SVG for back arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back
      </motion.button>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-teal-900 shadow-2xl rounded-3xl p-8 max-w-md w-full border border-teal-800"
      >
        <motion.h2
          className="text-4xl font-extrabold text-white text-center mb-6"
          variants={itemVariants}
        >
          Admin Login
        </motion.h2>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm text-teal-200 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-5 py-3 rounded-xl bg-teal-800 border border-teal-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-teal-400"
            />
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <label className="block mb-2 text-sm text-teal-200 font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-5 py-3 rounded-xl bg-teal-800 border border-teal-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-teal-400"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 text-green-500 hover:text-green-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                // Inline SVG for the eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                // Inline SVG for the eye icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </motion.button>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
            variants={itemVariants}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
