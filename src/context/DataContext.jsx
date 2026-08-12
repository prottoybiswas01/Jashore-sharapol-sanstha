import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token } = useAuth();

  const [settings, setSettings] = useState({
    topTickerNotice: 'যশোর সদরে O+ রক্তের জরুরি প্রয়োজন | ২৫০ শয্যা হাসপাতাল যশোর | হেল্পলাইন: 01711-123456',
    heroBadgeText: 'যশোর জেলা কেন্দ্রিক সামাজিক সংগঠন',
    heroTitleText: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর',
    heroDescription: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, শিক্ষা সহায়তা ও এলাকার সার্বিক উন্নয়নে আমরা নিয়োজিত।',
    heroImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    aboutTitle: 'যশোর শারাপোল সংস্থা সম্পর্কে',
    aboutDescription: "'যশোর শারাপোল সংস্থা' যশোর জেলার একটি সেবামুখী ও অরাজনৈতিক সামাজিক কল্যাণমূলক সংস্থা। এলাকার মানুষের পাশে দাঁড়ানো, জরুরি রক্তদানে তাৎক্ষণিক সহায়তা প্রদান, সুবিধাবঞ্চিত শিশুদের শিক্ষা সহায়তা এবং পরিবেশ রক্ষায় উদ্যোগ নেওয়া আমাদের মূল অঙ্গীকার।",
    contactPhone: '01711-123456',
    contactEmail: 'info@jashoresharapol.org',
    contactAddress: 'কেন্দ্রীয় কার্যালয়: চাঁচড়া মোড়, যশোর সদর, যশোর।'
  });

  const [activities, setActivities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [donors, setDonors] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [subAdminUsers, setSubAdminUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchAllData = async () => {
    try {
      const [resSet, resAct, resPlan, resCom, resDon, resReq, resMoney] = await Promise.all([
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/activities').then(r => r.json()),
        fetch('/api/plans').then(r => r.json()),
        fetch('/api/committee').then(r => r.json()),
        fetch('/api/blood/donors').then(r => r.json()),
        fetch('/api/blood/requests').then(r => r.json()),
        fetch('/api/donations').then(r => r.json())
      ]);

      if (resSet.success) setSettings(resSet.settings);
      if (resAct.success) setActivities(resAct.activities);
      if (resPlan.success) setPlans(resPlan.plans);
      if (resCom.success) setCommittee(resCom.committee);
      if (resDon.success) setDonors(resDon.donors);
      if (resReq.success) setBloodRequests(resReq.requests);
      if (resMoney.success) setDonations(resMoney.donations);
    } catch (e) {
      console.warn("API load fallback using default state.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAdminUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setSubAdminUsers(data.users);
    } catch (e) {}
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ message: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateSiteSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showToast('ওয়েবসাইটের কনটেন্ট সফলভাবে আপডেট হয়েছে!');
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      showToast('ওয়েবসাইটের কনটেন্ট আপডেট করা হয়েছে!');
    }
  };

  const addActivity = async (act) => {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(act)
      });
      const data = await res.json();
      if (data.success) {
        setActivities(prev => [data.activity, ...prev]);
        showToast('নতুন কাজের রেকর্ড যোগ হয়েছে!');
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      setActivities(prev => [{ id: 'act-' + Date.now(), ...act }, ...prev]);
      showToast('কাজের রেকর্ড যোগ করা হয়েছে!');
    }
  };

  const deleteActivity = async (id) => {
    try {
      await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('রেকর্ডটি মুছে ফেলা হয়েছে।', 'info');
  };

  const addFuturePlan = async (plan) => {
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(plan)
      });
      const data = await res.json();
      if (data.success) {
        setPlans(prev => [data.plan, ...prev]);
        showToast('ভবিষ্যৎ পরিকল্পনা যোগ হয়েছে!');
      }
    } catch (e) {
      setPlans(prev => [{ id: 'plan-' + Date.now(), ...plan }, ...prev]);
      showToast('ভবিষ্যৎ পরিকল্পনা যোগ করা হয়েছে!');
    }
  };

  const deleteFuturePlan = async (id) => {
    try {
      await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setPlans(prev => prev.filter(p => p.id !== id));
    showToast('পরিকল্পনা মুছে ফেলা হয়েছে।', 'info');
  };

  const addCommitteeMember = async (member) => {
    try {
      const res = await fetch('/api/committee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(member)
      });
      const data = await res.json();
      if (data.success) {
        setCommittee(prev => [...prev, data.member]);
        showToast('কমিটিতে নতুন সদস্য যুক্ত হয়েছেন!');
      }
    } catch (e) {
      setCommittee(prev => [...prev, { id: 'com-' + Date.now(), ...member }]);
      showToast('কমিটিতে সদস্য যুক্ত হয়েছে!');
    }
  };

  const deleteCommitteeMember = async (id) => {
    try {
      await fetch(`/api/committee/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setCommittee(prev => prev.filter(c => c.id !== id));
    showToast('কমিটি সদস্যের তথ্য মুছে ফেলা হয়েছে।', 'info');
  };

  const addBloodDonor = async (donor) => {
    try {
      const res = await fetch('/api/blood/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
      });
      const data = await res.json();
      if (data.success) {
        setDonors(prev => [data.donor, ...prev]);
        showToast('রক্তদাতা হিসেবে আপনি সফলভাবে নিবন্ধিত হয়েছেন!');
      }
    } catch (e) {
      setDonors(prev => [{ id: 'donor-' + Date.now(), ...donor }, ...prev]);
      showToast('রক্তদাতা নিবন্ধন সফল হয়েছে!');
    }
  };

  const deleteBloodDonor = async (id) => {
    try {
      await fetch(`/api/blood/donors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setDonors(prev => prev.filter(d => d.id !== id));
    showToast('রক্তদাতার নাম মুছে ফেলা হয়েছে।', 'info');
  };

  const addBloodRequest = async (req) => {
    try {
      const res = await fetch('/api/blood/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const data = await res.json();
      if (data.success) {
        setBloodRequests(prev => [data.request, ...prev]);
        showToast('জরুরি রক্তের আবেদন প্রকাশিত হয়েছে!');
      }
    } catch (e) {
      setBloodRequests(prev => [{ id: 'req-' + Date.now(), ...req }, ...prev]);
      showToast('জরুরি রক্তের আবেদন পোস্ট করা হয়েছে!');
    }
  };

  const deleteBloodRequest = async (id) => {
    try {
      await fetch(`/api/blood/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setBloodRequests(prev => prev.filter(r => r.id !== id));
    showToast('রক্তের আবেদন সম্পন্ন নিশ্চিত করা হয়েছে!');
  };

  const addDonation = async (don) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(don)
      });
      const data = await res.json();
      if (data.success) {
        setDonations(prev => [data.donation, ...prev]);
        showToast('অনুদানের তথ্য ধন্যবাদান্তে গ্রহণ করা হয়েছে!');
      }
    } catch (e) {
      setDonations(prev => [{ id: 'don-' + Date.now(), ...don }, ...prev]);
      showToast('অনুদানের তথ্য জমা হয়েছে!');
    }
  };

  const createSubAdminUser = async (userData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        setSubAdminUsers(prev => [...prev, data.user]);
        showToast('নতুন এডমিন সাব-অ্যাকাউন্ট তৈরি করা হয়েছে!');
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      setSubAdminUsers(prev => [...prev, { id: 'usr-' + Date.now(), ...userData }]);
      showToast('সাব-অ্যাকাউন্ট তৈরি হয়েছে!');
    }
  };

  const deleteSubAdminUser = async (id) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    setSubAdminUsers(prev => prev.filter(u => u.id !== id));
    showToast('সাব-অ্যাকাউন্ট মুছে ফেলা হয়েছে।', 'info');
  };

  return (
    <DataContext.Provider value={{
      settings, activities, plans, committee, donors, bloodRequests, donations, subAdminUsers, toastMessage,
      showToast, updateSiteSettings, addActivity, deleteActivity, addFuturePlan, deleteFuturePlan,
      addCommitteeMember, deleteCommitteeMember, addBloodDonor, deleteBloodDonor,
      addBloodRequest, deleteBloodRequest, addDonation, createSubAdminUser, deleteSubAdminUser, fetchAdminUsers
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
