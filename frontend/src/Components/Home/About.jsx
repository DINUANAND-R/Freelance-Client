    import React from 'react';
    import { Link } from 'react-router-dom';

    export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-gray-800">
        {/* Navbar */}
        <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
            <h1 className="text-2xl font-bold">Freelance Connect</h1>
            <div className="space-x-6 text-lg">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/about" className="hover:text-gray-200">About</Link>
            <Link to="/contact" className="hover:text-gray-200">Contact</Link>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center py-14">
            <h2 className="text-4xl font-bold mb-4">About Our Platform</h2>
            <p className="text-lg max-w-2xl mx-auto mb-6">
            Connecting ambitious clients with skilled freelancers – all in one professional platform.
            </p>
            <Link
            to="/signup"
            className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold py-3 px-6 rounded-full transition duration-300"
            >
            Get Started
            </Link>
        </section>

        {/* Purpose Section */}
        <section className="px-8 py-10 bg-white shadow-inner">
            <h3 className="text-3xl font-semibold mb-4 text-center text-green-800">Why We Built Freelance Connect</h3>
            <p className="max-w-4xl mx-auto text-lg leading-7 text-gray-700">
            In today's digital world, freelancers and clients often struggle to find the right match. 
            Freelancers seek visibility and meaningful work, while clients want reliable and talented professionals. 
            Freelance Connect was built to simplify this process — allowing users to easily connect, communicate, and collaborate.
            </p>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-8 bg-green-100">
            <h3 className="text-3xl font-semibold text-center mb-8 text-green-900">How It Helps</h3>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-lg">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-bold text-green-800 mb-2">For Freelancers</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Showcase your profile and skills</li>
                <li>Chat with potential clients in real-time</li>
                <li>Access projects that match your expertise</li>
                <li>Grow your professional network</li>
                </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-bold text-green-800 mb-2">For Clients</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Post project requirements easily</li>
                <li>Find verified, skilled freelancers</li>
                <li>Use real-time chat for quick collaboration</li>
                <li>Track project communication in one place</li>
                </ul>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-green-700 text-white px-10 py-12 mt-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div>
                <h4 className="text-xl font-semibold mb-4">About Freelance Connect</h4>
                <p className="text-sm leading-6">
                Freelance Connect bridges the gap between talented freelancers and clients seeking top-notch work.
                </p>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4">Platform Features</h4>
                <ul className="space-y-2 text-sm">
                <li>✔️ Real-time Chat</li>
                <li>✔️ Project Posting</li>
                <li>✔️ Skill-Based Search</li>
                </ul>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/role">Login</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4">Contact</h4>
                <p className="text-sm">📧 support@freelanceconnect.com</p>
                <p className="text-sm">📍 Erode, India</p>
            </div>
            </div>
            <div className="border-t border-white mt-10 pt-4 text-center text-sm">
            &copy; {new Date().getFullYear()} Freelance Connect. All rights reserved.
            </div>
        </footer>
        </div>
    );
    }
