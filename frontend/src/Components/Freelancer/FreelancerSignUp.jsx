import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function FreelancerSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    linkedin: '',
    github: '',
    profileImage: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
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
    if (name === 'profileImage' && files && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        profileImage: file,
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
    if (!formData.email || !formData.password || !formData.name || !formData.skills || !formData.linkedin || !formData.github) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills' && value) {
          data.append(key, JSON.stringify(value.split(',')));
        } else if (value) {
          data.append(key, value);
        }
      });

      const res = await axios.post('http://localhost:9000/api/freelancers/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      navigate('/freelancer/dashboard',{state:{name:formData.name,email:formData.email}});
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.response?.data?.message || 'Registration failed.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-gray-950 flex items-center justify-center px-4 font-sans text-white">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl bg-blue-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-800"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-400 text-sm flex items-center gap-2 hover:text-blue-300 transition-colors"
          variants={itemVariants}
        >
          {/* Inline SVG for the back arrow */}
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
          Freelancer Sign Up
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

        <motion.form onSubmit={handleSubmit} className="flex flex-wrap -mx-2">
          {/* Grouping related fields for a two-column layout */}
          <div className="w-full md:w-1/2 px-2">
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block mb-2 text-sm text-blue-200 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block mb-2 text-sm text-blue-200 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <motion.div className="relative mb-6" variants={itemVariants}>
              <label className="block mb-2 text-sm text-blue-200 font-medium">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 text-blue-500 hover:text-blue-300 transition-colors"
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
          </div>
          <div className="w-full md:w-1/2 px-2">
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block mb-2 text-sm text-blue-200 font-medium">Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g., React, Node.js, CSS"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block mb-2 text-sm text-blue-200 font-medium">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block mb-2 text-sm text-blue-200 font-medium">GitHub Profile URL</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/yourprofile"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-blue-400"
                required
              />
            </motion.div>
          </div>
          <div className="w-full px-2 mb-6">
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm text-blue-200 font-medium">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-blue-800 border border-blue-700 text-sm text-blue-200 transition"
              />
              {photoPreview && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-blue-400 mb-2">Image Preview:</p>
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="mx-auto w-32 h-32 object-cover rounded-full shadow-md border-4 border-blue-700"
                  />
                </div>
              )}
            </motion.div>
          </div>
          <div className="w-full px-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Registering...' : 'Register as Freelancer'}
            </motion.button>
          </div>
        </motion.form>

        <motion.p
          className="text-center text-sm text-blue-400 mt-8"
          variants={itemVariants}
        >
          Already have an account?{' '}
          <motion.button
            onClick={() => navigate('/freelancer/login')}
            className="text-blue-400 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login here
          </motion.button>
        </motion.p>
      </motion.div>
    </div>
  );
}
