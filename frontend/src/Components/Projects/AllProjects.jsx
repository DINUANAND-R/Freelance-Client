import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [proposalMessages, setProposalMessages] = useState({});
  const [requestStatus, setRequestStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { email: freelancerEmail, name: freelancerName } = location.state || {};

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/projects/all');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const handleSendRequest = async (project) => {
    const { _id: projectId, title: projectTitle, clientEmail } = project;
    const proposalMessage = proposalMessages[projectId] || '';

    if (!projectId || !freelancerEmail || !clientEmail || !proposalMessage.trim()) {
      setRequestStatus({ success: false, message: 'Please enter a proposal message.' });
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/project-requests/send', {
        projectTitle,
        projectId,
        freelancerEmail,
        clientEmail,
        proposalMessage,
        freelancerName
      });

      setRequestStatus({ success: true, message: res.data.message });
      setProposalMessages((prev) => ({ ...prev, [projectId]: '' }));
    } catch (error) {
      setRequestStatus({
        success: false,
        message: error.response?.data?.error || 'Something went wrong',
      });
    }
  };

  const handleProposalChange = (projectId, value) => {
    setProposalMessages((prev) => ({ ...prev, [projectId]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-4xl font-extrabold text-gray-50 mb-2">Available Projects</h1>
        <p className="text-gray-400 mb-8">Browse through the list of projects and send your proposal.</p>

        <AnimatePresence>
          {requestStatus && (
            <motion.div
              className={`flex items-center gap-2 mb-8 px-6 py-4 rounded-lg text-sm font-semibold shadow-md ${
                requestStatus.success ? 'bg-green-900 border border-green-700 text-green-300' : 'bg-red-900 border border-red-700 text-red-300'
              }`}
              variants={alertVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {requestStatus.success ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{requestStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 text-lg">
            No projects are currently available. Please check back later!
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 flex-grow">
                  <h2 className="text-2xl font-bold text-blue-400 mb-2">{project.title}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>

                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-300 w-24">Skills:</span>
                      <span className="flex-1">{project.skills?.length > 0 ? project.skills.join(', ') : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-300 w-24">Deadline:</span>
                      <span className="flex-1">{project.timeline?.deadline ? new Date(project.timeline.deadline).toLocaleDateString() : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-300 w-24">Budget:</span>
                      <span className="flex-1 text-green-400 font-semibold">₹{project.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-300 w-24">Client:</span>
                      <span className="flex-1">{project.clientEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-700 mt-auto">
                  <textarea
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md px-4 py-3 text-sm placeholder-gray-500 transition"
                    placeholder="Write your proposal message..."
                    value={proposalMessages[project._id] || ''}
                    onChange={(e) => handleProposalChange(project._id, e.target.value)}
                  />

                  <button
                    onClick={() => handleSendRequest(project)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-md py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Send Request
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
