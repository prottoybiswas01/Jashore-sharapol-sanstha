import React from 'react';
import { useData } from '../context/DataContext';
import JashoreMap from '../components/JashoreMap';

export default function About() {
  const { settings } = useData();

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">সংস্থার পরিচিতি</div>
          <h2 className="section-title">{settings.aboutTitle}</h2>
        </div>

        <div style={{ maxWidth: '850px', margin: '0 auto 2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)', textAlign: 'center' }}>আমাদের মূল উদ্দেশ্য ও লক্ষ্য</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', lineHeight: '1.7' }}>
            {settings.aboutDescription}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <i className="fa-solid fa-eye" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.75rem' }}></i>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>আমাদের ভিশন</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>যশোরকে রক্তকষ্টমুক্ত ও দারিদ্র্যমুক্ত একটি আদর্শ সামাজিক জেলা হিসেবে গড়ে তোলা।</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <i className="fa-solid fa-bullseye" style={{ fontSize: '2rem', color: 'var(--blood-red)', marginBottom: '0.75rem' }}></i>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>আমাদের মিশন</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>২৪/৭ জরুরি রক্ত সরবরাহ, বিনামূল্যে স্বাস্থ্যসেবা ও কারিগরি প্রশিক্ষণ বাস্তবায়ন।</p>
            </div>
          </div>
        </div>

        {/* Interactive Bangladesh Map Highlighting Jashore District */}
        <JashoreMap />
      </div>
    </section>
  );
}

