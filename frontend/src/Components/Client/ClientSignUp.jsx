import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa6';

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
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
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
          {isLogin ? 'Client Login' : 'Client Signup'}
        </motion.h2>

        {message && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <motion.div variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 transition"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 transition"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">LinkedIn Profile Link</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn Profile Link"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 transition"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-600 transition"
                />
                {photoPreview && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="mx-auto w-32 h-32 object-cover rounded-full shadow-md"
                    />
                  </div>
                )}
              </motion.div>
            </>
          )}

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 transition"
            />
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg transition-all font-semibold shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Login as Client'
              : 'Signup as Client'}
          </motion.button>
        </motion.form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <motion.button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? 'Signup' : 'Login'}
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
}
