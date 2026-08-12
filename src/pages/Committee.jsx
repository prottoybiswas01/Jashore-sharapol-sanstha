import React from 'react';
import { useData } from '../context/DataContext';

export default function Committee() {
  const { committee } = useData();

  return (
    <section class="page-section" style={{ padding: '4rem 0' }}>
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">সংগঠনের নেতৃত্ব</div>
          <h2 class="section-title">কার্যনির্বাহী পরিষদ ও পদবীসমূহ</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>যশোর শারাপোল সংস্থার দায়িত্বপ্রাপ্ত নির্বাহী কমিটির কর্মকর্তাবৃন্দ</p>
        </div>

        <div class="grid grid-cols-3 gap-3">
          {committee.map(c => (
            <div class="committee-card" key={c.id}>
              <img src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt={c.name} class="member-photo" />
              <span class="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{c.role}</span>
              <h3 class="member-name">{c.name}</h3>
              <div class="member-phone">
                <i class="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> {c.phone}
              </div>
              {c.email && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
