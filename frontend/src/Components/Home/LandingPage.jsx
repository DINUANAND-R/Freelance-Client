import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Smart Matching',
      desc: 'Our AI-powered algorithm matches freelancers with projects based on skills, experience, and preferences.',
      icon: '🔍',
    },
    {
      title: 'Real-time Chat',
      desc: 'Communicate instantly with clients and freelancers through our integrated messaging system.',
      icon: '💬',
    },
    {
      title: 'Secure Payments',
      desc: 'Safe and secure payment processing with escrow protection for both parties.',
      icon: '🛡️',
    },
    {
      title: 'Fast Delivery',
      desc: 'Get your projects completed quickly with our network of experienced professionals.',
      icon: '⚡',
    },
    {
      title: 'Fair Pricing',
      desc: 'Competitive rates and transparent pricing with no hidden fees.',
      icon: '💲',
    },
    {
      title: '24/7 Support',
      desc: 'Round-the-clock customer support to help you whenever you need assistance.',
      icon: '⏰',
    },
    {
      title: 'Verified Profiles',
      desc: 'All freelancers go through a verification process to ensure quality and reliability.',
      icon: '✅',
    },
    {
      title: 'Quality Guarantee',
      desc: "100% satisfaction guarantee with unlimited revisions until you're happy.",
      icon: '🏆',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-green-600">
            Freelance<span className="text-black">Connect</span>
          </h1>

          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-800 hover:text-green-700 text-xl">About</Link>
            <Link to="/contact" className="text-gray-800 hover:text-green-700 text-xl">Contact</Link>
            <button
              onClick={() => navigate('/role')}
              className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-600 transition"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-20 bg-gradient-to-b from-white to-green-50">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Connect with <span className="text-green-600">Top Freelancers</span> Worldwide
          </h2>

          <p className="text-gray-600 text-lg">
            Join thousands of businesses and freelancers building amazing projects together. 
            Find the perfect match for your next project or discover your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Start Your Journey →
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="border border-gray-400 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-100 transition"
            >
              Browse Projects
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative md:w-1/2 mb-12 md:mb-0">
          <img
            src="/hero.png"
            alt="Freelancers working"
            className="rounded-2xl shadow-lg w-full"
          />
          <div className="absolute top-4 right-4 bg-white shadow-md rounded-full px-4 py-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-700 font-medium">New project posted</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose <span className="text-green-600">FreelanceConnect</span>?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Experience the future of freelancing with our comprehensive platform designed for success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-green-600 text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-100 text-black px-6 md:px-20 py-10 mt-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-3">
              Freelance<span className="text-green-600">Connect</span>
            </h2>
            <p className="text-sm text-gray-700 max-w-sm">
              Empowering freelancers and clients to build, grow, and succeed together.
            </p>
          </div>

          {/* Link Groups */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-black font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/about" className="hover:text-green-700">About</Link></li>
                <li><Link to="/contact" className="hover:text-green-700">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-2">Services</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/hire" className="hover:text-green-700">Hire Talent</Link></li>
                <li><Link to="/post-job" className="hover:text-green-700">Post a Job</Link></li>
                <li><Link to="/freelancers" className="hover:text-green-700">Find Freelancers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-2">Support</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/help" className="hover:text-green-700">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-green-700">Terms of Use</Link></li>
                <li><Link to="/privacy" className="hover:text-green-700">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4 text-lg mt-1">
                <span className="hover:text-green-700 cursor-pointer">🌐</span>
                <span className="hover:text-green-700 cursor-pointer">🐦</span>
                <span className="hover:text-green-700 cursor-pointer">📘</span>
                <span className="hover:text-green-700 cursor-pointer">📸</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-8 pt-4 text-center text-sm text-gray-700">
          &copy; {new Date().getFullYear()} FreelanceConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
