import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Donate() {
  const { donations, addDonation, showToast } = useData();
  const [donName, setDonName] = useState('');
  const [donAmount, setDonAmount] = useState('');
  const [donMethod, setDonMethod] = useState('bKash');
  const [donTrx, setDonTrx] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    addDonation({ 
      donorName: donName, 
      amount: parseInt(donAmount), 
      method: donMethod, 
      trxId: donTrx,
      date: new Date().toISOString().split('T')[0],
      status: 'অনুমোদিত'
    });
    setDonName(''); setDonAmount(''); setDonTrx('');
  };

  const copyText = (text, cardId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(cardId);
    showToast(`কপি করা হয়েছে: ${text}`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">আমাদের পাশে থাকুন</div>
          <h2 className="section-title">অনুদানের মাধ্যমে মানবসেবায় অংশ নিন</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.9rem' }}>
            আপনার সামান্য অনুদান অসহায় মানুষের জীবন রক্ষা ও সমাজ উন্নয়নে ব্যবহৃত হবে।
          </p>
        </div>

        {/* Financial Transparency & Impact Summary Widget */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div style={{ padding: '0.5rem' }}>
              <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>সর্বমোট সংগৃহীত অনুদান</small>
              <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800 }}>৳ ১,৪৫,০০০+</strong>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px dashed var(--border-color)', borderRight: '1px dashed var(--border-color)' }}>
              <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>সামাজিক প্রজেক্টে ব্যয়িত</small>
              <strong style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: 800 }}>৳ ১,২৮,৫০০</strong>
            </div>
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>স্বচ্ছতা নিশ্চিতকরণ</small>
              <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}><i className="fa-solid fa-shield-check"></i> ১০০% অডিটেড তহবীল</span>
            </div>
          </div>
        </div>

        <div className="donation-grid">
          {/* Left Column: Rich Payment Method Cards */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-wallet" style={{ color: 'var(--primary)' }}></i> পেমেন্ট মেথড (বাংলাদেশ)
            </h3>
            
            {/* bKash Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #fbcfe8', borderLeft: '6px solid #e2136e', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#fce7f3', color: '#e2136e', fontWeight: 700 }}>bKash (বিকাশ)</span>
                <button className="btn btn-outline btn-sm" style={{ color: '#e2136e', borderColor: '#e2136e' }} onClick={() => copyText('01893851111', 'bkash')}>
                  {copiedId === 'bkash' ? <><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> অনুলিপি সম্পন্ন!</> : <><i className="fa-regular fa-copy"></i> অনুলিপি করুন</>}
                </button>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>বিকাশ পারসোনাল / মার্চেন্ট নম্বর</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e2136e', fontFamily: 'var(--font-latin)' }}>01893851111</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>* অ্যাপ বা USSD (*247#) থেকে Send Money বা Cash In করুন</small>
            </div>

            {/* Nagad Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #ffedd5', borderLeft: '6px solid #f7941d', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#ffedd5', color: '#c2410c', fontWeight: 700 }}>Nagad (নগদ)</span>
                <button className="btn btn-outline btn-sm" style={{ color: '#c2410c', borderColor: '#f7941d' }} onClick={() => copyText('01893851111', 'nagad')}>
                  {copiedId === 'nagad' ? <><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> অনুলিপি সম্পন্ন!</> : <><i className="fa-regular fa-copy"></i> অনুলিপি করুন</>}
                </button>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>নগদ পারসোনাল নম্বর</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f7941d', fontFamily: 'var(--font-latin)' }}>01893851111</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>* অ্যাপ বা USSD (*167#) থেকে Send Money করুন</small>
            </div>

            {/* Rocket Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #f3e8ff', borderLeft: '6px solid #8c3494', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#f3e8ff', color: '#8c3494', fontWeight: 700 }}>Rocket (রকেট)</span>
                <button className="btn btn-outline btn-sm" style={{ color: '#8c3494', borderColor: '#8c3494' }} onClick={() => copyText('01893851111', 'rocket')}>
                  {copiedId === 'rocket' ? <><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> অনুলিপি সম্পন্ন!</> : <><i className="fa-regular fa-copy"></i> অনুলিপি করুন</>}
                </button>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>রকেট পারসোনাল নম্বর</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8c3494', fontFamily: 'var(--font-latin)' }}>01893851111</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>* রকেট অ্যাপ বা USSD (*322#) থেকে Send Money করুন</small>
            </div>

            {/* Upay Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e0f2fe', borderLeft: '6px solid #0284c7', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex justify-between items-center flex-wrap gap-1" style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>Upay (উপায়)</span>
                <button className="btn btn-outline btn-sm" style={{ color: '#0369a1', borderColor: '#0284c7' }} onClick={() => copyText('01893851111', 'upay')}>
                  {copiedId === 'upay' ? <><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> অনুলিপি সম্পন্ন!</> : <><i className="fa-regular fa-copy"></i> অনুলিপি করুন</>}
                </button>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>উপায় পারসোনাল নম্বর</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-latin)' }}>01893851111</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>* উপায় অ্যাপ বা USSD (*268#) থেকে Send Money করুন</small>
            </div>
          </div>

          {/* Right Column: Donation Form Card */}
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-receipt" style={{ color: 'var(--accent-gold)' }}></i> অনুদানের তথ্য জমা দিন
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">আপনার পূর্ণ নাম *</label>
                <input type="text" className="form-control" value={donName} onChange={e => setDonName(e.target.value)} placeholder="যেমন: মোঃ কামরুল হাসান" required />
              </div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">অনুদানের পরিমাণ (টাকা) *</label>
                <input type="number" className="form-control" value={donAmount} onChange={e => setDonAmount(e.target.value)} placeholder="যেমন: ৫০০, ১০০০" required />
              </div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">পেমেন্ট মাধ্যম *</label>
                <select className="form-control" value={donMethod} onChange={e => setDonMethod(e.target.value)}>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Upay">Upay (উপায়)</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">ট্রানজেকশন আইডি (TrxID) *</label>
                <input type="text" className="form-control" value={donTrx} onChange={e => setDonTrx(e.target.value)} placeholder="যেমন: BK9X82M1" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <i className="fa-solid fa-paper-plane"></i> অনুদান কনফার্ম জমা দিন
              </button>
            </form>
          </div>
        </div>

        {/* Public Donors Ledger Table */}
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> সম্মানিত অনুদানকারীগণের তালিকা
          </h3>
          {donations.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো পাবলিক অনুদানের রেকর্ড জমা নেই। প্রথম অনুদানকারী হিসেবে আপনার তথ্য জমা দিন!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>দাতা / শুভানুধ্যায়ী</th>
                    <th>অনুদানের পরিমাণ</th>
                    <th>মাধ্যম</th>
                    <th>তারিখ</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id || d._id}>
                      <td data-label="দাতা"><strong>{d.donorName}</strong></td>
                      <td data-label="অনুদানের পরিমাণ" style={{ color: 'var(--primary)', fontWeight: 700 }}>৳ {parseInt(d.amount || 0).toLocaleString()}</td>
                      <td data-label="মাধ্যম"><span className="badge badge-info">{d.method}</span></td>
                      <td data-label="তারিখ">{d.date || 'আজ'}</td>
                      <td data-label="স্ট্যাটাস"><span className="badge badge-primary">{d.status || 'অনুমোদিত'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

