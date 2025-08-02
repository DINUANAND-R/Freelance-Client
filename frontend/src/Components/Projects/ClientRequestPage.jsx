import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClientRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: clientEmail, name } = location.state || {};
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!clientEmail) return;
    axios
      .get(`http://localhost:9000/api/project-requests/client/${clientEmail}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Failed to fetch project requests:', err));
  }, [clientEmail]);

  const handleAccept = async (requestId) => {
    const confirmAccept = window.confirm('Are you sure you want to accept this request?');
    if (!confirmAccept) return;

    try {
      await axios.put(`http://localhost:9000/api/project-requests/${requestId}/status`, {
        status: 'accepted',
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, status: 'accepted' } : r
        )
      );
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleDeny = async (requestId) => {
    const confirmDeny = window.confirm('Are you sure you want to deny this request?');
    if (!confirmDeny) return;

    try {
      await axios.put(`http://localhost:9000/api/project-requests/${requestId}/status`, {
        status: 'denied',
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, status: 'denied' } : r
        )
      );
    } catch (err) {
      console.error('Error denying request:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Project Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req, index) => (
            <div key={index} className="p-4 bg-white rounded shadow-md">
              <p><strong>Project:</strong> {req.projectTitle}</p>
              <p><strong>Freelancer:</strong> {req.freelancerName}</p>
              <p><strong>Freelancer Email:</strong> {req.freelancerEmail}</p>
              <p><strong>Proposal Message:</strong> {req.proposalMessage}</p>
              <p><strong>Requested on:</strong> {new Date(req.requestedAt).toLocaleString()}</p>

              {req.status === 'accepted' || req.status === 'denied' ? (
                <p className="mt-3 font-semibold text-blue-600">
                  Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </p>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAccept(req._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeny(req._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
