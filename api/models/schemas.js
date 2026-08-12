import mongoose from 'mongoose';

// 1. Site Settings Schema (Dynamic CMS)
const siteSettingsSchema = new mongoose.Schema({
  topTickerNotice: { type: String, default: 'যশোর শারাপোল সংস্থায় আপনাকে স্বাগতম | রক্তের জন্য যোগাযোগ করুন: 01711-123456' },
  heroBadgeText: { type: String, default: 'যশোর জেলা কেন্দ্রিক সামাজিক সংগঠন' },
  heroTitleText: { type: String, default: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর' },
  heroDescription: { type: String, default: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, শিক্ষা সহায়তা ও এলাকার সার্বিক উন্নয়নে আমরা নিবেদিত।' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' },
  aboutTitle: { type: String, default: 'যশোর শারাপোল সংস্থা সম্পর্কে' },
  aboutDescription: { type: String, default: "'যশোর শারাপোল সংস্থা' যশোর জেলার একটি সেবামুখী ও অরাজনৈতিক সামাজিক কল্যাণমূলক সংস্থা। এলাকার মানুষের পাশে দাঁড়ানো, জরুরি রক্তদানে তাৎক্ষণিক সহায়তা প্রদান, সুবিধাবঞ্চিত শিশুদের শিক্ষা সহায়তা এবং পরিবেশ রক্ষায় উদ্যোগ নেওয়া আমাদের মূল অঙ্গীকার।" },
  contactPhone: { type: String, default: '01711-123456' },
  contactEmail: { type: String, default: 'info@jashoresharapol.org' },
  contactAddress: { type: String, default: 'কেন্দ্রীয় কার্যালয়: চাঁচড়া মোড়, যশোর সদর, যশোর।' }
}, { timestamps: true });

// 2. User & RBAC Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'GENERAL_MEMBER' }, // SUPER_ADMIN, MEDIA_ADMIN, CONTENT_ADMIN, BLOOD_ADMIN, GENERAL_MEMBER
  committeeRole: { type: String, default: '' }, // e.g. 'সভাপতি', 'সহ-সভাপতি', etc.
  permissions: [{ type: String }]
}, { timestamps: true });

// 3. Role Schema
const roleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  permissions: [{ type: String }]
});

// 4. Activity Schema (Supports YouTube Video, Subtitle, Expense & Likes)
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String }, // Optional Subtitle / Short Summary
  category: { type: String, default: 'সামাজিক সেবা' },
  date: { type: String, required: true },
  location: { type: String, default: 'যশোর' },
  image: { type: String },
  videoUrl: { type: String }, // Optional YouTube Embed URL
  description: { type: String, required: true },
  impact: { type: String, default: 'উপকৃত পরিবার' },
  expense: { type: Number, default: 0 }, // Total Cost / Expense Spent in Taka (৳)
  likes: { type: Number, default: 0 }
}, { timestamps: true });

// 5. Future Plan Schema
const futurePlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'পরিকল্পনা' },
  targetDate: { type: String },
  description: { type: String, required: true },
  status: { type: String, default: 'পরিকল্পিত' }
}, { timestamps: true });

// 6. Committee Member Schema
const committeeMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, default: '01700-000000' },
  image: { type: String },
  order: { type: Number, default: 1 }
}, { timestamps: true });

// 7. Blood Donor Schema
const bloodDonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  upazila: { type: String, required: true },
  phone: { type: String, required: true },
  lastDonation: { type: String, default: 'সম্প্রতি' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

// 8. Blood Request Schema
const bloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  bagsNeeded: { type: Number, default: 1 },
  hospital: { type: String, required: true },
  contact: { type: String, required: true },
  details: { type: String },
  status: { type: String, default: 'জরুরি' }
}, { timestamps: true });

// 9. Financial Donation Schema
const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, default: 'bKash' }, // bKash, Nagad, Rocket, Bank, Cash
  trxId: { type: String, default: 'CASH_ENTRY' },
  date: { type: String },
  status: { type: String, default: 'অনুমোদিত' }
}, { timestamps: true });

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const FuturePlan = mongoose.models.FuturePlan || mongoose.model('FuturePlan', futurePlanSchema);
export const CommitteeMember = mongoose.models.CommitteeMember || mongoose.model('CommitteeMember', committeeMemberSchema);
export const BloodDonor = mongoose.models.BloodDonor || mongoose.model('BloodDonor', bloodDonorSchema);
export const BloodRequest = mongoose.models.BloodRequest || mongoose.model('BloodRequest', bloodRequestSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
