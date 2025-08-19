import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// A single, self-contained App component to contain the role selection page
export default function RoleSelectionPage() {
    const navigate = useNavigate();

    // Define custom SVG icons to replace the external dependency 'react-icons/fa6'
    const IconUserTie = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-4xl md:text-5xl">
            <path d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5z"></path>
            <path d="M19 10v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
            <path d="M12 17v4"></path>
            <path d="M9 21h6"></path>
        </svg>
    );

    const IconBriefcase = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-4xl md:text-5xl">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    );

    const IconShieldHalved = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-4xl md:text-5xl">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M12 18v-6h4"></path>
        </svg>
    );

    // Define Framer Motion variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-50 p-4 md:p-8 relative font-poppins"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
                    .font-poppins {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>

            {/* Back button and header */}
            <motion.div className="w-full max-w-7xl mb-8 md:mb-12" variants={itemVariants}>
                <div className="flex items-center justify-start">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium text-lg hidden sm:block">Back</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Title and Subtitle */}
            <motion.div className="text-center mb-10 md:mb-16" variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    Choose Your <span className="text-pink-400">Path</span>
                </h1>
                <p className="mt-3 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                    Select your role to get started on your freelance journey.
                </p>
            </motion.div>

            {/* Role Cards Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-7xl"
                variants={containerVariants}
            >
                {/* Client Card */}
                <motion.div
                    className="bg-gray-800 rounded-3xl shadow-lg p-8 md:p-10 text-center flex flex-col justify-between border-t-4 border-green-500 transform transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)" }}
                >
                    <motion.div
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center mb-6 md:mb-8"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconBriefcase />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">For Clients</h2>
                    <p className="text-gray-400 mb-6 flex-grow text-sm md:text-base">
                        Post your projects and hire from a global pool of skilled freelancers. Manage timelines, payments, and collaborate effectively.
                    </p>
                    <Link
                        to="/client/Login"
                        className="inline-block bg-green-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        Login as Client
                    </Link>
                </motion.div>

                {/* Freelancer Card */}
                <motion.div
                    className="bg-gray-800 rounded-3xl shadow-lg p-8 md:p-10 text-center flex flex-col justify-between border-t-4 border-blue-500 transform transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)" }}
                >
                    <motion.div
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center mb-6 md:mb-8"
                        whileHover={{ scale: 1.1, rotate: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconUserTie />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">For Freelancers</h2>
                    <p className="text-gray-400 mb-6 flex-grow text-sm md:text-base">
                        Find freelance jobs, build your portfolio, and earn from anywhere. Join our professional network today.
                    </p>
                    <Link
                        to="/freelancer/Login"
                        className="inline-block bg-blue-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        Login as Freelancer
                    </Link>
                </motion.div>

                {/* Admin Card */}
                <motion.div
                    className="bg-gray-800 rounded-3xl shadow-lg p-8 md:p-10 text-center flex flex-col justify-between border-t-4 border-white transform transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                        scale: [1, 1.01, 1], // Gentle pulsing animation
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <motion.div
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-white text-gray-900 flex items-center justify-center mb-6 md:mb-8"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconShieldHalved />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">For Admins</h2>
                    <p className="text-gray-400 mb-6 flex-grow text-sm md:text-base">
                        Manage platform users, monitor activity, and maintain system integrity with powerful tools.
                    </p>
                    <Link
                        to="/admin/Login"
                        className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105"
                    >
                        Login as Admin
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
