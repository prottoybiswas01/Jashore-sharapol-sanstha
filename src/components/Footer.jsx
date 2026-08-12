import React from 'react';
import { useData } from '../context/DataContext';

export default function Footer({ onNavigate, onOpenModal }) {
  const { settings } = useData();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" style={{ height: '40px', width: 'auto' }} alt="Duronto Logo" />
            <div className="brand-text">
              <h1 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800 }}>দুরন্ত (Duronto)</h1>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', margin: 0 }}>Help • Educate • Empower</p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>
            মানবসেবা, রক্তের প্রয়োজন মেটানো, শিক্ষা সহায়তা ও সামাজিক উন্নয়নে নিবেদিত একটি অরাজনৈতিক সমাজকল্যাণমূলক প্রতিষ্ঠান।
          </p>
          <div className="flex gap-2" style={{ fontSize: '1.25rem', color: '#cbd5e1' }}>
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">দ্রুত লিংক</h4>
          <ul className="footer-links">
            <li><a className="footer-link" onClick={() => onNavigate('home')}>হোম</a></li>
            <li><a className="footer-link" onClick={() => onNavigate('about')}>আমাদের কথা</a></li>
            <li><a className="footer-link" onClick={() => onNavigate('activities')}>সাম্প্রতিক কার্যক্রম</a></li>
            <li><a className="footer-link" onClick={() => onNavigate('committee')}>পদবী ও সদস্যবৃন্দ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">সেবাসমূহ</h4>
          <ul className="footer-links">
            <li><a className="footer-link" onClick={() => onNavigate('blood')}>২৪/৭ রক্তদান ডিরেক্টরি</a></li>
            <li><a className="footer-link" onClick={() => onOpenModal('blood-request')}>জরুরি রক্তের আবেদন</a></li>
            <li><a className="footer-link" onClick={() => onNavigate('donate')}>অনুদানের মাধ্যমে সহায়তা</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">যোগাযোগের ঠিকানা</h4>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i> {settings.contactAddress || 'চাঁচড়া মোড়, যশোর সদর, যশোর।'}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            <i className="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> হেল্পলাইন: {settings.contactPhone || '01711-123456'}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)' }}></i> ইমেইল: jashoresharapolsanstha@gmail.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          &copy; ২০২৬ দুরন্ত (Duronto). সর্বস্বত্ব সংরক্ষিত। | Help • Educate • Empower
        </div>
      </div>
    </footer>
  );
}

