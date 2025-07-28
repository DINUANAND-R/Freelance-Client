
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FreelancerSignup() {

  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    linkedin: '',
    github: '',
    profileImage: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('skills', JSON.stringify(formData.skills.split(',')));
    data.append('linkedin', formData.linkedin);
    data.append('github', formData.github);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    try {
      const res = await axios.post('http://localhost:9000/api/freelancers/register', data);
      alert(res.data.message);
      navigate('/freelancer/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Freelancer Signup</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Skills (comma-separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">LinkedIn</label>
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">GitHub</label>
          <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Profile Image</label>
          <input type="file" name="profileImage" onChange={handleChange} className="w-full" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
}
