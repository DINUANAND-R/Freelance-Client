import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminAllProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

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

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      ongoing: 'bg-rose-100 text-rose-800 border-rose-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${
          styles[status] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbecec] text-gray-800 py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-rose-800 hover:text-rose-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-4xl font-extrabold text-rose-800 mb-2">All Projects</h1>
        <p className="text-rose-600 mb-8">Overview of every project with their current status.</p>

        {projects.length === 0 ? (
          <p className="text-center text-rose-500 mt-16 text-lg">
            No projects found.
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
                className="bg-white rounded-xl border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-bold text-rose-800">{project.title}</h2>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 w-24">Skills:</span>
                      <span className="flex-1">{project.skills?.length > 0 ? project.skills.join(', ') : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 w-24">Deadline:</span>
                      <span className="flex-1">{project.timeline?.deadline ? new Date(project.timeline.deadline).toLocaleDateString() : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 w-24">Budget:</span>
                      <span className="flex-1 text-green-600 font-semibold">₹{project.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 w-24">Client:</span>
                      <span className="flex-1">{project.clientEmail}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
