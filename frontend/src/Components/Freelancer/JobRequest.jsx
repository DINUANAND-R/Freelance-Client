// src/pages/JobRequestForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function JobRequest() {
  const [formData, setFormData] = useState({
    ClientName: "",
    FreelancerName: "",
    ClientEmail: "",
    FreelancerEmail: "",
    title: "",
    companyName: "",
    jobType: "Full-time",
  });

  const [requests, setRequests] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://freelance-client-3029.onrender.com/api/jobrequests/create", formData);
      alert("Job Request Sent ✅");
      setFormData({
        ClientName: "",
        FreelancerName: "",
        ClientEmail: "",
        FreelancerEmail: "",
        title: "",
        companyName: "",
        jobType: "Full-time",
      });
      fetchRequests();
    } catch (error) {
      console.error("❌ Error creating job request:", error);
    }
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://freelance-client-3029.onrender.com/api/jobrequests");
      setRequests(res.data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Send Job Request</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          name="ClientName"
          placeholder="Client Name"
          value={formData.ClientName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="FreelancerName"
          placeholder="Freelancer Name"
          value={formData.FreelancerName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="ClientEmail"
          placeholder="Client Email"
          value={formData.ClientEmail}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="FreelancerEmail"
          placeholder="Freelancer Email"
          value={formData.FreelancerEmail}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Send Request
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-4">Job Requests</h3>
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border p-4 rounded-lg shadow-sm bg-gray-50"
          >
            <p>
              <strong>Client:</strong> {req.ClientName} ({req.ClientEmail})
            </p>
            <p>
              <strong>Freelancer:</strong> {req.FreelancerName} (
              {req.FreelancerEmail})
            </p>
            <p>
              <strong>Job:</strong> {req.title} at {req.companyName}
            </p>
            <p>
              <strong>Type:</strong> {req.jobType}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
