import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FreelancersList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};

  useEffect(() => {
    axios.get('http://localhost:9000/api/freelancers/all')
      .then((res) => setFreelancers(res.data))
      .catch((err) => console.error('Failed to fetch freelancers', err));
  }, []);

  const handleConnect = (freelancer) => {
    // Example navigation or action – you can change this to open a chat, send a message, etc.
    navigate('/messages', { state: { to: freelancer.name, email: freelancer.email } });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-green-700">FreelanceHub</h1>
            <p className="text-sm text-gray-600">Logged in as <span className="text-green-600 font-medium">{name}</span></p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <nav className="space-x-6 hidden md:flex">
            <button onClick={() => navigate(-1)} className="hover:text-green-600 font-medium">Home</button>
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

      <h1 className="text-3xl font-bold mb-6 text-center">Freelancers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {freelancers.map((freelancer) => (
          <div key={freelancer._id} className="w-80 bg-white shadow-md rounded-xl overflow-hidden p-4">
            <img
              src={`http://localhost:9000/uploads/freelancers/${freelancer.profileImage}`}
              alt={freelancer.name}
              className="w-full h-60 object-contain rounded-md mb-4 bg-gray-50"
            />
            <h2 className="text-xl font-semibold">{freelancer.name}</h2>
            <p className="text-gray-600">{freelancer.email}</p>
            <div className="mt-2">
              <strong>Skills:</strong>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {freelancer.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              {freelancer.github && (
                <a href={freelancer.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  GitHub
                </a>
              )}
              {freelancer.linkedin && (
                <a href={freelancer.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleConnect(freelancer)}
                className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
