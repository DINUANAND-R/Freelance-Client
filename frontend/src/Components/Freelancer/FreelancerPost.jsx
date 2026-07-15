import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Main component for the form
const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { freelancerName, freelancerEmail } = location.state || {};

  // State to manage form data, file, and UI interactions
  const [formData, setFormData] = useState({
    freelancerName: '',
    freelancerEmail: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  // Set initial form data from the location state
  useEffect(() => {
    if (freelancerName && freelancerEmail) {
      setFormData(prev => ({
        ...prev,
        freelancerName,
        freelancerEmail
      }));
    }
  }, [freelancerName, freelancerEmail]);

  // Handle changes in text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection with a custom input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle drag and drop for the file input
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('file', file);

      const res = await axios.post(
        'https://freelance-client-3029.onrender.com/api/post/create',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      console.log(res.data);
      setIsSuccess(true);
      setStatusMessage('Post created successfully!');

      // Navigate after a short delay
      setTimeout(() => {
        navigate('/freelancer/dashboard', { state: { name: freelancerName, email: freelancerEmail } });
      }, 1000);

    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMessage('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
      <div className="max-w-xl w-full">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01] animate-fade-in"
        >
          {statusMessage && (
            <div className={`p-4 mb-4 rounded-lg text-center font-medium ${isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {statusMessage}
            </div>
          )}

          <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Create a New Post
          </h2>

          <p className="text-gray-400 text-center mb-6">
            Share your latest project or service with potential clients.
          </p>

          {/* Freelancer Info */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6 flex justify-between items-center animate-slide-in">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold">
                {formData.freelancerName?.charAt(0) || 'J'}
              </div>
              <div>
                <p className="text-sm font-semibold">{formData.freelancerName || 'N/A'}</p>
                <p className="text-xs text-gray-400">{formData.freelancerEmail || 'N/A'}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-600 rounded-full">Freelancer</span>
          </div>

          {/* Title Input */}
          <div className="space-y-6">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="peer w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder=" "
              />
              <label
                htmlFor="title"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
              >
                Post Title
              </label>
            </div>

            {/* Description */}
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="peer w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder=" "
              ></textarea>
              <label
                htmlFor="description"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-sm"
              >
                Description
              </label>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-400 font-medium mb-2">Upload File</label>
              <div
                className="flex items-center justify-center w-full px-6 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="text-center w-full h-full cursor-pointer">
                  {file ? (
                    <span className="text-green-400 flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{file.name}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 flex flex-col items-center justify-center space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8" />
                      </svg>
                      <p className="text-sm font-medium">
                        <span className="text-blue-400 font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Post Project'
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
