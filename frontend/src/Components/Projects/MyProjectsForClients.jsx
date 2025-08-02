import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MyProjectsForClients() {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:9000/api/projects/client/${email}`)
        .then(res => setProjects(res.data))
        .catch(err => console.error('Error fetching projects:', err));
    }
  }, [email]);

  const toggleExpand = (id) => {
    setExpandedProjectId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">My Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded shadow cursor-pointer transition duration-200 hover:shadow-lg"
              onClick={() => toggleExpand(project._id)}
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p><strong>Deadline:</strong> {new Date(project.timeline.deadline).toLocaleDateString()}</p>
              <p className="text-gray-700">{project.description}</p>
              <p><strong>projectId:</strong> {project.projectId}</p>

              {expandedProjectId === project._id && (
                <div className="mt-4 text-sm text-gray-800 border-t pt-4">
                  <p><strong>Deliverables:</strong> {project.deliverables}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  {project.budget && (
                    <p><strong>Budget:</strong> ₹{project.budget}</p>
                  )}
                  {project.references && (
                    <p><strong>References:</strong> {project.references}</p>
                  )}
                  {project.ndaRequired && (
                    <p className="text-red-600"><strong>NDA Required</strong></p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
