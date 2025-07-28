// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import RoleSelectionPage from './Components/RoleSelectionPage';
import ClientLogin from './Components/ClientLogin';
import ClientSignUP from './Components/ClientSignUp';
import FreelancerSignUp from './Components/FreelancerSignUp';
import FreelancerLogin from './Components/FreelancerLogin';
import AdminLogin from './Components/AdminLogin';
import ClientDashboard from './Components/ClientDashboard';
import FreelancerDashboard from './Components/FreelancerDashboard';
import FreelancersList from './Components/FreelancersList';
import Chat from './Components/Chat'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/role' element={<RoleSelectionPage/>}/>
      <Route path='/client/Login' element={<ClientLogin/>}/>
      <Route path='/client/SignUp' element={<ClientSignUP/>}/>
      <Route path='/freelancer/SignUp' element={<FreelancerSignUp/>}/>
      <Route path='/freelancer/Login' element={<FreelancerLogin/>}/>
      <Route path='/admin/Login' element={<AdminLogin/>}/>
      <Route path='/client/dashboard' element={<ClientDashboard/>}/>
      <Route path='/freelancer/dashboard' element={<FreelancerDashboard/>}/>
      <Route path='/freelancers' element={<FreelancersList/>}/>
      <Route path='/chat' element={<Chat/>}/>
    </Routes>
  );
}
