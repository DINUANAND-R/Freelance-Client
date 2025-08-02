// src/pages/ClientRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function ClientRequestPage() {
  const location = useLocation();
  const { email: clientEmail,name } = location.state || {}; // passed from navigation
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!clientEmail) return;
    axios
      .get(`http://localhost:9000/api/project-requests/client/${clientEmail}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Failed to fetch project requests:', err));
  }, [clientEmail]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Project Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req, index) => (
            <div key={index} className="p-4 bg-white rounded shadow-md">
              <p><strong>Project:</strong> {req.projectTitle}</p>
              <p><strong>Freelancer:</strong> {req.freelancerEmail}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Requested on:</strong> {new Date(req.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
