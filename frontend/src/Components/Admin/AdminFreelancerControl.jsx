import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

// The main component for the admin control panel
export default function AdminFreelancerControl() {
    const [freelancers, setFreelancers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [freelancerToDelete, setFreelancerToDelete] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { name, email } = location.state || {};

    // Fetch freelancer data from the API
    useEffect(() => {
        axios.get('https://freelance-client-3029.onrender.com/api/freelancers/all')
            .then((res) => {
                setFreelancers(res.data);
                setIsLoaded(true);
            })
            .catch((err) => {
                console.error('Failed to fetch freelancers', err);
                setIsLoaded(true);
            });
    }, []);

    // Function to handle the "Connect" button click
    const handleConnect = (freelancer) => {
        console.log(`Connecting to freelancer: ${freelancer.email}`);
        navigate('/chat', {
            state: {
                currentUserEmail: email,
                targetUserEmail: freelancer.email,
            },
        });
    };

    // Function to handle the "Block" button click, shows a confirmation modal
    const handleBlock = (freelancer) => {
        setFreelancerToDelete(freelancer);
        setShowModal(true);
    };

    // Function to confirm the block and send a delete request to the API
    const handleConfirmBlock = async () => {
        if (!freelancerToDelete) return;
        try {
            await axios.delete(`https://freelance-client-3029.onrender.com/api/freelancers/delete/${freelancerToDelete.email}`);
            setFreelancers(prev => prev.filter(f => f.email !== freelancerToDelete.email));
            console.log(`Freelancer ${freelancerToDelete.email} has been deleted.`);
        } catch (err) {
            console.error('Error deleting freelancer:', err);
        }
        setShowModal(false);
        setFreelancerToDelete(null);
    };

    // Function to cancel the block action
    const handleCancelBlock = () => {
        setShowModal(false);
        setFreelancerToDelete(null);
    };

    // Framer Motion variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 150,
                damping: 15
            }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, rotateX: 90 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: { duration: 0.4, type: 'spring', damping: 20, stiffness: 300 }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            rotateX: 90,
            transition: { duration: 0.2 }
        }
    };
    
    // Loading state UI
    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900 text-indigo-200">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-2xl font-semibold"
                >
                    Loading freelancers...
                </motion.div>
            </div>
        );
    }

    // Main UI
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-indigo-100 font-inter">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="sticky top-0 bg-slate-900 shadow-xl z-10"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-indigo-400">FreelanceHub Admin</h1>
                        <p className="text-sm text-gray-400">
                            Logged in as <span className="text-indigo-300 font-medium">{name}</span>
                        </p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="inline mr-2" size={18} /> Back
                    </motion.button>
                </div>
            </motion.header>

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-indigo-300">Registered Freelancers</h1>
                
                {freelancers.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg mt-10">No freelancers found.</div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {freelancers.map((freelancer) => (
                                <motion.div 
                                    key={freelancer._id} 
                                    className="bg-slate-800 shadow-xl rounded-2xl overflow-hidden p-8 border border-slate-700 flex flex-col items-center text-center group"
                                    variants={cardVariants}
                                    layout
                                >
                                    <div className="w-32 h-32 relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 blur-lg"></div>
                                        <img
                                            src={`https://freelance-client-3029.onrender.com/uploads/freelancers/${freelancer.profileImage}`}
                                            alt={freelancer.name}
                                            className="w-full h-full object-cover rounded-full relative ring-4 ring-indigo-600 ring-offset-4 ring-offset-slate-800 transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-indigo-200 mb-2">{freelancer.name}</h2>
                                    <p className="text-gray-400 flex items-center mb-4 text-sm">
                                        <Mail size={16} className="mr-2 text-indigo-400" />
                                        {freelancer.email}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {freelancer.skills.map((skill, idx) => (
                                            <motion.span
                                                key={idx}
                                                className="bg-indigo-800 text-indigo-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200 border border-indigo-800"
                                                whileHover={{
                                                    backgroundColor: '#3730a3', // indigo-900
                                                    color: '#e0e7ff', // indigo-100
                                                    borderColor: '#6366f1', // indigo-500
                                                    scale: 1.1
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-6 mb-8">
                                        {freelancer.github && (
                                            <motion.a 
                                                href={freelancer.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Github size={24} />
                                            </motion.a>
                                        )}
                                        {freelancer.linkedin && (
                                            <motion.a 
                                                href={freelancer.linkedin} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Linkedin size={24} />
                                            </motion.a>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <motion.button
                                            onClick={() => handleConnect(freelancer)}
                                            className="bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Connect
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleBlock(freelancer)}
                                            className="bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Block
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <motion.footer
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="bg-slate-900 text-gray-400 text-center py-8 mt-10"
            >
                <div className="max-w-6xl mx-auto px-4 text-sm">
                    <p>
                        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
                    </p>
                </div>
            </motion.footer>

            {/* Custom confirmation modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-slate-800 text-indigo-100 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-700"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Trash2 size={48} className="text-red-400 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-2xl font-bold mb-2 text-indigo-200">Confirm Block</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to block <strong>{freelancerToDelete?.name}</strong>?
                                This action cannot be undone.
                            </p>
                            <div className="flex flex-col gap-4">
                                <motion.button
                                    onClick={handleConfirmBlock}
                                    className="bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <CheckCircle size={18} className="inline mr-2" /> Block Freelancer
                                </motion.button>
                                <motion.button
                                    onClick={handleCancelBlock}
                                    className="bg-slate-700 text-gray-300 py-3 rounded-full font-semibold hover:bg-slate-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <XCircle size={18} className="inline mr-2" /> Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
