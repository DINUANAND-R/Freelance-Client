import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaProjectDiagram,
  FaEnvelope,
  FaUserCog,
  FaLinkedin,
  FaGithub,
  FaFolderOpen,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaPlusSquare,
  FaUserTie
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:9000/api';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

const cardVariants = {
  initial: { scale: 1, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.3
    }
  },
  tap: { scale: 0.98 }
};

const spinner = (
  <div className="flex justify-center items-center h-full py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
  </div>
);

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const freelancer = location.state || {};
  const { name, email } = freelancer;

  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Projects
  useEffect(() => {
    if (!email) {
      navigate('/');
      toast.error('Session expired. Please log in again.');
      return;
    }

    const fetchProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/project-requests/freelancer/${email}`);
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching freelancer projects:', err);
        setError('Failed to fetch projects. Please try again later.');
        toast.error('Failed to load projects.');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [email, navigate]);

  // Fetch Posts by Freelancer Email
  useEffect(() => {
    if (!email) {
      return;
    }

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/post/freelancerPosts/${email}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching freelancer posts:', err);
        toast.error('Failed to load your posts.');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  // Filtered projects to exclude 'denied' status
  const currentProjects = projects.filter(project => project.status !== 'denied');

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />

      {/* Navbar */}
      <motion.header
        className="bg-gray-900 text-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-extrabold text-sky-400">FreelanceHub</h1>
            <div className="hidden md:block border-l border-gray-700 h-8"></div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-300">
                Welcome, <span className="text-sky-400 font-medium">{name || "Freelancer"}</span>
              </p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
          </div>
          <nav className="space-x-4 md:space-x-6 flex items-center">
            <button onClick={() => navigate('/allprojects', { state: { name, email } })} className="hover:text-sky-400 font-medium transition-colors hidden sm:block">Find Projects</button>
            <button onClick={() => navigate('/clients', { state: { name, email } })} className="hover:text-sky-400 font-medium transition-colors hidden sm:block">Find Clients</button>
            <button onClick={() => navigate('/freelancer/myprojects', { state: { name, email } })} className="hover:text-sky-400 font-medium transition-colors hidden sm:block">My Projects</button>
            <button onClick={() => navigate('/freelancer/profile', { state: { name, email } })} className="hover:text-sky-400 font-medium transition-colors hidden sm:block">Profile</button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-500 transition-colors shadow-md"
            >
              Logout
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.4 }}
        >
          Welcome, {name || "Freelancer"}!
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 text-center mb-10 max-w-2xl mx-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
        >
          Your dashboard provides a quick overview of your projects and posts.
          Ready to take on new challenges?
        </motion.p>

        {/* Dashboard Cards */}
        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          <motion.div
            onClick={() => navigate('/allprojects', { state: { name, email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-lg border border-gray-100 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaProjectDiagram className="text-sky-600 text-5xl mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Find Projects</h4>
            <p className="text-gray-500 text-sm flex-grow">Browse and apply for new freelance opportunities that match your skills.</p>
            <div className="mt-4 text-sky-500 font-semibold flex items-center">
              Explore now <FaArrowRight className="ml-2" />
            </div>
          </motion.div>

          <motion.div
            onClick={() => navigate('/freelancer/myprojects', { state: { name, email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-lg border border-gray-100 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaFolderOpen className="text-sky-600 text-5xl mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">My Projects</h4>
            <p className="text-gray-500 text-sm flex-grow">Manage your ongoing projects, track deadlines, and communicate with clients.</p>
            <div className="mt-4 text-sky-500 font-semibold flex items-center">
              View your work <FaArrowRight className="ml-2" />
            </div>
          </motion.div>

          <motion.div
            onClick={() => navigate('/freelancer/post', { state: { freelancerName: name, freelancerEmail: email } })}
            className="bg-white rounded-2xl p-8 cursor-pointer shadow-lg border border-gray-100 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaPlusSquare className="text-sky-600 text-5xl mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Create a Post</h4>
            <p className="text-gray-500 text-sm flex-grow">Showcase your skills and services to potential clients by creating a post.</p>
            <div className="mt-4 text-sky-500 font-semibold flex items-center">
              Create now <FaArrowRight className="ml-2" />
            </div>
          </motion.div>
        </motion.div>

        {/* Projects Section */}
        <div className="mt-16 max-w-6xl mx-auto text-left">
          <motion.h3
            className="text-3xl font-bold mb-6 text-gray-800"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your Current Projects
          </motion.h3>
          {loadingProjects ? (
            spinner
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : currentProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">You have no ongoing projects.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              <AnimatePresence>
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ y: -3, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-lg font-bold text-sky-600 mb-2 flex items-center">
                      <FaFolderOpen className="mr-2 text-sky-500" /> {project.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-sky-500 mr-2" /> Budget: <span className="font-semibold">₹{project.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="text-sky-500 mr-2" /> Deadline: <span className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center pt-2 border-t border-gray-100 mt-2">
                        {project.status === 'accepted' && (
                          <motion.div className="flex items-center text-green-600 font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <FaCheckCircle className="mr-2" /> Accepted
                          </motion.div>
                        )}
                        {project.status === 'pending' && (
                          <motion.div className="flex items-center text-yellow-600 font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <FaHourglassHalf className="mr-2" /> Pending
                          </motion.div>
                        )}
                        {/* Denied projects are filtered out, so this part will not be rendered */}
                        {project.status === 'denied' && (
                          <motion.div className="flex items-center text-red-600 font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <FaTimesCircle className="mr-2" /> Denied
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Posts Section */}
        <div className="mt-16 max-w-6xl mx-auto text-left">
          <motion.h3
            className="text-3xl font-bold mb-6 text-gray-800"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Your Recent Posts
          </motion.h3>
          {loadingPosts ? (
            spinner
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">You haven't posted anything yet. <button onClick={() => navigate('/freelancer/post', { state: { freelancerName: name, freelancerEmail: email } })} className="text-sky-500 hover:underline">Create a new post</button>.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-200 overflow-hidden"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ y: -3, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {post.file && (
                      <motion.img
                        src={post.file}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <h4 className="text-lg font-bold text-sky-600 mb-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.description}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Posted on: <span className="font-semibold text-gray-700">{new Date(post.createdAt).toLocaleDateString()}</span></p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-gray-400 py-6 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="flex justify-center space-x-6 mb-2">
          <motion.a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors" whileHover={{ scale: 1.2 }}>
            <FaGithub size={24} />
          </motion.a>
          <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors" whileHover={{ scale: 1.2 }}>
            <FaLinkedin size={24} />
          </motion.a>
        </div>
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
}
