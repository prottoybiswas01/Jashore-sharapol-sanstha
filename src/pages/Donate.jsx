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
    addDonation({ donorName: donName, amount: parseInt(donAmount), method: donMethod, trxId: donTrx });
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
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>আপনার সামান্য অনুদান অসহায় মানুষের জীবন রক্ষা ও যুব সমাজের উন্নয়নে ব্যবহৃত হবে।</p>
        </div>

        <div class="donation-grid">
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}><i class="fa-solid fa-wallet" style={{ color: 'var(--primary)' }}></i> পেমেন্ট মেথড (বাংলাদেশ)</h3>
            
            <div class="payment-method-card">
              <div class="method-icon bkash">bKash</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>বিকাশ পারসোনাল / মার্চেন্ট</h4>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2136e', fontFamily: 'var(--font-latin)' }}>01711-123456</p>
                <small style={{ color: 'var(--text-muted)' }}>Send Money বা Cash In করুন</small>
              </div>
              <button class="btn btn-outline btn-sm" onClick={() => copyText('01711123456')}><i class="fa-regular fa-copy"></i> কপি</button>
            </div>

            <div class="payment-method-card">
              <div class="method-icon nagad">নগদ</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>নগদ পারসোনাল</h4>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f7941d', fontFamily: 'var(--font-latin)' }}>01711-123456</p>
                <small style={{ color: 'var(--text-muted)' }}>Send Money করুন</small>
              </div>
              <button class="btn btn-outline btn-sm" onClick={() => copyText('01711123456')}><i class="fa-regular fa-copy"></i> কপি</button>
            </div>

            <div class="payment-method-card">
              <div class="method-icon rocket">রকেট</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>রকেট পারসোনাল</h4>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#8c3494', fontFamily: 'var(--font-latin)' }}>01711-123456-7</p>
                <small style={{ color: 'var(--text-muted)' }}>Send Money করুন</small>
              </div>
              <button class="btn btn-outline btn-sm" onClick={() => copyText('017111234567')}><i class="fa-regular fa-copy"></i> কপি</button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}><i class="fa-solid fa-receipt" style={{ color: 'var(--accent-gold)' }}></i> অনুদানের তথ্য জমা দিন</h3>
            <form onSubmit={handleSubmit}>
              <div class="form-group" style={{ marginBottom: '1rem' }}>
                <label class="form-label">আপনার পূর্ণ নাম *</label>
                <input type="text" class="form-control" value={donName} onChange={e => setDonName(e.target.value)} required />
              </div>
              <div class="form-group" style={{ marginBottom: '1rem' }}>
                <label class="form-label">অনুদানের পরিমাণ (টাকা) *</label>
                <input type="number" class="form-control" value={donAmount} onChange={e => setDonAmount(e.target.value)} required />
              </div>
              <div class="form-group" style={{ marginBottom: '1rem' }}>
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
                <input type="text" class="form-control" value={donTrx} onChange={e => setDonTrx(e.target.value)} required />
              </div>
              <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>
                <i class="fa-solid fa-paper-plane"></i> অনুদান কনফার্ম জমা দিন
              </button>
            </form>
          </div>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}><i class="fa-solid fa-hand-holding-heart" style={{ color: 'var(--accent-gold)' }}></i> সম্মানিত অনুদানকারীগণের তালিকা</h3>
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
                  <tr key={d.id}>
                    <td><strong>{d.donorName}</strong></td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>৳ {d.amount.toLocaleString()}</td>
                    <td><span class="badge badge-info">{d.method}</span></td>
                    <td>{d.date || '২০২৬-০৮-১২'}</td>
                    <td><span class="badge badge-primary">{d.status || 'অনুমোদিত'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
