import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { 
  User, Role, SiteSettings, Activity, FuturePlan, CommitteeMember, BloodDonor, BloodRequest, Donation 
} from './models/schemas.js';
import { generateToken, verifyToken, checkPermission } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// In-Memory Database Fallback Store (If Mongo server is offline)
let memoryStore = {
  settings: {
    topTickerNotice: 'যশোর সদরে O+ রক্তের জরুরি প্রয়োজন | ২৫০ শয্যা হাসপাতাল যশোর | হেল্পলাইন: 01711-123456 | যশোর শারাপোল সংস্থার সাথে থাকুন।',
    heroBadgeText: 'যশোর জেলা কেন্দ্রিক সামাজিক সংগঠন',
    heroTitleText: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর',
    heroDescription: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, শিক্ষা সহায়তা ও এলাকার সার্বিক উন্নয়নে আমরা নিয়োজিত।',
    heroImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    aboutTitle: 'যশোর শারাপোল সংস্থা সম্পর্কে',
    aboutDescription: "'যশোর শারাপোল সংস্থা' যশোর জেলার একটি সেবামুখী ও অরাজনৈতিক সামাজিক কল্যাণমূলক সংস্থা। এলাকার মানুষের পাশে দাঁড়ানো, জরুরি রক্তদানে তাৎক্ষণিক সহায়তা প্রদান, সুবিধাবঞ্চিত শিশুদের শিক্ষা সহায়তা এবং পরিবেশ রক্ষায় উদ্যোগ নেওয়া আমাদের মূল অঙ্গীকার।",
    contactPhone: '01711-123456',
    contactEmail: 'info@jashoresharapol.org',
    contactAddress: 'কেন্দ্রীয় কার্যালয়: চাঁচড়া মোড়, যশোর সদর, যশোর।'
  },
  roles: [
    { key: 'SUPER_ADMIN', name: 'সুপার এডমিন (Super Admin)', permissions: ['manage_all', 'manage_site', 'manage_media', 'manage_content', 'manage_blood', 'manage_committee', 'manage_roles'] },
    { key: 'MEDIA_ADMIN', name: 'ছবি ও গ্যালারি সম্পাদক (Media Admin)', permissions: ['manage_media'] },
    { key: 'CONTENT_ADMIN', name: 'সংবাদ ও পোস্ট সম্পাদক (Content Admin)', permissions: ['manage_content'] },
    { key: 'BLOOD_ADMIN', name: 'রক্তদান ব্যবস্থাপক (Blood Manager)', permissions: ['manage_blood'] }
  ],
  users: [
    {
      id: 'usr-1',
      name: 'সুপার এডমিন',
      username: 'admin',
      email: 'admin@sharapol.org',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'SUPER_ADMIN',
      permissions: ['manage_all']
    },
    {
      id: 'usr-2',
      name: 'রক্তদান কর্মকর্তা',
      username: 'bloodadmin',
      email: 'blood@sharapol.org',
      passwordHash: bcrypt.hashSync('blood123', 10),
      role: 'BLOOD_ADMIN',
      permissions: ['manage_blood']
    },
    {
      id: 'usr-3',
      name: 'পাবলিসিটি এডিটর',
      username: 'mediaadmin',
      email: 'media@sharapol.org',
      passwordHash: bcrypt.hashSync('media123', 10),
      role: 'MEDIA_ADMIN',
      permissions: ['manage_media']
    }
  ],
  activities: [
    {
      id: 'act-1',
      title: 'যশোর সদরে ফ্রি মেডিকেল ক্যাম্প ও ওষুধ বিতরণ',
      category: 'স্বাস্থ্য সেবা',
      date: '২০২৬-০৭-১৫',
      location: 'যশোর সদর, যশোর',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      description: 'যশোর সদর উপজেলার ৫০০ জন অসহায় ও দুঃস্থ মানুষের মাঝে বিনামূল্যে স্বাস্থ্যসেবা ও প্রয়োজনীয় ওষুধ বিতরণ করা হয়।',
      impact: '৫০০+ সুবিধাভোগী'
    },
    {
      id: 'act-2',
      title: 'অভয়নগরে বৃক্ষরোপণ অভিযান ও চারা বিতরণ',
      category: 'পরিবেশ উন্নয়ন',
      date: '২০২৬-০৬-২০',
      location: 'অভয়নগর, যশোর',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      description: 'পরিবেশ রক্ষায় ১,০০০ টি ফলজ ও বনজ চারাগাছ রোপণ ও স্থানীয়দের মাঝে বিতরণ করা হয়।',
      impact: '১,০০০ চারা রোপণ'
    },
    {
      id: 'act-3',
      title: 'কেশবপুরে শীতবস্ত্র ও কম্বল বিতরণ',
      category: 'ত্রাণ ও সাহায্য',
      date: '২০২৬-০১-১০',
      location: 'কেশবপুর, যশোর',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      description: 'তীব্র শীতকালীন সময়ে ৩৫০ জন শীতার্ত পরিবারের মাঝে মানসম্মত কম্বল ও শীতবস্ত্র পৌঁছে দেওয়া হয়।',
      impact: '৩৫০ পরিবার'
    }
  ],
  plans: [
    {
      id: 'plan-1',
      title: 'যশোরে শারাপোল ফ্রি কম্পিউটার ল্যাব স্থাপন',
      category: 'শিক্ষা',
      targetDate: '২০২৬-১০-০১',
      description: 'অসচ্ছল তরুণ-তরুণীদের বিনামূল্যে আইটি প্রশিক্ষণ প্রদানের জন্য ২০ টি কম্পিউটার সমৃদ্ধ ল্যাব নির্মাণ।',
      status: 'চলমান'
    },
    {
      id: 'plan-2',
      title: 'ঝিকরগাছায় বিশুদ্ধ খাওয়ার পানির গভীর নলকূপ স্থাপন',
      category: 'জনস্বাস্থ্য',
      targetDate: '২০২৬-১১-১৫',
      description: 'পানি সংকটাপন্ন এলাকায় ১০ টি বিনামূল্যে ব্যবহারযোগ্য বিশুদ্ধ পানির আর্সেনিকমুক্ত নলকূপ স্থাপন।',
      status: 'পরিকল্পিত'
    }
  ],
  committee: [
    { id: 'com-1', name: 'কাজী তানভীর আহমেদ', role: 'সভাপতি', phone: '01711-123456', email: 'president@sharapol.org', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { id: 'com-2', name: 'মাহমুদুল হাসান শুভ', role: 'সাধারণ সম্পাদক', phone: '01712-987654', email: 'secretary@sharapol.org', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { id: 'com-3', name: 'ফারহানা আক্তার রিন্টু', role: 'সহ-সভাপতি', phone: '01819-223344', email: 'vp@sharapol.org', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { id: 'com-4', name: 'সাইফুল ইসলাম রিফাত', role: 'সাংগঠনিক সম্পাদক', phone: '01911-556677', email: 'org@sharapol.org', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
    { id: 'com-5', name: 'মোঃ আরিফ হোসেন', role: 'অর্থ সম্পাদক (ক্যাশিয়ার)', phone: '01715-443322', email: 'cashier@sharapol.org', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
    { id: 'com-6', name: 'ড. শফিকুর রহমান', role: 'রক্তদান ও সমাজকল্যাণ সম্পাদক', phone: '01812-778899', email: 'blood@sharapol.org', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }
  ],
  bloodDonors: [
    { id: 'donor-1', name: 'মোঃ রাশেদুল ইসলাম', bloodGroup: 'O+', upazila: 'যশোর সদর', phone: '01710-112233', lastDonation: '২০২৬-০৩-১০', available: true },
    { id: 'donor-2', name: 'সাদিয়া নাসরিন', bloodGroup: 'A+', upazila: 'ঝিকরগাছা', phone: '01815-445566', lastDonation: '২০২৫-১১-২০', available: true },
    { id: 'donor-3', name: 'কাজী ইমরান হোসেন', bloodGroup: 'B+', upazila: 'অভয়নগর', phone: '01912-778899', lastDonation: '২০২৬-০৫-০১', available: true },
    { id: 'donor-4', name: 'আরিফুল ইসলাম', bloodGroup: 'AB+', upazila: 'শার্শা', phone: '01714-334455', lastDonation: '২০২৬-০১-১৫', available: true }
  ],
  bloodRequests: [
    { id: 'req-1', patientName: 'মোসাঃ ফাতেমা বেগম', bloodGroup: 'O+', hospital: '২৫০ শয্যা বিশিষ্ট হাসপাতাল, যশোর', contact: '01712-334455', bagsNeeded: 2, dateNeeded: 'আজই জরুরি', details: 'গর্ভবতী মায়ের সিজারিয়ান অপারেশনের জন্য রক্ত প্রয়োজন।' }
  ],
  donations: [
    { id: 'don-1', donorName: 'আলহাজ্ব রফিকুল ইসলাম', amount: 5000, method: 'bKash', trxId: 'BK9X82M1', date: '২০২৬-০৮-০২', status: 'অনুমোদিত' },
    { id: 'don-2', donorName: 'তানজিলা বেগম', amount: 2000, method: 'Nagad', trxId: 'NG7Y33P9', date: '২০২৬-০৮-০৫', status: 'অনুমোদিত' }
  ]
};

// Connect Database on Startup
let isMongo = false;
connectDB().then(res => { isMongo = res; });

// ----------------------------------------------------
// Health Check Route
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Jashore Sharapol Sanstha MERN API is running.', database: isMongo ? 'MongoDB' : 'In-Memory Fallback Store' });
});

// ----------------------------------------------------
// Auth & RBAC Routes
// ----------------------------------------------------

// Admin Login Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  let user = memoryStore.users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(400).json({ success: false, message: 'ইউজারনাম অথবা পাসওয়ার্ড ভুল দেওয়া হয়েছে।' });
  }

  const roleObj = memoryStore.roles.find(r => r.key === user.role) || { permissions: user.permissions || [] };

  const token = generateToken({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    permissions: roleObj.permissions
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      permissions: roleObj.permissions
    }
  });
});

