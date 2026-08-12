import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header({ currentSection, onNavigate, onOpenModal }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('jashore_theme') || 'light');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jashore_theme', next);
  };

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`nav-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <header className="navbar">
        <div className="container nav-container">
          <a className="brand-logo" onClick={() => handleNavClick('home')}>
            <div className="logo-icon">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <div className="brand-text">
              <h1>যশোর শারাপোল সংস্থা</h1>
              <p className="brand-subtext">মানবসেবা ও মানবিক উন্নয়নে নিবেদিত</p>
            </div>
          </a>

          <ul className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <li className="mobile-drawer-header">
              <div className="flex items-center gap-2">
                <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </div>
                <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>ন্যাভিগেশন মেনু</strong>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </li>

            <li>
              <a className={`nav-link ${currentSection === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                <i className="fa-solid fa-house"></i> হোম
              </a>
            </li>
            <li>
              <a className={`nav-link ${currentSection === 'about' ? 'active' : ''}`} onClick={() => handleNavClick('about')}>
                <i className="fa-solid fa-circle-info"></i> আমাদের কথা
              </a>
            </li>
            <li>
              <a className={`nav-link ${currentSection === 'activities' ? 'active' : ''}`} onClick={() => handleNavClick('activities')}>
                <i className="fa-solid fa-list-check"></i> কার্যক্রম
              </a>
            </li>
            <li>
              <a className={`nav-link ${currentSection === 'committee' ? 'active' : ''}`} onClick={() => handleNavClick('committee')}>
                <i className="fa-solid fa-users"></i> পদবী ও কমিটি
              </a>
            </li>
            <li>
              <a className={`nav-link ${currentSection === 'blood' ? 'active' : ''}`} onClick={() => handleNavClick('blood')}>
                <i className="fa-solid fa-droplet"></i> রক্তদান সেবা
              </a>
            </li>
            <li>
              <a className={`nav-link ${currentSection === 'donate' ? 'active' : ''}`} onClick={() => handleNavClick('donate')}>
                <i className="fa-solid fa-hand-holding-dollar"></i> অনুদান
              </a>
            </li>

            {/* Mobile Drawer Quick Action Buttons */}
            <li className="nav-drawer-actions">
              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '0.75rem 0' }} />
              {!user ? (
                <button className="btn btn-outline btn-sm drawer-btn" onClick={() => { onOpenModal('public-register'); setIsMobileMenuOpen(false); }}>
                  <i className="fa-solid fa-user-plus"></i> রেজিস্ট্রেশন / লগইন
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm drawer-btn" onClick={() => handleNavClick('admin')}>
                  <i className="fa-solid fa-user-check"></i> {user.name} (প্যানেল)
                </button>
              )}

              <button className="btn btn-blood btn-sm drawer-btn" onClick={() => { onOpenModal('blood-request'); setIsMobileMenuOpen(false); }}>
                <i className="fa-solid fa-circle-plus"></i> রক্তের প্রয়োজন?
              </button>

              <button className="btn btn-outline btn-sm drawer-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i className="fa-solid fa-moon"></i>}
                <span>{theme === 'dark' ? 'লাইট মোড সুইচ করুন' : 'ডার্ক মোড সুইচ করুন'}</span>
              </button>
            </li>
          </ul>

          {/* Top Navbar Action Buttons (Desktop & Mobile Compact) */}
          <div className="header-actions">
            {/* Desktop Actions */}
            <div className="desktop-actions flex items-center gap-2">
              {!user ? (
                <button className="btn btn-outline btn-sm" onClick={() => onOpenModal('public-register')}>
                  <i className="fa-solid fa-user-plus"></i> রেজিস্ট্রেশন
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={() => handleNavClick('admin')}>
                  <i className="fa-solid fa-user-check"></i> {user.name}
                </button>
              )}

              <button className="btn btn-blood btn-sm" onClick={() => onOpenModal('blood-request')}>
                <i className="fa-solid fa-circle-plus"></i> রক্তের প্রয়োজন?
              </button>
              <button className="btn btn-outline btn-sm icon-btn" onClick={toggleTheme} title="থিম পরিবর্তন">
                {theme === 'dark' ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i className="fa-solid fa-moon"></i>}
              </button>
            </div>

            {/* Mobile Actions Header */}
            <div className="mobile-actions flex items-center gap-2">
              <button className="btn btn-blood btn-sm mobile-blood-icon-btn" onClick={() => onOpenModal('blood-request')} title="রক্তের প্রয়োজন?">
                <i className="fa-solid fa-droplet"></i>
              </button>
              <button className="btn btn-outline btn-sm icon-btn" onClick={toggleTheme} title="থিম পরিবর্তন">
                {theme === 'dark' ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i className="fa-solid fa-moon"></i>}
              </button>
              <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Navigation">
                <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

