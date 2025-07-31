import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaProjectDiagram, FaEnvelope, FaUserCog, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract freelancer info passed from login
  const freelancer = location.state || {};
  const { name, email, image } = freelancer;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100 text-gray-800 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-green-700">FreelanceHub</h1>
            <p className="text-sm text-gray-600">Logged in as <span className="text-green-600 font-medium">{name}</span></p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <nav className="space-x-6 hidden md:flex">
            <button onClick={() => navigate('/my-projects')} className="hover:text-green-600 font-medium">My Projects</button>
            <button onClick={() => navigate('/messages')} className="hover:text-green-600 font-medium">Messages</button>
            <button onClick={() => navigate('/settings')} className="hover:text-green-600 font-medium">Settings</button>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow px-6 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4 animate-fade-in-up">
          Welcome, {name || "Freelancer"}!
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          Manage your profile, find new opportunities, and stay connected with clients.
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto mb-16">
          {/* View Projects */}
          <div
            onClick={() => navigate('/my-projects', { state: { freelancerID, email } })}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer hover:shadow-xl transition group"
          >
            <FaProjectDiagram className="text-green-600 text-3xl mb-3 group-hover:scale-110 transition" />
            <h4 className="text-xl font-semibold text-green-800 mb-2">My Projects</h4>
            <p className="text-gray-600 text-sm">View your ongoing and completed projects.</p>
          </div>

          {/* Messages */}
          <div
            onClick={() => navigate('/messages', { state: { freelancerID, email } })}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer hover:shadow-xl transition group"
          >
            <FaEnvelope className="text-green-600 text-3xl mb-3 group-hover:scale-110 transition" />
            <h4 className="text-xl font-semibold text-green-800 mb-2">Messages</h4>
            <p className="text-gray-600 text-sm">Communicate with clients and respond to offers.</p>
          </div>

          {/* Settings */}
          <div
            onClick={() => navigate('/settings', { state: { freelancerID, email } })}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer hover:shadow-xl transition group"
          >
            <FaUserCog className="text-green-600 text-3xl mb-3 group-hover:rotate-90 transition" />
            <h4 className="text-xl font-semibold text-green-800 mb-2">Profile Settings</h4>
            <p className="text-gray-600 text-sm">Update your skills, profile, and portfolio links.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-6 shadow-inner">
        <div className="flex justify-center space-x-6 mb-2">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-700">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-700">
            <FaLinkedin size={20} />
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
