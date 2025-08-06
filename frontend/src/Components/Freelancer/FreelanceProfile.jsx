import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const FreelancerProfile = () => {
  const location = useLocation();
  const { email } = location.state || {};  // Getting email from navigation state

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!email) return; // Prevent fetch if email is missing

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/freelancers/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching freelancer profile:', err);
      }
    };

    fetchProfile();
  }, [email]);

  if (!email) return <div className="text-red-600 text-center mt-10">No freelancer email provided</div>;
  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Freelancer Profile</h1>
      <div className="flex flex-col items-center">
        <img
          src={`http://localhost:9000/uploads/freelancers/${profile.profileImage}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border mb-4"
        />
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
        <p><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-500">{profile.linkedin}</a></p>
        <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noreferrer" className="text-blue-500">{profile.github}</a></p>
      </div>
    </div>
  );
};

export default FreelancerProfile;
