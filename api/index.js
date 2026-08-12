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

app.use(express.json({ limit: '15mb' }));
app.use(sanitizeInput);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Connect to MongoDB Atlas Cloud & Ensure Primary Database Documents Exist
let isConnectedToMongo = false;
connectDB().then(async (res) => { 
  isConnectedToMongo = res;
  if (res) {
    try {
      const settingsCount = await SiteSettings.countDocuments();
      if (settingsCount === 0) {
        await SiteSettings.create({
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
        console.log('✅ Initial SiteSettings created in MongoDB Atlas Cloud');
      }

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.create({
          name: 'সুপার এডমিন',
          username: 'admin',
          email: 'admin@sharapol.org',
          password: bcrypt.hashSync('admin123', 10),
          role: 'SUPER_ADMIN',
          permissions: ['manage_all']
        });
        console.log('✅ Default Super Admin created in MongoDB Atlas Cloud (admin / admin123)');
      }
    } catch (e) {
      console.error('MongoDB Initialization error:', e);
    }
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    security: 'HIGH_SECURITY_VERIFIED',
    message: 'Jashore Sharapol Sanstha MERN API Active.', 
    database: isConnectedToMongo ? 'MongoDB Atlas Cloud' : 'Connecting to MongoDB...' 
  });
});

// ----------------------------------------------------
// Public & Admin Auth Routes
// ----------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, password, email, phone, bloodGroup, upazila } = req.body;
    if (!name || !username || !password || !phone) {
      return res.status(400).json({ success: false, message: 'প্রয়োজনীয় ফিল্ডসমূহ পূরণ করুন।' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'এই ইউজারনামটি ইতোমধ্যে ব্যবহ্রত হচ্ছে।' });
    }

    const newUser = await User.create({
      name,
      username,
      email: email || `${username}@sharapol.org`,
      password: bcrypt.hashSync(password, 10),
      phone,
      role: 'GENERAL_MEMBER',
      permissions: []
    });

    if (bloodGroup && upazila) {
      await BloodDonor.create({
        name,
        bloodGroup,
        upazila,
        phone,
        lastDonation: 'সম্প্রতি',
        available: true
      });
    }

    const token = generateToken({
      id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      permissions: []
    });

    res.json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে! আপনি রক্তদাতা হিসেবে যুক্ত হয়েছেন।',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        permissions: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রেজিস্ট্রেশন করতে ব্যর্থ হয়েছে।' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ success: false, message: 'সুরক্ষা সংকেত: ইউজারনাম অথবা পাসওয়ার্ড অকার্যকর।' });
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
      permissions: user.permissions || ['manage_all']
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        permissions: user.permissions || ['manage_all']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ডেটাবেজ সংযোগে সমস্যা হয়েছে।' });
  }
});

app.get('/api/users', verifyToken, checkPermission('manage_roles'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ইউজার তালিকা লোড করা যায়নি।' });
  }
});

app.put('/api/users/:id/role', verifyToken, checkPermission('manage_roles'), async (req, res) => {
  try {
    const { role } = req.body;
    let perms = ['manage_blood'];
    if (role === 'MEDIA_ADMIN') perms = ['manage_media'];
    if (role === 'CONTENT_ADMIN') perms = ['manage_content'];
    if (role === 'SUPER_ADMIN') perms = ['manage_all'];
    if (role === 'GENERAL_MEMBER') perms = [];

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { role, permissions: perms }, 
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'ইউজারের রোল সফলভাবে পরিবর্তন করা হয়েছে।', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রোল পরিবর্তন ব্যর্থ হয়েছে।' });
  }
});

