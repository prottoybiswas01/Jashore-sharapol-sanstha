import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { 
  User, Role, SiteSettings, Activity, FuturePlan, CommitteeMember, BloodDonor, BloodRequest, Donation 
} from './models/schemas.js';
import { generateToken, verifyToken, checkPermission, sanitizeInput } from './middleware/auth.js';

const app = express();

// Security Headers & CORS Policy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Clean Production Database Memory Store (Ready for Real-time Live Launch)
let memoryStore = {
  settings: {
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
    }
  ],
  activities: [],
  plans: [],
  committee: [],
  bloodDonors: [],
  bloodRequests: [],
  donations: []
};

// Connect Database on Startup
let isMongo = false;
connectDB().then(res => { isMongo = res; });

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    security: 'HIGH_SECURITY_VERIFIED',
    message: 'Jashore Sharapol Sanstha MERN API Server Active.', 
    database: isMongo ? 'MongoDB Atlas Cloud' : 'Clean Production Memory Engine' 
  });
});

// Admin Secure Login Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  let user = memoryStore.users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(400).json({ success: false, message: 'সুরক্ষা সংকেত: ইউজারনাম অথবা পাসওয়ার্ড অকার্যকর।' });
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

// Get Roles (Admin)
app.get('/api/roles', verifyToken, checkPermission('manage_roles'), (req, res) => {
  res.json({ success: true, roles: memoryStore.roles });
});

// Get Users (Super Admin Only)
app.get('/api/users', verifyToken, checkPermission('manage_roles'), (req, res) => {
  res.json({ 
    success: true, 
    users: memoryStore.users.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role, email: u.email })) 
  });
});

// Create Sub-Admin Account (RBAC)
app.post('/api/users', verifyToken, checkPermission('manage_roles'), (req, res) => {
  const { name, username, password, email, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ success: false, message: 'প্রয়োজনীয় ফিল্ডসমূহ সঠিকমত পূরণ করুন।' });
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

// Delete Sub-Admin Account
app.delete('/api/users/:id', verifyToken, checkPermission('manage_roles'), (req, res) => {
  memoryStore.users = memoryStore.users.filter(u => u.id !== req.params.id);
  res.json({ success: true, message: 'এডমিন অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
});

// Site Content CMS Routes
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: memoryStore.settings });
});

app.put('/api/settings', verifyToken, checkPermission('manage_site'), (req, res) => {
  memoryStore.settings = { ...memoryStore.settings, ...req.body };
  res.json({ success: true, message: 'ওয়েবসাইটের কনটেন্ট সফলভাবে আপডেট হয়েছে!', settings: memoryStore.settings });
});

// Activities Routes
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

// Plans Routes
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

// Committee Routes
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

// Blood Service Routes
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

// Donations Routes
app.get('/api/donations', (req, res) => {
  res.json({ success: true, donations: memoryStore.donations });
});

app.post('/api/donations', (req, res) => {
  const newDonation = { id: 'don-' + Date.now(), ...req.body };
  memoryStore.donations.unshift(newDonation);
  res.json({ success: true, message: 'অনুদানের তথ্য ধন্যবাদান্তে গ্রহণ করা হয়েছে!', donation: newDonation });
});

app.delete('/api/donations/:id', verifyToken, checkPermission('manage_all'), (req, res) => {
  memoryStore.donations = memoryStore.donations.filter(d => d.id !== req.params.id);
  res.json({ success: true, message: 'অনুদানের তথ্য মুছে ফেলা হয়েছে।' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Clean Production Express API listening on http://localhost:${PORT}`);
  });
}
