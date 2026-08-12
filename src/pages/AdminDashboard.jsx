import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function AdminDashboard({ onOpenModal, onNavigate }) {
  const { user, login, logout, hasPermission, token } = useAuth();
  const { 
    settings, activities, plans, committee, donors, bloodRequests, donations, subAdminUsers,
    deleteActivity, deleteFuturePlan, deleteCommitteeMember, deleteBloodDonor, deleteBloodRequest,
    deleteSubAdminUser, fetchAdminUsers, showToast, setEditingActivity
  } = useData();

  const [username, setUsername] = useState('prottoy');
  const [password, setPassword] = useState('Prottoy57@');
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && hasPermission('manage_roles')) {
      fetchAdminUsers();
    }
  }, [user]);

  const handleTabClick = (tabId) => {
    setActiveAdminTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
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
      <div style={{ padding: '5rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ width: '70px', height: '70px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>এডমিন প্যানেলে লগইন</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>যশোর শারাপোল সংস্থার অফিসিয়াল প্যানেল পরিচালনা করুন</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div class="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label class="form-label">ব্যবহারকারী নাম (Username)</label>
              <input type="text" class="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div class="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label class="form-label">পাসওয়ার্ড (Password)</label>
              <input type="password" class="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" class="btn btn-primary" style={{ width: '100%' }}>
              <i class="fa-solid fa-right-to-bracket"></i> প্রবেশ করুন
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
      <div class="admin-mobile-bar">
        <button class="btn btn-outline btn-sm" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
          <i class="fa-solid fa-bars"></i> এডমিন নেভিগেশন
        </button>
        {onNavigate && (
          <button class="btn btn-outline btn-sm" onClick={() => onNavigate('home')}>
            <i class="fa-solid fa-globe"></i> ওয়েবসাইটে ফেরত যান
          </button>
        )}
      </div>

      <div class="admin-layout">
        {/* Sidebar Nav */}
        <aside class={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.2rem' }}>
              <i class="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> এডমিন প্যানেল
            </h3>
            <small style={{ color: '#94a3b8', display: 'block' }}>
              {user.name} &bull; <strong style={{ color: 'var(--primary-light)' }}>{user.role}</strong>
            </small>
          </div>

          <div class={`admin-menu-item ${activeAdminTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabClick('overview')}>
            <i class="fa-solid fa-chart-pie"></i> ওভারভিউ
          </div>

          {hasPermission('manage_site') && (
            <div class={`admin-menu-item ${activeAdminTab === 'site-cms' ? 'active' : ''}`} onClick={() => handleTabClick('site-cms')}>
              <i class="fa-solid fa-pen-to-square"></i> ওয়েবসাইট কনটেন্ট এডিটর
            </div>
          )}

          {hasPermission('manage_media') && (
            <div class={`admin-menu-item ${activeAdminTab === 'activities' ? 'active' : ''}`} onClick={() => handleTabClick('activities')}>
              <i class="fa-solid fa-list-check"></i> কাজের রেকর্ড পরিচালনা
            </div>
          )}

          {hasPermission('manage_content') && (
            <div class={`admin-menu-item ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => handleTabClick('plans')}>
              <i class="fa-solid fa-lightbulb"></i> ভবিষ্যৎ পরিকল্পনা
            </div>
          )}

          {hasPermission('manage_committee') && (
            <div class={`admin-menu-item ${activeAdminTab === 'committee' ? 'active' : ''}`} onClick={() => handleTabClick('committee')}>
              <i class="fa-solid fa-users-gear"></i> পদবী ও সদস্যবৃন্দ
            </div>
          )}

          {hasPermission('manage_blood') && (
            <div class={`admin-menu-item ${activeAdminTab === 'donors' ? 'active' : ''}`} onClick={() => handleTabClick('donors')}>
              <i class="fa-solid fa-droplet"></i> রক্তদাতা ও আবেদন
            </div>
          )}

          {hasPermission('manage_all') && (
            <div class={`admin-menu-item ${activeAdminTab === 'donations' ? 'active' : ''}`} onClick={() => handleTabClick('donations')}>
              <i class="fa-solid fa-hand-holding-dollar"></i> অনুদান হিসাব ও ভেরিফিকেশন
            </div>
          )}

          {hasPermission('manage_roles') && (
            <div class={`admin-menu-item ${activeAdminTab === 'rbac' ? 'active' : ''}`} onClick={() => handleTabClick('rbac')}>
              <i class="fa-solid fa-user-gear"></i> আরবিএসি (RBAC) রোলস ও ইউজার্স
            </div>
          )}

          {onNavigate && (
            <div class="admin-menu-item" style={{ color: 'var(--primary-light)', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem' }} onClick={() => onNavigate('home')}>
              <i class="fa-solid fa-globe"></i> মূল ওয়েবসাইটে ফেরত যান
            </div>
          )}

          <div class="admin-menu-item" style={{ color: '#f87171', marginTop: '0.4rem' }} onClick={logout}>
            <i class="fa-solid fa-right-from-bracket"></i> লগআউট করুন
          </div>
        </aside>

        {/* Main Admin Content Area */}
        <main class="admin-content">
          
          {/* 1. OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div>
              <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>এডমিন ড্যাশবোর্ড ওভারভিউ</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>স্বাগতম, {user.name}! প্যানেলের সকল সেকশন পরিচালনা করুন</p>
                </div>
                <div class="flex items-center gap-2">
                  {onNavigate && (
                    <button class="btn btn-outline btn-sm" onClick={() => onNavigate('home')}>
                      <i class="fa-solid fa-globe"></i> মূল ওয়েবসাইট
                    </button>
                  )}
                  <span class="badge badge-primary"><i class="fa-solid fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.3rem' }}></i> আপনার রোল: {user.role}</span>
                </div>
              </div>

              <div class="admin-stats-grid">
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
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}><i class="fa-solid fa-bolt" style={{ color: 'var(--accent-gold)' }}></i> অনুমোদিত কুইক অ্যাকশন (RBAC)</h3>
                <div class="quick-actions-grid">
                  {hasPermission('manage_site') && <button class="btn btn-outline btn-sm" onClick={() => onOpenModal('edit-site-settings')}><i class="fa-solid fa-pen"></i> ওয়েবসাইট কনটেন্ট সম্পাদনা</button>}
                  {hasPermission('manage_media') && <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i class="fa-solid fa-plus"></i> নতুন কাজের রেকর্ড যোগ (ছবি আপলোড)</button>}
                  {hasPermission('manage_content') && <button class="btn btn-outline btn-sm" onClick={() => onOpenModal('add-plan')}><i class="fa-solid fa-lightbulb"></i> নতুন ভবিষ্যৎ পরিকল্পনা যোগ</button>}
                  {hasPermission('manage_committee') && <button class="btn btn-secondary btn-sm" onClick={() => onOpenModal('add-member')}><i class="fa-solid fa-user-plus"></i> নতুন কমিটি পদবী যোগ</button>}
                  {hasPermission('manage_all') && <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-donation')}><i class="fa-solid fa-hand-holding-dollar"></i> ম্যানুয়ালি অনুদান হিসাব যোগ</button>}
                  {hasPermission('manage_roles') && <button class="btn btn-blood btn-sm" onClick={() => onOpenModal('add-sub-user')}><i class="fa-solid fa-user-gear"></i> নতুন এডমিন রোল তৈরি</button>}
                </div>
              </div>
            </div>
          )}

        {/* 2. SITE CONTENT EDITOR (CMS) */}
        {activeAdminTab === 'site-cms' && hasPermission('manage_site') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>ওয়েবসাইট কনটেন্ট এডিটর (Dynamic CMS)</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('edit-site-settings')}><i class="fa-solid fa-pen-to-square"></i> কনটেন্ট সম্পাদন করুন</button>
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
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>সামাজিক কাজের রেকর্ডসমূহ</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i class="fa-solid fa-plus"></i> নতুন পোস্ট যোগ (ছবি আপলোড)</button>
            </div>
            {activities.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                বর্তমানে কোনো কাজের পোস্ট নেই। উপরের "+ নতুন পোস্ট যোগ" বাটনে ক্লিক করে ডিভাইস থেকে ছবি সরাসরি আপলোড করুন।
              </div>
            ) : (
              <div class="table-responsive">
                <table class="data-table">
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
                          <div class="flex items-center gap-1">
                            <button class="btn btn-outline btn-sm" onClick={() => { setEditingActivity(a); onOpenModal('edit-activity'); }} style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} title="সম্পাদনা করুন">
                              <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline btn-sm" onClick={() => deleteActivity(a._id || a.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }} title="মুছে ফেলুন">
                              <i class="fa-solid fa-trash"></i>
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
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>ভবিষ্যৎ কাজের পরিকল্পনা</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-plan')}><i class="fa-solid fa-plus"></i> নতুন পরিকল্পনা যোগ করুন</button>
            </div>
            {plans.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                বর্তমানে কোনো ভবিষ্যৎ পরিকল্পনা নেই। "+ নতুন পরিকল্পনা যোগ করুন" বাটনে ক্লিক করে তথ্য সংরক্ষণ করুন।
              </div>
            ) : (
              <div class="table-responsive">
                <table class="data-table">
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
                        <td><span class="badge badge-gold">{p.status || 'চলমান'}</span></td>
                        <td>
                          <button class="btn btn-outline btn-sm" onClick={() => deleteFuturePlan(p._id || p.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                            <i class="fa-solid fa-trash"></i>
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

        {/* 5. COMMITTEE */}
        {activeAdminTab === 'committee' && hasPermission('manage_committee') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>পদবী ও কমিটির সদস্যবৃন্দ</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-member')}><i class="fa-solid fa-user-plus"></i> নতুন পদবী/সদস্য যোগ (ছবি আপলোড)</button>
            </div>
            {committee.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                বর্তমানে কমিটির কোনো সদস্য তালিকা নেই। "+ নতুন পদবী/সদস্য যোগ" বাটনে ক্লিক করুন।
              </div>
            ) : (
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>ছবি</th>
                      <th>নাম</th>
                      <th>পদবী (Role)</th>
                      <th>মোবাইল নম্বর</th>
                      <th>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committee.map(c => (
                      <tr key={c.id || c._id}>
                        <td><img src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt={c.name} /></td>
                        <td><strong>{c.name}</strong></td>
                        <td><span class="badge badge-primary">{c.role}</span></td>
                        <td>{c.phone}</td>
                        <td>
                          <button class="btn btn-outline btn-sm" onClick={() => deleteCommitteeMember(c._id || c.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                            <i class="fa-solid fa-trash"></i>
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
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>রেজিস্ট্রার্ড ইউজার ও এডমিন রোলস (RBAC Management)</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-sub-user')}><i class="fa-solid fa-user-plus"></i> নতুন এডমিন অ্যাকাউন্ট তৈরি</button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>ইউজারনাম</th>
                    <th>বর্তমান রোল (Assigned Role)</th>
                    <th>রোল প্রমোট / পরিবর্তন করুন</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {[...subAdminUsers].sort((a, b) => (a.username === 'prottoy' ? -1 : b.username === 'prottoy' ? 1 : 0)).map(u => {
                    const isPrimary = u.username === 'prottoy' || u.username === 'admin';
                    return (
                      <tr key={u._id || u.id} style={u.username === 'prottoy' ? { background: 'rgba(16, 185, 129, 0.06)' } : {}}>
                        <td>
                          <strong>{u.name}</strong>
                          {u.username === 'prottoy' && (
                            <span class="badge badge-primary" style={{ marginLeft: '0.4rem', fontSize: '0.7rem' }}>
                              <i class="fa-solid fa-crown" style={{ color: 'var(--accent-gold)' }}></i> প্রধান অনার
                            </span>
                          )}
                        </td>
                        <td><code>{u.username}</code></td>
                        <td><span class="badge badge-gold">{u.role}</span></td>
                        <td>
                          {!isPrimary ? (
                            <select 
                              class="form-control" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
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
                            <small style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                              <i class="fa-solid fa-shield-halved" style={{ color: 'var(--accent-gold)', marginRight: '0.2rem' }}></i> 
                              প্রধান সুপার এডমিন
                            </small>
                          )}
                        </td>
                        <td>
                          {!isPrimary && (
                            <button class="btn btn-outline btn-sm" onClick={() => deleteSubAdminUser(u._id || u.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }} title="মুছে ফেলুন">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  </div>
);
}
