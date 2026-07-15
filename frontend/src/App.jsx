// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute';
import { getUser } from './utils/auth';

import FreelancersList from './Components/Freelancer/FreelancersList';
import FreelancerDashboar from './Components/Freelancer/FreelancerDashboard';
import ClientDashboard from './Components/Client/ClientDashboard';
import AdminLogin from './Components/Home/AdminLogin';
import ClientSignUP from './Components/Client/ClientSignUp';
import FreelancerLogin from './Components/Freelancer/FreelancerLogin';
import FreelancerSignUp from './Components/Freelancer/FreelancerSignUp';
import ClientLogin from './Components/Client/ClientLogin';
import RoleSelectionPage from './Components/Home/RoleSelectionPage';
import LandingPage from './Components/Home/LandingPage';
import Chat from './Components/Chating/Chat';
import ClientsList from './Components/Client/ClientsList';
import ClientProject from './Components/Projects/ClientProjects';
import About from './Components/Home/About';
import Contact from './Components/Home/Contact';
import AllProjects from './Components/Projects/AllProjects';
import ClientRequestPage from './Components/Projects/ClientRequestPage';
import MyProjectsForClients from './Components/Projects/MyProjectsForClients';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminFreelancerControl from './Components/Admin/AdminFreelancerControl';
import ClientProfile from './Components/Client/ClientProfile';
import FreelancerProfile from './Components/Freelancer/FreelanceProfile';
import RecentChats from './Components/Chating/RecentChats';
import FreelancerPost from './Components/Freelancer/FreelancerPost';
import AdminAllProjects from './Components/Admin/AdminAllProjects';
import AdminClientControl from './Components/Admin/AdminClientControl';
import MyProjects from './Components/Freelancer/MyProjects';
import FreelancerProfileToClient from './Components/Client/FreelancerProfileToView';
import ClientProfile2 from './Components/Client/ClientProfile2';
import PostJob from './Components/Client/PostJob';
import JobPostForm from './Components/Client/JobPostForm';
import JobRequest from './Components/Freelancer/JobRequest';
import JobsAvailable from './Components/Freelancer/JobsAvailable';
import JobRequestForClient from './Components/Client/JobRequestForClient';

// Helper: wrap a component in PrivateRoute with a given role
const Private = ({ role, element }) => (
  <PrivateRoute role={role}>{element}</PrivateRoute>
);

// RecentChats needs the current user's email — read it from localStorage
function RecentChatsWrapper() {
  const user = getUser();
  return <RecentChats currentUserEmail={user?.email || ''} />;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ──────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/role" element={<RoleSelectionPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth pages (case-insensitive aliases) */}
      <Route path="/client/login"      element={<ClientLogin />} />
      <Route path="/client/Login"      element={<ClientLogin />} />
      <Route path="/client/signup"     element={<ClientSignUP />} />
      <Route path="/client/SignUp"     element={<ClientSignUP />} />
      <Route path="/freelancer/login"  element={<FreelancerLogin />} />
      <Route path="/freelancer/Login"  element={<FreelancerLogin />} />
      <Route path="/freelancer/SignUp" element={<FreelancerSignUp />} />
      <Route path="/admin/login"       element={<AdminLogin />} />
      <Route path="/admin/Login"       element={<AdminLogin />} />

      {/* Public browsing */}
      <Route path="/freelancers"       element={<FreelancersList />} />
      <Route path="/clients"           element={<ClientsList />} />
      <Route path="/allProjects"       element={<AllProjects />} />
      <Route path="/profile/freelancer" element={<FreelancerProfileToClient />} />

      {/* ── Freelancer protected routes ─────────────────── */}
      <Route path="/freelancer/dashboard"    element={<Private role="freelancer" element={<FreelancerDashboar />} />} />
      <Route path="/freelancer/profile"      element={<Private role="freelancer" element={<FreelancerProfile />} />} />
      <Route path="/freelancer/post"         element={<Private role="freelancer" element={<FreelancerPost />} />} />
      <Route path="/freelancer/myprojects"   element={<Private role="freelancer" element={<MyProjects />} />} />
      <Route path="/freelancer/jobs"         element={<Private role="freelancer" element={<JobsAvailable />} />} />
      <Route path="/freelancer/jobRequest"   element={<Private role="freelancer" element={<JobRequest />} />} />
      <Route path="/freelancer/clientProfile" element={<Private role="freelancer" element={<ClientProfile2 />} />} />

      {/* ── Client protected routes ─────────────────────── */}
      <Route path="/client/dashboard"       element={<Private role="client" element={<ClientDashboard />} />} />
      <Route path="/client/project-request" element={<Private role="client" element={<ClientProject />} />} />
      <Route path="/client/myProjects"      element={<Private role="client" element={<MyProjectsForClients />} />} />
      <Route path="/client/profile"         element={<Private role="client" element={<ClientProfile />} />} />
      <Route path="/client/postjob"         element={<Private role="client" element={<PostJob />} />} />
      <Route path="/client/jobpostform"     element={<Private role="client" element={<JobPostForm />} />} />
      <Route path="/client/jobRequests"     element={<Private role="client" element={<JobRequestForClient />} />} />
      <Route path="/requestForClient"       element={<Private role="client" element={<ClientRequestPage />} />} />

      {/* ── Admin protected routes ───────────────────────── */}
      <Route path="/admin/dashboard"          element={<Private role="admin" element={<AdminDashboard />} />} />
      <Route path="/admin/freelancer/control" element={<Private role="admin" element={<AdminFreelancerControl />} />} />
      <Route path="/admin/client/control"     element={<Private role="admin" element={<AdminClientControl />} />} />
      <Route path="/admin/projects"           element={<Private role="admin" element={<AdminAllProjects />} />} />

      {/* ── Shared authenticated routes ──────────────────── */}
      <Route path="/chat"        element={<Private role={null} element={<Chat />} />} />
      <Route path="/chat/recent" element={<Private role={null} element={<RecentChatsWrapper />} />} />
    </Routes>
  );
}
