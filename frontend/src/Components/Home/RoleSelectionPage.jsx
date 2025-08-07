import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserTie, FaBriefcase, FaShieldHalved } from 'react-icons/fa6';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 px-4 py-8 relative font-sans text-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with Back Button */}
      <motion.div className="flex items-center p-6 bg-white rounded-xl shadow-lg mb-10" variants={itemVariants}>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-full text-lg shadow-sm hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Choose Your Role</h1>
        </div>
      </motion.div>

      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl">
          {/* Client Box */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 text-center transform flex flex-col justify-center border border-gray-200"
            variants={itemVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FaUserTie className="text-green-600 text-6xl mb-4 mx-auto" />
            <h2 className="text-3xl font-bold text-green-700 mb-3">For Clients</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Post your projects and hire from a global pool of skilled freelancers.
              Manage timelines, payments, and collaborate effectively.
            </p>
            <Link
              to="/client/Login"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Login as Client
            </Link>
          </motion.div>

          {/* Freelancer Box */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 text-center transform flex flex-col justify-center border border-gray-200"
            variants={itemVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FaBriefcase className="text-sky-600 text-6xl mb-4 mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">For Freelancers</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Find freelance jobs, build your portfolio, and earn from anywhere.
              Join our professional network today.
            </p>
            <Link
              to="/freelancer/Login"
              className="inline-block bg-sky-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-700 transition-colors"
            >
              Login as Freelancer
            </Link>
          </motion.div>

          {/* Admin Box */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 text-center transform flex flex-col justify-center border border-gray-200"
            variants={itemVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FaShieldHalved className="text-indigo-600 text-6xl mb-4 mx-auto" />
            <h2 className="text-3xl font-bold text-indigo-700 mb-3">For Admins</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Manage platform users, monitor activity, and maintain system integrity
              with powerful tools.
            </p>
            <Link
              to="/admin/Login"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login as Admin
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
