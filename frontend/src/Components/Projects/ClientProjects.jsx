import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

export default function ClientPostProject() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || {};

  const [formData, setFormData] = useState({
    clientName: name || '',
    clientEmail: email || '',
    title: '',
    description: '',
    deliverables: '',
    deadline: '',
    budget: '',
    references: '',
    ndaRequired: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in the required fields: Project Title and Description');
      return;
    }
    setPage(2);
  };

  const handleBack = () => setPage(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/api/projects/create', formData);
      console.log('✅ Project posted successfully:', response.data);

      alert('Project posted and email sent successfully!');
      navigate(-1);
    } catch (err) {
      console.error('❌ Network or server error:', err);
      alert('Network error or server failure: ' + (err.response?.data?.error || err.message));
    }
  };


  const pageTransition = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="min-h-screen bg-emerald-50 text-gray-800 flex flex-col items-center py-10 px-4 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="w-full max-w-2xl mb-4">
        <button
          onClick={() => navigate('/client/dashboard',{state:{name,email}})}
          className="flex items-center text-emerald-700 font-medium hover:text-emerald-500 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </motion.div>

      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-emerald-900 mb-8">
        Post a New Project
      </motion.h2>

      <motion.div
        className="flex items-center mb-10 space-x-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center space-x-2">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all duration-300
            ${page === 1 ? 'bg-emerald-600 shadow-md' : 'bg-emerald-300'}`}>
            1
          </div>
          <div className="w-10 h-1 bg-emerald-400 rounded-full transition-all duration-300"></div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center space-x-2">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all duration-300
            ${page === 2 ? 'bg-emerald-600 shadow-md' : 'bg-emerald-300'}`}>
            2
          </div>
        </motion.div>
      </motion.div>

      <form className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {page === 1 && (
            <motion.div key="page1" {...pageTransition} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Project Title <span className="text-red-500">*</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Build a portfolio website"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the project goals, requirements, expectations, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Deliverables</label>
                <input
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleChange}
                  placeholder="e.g. Source code, documentation, demo video"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <motion.button
                type="button"
                onClick={handleNext}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div key="page2" {...pageTransition} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Deadline <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Budget <span className="text-red-500">*</span></label>
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ₹5000 - ₹10000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">References / Links</label>
                <input
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="e.g. Figma designs, GitHub repo, sample websites"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ndaRequired"
                  name="ndaRequired"
                  checked={formData.ndaRequired}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <label htmlFor="ndaRequired" className="text-gray-700 font-medium">NDA Required</label>
              </div>
              <div className="flex justify-between mt-6">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
