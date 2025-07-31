// ClientsList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-green-700">FreelanceHub</h1>
            <p className="text-sm text-gray-600">Logged in as <span className="text-green-600 font-medium">{name}</span></p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
      </header>

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
                <a href={client.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleConnect(client)}
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
