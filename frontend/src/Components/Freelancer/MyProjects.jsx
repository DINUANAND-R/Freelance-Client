// src/pages/FreelancerMyProjects.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaArrowLeft, FaFolderOpen, FaMoneyBillWave, FaClock, FaCommentDots, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://freelance-client-3029.onrender.com/api';

// Animation variants for the main page and its children
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
};

const headerVariants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const spinner = (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-400"></div>
  </div>
);

export default function FreelancerMyProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || JSON.parse(localStorage.getItem('freelancer')) || {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      navigate('/');
      toast.error('Session expired. Please log in again.');
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/project-requests/freelancer/projects/${email}`);
        setProjects(response.data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to fetch projects. Please try again later.');
        toast.error('Failed to load your projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [email, navigate]);

  // Helper functions for status icons and colors
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle className="text-green-400 mr-2" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-400 mr-2" />;
      case 'denied':
        return <FaTimesCircle className="text-red-400 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'denied':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />

      {/* Header with back button */}
      <motion.header
        className="bg-gray-800 text-white shadow-lg p-4 sticky top-0 z-50 border-b border-gray-700"
        variants={headerVariants}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/freelancer/dashboard', { state: { name, email } })}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            <span className="hidden sm:block">Back to Dashboard</span>
          </motion.button>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            My Projects
          </h1>
          <div className="w-12"></div> {/* Spacer for alignment */}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Project Proposals
        </motion.h2>

        {loading ? (
          spinner
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : projects.length === 0 ? (
          <motion.p
            className="text-center text-gray-400 mt-10 p-8 bg-gray-800 rounded-lg shadow-md border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            You haven't submitted any project proposals yet.
            <br />
            <motion.button
              onClick={() => navigate('/allprojects', { state: { name, email } })}
              className="mt-4 text-sky-400 hover:text-sky-200 font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore available projects now.
            </motion.button>
          </motion.p>
        ) : (
          <motion.div
            className="flex flex-col gap-6 mt-8" // Changed from grid to flex-col for a list layout
            variants={{
              animate: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-700"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  whileHover="hover"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <FaFolderOpen className="text-sky-400 text-2xl mr-3" />
                      <h4 className="text-xl font-bold text-gray-100 flex-grow">
                        {project.projectDetails?.title || 'Untitled Project'}
                      </h4>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(project.status)} bg-gray-700`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FaUser className="text-sky-400 mr-2" />
                      <span className="font-medium">Client:</span> {project.projectDetails?.clientName || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-sky-400 mr-2" />
                      <span className="font-medium">Budget:</span> ₹{project.projectDetails?.budget}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-sky-400 mr-2" />
                      <span className="font-medium">Deadline:</span>
                      {project.projectDetails?.timeline?.deadline
                        ? new Date(project.projectDetails.timeline.deadline).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </div>
                    <div className="flex items-start">
                      <FaCommentDots className="text-sky-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="font-medium">Your Proposal:</span>
                      <p className="ml-2 flex-grow">{project.proposalMessage}</p>
                    </div>
                    <div className="flex items-center pt-2 border-t border-gray-700 mt-2">
                      <span className="font-medium">Status:</span>
                      <div className={`flex items-center ml-2 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>
                    <motion.button
                      className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/project/${project.projectId}`, { state: { name, email, project } })}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-gray-400 text-center py-6 border-t border-gray-700"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex justify-center space-x-6 mb-2">
          <motion.a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" whileHover={{ scale: 1.2 }}>
            <FaGithub size={24} />
          </motion.a>
          <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" whileHover={{ scale: 1.2 }}>
            <FaLinkedin size={24} />
          </motion.a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}
