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
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">আমাদের পদক্ষেপ</div>
          <h2 className="section-title">সামাজিক কার্যক্রম ও ভবিষ্যৎ পরিকল্পনা</h2>
        </div>

        {/* Tab Selection */}
        <div className="activities-tab-pills" style={{ marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('completed')}
          >
            <i className="fa-solid fa-circle-check"></i> সম্পন্নকৃত কাজ ({activities.length})
          </button>
          <button 
            className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('plans')}
          >
            <i className="fa-solid fa-lightbulb"></i> ভবিষ্যৎ পরিকল্পনা ({plans.length})
          </button>
        </div>

        {/* Completed Activities Grid */}
        {activeTab === 'completed' && (
          activities.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো কাজের পোস্ট নেই। এডমিন প্যানেল থেকে প্রথম তথ্য প্রকাশ করা যাবে।
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {activities.map(act => (
                <div className="activity-card" key={act.id || act._id} onClick={() => handleActivityClick(act)}>
                  <div className="activity-img-wrap">
                    <img src={act.image} alt={act.title} className="activity-img" />
                  </div>
                  <div className="activity-body">
                    <div className="activity-date">
                      <i className="fa-regular fa-calendar-days"></i> {act.date} &bull; <i className="fa-solid fa-location-dot"></i> {act.location}
                    </div>
                    <h3 className="activity-title">{act.title}</h3>
                    {act.subtitle && (
                      <p style={{ color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: 600, marginTop: '-0.4rem', marginBottom: '0.4rem' }}>
                        <i className="fa-solid fa-feather-pointed" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {act.subtitle}
                      </p>
                    )}
                    <p className="activity-desc">{act.description ? act.description.replace(/#+\s*/g, '').replace(/[*•-]\s*/g, '') : ''}</p>
                    <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                      <span className="badge badge-primary">{act.category}</span>
                      {act.expense > 0 && (
                        <span className="badge" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '0.75rem' }}>
                          <i className="fa-solid fa-coins"></i> ৳ {parseInt(act.expense).toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                        <i className="fa-solid fa-heart" style={{ color: 'var(--blood-red)' }}></i> {act.likes || 0}
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
            <div style={{ background: 'var(--bg-card)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো ভবিষ্যৎ পরিকল্পনা জমা নেই।
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {plans.map(plan => (
                <div key={plan.id || plan._id} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginBottom: '0.5rem' }}>
                    <span className="badge badge-gold">{plan.category}</span>
                    <small style={{ color: 'var(--text-muted)' }}>টার্গেট: {plan.targetDate || 'আসন্ন'}</small>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{plan.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plan.description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}

