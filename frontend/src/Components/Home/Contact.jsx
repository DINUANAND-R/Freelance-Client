import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Handshake, Lightbulb } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased">
            {/* Navbar
                Uses flexbox with justify-between for alignment and Tailwind's responsive
                prefixes (sm:, md:) for padding and font sizes, ensuring it looks good on all devices.
            */}
            <nav className="sticky top-0 z-50 bg-white shadow-md px-4 sm:px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Freelance<span className="text-yellow-500">Connect</span>
                </h1>
                
                {/* Desktop and larger screens navigation links - hidden on mobile */}
                <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-yellow-500 font-medium text-base lg:text-lg transition-colors duration-300"
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className="text-yellow-500 font-medium text-base lg:text-lg border-b-2 border-yellow-500"
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="text-gray-600 hover:text-yellow-500 font-medium text-base lg:text-lg transition-colors duration-300"
                    >
                        Contact
                    </Link>
                    <Link to="/role">
                        <button
                            className="bg-yellow-500 text-gray-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                            Get Started
                        </button>
                    </Link>
                </div>

                {/* Mobile-friendly Get Started button - hidden on desktop */}
                <div className="md:hidden">
                    <Link to="/role">
                        <button
                            className="bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-full hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105 shadow-lg text-sm"
                        >
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section
                Uses responsive padding, font sizes, and max-width to adapt to different
                screen sizes, ensuring readability and a focused layout.
            */}
            <section className="text-center py-16 md:py-24 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up leading-tight">
                        Building Connections That Last
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300 animate-fade-in-up-delay-1">
                        We're more than just a platform; we're a community dedicated to empowering
                        clients and freelancers to achieve their goals together.
                    </p>
                    <Link
                        to="/role"
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-base sm:text-lg font-bold py-3 px-6 sm:px-8 rounded-full 
                        transition-transform duration-300 transform hover:scale-105 shadow-xl animate-fade-in-up-delay-2 inline-block"
                    >
                        Join Our Community
                    </Link>
                </div>
            </section>

            {/* Our Mission Section
                Utilizes a responsive grid with different column counts for small, medium,
                and large screens (grid-cols-1, sm:grid-cols-2, md:grid-cols-3) to
                ensure the content remains readable.
            */}
            <section className="px-4 sm:px-6 md:px-12 py-16 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 text-gray-900 animate-fade-in-up">
                        Our Mission
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                                <Target className="text-2xl sm:text-3xl text-yellow-500 group-hover:animate-icon-bounce" />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Our Vision</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                To become the go-to platform where great ideas meet exceptional talent,
                                fostering a world of seamless collaboration.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                                <Handshake className="text-2xl sm:text-3xl text-yellow-500 group-hover:animate-icon-bounce" />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Our Promise</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                We promise to provide a safe, secure, and intuitive environment that empowers
                                both clients and freelancers.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                                <Lightbulb className="text-2xl sm:text-3xl text-yellow-500 group-hover:animate-icon-bounce" />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Our Values</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                We believe in transparency, integrity, and innovation to drive success for
                                everyone on our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer
                Uses a responsive grid with multiple columns for different screen sizes,
                and consistent padding and text sizes.
            */}
            <footer className="bg-gray-900 text-gray-300 px-4 sm:px-6 md:px-12 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-4 text-white">Freelance<span className="text-yellow-500">Connect</span></h4>
                        <p className="text-sm leading-6 text-gray-400">
                            Bridging the gap between talented freelancers and clients seeking top-notch work.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Platform Features</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center space-x-2">✔️<span>Real-time Chat</span></li>
                            <li className="flex items-center space-x-2">✔️<span>Project Posting</span></li>
                            <li className="flex items-center space-x-2">✔️<span>Skill-Based Search</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-yellow-500 transition-colors duration-200">Home</Link></li>
                            <li><Link to="/about" className="text-yellow-500">About</Link></li>
                            <li><Link to="/role" className="hover:text-yellow-500 transition-colors duration-200">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
                        <p className="text-sm text-gray-400 mb-2">📧 <a href="mailto:support@freelanceconnect.com" className="hover:text-yellow-500 transition-colors duration-200">support@freelanceconnect.com</a></p>
                        <p className="text-sm text-gray-400">📍 Erode, India</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Freelance Connect. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
