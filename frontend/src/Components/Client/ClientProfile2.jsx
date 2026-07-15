import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import {
  FaLinkedin,
  FaArrowLeft,
  FaCheckCircle,
  FaHourglassHalf,
  FaClipboardList,
  FaProjectDiagram,
} from 'react-icons/fa';

const ClientProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};
  const [profile, setProfile] = useState(null);
  const [months, setMonths] = useState([]);
  const [loginDates, setLoginDates] = useState([]);
  const [projectStats, setProjectStats] = useState({
    completed: 0,
    accepted: 0,
    pending: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://freelance-client-3029.onrender.com/api/client/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching client profile:', err);
      }
    };

    const fetchLoginDates = async () => {
      try {
        const res = await axios.get(`https://freelance-client-3029.onrender.com/api/client/login-activity/${email}`);
        // Convert ISO strings to Date objects
        setLoginDates(res.data.map(date => new Date(date)));
      } catch (err) {
        console.error('Error fetching login dates:', err);
      }
    };

    const fetchProjectStats = async () => {
      try {
        const res = await axios.get(`https://freelance-client-3029.onrender.com/api/projects/project-status/${email}`);
        setProjectStats(res.data);
      } catch (err) {
        console.error('Error fetching project status counts:', err);
      }
    };

    const fetchRecentProjects = async () => {
      try {
        const res = await axios.get(`https://freelance-client-3029.onrender.com/api/projects/client/recent/${email}`);
        setRecentProjects(
          res.data.slice(0, 3).map(proj => ({
            ...proj,
            deadline: proj.timeline?.deadline ? new Date(proj.timeline.deadline) : null,
          }))
        );
      } catch (err) {
        console.error('Error fetching recent projects:', err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchLoginDates(),
        fetchProjectStats(),
        fetchRecentProjects(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    // Generate last 3 months calendar days for login calendar
    const generateMonths = () => {
      const now = new Date();
      const monthsArray = [];
      for (let i = 2; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });
        monthsArray.push({ month: format(monthDate, 'MMMM yyyy'), days });
      }
      setMonths(monthsArray);
    };
    generateMonths();
  }, []);

  const isActive = date => loginDates.some(activeDate => isSameDay(date, activeDate));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  };

  if (!email)
    return (
      <div className="text-red-500 text-center mt-6">Email not provided. Cannot load profile.</div>
    );
  if (loading)
    return <div className="text-center mt-6 text-gray-500">Loading profile...</div>;
  if (!profile)
    return (
      <div className="text-center mt-6 text-red-500">Failed to load profile data.</div>
    );

  return (
    <motion.div
      className="min-h-screen bg-blue-950 text-gray-100 flex flex-col justify-between font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="p-8 flex-grow max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          className="bg-blue-900 rounded-2xl shadow-xl p-8 border border-blue-800"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Image & Details */}
            <div className="flex-shrink-0 w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <motion.img
                src={`https://freelance-client-3029.onrender.com/${profile.photo}`}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-500 shadow-md"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
              />
              <div className="text-left space-y-3 w-full">
                <p className="text-xl font-bold text-gray-100">{profile.name}</p>
                <p className="text-md text-blue-300 font-medium">
                  <span className="font-semibold text-gray-100">Email:</span> {profile.email}
                </p>
                <p className="text-md text-blue-300 font-medium">
                  <span className="font-semibold text-gray-100">Address:</span>
                  <br />
                  {profile.address}
                </p>
                {profile.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin size={24} className="mr-2" />
                    LinkedIn Profile
                  </motion.a>
                )}
              </div>
            </div>

            {/* Right Side: Project Summary */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100 mb-6 lg:mb-4">Client Overview</h1>

              {/* Project Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div
                  className="bg-blue-800 p-6 rounded-lg shadow-inner border-l-4 border-blue-500"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotate: 1,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    Projects Completed
                  </h4>
                  <p className="text-3xl font-bold text-gray-100 flex items-center">
                    {projectStats.completed}
                    <FaCheckCircle className="ml-2 text-blue-500" size={24} />
                  </p>
                </motion.div>
                <motion.div
                  className="bg-blue-800 p-6 rounded-lg shadow-inner border-l-4 border-indigo-500"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotate: 1,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    Projects Accepted
                  </h4>
                  <p className="text-3xl font-bold text-gray-100 flex items-center">
                    {projectStats.accepted}
                    <FaClipboardList className="ml-2 text-indigo-500" size={24} />
                  </p>
                </motion.div>
                <motion.div
                  className="bg-blue-800 p-6 rounded-lg shadow-inner border-l-4 border-amber-500"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotate: 1,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    Projects Pending
                  </h4>
                  <p className="text-3xl font-bold text-gray-100 flex items-center">
                    {projectStats.pending}
                    <FaHourglassHalf className="ml-2 text-amber-500" size={24} />
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div className="mt-10" variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  className="bg-blue-900 rounded-lg p-6 shadow-md border border-blue-800"
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }}
                >
                  <h3 className="text-lg font-bold text-gray-100 flex items-center mb-2">
                    <FaProjectDiagram className="mr-2 text-blue-400" />
                    {project.title}
                  </h3>
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold text-gray-100">Status:</span> {project.status}
                  </p>
                  <p className="text-sm text-blue-300">
                    <span className="font-semibold text-gray-100">Deadline:</span>{' '}
                    {project.deadline ? format(project.deadline, 'MMM d, yyyy') : 'N/A'}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Login Calendar */}
        <motion.div className="mt-10" variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Login Calendar</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {months.map(({ month, days }, idx) => (
              <div
                key={idx}
                className="bg-blue-900 rounded-lg p-6 shadow-md border border-blue-800 w-full sm:w-[300px]"
              >
                <h3 className="text-xl font-bold mb-4 text-center text-gray-100">{month}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="font-semibold text-blue-300">
                      {day}
                    </div>
                  ))}
                  {days.map((day, i) => (
                    <motion.div
                      key={i}
                      className={`relative h-8 w-8 flex items-center justify-center rounded-lg font-medium transition-colors
                        ${
                          isActive(day)
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-transparent text-blue-300'
                        }`}
                      title={`${format(day, 'eeee, MMM d')} - ${
                        isActive(day) ? 'Active' : 'Inactive'
                      }`}
                      whileHover={{ scale: 1.15, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {format(day, 'd')}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-blue-900 text-blue-300 text-center py-6 mt-10 border-t border-blue-800"
        variants={itemVariants}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Freelance Platform. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
};

export default ClientProfile;
