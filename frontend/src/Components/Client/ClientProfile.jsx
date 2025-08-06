import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ClientProfile = () => {
  const location = useLocation();
  const { email } = location.state || {}; // get email from location.state
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return; // prevent API call if email is missing
      try {
        const res = await axios.get(`http://localhost:9000/api/client/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching client profile:', err);
      }
    };
    fetchProfile();
  }, [email]);

  if (!email) return <div className="text-red-500 text-center mt-6">Email not provided. Cannot load profile.</div>;
  if (!profile) return <div className="text-center mt-6">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Client Profile</h1>
      <div className="flex flex-col items-center">
        <img
          src={`http://localhost:9000/${profile.photo}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-indigo-500"
        />
        <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
        <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
        <p className="text-lg"><strong>Address:</strong> {profile.address}</p>
        <p className="text-lg">
          <strong>LinkedIn:</strong>{' '}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {profile.linkedin}
          </a>
          </p>
      </div>
    </div>
  );
};

export default ClientProfile;
