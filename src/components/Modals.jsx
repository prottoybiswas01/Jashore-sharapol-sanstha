import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Modals({ activeModal, onClose, onShowToast }) {
  const { 
    settings, updateSiteSettings, addActivity, addFuturePlan, 
    addCommitteeMember, addBloodDonor, addBloodRequest, createSubAdminUser 
  } = useData();

  // Dynamic Site Settings Form State
  const [siteForm, setSiteForm] = useState({
    topTickerNotice: settings.topTickerNotice || '',
    heroTitleText: settings.heroTitleText || '',
    heroDescription: settings.heroDescription || '',
    aboutDescription: settings.aboutDescription || '',
    contactPhone: settings.contactPhone || '',
    contactEmail: settings.contactEmail || '',
    contactAddress: settings.contactAddress || ''
  });

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateSiteSettings(siteForm);
    onClose();
  };

  // 1. Blood Request Form
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

  // 2. Blood Donor Register Form
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

  // 3. Admin Add Member Form
  const [memName, setMemName] = useState('');
  const [memRole, setMemRole] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memImg, setMemImg] = useState('');

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    addCommitteeMember({ name: memName, role: memRole, phone: memPhone || '01700-000000', image: memImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' });
    onClose();
    setMemName(''); setMemRole(''); setMemPhone(''); setMemImg('');
  };

  // 4. Admin Add Activity Form
  const [actTitle, setActTitle] = useState('');
  const [actCat, setActCat] = useState('স্বাস্থ্য সেবা');
  const [actDate, setActDate] = useState('');
  const [actLoc, setActLoc] = useState('যশোর');
  const [actImg, setActImg] = useState('');
  const [actDesc, setActDesc] = useState('');

  const handleActSubmit = (e) => {
    e.preventDefault();
    addActivity({ title: actTitle, category: actCat, date: actDate, location: actLoc, image: actImg || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', description: actDesc });
    onClose();
    setActTitle(''); setActDate(''); setActDesc('');
  };

  // 5. Admin Add Sub-User (RBAC) Form
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

      {/* Admin Add Activity Modal */}
      {activeModal === 'add-activity' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title">নতুন কাজের রেকর্ড যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleActSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">শিরোনাম *</label>
                  <input type="text" class="form-control" value={actTitle} onChange={e => setActTitle(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">তারিখ *</label>
                  <input type="date" class="form-control" value={actDate} onChange={e => setActDate(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ছবি ইউআরএল (Image URL)</label>
                  <input type="url" class="form-control" value={actImg} onChange={e => setActImg(e.target.value)} placeholder="https://..." />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">বিবরণ</label>
                  <textarea class="form-control" rows="3" value={actDesc} onChange={e => setActDesc(e.target.value)} required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>রেকর্ড প্রকাশ করুন</button>
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
              <h3 class="modal-title">নতুন কমিটি পদবী যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleMemberSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">সদস্যের নাম *</label>
                  <input type="text" class="form-control" value={memName} onChange={e => setMemName(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">পদবী (Role) *</label>
                  <input type="text" class="form-control" value={memRole} onChange={e => setMemRole(e.target.value)} placeholder="যেমন: সভাপতি / সাধারণ সম্পাদক" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">মোবাইল নম্বর</label>
                  <input type="tel" class="form-control" value={memPhone} onChange={e => setMemPhone(e.target.value)} />
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">ছবি লিংক</label>
                  <input type="url" class="form-control" value={memImg} onChange={e => setMemImg(e.target.value)} />
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>পদবী সংরক্ষণ করুন</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Sub-Admin Account Modal (RBAC) */}
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
                    <option value="BLOOD_ADMIN">রক্তদান ব্যবস্থাপক (Blood Manager - রক্তের আবেদন ও ডোনার ডিরেক্টরি)</option>
                    <option value="MEDIA_ADMIN">ছবি ও গ্যালারি সম্পাদক (Media Admin - ফটো ও কাজের রেকর্ড)</option>
                    <option value="CONTENT_ADMIN">সংবাদ ও পোস্ট সম্পাদক (Content Admin - পোস্ট ও ভবিষ্যৎ পরিকল্পনা)</option>
                    <option value="SUPER_ADMIN">সুপার এডমিন (Super Admin - সম্পূর্ণ অ্যাক্সেস)</option>
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
