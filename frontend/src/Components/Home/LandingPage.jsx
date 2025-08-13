import React, { useState, useEffect } from 'react';
import {useNavigate,Link} from 'react-router-dom';
// A single, self-contained App component to contain the landing page
export default function LandingPage() {

  // Custom SVG icons for the features section and footer, replacing emojis and placeholder images
  // These are inline SVGs to keep the application self-contained
  const LucideSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  );

  const LucideMessageSquare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const LucideShieldCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <path d="M20 13c0 5-2.5 7-5 8-2.5-1-5-3-5-8V5l5-2 5 2z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  );
  
  const LucideZap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );

  const LucideDollarSign = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <path d="M12 1h12"></path>
      <path d="M12 23h12"></path>
      <path d="M12 14v-4.5H5.8"></path>
      <path d="M16.2 10H20V6.5L16.2 10"></path>
      <path d="M16.2 14H20v4.5L16.2 14"></path>
      <path d="M12 12V8.5H5.8"></path>
    </svg>
  );

  const LucideAward = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.4 12.4 17 22l-5-2-5 2 1.6-9.6"></path>
    </svg>
  );

  const LucideCheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-8.15"></path>
      <path d="m9 11 3 3L22 4"></path>
    </svg>
  );

  const LucideLifeBuoy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="m4.93 4.93 4.24 4.24"></path>
      <path d="m14.83 14.83 4.24 4.24"></path>
      <path d="m14.83 9.17 4.24-4.24"></path>
      <path d="m4.93 19.07 4.24-4.24"></path>
    </svg>
  );

  const LucideUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-teal-600">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  // Social media icons
  const LucideGlobe = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  );
  
  const LucideTwitter = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M22 4s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2zM22 12s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2zM22 20s-4.32 2.67-6 4-6 2-6 2s-6-2-6-2v-4s4.32 2.67 6 4 6 2 6 2z"></path>
    </svg>
  );

  const LucideFacebook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );

  const LucideInstagram = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"></line>
    </svg>
  );

  // Define the features data with Lucide icons
  const features = [
    {
      title: 'Smart Matching',
      desc: 'Our AI-powered algorithm matches freelancers with projects based on skills, experience, and preferences.',
      icon: <LucideSearch />,
    },
    {
      title: 'Real-time Chat',
      desc: 'Communicate instantly with clients and freelancers through our integrated messaging system.',
      icon: <LucideMessageSquare />,
    },
    {
      title: 'Secure Payments',
      desc: 'Safe and secure payment processing with escrow protection for both parties.',
      icon: <LucideShieldCheck />,
    },
    {
      title: 'Fast Delivery',
      desc: 'Get your projects completed quickly with our network of experienced professionals.',
      icon: <LucideZap />,
    },
    {
      title: 'Fair Pricing',
      desc: 'Competitive rates and transparent pricing with no hidden fees.',
      icon: <LucideDollarSign />,
    },
    {
      title: 'Verified Profiles',
      desc: 'All freelancers go through a verification process to ensure quality and reliability.',
      icon: <LucideCheckCircle />,
    },
    {
      title: 'Quality Guarantee',
      desc: "100% satisfaction guarantee with unlimited revisions until you're happy.",
      icon: <LucideAward />,
    },
    {
      title: '24/7 Support',
      desc: 'Round-the-clock customer support to help you whenever you need assistance.',
      icon: <LucideLifeBuoy />,
    },
  ];

  // State to handle the navigation bar's background on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen font-inter antialiased bg-slate-50 text-slate-800">

      {/* Navbar with subtle transparency and shadow on scroll */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <nav className="flex items-center justify-between px-6 py-4 md:px-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-teal-600">
            Freelance<span className="text-slate-900">Connect</span>
          </h1>

          <div className="flex items-center space-x-4 md:space-x-8">
            <a href="/about" className="text-slate-600 hover:text-teal-600 font-medium text-lg transition-colors duration-200">About</a>
            <a href="/contact" className="text-slate-600 hover:text-teal-600 font-medium text-lg transition-colors duration-200">Contact</a>
            <Link to={'/role'}>
            <button
              className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-transform duration-300 transform hover:scale-105 shadow-md"
            >
              Get Started
            </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-24 md:py-40 bg-gradient-to-br from-teal-50 to-orange-50 overflow-hidden">
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-200 opacity-20 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-200 opacity-20 rounded-full blur-3xl transform translate-y-1/2 -translate-x-1/2"></div>

        {/* Left Content */}
        <div className="relative z-10 md:w-1/2 text-center md:text-left space-y-8 mt-12 md:mt-0">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Connect with <span className="text-teal-600">Top Freelancers</span> Worldwide
          </h2>

          <p className="text-slate-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
            Join thousands of businesses and freelancers building amazing projects together. Find the perfect match for your next project or discover your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => console.log('Start Your Journey clicked')}
              className="bg-teal-600 text-white font-semibold px-8 py-4 rounded-md hover:bg-teal-700 transition-transform duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Your Journey →
            </button>
            <button
              onClick={() => console.log('Browse Projects clicked')}
              className="border-2 border-teal-600 text-teal-600 font-semibold px-8 py-4 rounded-md hover:bg-teal-50 transition-colors duration-200"
            >
              Browse Projects
            </button>
          </div>
        </div>

        {/* Right Image/Placeholder */}
        <div className="relative md:w-1/2 flex justify-center items-center">
            {/* Using a placeholder for an image to ensure the code is self-contained and runnable */}
            <img 
                src="https://placehold.co/800x600/2dd4bf/ffffff?text=FreelanceConnect" 
                alt="Freelancers working on a project" 
                className="rounded-3xl shadow-2xl w-full max-w-lg transform hover:scale-105 transition-transform duration-300"
            />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-semibold uppercase tracking-widest">Our Advantages</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Why Choose <span className="text-teal-600">FreelanceConnect</span>?
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">
            Experience the future of freelancing with our comprehensive platform designed for success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-slate-50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
            >
              <div className="text-teal-600 mb-4 transition-colors duration-300 group-hover:text-teal-700">{item.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Call to Action Section */}
      <section className="bg-teal-600 text-white px-6 md:px-20 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Ready to get started?</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Join our community of talented freelancers and clients today and find your perfect match.
        </p>
        <button
          onClick={() => console.log('Join Now clicked')}
          className="bg-white text-teal-600 font-bold px-10 py-4 rounded-full shadow-lg hover:bg-slate-100 transition-transform duration-300 transform hover:scale-105"
        >
          Join FreelanceConnect
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 px-6 md:px-20 py-12 mt-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Freelance<span className="text-teal-400">Connect</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering freelancers and clients to build, grow, and succeed together.
            </p>
          </div>

          {/* Link Groups */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Services</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Hire Talent</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Post a Job</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Find Freelancers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Support</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Terms of Use</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4 text-xl mt-1">
                <a href="#" className="hover:text-teal-400 transition-colors duration-200" aria-label="Social Media Link"><LucideGlobe/></a>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200" aria-label="Social Media Link"><LucideTwitter/></a>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200" aria-label="Social Media Link"><LucideFacebook/></a>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200" aria-label="Social Media Link"><LucideInstagram/></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} FreelanceConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
