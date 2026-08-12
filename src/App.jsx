import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Modals from './components/Modals';

import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Committee from './pages/Committee';
import BloodService from './pages/BloodService';
import Donate from './pages/Donate';
import AdminDashboard from './pages/AdminDashboard';

function MainApp() {
  const [currentSection, setCurrentSection] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const { toastMessage } = useData();

  // Check URL pathname for /admin or #admin on load
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path === '/admin' || path === '/admin/' || hash === '#admin') {
      setCurrentSection('admin');
    }
  }, []);

  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    if (sectionId === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (sectionId === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/#${sectionId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (modalId) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div class="toast-container">
          <div class="toast">
            <i class="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Header Navbar */}
      <Header 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
        onOpenModal={handleOpenModal} 
      />

      {/* Dynamic SPA View Router */}
      <main id="main-app-content">
        {currentSection === 'home' && <Home onNavigate={handleNavigate} onOpenModal={handleOpenModal} />}
        {currentSection === 'about' && <About />}
        {currentSection === 'activities' && <Activities />}
        {currentSection === 'committee' && <Committee />}
        {currentSection === 'blood' && <BloodService onOpenModal={handleOpenModal} />}
        {currentSection === 'donate' && <Donate />}
        {currentSection === 'admin' && <AdminDashboard onOpenModal={handleOpenModal} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenModal={handleOpenModal} />

      {/* Dialog Modals */}
      <Modals activeModal={activeModal} onClose={handleCloseModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
