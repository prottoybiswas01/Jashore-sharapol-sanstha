import React from 'react';
import { useData } from '../context/DataContext';
import JashoreMap from '../components/JashoreMap';

export default function Home({ onNavigate, onOpenModal }) {
  const { settings, activities, bloodRequests, committee, donors, setSelectedActivity } = useData();

  const handleActivityClick = (act) => {
    setSelectedActivity(act);
    onOpenModal('view-activity');
  };

  return (
    <section class="page-section">
      {/* Top Ticker Notice */}
      <div class="top-bar">
        <div class="container">
          <div class="ticker-wrap">
            <span class="ticker-title"><i class="fa-solid fa-bullhorn"></i> জরুরি বিজ্ঞপ্তি</span>
            <div class="ticker-viewport">
              <div class="ticker-text">
                {settings.topTickerNotice}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div class="hero">
        <div class="container hero-grid">
          <div>
            <div class="hero-badge">
              <i class="fa-solid fa-location-dot"></i> {settings.heroBadgeText}
            </div>
            <h1 class="hero-title">
              {settings.heroTitleText}
            </h1>
            <p class="hero-description">
              {settings.heroDescription}
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary" onClick={() => onNavigate('blood')}>
                <i class="fa-solid fa-magnifying-glass-location"></i> রক্তদাতা খুঁজুন
              </button>
              <button class="btn btn-blood" onClick={() => onOpenModal('donor-register')}>
                <i class="fa-solid fa-heart-pulse"></i> রক্তদাতা হন
              </button>
              <button class="btn btn-outline" onClick={() => onNavigate('donate')}>
                <i class="fa-solid fa-hand-holding-heart"></i> অনুদান দিন
              </button>
            </div>
          </div>

          <div class="hero-card-preview">
            <div class="main-hero-img-card">
              <img src={settings.heroImageUrl} alt="যশোর শারাপোল সংস্থা" />
              <div class="hero-floating-badge">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-award" style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}></i>
                  <div>
                    <strong style={{ display: 'block' }}>নিবন্ধিত সেবামূলক সংস্থা</strong>
                    <small>যশোর, বাংলাদেশ</small>
                  </div>
                </div>
                <span class="badge badge-primary">সক্রিয়</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Statistics Ribbon */}
      <div class="stats-section">
        <div class="container grid grid-cols-4">
          <div class="stat-item">
            <div class="stat-number">{committee.length}</div>
            <div class="stat-label">সক্রিয় সদস্য ও কর্মকর্তা</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{donors.length}</div>
            <div class="stat-label">নিবন্ধিত রক্তদাতা</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{activities.length}</div>
            <div class="stat-label">সম্পন্নকৃত সেবা প্রকল্প</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{activities.length * 150}</div>
            <div class="stat-label">উপকৃত সামাজিক পরিবার</div>
          </div>
        </div>
      </div>

      {/* Emergency Blood Requests Preview */}
      <div class="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 class="section-title" style={{ fontSize: '1.6rem' }}><i class="fa-solid fa-truck-medical" style={{ color: 'var(--blood-red)' }}></i> জরুরি রক্তের আবেদন</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>জরুরি মুহূর্তে রোগীদের রক্তদানে এগিয়ে আসুন</p>
          </div>
          <button class="btn btn-outline btn-sm" onClick={() => onNavigate('blood')}>সবগুলো দেখুন <i class="fa-solid fa-arrow-right"></i></button>
        </div>

        {bloodRequests.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            বর্তমানে কোনো জরুরি রক্তের আবেদন নেই। ওয়েবসাইট অথবা এডমিন প্যানেল থেকে রক্তের আবেদন পোস্ট করা যাবে।
          </div>
        ) : (
          bloodRequests.slice(0, 2).map(r => (
            <div class="request-card" key={r.id || r._id}>
              <div class="flex items-center gap-3">
                <div class="blood-badge-large">{r.bloodGroup}</div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{r.patientName} ({r.bagsNeeded || 1} ব্যাগ)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <i class="fa-solid fa-hospital" style={{ color: 'var(--blood-red)' }}></i> {r.hospital}
                  </p>
                  <small style={{ color: 'var(--text-muted)' }}>{r.details}</small>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a href={`tel:${r.contact}`} class="btn btn-blood btn-sm">
                  <i class="fa-solid fa-phone-volume"></i> {r.contact}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Activities Highlights (Click Card Opens Full Details & Video Popup) */}
      <div class="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <div class="section-header">
          <div class="section-subtitle">আমাদের কাজ</div>
          <h2 class="section-title">সাম্প্রতিক সামাজিক কার্যক্রম</h2>
        </div>
        {activities.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '3rem 2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <i class="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}></i>
            বর্তমানে কোনো সামাজিক কাজের পোস্ট নেই। এডমিন প্যানেল থেকে ছবি ও ভিডিও লিংক সরাসরি আপলোড করে প্রথম পোস্ট প্রকাশ করুন।
          </div>
        ) : (
          <div class="grid grid-cols-3 gap-3">
            {activities.slice(0, 3).map(act => (
              <div class="activity-card" key={act.id || act._id} onClick={() => handleActivityClick(act)}>
                <div class="activity-img-wrap">
                  <img src={act.image} alt={act.title} class="activity-img" />
                </div>
                <div class="activity-body">
                  <div class="activity-date">
                    <i class="fa-regular fa-calendar-days"></i> {act.date} &bull; <i class="fa-solid fa-location-dot"></i> {act.location}
                  </div>
                  <h3 class="activity-title">{act.title}</h3>
                  <p class="activity-desc">{act.description}</p>
                  <div class="flex justify-between items-center" style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                    <span class="badge badge-primary">{act.category}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      <i class="fa-solid fa-heart" style={{ color: 'var(--blood-red)' }}></i> {act.likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activities.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button class="btn btn-primary" onClick={() => onNavigate('activities')}>সকল কার্যক্রম ও ফটো গ্যালারি <i class="fa-solid fa-images"></i></button>
          </div>
        )}
      </div>

      {/* Interactive Map Section */}
      <div class="container">
        <JashoreMap />
      </div>
    </section>
  );
}
