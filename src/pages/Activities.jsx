import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Activities() {
  const { activities, plans } = useData();
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <section class="page-section" style={{ padding: '4rem 0' }}>
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">আমাদের সেবামূলক কাজ</div>
          <h2 class="section-title">সম্পন্নকৃত কার্যক্রম ও ভবিষ্যৎ পরিকল্পনা</h2>
        </div>

        <div class="flex justify-center gap-2" style={{ marginBottom: '2.5rem' }}>
          <button class={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('completed')}>
            <i class="fa-solid fa-circle-check"></i> সম্পন্নকৃত কাজসমূহ
          </button>
          <button class={`btn ${activeTab === 'future' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('future')}>
            <i class="fa-solid fa-lightbulb"></i> ভবিষ্যৎ কাজের পরিকল্পনা
          </button>
        </div>

        {activeTab === 'completed' ? (
          <div class="grid grid-cols-3 gap-3">
            {activities.map(act => (
              <div class="activity-card" key={act.id}>
                <img src={act.image} alt={act.title} class="activity-img" />
                <div class="activity-body">
                  <div class="activity-date">
                    <i class="fa-regular fa-calendar-days"></i> {act.date} &bull; <i class="fa-solid fa-location-dot"></i> {act.location}
                  </div>
                  <h3 class="activity-title">{act.title}</h3>
                  <p class="activity-desc">{act.description}</p>
                  <div class="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                    <span class="badge badge-primary">{act.category}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{act.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class="grid grid-cols-2 gap-3">
            {plans.map(p => (
              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} key={p.id}>
                <div class="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                  <span class="badge badge-gold">{p.category}</span>
                  <span class="badge badge-info"><i class="fa-regular fa-clock"></i> টার্গেট: {p.targetDate || 'নির্ধারিত নয়'}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
