import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function AdminDashboard({ onOpenModal }) {
  const { user, login, logout, hasPermission } = useAuth();
  const { 
    settings, activities, plans, committee, donors, bloodRequests, donations, subAdminUsers,
    deleteActivity, deleteFuturePlan, deleteCommitteeMember, deleteBloodDonor, deleteBloodRequest,
    deleteSubAdminUser, fetchAdminUsers
  } = useData();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  useEffect(() => {
    if (user && hasPermission('manage_roles')) {
      fetchAdminUsers();
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (!res.success) {
      alert(res.message);
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

          {/* Quick Demo Role Logins */}
          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>কুইক ডেমো লগইন (রোলস টেস্ট করুন):</p>
            <div class="flex gap-1 flex-wrap">
              <button class="btn btn-outline btn-sm" onClick={() => { setUsername('admin'); setPassword('admin123'); }}>
                সুপার এডমিন
              </button>
              <button class="btn btn-outline btn-sm" onClick={() => { setUsername('bloodadmin'); setPassword('blood123'); }}>
                রক্তদান ম্যানেজার
              </button>
              <button class="btn btn-outline btn-sm" onClick={() => { setUsername('mediaadmin'); setPassword('media123'); }}>
                মিডিয়া এডমিন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalDonationSum = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div class="admin-layout">
      {/* Sidebar Nav */}
      <aside class="admin-sidebar">
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.1rem' }}><i class="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> এডমিন ড্যাশবোর্ড</h3>
          <small style={{ color: '#94a3b8' }}>যশোর শারাপোল সংস্থা &bull; <strong>{user.name} ({user.role})</strong></small>
        </div>

        <div class={`admin-menu-item ${activeAdminTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveAdminTab('overview')}>
          <i class="fa-solid fa-chart-pie"></i> ওভারভিউ
        </div>

        {hasPermission('manage_site') && (
          <div class={`admin-menu-item ${activeAdminTab === 'site-cms' ? 'active' : ''}`} onClick={() => setActiveAdminTab('site-cms')}>
            <i class="fa-solid fa-pen-to-square"></i> ওয়েবসাইট কনটেন্ট এডিটর
          </div>
        )}

        {hasPermission('manage_media') && (
          <div class={`admin-menu-item ${activeAdminTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveAdminTab('activities')}>
            <i class="fa-solid fa-list-check"></i> কাজের রেকর্ড পরিচালনা
          </div>
        )}

        {hasPermission('manage_content') && (
          <div class={`admin-menu-item ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveAdminTab('plans')}>
            <i class="fa-solid fa-lightbulb"></i> ভবিষ্যৎ পরিকল্পনা
          </div>
        )}

        {hasPermission('manage_committee') && (
          <div class={`admin-menu-item ${activeAdminTab === 'committee' ? 'active' : ''}`} onClick={() => setActiveAdminTab('committee')}>
            <i class="fa-solid fa-users-gear"></i> পদবী ও সদস্যবৃন্দ
          </div>
        )}

        {hasPermission('manage_blood') && (
          <div class={`admin-menu-item ${activeAdminTab === 'donors' ? 'active' : ''}`} onClick={() => setActiveAdminTab('donors')}>
            <i class="fa-solid fa-droplet"></i> রক্তদাতা ও আবেদন
          </div>
        )}

        {hasPermission('manage_roles') && (
          <div class={`admin-menu-item ${activeAdminTab === 'rbac' ? 'active' : ''}`} onClick={() => setActiveAdminTab('rbac')}>
            <i class="fa-solid fa-user-gear"></i> আরবিএসি (RBAC) রোলস ও ইউজার্স
          </div>
        )}

        <div class="admin-menu-item" style={{ color: '#f87171', marginTop: '2rem' }} onClick={logout}>
          <i class="fa-solid fa-right-from-bracket"></i> লগআউট করুন
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main class="admin-content">
        
        {/* 1. OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>এডমিন ড্যাশবোর্ড ওভারভিউ</h2>
              <span class="badge badge-primary"><i class="fa-solid fa-circle" style={{ fontSize: '0.5rem', marginRight: '0.3rem' }}></i> আপনার রোল: {user.role}</span>
            </div>

            <div class="grid grid-cols-4 gap-2" style={{ marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>মোট সম্পন্ন কাজ</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{activities.length}</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>নিবন্ধিত রক্তদাতা</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blood-red)' }}>{donors.length}</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>কমিটির পদবী সংখ্যা</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{committee.length}</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>মোট প্রাপ্ত অনুদান</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>৳ {totalDonationSum.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}><i class="fa-solid fa-bolt" style={{ color: 'var(--accent-gold)' }}></i> অনুমোদিত কুইক অ্যাকশন (RBAC)</h3>
              <div class="flex gap-2 flex-wrap">
                {hasPermission('manage_site') && <button class="btn btn-outline btn-sm" onClick={() => onOpenModal('edit-site-settings')}><i class="fa-solid fa-pen"></i> ওয়েবসাইট কনটেন্ট সম্পাদনা</button>}
                {hasPermission('manage_media') && <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i class="fa-solid fa-plus"></i> নতুন কাজের রেকর্ড যোগ (ছবি ফাইল আপলোড)</button>}
                {hasPermission('manage_content') && <button class="btn btn-outline btn-sm" onClick={() => onOpenModal('add-plan')}><i class="fa-solid fa-lightbulb"></i> নতুন ভবিষ্যৎ পরিকল্পনা যোগ</button>}
                {hasPermission('manage_committee') && <button class="btn btn-secondary btn-sm" onClick={() => onOpenModal('add-member')}><i class="fa-solid fa-user-plus"></i> নতুন কমিটি পদবী যোগ</button>}
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
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-activity')}><i class="fa-solid fa-plus"></i> নতুন পোস্ট যোগ (ছবি সরাসরি আপলোড)</button>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ছবি</th>
                    <th>শিরোনাম</th>
                    <th>ক্যাটাগরি</th>
                    <th>তারিখ</th>
                    <th>স্থান</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map(a => (
                    <tr key={a.id}>
                      <td><img src={a.image} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} alt={a.title} /></td>
                      <td><strong>{a.title}</strong></td>
                      <td>{a.category}</td>
                      <td>{a.date}</td>
                      <td>{a.location}</td>
                      <td>
                        <button class="btn btn-outline btn-sm" onClick={() => deleteActivity(a.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PLANS (FUTURE PLANS) */}
        {activeAdminTab === 'plans' && hasPermission('manage_content') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>ভবিষ্যৎ কাজের পরিকল্পনা</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-plan')}><i class="fa-solid fa-plus"></i> নতুন পরিকল্পনা যোগ করুন</button>
            </div>
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
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.category}</td>
                      <td>{p.targetDate || '-'}</td>
                      <td><span class="badge badge-gold">{p.status || 'চলমান'}</span></td>
                      <td>
                        <button class="btn btn-outline btn-sm" onClick={() => deleteFuturePlan(p.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. COMMITTEE */}
        {activeAdminTab === 'committee' && hasPermission('manage_committee') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>পদবী ও কমিটির সদস্যবৃন্দ</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-member')}><i class="fa-solid fa-user-plus"></i> নতুন পদবী/সদস্য যোগ (ছবি সরাসরি আপলোড)</button>
            </div>
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
                    <tr key={c.id}>
                      <td><img src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt={c.name} /></td>
                      <td><strong>{c.name}</strong></td>
                      <td><span class="badge badge-primary">{c.role}</span></td>
                      <td>{c.phone}</td>
                      <td>
                        <button class="btn btn-outline btn-sm" onClick={() => deleteCommitteeMember(c.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {bloodRequests.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.patientName}</strong></td>
                      <td><span class="badge badge-blood">{r.bloodGroup}</span></td>
                      <td>{r.hospital}</td>
                      <td>{r.contact}</td>
                      <td>
                        <button class="btn btn-primary btn-sm" onClick={() => deleteBloodRequest(r.id)}>
                          <i class="fa-solid fa-check"></i> সম্পন্ন নিশ্চিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. RBAC ROLES & SUB-ADMIN USERS (SUPER ADMIN ONLY) */}
        {activeAdminTab === 'rbac' && hasPermission('manage_roles') && (
          <div>
            <div class="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2>রোলস ও এডমিন সাব-অ্যাকাউন্ট (RBAC Management)</h2>
              <button class="btn btn-primary btn-sm" onClick={() => onOpenModal('add-sub-user')}><i class="fa-solid fa-user-plus"></i> নতুন এডমিন অ্যাকাউন্ট তৈরি</button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>এডমিনের নাম</th>
                    <th>ইউজারনাম</th>
                    <th>অর্পিত রোল (Assigned Role)</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {subAdminUsers.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td><code>{u.username}</code></td>
                      <td><span class="badge badge-gold">{u.role}</span></td>
                      <td>
                        {u.username !== 'admin' && (
                          <button class="btn btn-outline btn-sm" onClick={() => deleteSubAdminUser(u.id)} style={{ color: 'var(--blood-red)', borderColor: 'var(--blood-red)' }}>
                            <i class="fa-solid fa-trash"></i> মুছে ফেলুন
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
