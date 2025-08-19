import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield, FaUserTie, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1E88E5', '#43A047', '#FFB300']; // Blue, Green, Orange

export default function AdminDashboard() {
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    accepted: 0,
    denied: 0,
    pending: 0,
  });

  const location = useLocation();
  const { email } = location.state || { email: 'admin@example.com' };
  const navigate = useNavigate();
  const adminName = "Admin";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [freelancersRes, clientsRes, projectsRes, allProjectsRes] = await Promise.all([
          axios.get('https://freelance-client-3029.onrender.com/api/admin/freelancers'),
          axios.get('https://freelance-client-3029.onrender.com/api/admin/clients'),
          axios.get('https://freelance-client-3029.onrender.com/api/admin/projects'),
          axios.get('https://freelance-client-3029.onrender.com/api/projects/all')
        ]);

        setFreelancers(freelancersRes.data);
        setClients(clientsRes.data);
        setProjects(projectsRes.data);

        const counts = { accepted: 0, denied: 0, pending: 0 };
        allProjectsRes.data.forEach(project => {
          const status = project.status?.toLowerCase();
          if (status === 'accepted') counts.accepted++;
          else if (status === 'denied') counts.denied++;
          else counts.pending++;
        });

        const formattedData = [
          { name: 'Accepted', value: counts.accepted },
          { name: 'Denied', value: counts.denied },
          { name: 'Pending', value: counts.pending },
        ];

        setProjectStatusData(formattedData);
        setSummaryStats({
          total: allProjectsRes.data.length,
          ...counts
        });

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* New Navigation Bar */}
      <nav className="bg-white shadow-md p-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-extrabold text-gray-800 transition-colors duration-300 hover:text-indigo-600 cursor-pointer">
            FreelanceHub
          </h1>
          <div className="text-sm text-gray-500">
            Welcome, <strong className="text-indigo-600">{adminName}</strong>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate('/admin/client/control', { state: { email } })}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Clients
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
          <button
            onClick={() => navigate('/admin/freelancer/control', { state: { email } })}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Freelancers
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
          <button
            onClick={() => navigate('/admin/projects', { state: { email } })}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 relative group"
          >
            Projects
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-gray-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-lg text-gray-600 mt-2">Monitor the platform, manage users, and oversee ongoing projects at a glance.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <FaUserTie className="text-indigo-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800 text-center">Clients</h3>
            <p className="text-gray-500 text-lg text-center mt-2">Total: <span className="font-extrabold text-indigo-600 text-3xl">{clients.length}</span></p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <FaUserShield className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800 text-center">Freelancers</h3>
            <p className="text-gray-500 text-lg text-center mt-2">Total: <span className="font-extrabold text-green-600 text-3xl">{freelancers.length}</span></p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <FaTasks className="text-yellow-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800 text-center">Projects</h3>
            <p className="text-gray-500 text-lg text-center mt-2">Total: <span className="font-extrabold text-yellow-600 text-3xl">{projects.length}</span></p>
          </div>
        </div>

        {/* Project Status Graph & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Project Status Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300 border-l-4 border-indigo-500">
              <p className="text-gray-500 font-medium">Total Projects</p>
              <p className="text-4xl font-extrabold text-indigo-700 mt-2">{summaryStats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300 border-l-4 border-green-500">
              <p className="text-gray-500 font-medium">Accepted</p>
              <p className="text-4xl font-extrabold text-green-600 mt-2">{summaryStats.accepted}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300 border-l-4 border-red-500">
              <p className="text-gray-500 font-medium">Denied</p>
              <p className="text-4xl font-extrabold text-red-600 mt-2">{summaryStats.denied}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300 border-l-4 border-yellow-500">
              <p className="text-gray-500 font-medium">Pending</p>
              <p className="text-4xl font-extrabold text-yellow-600 mt-2">{summaryStats.pending}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        <div className="flex justify-center space-x-4 mb-2">
          {/* Social media icons here */}
        </div>
        <p>© 2025 FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
}