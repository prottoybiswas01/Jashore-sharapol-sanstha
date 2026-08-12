import React from 'react';
import { useData } from '../context/DataContext';

export default function Footer({ onNavigate, onOpenModal }) {
  const { settings } = useData();

  return (
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <div class="brand-logo" style={{ marginBottom: '1rem' }}>
            <div class="logo-icon" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
              <i class="fa-solid fa-hand-holding-heart"></i>
            </div>
            <div class="brand-text">
              <h1 style={{ color: 'white', fontSize: '1.2rem' }}>যশোর শারাপোল সংস্থা</h1>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
            যশোর জেলার মানুষের সেবায় নিবেদিত প্রাণ একটি অরাজনৈতিক জনকল্যাণমূলক সমাজসেবা সংস্থা।
          </p>
          <div class="flex gap-2" style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>
            <a href="#"><i class="fa-brands fa-facebook"></i></a>
            <a href="#"><i class="fa-brands fa-youtube"></i></a>
            <a href="#"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div>
          <h4 class="footer-title">দ্রুত লিংক</h4>
          <ul class="footer-links">
            <li><a class="footer-link" onClick={() => onNavigate('home')}>হোম</a></li>
            <li><a class="footer-link" onClick={() => onNavigate('about')}>আমাদের কথা</a></li>
            <li><a class="footer-link" onClick={() => onNavigate('activities')}>সাম্প্রতিক কার্যক্রম</a></li>
            <li><a class="footer-link" onClick={() => onNavigate('committee')}>পদবী ও সদস্যবৃন্দ</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">সেবাসমূহ</h4>
          <ul class="footer-links">
            <li><a class="footer-link" onClick={() => onNavigate('blood')}>২৪/৭ রক্তদান ডিরেক্টরি</a></li>
            <li><a class="footer-link" onClick={() => onOpenModal('blood-request')}>জরুরি রক্তের আবেদন</a></li>
            <li><a class="footer-link" onClick={() => onNavigate('donate')}>অনুদানের মাধ্যমে সহায়তা</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">যোগাযোগের ঠিকানা</h4>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            <i class="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i> {settings.contactAddress}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            <i class="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> হেল্পলাইন: {settings.contactPhone}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            <i class="fa-solid fa-envelope" style={{ color: 'var(--primary)' }}></i> ইমেইল: {settings.contactEmail}
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          &copy; ২০২৬ যশোর শারাপোল সংস্থা (Jashore Sharapol Sanstha). সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
