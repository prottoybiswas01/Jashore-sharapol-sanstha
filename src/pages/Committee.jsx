import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { EXECUTIVE_DESIGNATIONS, getRoleMeta } from '../constants/committeeRoles';

export default function Committee() {
  const { committee } = useData();
  const [filterRole, setFilterRole] = useState('ALL');

  // Order of roles according to executive hierarchy
  const roleHierarchyOrder = EXECUTIVE_DESIGNATIONS.map(d => d.title);

  // Group members by role title
  const groupedMembers = roleHierarchyOrder.reduce((acc, roleTitle) => {
    const membersInRole = committee.filter(
      m => m.role && m.role.trim().toLowerCase() === roleTitle.trim().toLowerCase()
    );
    if (membersInRole.length > 0) {
      acc.push({ roleTitle, members: membersInRole, meta: getRoleMeta(roleTitle) });
    }
    return acc;
  }, []);

  // Collect any custom non-standard roles
  const knownTitlesSet = new Set(roleHierarchyOrder.map(t => t.trim().toLowerCase()));
  const customMembers = committee.filter(m => !m.role || !knownTitlesSet.has(m.role.trim().toLowerCase()));
  if (customMembers.length > 0) {
    groupedMembers.push({
      roleTitle: 'অন্যান্য দায়িত্বপ্রাপ্ত কর্মকর্তা',
      members: customMembers,
      meta: { icon: 'fa-solid fa-user-tie', badgeStyle: { background: 'var(--primary-light)', color: 'var(--primary-dark)', borderColor: 'var(--border-color)' } }
    });
  }

  const displayedGroups = filterRole === 'ALL' 
    ? groupedMembers 
    : groupedMembers.filter(g => g.roleTitle === filterRole);

  return (
    <section className="page-section" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Executive Header Banner */}
        <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
          <div className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="fa-solid fa-crown" style={{ color: 'var(--accent-gold)' }}></i> সংগঠনের অফিশিয়াল নেতৃত্ব
          </div>
          <h2 className="section-title">কার্যনির্বাহী কমিটি ও পরিষদবর্গ</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem', maxWidth: '650px', margin: '0.5rem auto 0' }}>
            দুরন্ত (Duronto) সামাজিক কল্যাণ সংস্থার মানবিক ও উন্নয়ন কার্যক্রম পরিচালনাকারী নির্বাহী কর্মকর্তাবৃন্দ
          </p>
        </div>

        {/* Quick Designation Filter Pills */}
        <div className="flex justify-center gap-2 flex-wrap" style={{ marginBottom: '2.5rem' }}>
          <button 
            className={`btn btn-sm ${filterRole === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterRole('ALL')}
          >
            <i className="fa-solid fa-list-ul"></i> সকল পদবী ({committee.length})
          </button>
          {groupedMembers.map(g => (
            <button 
              key={g.roleTitle}
              className={`btn btn-sm ${filterRole === g.roleTitle ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterRole(g.roleTitle)}
            >
              <i className={g.meta.icon}></i> {g.roleTitle} ({g.members.length})
            </button>
          ))}
        </div>

        {/* Render Executive Role Groups */}
        {displayedGroups.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', color: 'var(--primary-light)', marginBottom: '1rem', display: 'block' }}></i>
            বর্তমানে কোনো পদবী ও কর্মকর্তার তথ্য যুক্ত নেই।
          </div>
        ) : (
          displayedGroups.map(group => (
            <div key={group.roleTitle} style={{ marginBottom: '2.5rem' }}>
              {/* Designation Section Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderLeft: '5px solid var(--primary)',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div className="flex items-center gap-2">
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: group.meta.badgeStyle.background || 'var(--primary-light)',
                    color: group.meta.badgeStyle.color || 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '1.1rem'
                  }}>
                    <i className={group.meta.icon}></i>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {group.roleTitle}
                  </h3>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                  {group.members.length} জন কর্মকর্তা
                </span>
              </div>

              {/* Members Grid inside Designation Group */}
              <div className="grid grid-cols-3 gap-3">
                {group.members.map(member => (
                  <div className="committee-card" key={member._id || member.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="member-photo" 
                        />
                      ) : (
                        <div className="avatar-placeholder avatar-placeholder-lg">
                          <i className="fa-solid fa-user"></i>
                        </div>
                      )}
                      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge" style={{
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.65rem',
                          background: group.meta.badgeStyle.background || 'var(--primary-light)',
                          color: group.meta.badgeStyle.color || 'var(--primary-dark)',
                          border: `1px solid ${group.meta.badgeStyle.borderColor || 'transparent'}`,
                          fontWeight: 700
                        }}>
                          <i className={group.meta.icon} style={{ marginRight: '0.3rem' }}></i>
                          {member.role}
                        </span>
                      </div>
                      <h3 className="member-name">{member.name}</h3>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      {member.phone && member.phone !== '01700-000000' ? (
                        <a href={`tel:${member.phone}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                          <i className="fa-solid fa-phone" style={{ color: 'var(--primary)' }}></i> {member.phone}
                        </a>
                      ) : (
                        <div className="member-phone" style={{ justifyContent: 'center' }}>
                          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> নির্বাহী কর্মকর্তা
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}


