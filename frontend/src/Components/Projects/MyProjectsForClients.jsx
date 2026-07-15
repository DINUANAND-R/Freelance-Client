import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function MyProjectsForClients() {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Track which project is being updated
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  // Fetch projects for this client
  useEffect(() => {
    if (email) {
      setLoading(true);
      axios
        .get(`https://freelance-client-3029.onrender.com/api/projects/client/${email}`)
        .then(res => {
          setProjects(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching projects:', err);
          setLoading(false);
        });
    }
  }, [email]);

  const toggleExpand = (id) => {
    setExpandedProjectId(prev => (prev === id ? null : id));
  };

  // ✅ Mark project as completed
  const markAsCompleted = async (id) => {
    try {
      setUpdatingId(id);
      await axios.put(`https://freelance-client-3029.onrender.com/api/projects/${id}/complete`);
      setProjects(prev =>
        prev.map(p => p._id === id ? { ...p, status: 'completed' } : p)
      );
    } catch (err) {
      console.error('Error marking project as completed:', err);
      alert('Failed to mark as completed. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, rotate: -5 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <motion.div
      className="p-8 bg-emerald-50 min-h-screen font-sans text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate('/client/dashboard', { state: { name, email } })}
          className="flex items-center text-emerald-700 font-medium hover:text-emerald-500 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-4xl font-bold text-center mb-10 text-emerald-900">
        My Projects
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects found.</p>
      ) : (
        <motion.div
          className="space-y-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects
            .filter(project => project.status !== 'denied')
            .map(project => (
              <motion.div
                key={project._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                variants={itemVariants}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(project._id)}
                >
                  <h2 className="text-xl font-bold text-emerald-800">{project.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      project.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedProjectId === project._id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedProjectId === project._id ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedProjectId === project._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-sm text-gray-800 border-t pt-4 overflow-hidden"
                    >
                      <p className="mb-1"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>Description:</strong> {project.description}</p>
                      <p className="mb-1"><strong>Deliverables:</strong> {project.deliverables}</p>
                      <p className="mb-1"><strong>Budget:</strong> {project.budget}</p>
                      {project.references && <p className="mb-1"><strong>References:</strong> {project.references}</p>}
                      {project.ndaRequired && <p className="text-red-600 font-semibold mt-2">NDA Required</p>}

                      {/* ✅ Mark as Completed Button */}
                      {project.status !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsCompleted(project._id);
                          }}
                          disabled={updatingId === project._id}
                          className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                            updatingId === project._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {updatingId === project._id ? 'Updating...' : 'Mark as Completed'}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
}
