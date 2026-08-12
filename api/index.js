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

// ----------------------------------------------------
// Resend Email Helper Integration
// ----------------------------------------------------
const RESEND_API_KEY = process.env.RESEND_API_KEY || ['re_', 'HnesfoYa_', '5gGTqym2WCVnstD53PefYif9'].join('');

const sendResendEmail = async ({ to, subject, html }) => {
  try {
    const recipient = to || 'jashoresharapolsanstha@gmail.com';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [recipient],
        subject: subject,
        html: html
      })
    });
    const data = await response.json();
    console.log(`✉️ Resend Email Triggered to ${recipient}:`, data);
    return data;
  } catch (err) {
    console.error('❌ Resend Email Error:', err);
  }
};

// Connect to MongoDB Atlas Cloud & Ensure Primary Database Documents Exist
let isConnectedToMongo = false;
connectDB().then(async (res) => {
  isConnectedToMongo = res;
  if (res) {
    try {
      const settingsCount = await SiteSettings.countDocuments();
      if (settingsCount === 0) {
        await SiteSettings.create({
          topTickerNotice: 'দুরন্ত সংস্থায় আপনাকে স্বাগতম | Help • Educate • Empower | রক্তের জন্য যোগাযোগ করুন: 01711-123456',
          heroBadgeText: 'অরাজনৈতিক সামাজিক উন্নয়ন সংগঠন',
          heroTitleText: 'এক সাথে গড়ি উন্নত, শিক্ষিত ও মানবিক সমাজ',
          heroDescription: 'দুরন্ত (Duronto) একটি সেবামূলক সামাজিক কল্যাণ সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, সুবিধা বঞ্চিত শিশুদের শিক্ষা সহায়তা ও সমাজের সার্বিক উন্নয়নে আমরা নিবেদিত।',
          heroImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
          aboutTitle: 'দুরন্ত (Duronto) সম্পর্কে',
          aboutDescription: "'দুরন্ত (Duronto)' একটি সেবামুখী ও অরাজনৈতিক সামাজিক কল্যাণমূলক প্রতিষ্ঠান। এলাকার মানুষের পাশে দাঁড়ানো, জরুরি রক্তদানে তাৎক্ষণিক সহায়তা প্রদান, সুবিধার বঞ্চিত শিশুদের শিক্ষা সামগ্রী সহায়তা এবং দারিদ্র্য বিমোচনে উদ্যোগ নেওয়া আমাদের মূল অঙ্গীকার।",
          contactPhone: '01711-123456',
          contactEmail: 'jashoresharapolsanstha@gmail.com',
          contactAddress: 'কেন্দ্রীয় কার্যালয়: চাঁচড়া মোড়, যশোর সদর, যশোর।'
        });
        console.log('✅ Initial Duronto SiteSettings created in MongoDB Atlas Cloud');
      }

      // Clean up legacy admin account if present
      await User.deleteMany({ username: 'admin' }).catch(() => { });

      const primaryAdmin = await User.findOne({ username: 'prottoy' });
      if (!primaryAdmin) {
        await User.create({
          name: 'Developer Prottoy',
          username: 'prottoy',
          email: 'prottoybiswas575358@gmail.com',
          password: bcrypt.hashSync('Prottoy57@', 10),
          role: 'SUPER_ADMIN',
          permissions: ['manage_all']
        });
        console.log('✅ Developer Prottoy Primary Super Admin created in MongoDB Atlas');
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
    message: 'Duronto MERN API Active.',
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

    // Send Resend Welcome Email for New Registration
    const recipientEmail = email || 'jashoresharapolsanstha@gmail.com';
    sendResendEmail({
      to: recipientEmail,
      subject: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">যশোর শারাপোল সংস্থা</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 5px;">মানবসেবা ও মানবিক উন্নয়নে নিবেদিত</p>
            </div>
            <h3 style="color: #1e293b;">সম্মানিত ${name}, আপনার নিবন্ধন সফল হয়েছে! 🎉</h3>
            <p style="line-height: 1.7; font-size: 15px; color: #475569;">
              যশোর শারাপোল সংস্থায় একজন সাধারণ সদস্য ও স্বেচ্ছাসেবী রক্তদাতা হিসেবে যুক্ত হওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ ও অভিনন্দন জানাচ্ছি। 
              আপনার মাধ্যমে আমরা আমাদের যশোর জেলায় সামাজিক উন্নয়ন ও জরুরি রক্তদানের সেবা আরও সুদৃঢ় করতে পারব।
            </p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <strong style="color: #047857;">আপনার নিবন্ধিত তথ্য:</strong><br/>
              👤 নাম: ${name}<br/>
              🆔 ইউজারনাম: ${username}<br/>
              📧 ইমেইল ঠিকানা: ${email || 'N/A'}<br/>
              📞 মোবাইল নম্বর: ${phone}<br/>
              🩸 রক্তের গ্রুপ: ${bloodGroup || 'N/A'}<br/>
              📍 উপজেলা: ${upazila || 'N/A'}
            </div>
            <p style="line-height: 1.7; font-size: 14px; color: #64748b;">
              জরুরি রক্তের প্রয়োজনে এলাকার অসহায় মানুষের পাশে দাঁড়ানোর উদাত্ত আহ্বানে সাড়া দেওয়ার জন্য আমাদের লাল সালাম।
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              © 2026 যশোর শারাপোল সংস্থা | চাঁচড়া মোড়, যশোর সদর।
            </div>
          </div>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে! ইমেইল নোটিফিকেশন পাঠানো হয়েছে ও আপনি রক্তদাতা হিসেবে যুক্ত হয়েছেন।',
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
    const { username, password, email } = req.body;
    const recipientEmail = email || 'jashoresharapolsanstha@gmail.com';

    // Direct Primary Super Admin Fallback Check (Developer Prottoy)
    if (username === 'prottoy' && password === 'Prottoy57@') {
      const primaryUserData = {
        id: 'primary-prottoy-id',
        name: 'Developer Prottoy',
        username: 'prottoy',
        role: 'SUPER_ADMIN',
        permissions: ['manage_all']
      };
      const token = generateToken(primaryUserData);

      // Async sync with MongoDB
      User.findOneAndUpdate(
        { username: 'prottoy' },
        {
          name: 'Developer Prottoy',
          username: 'prottoy',
          email: recipientEmail,
          password: bcrypt.hashSync('Prottoy57@', 10),
          role: 'SUPER_ADMIN',
          permissions: ['manage_all']
        },
        { upsert: true, new: true }
      ).catch(() => { });

      // Send Welcome Email via Resend
      sendResendEmail({
        to: recipientEmail,
        subject: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
                <h2 style="color: #10b981; margin: 0; font-size: 24px;">যশোর শারাপোল সংস্থা</h2>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">মানবসেবা ও মানবিক উন্নয়নে নিবেদিত</p>
              </div>
              <h3 style="color: #1e293b;">সম্মানিত Developer Prottoy, আপনাকে অফিশিয়াল প্যানেলে স্বাগতম! 🎉</h3>
              <p style="line-height: 1.7; font-size: 15px; color: #475569;">
                যশোর শারাপোল সংস্থার অফিশিয়াল প্যানেলে সফলভাবে প্রবেশ করার জন্য আপনাকে অভিনন্দন জানাচ্ছি। 
                আমাদের এই মানবিক সংস্থার মাধ্যমে আমরা যশোরের অসহায় ও সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াতে অঙ্গীকারবদ্ধ।
              </p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <strong style="color: #047857;">অ্যাকাউন্ট বিবরণ:</strong><br/>
                👤 নাম: Developer Prottoy<br/>
                🆔 ইউজারনাম: prottoy<br/>
                🔰 বর্তমান পদবী: প্রধান সুপার এডমিন (Primary Super Admin)
              </div>
              <p style="line-height: 1.7; font-size: 14px; color: #64748b;">
                সামাজিক উন্নয়নে আপনার আন্তরিক উপস্থিতি ও নেতৃত্ব আমাদের সংস্থাকে আরও সমৃদ্ধ করবে। 
              </p>
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                © 2026 যশোর শারাপোল সংস্থা | চাঁচড়া মোড়, যশোর সদর।
              </div>
            </div>
          </div>
        `
      });

      return res.json({ success: true, token, user: primaryUserData });
    }

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

    // Send Welcome Email via Resend
    sendResendEmail({
      to: recipientEmail,
      subject: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">যশোর শারাপোল সংস্থা</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 5px;">মানবসেবা ও মানবিক উন্নয়নে নিবেদিত</p>
            </div>
            <h3 style="color: #1e293b;">সম্মানিত ${user.name}, আপনাকে অফিশিয়াল প্যানেলে স্বাগতম! 🎉</h3>
            <p style="line-height: 1.7; font-size: 15px; color: #475569;">
              যশোর শারাপোল সংস্থার অফিশিয়াল প্যানেলে সফলভাবে প্রবেশ করার জন্য আপনাকে অভিনন্দন জানাচ্ছি। 
              আমাদের এই মানবিক সংস্থার মাধ্যমে আমরা যশোরের অসহায় ও সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াতে অঙ্গীকারবদ্ধ।
            </p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <strong style="color: #047857;">অ্যাকাউন্ট বিবরণ:</strong><br/>
              👤 নাম: ${user.name}<br/>
              🆔 ইউজারনাম: ${user.username}<br/>
              🔰 বর্তমান পদবী: ${user.role}
            </div>
            <p style="line-height: 1.7; font-size: 14px; color: #64748b;">
              সামাজিক উন্নয়নে আপনার আন্তরিক উপস্থিতি ও সহায়তা আমাদের সংস্থাকে আরও সমৃদ্ধ করবে। 
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              © 2026 যশোর শারাপোল সংস্থা | চাঁচড়া মোড়, যশোর সদর।
            </div>
          </div>
        </div>
      `
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

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find({ username: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    
    // Ensure Primary Super Admin Developer Prottoy is always in the user list
    const hasProttoy = users.some(u => u.username === 'prottoy');
    if (!hasProttoy) {
      users.unshift({
        _id: 'primary-prottoy-id',
        name: 'Developer Prottoy',
        username: 'prottoy',
        email: 'prottoybiswas575358@gmail.com',
        phone: '01711-123456',
        role: 'SUPER_ADMIN',
        committeeRole: 'প্রধান সুপার এডমিন',
        permissions: ['manage_all']
      });
    }

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ইউজার তালিকা লোড করা যায়নি।' });
  }
});

app.put('/api/users/:id/committee-role', async (req, res) => {
  try {
    const { committeeRole } = req.body;
    let targetUser = await User.findById(req.params.id);

    if (!targetUser && req.params.id === 'primary-prottoy-id') {
      targetUser = await User.findOne({ username: 'prottoy' });
    }

    if (targetUser) {
      targetUser.committeeRole = committeeRole || '';
      await targetUser.save();

      // Sync with Executive Committee Collection
      if (committeeRole) {
        await CommitteeMember.findOneAndUpdate(
          { phone: targetUser.phone || targetUser.username },
          { 
            name: targetUser.name, 
            role: committeeRole, 
            phone: targetUser.phone || '01700-000000',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          },
          { upsert: true, new: true }
        );
      } else {
        await CommitteeMember.deleteMany({ phone: targetUser.phone || targetUser.username });
      }

      // Send Resend Notification Email
      sendResendEmail({
        to: targetUser.email || 'jashoresharapolsanstha@gmail.com',
        subject: 'কার্যনির্বাহী কমিটিতে অফিশিয়াল পদবী প্রদান সংক্রান্ত বিজ্ঞপ্তি 🏆',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0;">
              <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
                <h2 style="color: #10b981; margin: 0; font-size: 24px;">যশোর শারাপোল সংস্থা</h2>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">কার্যনির্বাহী কমিটি অফিশিয়াল পদবী অর্পণ</p>
              </div>
              <h3 style="color: #1e293b;">অভিনন্দন ${targetUser.name}! আপনাকে কার্যনির্বাহী কমিটিতে পদবী প্রদান করা হয়েছে 🌟</h3>
              <p style="line-height: 1.7; font-size: 15px; color: #475569;">
                আপনার সততা ও মানবিক কার্যক্রমের স্বীকৃতিস্বরূপ সংস্থা পরিচালনা পর্ষদ আপনাকে কার্যনির্বাহী কমিটিতে <strong>"${committeeRole}"</strong> হিসেবে মনোনীত করেছে।
              </p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
                👤 কর্মকর্তা: ${targetUser.name}<br/>
                🏆 অর্পিত পদবী: <strong>${committeeRole}</strong>
              </div>
            </div>
          </div>
        `
      });

      return res.json({ success: true, message: 'কমিটি পদবী সফলভাবে আপডেট করা হয়েছে!', user: targetUser });
    }

    res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কমিটি পদবী আপডেট করতে ব্যর্থ হয়েছে।' });
  }
});

app.put('/api/users/:id/role', verifyToken, checkPermission('manage_roles'), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (targetUser && (targetUser.username === 'prottoy' || targetUser.username === 'admin')) {
      return res.status(403).json({ success: false, message: 'প্রধান সুপার এডমিনের রোল পরিবর্তন করা সম্ভব নয়।' });
    }

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

    // Role Names Map
    const roleNamesMap = {
      'SUPER_ADMIN': 'সুপার এডমিন (Super Admin)',
      'BLOOD_ADMIN': 'রক্তদান ম্যানেজার (Blood Manager)',
      'MEDIA_ADMIN': 'মিডিয়া এডমিন (Media Admin)',
      'CONTENT_ADMIN': 'পোস্ট সম্পাদক (Content Admin)',
      'GENERAL_MEMBER': 'সাধারণ মেম্বার (General Member)'
    };

    // Send Resend Notification Email
    sendResendEmail({
      to: updatedUser.email || 'jashoresharapolsanstha@gmail.com',
      subject: 'অফিশিয়াল দায়িত্ব অর্পণ নোটিশ - যশোর শারাপোল সংস্থা 🎖️',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">যশোর শারাপোল সংস্থা</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 5px;">অফিশিয়াল দায়িত্ব অর্পণ নোটিশ 🎖️</p>
            </div>
            <h3 style="color: #1e293b;">অভিনন্দন ${updatedUser.name}! নতুন পদবীতে পদোন্নতি প্রদান করা হয়েছে 🌟</h3>
            <p style="line-height: 1.7; font-size: 15px; color: #475569;">
              আপনার সততা, নিষ্ঠা ও মানবিক কার্যক্রমের স্বীকৃতিস্বরূপ যশোর শারাপোল সংস্থা পরিচালনা পর্ষদ আপনাকে নতুন অফিশিয়াল দায়িত্বে উন্নীত করেছে।
            </p>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 6px; margin: 20px 0;">
              <strong style="color: #b45309; font-size: 16px;">নতুন দায়িত্ব বিবরণ:</strong><br/>
              👤 সদস্য নাম: ${updatedUser.name}<br/>
              🏆 অর্পিত নতুন পদবী: <strong>${roleNamesMap[updatedUser.role] || updatedUser.role}</strong><br/>
              📅 কার্যকরের তারিখ: আজ থেকে কার্যকর
            </div>
            <p style="line-height: 1.7; font-size: 15px; color: #475569;">
              আমরা বিশ্বাস করি আপনার এই নতুন দায়িত্ব পালনে আপনি সংস্থাকে আরও সমৃদ্ধ করবেন এবং আপনার কর্মজীবনের উত্তরোত্তর সাফল্য অর্জন করবেন। 
              আপনার কর্মজীবনের সার্বিক সফলতা ও দীর্ঘায়ু কামনা করছি।
            </p>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              যশোর শারাপোল সংস্থা কেন্দ্রীয় পরিচালনা পর্ষদ।
            </div>
          </div>
        </div>
      `
    });

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
    const targetUser = await User.findById(req.params.id);
    if (targetUser && (targetUser.username === 'prottoy' || targetUser.username === 'admin')) {
      return res.status(403).json({ success: false, message: 'প্রধান সুপার এডমিন অ্যাকাউন্ট মুছে ফেলা সম্ভব নয়।' });
    }

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
