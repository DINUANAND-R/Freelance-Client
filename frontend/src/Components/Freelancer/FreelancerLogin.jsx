// ✅ Corrected React Component: FreelancerLogin.jsx
// Fixes: Corrected endpoint path, response structure handling

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function FreelancerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:9000/api/freelancers/login',
        formData
      );

      const { freelancer } = response.data;
      const { name, email, profileImage } = freelancer;

      navigate('/freelancer/dashboard', {
        state: {
          name,
          email,
          image: profileImage,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center px-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition"
      >
        <ArrowLeft className="w-6 h-6" />
        Back
      </button>

      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Freelancer Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <span
            className="text-green-600 cursor-pointer font-medium hover:underline"
            onClick={() => navigate('/freelancer/SignUp')}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}
