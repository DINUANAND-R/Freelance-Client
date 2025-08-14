import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, Tag, User, Calendar, Briefcase } from 'lucide-react';

// The main component for displaying all projects in a card-based layout.
export default function AdminAllProjects() {
    const [projects, setProjects] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    // Fetch project data from the API on component mount.
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/projects/all');
                setProjects(res.data);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchProjects();
    }, []);

    // Framer Motion variants for the staggered container animation.
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            },
        },
    };

    // Framer Motion variants for each project card's animation.
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4
            },
        },
    };

    // Function to generate a status badge with dynamic styling.
    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            ongoing: 'bg-indigo-100 text-indigo-800 border-indigo-300',
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

    // Loading state UI
    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-indigo-600">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-2xl font-semibold"
                >
                    Loading projects...
                </motion.div>
            </div>
        );
    }

    // Main UI for the projects list
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-inter">
            {/* Header section with title and back button */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="sticky top-0 bg-white shadow-lg z-10"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-indigo-600">FreelanceHub Admin</h1>
                        <p className="text-sm text-gray-500">Projects Overview</p>
                    </div>
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="inline mr-2" size={18} /> Back
                    </motion.button>
                </div>
            </motion.header>

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-indigo-600">All Projects</h1>
                <p className="text-gray-600 mb-12 text-lg">Overview of all registered projects and their current status.</p>

                {projects.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg mt-10">
                        No projects found.
                    </div>
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
                                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full p-6"
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                                    {getStatusBadge(project.status)}
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                    {project.description}
                                </p>

                                <div className="text-sm text-gray-700 space-y-3 mt-4">
                                   
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-indigo-500" />
                                        <span className="font-medium text-gray-800">Deadline:</span>
                                        <span className="flex-1 text-gray-600">
                                            {project.timeline?.deadline ? new Date(project.timeline.deadline).toLocaleDateString() : 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} className="text-indigo-500" />
                                        <span className="font-medium text-gray-800">Budget:</span>
                                        <span className="flex-1 text-green-600 font-semibold">₹{project.budget}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-indigo-500" />
                                        <span className="font-medium text-gray-800">Client:</span>
                                        <span className="flex-1 text-gray-600">{project.clientEmail}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            <motion.footer
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="bg-white text-gray-500 text-center py-8 mt-10 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]"
            >
                <div className="max-w-6xl mx-auto px-4 text-sm">
                    <p>
                        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
                    </p>
                </div>
            </motion.footer>
        </div>
    );
}
