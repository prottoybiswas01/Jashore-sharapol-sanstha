import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    topTickerNotice: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম | রক্তের জন্য যোগাযোগ করুন: 01711-123456',
    heroBadgeText: 'যশোর জেলা কেন্দ্রিক সামাজিক সংগঠন',
    heroTitleText: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর',
    heroDescription: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, শিক্ষা সহায়তা ও এলাকার সার্বিক উন্নয়নে আমরা নিবেদিত।',
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
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch All Primary Data Directly from MongoDB Database
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [resSet, resAct, resPlan, resCom, resDon, resReq, resMoney] = await Promise.all([
        fetch('/api/settings').then(r => r.json()).catch(() => ({})),
        fetch('/api/activities').then(r => r.json()).catch(() => ({})),
        fetch('/api/plans').then(r => r.json()).catch(() => ({})),
        fetch('/api/committee').then(r => r.json()).catch(() => ({})),
        fetch('/api/blood/donors').then(r => r.json()).catch(() => ({})),
        fetch('/api/blood/requests').then(r => r.json()).catch(() => ({})),
        fetch('/api/donations').then(r => r.json()).catch(() => ({}))
      ]);

      if (resSet && resSet.success && resSet.settings) setSettings(resSet.settings);
      if (resAct && resAct.success && resAct.activities) setActivities(resAct.activities);
      if (resPlan && resPlan.success && resPlan.plans) setPlans(resPlan.plans);
      if (resCom && resCom.success && resCom.committee) setCommittee(resCom.committee);
      if (resDon && resDon.success && resDon.donors) setDonors(resDon.donors);
      if (resReq && resReq.success && resReq.requests) setBloodRequests(resReq.requests);
      if (resMoney && resMoney.success && resMoney.donations) setDonations(resMoney.donations);
    } catch (e) {
      console.error("MongoDB Data fetch error:", e);
    } finally {
      setIsLoading(false);
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
        showToast('ওয়েবসাইটের কনটেন্ট সফলভাবে MongoDB-তে সেভ হয়েছে!');
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      showToast('সেটিংস সেভ করতে ব্যর্থ হয়েছে।', 'error');
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
        showToast('নতুন কাজের রেকর্ড MongoDB-তে সংরক্ষণ করা হয়েছে!');
      } else {
        showToast(data.message, 'error');
      }
    } catch (e) {
      showToast('কাজের রেকর্ড সেভ করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteActivity = async (id) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActivities(prev => prev.filter(a => (a._id || a.id) !== id));
        showToast('রেকর্ডটি MongoDB থেকে মুছে ফেলা হয়েছে।', 'info');
      }
    } catch (e) {
      showToast('মুছে ফেলা সম্ভব হয়নি।', 'error');
    }
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
        showToast('ভবিষ্যৎ পরিকল্পনা MongoDB-তে সেভ হয়েছে!');
      }
    } catch (e) {
      showToast('পরিকল্পনা সেভ করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteFuturePlan = async (id) => {
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPlans(prev => prev.filter(p => (p._id || p.id) !== id));
        showToast('পরিকল্পনা মুছে ফেলা হয়েছে।', 'info');
      }
    } catch (e) {}
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
      showToast('সদস্য যোগ করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteCommitteeMember = async (id) => {
    try {
      const res = await fetch(`/api/committee/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCommittee(prev => prev.filter(c => (c._id || c.id) !== id));
        showToast('সদস্যের তথ্য মুছে ফেলা হয়েছে।', 'info');
      }
    } catch (e) {}
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
      showToast('নিবন্ধন ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteBloodDonor = async (id) => {
    try {
      const res = await fetch(`/api/blood/donors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDonors(prev => prev.filter(d => (d._id || d.id) !== id));
        showToast('রক্তদাতার নাম মুছে ফেলা হয়েছে।', 'info');
      }
    } catch (e) {}
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
      showToast('আবেদন প্রকাশ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteBloodRequest = async (id) => {
    try {
      const res = await fetch(`/api/blood/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBloodRequests(prev => prev.filter(r => (r._id || r.id) !== id));
        showToast('রক্তের আবেদন সম্পন্ন নিশ্চিত করা হয়েছে!');
      }
    } catch (e) {}
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
      showToast('অনুদানের তথ্য জমা দিতে ব্যর্থ হয়েছে।', 'error');
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
      showToast('সাব-অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteSubAdminUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubAdminUsers(prev => prev.filter(u => (u._id || u.id) !== id));
        showToast('সাব-অ্যাকাউন্ট মুছে ফেলা হয়েছে।', 'info');
      }
    } catch (e) {}
  };

  return (
    <DataContext.Provider value={{
      isLoading, settings, activities, plans, committee, donors, bloodRequests, donations, subAdminUsers, toastMessage,
      showToast, updateSiteSettings, addActivity, deleteActivity, addFuturePlan, deleteFuturePlan,
      addCommitteeMember, deleteCommitteeMember, addBloodDonor, deleteBloodDonor,
      addBloodRequest, deleteBloodRequest, addDonation, createSubAdminUser, deleteSubAdminUser, fetchAdminUsers
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