// Get Roles & Permissions List (Admin)
app.get('/api/roles', verifyToken, checkPermission('manage_roles'), (req, res) => {
  res.json({ success: true, roles: memoryStore.roles });
});

// Get All Admin Users (Super Admin Only)
app.get('/api/users', verifyToken, checkPermission('manage_roles'), (req, res) => {
  res.json({ 
    success: true, 
    users: memoryStore.users.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role, email: u.email })) 
  });
});

// Create New Sub-Admin User with Assigned Role (RBAC)
app.post('/api/users', verifyToken, checkPermission('manage_roles'), (req, res) => {
  const { name, username, password, email, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ success: false, message: 'সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    username,
    email: email || `${username}@sharapol.org`,
    passwordHash: bcrypt.hashSync(password, 10),
    role
  };

  memoryStore.users.push(newUser);
  res.json({ success: true, message: 'নতুন এডমিন সাব-অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।', user: newUser });
});

// Delete Sub-Admin User
app.delete('/api/users/:id', verifyToken, checkPermission('manage_roles'), (req, res) => {
  memoryStore.users = memoryStore.users.filter(u => u.id !== req.params.id);
  res.json({ success: true, message: 'এডমিন অ্যাকাউন্ট মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// Dynamic Site Settings Routes (Editable Everything)
// ----------------------------------------------------
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: memoryStore.settings });
});

