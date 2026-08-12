import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Modals({ activeModal, onClose, onShowToast }) {
  const { 
    settings, updateSiteSettings, addActivity, addFuturePlan, 
    addCommitteeMember, addBloodDonor, addBloodRequest, addDonation, createSubAdminUser 
  } = useData();

  // Helper to convert selected image file to Base64 data string for MongoDB storage
  const handleImageFileChange = (e, setImageState) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবি নির্বাচন ৫ মেগাবাইটের মধ্যে হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  // 2. Blood Request Form
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

  // 3. Blood Donor Register Form
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

  // 4. Admin Add Member Form (With Direct Photo File Upload)
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

  // 5. Admin Add Activity Form (With Direct Photo File Upload)
  const [actTitle, setActTitle] = useState('');
  const [actCat, setActCat] = useState('স্বাস্থ্য সেবা');
  const [actDate, setActDate] = useState('');
  const [actLoc, setActLoc] = useState('যশোর');
  const [actImg, setActImg] = useState('');
  const [actDesc, setActDesc] = useState('');

  const handleActSubmit = (e) => {
    e.preventDefault();
    addActivity({ 
      title: actTitle, 
      category: actCat, 
      date: actDate, 
      location: actLoc, 
      image: actImg || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 
      description: actDesc 
    });
    onClose();
    setActTitle(''); setActDate(''); setActDesc(''); setActImg('');
  };

  // 6. Admin Add Future Plan Form
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

  // 7. Admin Add Donation Manual Form
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

  // 8. Admin Add Sub-User (RBAC) Form
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
                  <label class="form-label">হিরো ব্যানার ছবি আপলোড (Hero Photo Upload)</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleImageFileChange(e, (b64) => setSiteForm({ ...siteForm, heroImageUrl: b64 }))} />
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

      {/* Admin Add Activity Modal with Direct Image File Upload */}
      {activeModal === 'add-activity' && (
        <div class="modal-overlay open">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title"><i class="fa-solid fa-plus" style={{ color: 'var(--primary)' }}></i> নতুন কাজের রেকর্ড যোগ করুন</h3>
              <span class="modal-close" onClick={onClose}>&times;</span>
            </div>
            <div class="modal-body">
              <form onSubmit={handleActSubmit}>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">শিরোনাম *</label>
                  <input type="text" class="form-control" value={actTitle} onChange={e => setActTitle(e.target.value)} placeholder="কাজের নাম" required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">ক্যাটাগরি</label>
                  <input type="text" class="form-control" value={actCat} onChange={e => setActCat(e.target.value)} placeholder="স্বাস্থ্য সেবা / ত্রাণ" />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">তারিখ *</label>
                  <input type="date" class="form-control" value={actDate} onChange={e => setActDate(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: '1rem' }}>
                  <label class="form-label">কাজের ছবি সরাসরি ডিভাইস থেকে আপলোড করুন *</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleImageFileChange(e, setActImg)} required />
                  {actImg && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <small style={{ color: 'var(--primary)', fontWeight: 600 }}>ছবি লোড হয়েছে:</small>
                      <img src={actImg} style={{ width: '100px', height: '60px', objectFit: 'cover', display: 'block', borderRadius: '4px', marginTop: '0.2rem' }} alt="Preview" />
                    </div>
                  )}
                </div>
                <div class="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label class="form-label">বিবরণ</label>
                  <textarea class="form-control" rows="3" value={actDesc} onChange={e => setActDesc(e.target.value)} required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>রেকর্ড প্রকাশ ও মঙ্গোডিবিতে সেভ করুন</button>
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
                  <label class="form-label">সদস্যের ছবি সরাসরি আপলোড করুন (Direct Photo Upload)</label>
                  <input type="file" accept="image/*" class="form-control" onChange={e => handleImageFileChange(e, setMemImg)} />
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
