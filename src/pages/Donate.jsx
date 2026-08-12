import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Donate() {
  const { donations, addDonation, showToast } = useData();
  const [donName, setDonName] = useState('');
  const [donAmount, setDonAmount] = useState('');
  const [donMethod, setDonMethod] = useState('bKash');
  const [donTrx, setDonTrx] = useState('');

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

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    showToast(`কপি করা হয়েছে: ${text}`, 'info');
  };

  return (
    <section class="page-section" style={{ padding: '4rem 0' }}>
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle">আমাদের পাশে থাকুন</div>
          <h2 class="section-title">অনুদানের মাধ্যমে মানবসেবায় অংশ নিন</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>আপনার সামান্য অনুদান অসহায় মানুষের জীবন রক্ষা ও সমাজ উন্নয়নে ব্যবহৃত হবে।</p>
        </div>

        <div class="donation-grid">
          {/* Left Column: Rich Payment Method Cards */}
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i class="fa-solid fa-wallet" style={{ color: 'var(--primary)' }}></i> পেমেন্ট মেথড (বাংলাদেশ)
            </h3>
            
            {/* bKash Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #fbcfe8', borderLeft: '6px solid #e2136e', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div class="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <span class="badge" style={{ background: '#fce7f3', color: '#e2136e', fontWeight: 700 }}>bKash (বিকাশ)</span>
                <button class="btn btn-outline btn-sm" style={{ color: '#e2136e', borderColor: '#e2136e' }} onClick={() => copyText('01711123456')}>
                  <i class="fa-regular fa-copy"></i> অনুলিপি করুন
                </button>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>বিকাশ পারসোনাল / মার্চেন্ট নম্বর</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e2136e', fontFamily: 'var(--font-latin)' }}>01711-123456</p>
              <small style={{ color: 'var(--text-muted)' }}>* অ্যাপ বা USSD (*247#) থেকে Send Money বা Cash In করুন</small>
            </div>

            {/* Nagad Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #ffedd5', borderLeft: '6px solid #f7941d', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div class="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <span class="badge" style={{ background: '#ffedd5', color: '#c2410c', fontWeight: 700 }}>Nagad (নগদ)</span>
                <button class="btn btn-outline btn-sm" style={{ color: '#c2410c', borderColor: '#f7941d' }} onClick={() => copyText('01711123456')}>
                  <i class="fa-regular fa-copy"></i> অনুলিপি করুন
                </button>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>নগদ পারসোনাল নম্বর</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f7941d', fontFamily: 'var(--font-latin)' }}>01711-123456</p>
              <small style={{ color: 'var(--text-muted)' }}>* অ্যাপ বা USSD (*167#) থেকে Send Money করুন</small>
            </div>

            {/* Rocket Card */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #f3e8ff', borderLeft: '6px solid #8c3494', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
              <div class="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <span class="badge" style={{ background: '#f3e8ff', color: '#8c3494', fontWeight: 700 }}>Rocket (রকেট)</span>
                <button class="btn btn-outline btn-sm" style={{ color: '#8c3494', borderColor: '#8c3494' }} onClick={() => copyText('017111234567')}>
                  <i class="fa-regular fa-copy"></i> অনুলিপি করুন
                </button>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>রকেট পারসোনাল নম্বর</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8c3494', fontFamily: 'var(--font-latin)' }}>01711-123456-7</p>
              <small style={{ color: 'var(--text-muted)' }}>* রকেট অ্যাপ বা USSD (*322#) থেকে Send Money করুন</small>
            </div>
          </div>

          {/* Right Column: Donation Form Card */}
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i class="fa-solid fa-receipt" style={{ color: 'var(--accent-gold)' }}></i> অনুদানের তথ্য জমা দিন
            </h3>
            <form onSubmit={handleSubmit}>
              <div class="form-group" style={{ marginBottom: '1.2rem' }}>
                <label class="form-label">আপনার পূর্ণ নাম *</label>
                <input type="text" class="form-control" value={donName} onChange={e => setDonName(e.target.value)} placeholder="যেমন: মোঃ কামরুল হাসান" required />
              </div>
              <div class="form-group" style={{ marginBottom: '1.2rem' }}>
                <label class="form-label">অনুদানের পরিমাণ (টাকা) *</label>
                <input type="number" class="form-control" value={donAmount} onChange={e => setDonAmount(e.target.value)} placeholder="যেমন: ৫০০, ১০০০" required />
              </div>
              <div class="form-group" style={{ marginBottom: '1.2rem' }}>
                <label class="form-label">পেমেন্ট মাধ্যম *</label>
                <select class="form-control" value={donMethod} onChange={e => setDonMethod(e.target.value)}>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
              <div class="form-group" style={{ marginBottom: '1.5rem' }}>
                <label class="form-label">ট্রানজেকশন আইডি (TrxID) *</label>
                <input type="text" class="form-control" value={donTrx} onChange={e => setDonTrx(e.target.value)} placeholder="যেমন: BK9X82M1" required />
              </div>
              <button type="submit" class="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <i class="fa-solid fa-paper-plane"></i> অনুদান কনফার্ম জমা দিন
              </button>
            </form>
          </div>
        </div>

        {/* Public Donors Ledger Table */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i class="fa-solid fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> সম্মানিত অনুদানকারীগণের তালিকা
          </h3>
          {donations.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              বর্তমানে কোনো পাবলিক অনুদানের রেকর্ড জমা নেই। প্রথম অনুদানকারী হিসেবে আপনার তথ্য জমা দিন!
            </div>
          ) : (
            <div class="table-responsive">
              <table class="data-table">
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
                      <td><strong>{d.donorName}</strong></td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>৳ {parseInt(d.amount || 0).toLocaleString()}</td>
                      <td><span class="badge badge-info">{d.method}</span></td>
                      <td>{d.date || 'আজ'}</td>
                      <td><span class="badge badge-primary">{d.status || 'অনুমোদিত'}</span></td>
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
