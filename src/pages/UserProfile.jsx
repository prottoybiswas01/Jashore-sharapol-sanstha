import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function UserProfile({ onNavigate }) {
  const { user, token, updateUserImage } = useAuth();
  const { ideas, submitMemberIdea, showToast } = useData();

  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDetails, setIdeaDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: '4rem 1.25rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <i className="fa-solid fa-user-lock" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}></i>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>প্রোফাইল দেখার জন্য লগইন করুন</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>আপনার ইউজার অ্যাকাউন্ট দিয়ে লগইন বা রেজিস্ট্রেশন করুন</p>
          <button className="btn btn-primary" onClick={() => onNavigate('admin')} style={{ width: '100%' }}>
            <i className="fa-solid fa-right-to-bracket"></i> লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  // Ultra-fast, 150x150 px client-side Canvas compression (Target size: ~3-5 KB)
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to 0.5 quality JPEG (~3KB size)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);

        // Send to backend API
        fetch('/api/users/profile-image', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: compressedBase64 })
        })
          .then(r => r.json())
          .then(data => {
            setIsUploadingPhoto(false);
            if (data.success) {
              updateUserImage(compressedBase64);
              showToast('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');
            } else {
              showToast(data.message || 'ছবি আপলোড করা যায়নি।', 'error');
            }
          })
          .catch(() => {
            setIsUploadingPhoto(false);
            showToast('ছবি আপলোডে নেটওয়ার্ক ত্রুটি।', 'error');
          });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDetails.trim()) {
      showToast('শিরোনাম ও বিবরণ পূরণ করুন।', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await submitMemberIdea({ title: ideaTitle, details: ideaDetails });
    setIsSubmitting(false);

    if (res.success) {
      setIdeaTitle('');
      setIdeaDetails('');
    }
  };

  const myIdeas = ideas.filter(i => i.userId === user.id || i.username === user.username);

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* User Profile Header Card */}
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
          <div className="flex items-center gap-4 flex-wrap">
            <div style={{ position: 'relative' }}>
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-light)', boxShadow: 'var(--shadow-sm)' }} 
                />
              ) : (
                <div className="avatar-placeholder" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--primary-light)', fontSize: '2.5rem' }}>
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
              <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} title="ছবি পরিবর্তন করুন">
                <i className="fa-solid fa-camera" style={{ fontSize: '0.85rem' }}></i>
                <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} style={{ display: 'none' }} disabled={isUploadingPhoto} />
              </label>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user.name}</h2>
                <span className="badge badge-gold"><i className="fa-solid fa-crown" style={{ color: '#b45309', marginRight: '0.3rem' }}></i> {user.role}</span>
                {user.committeeRole && (
                  <span className="badge badge-primary"><i className="fa-solid fa-award" style={{ marginRight: '0.3rem' }}></i> {user.committeeRole}</span>
                )}
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                  <i className="fa-solid fa-certificate"></i> স্টার ভলান্টিয়ার
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <code>@{user.username}</code> &bull; <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> নিবন্ধিত অফিশিয়াল সদস্য
              </p>

              <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                {user.phone && <span><i className="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> {user.phone}</span>}
                {user.email && <span><i className="fa-solid fa-envelope" style={{ color: 'var(--primary)' }}></i> {user.email}</span>}
              </div>

              <div>
                <button className="btn btn-primary btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('open-id-card-modal'))}>
                  <i className="fa-solid fa-id-card"></i> ডিজিটাল মেম্বার আইডি কার্ড দেখুন
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Submit Idea / Proposal & View Submitted Status */}
        <div className="user-profile-grid">
          
          {/* Column 1: Submit New Idea to Executive Committee */}
          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-lightbulb" style={{ color: 'var(--accent-gold)' }}></i> সংগঠনের উন্নয়নে আইডিয়া / প্রস্তাবনা পাঠান
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              আপনার যেকোনো নতুন চিন্তাভাবনা সরাসরি সংস্থার সভাপতি, সহ-সভাপতি ও কার্যনির্বাহী কমিটির নিকট জমা হবে।
            </p>

            <form onSubmit={handleIdeaSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">আইডিয়ার মূল বিষয় / শিরোনাম *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="যেমন: বিনামূল্যে ফ্রি ডায়াবেটিস পরীক্ষা ক্যাম্প পরিচালনা"
                  value={ideaTitle}
                  onChange={e => setIdeaTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">বিস্তারিত প্রস্তাবনা ও বিবরণ *</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  placeholder="আপনার আইডিয়াটি কীভাবে বাস্তবায়ন করা যেতে পারে সে বিষয়ে বিস্তারিত লিখুন..."
                  value={ideaDetails}
                  onChange={e => setIdeaDetails(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'প্রেরণ করা হচ্ছে...' : 'কার্যনির্বাহী কমিটিতে আইডিয়া পাঠান'}
              </button>
            </form>
          </div>

          {/* Column 2: Member's Submitted Ideas Status */}
          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-list-check" style={{ color: 'var(--primary)' }}></i> আমার জমাকৃত প্রস্তাবনাসমূহ ({myIdeas.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              সভাপতি ও নির্বাহী কমিটির অনুমোদন এবং ফিডব্যাক স্ট্যাটাস দেখুন
            </p>

            {myIdeas.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '2rem', color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'block' }}></i>
                আপনি এখনো কোনো আইডিয়া জমা দেননি। বাঁপাশের ফরম থেকে প্রথম আইডিয়াটি পাঠান।
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                {myIdeas.map(idea => (
                  <div key={idea._id || idea.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="flex justify-between items-center gap-1" style={{ marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.98rem' }}>{idea.title}</strong>
                      <span className={`badge ${idea.status === 'অনুমোদিত ও গ্রহণযোগ্য' ? 'badge-primary' : 'badge-gold'}`} style={{ fontSize: '0.75rem' }}>
                        {idea.status === 'অনুমোদিত ও গ্রহণযোগ্য' && <i className="fa-solid fa-circle-check" style={{ marginRight: '0.2rem' }}></i>}
                        {idea.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: '1.5' }}>
                      {idea.details}
                    </p>

                    {idea.adminFeedback && (
                      <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600 }}>
                        <i className="fa-solid fa-comment-dots" style={{ marginRight: '0.3rem' }}></i>
                        কমিটি ফিডব্যাক: {idea.adminFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