app.put('/api/settings', verifyToken, checkPermission('manage_site'), (req, res) => {
  memoryStore.settings = { ...memoryStore.settings, ...req.body };
  res.json({ success: true, message: 'ওয়েবসাইটের কনটেন্ট সফলভাবে আপডেট হয়েছে!', settings: memoryStore.settings });
});

// ----------------------------------------------------
// Activities & Future Plans Routes
// ----------------------------------------------------
app.get('/api/activities', (req, res) => {
  res.json({ success: true, activities: memoryStore.activities });
});

app.post('/api/activities', verifyToken, checkPermission('manage_media'), (req, res) => {
  const newAct = { id: 'act-' + Date.now(), ...req.body };
  memoryStore.activities.unshift(newAct);
  res.json({ success: true, message: 'নতুন কাজের রেকর্ড যোগ করা হয়েছে!', activity: newAct });
});

app.delete('/api/activities/:id', verifyToken, checkPermission('manage_media'), (req, res) => {
  memoryStore.activities = memoryStore.activities.filter(a => a.id !== req.params.id);
  res.json({ success: true, message: 'রেকর্ডটি মুছে ফেলা হয়েছে।' });
});

app.get('/api/plans', (req, res) => {
  res.json({ success: true, plans: memoryStore.plans });
});

