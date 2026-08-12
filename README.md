# 🇧🇩 যশোর শারাপোল সংস্থা (Jashore Sharapol Sanstha)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(React%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB)-059669.svg)](https://github.com/prottoybiswas01/Jashore-sharapol-sanstha)
[![Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000.svg)](https://vercel.com)
[![Security](https://img.shields.io/badge/Security-JWT%20%7C%20RBAC%20%7C%20Input%20Sanitizer-dc2626.svg)](#security--rbac)

**যশোর শারাপোল সংস্থা (Jashore Sharapol Sanstha)** একটি সেবামুখী, অরাজনৈতিক ও মানবকল্যাণমূলক সামাজিক সংগঠনের সম্পূর্ণ ওয়েব অ্যাপ্লিকেশন এবং ডায়নামিক এডমিন ম্যানেজমেন্ট ড্যাশবোর্ড।

---

## ✨ প্রধান ফিচারসমূহ (Features)

1. **🩸 ২৪/৭ রক্তদান ডিরেক্টরি ও জরুরি রক্তের আবেদন**:
   - যশোর জেলার ৮টি উপজেলা (`যশোর সদর`, `অভয়নগর`, `বাঘারপাড়া`, `চৌগাছা`, `ঝিকরগাছা`, `কেশবপুর`, `মণিরামপুর`, `শার্শা`) এবং রক্তের গ্রুপ (`A+`, `B+`, `O+`, `AB+` ইত্যাদি) ফিল্টারিং ডিরেক্টরি।
   - সাধারণ নাগরিকদের জন্য সরাসরি রক্তদাতা নিবন্ধন ও জরুরি রক্তের আবেদন পোস্ট করার সুবিধা।

2. **👤 পাবলিক সাইন-আপ ও ইউজার প্রোমোশন (RBAC)**:
   - যে কেউ ওয়েবসাইট থেকে রেজিস্ট্রেশন করে সরাসরি রক্তদাতা ও মেম্বার হিসেবে যুক্ত হতে পারবে।
   - সুপার এডমিন যেকোনো রেজিস্টার্ড ইউজারকে অ্যাডমিন ড্যাশবোর্ড থেকে পদবী বা এডমিন রোল (`Blood Manager`, `Media Admin`, `Super Admin`) হিসেবে প্রমোট করতে পারবেন।

3. **📷 ক্লায়েন্ট-সাইড হাই-স্পিড ফটো কম্প্রেশন**:
   - ফোন বা ক্যামেরা থেকে ১০+ মেগাবাইটের বড় ছবি আপলোড করলেও ব্রাউজার ক্যানভাসে স্বয়ংক্রিয়ভাবে তা **WebP/JPEG (~40KB - 80KB)** কমপ্রেসড হয়ে মঙ্গোডিবি ক্লাউডে সেভ হয়। ফলে সাইটের গতি থাকে অত্যন্ত দ্রুত!

4. **📝 সম্পূর্ণ ডায়নামিক কনটেন্ট সম্পাদক (Full Site CMS)**:
   - এডমিন প্যানেল থেকেই ওয়েবসাইটের টপ জরুরি বিজ্ঞপ্তি, হিরো শিরোনাম, আমাদের কথা ও যোগাযোগের ঠিকানা সরাসরি পরিবর্তন করা যায়।

5. **💳 অনুদান রেজিস্টার ও রিয়েল-টাইম সামারি (Donation Ledger)**:
   - বিকাশ, নগদ, রকেট ও ব্যাংক পেমেন্টের তথ্য রেজিস্টার ও ম্যানুয়াল ক্যাশ অনুদান যুক্ত করার পূর্ণ সিস্টেম।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

- **Frontend**: React.js 18, Vite, Custom Design System CSS, FontAwesome 6
- **Backend API**: Node.js, Express.js (Vercel Serverless Ready)
- **Database**: MongoDB Atlas Cloud (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), `bcryptjs` Password Hashing, RBAC Middleware, Security Headers & Input Sanitization
- **Deployment**: Vercel Ready (`vercel.json` with Rewrites)

---
|

---

## 🚀 লোকাল ইনস্টলেশন ও রান করার উপায় (Local Setup)

```bash
# ১. প্রজেক্ট ক্লোন করুন
git clone https://github.com/prottoybiswas01/Jashore-sharapol-sanstha.git

# ২. ডিপেনডেন্সি ইন্সটল করুন
cd Jashore-sharapol-sanstha
npm install

# ৩. ফ্রন্টএন্ড ও ব্যাকএন্ড একসাথে চালু করুন
npm run dev      # Vite React app (http://localhost:3000)
npm run server   # Node Express API (http://localhost:5000)
```

---

## ☁️ Vercel এ ডেপ্লয় করার নির্দেশিকা

প্রজেক্টটিতে `vercel.json` কনফিগারেশন সরাসরি সেট করা আছে। 
Vercel এ ইম্পোর্ট করে Environment Variables সেকশনে নিচের কি-গুলো যোগ করুন:

- `MONGODB_URI`: আপনার MongoDB Atlas Connection URI String
- `JWT_SECRET`: আপনার কাস্টম সিক্রেট কি

---

## 📜 লাইসেন্স
এই প্রজেক্টটি **যশোর শারাপোল সংস্থা**-এর জন্য উন্মুক্ত সামাজিক মানবসেবার উদ্দেশ্যে তৈরি করা হয়েছে।
