import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaArrowLeft, FaStar } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';

const FreelancerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/freelancers/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching freelancer profile:', err);
      }
    };

    fetchProfile();
  }, [email]);

  const generateCalendar = (monthOffset = 0) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = start.getDay();

    return (
      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-full"
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-lg font-semibold text-gray-50 mb-4 text-center">
          {format(date, 'MMMM yyyy')}
        </h3>
        <div className="grid grid-cols-7 text-sm text-center gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="font-semibold text-sky-400">{day}</div>
          ))}
          {Array(firstDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}
          {days.map((day) => (
            <div key={day.toISOString()} className="py-2 text-gray-300">
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  if (!email) {
    return <div className="text-red-500 text-center mt-6">Email not provided.</div>;
  }

  if (!profile) {
    return <div className="text-center text-gray-300 mt-12">Loading profile...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-gray-200 flex flex-col justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="p-8 flex-grow max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sky-400 px-4 py-2 rounded-lg hover:bg-sky-900 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-xl p-8"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              <img
                src={`http://localhost:9000/uploads/freelancers/${profile.profileImage}`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-sky-500 shadow-md"
              />
              <div>
                <motion.p className="text-3xl font-bold text-gray-50" variants={textVariants}>{profile.name}</motion.p>
                <motion.p className="text-lg text-gray-400" variants={textVariants}>{profile.email}</motion.p>
                <motion.p className="mt-2 text-md text-gray-300 font-medium" variants={textVariants}>
                  <span className="font-semibold text-gray-50">Skills:</span> {profile.skills.join(', ')}
                </motion.p>
              </div>
            </div>
            <motion.div className="flex gap-4 mt-4 sm:mt-0" variants={textVariants}>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors">
                  <FaLinkedin size={28} />
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors">
                  <FaGithub size={28} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <motion.div
              className="bg-gray-700 p-6 rounded-lg shadow-inner border-l-4 border-sky-500"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Projects Completed</h4>
              <p className="text-3xl font-bold text-gray-50">{profile.totalProjects || 0}</p>
            </motion.div>
            <motion.div
              className="bg-gray-700 p-6 rounded-lg shadow-inner border-l-4 border-emerald-500"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Experience</h4>
              <p className="text-3xl font-bold text-gray-50">{profile.experience || '0 yrs'}</p>
            </motion.div>
            <motion.div
              className="bg-gray-700 p-6 rounded-lg shadow-inner border-l-4 border-yellow-500"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Average Rating</h4>
              <p className="text-3xl font-bold text-gray-50 flex items-center">
                {profile.rating || 'N/A'} {profile.rating && <FaStar className="ml-2 text-yellow-400" size={20} />}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          className="mt-10"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-gray-50 text-center mb-6">Recent Activity Calendar</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-between">
            {generateCalendar(0)}
            {generateCalendar(1)}
            {generateCalendar(2)}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-gray-400 text-center py-6 border-t border-gray-700"
        variants={itemVariants}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Freelance Platform. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
};

export default FreelancerProfile;