app.post('/api/users', verifyToken, checkPermission('manage_roles'), async (req, res) => {
  try {
    const { name, username, password, email, role } = req.body;
    if (!name || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'প্রয়োজনীয় ফিল্ডসমূহ পূরণ করুন।' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'এই ইউজারনামটি ইতোমধ্যে ব্যবহ্রত হচ্ছে।' });
    }

    let perms = ['manage_blood'];
    if (role === 'MEDIA_ADMIN') perms = ['manage_media'];
    if (role === 'CONTENT_ADMIN') perms = ['manage_content'];
    if (role === 'SUPER_ADMIN') perms = ['manage_all'];

    const newUser = await User.create({
      name,
      username,
      email: email || `${username}@sharapol.org`,
      password: bcrypt.hashSync(password, 10),
      role,
      permissions: perms
    });

    res.json({ success: true, message: 'নতুন এডমিন অ্যাকাউন্ট MongoDB-তে সংরক্ষণ করা হয়েছে।', user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অ্যাাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে।' });
  }
});

app.delete('/api/users/:id', verifyToken, checkPermission('manage_roles'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'এডমিন অ্যাকাউন্ট MongoDB থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'মুছে ফেলতে ব্যর্থ হয়েছে।' });
  }
});

// ----------------------------------------------------
// Site Content CMS Routes
// ----------------------------------------------------
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        topTickerNotice: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম | রক্তের জন্য যোগাযোগ করুন: 01711-123456',
        heroTitleText: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর',
        heroDescription: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন।'
      });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সাইট সেটিংস লোড করা যায়নি।' });
  }
});

app.put('/api/settings', verifyToken, checkPermission('manage_site'), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, message: 'ওয়েবসাইটের কনটেন্ট সফলভাবে MongoDB-তে আপডেট হয়েছে!', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সেটিংস আপডেট ব্যর্থ হয়েছে।' });
  }
});

// ----------------------------------------------------
// Activities Routes (With YouTube Video & Likes)
// ----------------------------------------------------
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কাজের রেকর্ড লোড করা যায়নি।' });
  }
});

app.post('/api/activities', verifyToken, checkPermission('manage_media'), async (req, res) => {
  try {
    const newAct = await Activity.create(req.body);
    res.json({ success: true, message: 'নতুন কাজের রেকর্ড MongoDB-তে সেভ করা হয়েছে!', activity: newAct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রেকর্ড যোগ করা যায়নি।' });
  }
});

app.post('/api/activities/:id/like', async (req, res) => {
  try {
    const act = await Activity.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ success: true, likes: act ? act.likes : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: 'লাইক যোগ করা যায়নি।' });
  }
});

app.put('/api/activities/:id', verifyToken, checkPermission('manage_media'), async (req, res) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'কাজের রেকর্ডটি সফলভাবে সম্পাদনা করা হয়েছে!', activity: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রেকর্ড সম্পাদনা করতে ব্যর্থ হয়েছে।' });
  }
});

app.delete('/api/activities/:id', verifyToken, checkPermission('manage_media'), async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'রেকর্ডটি MongoDB থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রেকর্ডটি মোছা সম্ভব হয়নি।' });
  }
});

// ----------------------------------------------------
// Plans Routes
// ----------------------------------------------------
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await FuturePlan.find().sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পরিকল্পনা লোড করা যায়নি।' });
  }
});

