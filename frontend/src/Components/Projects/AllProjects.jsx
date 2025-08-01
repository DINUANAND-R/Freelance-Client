import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Optional: for expand icon

export default function AllProjects({ freelancerEmail }) {
  const [projects, setProjects] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:9000/api/projects/all')
      .then(res => setProjects(res.data))
      .catch(err => console.error('❌ Error fetching projects:', err));
  }, []);

  const sendRequest = async (projectId) => {
    try {
      const res = await axios.post('http://localhost:9000/api/project-requests/send', {
        projectId,
        freelancerEmail,
        proposalMessage: 'I am interested in this project.'
      });
      setRequestStatus({ success: true, message: res.data.message });
    } catch (error) {
      setRequestStatus({ success: false, message: error.response?.data?.error || 'Request failed' });
    }
  };

  const toggleExpand = (id) => {
    setExpandedProjectId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100 font-sans">
      <button
        className="mb-6 text-sm text-blue-600 hover:underline"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore Available Projects</h2>

      {projects.filter(p => p.status === 'pending').map(project => (
        <div
          key={project._id}
          className="bg-white shadow-md rounded-lg p-6 mb-5 transition duration-200 hover:shadow-lg cursor-pointer"
          onClick={() => toggleExpand(project._id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
              <p className="text-gray-600"><strong>Client:</strong> {project.clientName}</p>
              <p className="text-gray-600"><strong>Budget:</strong> ₹{project.budget}</p>
              <p className="text-gray-600"><strong>Deadline:</strong> {new Date(project.timeline.deadline).toLocaleDateString()}</p>
            </div>
            <div className="text-gray-500">
              {expandedProjectId === project._id ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>

          {expandedProjectId === project._id && (
            <div className="mt-4 border-t pt-4 text-gray-700 space-y-2">
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Deliverables:</strong> {project.deliverables}</p>
              <p><strong>References:</strong> {project.references || 'N/A'}</p>
              <p><strong>NDA Required:</strong> {project.ndaRequired ? 'Yes' : 'No'}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendRequest(project._id);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
              >
                Send Request
              </button>
            </div>
          )}
        </div>
      ))}

      {requestStatus && (
        <div
          className={`mt-4 p-4 rounded-md ${
            requestStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {requestStatus.message}
        </div>
      )}
    </div>
  );
}
