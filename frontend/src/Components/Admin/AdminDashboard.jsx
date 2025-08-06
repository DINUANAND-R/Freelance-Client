import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserTie, FaProjectDiagram } from 'react-icons/fa';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4B0082', '#A0522D', '#CD5C5C', '#800000']; // Maroon-ish themed chart colors

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

  const navigate = useNavigate();
  const adminName = "Admin";
  const adminEmail = "admin@freelancehub.com";

  useEffect(() => {
    axios.get('http://localhost:9000/api/admin/freelancers').then(res => setFreelancers(res.data));
    axios.get('http://localhost:9000/api/admin/clients').then(res => setClients(res.data));
    axios.get('http://localhost:9000/api/admin/projects').then(res => setProjects(res.data));

    axios.get('http://localhost:9000/api/projects/all')
      .then(res => {
        const counts = { accepted: 0, denied: 0, pending: 0 };

        res.data.forEach(project => {
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
          total: res.data.length,
          ...counts
        });
      })
      .catch(err => console.error('Error fetching project data:', err));
  }, []);

  return (
    <div className="min-h-screen bg-red-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-800">FreelanceHub</h1>
          <p className="text-sm text-gray-600">
            Logged in as <strong>{adminName}</strong><br />{adminEmail}
          </p>
        </div>
        <div className="space-x-6 text-red-900 font-medium">
          <button onClick={() => navigate('/admin/client/control')}>Clients</button>
          <button onClick={() => navigate('/admin/freelancer/control')}>Freelancers</button>
          <button onClick={() => navigate('/projects')}>Projects</button>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-red-900 mb-2">Welcome, {adminName}!</h2>
        <p className="text-gray-700">Monitor the platform, manage users, and oversee ongoing projects.</p>
      </div>

      {/* Dashboard Cards */}
      <div className="flex justify-center space-x-8 px-4 mb-12 flex-wrap gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-72 text-center">
          <FaUserTie className="text-red-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800">Clients</h3>
          <p className="text-gray-600">Total: {clients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-72 text-center">
          <FaUserShield className="text-red-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800">Freelancers</h3>
          <p className="text-gray-600">Total: {freelancers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-72 text-center">
          <FaProjectDiagram className="text-red-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800">Projects</h3>
          <p className="text-gray-600">Total: {projects.length}</p>
        </div>
      </div>

      {/* Project Status Graph */}
      <div className="bg-white mx-4 mb-10 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-red-800">Project Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
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

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mb-10">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold text-red-800">{summaryStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Accepted</p>
          <p className="text-2xl font-bold text-red-600">{summaryStats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Denied</p>
          <p className="text-2xl font-bold text-red-500">{summaryStats.denied}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        <div className="flex justify-center space-x-4 mb-2">
          <a href="#" target="_blank" rel="noreferrer">
            <i className="fab fa-github text-xl"></i>
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
        </div>
        <p>© 2025 FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
