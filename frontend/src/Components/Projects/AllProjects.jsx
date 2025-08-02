import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const location = useLocation();
  const freelancerEmail = location.state?.email;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/projects/all');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const handleSendRequest = async (project) => {
    const projectId = project._id;
    const projectTitle=project.title;
    const clientEmail = project.clientEmail;
    const proposalMessage = 'I’m interested in this project.';

    if (!projectId || !freelancerEmail || !clientEmail) {
      console.error('❌ Missing required data:', { projectId, freelancerEmail, clientEmail });
      setRequestStatus({ success: false, message: 'Missing required data' });
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/project-requests/send', {
        projectTitle,
        projectId,
        freelancerEmail,
        clientEmail,
        proposalMessage,
      });

      setRequestStatus({ success: true, message: res.data.message });
    } catch (error) {
      console.error('❌ Request failed:', error.response?.data || error.message);
      setRequestStatus({
        success: false,
        message: error.response?.data?.error || 'Something went wrong',
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">All Projects</h1>

      {requestStatus && (
        <div
          className={`p-3 rounded mb-4 ${
            requestStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {requestStatus.message}
        </div>
      )}

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-gray-700 mt-1">{project.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Skills: {project.skills?.join(', ')}
              </p>
              <p className="text-sm text-gray-500">Budget: ₹{project.budget}</p>
              <p className="text-sm text-gray-500">Deadline: {project.deadline}</p>
              <p className="text-sm text-gray-500">Client: {project.clientEmail}</p>

              <button
                onClick={() => handleSendRequest(project)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
