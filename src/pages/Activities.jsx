import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Activities({ onOpenModal }) {
  const { activities, plans, setSelectedActivity } = useData();
  const [activeTab, setActiveTab] = useState('completed');

  const handleActivityClick = (act) => {
    setSelectedActivity(act);
    if (onOpenModal) onOpenModal('view-activity');
  };

  return (
    <section class="page-section" style={{ padding: '4rem 0' }}>
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">আমাদের পদক্ষেপ</div>
          <h2 class="section-title">সামাজিক কার্যক্রম ও ভবিষ্যৎ পরিকল্পনা</h2>
        </div>

        {/* Tab Selection */}
        <div class="flex justify-center gap-2" style={{ marginBottom: '3rem' }}>
          <button 
            class={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('completed')}
          >
            <i class="fa-solid fa-circle-check"></i> সম্পন্নকৃত কাজ ({activities.length})
          </button>
          <button 
            class={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('plans')}
          >
            <i class="fa-solid fa-lightbulb"></i> ভবিষ্যৎ পরিকল্পনা ({plans.length})
          </button>
        </div>

        {/* Completed Activities Grid */}
        {activeTab === 'completed' && (
          activities.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো কাজের পোস্ট নেই। এডমিন প্যানেল থেকে প্রথম তথ্য প্রকাশ করা যাবে।
            </div>
          ) : (
            <div class="grid grid-cols-3 gap-3">
              {activities.map(act => (
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
          )
        )}

        {/* Future Plans List */}
        {activeTab === 'plans' && (
          plans.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো ভবিষ্যৎ পরিকল্পনা জমা নেই।
            </div>
          ) : (
            <div class="grid grid-cols-2 gap-3">
              {plans.map(plan => (
                <div key={plan.id || plan._id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div class="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                    <span class="badge badge-gold">{plan.category}</span>
                    <small style={{ color: 'var(--text-muted)' }}>টার্গেট: {plan.targetDate || 'আসন্ন'}</small>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{plan.description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
