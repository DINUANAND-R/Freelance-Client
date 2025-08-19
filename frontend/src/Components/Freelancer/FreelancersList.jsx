import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function FreelancersList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};

  useEffect(() => {
    axios.get('https://freelance-client-3029.onrender.com/api/freelancers/all')
      .then((res) => setFreelancers(res.data))
      .catch((err) => console.error('Failed to fetch freelancers', err));
  }, []);

  const handleConnect = (freelancer) => {
    navigate('/chat', {
      state: {
        currentUserEmail: email,
        targetUserEmail: freelancer.email,
      },
    });
  };

  const handleViewProfile = (freelancer) => {
    navigate('/profile/freelancer', {
      state: {
        clientEmail:email,
        email: freelancer.email,
      },
    });
  };

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
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-emerald-950 text-gray-100 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header 
        className="bg-emerald-900 shadow-lg mb-6 border-b border-emerald-800"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-300">FreelanceHub</h1>
            <p className="text-sm text-emerald-400">Logged in as <span className="text-emerald-300 font-medium">{name}</span></p>
            <p className="text-xs text-emerald-500">{email}</p>
          </div>
          <motion.button
            onClick={() => navigate('/client/dashboard',{state:{name,email}})}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>
        </div>
      </motion.header>

      <motion.main className="flex-grow px-6" variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Available Freelancers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {freelancers.map((freelancer, index) => (
            <motion.div
              key={freelancer._id}
              className="w-80 bg-emerald-900 shadow-md rounded-xl overflow-hidden p-6 border border-emerald-800"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)" }}
            >
              <img
                src={`https://freelance-client-3029.onrender.com/uploads/freelancers/${freelancer.profileImage}`}
                alt={freelancer.name}
                className="w-full h-60 object-contain rounded-md mb-4 bg-emerald-800"
              />
              <h2 className="text-xl font-semibold text-gray-100">{freelancer.name}</h2>
              <p className="text-emerald-300">{freelancer.email}</p>
              <div className="mt-4">
                <strong className="text-gray-100">Skills:</strong>
                <ul className="list-disc list-inside text-sm text-emerald-400">
                  {freelancer.skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                {freelancer.github && (
                  <motion.a
                    href={freelancer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    GitHub
                  </motion.a>
                )}
                {freelancer.linkedin && (
                  <motion.a
                    href={freelancer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    LinkedIn
                  </motion.a>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <motion.button
                  onClick={() => handleConnect(freelancer)}
                  className="bg-emerald-700 text-white flex-grow py-2 rounded-lg hover:bg-emerald-600 transition font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect
                </motion.button>
                <motion.button
                  onClick={() => handleViewProfile(freelancer)}
                  className="bg-emerald-500 text-white flex-grow py-2 rounded-lg hover:bg-emerald-400 transition font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Profile
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      <motion.footer
        className="bg-emerald-900 text-emerald-300 text-center py-6 mt-10 border-t border-emerald-800"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-lg mb-2 text-gray-100">FreelanceHub</h2>
            <p>Empowering clients and freelancers to connect and collaborate effectively.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2 text-gray-100">Quick Links</h2>
            <ul>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2 text-gray-100">Contact</h2>
            <p>Email: support@freelancehub.com</p>
            <p>Phone: +91-9876543210</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-emerald-400">© {new Date().getFullYear()} FreelanceHub. All rights reserved.</div>
      </motion.footer>
    </motion.div>
  );
}
