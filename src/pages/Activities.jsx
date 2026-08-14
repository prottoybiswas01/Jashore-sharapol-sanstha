import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Activities({ onOpenModal }) {
  const { activities, plans, setSelectedActivity } = useData();
  const [activeTab, setActiveTab] = useState('completed');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(activities.map(a => a.category).filter(Boolean))];

  const filteredActivities = activities.filter(act => {
    const matchesSearch = (act.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (act.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (act.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
        <div className="activities-tab-pills" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

        {/* Search & Category Filter Bar */}
        {activeTab === 'completed' && activities.length > 0 && (
          <div style={{ background: 'var(--bg-card)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="কাজ বা স্থানের নাম লিখে খুঁজুন..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'সকল ক্যাটাগরি' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Activities Grid */}
        {activeTab === 'completed' && (
          filteredActivities.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '3rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.75rem', display: 'block' }}></i>
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>কোনো কার্যক্রম খুঁজে পাওয়া যায়নি</p>
              {searchQuery || selectedCategory !== 'all' ? (
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  ফিল্টার রিসেট করুন
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredActivities.map(act => (
                <div className="activity-card" key={act.id || act._id} onClick={() => handleActivityClick(act)}>
                  <div className="activity-img-wrap" style={{ position: 'relative' }}>
                    <img src={act.image} alt={act.title} className="activity-img" />
                    {act.videoUrl && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(220, 38, 38, 0.9)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                        <i className="fa-solid fa-circle-play"></i> ভিডিও
                      </span>
                    )}
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

