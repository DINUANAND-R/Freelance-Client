import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
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
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg max-w-xl mx-auto">
          Have questions, feedback, or just want to say hello? We're here to help!
        </p>
      </section>

      {/* Contact Form & Info */}
      <section className="px-8 py-10 bg-white shadow-inner grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto rounded-xl">
        {/* Contact Form */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-green-800">Send a Message</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 p-3 rounded"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 p-3 rounded"
              required
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border border-gray-300 p-3 rounded"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-green-50 p-6 rounded-xl shadow">
          <h3 className="text-2xl font-semibold mb-4 text-green-800">Reach Us</h3>
          <p className="text-lg mb-4">
            📍 Chennai, India<br />
            📧 support@freelanceconnect.com<br />
            📞 +91-9876543210
          </p>
          <p className="text-gray-700 text-sm mt-6">
            We typically respond within 24 hours. Your feedback helps us grow!
          </p>
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
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <p className="text-sm">📧 support@freelanceconnect.com</p>
            <p className="text-sm">📍 Chennai, India</p>
          </div>
        </div>
        <div className="border-t border-white mt-10 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Freelance Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
