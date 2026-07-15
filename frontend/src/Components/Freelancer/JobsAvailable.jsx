import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

export default function JobApplication() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const { name, email } =
    location.state || JSON.parse(localStorage.getItem("freelancer")) || {};

  useEffect(() => {
    // Fetch jobs from backend
    axios
      .get("https://freelance-client-3029.onrender.com/api/job")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setFile(null); // reset file when modal opens
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("ClientName", selectedJob.name);
    formData.append("ClientEmail", selectedJob.email);
    formData.append("FreelancerName", name);
    formData.append("FreelancerEmail", email);
    formData.append("title", selectedJob.title);
    formData.append("companyName", selectedJob.companyName);
    formData.append("jobType", selectedJob.jobType);
    formData.append("jobId", selectedJob._id);
    formData.append("status", "applied");

    if (file) {
      formData.append("resume", file);
    }

    try {
      await axios.post("https://freelance-client-3029.onrender.com/api/jobRequest/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application sent successfully!");
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      alert("Error while sending request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button and Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
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
            Available Jobs
          </h2>
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 text-lg p-6">
            <p>No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                <p className="text-gray-600">
                  <span className="font-semibold">{job.companyName}</span> -{" "}
                  {job.jobType}
                </p>
                <p className="mt-2 text-gray-700">{job.description}</p>
                <p className="mt-2 text-gray-500 text-sm">
                  Salary:{" "}
                  <span className="font-medium text-gray-600">
                    {job.salaryRange || "Not specified"}
                  </span>
                </p>

                <button
                  className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Apply Form Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-4 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-5 text-gray-800 text-center">
                Apply for {selectedJob.title}
              </h3>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Freelancer Name
                  </label>
                  <input
                    type="text"
                    value={name || ""}
                    readOnly
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Freelancer Email
                  </label>
                  <input
                    type="email"
                    value={email || ""}
                    readOnly
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={selectedJob.name || ""}
                    readOnly
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={selectedJob.email || ""}
                    readOnly
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {/* File Upload with improved styling */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-1 w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-300
                      ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'}`}
                  >
                    {loading ? "Submitting..." : "Send Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}