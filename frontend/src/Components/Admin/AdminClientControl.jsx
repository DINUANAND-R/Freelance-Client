// ClientsList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {email } = location.state || {};

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios
      .get('http://localhost:9000/api/client/all')
      .then((res) => setClients(res.data))
      .catch((err) => console.error('Failed to fetch clients', err));
  };

  const handleConnect = (client) => {
    navigate('/chat', {
      state: {
        currentUserEmail: email,
        targetUserEmail: client.email,
      },
    });
  };

  const handleBlock = async (clientId, clientEmail) => {
    const confirmDelete = window.confirm(`Are you sure you want to block ${clientEmail}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9000/api/client/delete/${clientEmail}`);
      alert(`Client ${clientEmail} has been blocked.`);
      fetchClients();
    } catch (err) {
      console.error('Failed to block client', err);
      alert('Failed to block client.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf6f6]">
      {/* Header */}
      <header className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#800000]">FreelanceHub</h1>
            <p className="text-sm text-gray-600">
              Logged in as <span className="text-[#800000] font-medium">{name}</span>
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#800000] hover:bg-[#990000] text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#800000]">Clients</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {clients.map((client) => (
            <div key={client._id} className="w-80 bg-white shadow-md rounded-xl overflow-hidden p-4">
              <img
                src={`http://localhost:9000/${client.photo}`}
                alt={client.name}
                className="w-full h-60 object-contain rounded-md mb-4 bg-gray-50"
              />
              <h2 className="text-xl font-semibold text-[#800000]">{client.name}</h2>
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

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleConnect(client)}
                  className="bg-[#800000] text-white py-2 rounded-lg hover:bg-[#990000] transition font-semibold"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleBlock(client._id, client.email)}
                  className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#800000] text-white text-center py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-lg mb-2">FreelanceHub</h2>
            <p>Connecting clients with top freelancers to make collaboration easy and effective.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Quick Links</h2>
            <ul>
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/post-project" className="hover:underline">Post a Project</a></li>
              <li><a href="/freelancers" className="hover:underline">Browse Freelancers</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Contact</h2>
            <p>Email: support@freelancehub.com</p>
            <p>Phone: +91-9876543210</p>
            <p>Location: Tamil Nadu, India</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-200">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
