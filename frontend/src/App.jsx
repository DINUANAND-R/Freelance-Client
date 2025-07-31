// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ChatComponent from './Components/Chating/ChatComponent';

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
      <Route path='/freelancer/dashboard' element={<FreelancerDashboar/>}/>
      <Route path='/freelancers' element={<FreelancersList/>}/>
      <Route path='/chat' element={<Chat/>}/>
    </Routes>
  );
}
