import React, { useState } from 'react';

export default function JashoreMap() {
  const [activeDistrict, setActiveDistrict] = useState('jashore');

  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '2.5rem',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      margin: '3rem 0'
    }}>
      <div class="section-header" style={{ marginBottom: '2rem' }}>
        <div class="section-subtitle"><i class="fa-solid fa-earth-asia" style={{ color: 'var(--primary)' }}></i> আমাদের কর্ম এলাকা</div>
        <h2 class="section-title">যশোর জেলায় শারাপোল সংস্থার সেবামুখী কার্যক্রম</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          যশোর সদর সহ জেলার সকল উপজেলায় আমাদের জরুরি রক্তদান, শিক্ষা সহায়তা ও সামাজিক কল্যাণমূলক কাজ চলমান রয়েছে।
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 items-center">
        {/* Interactive Vector Bangladesh Map with Jashore Glow Highlight */}
        <div style={{ textAlignment: 'center', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 500 600" style={{ width: '100%', maxHeight: '380px', filter: 'drop-shadow(0 10px 20px rgba(5, 150, 105, 0.15))' }}>
            <defs>
              <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Bangladesh Stylized Map Outline */}
            <path 
              d="M 180 50 Q 250 20 320 60 Q 380 120 420 200 Q 400 300 360 380 Q 280 520 220 540 Q 150 480 100 400 Q 80 300 110 200 Q 140 100 180 50 Z" 
              fill="var(--bg-main)" 
              stroke="var(--border-color)" 
              strokeWidth="3" 
            />

            {/* Other Regions Indicator Dots */}
            <circle cx="280" cy="120" r="8" fill="#cbd5e1" opacity="0.6" />
            <circle cx="340" cy="220" r="8" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="460" r="8" fill="#cbd5e1" opacity="0.6" />
            <circle cx="310" cy="360" r="8" fill="#cbd5e1" opacity="0.6" />

            {/* Jashore District Highlight Zone (Pulsing Glow Animation) */}
            <g 
              onMouseEnter={() => setActiveDistrict('jashore')}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer Pulse Ring */}
              <circle cx="160" cy="340" r="35" fill="rgba(5, 150, 105, 0.2)">
                <animate attributeName="r" values="25;40;25" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Jashore District Boundary Shape */}
              <path 
                d="M 140 310 Q 185 300 195 340 Q 180 375 145 365 Q 125 340 140 310 Z" 
                fill="url(#mapGlow)" 
                stroke="#ffffff" 
                strokeWidth="2"
                filter="url(#glow)"
              />

              {/* District Center Star Marker */}
              <circle cx="160" cy="340" r="7" fill="#ffffff" />
              <circle cx="160" cy="340" r="3" fill="#dc2626" />
            </g>

            {/* Floating Label Badge */}
            <foreignObject x="180" y="310" width="160" height="60">
              <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                color: 'white',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <i class="fa-solid fa-location-dot" style={{ color: '#f59e0b' }}></i>
                যশোর জেলা (সক্রিয়)
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* Right Info Box */}
        <div>
          <div style={{ background: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderLeft: '5px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              <i class="fa-solid fa-bullseye"></i> যশোর জেলায় আমাদের কেন্দ্রবিন্দু
            </h3>
            <p style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
              যশোর সদর, অভয়নগর, বাঘারপাড়া, চৌগাছা, ঝিকরগাছা, কেশবপুর, মণিরামপুর ও শার্শা—এই ৮টি উপজেলায় আমাদের সেচ্ছাসেবক টিম সার্বক্ষণিক প্রস্তুত।
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>৮টি</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>উপজেলায় সেবা বিস্তৃত</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--blood-red)', fontWeight: 800, fontSize: '1.5rem' }}>২৪/৭</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>জরুরি রক্তদান সহায়তা</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
