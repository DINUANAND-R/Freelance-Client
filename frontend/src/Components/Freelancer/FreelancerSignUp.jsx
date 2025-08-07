  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import axios from 'axios';
  import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa6';

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
        navigate('/freelancer/dashboard');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-400 flex items-center justify-center px-4 font-sans">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8"
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 text-sm flex items-center gap-2 hover:underline"
            variants={itemVariants}
          >
            <FaArrowLeft /> Back
          </motion.button>

          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6 text-center"
            variants={itemVariants}
          >
            Freelancer Signup
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

          <motion.form onSubmit={handleSubmit} className="flex flex-wrap -mx-2">
            {/* Grouping related fields for a two-column layout */}
            <div className="w-full md:w-1/2 px-2">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <motion.div className="relative mb-4" variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 mt-2 text-sm text-blue-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g., React, Node.js, CSS"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">GitHub Profile URL</label>
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/yourprofile"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </motion.div>
            </div>
            <div className="w-full px-2 mb-4">
              <motion.div variants={itemVariants}>
                <label className="block mb-1 text-sm text-gray-700">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
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
            </div>
            <div className="w-full px-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg transition-all font-semibold shadow-lg ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Registering...' : 'Register as Freelancer'}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    );
  }
