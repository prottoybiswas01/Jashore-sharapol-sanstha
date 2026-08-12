import React from 'react';
import { useData } from '../context/DataContext';

export default function Committee() {
  const { committee } = useData();

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">সংগঠনের নেতৃত্ব</div>
          <h2 className="section-title">কার্যনির্বাহী পরিষদ ও পদবীসমূহ</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>যশোর শারাপোল সংস্থার দায়িত্বপ্রাপ্ত নির্বাহী কমিটির কর্মকর্তাবৃন্দ</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {committee.map(c => (
            <div className="committee-card" key={c.id}>
              <img src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt={c.name} className="member-photo" />
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{c.role}</span>
              <h3 className="member-name">{c.name}</h3>
              <div className="member-phone">
                <i className="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> {c.phone}
              </div>
              {c.email && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

