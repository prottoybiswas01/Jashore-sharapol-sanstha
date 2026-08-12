import mongoose from 'mongoose';

// 1. Role Schema (RBAC)
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Super Admin", "Media Admin", "Blood Manager"
  key: { type: String, required: true, unique: true },  // "SUPER_ADMIN", "MEDIA_ADMIN", "BLOOD_ADMIN", "CONTENT_ADMIN"
  permissions: [{ type: String }],                     // ['manage_media', 'manage_content', 'manage_blood', 'manage_committee', 'manage_roles', 'manage_site']
  description: { type: String }
}, { timestamps: true });

// 2. User Schema (Admins & Staff)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'SUPER_ADMIN' },      // Role key
  permissions: [{ type: String }],
  phone: { type: String },
  status: { type: String, default: 'ACTIVE' }
}, { timestamps: true });

// 3. Site Settings Schema (Dynamic CMS for all website text/hero/notice)
const siteSettingsSchema = new mongoose.Schema({
  topTickerNotice: { type: String, default: 'যশোর সদরে O+ রক্তের জরুরি প্রয়োজন | ২৫০ শয্যা হাসপাতাল যশোর | হেল্পলাইন: 01711-123456' },
  heroBadgeText: { type: String, default: 'যশোর জেলা কেন্দ্রিক সামাজিক সংগঠন' },
  heroTitleText: { type: String, default: 'এক সাথে গড়ি উন্নত ও মানবিক যশোর' },
  heroDescription: { type: String, default: 'যশোর শারাপোল সংস্থা একটি সেবামূলক সামাজিক সংগঠন। রক্তদান, শীতার্ত মানুষের পাশে দাঁড়ানো, শিক্ষা সহায়তা ও এলাকার সার্বিক উন্নয়নে আমরা নিয়োজিত।' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' },
  aboutTitle: { type: String, default: 'যশোর শারাপোল সংস্থা সম্পর্কে' },
  aboutDescription: { type: String, default: "'যশোর শারাপোল সংস্থা' যশোর জেলার একটি সেবামুখী ও অরাজনৈতিক সামাজিক কল্যাণমূলক সংস্থা। এলাকার মানুষের পাশে দাঁড়ানো, জরুরি রক্তদানে তাৎক্ষণিক সহায়তা প্রদান, সুবিধাবঞ্চিত শিশুদের শিক্ষা সহায়তা এবং পরিবেশ রক্ষায় উদ্যোগ নেওয়া আমাদের মূল অঙ্গীকার।" },
  contactPhone: { type: String, default: '01711-123456' },
  contactEmail: { type: String, default: 'info@jashoresharapol.org' },
  contactAddress: { type: String, default: 'কেন্দ্রীয় কার্যালয়: চাঁচড়া মোড়, যশোর সদর, যশোর।' }
}, { timestamps: true });

// 4. Activity Schema
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'সমাজসেবা' },
  date: { type: String, required: true },
  location: { type: String, default: 'যশোর' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  description: { type: String, required: true },
  impact: { type: String, default: 'উপকৃত' }
}, { timestamps: true });

// 5. Future Plan Schema
const futurePlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'শিক্ষা' },
  targetDate: { type: String },
  description: { type: String, required: true },
  status: { type: String, default: 'পরিকল্পিত' }
}, { timestamps: true });

// 6. Committee Member Schema
const committeeMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },            // Designation e.g. "সভাপতি", "সাধারণ সম্পাদক"
  category: { type: String, default: 'নির্বাহী কমিটি' },
  phone: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  rankOrder: { type: Number, default: 99 }
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
  hospital: { type: String, required: true },
  contact: { type: String, required: true },
  bagsNeeded: { type: Number, default: 1 },
  dateNeeded: { type: String, default: 'জরুরি' },
  details: { type: String },
  status: { type: String, default: 'জরুরি' }
}, { timestamps: true });

// 9. Financial Donation Schema
const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  trxId: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, default: 'অনুমোদিত' }
}, { timestamps: true });

export const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const FuturePlan = mongoose.models.FuturePlan || mongoose.model('FuturePlan', futurePlanSchema);
export const CommitteeMember = mongoose.models.CommitteeMember || mongoose.model('CommitteeMember', committeeMemberSchema);
export const BloodDonor = mongoose.models.BloodDonor || mongoose.model('BloodDonor', bloodDonorSchema);
export const BloodRequest = mongoose.models.BloodRequest || mongoose.model('BloodRequest', bloodRequestSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
