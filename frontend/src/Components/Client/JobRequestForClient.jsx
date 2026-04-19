import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ClientJobRequests() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientEmail, name } = location.state || {};

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    if (clientEmail) {
      fetchRequests();
    }
  }, [clientEmail]);

  const fetchRequests = () => {
    axios
      .get(`http://localhost:9000/api/jobRequest/client/${clientEmail}`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setLoading(false);
      });
  };

  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:9000/api/jobRequest/update/${id}`, { status })
      .then(() => {
        alert(`Request ${status}`);
        fetchRequests();
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const handleViewResume = (fileName) => {
    const url = `http://localhost:9000/uploads/resumes/${fileName}`;
    setResumeUrl(url);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Title Container */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900 ml-4 flex-grow text-center">
            Job Requests for {name || clientEmail}
          </h2>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg text-gray-600">No job requests found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${
                    req.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : req.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {req.status || "Pending"}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="space-y-1">
                    <p>
                      <strong className="text-gray-900">Title:</strong>{" "}
                      {req.title}
                    </p>
                    <p>
                      <strong className="text-gray-900">Company:</strong>{" "}
                      {req.companyName}
                    </p>
                    <p>
                      <strong className="text-gray-900">Job Type:</strong>{" "}
                      {req.jobType}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong className="text-gray-900">
                        Freelancer Name:
                      </strong>{" "}
                      {req.FreelancerName}
                    </p>
                    <p>
                      <strong className="text-gray-900">
                        Freelancer Email:
                      </strong>{" "}
                      {req.FreelancerEmail}
                    </p>
                  </div>
                </div>

                {req.resume && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleViewResume(req.resume)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V7.414A1 1 0 0014.586 7H12a1 1 0 01-1-1V4.586A1 1 0 009.414 4H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Resume
                    </button>
                  </div>
                )}

                {/* Buttons and Status */}
                {!["Accepted", "Cancelled"].includes(req.status) && (
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => updateStatus(req._id, "Accepted")}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req._id, "Cancelled")}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 z-10"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              src={resumeUrl}
              title="Resume Viewer"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}