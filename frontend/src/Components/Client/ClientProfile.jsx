import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { FaLinkedin, FaArrowLeft } from 'react-icons/fa';

const ClientProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [profile, setProfile] = useState(null);
  const [months, setMonths] = useState([]);
  const [loginDates, setLoginDates] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:9000/api/client/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching client profile:', err);
      }
    };

    const fetchLoginDates = async () => {
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:9000/api/client/login-activity/${email}`);
        setLoginDates(res.data.map(date => new Date(date)));
      } catch (err) {
        console.error('Error fetching login dates:', err);
      }
    };

    fetchProfile();
    fetchLoginDates();
  }, [email]);

  useEffect(() => {
    const generateMonths = () => {
      const now = new Date();
      const monthsArray = [];
      for (let i = 2; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });
        monthsArray.push({ month: format(monthDate, 'MMMM yyyy'), days });
      }
      setMonths(monthsArray);
    };
    generateMonths();
  }, []);

  const isActive = date => loginDates.some(activeDate => isSameDay(date, activeDate));

  if (!email) return <div className="text-red-500 text-center mt-6">Email not provided. Cannot load profile.</div>;
  if (!profile) return <div className="text-center mt-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-white text-green-900 p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center border border-green-500 text-green-700 px-4 py-2 rounded hover:bg-green-100 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto p-6 border border-green-300 rounded-lg shadow-lg bg-peach-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-green-700">Client Profile</h1>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-500"
            >
              <FaLinkedin size={30} />
            </a>
          )}
        </div>
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:9000/${profile.photo}`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-peach"
          />
          <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
          <p className="text-lg"><strong>Email:</strong> {profile.email}</p>
          <p className="text-lg"><strong>Address:</strong> {profile.address}</p>
        </div>
      </div>

      {/* Login Calendar */}
      <div className="max-w-6xl mx-auto mt-10 p-6 border border-green-300 rounded-lg shadow-lg bg-peach-50">
        <h2 className="text-2xl font-semibold mb-4 text-center text-green-700">Login Calendar</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {months.map(({ month, days }, idx) => (
            <div key={idx} className="bg-white border border-green-200 rounded-lg p-4 w-full sm:w-[300px] shadow-md">
              <h3 className="text-xl font-bold mb-3 text-center text-green-700">{month}</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="font-semibold text-green-600">{day}</div>
                ))}
                {days.map((day, i) => (
                  <div
                    key={i}
                    className={`relative h-8 w-8 flex items-center justify-center rounded-md cursor-pointer 
                      ${isActive(day)
                        ? 'bg-green-500 text-white'
                        : 'bg-peach text-green-800 hover:bg-green-100'}`}
                    title={`${format(day, 'eeee, MMM d')} - ${isActive(day) ? 'Active' : 'Inactive'}`}
                  >
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
