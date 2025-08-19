import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaArrowLeft, FaStar } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://freelance-client-3029.onrender.com/api';

const FreelancerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientEmail, email } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [currentDate] = useState(new Date());

  // Rating & comment states
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/freelancers/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching freelancer profile:', err);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/rating/average/${email}`);
        // Convert the API response to a number using parseFloat()
        const numericRating = parseFloat(res.data.averageRating);
        // Set state only if the result is a valid number, otherwise set it to null
        setAverageRating(isNaN(numericRating) ? null : numericRating);
      } catch (err) {
        console.error('Error fetching average rating:', err);
        setAverageRating(null);
      }
    };

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        // This is a placeholder API endpoint. You'll need to create this on your backend.
          const res = await axios.get(`https://freelance-client-3029.onrender.com/api/post/freelancerPosts/${email}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching freelancer posts:', err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfile();
    fetchAverageRating();
    fetchPosts();
  }, [email, navigate]);

  // Normalize loginHistory dates for calendar
  const activeDates = useMemo(() => {
    if (!profile?.loginHistory) return new Set();

    return new Set(
      profile.loginHistory.map(dateStr => {
        const dateObj = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
        return format(dateObj, 'yyyy-MM-dd');
      })
    );
  }, [profile]);

  // Animation variants
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

  const generateCalendar = (monthOffset = 0) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = start.getDay();

    return (
      <motion.div
        className="bg-green-800 rounded-lg shadow-lg p-6 w-full"
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-lg font-semibold text-green-50 mb-4 text-center">
          {format(date, 'MMMM yyyy')}
        </h3>
        <div className="grid grid-cols-7 text-sm text-center gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={`${day}-${idx}`} className="font-semibold text-green-400">{day}</div>
          ))}
          {Array(firstDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}
          {days.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const isActive = activeDates.has(dayStr);

            return (
              <div
                key={day.toISOString()}
                className={`py-2 rounded cursor-default ${
                  isActive ? 'bg-green-600 text-white font-semibold shadow-md' : 'text-green-300'
                }`}
                title={isActive ? 'Active day' : ''}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const handleStarClick = (rating) => {
    setUserRating(rating);
    setRatingMessage('');
  };

  const submitRating = async () => {
    if (userRating === 0) {
      setRatingMessage('Please select a rating before submitting.');
      return;
    }
    setSubmittingRating(true);
    setRatingMessage('');
    try {
      await axios.post(`https://freelance-client-3029.onrender.com/api/rating/rate`, {
        rating: userRating,
        comment: userComment,
        freelancerEmail: email,
        clientEmail: clientEmail,
      });
      setRatingMessage('Thank you for your rating and comment!');
      // Refresh profile and average rating
      const [profileRes, ratingRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/freelancers/profile/${email}`),
        axios.get(`${API_BASE_URL}/rating/average/${email}`),
      ]);
      setProfile(profileRes.data);
      // Ensure the rating is a number before setting it
      const newAverageRating = parseFloat(ratingRes.data.averageRating);
      setAverageRating(isNaN(newAverageRating) ? null : newAverageRating);
      setUserRating(0);
      setUserComment('');
    } catch (error) {
      setRatingMessage('Failed to submit rating. Please try again later.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!email) {
    return <div className="text-red-500 text-center mt-6">Email not provided.</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-green-900 text-green-100 flex flex-col justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="p-8 flex-grow max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-400 px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-green-800 rounded-2xl shadow-xl p-8 mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              <img
                src={`https://freelance-client-3029.onrender.com/uploads/freelancers/${profile.profileImage}`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-green-400 shadow-md"
              />
              <div>
                <motion.p className="text-3xl font-bold text-green-50" variants={textVariants}>{profile.name}</motion.p>
                <motion.p className="text-lg text-green-300" variants={textVariants}>{profile.email}</motion.p>
                <motion.p className="mt-2 text-md text-green-200 font-medium" variants={textVariants}>
                  <span className="font-semibold text-green-50">Skills:</span> {profile.skills.join(', ')}
                </motion.p>
              </div>
            </div>
            <motion.div className="flex gap-4 mt-4 sm:mt-0" variants={textVariants}>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-400 transition-colors">
                  <FaLinkedin size={28} />
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-400 transition-colors">
                  <FaGithub size={28} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <motion.div
              className="bg-green-700 p-6 rounded-lg shadow-inner border-l-4 border-green-400"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-green-300 mb-1">Projects Completed</h4>
              <p className="text-3xl font-bold text-green-50">{profile.totalProjects || 0}</p>
            </motion.div>
            <motion.div
              className="bg-green-700 p-6 rounded-lg shadow-inner border-l-4 border-emerald-500"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-green-300 mb-1">Experience</h4>
              <p className="text-3xl font-bold text-green-50">{profile.experience || '0 yrs'}</p>
            </motion.div>
            <motion.div
              className="bg-green-700 p-6 rounded-lg shadow-inner border-l-4 border-yellow-500"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-sm font-semibold text-green-300 mb-1">Average Rating</h4>
              <p className="text-3xl font-bold text-green-50 flex items-center">
                {averageRating !== null ? averageRating.toFixed(1) : 'N/A'} {averageRating && <FaStar className="ml-2 text-yellow-400" size={20} />}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          className="mt-10 mb-8"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-green-50 text-center mb-6">Recent Activity Calendar</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-between">
            {generateCalendar(0)}
            {generateCalendar(1)}
            {generateCalendar(2)}
          </div>
        </motion.div>

        {/* Posts/Projects Section */}
        <motion.div className="mt-12" variants={itemVariants}>
          <h3 className="text-2xl font-bold text-green-50 text-center mb-6">Recent Posts & Projects</h3>
          <AnimatePresence>
            {loadingPosts ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
              </div>
            ) : posts.length > 0 ? (
              <motion.div
                className="flex flex-col gap-6"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id || index}
                    className="bg-green-800 rounded-lg shadow-lg p-6 border border-green-700"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col-reverse sm:flex-row-reverse sm:gap-6 items-center">
                      <div className="w-full sm:w-1/3">
                        {post.file && (
                          <motion.img
                            src={post.file}
                            alt={post.title}
                            className="w-50 h-50 object-cover rounded-lg mb-4 sm:mb-0 ml-20"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="w-full sm:w-2/3">
                        <h4 className="text-lg font-bold text-green-400 mb-2">{post.title}</h4>
                        <p className="text-green-300 text-sm mb-4 line-clamp-2">{post.description}</p>
                        <div className="space-y-1 text-sm text-green-300">
                          <p>Posted on: <span className="font-semibold text-green-100">{new Date(post.createdAt).toLocaleDateString()}</span></p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-green-400 mt-10 p-8 bg-green-800 rounded-lg shadow-md border border-green-700">
                This freelancer hasn't posted any projects or updates yet.
              </p>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Rating & Comment Section */}
        <motion.div
          className="mt-10 bg-green-800 p-6 rounded-lg shadow-lg max-w-xl mx-auto"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-2xl font-bold text-green-50 mb-4 text-center">Rate this Freelancer</h3>

          {/* Star rating */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={36}
                className={`cursor-pointer transition-colors ${
                  userRating >= star ? 'text-yellow-400' : 'text-green-400 hover:text-yellow-400'
                }`}
                onClick={() => handleStarClick(star)}
                aria-label={`${star} Star`}
                role="button"
              />
            ))}
          </div>

          {/* Comment box */}
          <textarea
            className="w-full p-3 rounded-md bg-green-900 text-green-100 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            rows={4}
            placeholder="Leave a comment..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />

          {/* Message */}
          {ratingMessage && (
            <p
              className={`text-center mb-4 ${
                ratingMessage.startsWith('Thank') ? 'text-green-300' : 'text-red-400'
              }`}
            >
              {ratingMessage}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              onClick={submitRating}
              disabled={submittingRating}
              className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-green-800 text-green-300 text-center py-6 border-t border-green-700"
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
