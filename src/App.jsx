import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Modals from './components/UserModals';

import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Committee from './pages/Committee';
import BloodService from './pages/BloodService';
import Donate from './pages/Donate';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

function MainApp() {
  const [currentSection, setCurrentSection] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const { isLoading, toastMessage } = useData();

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

  // Custom Duronto GIF Loading Screen
  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '2rem'
      }}>
        <img 
          src="/loading.gif" 
          alt="Duronto Loading..." 
          style={{
            maxWidth: '300px',
            maxHeight: '300px',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(234, 88, 12, 0.15)'
          }}
        />
        <h2 style={{ marginTop: '1.75rem', color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          দুরন্ত (Duronto)
        </h2>
        <p style={{ color: 'var(--primary)', fontSize: '0.95rem', marginTop: '0.3rem', fontWeight: 700 }}>
          Help • Educate • Empower
        </p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
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
        {currentSection === 'activities' && <Activities onOpenModal={handleOpenModal} />}
        {currentSection === 'committee' && <Committee />}
        {currentSection === 'blood' && <BloodService onOpenModal={handleOpenModal} />}
        {currentSection === 'donate' && <Donate />}
        {currentSection === 'profile' && <UserProfile onNavigate={handleNavigate} />}
        {currentSection === 'admin' && <AdminDashboard onOpenModal={handleOpenModal} onNavigate={handleNavigate} />}
      </main>

      {/* Footer (Hidden in Admin Mode for Full-Screen Dashboard Experience) */}
      {currentSection !== 'admin' && (
        <Footer onNavigate={handleNavigate} onOpenModal={handleOpenModal} />
      )}

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
