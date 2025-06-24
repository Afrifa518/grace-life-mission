import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Sermons from '@/pages/Sermons';
import Events from '@/pages/Events';
import Ministries from '@/pages/Ministries';
import Donations from '@/pages/Donations';
import Contact from '@/pages/Contact.jsx';
import Gallery from '@/pages/Gallery.jsx';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>GraceLife Mission International - Making Diciples Of Christ</title>
        <meta name="description" content="Join GraceLife Mission International, a Christ-centered church focused on making deciples of the Christ and building a strong faith community. Experience worship, fellowship, and spiritual growth." />
      </Helmet>
      
      {!isDashboard && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {!isDashboard && <Footer />}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;