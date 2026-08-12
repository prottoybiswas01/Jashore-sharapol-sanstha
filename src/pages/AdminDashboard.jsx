import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { EXECUTIVE_DESIGNATIONS } from '../constants/committeeRoles';

export default function AdminDashboard({ onOpenModal, onNavigate }) {
  const { user, login, logout, hasPermission, token } = useAuth();
  const { 
    settings, activities, plans, committee, donors, bloodRequests, donations, subAdminUsers, ideas,
    deleteActivity, deleteFuturePlan, deleteCommitteeMember, assignUserCommitteeRole, deleteBloodDonor, deleteBloodRequest,
    deleteSubAdminUser, fetchAdminUsers, showToast, setEditingActivity, updateIdeaStatus
  } = useData();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rbacSearchQuery, setRbacSearchQuery] = useState('');
  const [committeeSearchQuery, setCommitteeSearchQuery] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAdminUsers();
    }
  }, [user, activeAdminTab]);

  const handleTabClick = (tabId) => {
    setActiveAdminTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password, email);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handlePromoteRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchAdminUsers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      showToast('রোল আপডেট করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '3rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.75rem' }}>
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>এডমিন প্যানেলে লগইন</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>দুরন্ত (Duronto) অফিশিয়াল প্যানেল পরিচালনা করুন</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className="form-label">ব্যবহারকারী নাম (Username) *</label>
              <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label">পাসওয়ার্ড (Password) *</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-right-to-bracket"></i> প্রবেশ করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalDonationSum = donations.reduce((sum, d) => sum + (parseInt(d.amount) || 0), 0);

  return (
    <div>
      {/* Mobile Admin Bar */}
      <div className="admin-mobile-bar">
        <button className="btn btn-outline btn-sm" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
          <i className="fa-solid fa-bars"></i> {isMobileSidebarOpen ? 'মেনু বন্ধ করুন' : 'এডমিন নেভিগেশন'}
        </button>
        {onNavigate && (
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('home')}>
            <i className="fa-solid fa-globe"></i> ওয়েবসাইটে ফেরত যান
          </button>
        )}
      </div>

      <div className="admin-layout">
        {/* Sidebar Nav */}
        <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.2rem' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> এডমিন প্যানেল
            </h3>
            <small style={{ color: '#94a3b8', display: 'block' }}>
              {user.name} &bull; <strong style={{ color: 'var(--primary-light)' }}>{user.role}</strong>
            </small>
          </div>

          <div className={`admin-menu-item ${activeAdminTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabClick('overview')}>
            <i className="fa-solid fa-chart-pie"></i> ওভারভিউ
          </div>

          {hasPermission('manage_site') && (
            <div className={`admin-menu-item ${activeAdminTab === 'site-cms' ? 'active' : ''}`} onClick={() => handleTabClick('site-cms')}>
              <i className="fa-solid fa-pen-to-square"></i> ওয়েবসাইট কনটেন্ট এডিটর
            </div>
          )}

          {hasPermission('manage_media') && (
            <div className={`admin-menu-item ${activeAdminTab === 'activities' ? 'active' : ''}`} onClick={() => handleTabClick('activities')}>
              <i className="fa-solid fa-list-check"></i> কাজের রেকর্ড পরিচালনা
            </div>
          )}

          {hasPermission('manage_content') && (
            <div className={`admin-menu-item ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => handleTabClick('plans')}>
              <i className="fa-solid fa-lightbulb"></i> ভবিষ্যৎ পরিকল্পনা
            </div>
          )}

          {hasPermission('manage_committee') && (
            <div className={`admin-menu-item ${activeAdminTab === 'committee' ? 'active' : ''}`} onClick={() => handleTabClick('committee')}>
              <i className="fa-solid fa-users-gear"></i> পদবী ও সদস্যবৃন্দ
            </div>
          )}

          {hasPermission('manage_committee') && (
            <div className={`admin-menu-item ${activeAdminTab === 'member-ideas' ? 'active' : ''}`} onClick={() => handleTabClick('member-ideas')}>
              <i className="fa-solid fa-lightbulb"></i> মেম্বারদের প্রেরিত আইডিয়া ({ideas.length})
            </div>
          )}

          {hasPermission('manage_blood') && (
            <div className={`admin-menu-item ${activeAdminTab === 'donors' ? 'active' : ''}`} onClick={() => handleTabClick('donors')}>
              <i className="fa-solid fa-droplet"></i> রক্তদাতা ও আবেদন
            </div>
          )}

          {hasPermission('manage_all') && (
            <div className={`admin-menu-item ${activeAdminTab === 'donations' ? 'active' : ''}`} onClick={() => handleTabClick('donations')}>
              <i className="fa-solid fa-hand-holding-dollar"></i> অনুদান হিসাব ও ভেরিফিকেশন
            </div>
          )}

          {hasPermission('manage_roles') && (
            <div className={`admin-menu-item ${activeAdminTab === 'rbac' ? 'active' : ''}`} onClick={() => handleTabClick('rbac')}>
              <i className="fa-solid fa-user-gear"></i> আরবিএসি (RBAC) রোলস ও ইউজার্স
            </div>
          )}

          {onNavigate && (
            <div className="admin-menu-item" style={{ color: 'var(--primary-light)', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem' }} onClick={() => onNavigate('home')}>
              <i className="fa-solid fa-globe"></i> মূল ওয়েবসাইটে ফেরত যান
            </div>
          )}

          <div className="admin-menu-item" style={{ color: '#f87171', marginTop: '0.4rem' }} onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> লগআউট করুন
          </div>
        </aside>

        {/* Main Admin Content Area */}
        <main className="admin-content">
          
          {/* 1. OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>এডমিন ড্যাশবোর্ড ওভারভিউ</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>স্বাগতম, {user.name}! প্যানেলের সকল সেকশন পরিচালনা করুন</p>
                </div>
                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <button className="btn btn-outline btn-sm" onClick={() => onNavigate('home')}>
                      <i className="fa-solid fa-globe"></i> মূল ওয়েবসাইট
                    </button>
                  )}
                  <span className="badge badge-primary"><i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.3rem' }}></i> আপনার রোল: {user.role}</span>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>মোট সম্পন্ন কাজ</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{activities.length}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>নিবন্ধিত রক্তদাতা</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blood-red)' }}>{donors.length}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>কমিটির পদবী সংখ্যা</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{committee.length}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>মোট প্রাপ্ত অনুদান</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>৳ {totalDonationSum.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}><i className="fa-solid fa-bolt" style={{ color: 'var(--accent-gold)' }}></i> অনুমোদিত কুইক অ্যাকশন (RBAC)</h3>
                <div className="quick-actions-grid">
                  {hasPermission('manage_site') && <button className="btn btn-outline btn-sm" onClick={() => onOpenModal('edit-site-settings')}><i className="fa-solid fa-pen"></i> ওয়েবসাইট কনটেন্ট সম্পাদনা</button>}
                  {hasPermission('manage_media') && <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i className="fa-solid fa-plus"></i> নতুন কাজের রেকর্ড যোগ (ছবি আপলোড)</button>}
                  {hasPermission('manage_content') && <button className="btn btn-outline btn-sm" onClick={() => onOpenModal('add-plan')}><i className="fa-solid fa-lightbulb"></i> নতুন ভবিষ্যৎ পরিকল্পনা যোগ</button>}
                  {hasPermission('manage_committee') && <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('add-member')}><i className="fa-solid fa-user-plus"></i> নতুন কমিটি পদবী যোগ</button>}
                  {hasPermission('manage_all') && <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-donation')}><i className="fa-solid fa-hand-holding-dollar"></i> ম্যানুয়ালি অনুদান হিসাব যোগ</button>}
                  {hasPermission('manage_roles') && <button className="btn btn-blood btn-sm" onClick={() => onOpenModal('add-sub-user')}><i className="fa-solid fa-user-gear"></i> নতুন এডমিন রোল তৈরি</button>}
                </div>
              </div>
            </div>
          )}
        {activeAdminTab === 'site-cms' && hasPermission('manage_site') && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>ওয়েবসাইট কনটেন্ট এডিটর (Dynamic CMS)</h2>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('edit-site-settings')}><i className="fa-solid fa-pen-to-square"></i> কনটেন্ট সম্পাদন করুন</button>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>টপ জরুরি নোটিশ:</h4>
              <p style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{settings.topTickerNotice}</p>

              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>প্রধান শিরোনাম (Hero Title):</h4>
              <p style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontWeight: 700 }}>{settings.heroTitleText}</p>

              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>হোম বিবরণ:</h4>
              <p style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{settings.heroDescription}</p>
            </div>
          </div>
        )}

        {/* 3. ACTIVITIES */}
        {activeAdminTab === 'activities' && hasPermission('manage_media') && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>সামাজিক কাজের রেকর্ডসমূহ</h2>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i className="fa-solid fa-plus"></i> নতুন পোস্ট যোগ (ছবি আপলোড)</button>
            </div>
            {activities.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                বর্তমানে কোনো কাজের পোস্ট নেই। উপরের "+ নতুন পোস্ট যোগ" বাটনে ক্লিক করে ডিভাইস থেকে ছবি সরাসরি আপলোড করুন।
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ছবি</th>
                      <th>শিরোনাম ও উপ-শিরোনাম</th>
                      <th>ক্যাটাগরি</th>
                      <th>তারিখ</th>
                      <th>মোট খরচ</th>
                      <th>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(a => (
                      <tr key={a.id || a._id}>
                        <td><img src={a.image} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} alt={a.title} /></td>
                        <td>
                          <strong>{a.title}</strong>
                          {a.subtitle && <small style={{ display: 'block', color: 'var(--text-muted)' }}>{a.subtitle}</small>}
                        </td>
                        <td>{a.category}</td>
                        <td>{a.date}</td>
                        <td>
                          {a.expense > 0 ? (
                            <strong style={{ color: '#b45309' }}>৳ {parseInt(a.expense).toLocaleString()}</strong>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button className="btn btn-outline btn-sm" onClick={() => { setEditingActivity(a); onOpenModal('edit-activity'); }} style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} title="সম্পাদনা করুন">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => deleteActivity(a._id || a.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }} title="মুছে ফেলুন">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. PLANS (FUTURE PLANS) */}
        {activeAdminTab === 'plans' && hasPermission('manage_content') && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>ভবিষ্যৎ কাজের পরিকল্পনা</h2>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-plan')}><i className="fa-solid fa-plus"></i> নতুন পরিকল্পনা যোগ করুন</button>
            </div>
            {plans.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                বর্তমানে কোনো ভবিষ্যৎ পরিকল্পনা নেই। "+ নতুন পরিকল্পনা যোগ করুন" বাটনে ক্লিক করে তথ্য সংরক্ষণ করুন।
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>পরিকল্পনার শিরোনাম</th>
                      <th>ক্যাটাগরি</th>
                      <th>টার্গেট তারিখ</th>
                      <th>স্ট্যাটাস</th>
                      <th>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(p => (
                      <tr key={p.id || p._id}>
                        <td><strong>{p.title}</strong></td>
                        <td>{p.category}</td>
                        <td>{p.targetDate || '-'}</td>
                        <td><span className="badge badge-gold">{p.status || 'চলমান'}</span></td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => deleteFuturePlan(p._id || p.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. COMMITTEE & DESIGNATION ASSIGNMENT */}
        {activeAdminTab === 'committee' && hasPermission('manage_committee') && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>পদবী ও কমিটি কর্মকর্তা ম্যানেজমেন্ট</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  নিবন্ধিত মেম্বারদের সরাসরি অফিশিয়াল কমিটি পদবী বরাদ্দ করুন অথবা নতুন পদবী যুক্ত করুন
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-member')}>
                <i className="fa-solid fa-user-plus"></i> নতুন কাস্টম পদবী/সদস্য যোগ
              </button>
            </div>

            {/* Section 1: Assign Committee Designation to Registered Users */}
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                <i className="fa-solid fa-user-gear" style={{ color: 'var(--primary)' }}></i> নিবন্ধিত মেম্বারদের কমিটিতে পদবী বরাদ্দকরণ
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                যেসব ইউজার রেজিস্ট্রেশন করেছেন তাদের খুঁজে নিন এবং নিচে থাকা অফিশিয়াল ড্রপডাউন থেকে পদবী (সভাপতি, সহ-সভাপতি, সম্পাদক ইত্যাদি) সিলেক্ট করুন।
              </p>

              {/* Search input for registered users */}
              <div style={{ marginBottom: '1.25rem', maxWidth: '480px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="🔍 ইউজার নাম, ইমেইল বা মোবাইল দিয়ে সার্চ করুন..." 
                  value={committeeSearchQuery}
                  onChange={e => setCommitteeSearchQuery(e.target.value)}
                />
              </div>

              {subAdminUsers.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  বর্তমানে কোনো নিবন্ধিত ইউজার পাওয়া যায়নি। ওয়েবসাইট বা মডালে নিবন্ধিত ইউজারদের তালিকা এখানে দেখাবে।
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>নিবন্ধিত ইউজার নাম</th>
                        <th>মোবাইল / ইমেইল</th>
                        <th>বর্তমান অর্পিত কমিটি পদবী</th>
                        <th>অফিশিয়াল পদবী বরাদ্দ করুন (Assign Post)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subAdminUsers
                        .filter(u => u.username !== 'prottoy' && u.username !== 'admin')
                        .filter(u => {
                          if (!committeeSearchQuery.trim()) return true;
                          const q = committeeSearchQuery.toLowerCase();
                          return (
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.username && u.username.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            (u.phone && u.phone.includes(q))
                          );
                        })
                        .map(u => (
                          <tr key={u._id || u.id}>
                            <td>
                              <strong>{u.name}</strong>
                              <small style={{ display: 'block', color: 'var(--text-muted)' }}>@{u.username}</small>
                            </td>
                            <td>
                              <div>{u.phone || 'মোবাইল নেই'}</div>
                              {u.email && <small style={{ color: 'var(--text-muted)' }}>{u.email}</small>}
                            </td>
                            <td>
                              {u.committeeRole ? (
                                <span className="badge badge-gold" style={{ fontWeight: 700 }}>
                                  <i className="fa-solid fa-crown" style={{ marginRight: '0.3rem' }}></i> {u.committeeRole}
                                </span>
                              ) : (
                                <span className="badge" style={{ background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
                                  সাধারণ সদস্য (পদবী নেই)
                                </span>
                              )}
                            </td>
                            <td>
                              <select 
                                className="form-control" 
                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 'auto', minWidth: '220px' }}
                                value={u.committeeRole || ''}
                                onChange={(e) => assignUserCommitteeRole(u._id || u.id, e.target.value)}
                              >
                                <option value="">-- কোনো পদবী নেই (Remove Post) --</option>
                                {EXECUTIVE_DESIGNATIONS.map(d => (
                                  <option key={d.id} value={d.title}>
                                    {d.title}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 2: Current Executive Committee Roster */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-users-viewfinder" style={{ color: 'var(--secondary)' }}></i> বর্তমানে সংরক্ষিত কার্যনির্বাহী কমিটির তালিকা ({committee.length} জন)
              </h3>
              {committee.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  বর্তমানে কোনো সংরক্ষিত সদস্য তালিকা নেই। ওপরের টেবিল থেকে ইউজারদের পদবী সিলেক্ট করুন অথবা "+ নতুন পদবী যোগ" বাটনে ক্লিক করুন।
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ছবি</th>
                        <th>নাম</th>
                        <th>অর্পিত পদবী (Executive Role)</th>
                        <th>মোবাইল নম্বর</th>
                        <th>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {committee.map(c => (
                        <tr key={c.id || c._id}>
                          <td><img src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt={c.name} /></td>
                          <td><strong>{c.name}</strong></td>
                          <td><span className="badge badge-primary">{c.role}</span></td>
                          <td>{c.phone}</td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => deleteCommitteeMember(c._id || c.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }} title="পদবী প্রত্যাহার / মুছে ফেলুন">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. DONORS & REQUESTS */}
        {activeAdminTab === 'donors' && hasPermission('manage_blood') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>রক্তদাতা ও রক্ত আবেদন ম্যানেজমেন্ট</h2>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--blood-red)' }}>জরুরি রক্তের আবেদনসমূহ</h3>
            <div class="table-responsive" style={{ marginBottom: '2rem' }}>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>রোগীর নাম</th>
                    <th>গ্রুপ</th>
                    <th>হাসপাতাল</th>
                    <th>যোগাযোগ</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodRequests.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>কোনো আবেদন নেই।</td></tr>
                  ) : (
                    bloodRequests.map(r => (
                      <tr key={r.id || r._id}>
                        <td><strong>{r.patientName}</strong></td>
                        <td><span class="badge badge-blood">{r.bloodGroup}</span></td>
                        <td>{r.hospital}</td>
                        <td>{r.contact}</td>
                        <td>
                          <button class="btn btn-primary btn-sm" onClick={() => deleteBloodRequest(r._id || r.id)}>
                            <i class="fa-solid fa-check"></i> সম্পন্ন নিশ্চিত
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>নিবন্ধিত রক্তদাতাদের তালিকা</h3>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>গ্রুপ</th>
                    <th>উপজেলা</th>
                    <th>মোবাইল</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>কোনো রক্তদাতা নিবন্ধিত নেই।</td></tr>
                  ) : (
                    donors.map(d => (
                      <tr key={d.id || d._id}>
                        <td><strong>{d.name}</strong></td>
                        <td><span class="badge badge-blood">{d.bloodGroup}</span></td>
                        <td>{d.upazila}</td>
                        <td>{d.phone}</td>
                        <td>
                          <button class="btn btn-outline btn-sm" onClick={() => deleteBloodDonor(d._id || d.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. FINANCIAL DONATIONS LEDGER */}
        {activeAdminTab === 'donations' && hasPermission('manage_all') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2>অনুদানের হিসাব ও রিয়েল-টাইম রেজিস্টার</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>মোট সর্বমোট সংগৃহীত অনুদান: <strong style={{ color: 'var(--primary)' }}>৳ {totalDonationSum.toLocaleString()}</strong></p>
              </div>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-donation')}><i class="fa-solid fa-plus"></i> ম্যানুয়ালি অনুদান যোগ</button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>দাতা / শুভানুধ্যায়ী</th>
                    <th>অনুদানের পরিমাণ</th>
                    <th>পেমেন্ট মাধ্যম</th>
                    <th>TrxID / রেফারেন্স</th>
                    <th>তারিখ</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>বর্তমানে কোনো অনুদান রেকর্ড জমা নেই।</td></tr>
                  ) : (
                    donations.map(d => (
                      <tr key={d.id || d._id}>
                        <td><strong>{d.donorName}</strong></td>
                        <td style={{ color: 'var(--primary)', fontWeight: 700 }}>৳ {parseInt(d.amount || 0).toLocaleString()}</td>
                        <td><span class="badge badge-info">{d.method}</span></td>
                        <td><code>{d.trxId || 'N/A'}</code></td>
                        <td>{d.date || 'আজ'}</td>
                        <td><span class="badge badge-primary">{d.status || 'অনুমোদিত'}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. RBAC ROLES & SUB-ADMIN USERS (SUPER ADMIN ONLY) */}
        {activeAdminTab === 'rbac' && hasPermission('manage_roles') && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>রেজিস্ট্রার্ড ইউজার ও এডমিন রোলস (RBAC Management)</h2>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('add-sub-user')}><i className="fa-solid fa-user-plus"></i> নতুন এডমিন অ্যাকাউন্ট তৈরি</button>
            </div>

            {/* Live Search Filter Bar */}
            <div style={{ marginBottom: '1.25rem', maxWidth: '420px' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="🔍 ইউজার নাম, ইমেইল বা ভূমিকা দিয়ে ফিল্টার করুন..." 
                value={rbacSearchQuery}
                onChange={e => setRbacSearchQuery(e.target.value)}
              />
            </div>

            {/* Build guaranteed list including Developer Prottoy */}
            {(() => {
              const fullUsersList = [...subAdminUsers];
              const hasProttoy = fullUsersList.some(u => u.username === 'prottoy');
              if (!hasProttoy) {
                fullUsersList.unshift({
                  _id: 'primary-prottoy-id',
                  name: 'Developer Prottoy',
                  username: 'prottoy',
                  email: 'prottoybiswas575358@gmail.com',
                  role: 'SUPER_ADMIN',
                  permissions: ['manage_all']
                });
              }

              const filteredUsers = fullUsersList
                .filter(u => u.username !== 'admin')
                .filter(u => {
                  if (!rbacSearchQuery.trim()) return true;
                  const q = rbacSearchQuery.toLowerCase();
                  return (
                    (u.name && u.name.toLowerCase().includes(q)) ||
                    (u.username && u.username.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q)) ||
                    (u.role && u.role.toLowerCase().includes(q))
                  );
                })
                .sort((a, b) => (a.username === 'prottoy' ? -1 : b.username === 'prottoy' ? 1 : 0));

              return (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>নাম</th>
                        <th>ইউজারনাম / ইমেইল</th>
                        <th>বর্তমান রোল (Assigned Role)</th>
                        <th>রোল প্রমোট / পরিবর্তন করুন</th>
                        <th>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => {
                        const isPrimary = u.username === 'prottoy';
                        return (
                          <tr key={u._id || u.id} style={u.username === 'prottoy' ? { background: 'rgba(16, 185, 129, 0.06)' } : {}}>
                            <td>
                              <strong style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{u.name}</strong>
                              {u.username === 'prottoy' && (
                                <div style={{ marginTop: '0.2rem' }}>
                                  <span className="badge badge-primary" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                                    <i className="fa-solid fa-crown" style={{ color: 'var(--accent-gold)' }}></i> প্রধান নির্দেশক ও সুপার এডমিন
                                  </span>
                                </div>
                              )}
                            </td>
                            <td>
                              <code style={{ whiteSpace: 'nowrap' }}>{u.username}</code>
                              {u.email && <small style={{ display: 'block', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{u.email}</small>}
                            </td>
                            <td><span className="badge badge-gold" style={{ whiteSpace: 'nowrap' }}>{u.role}</span></td>
                            <td>
                              {!isPrimary ? (
                                <select 
                                  className="form-control" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', minWidth: '190px' }}
                                  value={u.role}
                                  onChange={(e) => handlePromoteRole(u._id || u.id, e.target.value)}
                                >
                                  <option value="GENERAL_MEMBER">সাধারণ মেম্বার (General Member)</option>
                                  <option value="BLOOD_ADMIN">রক্তদান ম্যানেজার (Blood Manager)</option>
                                  <option value="MEDIA_ADMIN">মিডিয়া এডমিন (Media Admin)</option>
                                  <option value="CONTENT_ADMIN">পোস্ট সম্পাদক (Content Admin)</option>
                                  <option value="SUPER_ADMIN">সুপার এডমিন (Super Admin)</option>
                                </select>
                              ) : (
                                <small style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-gold)', marginRight: '0.2rem' }}></i> 
                                  প্রধান সুপার এডমিন
                                </small>
                              )}
                            </td>
                            <td>
                              {!isPrimary && (
                                <button className="btn btn-outline btn-sm" onClick={() => deleteSubAdminUser(u._id || u.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }} title="মুছে ফেলুন">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        {/* 9. MEMBER IDEAS & PROPOSALS REVIEW TAB (FOR PRESIDENT & EXECUTIVE COMMITTEE) */}
        {activeAdminTab === 'member-ideas' && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>মেম্বারদের প্রেরিত আইডিয়া ও প্রস্তাবনা রিভিউ (Member Ideas)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  সংগঠনের সাধারণ সদস্য ও রক্তদাতাদের পাঠানো নতুন প্রস্তাবনা পর্যবেক্ষণ ও অনুমোদন করুন
                </p>
              </div>
            </div>

            {ideas.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '3rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                <i className="fa-solid fa-lightbulb" style={{ fontSize: '2.5rem', color: 'var(--primary-light)', marginBottom: '1rem', display: 'block' }}></i>
                বর্তমানে কোনো সদস্যের আইডিয়া জমা নেই।
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>সদস্য বিবরণ</th>
                      <th>আইডিয়ার শিরোনাম</th>
                      <th>বিস্তারিত বিবরণ</th>
                      <th>বর্তমান স্ট্যাটাস</th>
                      <th>অনুমোদন ও ফিডব্যাক একশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map(idea => (
                      <tr key={idea._id || idea.id}>
                        <td>
                          <div className="flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                            <img 
                              src={idea.memberPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                              alt={idea.memberName} 
                            />
                            <div>
                              <strong>{idea.memberName}</strong>
                              <small style={{ display: 'block', color: 'var(--text-muted)' }}>@{idea.username}</small>
                            </div>
                          </div>
                        </td>
                        <td><strong style={{ color: 'var(--primary-dark)' }}>{idea.title}</strong></td>
                        <td style={{ minWidth: '220px', fontSize: '0.85rem' }}>{idea.details}</td>
                        <td>
                          <span className={`badge ${idea.status === 'অনুমোদিত ও গ্রহণযোগ্য' ? 'badge-primary' : 'badge-gold'}`} style={{ whiteSpace: 'nowrap' }}>
                            {idea.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1" style={{ minWidth: '180px' }}>
                            <button 
                              className="btn btn-primary btn-sm" 
                              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                              onClick={() => updateIdeaStatus(idea._id || idea.id, 'অনুমোদিত ও গ্রহণযোগ্য', 'সভাপতি ও পরিচালনা পর্ষদ কর্তৃক অনুমোদিত হয়েছে।')}
                            >
                              <i className="fa-solid fa-check"></i> অনুমোদন করুন
                            </button>
                            <button 
                              className="btn btn-outline btn-sm" 
                              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                              onClick={() => updateIdeaStatus(idea._id || idea.id, 'বিবেচনাধীন', 'পর্যবেক্ষণে রয়েছে।')}
                            >
                              পেন্ডিং রাখুন
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  </div>
);
}