app.post('/api/plans', verifyToken, checkPermission('manage_content'), (req, res) => {
  const newPlan = { id: 'plan-' + Date.now(), ...req.body };
  memoryStore.plans.unshift(newPlan);
  res.json({ success: true, message: 'ভবিষ্যৎ পরিকল্পনা যোগ হয়েছে!', plan: newPlan });
});

app.delete('/api/plans/:id', verifyToken, checkPermission('manage_content'), (req, res) => {
  memoryStore.plans = memoryStore.plans.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'পরিকল্পনাটি মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// Committee Members Routes
// ----------------------------------------------------
app.get('/api/committee', (req, res) => {
  res.json({ success: true, committee: memoryStore.committee });
});

app.post('/api/committee', verifyToken, checkPermission('manage_committee'), (req, res) => {
  const newMember = { id: 'com-' + Date.now(), ...req.body };
  memoryStore.committee.push(newMember);
  res.json({ success: true, message: 'নতুন কমিটি পদবী ও সদস্য যুক্ত হয়েছে!', member: newMember });
});

app.delete('/api/committee/:id', verifyToken, checkPermission('manage_committee'), (req, res) => {
  memoryStore.committee = memoryStore.committee.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: 'সদস্যের তথ্য মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// Blood Service & Donors Routes
// ----------------------------------------------------
app.get('/api/blood/donors', (req, res) => {
  res.json({ success: true, donors: memoryStore.bloodDonors });
});

app.post('/api/blood/donors', (req, res) => {
  const newDonor = { id: 'donor-' + Date.now(), ...req.body };
  memoryStore.bloodDonors.unshift(newDonor);
  res.json({ success: true, message: 'রক্তদাতা হিসেবে সফলভাবে নিবন্ধিত হয়েছেন!', donor: newDonor });
});

app.delete('/api/blood/donors/:id', verifyToken, checkPermission('manage_blood'), (req, res) => {
  memoryStore.bloodDonors = memoryStore.bloodDonors.filter(d => d.id !== req.params.id);
  res.json({ success: true, message: 'রক্তদাতার নাম তালিকা থেকে সরিয়ে নেওয়া হয়েছে।' });
});

app.get('/api/blood/requests', (req, res) => {
  res.json({ success: true, requests: memoryStore.bloodRequests });
});

app.post('/api/blood/requests', (req, res) => {
  const newReq = { id: 'req-' + Date.now(), ...req.body };
  memoryStore.bloodRequests.unshift(newReq);
  res.json({ success: true, message: 'জরুরি রক্তের আবেদন প্রকাশিত হয়েছে!', request: newReq });
});

app.delete('/api/blood/requests/:id', verifyToken, checkPermission('manage_blood'), (req, res) => {
  memoryStore.bloodRequests = memoryStore.bloodRequests.filter(r => r.id !== req.params.id);
  res.json({ success: true, message: 'রক্তের আবেদন সম্পন্ন হিসেবে চিহ্ণিত করা হয়েছে।' });
});

// ----------------------------------------------------
// Donations Routes
// ----------------------------------------------------
app.get('/api/donations', (req, res) => {
  res.json({ success: true, donations: memoryStore.donations });
});

app.post('/api/donations', (req, res) => {
  const newDonation = { id: 'don-' + Date.now(), ...req.body };
  memoryStore.donations.unshift(newDonation);
  res.json({ success: true, message: 'অনুদানের তথ্য ধন্যবাদান্তে গ্রহণ করা হয়েছে!', donation: newDonation });
});

// Export Express App for Vercel Serverless Function & Standalone Node Server
export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Express Backend API listening on http://localhost:${PORT}`);
  });
}
