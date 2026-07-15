import React, { useState, useEffect } from 'react';
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
  const [photoPreview, setPhotoPreview] = useState(null);

  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Effect to clean up the photo preview URL
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-lg bg-green-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-green-800"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-green-400 text-sm flex items-center gap-2 hover:text-green-300 transition-colors duration-200"
          variants={itemVariants}
        >
          {/* Replaced react-icons with an inline SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.h2
          className="text-4xl font-extrabold text-white mb-8 text-center"
          variants={itemVariants}
        >
          {isLogin ? 'Client Login' : 'Client Sign Up'}
        </motion.h2>

        {message && (
          <motion.div
            className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm text-green-200 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm text-green-200 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm text-green-200 font-medium">LinkedIn Profile Link</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn Profile Link"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-2 text-sm text-green-200 font-medium">Profile Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 text-sm text-green-200 transition"
                />
                {photoPreview && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-green-400 mb-2 font-medium">Image Preview:</p>
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="mx-auto w-32 h-32 object-cover rounded-full shadow-md border-4 border-green-700"
                    />
                  </div>
                )}
              </motion.div>
            </>
          )}

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm text-green-200 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
            />
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <label className="block mb-2 text-sm text-green-200 font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-green-800 border border-green-700 focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-green-400"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 text-green-500 hover:text-green-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {/* Inline SVG for the eye icon */}
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </motion.button>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
            variants={itemVariants}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Login as Client'
              : 'Sign Up as Client'}
          </motion.button>
        </motion.form>

        <p className="text-center text-sm text-green-400 mt-8" variants={itemVariants}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <motion.button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-400 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
}
