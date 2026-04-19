import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaPlusCircle, FaCog, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } =
    location.state || JSON.parse(localStorage.getItem('client')) || {};

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:9000/api/projects/client/${email}`)
        .then((res) => setProjects(res.data))
        .catch((err) => console.error('Failed to fetch projects:', err));
    }
  }, [email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.3 },
    },
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: { duration: 0.5 },
    },
  };

  // Logout handler to clear client info and navigate to login
  const handleLogout = () => {
    localStorage.removeItem('client');
    navigate('/'); // or wherever your login page route is
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-emerald-50 text-gray-800 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Navbar */}
      <motion.header
        className="bg-emerald-900 text-white shadow-lg"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-400">
              FreelanceHub
            </h1>
            <p className="text-sm text-gray-300">
              Logged in as{' '}
              <span className="text-emerald-400 font-medium">{name}</span>
            </p>
          </div>
          <nav className="space-x-6 hidden md:flex items-center">
            <button
              onClick={() =>
                navigate('/freelancers', { state: { name, email } })
              }
              className="hover:text-emerald-400 font-medium transition-colors"
            >
              Find Freelancers
            </button>
            <button
              onClick={() =>
                navigate('/client/jobRequests', { state: { clientEmail:email , name } })
              }
              className="hover:text-emerald-400 font-medium transition-colors"
            >
              Job Requests
            </button>
            <button
              onClick={() =>
                navigate('/client/myProjects', { state: { name, email } })
              }
              className="hover:text-emerald-400 font-medium transition-colors"
            >
              My Projects
            </button>
            <button
              onClick={() =>
                navigate('/client/profile', { state: { name, email } })
              }
              className="hover:text-emerald-400 font-medium transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Main */}
      <main className="flex-grow px-6 py-12 text-center">
        {/* Hero Section */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome, {name || 'Client'}!
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Easily manage your projects, connect with top freelancers, and track
          your collaborations.
        </motion.p>

        {/* Main Action Cards */}
        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto mb-16"
          variants={containerVariants}
        >
          <motion.div
            onClick={() =>
              navigate('/client/project-request', { state: { email, name } })
            }
            className="bg-white shadow-lg rounded-2xl p-8 cursor-pointer border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <motion.div variants={iconHoverVariants}>
              <FaPlusCircle className="text-emerald-500 text-4xl mb-4 mx-auto" />
            </motion.div>
            <h4 className="text-xl font-semibold text-emerald-900 mb-2">
              Post a New Project
            </h4>
            <p className="text-gray-500 text-sm">
              Start by posting a project to attract top talent.
            </p>
          </motion.div>

          <motion.div
            onClick={() => navigate('/client/jobpostform', { state: { name, email } })}
            className="bg-white shadow-lg rounded-2xl p-8 cursor-pointer border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <motion.div variants={iconHoverVariants}>
              <FaUserFriends className="text-emerald-500 text-4xl mb-4 mx-auto" />
            </motion.div>
            <h4 className="text-xl font-semibold text-emerald-900 mb-2">
              Post for Job
            </h4>
            <p className="text-gray-500 text-sm">
              Explore and shortlist freelancers for your tasks.
            </p>
          </motion.div>

          <motion.div
            onClick={() =>
              navigate('/requesrForClient', { state: { email, name } })
            }
            className="bg-white shadow-lg rounded-2xl p-8 cursor-pointer border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <motion.div variants={iconHoverVariants}>
              <FaCog className="text-emerald-500 text-4xl mb-4 mx-auto" />
            </motion.div>
            <h4 className="text-xl font-semibold text-emerald-900 mb-2">
              Requests
            </h4>
            <p className="text-gray-500 text-sm">
              View and manage all incoming project proposals.
            </p>
          </motion.div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          className="max-w-6xl mx-auto mt-10 text-left"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">
            Your Posted Projects
          </h3>
          {projects.length === 0 ? (
            <p className="text-gray-600">
              You haven’t posted any projects yet.
            </p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                >
                  <h4 className="text-xl font-semibold text-emerald-700 mb-1">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Budget: ₹{project.budget}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Status: {project.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Deadline:{' '}
                    {new Date(project.timeline.deadline).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-emerald-100 text-emerald-900 text-center py-6 border-t border-emerald-200"
        variants={itemVariants}
      >
        <div className="flex justify-center space-x-6 mb-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}
