import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminFreelancerControl() {
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
    navigate('/chat', {
      state: {
        currentUserEmail: email,
        targetUserEmail: freelancer.email,
      },
    });
  };

  const handleBlock = (freelancerEmail) => {
    alert(`Blocked ${freelancerEmail}`);
    // Add actual block logic here if needed
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-maroon-700 text-[#800000]">FreelanceHub</h1>
            <p className="text-sm text-gray-600">Logged in as <span className="text-[#800000] font-medium">{name}</span></p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#800000] text-white px-4 py-2 rounded hover:bg-[#990000] transition"
          >
            Back
          </button>
        </div>
      </header>

      <main className="flex-grow px-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#800000]">Freelancers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {freelancers.map((freelancer) => (
            <div key={freelancer._id} className="w-80 bg-white shadow-md rounded-xl overflow-hidden p-4">
              <img
                src={`http://localhost:9000/uploads/freelancers/${freelancer.profileImage}`}
                alt={freelancer.name}
                className="w-full h-60 object-contain rounded-md mb-4 bg-gray-50"
              />
              <h2 className="text-xl font-semibold text-[#800000]">{freelancer.name}</h2>
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleConnect(freelancer)}
                  className="bg-[#800000] text-white py-2 rounded-lg hover:bg-[#990000] transition font-semibold"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleBlock(freelancer.email)}
                  className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#800000] text-white text-center py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-lg mb-2">FreelanceHub</h2>
            <p>Empowering clients and freelancers to connect and collaborate effectively.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Quick Links</h2>
            <ul>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Contact</h2>
            <p>Email: support@freelancehub.com</p>
            <p>Phone: +91-9876543210</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-200">© {new Date().getFullYear()} FreelanceHub. All rights reserved.</div>
      </footer>
    </div>
  );
}
