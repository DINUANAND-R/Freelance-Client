import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};

  useEffect(() => {
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

  const handleBack = () => {
    navigate(-1);
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
      className="flex flex-col min-h-screen bg-blue-100 text-gray-800 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="bg-slate-900 shadow-lg border-b border-slate-700"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white">FreelanceHub</h1>
            <p className="text-sm text-slate-400">
              Logged in as <span className="text-white font-medium">{name}</span>
            </p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>

          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            Back
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main className="flex-grow p-6" variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-900">Clients</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client._id}
              className="w-80 bg-slate-700 shadow-lg rounded-xl overflow-hidden p-6 border border-slate-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            >
              <img
                src={`http://localhost:9000/${client.photo}`}
                alt={client.name}
                className="w-full h-60 object-contain rounded-md mb-4 bg-slate-800"
              />
              <h2 className="text-xl font-semibold text-white">{client.name}</h2>
              <p className="text-blue-300">{client.email}</p>
              <p className="text-sm text-slate-400 mt-1">{client.address}</p>

              <div className="mt-4 flex flex-wrap gap-4 items-center">
                {client.linkedin && (
                  <motion.a
                    href={client.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    LinkedIn
                  </motion.a>
                )}
              </div>

              <div className="mt-6">
                <motion.button
                  onClick={() => handleConnect(client)}
                  className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="bg-slate-900 text-slate-100 text-center py-6 mt-10 border-t border-slate-700"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
            <p className="text-sm">Email: support@freelancehub.com</p>
            <p className="text-sm">Phone: +91 98765 43210</p>
            <p className="text-sm">Location: Tamil Nadu, India</p>
          </div>
        </div>

        <div className="text-center py-4 border-t border-slate-700 text-sm">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </div>
      </motion.footer>
    </motion.div>
  );
}
