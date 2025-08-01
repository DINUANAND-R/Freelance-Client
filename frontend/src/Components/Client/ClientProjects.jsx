import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


export default function ClientPostProject() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [formData, setFormData] = useState({
    clientEmail: email || '',
    title: '',
    description: '',
    deliverables: '',
    deadline: '',
    budget: '',
    references: '',
    ndaRequired: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in the required fields: Project Title and Description');
      return;
    }
    setPage(2);
  };

  const handleBack = () => setPage(1);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:9000/api/projects/create', formData);
    console.log('✅ Project posted successfully:', response.data);
    alert('Project posted successfully!');
    navigate(-1);
  } catch (err) {
    console.error('❌ Network or server error:', err);
    alert('Network error or server failure: ' + err.response?.data?.error || err.message);
  }
};


  const pageTransition = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-10 px-4">
      {/* Back button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-medium hover:underline"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-green-900 mb-6">Post a New Project</h2>

      {/* Step Indicator */}
      <div className="flex items-center mb-8 space-x-4">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center space-x-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold
              ${page === step ? 'bg-green-600 animate-bounce' : 'bg-green-300'}`}>
              {step}
            </div>
            {step < 2 && <div className="w-10 h-1 bg-green-400 rounded-full transition-all duration-300"></div>}
          </div>
        ))}
      </div>

      <form className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {page === 1 && (
            <motion.div key="page1" {...pageTransition} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium">Project Title <span className="text-red-500">*</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Build a portfolio website"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the project goals, requirements, expectations, etc."
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Deliverables</label>
                <input
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleChange}
                  placeholder="e.g. Source code, documentation, demo video"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Next
              </button>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div key="page2" {...pageTransition} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium">Deadline <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Budget <span className="text-red-500">*</span></label>
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ₹5000 - ₹10000"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">References / Links</label>
                <input
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="e.g. Figma designs, GitHub repo, sample websites"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ndaRequired"
                  name="ndaRequired"
                  checked={formData.ndaRequired}
                  onChange={handleChange}
                />
                <label htmlFor="ndaRequired" className="text-gray-700">NDA Required</label>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
