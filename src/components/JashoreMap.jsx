import React, { useState } from 'react';

export default function JashoreMap() {
  const [selectedRegion, setSelectedRegion] = useState('sadar');
  const [filterType, setFilterType] = useState('all');

  const upazilaData = {
    sadar: {
      name: 'যশোর সদর (Jashore Sadar)',
      type: 'কেন্দ্রীয় কার্যালয় ও প্রধান ব্লাড ব্যাংক',
      icon: 'fa-house-medical',
      donors: 145,
      activities: 18,
      volunteers: 42,
      description: 'সংস্থার প্রধান কার্যালয় ও কেন্দ্রীয় জরুরি রক্ত সরবরাহ সমন্বয় কেন্দ্র। সদর হাসপাতাল ও মেডিকেল কলেজ হাসপাতাল সংলগ্ন সেবা পরিচালনা করা হয়।',
      coordinates: { x: 230, y: 270 }
    },
    sharsha: {
      name: 'শার্শা ও বেনাপোল (Sharsha)',
      type: 'সীমান্ত এলাকা ও কারিগরি প্রশিক্ষণ',
      icon: 'fa-hand-holding-heart',
      donors: 68,
      activities: 9,
      volunteers: 24,
      description: 'সীমান্তবর্তী দরিদ্র জনগোষ্ঠীর জন্য শীতবস্ত্র বিতরণ, বিনামূল্যে প্রাথমিক স্বাস্থ্যসেবা ও যুবকদের জন্য কারিগরি শিক্ষা প্রকল্প।',
      coordinates: { x: 130, y: 250 }
    },
    jhikargacha: {
      name: 'ঝিকরগাছা (Jhikargacha)',
      type: 'জরুরি রক্তদান ও যুব উন্নয়ন কেন্দ্র',
      icon: 'fa-droplet',
      donors: 82,
      activities: 11,
      volunteers: 28,
      description: '২৪/৭ জরুরি রক্তদাতা টিম এবং স্থানীয় কলেজ-বিশ্ববিদ্যালয়ের শিক্ষার্থীদের অংশগ্রহণে রক্তদান সচেতনতামূলক ক্যাম্পেইন।',
      coordinates: { x: 175, y: 285 }
    },
    chowgachha: {
      name: 'চৌগাছা (Chowgachha)',
      type: 'ফ্রি মেডিকেল ও চক্ষু শিবির প্রকল্প',
      icon: 'fa-stethoscope',
      donors: 54,
      activities: 7,
      volunteers: 19,
      description: 'সীমান্ত ঘেঁষা চরাঞ্চলের অসহায় রোগীদের জন্য বিশেষজ্ঞ ডাক্তার দ্বারা বিনামূল্যে চিকিৎসা পরামর্শ ও ওষুধ সরবরাহ।',
      coordinates: { x: 170, y: 200 }
    },
    manirampur: {
      name: 'মণিরামপুর (Manirampur)',
      type: 'পরিবেশ রক্ষা ও বিশুদ্ধ পানি কেন্দ্র',
      icon: 'fa-seedling',
      donors: 76,
      activities: 14,
      volunteers: 31,
      description: 'উপজেলার বিস্তীর্ণ অঞ্চলে বৃক্ষরোপণ অভিযান, আর্সেনিকমুক্ত ফিল্টার স্থাপন এবং বর্ষাকালে বন্যাদুর্গতদের মাঝে ত্রাণ বিতরণ।',
      coordinates: { x: 250, y: 340 }
    },
    keshabpur: {
      name: 'কেশবপুর (Keshabpur)',
      type: 'মেধা বৃত্তি ও সামাজিক কল্যাণ',
      icon: 'fa-graduation-cap',
      donors: 49,
      activities: 8,
      volunteers: 16,
      description: 'দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে মাসিক শিক্ষাবৃত্তি প্রদান এবং পথশিশুদের জন্য সান্ধ্যকালীন প্রাথমিক পাঠশালা।',
      coordinates: { x: 275, y: 400 }
    },
    abhaynagar: {
      name: 'অভয়নগর ও নওয়াপাড়া (Abhaynagar)',
      type: 'শিল্পাঞ্চল জরুরি অ্যাম্বুলেন্স সেবা',
      icon: 'fa-truck-medical',
      donors: 93,
      activities: 12,
      volunteers: 35,
      description: 'শিল্পনগরী নওয়াপাড়ায় নৌ-শ্রমিক ও কারখানা শ্রমিকদের জরুরি দুর্ঘটনায় ফ্রি রক্তদান ও অ্যাম্বুলেন্স সহায়তা প্রদান।',
      coordinates: { x: 320, y: 310 }
    },
    bagherpara: {
      name: 'বাঘারপাড়া (Bagherpara)',
      type: 'দুস্থ পুনর্বাসন ও পুষ্টি প্রকল্প',
      icon: 'fa-people-roof',
      donors: 41,
      activities: 6,
      volunteers: 15,
      description: 'বিধবা ও দুস্থ নারীদের আত্মকর্মসংস্থানের জন্য সেলাই মেশিন বিতরণ ও ক্ষুদ্র কুটির শিল্প সহায়তা প্রকল্প।',
      coordinates: { x: 290, y: 220 }
    }
  };

  const current = upazilaData[selectedRegion];

  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '2.5rem 2rem',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      margin: '3rem 0'
    }}>
      {/* Map Header */}
      <div class="section-header" style={{ marginBottom: '2rem' }}>
        <div class="section-subtitle">
          <i class="fa-solid fa-earth-asia" style={{ color: 'var(--primary)' }}></i> ইন্টারঅ্যাক্টিভ ডিজিটাল ম্যাপ
        </div>
        <h2 class="section-title">যশোর জেলা ও সারাদেশে আমাদের সেবামুখী কর্মক্ষেত্র</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.5rem auto 0' }}>
          ম্যাপের যেকোনো উপজেলায় ক্লিক অথবা হোভার করে আমাদের রক্তদান পয়েন্ট, সক্রিয় স্বেচ্ছাসেবক ও উন্নয়নমূলক কাজের অবস্থান সরাসরি দেখুন।
        </p>
      </div>

      {/* Filter Category Pills */}
      <div class="flex justify-center gap-2 flex-wrap" style={{ marginBottom: '2rem' }}>
        <button 
          class={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterType('all')}
        >
          <i class="fa-solid fa-layer-group"></i> সকল সেবামুখী পয়েন্ট (৮টি)
        </button>
        <button 
          class={`btn btn-sm ${filterType === 'blood' ? 'btn-blood' : 'btn-outline'}`}
          onClick={() => setFilterType('blood')}
        >
          <i class="fa-solid fa-droplet"></i> জরুরি রক্তদান কেন্দ্র
        </button>
        <button 
          class={`btn btn-sm ${filterType === 'social' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterType('social')}
        >
          <i class="fa-solid fa-hands-holding-child"></i> শিক্ষা ও সামাজিক উন্নয়ন
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 items-center" style={{ minHeight: '440px' }}>
        {/* Vector SVG Bangladesh & Jashore Upazilas Map */}
        <div style={{ textAlignment: 'center', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
          <svg viewBox="0 0 450 480" style={{ width: '100%', maxHeight: '420px', filter: 'drop-shadow(0 8px 16px rgba(5, 150, 105, 0.12))' }}>
            <defs>
              <linearGradient id="jashoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Bangladesh Stylized Country Outline Background */}
            <path 
              d="M 180 30 C 230 15, 310 25, 340 50 C 390 90, 420 150, 430 220 C 420 300, 370 380, 330 420 C 270 470, 200 475, 150 440 C 100 390, 70 310, 80 220 C 95 140, 130 60, 180 30 Z" 
              fill="rgba(15, 23, 42, 0.04)" 
              stroke="var(--border-color)" 
              strokeWidth="2" 
              strokeDasharray="6,4"
            />
            <text x="350" y="100" fill="var(--text-muted)" fontSize="11" fontWeight="bold" opacity="0.6">বাংলাদেশ ম্যাপ</text>

            {/* Division Indicators on Mini Map */}
            <g opacity="0.4" fontSize="10" fill="var(--text-muted)">
              <circle cx="260" cy="90" r="5" fill="#94a3b8" />
              <text x="270" y="93">ঢাকা</text>
              <circle cx="370" cy="240" r="5" fill="#94a3b8" />
              <text x="380" y="243">চট্টগ্রাম</text>
              <circle cx="160" cy="110" r="5" fill="#94a3b8" />
              <text x="115" y="113">রাজশাহী</text>
            </g>

            {/* Jashore District Region Boundary Base */}
            <path 
              d="M 120 180 L 220 160 L 330 200 L 350 310 L 310 430 L 240 430 L 140 330 L 110 240 Z" 
              fill="var(--bg-card)" 
              stroke="var(--primary)" 
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <text x="210" y="150" fill="var(--primary-dark)" fontSize="13" fontWeight="800">যশোর জেলা (৮টি উপজেলা)</text>

            {/* Upazila Connecting Lines */}
            <line x1="230" y1="270" x2="130" y2="250" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="230" y1="270" x2="175" y2="285" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="230" y1="270" x2="170" y2="200" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="230" y1="270" x2="250" y2="340" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="230" y1="270" x2="320" y2="310" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="230" y1="270" x2="290" y2="220" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="250" y1="340" x2="275" y2="400" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Interactive Upazila Markers */}
            {Object.keys(upazilaData).map((key) => {
              const u = upazilaData[key];
              const isSelected = selectedRegion === key;

              return (
                <g 
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  onMouseEnter={() => setSelectedRegion(key)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glowing Outer Ripple */}
                  {isSelected && (
                    <circle cx={u.coordinates.x} cy={u.coordinates.y} r="22" fill="rgba(5, 150, 105, 0.25)">
                      <animate attributeName="r" values="16;28;16" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Marker Pin Base */}
                  <circle 
                    cx={u.coordinates.x} 
                    cy={u.coordinates.y} 
                    r={isSelected ? "11" : "8"} 
                    fill={isSelected ? "url(#activeGlow)" : "url(#jashoreGlow)"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Center Dot */}
                  <circle 
                    cx={u.coordinates.x} 
                    cy={u.coordinates.y} 
                    r={isSelected ? "4" : "3"} 
                    fill="#ffffff" 
                  />

                  {/* Upazila Name Label */}
                  <text 
                    x={u.coordinates.x} 
                    y={u.coordinates.y + (isSelected ? 24 : 20)} 
                    textAnchor="middle" 
                    fill={isSelected ? "var(--blood-red)" : "var(--text-main)"}
                    fontSize={isSelected ? "12" : "10"}
                    fontWeight={isSelected ? "800" : "600"}
                  >
                    {u.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Legend Badge */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'var(--bg-card)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
            সক্রিয় সেবামুখী পিন পয়েন্ট
          </div>
        </div>

        {/* Selected Upazila Details Box */}
        <div style={{ padding: '0.5rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div class="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
              <span class="badge badge-primary">
                <i class={`fa-solid ${current.icon}`}></i> {current.type}
              </span>
              <span class="badge badge-blood"><i class="fa-solid fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.3rem' }}></i> সক্রিয় কেন্দ্র</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {current.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {current.description}
            </p>

            {/* Real-time Upazila Stats Ribbon */}
            <div class="grid grid-cols-3 gap-2">
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ color: 'var(--blood-red)', fontWeight: 800, fontSize: '1.3rem' }}>{current.donors}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>রক্তদাতা</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.3rem' }}>{current.activities}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>প্রকল্প সম্পন্ন</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ color: 'var(--secondary)', fontWeight: 800, fontSize: '1.3rem' }}>{current.volunteers}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>স্বেচ্ছাসেবক</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i class="fa-solid fa-circle-info" style={{ color: 'var(--primary-dark)', fontSize: '1.25rem' }}></i>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: '1.4' }}>
              <strong>জরুরি প্রয়োজনে যোগাযোগ:</strong> {current.name}-এ রক্তের প্রয়োজন হলে হটলাইন <code>01711-123456</code> অথবা ওয়েবসাইটের <strong>"রক্তের প্রয়োজন?"</strong> বাটনে ক্লিক করুন।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
