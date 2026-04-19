import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTag, FaClock, FaMoneyBillWave, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:9000/api';

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.3 },
  },
};

const spinner = (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [proposalMessages, setProposalMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { email: freelancerEmail, name: freelancerName } = location.state || {};
  const name = freelancerName;
  const email = freelancerEmail;

  useEffect(() => {
    if (!freelancerEmail) {
      navigate('/');
      toast.error('Session expired. Please log in again.');
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/projects/all`);
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        toast.error('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [freelancerEmail, navigate]);

  const handleSendRequest = async (project) => {
    const { _id: projectId, title: projectTitle, clientEmail } = project;
    const proposalMessage = proposalMessages[projectId] || '';

    if (!proposalMessage.trim()) {
      toast.error('Please write a proposal message before sending.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/project-requests/send`, {
        projectTitle,
        projectId,
        freelancerEmail,
        clientEmail,
        proposalMessage,
        freelancerName
      });

      toast.success('Proposal sent successfully!');
      setProposalMessages((prev) => ({ ...prev, [projectId]: '' }));

    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleProposalChange = (projectId, value) => {
    setProposalMessages((prev) => ({ ...prev, [projectId]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={() => navigate('/freelancer/dashboard', { state: { name, email } })}
            className="inline-flex items-center gap-2 text-md font-medium text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </motion.button>
          <h1 className="text-4xl font-extrabold text-white text-center flex-grow">
            Available Projects
          </h1>
          <div className="w-1/4 hidden sm:block"></div>
        </div>

        <motion.p
          className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Browse through the list of projects posted by clients and submit your professional proposals to get started.
        </motion.p>

        {loading ? (
          spinner
        ) : projects.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 mt-20 text-xl p-8 bg-gray-800 rounded-xl shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            No projects are currently available. Please check back later!
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-6 flex-grow">
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">{project.title}</h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>

                    <div className="text-sm text-gray-400 space-y-2 mt-4">
                      <div className="flex items-center">
                        <FaTag className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24 flex-shrink-0">Skills:</span>
                        <span className="flex-1">{project.skills?.length > 0 ? project.skills.join(', ') : 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24 flex-shrink-0">Deadline:</span>
                        <span className="flex-1">{project.timeline?.deadline ? new Date(project.timeline.deadline).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24 flex-shrink-0">Budget:</span>
                        <span className="flex-1 text-green-400 font-semibold">₹{project.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUserCircle className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24 flex-shrink-0">Client:</span>
                        <span className="flex-1">{project.clientName || project.clientEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-700 mt-auto">
                    <textarea
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md px-4 py-3 text-sm placeholder-gray-500 transition resize-none"
                      placeholder="Write your professional proposal message here..."
                      value={proposalMessages[project._id] || ''}
                      onChange={(e) => handleProposalChange(project._id, e.target.value)}
                    />

                    <motion.button
                      onClick={() => handleSendRequest(project)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-md py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                      whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Proposal
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}