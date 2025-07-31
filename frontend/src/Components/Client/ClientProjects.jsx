import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PostProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    budget: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/api/project/create', {
        ...formData,
        clientEmail: email,
      });
      alert('Project posted successfully!');
      navigate('/client-dashboard', { state: { email } });
    } catch (err) {
      console.error('Project post failed:', err);
      alert('Failed to post project');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 max-w-xl w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-green-800">Post a New Project</h2>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          className="w-full border px-4 py-2 rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          className="w-full border px-4 py-2 rounded"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Required Skills (comma separated)"
          className="w-full border px-4 py-2 rounded"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget (USD)"
          className="w-full border px-4 py-2 rounded"
          value={formData.budget}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="deadline"
          className="w-full border px-4 py-2 rounded"
          value={formData.deadline}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Post Project
        </button>
      </form>
    </div>
  );
}