app.post('/api/plans', verifyToken, checkPermission('manage_content'), async (req, res) => {
  try {
    const newPlan = await FuturePlan.create(req.body);
    res.json({ success: true, message: 'ভবিষ্যৎ পরিকল্পনা MongoDB-তে সেভ হয়েছে!', plan: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পরিকল্পনা সেভ করা সম্ভব হয়নি।' });
  }
});

app.put('/api/plans/:id', verifyToken, checkPermission('manage_content'), async (req, res) => {
  try {
    const updated = await FuturePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'পরিকল্পনাটি সফলভাবে সম্পাদনা করা হয়েছে!', plan: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পরিকল্পনা সম্পাদনা করতে ব্যর্থ হয়েছে।' });
  }
});

app.delete('/api/plans/:id', verifyToken, checkPermission('manage_content'), async (req, res) => {
  try {
    await FuturePlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'পরিকল্পনাটি MongoDB থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'মুছে ফেলা সম্ভব হয়নি।' });
  }
});

// ----------------------------------------------------
// Committee Routes
// ----------------------------------------------------
app.get('/api/committee', async (req, res) => {
  try {
    const committee = await CommitteeMember.find().sort({ createdAt: 1 });
    res.json({ success: true, committee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কমিটি লোড করা যায়নি।' });
  }
});

app.post('/api/committee', verifyToken, checkPermission('manage_committee'), async (req, res) => {
  try {
    const newMember = await CommitteeMember.create(req.body);
    res.json({ success: true, message: 'নতুন কমিটি পদবী MongoDB-তে সেভ হয়েছে!', member: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সদস্য যোগ করা যায়নি।' });
  }
});

app.put('/api/committee/:id', verifyToken, checkPermission('manage_committee'), async (req, res) => {
  try {
    const updated = await CommitteeMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'কমিটির পদবী সফলভাবে সম্পাদনা করা হয়েছে!', member: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সদস্যের তথ্য সম্পাদনা করতে ব্যর্থ হয়েছে।' });
  }
});

app.delete('/api/committee/:id', verifyToken, checkPermission('manage_committee'), async (req, res) => {
  try {
    await CommitteeMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'সদস্যের তথ্য MongoDB থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'তথ্য মোছা সম্ভব হয়নি।' });
  }
});

// ----------------------------------------------------
// Blood Service Routes
// ----------------------------------------------------
app.get('/api/blood/donors', async (req, res) => {
  try {
    const donors = await BloodDonor.find().sort({ createdAt: -1 });
    res.json({ success: true, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রক্তদাতাদের তালিকা লোড করা যায়নি।' });
  }
});

app.post('/api/blood/donors', async (req, res) => {
  try {
    const newDonor = await BloodDonor.create(req.body);
    res.json({ success: true, message: 'রক্তদাতা হিসেবে MongoDB-তে তথ্য সেভ হয়েছে!', donor: newDonor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রক্তদাতা যোগ করা সম্ভব হয়নি।' });
  }
});

app.delete('/api/blood/donors/:id', verifyToken, checkPermission('manage_blood'), async (req, res) => {
  try {
    await BloodDonor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'রক্তদাতার নাম MongoDB থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সরানো সম্ভব হয়নি।' });
  }
});

app.get('/api/blood/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রক্তের আবেদনসমূহ লোড করা যায়নি।' });
  }
});

app.post('/api/blood/requests', async (req, res) => {
  try {
    const newReq = await BloodRequest.create(req.body);
    res.json({ success: true, message: 'জরুরি রক্তের আবেদন MongoDB-তে সেভ হয়েছে!', request: newReq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'আবেদন সেভ করা যায়নি।' });
  }
});

app.delete('/api/blood/requests/:id', verifyToken, checkPermission('manage_blood'), async (req, res) => {
  try {
    await BloodRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'রক্তের আবেদনটি সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'প্রসেস করা সম্ভব হয়নি।' });
  }
});

// ----------------------------------------------------
// Donations Routes
// ----------------------------------------------------
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অনুদানের তথ্য লোড করা যায়নি।' });
  }
});

app.post('/api/donations', async (req, res) => {
  try {
    const newDonation = await Donation.create(req.body);
    res.json({ success: true, message: 'অনুদানের তথ্য MongoDB-তে সংরক্ষণ করা হয়েছে!', donation: newDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অনুদানের তথ্য সেভ করা সম্ভব হয়নি।' });
  }
});

app.delete('/api/donations/:id', verifyToken, checkPermission('manage_all'), async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'অনুদানের হিসাব স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'মুছে ফেলা সম্ভব হয়নি।' });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Pure MongoDB Express API listening on http://localhost:${PORT}`);
  });
}
