import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// A single, self-contained App component to contain the landing page
export default function LandingPage() {

    // Custom SVG icons for the features section and footer
    // These are inline SVGs to keep the application self-contained
    const LucideSearch = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
        </svg>
    );

    const LucideMessageSquare = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    );

    const LucideShieldCheck = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <path d="M20 13c0 5-2.5 7-5 8-2.5-1-5-3-5-8V5l5-2 5 2z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    );

    const LucideZap = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    );

    const LucideDollarSign = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <path d="M12 1h12"></path>
            <path d="M12 23h12"></path>
            <path d="M12 14v-4.5H5.8"></path>
            <path d="M16.2 10H20V6.5L16.2 10"></path>
            <path d="M16.2 14H20v4.5L16.2 14"></path>
            <path d="M12 12V8.5H5.8"></path>
        </svg>
    );

    const LucideAward = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <circle cx="12" cy="8" r="6"></circle>
            <path d="M15.4 12.4 17 22l-5-2-5 2 1.6-9.6"></path>
        </svg>
    );

    const LucideCheckCircle = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-8.15"></path>
            <path d="m9 11 3 3L22 4"></path>
        </svg>
    );

    const LucideLifeBuoy = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-cyan-400">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <path d="m4.93 4.93 4.24 4.24"></path>
            <path d="m14.83 14.83 4.24 4.24"></path>
            <path d="m14.83 9.17 4.24-4.24"></path>
            <path d="m4.93 19.07 4.24-4.24"></path>
        </svg>
    );

    // Social media icons
    const LucideGlobe = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
        </svg>
    );

    const LucideTwitter = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M22 4s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2zM22 12s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2zM22 20s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2z"></path>
        </svg>
    );

    const LucideFacebook = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
    );

    const LucideInstagram = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"></line>
        </svg>
    );

    // Define the features data with Lucide icons
    const features = [
        {
            title: 'Smart Matching',
            desc: 'Our AI-powered algorithm matches freelancers with projects based on skills, experience, and preferences.',
            icon: <LucideSearch />,
        },
        {
            title: 'Real-time Chat',
            desc: 'Communicate instantly with clients and freelancers through our integrated messaging system.',
            icon: <LucideMessageSquare />,
        },
        {
            title: 'Secure Payments',
            desc: 'Safe and secure payment processing with escrow protection for both parties.',
            icon: <LucideShieldCheck />,
        },
        {
            title: 'Fast Delivery',
            desc: 'Get your projects completed quickly with our network of experienced professionals.',
            icon: <LucideZap />,
        },
        {
            title: 'Fair Pricing',
            desc: 'Competitive rates and transparent pricing with no hidden fees.',
            icon: <LucideDollarSign />,
        },
        {
            title: 'Verified Profiles',
            desc: 'All freelancers go through a verification process to ensure quality and reliability.',
            icon: <LucideCheckCircle />,
        },
        {
            title: 'Quality Guarantee',
            desc: "100% satisfaction guarantee with unlimited revisions until you're happy.",
            icon: <LucideAward />,
        },
        {
            title: '24/7 Support',
            desc: 'Round-the-clock customer support to help you whenever you need assistance.',
            icon: <LucideLifeBuoy />,
        },
    ];

    // State to handle the navigation bar's background on scroll
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Framer Motion Variants for staggered animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        hover: { scale: 1.05, transition: { duration: 0.2 } }
    }

    return (
        <div className="min-h-screen font-inter antialiased bg-slate-950 text-slate-50">

            {/* Navbar with subtle transparency and shadow on scroll */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
                <nav className="flex items-center justify-between px-4 sm:px-6 py-4 md:px-12">
                    <motion.h1
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 transition-colors duration-300"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Freelance<span className="text-cyan-400">Connect</span>
                    </motion.h1>

                    <div className="hidden md:flex items-center space-x-8">
                        <motion.a href="#features" className="text-slate-400 hover:text-cyan-400 font-medium text-lg transition-colors duration-200" variants={itemVariants}>Features</motion.a>
                        <motion.a href="/about" className="text-slate-400 hover:text-cyan-400 font-medium text-lg transition-colors duration-200" variants={itemVariants}>About</motion.a>
                        <motion.a href="/contact" className="text-slate-400 hover:text-cyan-400 font-medium text-lg transition-colors duration-200" variants={itemVariants}>Contact</motion.a>
                    </div>
                    <Link to={'/role'}>
                        <motion.button
                            className="bg-cyan-500 text-slate-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-cyan-600 transition-transform duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <motion.section
                className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 py-16 md:py-32 bg-slate-950 text-white overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-fade-in"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-fade-in-delay-1"></div>

                {/* Left Content */}
                <div className="relative z-10 md:w-1/2 text-center md:text-left space-y-4 md:space-y-8 mt-8 md:mt-0 animate-fade-in">
                    <motion.h2
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
                        variants={itemVariants}
                    >
                        Connect with <span className="text-cyan-400">Top Freelancers</span> Worldwide
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg md:text-xl max-w-xl mx-auto md:mx-0 text-slate-300"
                        variants={itemVariants}
                    >
                        Join thousands of businesses and freelancers building amazing projects together. Find the perfect match for your next project or discover your dream job.
                    </motion.p>
                    <motion.div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start" variants={itemVariants}>
                        <Link to="/role">
                            <motion.button
                                className="bg-cyan-500 text-slate-900 font-bold px-6 py-3 md:px-8 md:py-4 rounded-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-base"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Your Journey →
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Image/Placeholder */}
                <motion.div
                    className="relative md:w-1/2 flex justify-center items-center mt-12 md:mt-0 animate-fade-in-delay-2"
                    variants={itemVariants}
                >
                    {/* Using a placeholder for an image to ensure the code is self-contained and runnable */}
                    <img
                        src="https://placehold.co/800x600/0891b2/0f172a?text=FreelanceConnect"
                        alt="Freelancers working on a project"
                        className="rounded-3xl shadow-2xl w-full max-w-lg transform hover:scale-105 transition-transform duration-300"
                    />
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="px-4 sm:px-6 md:px-20 py-16 md:py-20 bg-slate-950">
                <div className="text-center mb-12 md:mb-16">
                    <motion.span
                        className="text-cyan-400 font-semibold uppercase tracking-widest text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Advantages
                    </motion.span>
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-50 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Why Choose <span className="text-cyan-400">FreelanceConnect</span>?
                    </motion.h2>
                    <motion.p
                        className="mt-4 text-slate-400 text-base sm:text-lg max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Experience the future of freelancing with our comprehensive platform designed for success.
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            className="p-6 md:p-8 bg-slate-800 rounded-2xl shadow-md transition-all duration-300 transform group cursor-pointer border-t-4 border-cyan-500"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-cyan-900 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-cyan-800">
                                {item.icon}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-50 mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* New Call to Action Section */}
            <motion.section
                className="bg-slate-900 text-white px-4 sm:px-8 md:px-20 py-16 md:py-20 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4" variants={itemVariants}>Ready to get started?</motion.h2>
                <motion.p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 text-slate-300" variants={itemVariants}>
                    Join our community of talented freelancers and clients today and find your perfect match.
                </motion.p>
                <Link to="/role">
                    <motion.button
                        onClick={() => console.log('Join Now clicked')}
                        className="bg-cyan-500 text-slate-900 font-bold px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg hover:bg-cyan-600 transition-transform duration-300 transform hover:scale-105 text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Join FreelanceConnect
                    </motion.button>
                </Link>
            </motion.section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 px-4 sm:px-8 md:px-20 py-12">
                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10">
                    {/* Brand Info */}
                    <div className="md:w-1/4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                            Freelance<span className="text-cyan-400">Connect</span>
                        </h2>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Empowering freelancers and clients to build, grow, and succeed together.
                        </p>
                    </div>

                    {/* Link Groups */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 flex-1">
                        <div>
                            <h3 className="text-white font-semibold mb-2 text-base">Quick Links</h3>
                            <ul className="space-y-1 text-sm">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">About</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Contact</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-2 text-base">Services</h3>
                            <ul className="space-y-1 text-sm">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Hire Talent</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Post a Job</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Find Freelancers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-2 text-base">Support</h3>
                            <ul className="space-y-1 text-sm">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Terms of Use</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-2 text-base">Follow Us</h3>
                            <div className="flex space-x-4 text-xl mt-1">
                                <a href="#" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Social Media Link"><LucideGlobe /></a>
                                <a href="#" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Social Media Link"><LucideTwitter /></a>
                                <a href="#" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Social Media Link"><LucideFacebook /></a>
                                <a href="#" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Social Media Link"><LucideInstagram /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} FreelanceConnect. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
