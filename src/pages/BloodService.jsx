import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function BloodService({ onOpenModal }) {
  const { donors, bloodRequests } = useData();
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterUpazila, setFilterUpazila] = useState('ALL');

  const filteredDonors = donors.filter(d => {
    const matchGroup = filterGroup === 'ALL' || d.bloodGroup === filterGroup;
    const matchUpazila = filterUpazila === 'ALL' || d.upazila === filterUpazila;
    return matchGroup && matchUpazila;
  });

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="blood-hero text-center" style={{ textAlign: 'center', padding: '2.5rem 1.25rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <i className="fa-solid fa-droplet" style={{ color: '#fca5a5' }}></i> রক্তদান সেবা যশোর
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
            জরুরি রক্তের প্রয়োজনে যশোরের স্বেচ্ছাসেবী রক্তদাতাদের খুঁজে নিন অথবা রক্তদাতা হিসেবে রক্তদানে আত্মনিয়োগ করুন।
          </p>
          <div className="flex justify-center gap-2 flex-wrap hero-btn-group">
            <button className="btn btn-primary" onClick={() => onOpenModal('blood-request')}>
              <i className="fa-solid fa-circle-exclamation"></i> জরুরি রক্তের আবেদন পোস্ট করুন
            </button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => onOpenModal('donor-register')}>
              <i className="fa-solid fa-user-plus"></i> রক্তদাতা হিসেবে নাম নথিভুক্ত করুন
            </button>
          </div>
        </div>

        {/* Live Requests */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--blood-red)' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> সাম্প্রতিক রক্তের আবেদনসমূহ
          </h3>
          {bloodRequests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>বর্তমানে কোনো জরুরি রক্ত আবেদন নেই।</p>
          ) : (
            bloodRequests.map(r => (
              <div className="request-card" key={r.id}>
                <div className="flex items-center gap-3">
                  <div className="blood-badge-large">{r.bloodGroup}</div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{r.patientName} &bull; {r.bagsNeeded || 1} ব্যাগ রক্ত</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-hospital" style={{ color: 'var(--blood-red)' }}></i> {r.hospital} &bull; <i className="fa-regular fa-clock"></i> {r.dateNeeded || 'জরুরি'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{r.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${r.contact}`} className="btn btn-blood">
                    <i className="fa-solid fa-phone-volume"></i> কল দিন: {r.contact}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filter Box */}
        <div className="blood-filter-box">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}><i className="fa-solid fa-filter" style={{ color: 'var(--primary)' }}></i> রক্তদাতা অনুসন্ধান ফিল্টার</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="form-group">
              <label className="form-label">রক্তের গ্রুপ নির্বাচন করুন</label>
              <select className="form-control" value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
                <option value="ALL">সকল গ্রুপের রক্তদাতা</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">যশোরের উপজেলা নির্বাচন করুন</label>
              <select className="form-control" value={filterUpazila} onChange={e => setFilterUpazila(e.target.value)}>
                <option value="ALL">সকল উপজেলা</option>
                <option value="যশোর সদর">যশোর সদর</option>
                <option value="অভয়নগর">অভয়নগর</option>
                <option value="বাঘারপাড়া">বাঘারপাড়া</option>
                <option value="চৌগাছা">চৌগাছা</option>
                <option value="ঝিকরগাছা">ঝিকরগাছা</option>
                <option value="কেশবপুর">কেশবপুর</option>
                <option value="মণিরামপুর">মণিরামপুর</option>
                <option value="শার্শা">শার্শা</option>
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => { setFilterGroup('ALL'); setFilterUpazila('ALL'); }}>
                <i className="fa-solid fa-rotate-left"></i> ফিল্টার রিসেট
              </button>
            </div>
          </div>
        </div>

        {/* Donors List Directory */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            নিবন্ধিত রক্তদাতাদের তালিকা ({filteredDonors.length} জন পাওয়া গেছে)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {filteredDonors.length === 0 ? (
              <div style={{ gridColumn: '1/-1', background: 'var(--bg-card)', padding: '3rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                <i className="fa-solid fa-droplet-slash" style={{ fontSize: '2.5rem', color: 'var(--blood-red)', marginBottom: '0.75rem', display: 'block' }}></i>
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>নির্ধারিত ফিল্টারে কোনো স্বেচ্ছাসেবী রক্তদাতা পাওয়া যায়নি</p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => { setFilterGroup('ALL'); setFilterUpazila('ALL'); }}>
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              filteredDonors.map(d => (
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'var(--transition-normal)' }} key={d.id || d._id} className="donor-card">
                  <div>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                      <span className="badge badge-blood" style={{ fontSize: '1.05rem', padding: '0.35rem 0.85rem', fontWeight: 800 }}>
                        <i className="fa-solid fa-droplet"></i> {d.bloodGroup}
                      </span>
                      <span className="badge badge-primary"><i className="fa-solid fa-location-dot"></i> {d.upazila}</span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {d.name}
                      <span title="রক্তদানে প্রস্তুত" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <i className="fa-regular fa-calendar-check"></i> সর্বশেষ রক্তদান: {d.lastDonation || 'তথ্য নেই'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`tel:${d.phone}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      <i className="fa-solid fa-phone"></i> {d.phone}
                    </a>
                    <a href={`https://wa.me/88${d.phone ? d.phone.replace(/[^0-9]/g, '') : ''}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white', border: 0 }} title="WhatsApp মেসেজ">
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

