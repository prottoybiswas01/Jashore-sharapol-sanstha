export const EXECUTIVE_DESIGNATIONS = [
  { id: 'president', title: 'সভাপতি', icon: 'fa-solid fa-crown', badgeStyle: { background: '#fef3c7', color: '#b45309', borderColor: '#fde047' } },
  { id: 'senior_vice_president', title: 'সিনিয়র সহ-সভাপতি', icon: 'fa-solid fa-users-gear', badgeStyle: { background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' } },
  { id: 'vice_president', title: 'সহ-সভাপতি', icon: 'fa-solid fa-user-shield', badgeStyle: { background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' } },
  { id: 'general_secretary', title: 'সাধারণ সম্পাদক', icon: 'fa-solid fa-pen-nib', badgeStyle: { background: '#fef9c3', color: '#a16207', borderColor: '#fef08a' } },
  { id: 'assistant_general_secretary', title: 'সহ-সাধারণ সম্পাদক', icon: 'fa-solid fa-pen-to-square', badgeStyle: { background: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' } },
  { id: 'treasurer', title: 'কোষাধ্যক্ষ', icon: 'fa-solid fa-sack-dollar', badgeStyle: { background: '#dcfce7', color: '#15803d', borderColor: '#86efac' } },
  { id: 'assistant_treasurer', title: 'সহ-কোষাধ্যক্ষ', icon: 'fa-solid fa-wallet', badgeStyle: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' } },
  { id: 'office_secretary', title: 'দপ্তর সম্পাদক', icon: 'fa-solid fa-folder-closed', badgeStyle: { background: '#ffedd5', color: '#c2410c', borderColor: '#fed7aa' } },
  { id: 'assistant_office_secretary', title: 'সহ দপ্তর সম্পাদক', icon: 'fa-solid fa-folder-open', badgeStyle: { background: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' } },
  { id: 'publicity_secretary', title: 'প্রচার সম্পাদক', icon: 'fa-solid fa-bullhorn', badgeStyle: { background: '#fae8ff', color: '#86198f', borderColor: '#f5d0fe' } },
  { id: 'assistant_publicity_secretary', title: 'সহ-প্রচার সম্পাদক', icon: 'fa-solid fa-volume-high', badgeStyle: { background: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' } },
  { id: 'advisory_council', title: 'উপদেষ্টা পরিষদ', icon: 'fa-solid fa-star', badgeStyle: { background: '#fff7ed', color: '#9a3412', borderColor: '#ffedd5' } },
  { id: 'executive_member', title: 'কার্যনির্বাহী সদস্য', icon: 'fa-solid fa-user-check', badgeStyle: { background: '#f0f9ff', color: '#0369a1', borderColor: '#e0f2fe' } }
];

export function getRoleMeta(roleTitle) {
  if (!roleTitle) return { icon: 'fa-solid fa-user-tie', badgeStyle: { background: 'var(--primary-light)', color: 'var(--primary-dark)' } };
  const found = EXECUTIVE_DESIGNATIONS.find(d => d.title.trim().toLowerCase() === roleTitle.trim().toLowerCase());
  if (found) return found;
  
  // Partial search fallbacks
  if (roleTitle.includes('সভাপতি')) return EXECUTIVE_DESIGNATIONS[0];
  if (roleTitle.includes('সম্পাদক')) return EXECUTIVE_DESIGNATIONS[3];
  if (roleTitle.includes('কোষাধ্যক্ষ')) return EXECUTIVE_DESIGNATIONS[5];
  if (roleTitle.includes('উপদেষ্টা')) return EXECUTIVE_DESIGNATIONS[11];
  
  return { title: roleTitle, icon: 'fa-solid fa-user-tie', badgeStyle: { background: 'var(--primary-light)', color: 'var(--primary-dark)' } };
}
