import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};
  
  // This is a placeholder for the user's logged-in status.
  const isLoggedIn = !!name && !!email;

  useEffect(() => {
    // This is a placeholder API call.
    // In a real application, you might want to handle authentication.
    axios.get('http://localhost:9000/api/client/all')
      .then((res) => setClients(res.data))
      .catch((err) => console.error('Failed to fetch clients', err));
  }, []);

  const handleConnect = (client) => {
    navigate('/chat', {
      state: {
        currentUserEmail: email,
        targetUserEmail: client.email,
      },
    });
  };

  const handleViewProfile = (client) => {
    // Navigate to a dedicated client profile page, passing the client data
    navigate('/freelancer/clientProfile', {
      state: { email:client.email }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Animation variants for client cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-blue-50 text-gray-800 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="bg-blue-950 shadow-lg border-b border-blue-800"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white">FreelanceHub</h1>
            {isLoggedIn ? (
              <>
                <p className="text-sm text-blue-200">
                  Logged in as <span className="text-white font-medium">{name}</span>
                </p>
                <p className="text-xs text-blue-300">{email}</p>
              </>
            ) : (
              <p className="text-sm text-blue-200">Welcome to FreelanceHub</p>
            )}
          </div>
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            Back
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main className="flex-grow p-6 lg:p-12" variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-950 drop-shadow-md">Browse Clients</h1>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {clients.length > 0 ? clients.map((client, index) => (
              <motion.div
                key={client._id}
                className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100 flex flex-col items-center text-center transform transition-transform duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <img
                  src={client.photo ? `http://localhost:9000/${client.photo}` : "https://placehold.co/150x150/CFE2F3/000000?text=No+Photo"}
                  alt={client.name}
                  className="w-36 h-36 object-cover rounded-full mb-6 border-4 border-blue-400 shadow-lg"
                />
                <h2 className="text-2xl font-semibold text-blue-950 mb-1">{client.name}</h2>
                <p className="text-md text-gray-600 mb-2">{client.email}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 w-full text-center overflow-hidden text-ellipsis">
                  <FaMapMarkerAlt className="inline text-blue-500 mr-2" />
                  {client.address}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  {client.linkedin && (
                    <motion.a
                      href={client.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaLinkedin size={32} />
                    </motion.a>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full">
                  <motion.button
                    onClick={() => handleViewProfile(client)}
                    className="flex-1 bg-blue-100 text-blue-950 py-3 rounded-xl hover:bg-blue-200 transition-colors font-semibold flex items-center justify-center gap-2 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUser />
                    Profile
                  </motion.button>
                  <motion.button
                    onClick={() => handleConnect(client)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Connect
                  </motion.button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center p-10 bg-white rounded-xl shadow-lg">
                <p className="text-gray-500 text-lg">No clients found at this time.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="bg-blue-950 text-blue-400 text-center py-8 border-t border-blue-800"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-white">About FreelanceHub</h2>
            <p className="text-sm leading-relaxed">
              FreelanceHub is a platform that bridges the gap between talented freelancers and clients seeking skilled professionals. We simplify collaboration and project management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-white">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/post-project" className="hover:underline">Post a Project</a></li>
              <li><a href="/freelancers" className="hover:underline">Browse Freelancers</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-white">Contact Us</h2>
            <ul className="text-sm space-y-1">
                <li className="flex items-center justify-center gap-2"><FaEnvelope className="text-blue-500"/> support@freelancehub.com</li>
                <li className="flex items-center justify-center gap-2"><FaPhoneAlt className="text-blue-500"/> +91 98765 43210</li>
                <li className="flex items-center justify-center gap-2"><FaMapMarkerAlt className="text-blue-500"/> Tamil Nadu, India</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-blue-800 text-sm">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </div>
      </motion.footer>
    </motion.div>
  );
}
