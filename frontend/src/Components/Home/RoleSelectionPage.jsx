import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 bg-white border border-gray-300 px-5 py-3 rounded-full text-lg shadow-md hover:bg-gray-200 transition"
      >
        ← Back
      </button>

      <div className="flex items-center justify-center h-full mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl">
          {/* Client Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition hover:scale-105 hover:shadow-2xl min-h-[460px] flex flex-col justify-center">
            <img
              src="/images/client.png"
              alt="Client Illustration"
              className="mx-auto mb-4 w-32 h-32 object-contain"
            />
            <h2 className="text-3xl font-bold text-green-700 mb-3">For Clients</h2>
            <p className="text-gray-600 mb-6">
              Post your projects and hire from a global pool of skilled freelancers.
              Manage timelines, payments, and collaborate effectively.
            </p>
            <Link
              to="/client/Login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
            >
              Login as Client
            </Link>
          </div>

          {/* Freelancer Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition hover:scale-105 hover:shadow-2xl min-h-[460px] flex flex-col justify-center">
            <img
              src="/images/freelancer.png"
              alt="Freelancer Illustration"
              className="mx-auto mb-4 w-32 h-32 object-contain"
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">For Freelancers</h2>
            <p className="text-gray-600 mb-6">
              Find freelance jobs, build your portfolio, and earn from anywhere.
              Join our professional network today.
            </p>
            <Link
              to="/freelancer/Login"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
            >
              Login as Freelancer
            </Link>
          </div>

          {/* Admin Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition hover:scale-105 hover:shadow-2xl min-h-[460px] flex flex-col justify-center">
            <img
              src="/images/admin.png"
              alt="Admin Illustration"
              className="mx-auto mb-4 w-32 h-32 object-contain"
            />
            <h2 className="text-3xl font-bold text-blue-700 mb-3">For Admins</h2>
            <p className="text-gray-600 mb-6">
              Manage platform users, monitor activity, and maintain system integrity
              with powerful tools.
            </p>
            <Link
              to="/admin/Login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
            >
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
