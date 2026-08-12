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
    <header class="navbar">
      <div class="container nav-container">
        <a class="brand-logo" onClick={() => handleNavClick('home')}>
          <div class="logo-icon">
            <i class="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div class="brand-text">
            <h1>যশোর শারাপোল সংস্থা</h1>
            <p>মানবসেবা ও মানবিক উন্নয়নে নিবেদিত</p>
          </div>
        </a>

        <ul class={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <li>
            <a class={`nav-link ${currentSection === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
              <i class="fa-solid fa-house"></i> হোম
            </a>
          </li>
          <li>
            <a class={`nav-link ${currentSection === 'about' ? 'active' : ''}`} onClick={() => handleNavClick('about')}>
              <i class="fa-solid fa-circle-info"></i> আমাদের কথা
            </a>
          </li>
          <li>
            <a class={`nav-link ${currentSection === 'activities' ? 'active' : ''}`} onClick={() => handleNavClick('activities')}>
              <i class="fa-solid fa-list-check"></i> কার্যক্রম
            </a>
          </li>
          <li>
            <a class={`nav-link ${currentSection === 'committee' ? 'active' : ''}`} onClick={() => handleNavClick('committee')}>
              <i class="fa-solid fa-users"></i> পদবী ও কমিটি
            </a>
          </li>
          <li>
            <a class={`nav-link ${currentSection === 'blood' ? 'active' : ''}`} onClick={() => handleNavClick('blood')}>
              <i class="fa-solid fa-droplet"></i> রক্তদান সেবা
            </a>
          </li>
          <li>
            <a class={`nav-link ${currentSection === 'donate' ? 'active' : ''}`} onClick={() => handleNavClick('donate')}>
              <i class="fa-solid fa-hand-holding-dollar"></i> অনুদান
            </a>
          </li>
        </ul>

        <div class="flex items-center gap-2">
          {!user ? (
            <button class="btn btn-outline btn-sm" onClick={() => onOpenModal('public-register')}>
              <i class="fa-solid fa-user-plus"></i> রেজিস্ট্রেশন
            </button>
          ) : (
            <button class="btn btn-secondary btn-sm" onClick={() => handleNavClick('admin')}>
              <i class="fa-solid fa-user-check"></i> {user.name}
            </button>
          )}

          <button class="btn btn-blood btn-sm" onClick={() => onOpenModal('blood-request')}>
            <i class="fa-solid fa-circle-plus"></i> রক্তের প্রয়োজন?
          </button>
          <button class="btn btn-outline btn-sm" onClick={toggleTheme} title="থিম পরিবর্তন">
            {theme === 'dark' ? <i class="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i class="fa-solid fa-moon"></i>}
          </button>
          <button class="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
