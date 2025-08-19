import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

export default function JobPostForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  const [formData, setFormData] = useState({
    email: email || '',
    name: name || '',
    title: "",
    companyName: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "",
    jobType: "Full-time",
    salaryRange: "",
    experience: "",
    applicationDeadline: "",
    contactEmail: "",
    references: "",
    postedBy: "client@example.com", 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("https://freelance-client-3029.onrender.com/api/job/create", formData);
      console.log("Job created:", res.data);
      alert("✅ Job Posted Successfully!");
      
      setFormData({
        title: "",
        companyName: "",
        description: "",
        responsibilities: "",
        requirements: "",
        location: "",
        jobType: "Full-time",
        salaryRange: "",
        experience: "",
        applicationDeadline: "",
        contactEmail: "",
        references: "",
        postedBy: "client@example.com",
      });

    } catch (error) {
      console.error("❌ Error posting job:", error.response?.data || error.message);
      alert("Failed to post job. Please check your data and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 sm:p-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 w-full max-w-4xl animate-fade-in">

        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-emerald-100 transition-colors duration-200"
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
            Post a New Job
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Tech Solutions Inc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote / New York, USA"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g. hr@company.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Description & Requirements Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Briefly describe the job role, company culture, and why someone should apply..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Key Responsibilities</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="3"
                placeholder="List key responsibilities, one per line."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills & Qualifications</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="List required skills and qualifications, one per line."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. $50,000 - $70,000 / year"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Required (Optional)</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2+ years"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 
            ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 transform hover:scale-105'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}