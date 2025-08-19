import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ClientRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: email, name } = location.state || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [currentRequestId, setCurrentRequestId] = useState(null); 

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`https://freelance-client-3029.onrender.com/api/project-requests/client/${email}`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch project requests:', err);
        setLoading(false);
      });
  }, [email]);

  const handleAction = (requestId, type) => {
    setCurrentRequestId(requestId);
    if (type === 'accept') {
      setModalContent({
        title: 'Accept Request',
        message: 'Are you sure you want to accept this request?',
        action: () => processRequest(requestId, 'accepted'),
        buttonText: 'Accept',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
      });
    } else {
      setModalContent({
        title: 'Deny Request',
        message: 'Are you sure you want to deny this request?',
        action: () => processRequest(requestId, 'denied'),
        buttonText: 'Deny',
        buttonColor: 'bg-red-600 hover:bg-red-700',
      });
    }
    setShowModal(true);
  };

  const processRequest = async (requestId, status) => {
    setShowModal(false);
    try {
      await axios.put(`https://freelance-client-3029.onrender.com/api/project-requests/${requestId}/status`, {
        status,
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error(`Error ${status} request:`, err);
      // Implement a custom error toast/notification here
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3 className="text-xl font-bold mb-4">{modalContent.title}</h3>
        <p className="text-gray-700 mb-6">{modalContent.message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-700 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => modalContent.action()}
            className={`px-4 py-2 text-white rounded-lg ${modalContent.buttonColor} transition-colors`}
          >
            {modalContent.buttonText}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen p-8 bg-emerald-50 font-sans text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate('/client/dashboard',{state:{name,email}})}
          className="flex items-center text-emerald-700 font-medium hover:text-emerald-500 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-4xl font-bold text-center mb-10 text-emerald-900">
        Project Requests
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests found.</p>
      ) : (
        <motion.div
          className="grid gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {requests.map((req, index) => (
            <motion.div
              key={req._id}
              className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
              variants={itemVariants}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-xl font-bold text-emerald-800">{req.projectTitle}</h2>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                  req.status === 'denied' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <p className="mb-2">
                <strong className="text-gray-700">Freelancer:</strong> {req.freelancerName}
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Email:</strong> {req.freelancerEmail}
              </p>
              <p className="mb-4 text-gray-600 italic">
                <strong className="text-gray-700 not-italic">Proposal:</strong> "{req.proposalMessage}"
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Requested on: {new Date(req.requestedAt).toLocaleString()}
              </p>

              {req.status === 'pending' && (
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleAction(req._id, 'accept')}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCheckCircle className="mr-2" /> Accept
                  </motion.button>
                  <motion.button
                    onClick={() => handleAction(req._id, 'deny')}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimesCircle className="mr-2" /> Deny
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      <AnimatePresence>
        {showModal && <Modal />}
      </AnimatePresence>
    </motion.div>
  );
}
