import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaProjectDiagram, FaEnvelope, FaUserCog, FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const freelancer = location.state || {};
  const { name, email } = freelancer;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navbar */}
      <motion.header
        className="bg-gray-800 text-white shadow-lg"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-sky-400">FreelanceHub</h1>
            <p className="text-sm text-gray-300">Logged in as <span className="text-sky-400 font-medium">{name}</span></p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
          <nav className="space-x-6 hidden md:flex items-center">
            <button onClick={() => navigate('/allprojects', { state: { name, email } })} className="hover:text-sky-400 font-medium transition-colors">Find Projects</button>
            <button onClick={() => navigate('/messages')} className="hover:text-sky-400 font-medium transition-colors">Messages</button>
            <button onClick={() => navigate('/freelancer/profile', { state: { email } })} className="hover:text-sky-400 font-medium transition-colors">Profile</button>
            <button
              onClick={() => navigate('/')}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-500 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome, {name || "Freelancer"}!
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Manage your profile, find new opportunities, and stay connected with clients.
        </motion.p>

        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          <motion.div
            onClick={() => navigate('/allprojects', { state: { name, email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-md border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <FaProjectDiagram className="text-sky-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Find Projects</h4>
            <p className="text-gray-500 text-sm">Browse and apply for new freelance opportunities.</p>
          </motion.div>

          <motion.div
            onClick={() => navigate('/clients', { state: { email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-md border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <FaEnvelope className="text-sky-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Find Client</h4>
            <p className="text-gray-500 text-sm">Communicate with clients and manage proposals.</p>
          </motion.div>

          <motion.div
            onClick={() => navigate('/freelancer/profile', { state: { email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-md border border-gray-200"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            <FaUserCog className="text-sky-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h4>
            <p className="text-gray-500 text-sm">Update your skills, portfolio, and personal details.</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-gray-400 py-6 text-center"
        variants={itemVariants}
      >
        <div className="flex justify-center space-x-6 mb-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
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