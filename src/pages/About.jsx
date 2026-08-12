import React from 'react';
import { useData } from '../context/DataContext';

export default function About() {
  const { settings } = useData();

  return (
    <section class="page-section" style={{ padding: '4rem 0' }}>
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">সংস্থার পরিচিতি</div>
          <h2 class="section-title">{settings.aboutTitle}</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 items-center" style={{ marginBottom: '4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>আমাদের মূল উদ্দেশ্য ও লক্ষ্য</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {settings.aboutDescription}
            </p>
            <div class="flex gap-2">
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1 }}>
                <i class="fa-solid fa-eye" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}></i>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>আমাদের ভিশন</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>যশোরকে রক্তকষ্টমুক্ত ও দারিদ্র্যমুক্ত একটি আদর্শ সামাজিক জেলা হিসেবে গড়ে তোলা।</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1 }}>
                <i class="fa-solid fa-bullseye" style={{ fontSize: '1.5rem', color: 'var(--blood-red)', marginBottom: '0.5rem' }}></i>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>আমাদের মিশন</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>২৪/৭ জরুরি রক্ত সরবরাহ, বিনামূল্যে স্বাস্থ্যসেবা ও কারিগরি প্রশিক্ষণ বাস্তবায়ন।</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', textAlign: 'center' }}><i class="fa-solid fa-location-crosshairs" style={{ color: 'var(--primary)' }}></i> যশোর জেলায় কর্ম এলাকা</h3>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> যশোর সদর</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> অভয়নগর</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> বাঘারপাড়া</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> চৌগাছা</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> ঝিকরগাছা</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> কেশবপুর</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> মণিরামপুর</li>
              <li style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}><i class="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i> শার্শা</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
