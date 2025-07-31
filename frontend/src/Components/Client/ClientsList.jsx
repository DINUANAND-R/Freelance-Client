// ClientsList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};

  useEffect(() => {
    axios.get('http://localhost:9000/api/client/all')
      .then((res) => setClients(res.data))
      .catch((err) => console.error('Failed to fetch clients', err));
  }, []);

  const handleConnect = (client) => {
    navigate('/chat', {
      state: {
        currentUserEmail: email,
        targetUserEmail: client.email,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-green-700">FreelanceHub</h1>
            <p className="text-sm text-gray-600">
              Logged in as <span className="text-green-600 font-medium">{name}</span>
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Clients</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {clients.map((client) => (
            <div key={client._id} className="w-80 bg-white shadow-md rounded-xl overflow-hidden p-4">
              <img
                src={`http://localhost:9000/${client.photo}`}
                alt={client.name}
                className="w-full h-60 object-contain rounded-md mb-4 bg-gray-50"
              />
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-700 mt-1">{client.address}</p>

              <div className="mt-4">
                {client.linkedin && (
                  <a
                    href={client.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleConnect(client)}
                  className="bg-green-800 text-white w-full py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-400 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold mb-3">About FreelanceHub</h2>
            <p className="text-sm leading-relaxed">
              FreelanceHub is a platform that bridges the gap between talented freelancers and clients seeking skilled professionals. We simplify collaboration and project management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-3">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/post-project" className="hover:underline">Post a Project</a></li>
              <li><a href="/freelancers" className="hover:underline">Browse Freelancers</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold mb-3">Contact Us</h2>
            <p className="text-sm">Email: support@freelancehub.com</p>
            <p className="text-sm">Phone: +91 98765 43210</p>
            <p className="text-sm">Location: Tamil Nadu, India</p>
          </div>
        </div>

        <div className="text-center py-4 border-t border-green-500 text-sm">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
