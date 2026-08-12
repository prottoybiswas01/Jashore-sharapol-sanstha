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
    <section className="page-section">
      {/* Top Ticker Notice */}
      <div className="top-bar">
        <div className="container">
          <div className="ticker-wrap">
            <span className="ticker-title"><i className="fa-solid fa-bullhorn"></i> জরুরি বিজ্ঞপ্তি</span>
            <div className="ticker-viewport">
              <div className="ticker-text">
                {settings.topTickerNotice}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <i className="fa-solid fa-location-dot"></i> {settings.heroBadgeText}
            </div>
            <h1 className="hero-title">
              {settings.heroTitleText}
            </h1>
            <p className="hero-description">
              {settings.heroDescription}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('blood')}>
                <i className="fa-solid fa-magnifying-glass-location"></i> রক্তদাতা খুঁজুন
              </button>
              <button className="btn btn-blood" onClick={() => onOpenModal('donor-register')}>
                <i className="fa-solid fa-heart-pulse"></i> রক্তদাতা হন
              </button>
              <button className="btn btn-outline" onClick={() => onNavigate('donate')}>
                <i className="fa-solid fa-hand-holding-heart"></i> অনুদান দিন
              </button>
            </div>
          </div>

          <div className="hero-card-preview">
            <div className="main-hero-img-card">
              <img src={settings.heroImageUrl} alt="যশোর শারাপোল সংস্থা" />
              <div className="hero-floating-badge">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-award" style={{ color: 'var(--accent-gold)', fontSize: '1.4rem' }}></i>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>নিবন্ধিত সেবামূলক সংস্থা</strong>
                    <small style={{ fontSize: '0.75rem' }}>যশোর, বাংলাদেশ</small>
                  </div>
                </div>
                <span className="badge badge-primary">সক্রিয়</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Statistics Ribbon */}
      <div className="stats-section">
        <div className="container grid grid-cols-4">
          <div className="stat-item">
            <div className="stat-number">{committee.length}</div>
            <div className="stat-label">সক্রিয় সদস্য ও কর্মকর্তা</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{donors.length}</div>
            <div className="stat-label">নিবন্ধিত রক্তদাতা</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{activities.length}</div>
            <div className="stat-label">সম্পন্নকৃত সেবা প্রকল্প</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{activities.length * 150}</div>
            <div className="stat-label">উপকৃত সামাজিক পরিবার</div>
          </div>
        </div>
      </div>

      {/* Emergency Blood Requests Preview */}
      <div className="container" style={{ padding: '3rem 1.25rem 2rem' }}>
        <div className="flex justify-between items-center flex-wrap gap-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
              <i className="fa-solid fa-truck-medical" style={{ color: 'var(--blood-red)' }}></i> জরুরি রক্তের আবেদন
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>জরুরি মুহূর্তে রোগীদের রক্তদানে এগিয়ে আসুন</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('blood')}>
            সবগুলো দেখুন <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {bloodRequests.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            বর্তমানে কোনো জরুরি রক্তের আবেদন নেই। ওয়েবসাইট অথবা এডমিন প্যানেল থেকে রক্তের আবেদন পোস্ট করা যাবে।
          </div>
        ) : (
          bloodRequests.slice(0, 2).map(r => (
            <div className="request-card" key={r.id || r._id}>
              <div className="flex items-center gap-3">
                <div className="blood-badge-large">{r.bloodGroup}</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{r.patientName} ({r.bagsNeeded || 1} ব্যাগ)</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-hospital" style={{ color: 'var(--blood-red)' }}></i> {r.hospital}
                  </p>
                  <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>{r.details}</small>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${r.contact}`} className="btn btn-blood btn-sm">
                  <i className="fa-solid fa-phone-volume"></i> {r.contact}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Activities Highlights (Click Card Opens Full Details & Video Popup) */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem' }}>
        <div className="section-header">
          <div className="section-subtitle">আমাদের কাজ</div>
          <h2 className="section-title">সাম্প্রতিক সামাজিক কার্যক্রম</h2>
        </div>
        {activities.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '3rem 2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}></i>
            বর্তমানে কোনো সামাজিক কাজের পোস্ট নেই। এডমিন প্যানেল থেকে ছবি ও ভিডিও লিংক সরাসরি আপলোড করে প্রথম পোস্ট প্রকাশ করুন।
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {activities.slice(0, 3).map(act => (
              <div className="activity-card" key={act.id || act._id} onClick={() => handleActivityClick(act)}>
                <div className="activity-img-wrap">
                  <img src={act.image} alt={act.title} className="activity-img" />
                </div>
                <div className="activity-body">
                  <div className="activity-date">
                    <i className="fa-regular fa-calendar-days"></i> {act.date} &bull; <i className="fa-solid fa-location-dot"></i> {act.location}
                  </div>
                  <h3 className="activity-title">{act.title}</h3>
                  <p className="activity-desc">{act.description}</p>
                  <div className="flex justify-between items-center" style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                    <span className="badge badge-primary">{act.category}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      <i className="fa-solid fa-heart" style={{ color: 'var(--blood-red)' }}></i> {act.likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activities.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('activities')}>সকল কার্যক্রম ও ফটো গ্যালারি <i className="fa-solid fa-images"></i></button>
          </div>
        )}
      </div>

      {/* Interactive Map Section */}
      <div className="container">
        <JashoreMap />
      </div>
    </section>
  );
}

