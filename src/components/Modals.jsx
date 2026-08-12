import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { compressImageFile } from '../utils/imageCompressor';

// Exported Helper for Formatted Section Text Rendering (Headings, Subtitles, Lists, Bold Text, Dividers)
export function renderFormattedContent(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`sp-${index}`} style={{ height: '0.5rem' }} />);
      return;
    }

    // Main Heading / Section Title (## Title or # Title)
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <div key={`h-${index}`} style={{
          marginTop: index > 0 ? '1.25rem' : '0.4rem',
          marginBottom: '0.6rem',
          paddingBottom: '0.35rem',
          borderBottom: '2px solid var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i class="fa-solid fa-bookmark" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
            {headingText}
          </h4>
        </div>
      );
      return;
    }

    // Sub-heading (### Subheading)
    if (trimmed.startsWith('### ')) {
      const subText = trimmed.replace(/^###\s*/, '');
      elements.push(
        <h5 key={`sh-${index}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.85rem', marginBottom: '0.4rem' }}>
          {subText}
        </h5>
      );
      return;
    }

    // Horizontal Divider Line (--- or ***)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        <hr key={`hr-${index}`} style={{ border: 0, borderTop: '1px dashed var(--border-color)', margin: '1rem 0' }} />
      );
      return;
    }

    // Bullet List Item (* Item or - Item or • Item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const bulletText = trimmed.replace(/^[*•-]\s*/, '');
      const parts = parseInlineFormatting(bulletText);

      elements.push(
        <div key={`b-${index}`} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: '0.4rem',
          paddingLeft: '0.4rem'
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.15rem' }}>&bull;</span>
          <span style={{ fontSize: '0.96rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
            {parts}
          </span>
        </div>
      );
      return;
    }

    // Standard Paragraph
    const parts = parseInlineFormatting(trimmed);
    elements.push(
      <p key={`p-${index}`} style={{ fontSize: '0.96rem', color: 'var(--text-main)', lineHeight: '1.65', marginBottom: '0.5rem' }}>
        {parts}
      </p>
    );
  });

  return elements;
}

function parseInlineFormatting(text) {
  if (!text || !text.includes('**')) return text;
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} style={{ color: 'var(--secondary)', fontWeight: 700 }}>{part}</strong>;
    }
    return part;
  });
}

export default function Modals({ activeModal, onClose }) {
  const { 
    settings, updateSiteSettings, addActivity, updateActivity, likeActivity, addFuturePlan, 
    addCommitteeMember, addBloodDonor, addBloodRequest, addDonation, createSubAdminUser,
    selectedActivity, setSelectedActivity, editingActivity, setEditingActivity
  } = useData();

  const { register } = useAuth();

  // Helper for ultra-fast, high-efficiency client-side image compression
  const handleCompressedImageUpload = async (e, setImageState) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 900, 900, 0.75);
        setImageState(compressedBase64);
      } catch (err) {
        alert('ছবি প্রসেসিং করতে সমস্যা হয়েছে।');
      }
    }
  };

  // Helper to format YouTube Embed URL with 100% reliability
  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    
    // Extract 11-character YouTube video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);

    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`;
    }
    
    if (cleanUrl.includes('youtube.com/embed/')) {
      return cleanUrl;
    }
    
    return null;
  };

  // 1. Dynamic Site Settings Form
  const [siteForm, setSiteForm] = useState({
    topTickerNotice: settings.topTickerNotice || '',
    heroTitleText: settings.heroTitleText || '',
    heroDescription: settings.heroDescription || '',
    aboutDescription: settings.aboutDescription || '',
    contactPhone: settings.contactPhone || '',
    contactEmail: settings.contactEmail || '',
    contactAddress: settings.contactAddress || '',
    heroImageUrl: settings.heroImageUrl || ''
  });

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateSiteSettings(siteForm);
    onClose();
  };

  // 2. Public User Registration Form
  const [pubName, setPubName] = useState('');
  const [pubUsername, setPubUsername] = useState('');
  const [pubEmail, setPubEmail] = useState('');
  const [pubPass, setPubPass] = useState('');
  const [pubPhone, setPubPhone] = useState('');
  const [pubBlood, setPubBlood] = useState('O+');
  const [pubUpazila, setPubUpazila] = useState('যশোর সদর');

  const handlePublicRegister = async (e) => {
    e.preventDefault();
    const res = await register({
      name: pubName,
      username: pubUsername,
      email: pubEmail,
      password: pubPass,
      phone: pubPhone,
      bloodGroup: pubBlood,
      upazila: pubUpazila
    });
    if (res.success) {
      alert(res.message);
      onClose();
      setPubName(''); setPubUsername(''); setPubEmail(''); setPubPass(''); setPubPhone('');
    } else {
      alert(res.message);
    }
  };

  // 3. Blood Request Form
  const [reqPatient, setReqPatient] = useState('');
  const [reqGroup, setReqGroup] = useState('O+');
  const [reqHospital, setReqHospital] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqDetails, setReqDetails] = useState('');

  const handleReqSubmit = (e) => {
    e.preventDefault();
    addBloodRequest({ patientName: reqPatient, bloodGroup: reqGroup, hospital: reqHospital, contact: reqPhone, details: reqDetails });
    onClose();
    setReqPatient(''); setReqHospital(''); setReqPhone(''); setReqDetails('');
  };

  // 4. Blood Donor Register Form
  const [regName, setRegName] = useState('');
  const [regGroup, setRegGroup] = useState('A+');
  const [regUpazila, setRegUpazila] = useState('যশোর সদর');
  const [regPhone, setRegPhone] = useState('');
  const [regDate, setRegDate] = useState('');

  const handleDonorSubmit = (e) => {
    e.preventDefault();
    addBloodDonor({ name: regName, bloodGroup: regGroup, upazila: regUpazila, phone: regPhone, lastDonation: regDate || 'সম্প্রতি' });
    onClose();
    setRegName(''); setRegPhone(''); setRegDate('');
  };

  // 5. Admin Add Member Form (With Compressed Photo Upload)
  const [memName, setMemName] = useState('');
  const [memRole, setMemRole] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memImg, setMemImg] = useState('');

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    addCommitteeMember({ 
      name: memName, 
      role: memRole, 
      phone: memPhone || '01700-000000', 
      image: memImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' 
    });
    onClose();
    setMemName(''); setMemRole(''); setMemPhone(''); setMemImg('');
  };

  // Format insertion helper for rich sections
  const insertFormat = (type, setter, currentValue) => {
    let snippet = '';
    if (type === 'heading') snippet = '\n## নতুন সেকশন শিরোনাম\n';
    if (type === 'bullet') snippet = '\n* **আইটেম নাম:** তথ্য বিবরণ\n';
    if (type === 'divider') snippet = '\n---\n';
    setter(currentValue ? `${currentValue}${snippet}` : snippet.trim());
  };

  // 6. Admin Add Activity Form (With Subtitle, Total Expense & Rich Formatting Support)
  const [actTitle, setActTitle] = useState('');
  const [actSub, setActSub] = useState('');
  const [actCat, setActCat] = useState('স্বাস্থ্য সেবা');
  const [actDate, setActDate] = useState('');
  const [actLoc, setActLoc] = useState('যশোর');
  const [actImg, setActImg] = useState('');
  const [actVideo, setActVideo] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actExpense, setActExpense] = useState('');

  const handleActSubmit = (e) => {
    e.preventDefault();
    addActivity({ 
      title: actTitle,
      subtitle: actSub,
      category: actCat, 
      date: actDate, 
      location: actLoc, 
      image: actImg || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 
      videoUrl: actVideo,
      description: actDesc,
      expense: parseInt(actExpense) || 0
    });
    onClose();
    setActTitle(''); setActSub(''); setActDate(''); setActDesc(''); setActImg(''); setActVideo(''); setActExpense('');
  };

  // 6.b Admin Edit Activity Form
  const [editActTitle, setEditActTitle] = useState('');
  const [editActSub, setEditActSub] = useState('');
  const [editActCat, setEditActCat] = useState('');
  const [editActDate, setEditActDate] = useState('');
  const [editActLoc, setEditActLoc] = useState('');
  const [editActImg, setEditActImg] = useState('');
  const [editActVideo, setEditActVideo] = useState('');
  const [editActDesc, setEditActDesc] = useState('');
  const [editActExpense, setEditActExpense] = useState('');

  useEffect(() => {
    if (editingActivity) {
      setEditActTitle(editingActivity.title || '');
      setEditActSub(editingActivity.subtitle || '');
      setEditActCat(editingActivity.category || 'স্বাস্থ্য সেবা');
      setEditActDate(editingActivity.date || '');
      setEditActLoc(editingActivity.location || 'যশোর');
      setEditActImg(editingActivity.image || '');
      setEditActVideo(editingActivity.videoUrl || '');
      setEditActDesc(editingActivity.description || '');
      setEditActExpense(editingActivity.expense ? String(editingActivity.expense) : '');
    }
  }, [editingActivity]);

  const handleEditActSubmit = (e) => {
    e.preventDefault();
    if (!editingActivity) return;
    updateActivity(editingActivity._id || editingActivity.id, {
      title: editActTitle,
      subtitle: editActSub,
      category: editActCat,
      date: editActDate,
      location: editActLoc,
      image: editActImg,
      videoUrl: editActVideo,
      description: editActDesc,
      expense: parseInt(editActExpense) || 0
    });
    setEditingActivity(null);
    onClose();
  };

  // 7. Admin Add Future Plan Form
  const [planTitle, setPlanTitle] = useState('');
  const [planCat, setPlanCat] = useState('শিক্ষা');
  const [planDate, setPlanDate] = useState('');
  const [planDesc, setPlanDesc] = useState('');

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    addFuturePlan({ title: planTitle, category: planCat, targetDate: planDate, description: planDesc, status: 'পরিকল্পিত' });
    onClose();
    setPlanTitle(''); setPlanDate(''); setPlanDesc('');
  };

  // 8. Admin Add Donation Form
  const [donName, setDonName] = useState('');
  const [donAmount, setDonAmount] = useState('');
  const [donMethod, setDonMethod] = useState('bKash');
  const [donTrx, setDonTrx] = useState('');

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    addDonation({ donorName: donName, amount: parseInt(donAmount), method: donMethod, trxId: donTrx || 'CASH_ENTRY', date: new Date().toISOString().split('T')[0], status: 'অনুমোদিত' });
    onClose();
    setDonName(''); setDonAmount(''); setDonTrx('');
  };

  // 9. Admin Add Sub-User (RBAC) Form
  const [subName, setSubName] = useState('');
  const [subUsername, setSubUsername] = useState('');
  const [subPass, setSubPass] = useState('');
  const [subRole, setSubRole] = useState('BLOOD_ADMIN');

  const handleSubUserSubmit = (e) => {
    e.preventDefault();
    createSubAdminUser({ name: subName, username: subUsername, password: subPass, role: subRole });
    onClose();
    setSubName(''); setSubUsername(''); setSubPass('');
  };

  if (!activeModal) return null;

  return (
    <>
      {/* Activity Details Popup Modal */}
      {activeModal === 'view-activity' && selectedActivity && (
        <div class="modal-overlay open">
          <div class="modal-card" style={{ maxWidth: '780px' }}>
            <div class="modal-header">
              <div>
                <h3 class="modal-title" style={{ fontSize: '1.4rem' }}>{selectedActivity.title}</h3>
                {selectedActivity.subtitle && (
                  <p style={{ color: 'var(--primary-dark)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem' }}>
                    <i class="fa-solid fa-feather-pointed" style={{ color: 'var(--accent-gold)', marginRight: '0.3rem' }}></i> {selectedActivity.subtitle}
                  </p>
                )}
              </div>
              <span class="modal-close" onClick={() => { setSelectedActivity(null); onClose(); }}>&times;</span>
            </div>
            <div class="modal-body">
              {/* Image Preview */}
              {selectedActivity.image && (
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title} 
                  style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }} 
                />
              )}

              {/* YouTube Video Player Embed (if provided) */}
              {selectedActivity.videoUrl && getEmbedVideoUrl(selectedActivity.videoUrl) && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <iframe 
                    src={getEmbedVideoUrl(selectedActivity.videoUrl)} 
                    title="Activity Video"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div class="flex items-center gap-2 flex-wrap" style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span><i class="fa-regular fa-calendar-days"></i> {selectedActivity.date}</span>
                <span>&bull;</span>
                <span><i class="fa-solid fa-location-dot"></i> {selectedActivity.location}</span>
                <span class="badge badge-primary">{selectedActivity.category}</span>
                {selectedActivity.expense > 0 && (
                  <span class="badge" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                    <i class="fa-solid fa-coins" style={{ marginRight: '0.3rem' }}></i> 
                    মোট ব্যয়: ৳ {parseInt(selectedActivity.expense).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Formatted Description Container */}
              <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                {renderFormattedContent(selectedActivity.description)}
              </div>

              <div class="flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedActivity.impact}</span>
                <button class="btn btn-blood btn-sm" onClick={() => likeActivity(selectedActivity._id || selectedActivity.id)}>
                  <i class="fa-solid fa-heart"></i> লাইক দিন ({selectedActivity.likes || 0})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Member & Donor Registration Modal */}
      {activeModal === 'public-register' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-user-plus" style={{ color: 'var(--primary)' }}></i> সদস্য ও রক্তদাতা নিবন্ধন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handlePublicRegister}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">আপনার পূর্ণ নাম *</label>
                  <input type="text" className="form-control" value={pubName} onChange={e => setPubName(e.target.value)} placeholder="যেমন: মোঃ সাকিব হাসান" required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">ব্যবহারকারী নাম (Username) *</label>
                  <input type="text" className="form-control" value={pubUsername} onChange={e => setPubUsername(e.target.value)} placeholder="যেমন: sakib123" required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">ইমেইল ঠিকানা (Email Address) *</label>
                  <input type="email" className="form-control" value={pubEmail} onChange={e => setPubEmail(e.target.value)} placeholder="যেমন: user@gmail.com" required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">পাসওয়ার্ড *</label>
                  <input type="password" className="form-control" value={pubPass} onChange={e => setPubPass(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">মোবাইল নম্বর *</label>
                  <input type="tel" className="form-control" value={pubPhone} onChange={e => setPubPhone(e.target.value)} placeholder="যেমন: 01711234567" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">রক্তের গ্রুপ *</label>
                  <select class="form-control" value={pubBlood} onChange={e => setPubBlood(e.target.value)}>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">উপজেলা *</label>
                  <select class="form-control" value={pubUpazila} onChange={e => setPubUpazila(e.target.value)}>
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
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>অ্যাকাউন্ট তৈরি করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Site Settings Editor Modal */}
      {activeModal === 'edit-site-settings' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-pen-to-square" style={{ color: 'var(--primary)' }}></i> ওয়েবসাইট কনটেন্ট এডিটর</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleSettingsSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">টপ জরুরি নোটিশ (Ticker Notice)</label>
                  <textarea class="form-control" rows="2" value={siteForm.topTickerNotice} onChange={e => setSiteForm({ ...siteForm, topTickerNotice: e.target.value })} required></textarea>
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">প্রধান শিরোনাম (Hero Main Title)</label>
                  <input type="text" class="form-control" value={siteForm.heroTitleText} onChange={e => setSiteForm({ ...siteForm, heroTitleText: e.target.value })} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">হোমপেজ বিবরণ (Hero Description)</label>
                  <textarea class="form-control" rows="3" value={siteForm.heroDescription} onChange={e => setSiteForm({ ...siteForm, heroDescription: e.target.value })} required></textarea>
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">হিরো ব্যানার ছবি আপলোড (High Speed Compression)</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleCompressedImageUpload(e, (b64) => setSiteForm({ ...siteForm, heroImageUrl: b64 }))} />
                  {siteForm.heroImageUrl && (
                    <img src={siteForm.heroImageUrl} style={{ width: '100px', height: '60px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '4px' }} alt="Hero preview" />
                  )}
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">আমাদের কথা বিবরণ (About Us Text)</label>
                  <textarea class="form-control" rows="3" value={siteForm.aboutDescription} onChange={e => setSiteForm({ ...siteForm, aboutDescription: e.target.value })} required></textarea>
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">যোগাযোগের ফোন (Helpline)</label>
                  <input type="text" class="form-control" value={siteForm.contactPhone} onChange={e => setSiteForm({ ...siteForm, contactPhone: e.target.value })} required />
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>সেভ ও লাইভ ওয়েবসাইট আপডেট করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blood Request Modal */}
      {activeModal === 'blood-request' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-droplet" style={{ color: 'var(--blood-red)' }}></i> জরুরি রক্তের আবেদন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleReqSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">রোগীর নাম *</label>
                  <input type="text" class="form-control" value={reqPatient} onChange={e => setReqPatient(e.target.value)} placeholder="রোগীর নাম" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">রক্তের গ্রুপ *</label>
                  <select class="form-control" value={reqGroup} onChange={e => setReqGroup(e.target.value)}>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">হাসপাতাল (যশোর) *</label>
                  <input type="text" class="form-control" value={reqHospital} onChange={e => setReqHospital(e.target.value)} placeholder="২৫০ শয্যা হাসপাতাল, যশোর" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">যোগাযোগের নম্বর *</label>
                  <input type="tel" class="form-control" value={reqPhone} onChange={e => setReqPhone(e.target.value)} placeholder="017xxxxxxxx" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">বিস্তারিত</label>
                  <textarea class="form-control" rows="2" value={reqDetails} onChange={e => setReqDetails(e.target.value)} placeholder="জরুরি রক্তের বিবরণ"></textarea>
                </div>
                <button type="submit" class="btn btn-blood" style={{ width: '100%' }}>আবেদন জমা দিন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Donor Register Modal */}
      {activeModal === 'donor-register' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-user-plus" style={{ color: 'var(--primary)' }}></i> রক্তদাতা নিবন্ধন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleDonorSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পূর্ণ নাম *</label>
                  <input type="text" class="form-control" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">রক্তের গ্রুপ *</label>
                  <select class="form-control" value={regGroup} onChange={e => setRegGroup(e.target.value)}>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">উপজেলা *</label>
                  <select class="form-control" value={regUpazila} onChange={e => setRegUpazila(e.target.value)}>
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
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">মোবাইল নম্বর *</label>
                  <input type="tel" class="form-control" value={regPhone} onChange={e => setRegPhone(e.target.value)} required />
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>রক্তদাতা নিবন্ধন করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Activity Modal with Compressed Photo & YouTube Video Input */}
      {activeModal === 'add-activity' && (
        <div class="modal-overlay open">
          <div class="modal-card" style={{ maxWidth: '720px' }}>
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-plus" style={{ color: 'var(--primary)' }}></i> নতুন কাজের রেকর্ড যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleActSubmit}>
                <div class="grid grid-cols-2 gap-2" style={{ marginBottom: '1rem' }}>
                  <div class="form-group">
                    <label class="form-label">প্রধান শিরোনাম (Main Title) *</label>
                    <input type="text" class="form-control" value={actTitle} onChange={e => setActTitle(e.target.value)} placeholder="যেমন: বিনামূল্যে রক্তদান ক্যাম্প" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">উপ-শিরোনাম / সংক্ষিপ্ত হাইলাইট (Subtitle)</label>
                    <input type="text" class="form-control" value={actSub} onChange={e => setActSub(e.target.value)} placeholder="যেমন: চাঁচড়া মোড় সেবা কেন্দ্র" />
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2" style={{ marginBottom: '1rem' }}>
                  <div class="form-group">
                    <label class="form-label">ক্যাটাগরি</label>
                    <input type="text" class="form-control" value={actCat} onChange={e => setActCat(e.target.value)} placeholder="স্বাস্থ্য সেবা / ত্রাণ" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">তারিখ *</label>
                    <input type="date" class="form-control" value={actDate} onChange={e => setActDate(e.target.value)} required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">মোট খরচ (টাকা ৳)</label>
                    <input type="number" class="form-control" value={actExpense} onChange={e => setActExpense(e.target.value)} placeholder="যেমন: ২৫০০০" />
                  </div>
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">কাজের স্থান</label>
                  <input type="text" class="form-control" value={actLoc} onChange={e => setActLoc(e.target.value)} placeholder="যেমন: যশোর সদর" />
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">কাজের ছবি আপলোড (Auto Compressed) *</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleCompressedImageUpload(e, setActImg)} required />
                  {actImg && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <small style={{ color: 'var(--primary)', fontWeight: 600 }}>ছবি কমপ্রেসড ও লোড হয়েছে:</small>
                      <img src={actImg} style={{ width: '100px', height: '60px', objectFit: 'cover', display: 'block', borderRadius: '4px', marginTop: '0.2rem' }} alt="Preview" />
                    </div>
                  )}
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ইউটিউব ভিডিও লিংক (Optional Video URL)</label>
                  <input type="url" class="form-control" value={actVideo} onChange={e => setActVideo(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                </div>

                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <div class="flex justify-between items-center" style={{ marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label class="form-label" style={{ marginBottom: 0 }}>বিবরণ (ডিটেইলস ও সেকশন) *</label>
                    <div class="flex gap-1">
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('heading', setActDesc, actDesc)}>
                        + সেকশন টাইটেল
                      </button>
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('bullet', setActDesc, actDesc)}>
                        + বুলেট পয়েন্ট
                      </button>
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('divider', setActDesc, actDesc)}>
                        + বিভাজক
                      </button>
                    </div>
                  </div>
                  <textarea class="form-control" rows="4" value={actDesc} onChange={e => setActDesc(e.target.value)} placeholder="## সেকশন টাইটেল&#10;* **পয়েন্ট নাম:** বিস্তারিত বিবরণ..." required></textarea>

                  {actDesc && (
                    <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <small style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        <i class="fa-solid fa-eye"></i> লাইভ ফরম্যাটিং প্রিভিউ (Section Preview):
                      </small>
                      {renderFormattedContent(actDesc)}
                    </div>
                  )}
                </div>

                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>রেকর্ড প্রকাশ ও মঙ্গোডিবিতে সেভ করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Activity Modal */}
      {activeModal === 'edit-activity' && editingActivity && (
        <div class="modal-overlay open">
          <div class="modal-card" style={{ maxWidth: '720px' }}>
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-pen-to-square" style={{ color: 'var(--primary)' }}></i> কাজের রেকর্ড সম্পাদনা করুন</h3>
              <span class="modal-close" onClick={() => { setEditingActivity(null); onClose(); }}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleEditActSubmit}>
                <div class="grid grid-cols-2 gap-2" style={{ marginBottom: '1rem' }}>
                  <div class="form-group">
                    <label class="form-label">প্রধান শিরোনাম (Main Title) *</label>
                    <input type="text" class="form-control" value={editActTitle} onChange={e => setEditActTitle(e.target.value)} required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">উপ-শিরোনাম / সংক্ষিপ্ত হাইলাইট (Subtitle)</label>
                    <input type="text" class="form-control" value={editActSub} onChange={e => setEditActSub(e.target.value)} placeholder="উপ-শিরোনাম লিখুন" />
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2" style={{ marginBottom: '1rem' }}>
                  <div class="form-group">
                    <label class="form-label">ক্যাটাগরি</label>
                    <input type="text" class="form-control" value={editActCat} onChange={e => setEditActCat(e.target.value)} />
                  </div>
                  <div class="form-group">
                    <label class="form-label">তারিখ *</label>
                    <input type="date" class="form-control" value={editActDate} onChange={e => setEditActDate(e.target.value)} required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">মোট খরচ (টাকা ৳)</label>
                    <input type="number" class="form-control" value={editActExpense} onChange={e => setEditActExpense(e.target.value)} placeholder="যেমন: ২৫০০০" />
                  </div>
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">কাজের স্থান</label>
                  <input type="text" class="form-control" value={editActLoc} onChange={e => setEditActLoc(e.target.value)} />
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ছবি পরিবর্তন করুন (Auto Compressed Upload)</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleCompressedImageUpload(e, setEditActImg)} />
                  {editActImg && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <small style={{ color: 'var(--primary)', fontWeight: 600 }}>বর্তমান ছবি:</small>
                      <img src={editActImg} style={{ width: '100px', height: '60px', objectFit: 'cover', display: 'block', borderRadius: '4px', marginTop: '0.2rem' }} alt="Preview" />
                    </div>
                  )}
                </div>

                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ইউটিউব ভিডিও লিংক (YouTube Video URL)</label>
                  <input type="url" class="form-control" value={editActVideo} onChange={e => setEditActVideo(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                </div>

                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <div class="flex justify-between items-center" style={{ marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label class="form-label" style={{ marginBottom: 0 }}>বিবরণ (ডিটেইলস ও সেকশন) *</label>
                    <div class="flex gap-1">
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('heading', setEditActDesc, editActDesc)}>
                        + সেকশন টাইটেল
                      </button>
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('bullet', setEditActDesc, editActDesc)}>
                        + বুলেট পয়েন্ট
                      </button>
                      <button type="button" class="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }} onClick={() => insertFormat('divider', setEditActDesc, editActDesc)}>
                        + বিভাজক
                      </button>
                    </div>
                  </div>
                  <textarea class="form-control" rows="5" value={editActDesc} onChange={e => setEditActDesc(e.target.value)} required></textarea>

                  {editActDesc && (
                    <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <small style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        <i class="fa-solid fa-eye"></i> লাইভ ফরম্যাটিং প্রিভিউ (Section Preview):
                      </small>
                      {renderFormattedContent(editActDesc)}
                    </div>
                  )}
                </div>

                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>আপডেট পরিবর্তনসমূহ সেভ করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Committee Member Modal */}
      {activeModal === 'add-member' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-user-plus" style={{ color: 'var(--primary)' }}></i> নতুন কমিটি পদবী যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleMemberSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">সদস্যের নাম *</label>
                  <input type="text" class="form-control" value={memName} onChange={e => setMemName(e.target.value)} placeholder="নাম লিখুন" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পদবী (Role / Designation) *</label>
                  <input type="text" class="form-control" value={memRole} onChange={e => setMemRole(e.target.value)} placeholder="যেমন: সভাপতি / সাধারণ সম্পাদক" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">মোবাইল নম্বর</label>
                  <input type="tel" class="form-control" value={memPhone} onChange={e => setMemPhone(e.target.value)} />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">সদস্যের ছবি আপলোড করুন (Auto Compressed)</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleCompressedImageUpload(e, setMemImg)} />
                  {memImg && (
                    <img src={memImg} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem', display: 'block' }} alt="Member Preview" />
                  )}
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>পদবী ও তথ্য সংরক্ষণ করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Future Plan Modal */}
      {activeModal === 'add-plan' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-lightbulb" style={{ color: 'var(--accent-gold)' }}></i> নতুন ভবিষ্যৎ পরিকল্পনা যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handlePlanSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পরিকল্পনার শিরোনাম *</label>
                  <input type="text" class="form-control" value={planTitle} onChange={e => setPlanTitle(e.target.value)} placeholder="যেমন: বিনামূল্যে ব্লাড ব্যাংক নির্মাণ" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ক্যাটাগরি</label>
                  <input type="text" class="form-control" value={planCat} onChange={e => setPlanCat(e.target.value)} placeholder="শিক্ষা / জনস্বাস্থ্য" />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">সম্ভাব্য টার্গেট তারিখ</label>
                  <input type="date" class="form-control" value={planDate} onChange={e => setPlanDate(e.target.value)} />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">বিস্তারিত বিবরণ *</label>
                  <textarea class="form-control" rows="3" value={planDesc} onChange={e => setPlanDesc(e.target.value)} placeholder="পরিকল্পনার বিবরণ লিখুন..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>পরিকল্পনা সংরক্ষণ করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Donation Form Modal */}
      {activeModal === 'add-donation' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--primary)' }}></i> ম্যানুয়ালি অনুদানের তথ্য হিসাবভুক্ত করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleDonationSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">দাতার পূর্ণ নাম *</label>
                  <input type="text" class="form-control" value={donName} onChange={e => setDonName(e.target.value)} placeholder="যেমন: মোঃ কামরুল ইসলাম" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">অনুদানের পরিমাণ (টাকা) *</label>
                  <input type="number" class="form-control" value={donAmount} onChange={e => setDonAmount(e.target.value)} placeholder="যেমন: ৫০০, ১০০০" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পেমেন্ট মাধ্যম *</label>
                  <select class="form-control" value={donMethod} onChange={e => setDonMethod(e.target.value)}>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Cash">নগদ ক্যাশ গ্রহণ</option>
                  </select>
                </div>
                <div class="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label class="form-label">TrxID / রেফারেন্স (Optional)</label>
                  <input type="text" class="form-control" value={donTrx} onChange={e => setDonTrx(e.target.value)} placeholder="যেমন: BK9X82M1 বা ক্যাশ গ্রহণ" />
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>অনুদান হিসাবে যুক্ত করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Sub-User Account Modal (RBAC) */}
      {activeModal === 'add-sub-user' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-user-shield" style={{ color: 'var(--primary)' }}></i> নতুন এডমিন সাব-অ্যাকাউন্ট (RBAC)</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleSubUserSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">নাম *</label>
                  <input type="text" class="form-control" value={subName} onChange={e => setSubName(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ব্যবহারকারী নাম (Username) *</label>
                  <input type="text" class="form-control" value={subUsername} onChange={e => setSubUsername(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পাসওয়ার্ড *</label>
                  <input type="password" class="form-control" value={subPass} onChange={e => setSubPass(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">অর্পিত রোল (Assigned Role & Permissions) *</label>
                  <select class="form-control" value={subRole} onChange={e => setSubRole(e.target.value)}>
                    <option value="BLOOD_ADMIN">রক্তদান ব্যবস্থাপক (Blood Manager)</option>
                    <option value="MEDIA_ADMIN">ছবি ও গ্যালারি সম্পাদক (Media Admin)</option>
                    <option value="CONTENT_ADMIN">সংবাদ ও পোস্ট সম্পাদক (Content Admin)</option>
                    <option value="SUPER_ADMIN">সুপার এডমিন (Super Admin)</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>অ্যাকাউন্ট তৈরি করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
