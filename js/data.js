/* ==========================================================================
   Jashore Sharapol Sanstha (যশোর শারাপোল সংস্থা) - Data Engine & Storage Manager
   ========================================================================== */

const INITIAL_DATA = {
  stats: {
    membersCount: 154,
    donorsCount: 420,
    projectsCompleted: 38,
    livesImpacted: 12500
  },
  
  activities: [
    {
      id: "act-1",
      title: "যশোর সদরে ফ্রি মেডিকেল ক্যাম্প ও ওষুধ বিতরণ",
      category: "স্বাস্থ্য সেবা",
      date: "২০২৬-০7-১৫",
      location: "যশোর সদর, যশোর",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      description: "যশোর সদর উপজেলার ৫০০ জন অসহায় ও দুঃস্থ মানুষের মাঝে বিনামূল্যে স্বাস্থ্যসেবা ও প্রয়োজনীয় ওষুধ বিতরণ করা হয়।",
      impact: "৫০০+ সুবিধাভোগী"
    },
    {
      id: "act-2",
      title: "অভয়নগরে বৃক্ষরোপণ অভিযান ও চারা বিতরণ",
      category: "পরিবেশ উন্নয়ন",
      date: "২০২৬-০৬-২০",
      location: "অভয়নগর, যশোর",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      description: "পরিবেশ রক্ষায় ১,০০০ টি ফলজ ও বনজ চারাগাছ রোপণ ও স্থানীয়দের মাঝে বিতরণ করা হয়।",
      impact: "১,০০০ চারা রোপণ"
    },
    {
      id: "act-3",
      title: "কেশবপুরে শীতবস্ত্র ও কম্বল বিতরণ",
      category: "ত্রাণ ও সাহায্য",
      date: "২০২৬-০১-১০",
      location: "কেশবপুর, যশোর",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      description: "তীব্র শীতকালীন সময়ে ৩৫০ জন শীতার্ত পরিবারের মাঝে মানসম্মত কম্বল ও শীতবস্ত্র পৌঁছে দেওয়া হয়।",
      impact: "৩৫০ পরিবার"
    },
    {
      id: "act-4",
      title: "যুবদের আইটি ও দক্ষতা উন্নয়ন কর্মশালা",
      category: "শিক্ষা ও প্রশিক্ষণ",
      date: "২০২৬-০৫-০৫",
      location: "শারাপোল কার্যালয়, যশোর",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      description: "যশোরের ৫০ জন মেধাবী ও অসচ্ছল শিক্ষার্থীকে বিনামূল্যে ফ্রিল্যান্সিং ও কম্পিউটার বেসিক প্রশিক্ষণ প্রদান।",
      impact: "৫০ জন তরুণ"
    }
  ],

  futurePlans: [
    {
      id: "plan-1",
      title: "যশোরে শারাপোল ফ্রি কম্পিউটার ল্যাব স্থাপন",
      targetDate: "২০২৬-১০-০১",
      category: "শিক্ষা",
      description: "অসচ্ছল তরুণ-তরুণীদের বিনামূল্যে আইটি প্রশিক্ষণ প্রদানের জন্য ২০ টি কম্পিউটার সমৃদ্ধ ল্যাব নির্মাণ।",
      status: "চলমান"
    },
    {
      id: "plan-2",
      title: "ঝিকরগাছায় বিশুদ্ধ খাওয়ার পানির গভীর নলকূপ স্থাপন",
      targetDate: "২০২৬-১১-১৫",
      category: "জনস্বাস্থ্য",
      description: "পানি সংকটাপন্ন এলাকায় ১০ টি বিনামূল্যে ব্যবহারযোগ্য বিশুদ্ধ পানির আর্সেনিকমুক্ত নলকূপ স্থাপন।",
      status: "পরিকল্পিত"
    },
    {
      id: "plan-3",
      title: "শারাপোল শিক্ষা ফান্ড - শিক্ষাবৃত্তি প্রদান",
      targetDate: "২০২৬-১২-২০",
      category: "বৃত্তি",
      description: "যশোর জেলার ১০০ জন অসচ্ছল জিপিএ-৫ প্রাপ্ত শিক্ষার্থীকে বাৎসরিক বৃত্তি প্রদান।",
      status: "পরিকল্পিত"
    }
  ],

  committee: [
    {
      id: "com-1",
      name: "কাজী তানভীর আহমেদ",
      role: "সভাপতি",
      category: "সভাপতি",
      phone: "01711-123456",
      email: "president@sharapol.org",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২২"
    },
    {
      id: "com-2",
      name: "মাহমুদুল হাসান শুভ",
      role: "সাধারণ সম্পাদক",
      category: "সাধারণ সম্পাদক",
      phone: "01712-987654",
      email: "secretary@sharapol.org",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২২"
    },
    {
      id: "com-3",
      name: "ফারহানা আক্তার রিন্টু",
      role: "সহ-সভাপতি",
      category: "সহ-সভাপতি",
      phone: "01819-223344",
      email: "vp@sharapol.org",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২২"
    },
    {
      id: "com-4",
      name: "সাইফুল ইসলাম রিফাত",
      role: "সাংগঠনিক সম্পাদক",
      category: "সাংগঠনিক সম্পাদক",
      phone: "01911-556677",
      email: "org@sharapol.org",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২৩"
    },
    {
      id: "com-5",
      name: "মোঃ আরিফ হোসেন",
      role: "অর্থ সম্পাদক (ক্যাশিয়ার)",
      category: "ক্যাশিয়ার",
      phone: "01715-443322",
      email: "cashier@sharapol.org",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২৩"
    },
    {
      id: "com-6",
      name: "ড. শফিকুর রহমান",
      role: "রক্তদান ও সমাজকল্যাণ সম্পাদক",
      category: "রক্তদান সম্পাদক",
      phone: "01812-778899",
      email: "blood@sharapol.org",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      joinDate: "২০২৩"
    }
  ],

  bloodDonors: [
    {
      id: "donor-1",
      name: "মোঃ রাশেদুল ইসলাম",
      bloodGroup: "O+",
      upazila: "যশোর সদর",
      phone: "01710-112233",
      lastDonation: "২০২৬-০৩-১০",
      available: true
    },
    {
      id: "donor-2",
      name: "সাদিয়া নাসরিন",
      bloodGroup: "A+",
      upazila: "ঝিকরগাছা",
      phone: "01815-445566",
      lastDonation: "২০২৫-১১-২০",
      available: true
    },
    {
      id: "donor-3",
      name: "কাজী ইমরান হোসেন",
      bloodGroup: "B+",
      upazila: "অভয়নগর",
      phone: "01912-778899",
      lastDonation: "২০২৬-০৫-০১",
      available: true
    },
    {
      id: "donor-4",
      name: "আরিফুল ইসলাম",
      bloodGroup: "AB+",
      upazila: "শার্শা",
      phone: "01714-334455",
      lastDonation: "২০২৬-০১-১৫",
      available: true
    },
    {
      id: "donor-5",
      name: "মেহেদী হাসান রাজু",
      bloodGroup: "O-",
      upazila: "কেশবপুর",
      phone: "01811-998877",
      lastDonation: "২০২৬-০২-২৮",
      available: true
    },
    {
      id: "donor-6",
      name: "সাব্বির আহমেদ",
      bloodGroup: "A-",
      upazila: "মণিরামপুর",
      phone: "01915-223344",
      lastDonation: "২০২৫-১০-১২",
      available: true
    }
  ],

  bloodRequests: [
    {
      id: "req-1",
      patientName: "মোসাঃ ফাতেমা বেগম",
      bloodGroup: "O+",
      hospital: "২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল, যশোর",
      contact: "01712-334455",
      bagsNeeded: 2,
      dateNeeded: "আজই জরুরি",
      status: "জরুরি",
      details: "গর্ভবতী মায়ের সিজারিয়ান অপারেশনের জন্য অবিলম্বে রক্তের প্রয়োজন।"
    },
    {
      id: "req-2",
      patientName: "কামরুল ইসলাম",
      bloodGroup: "B+",
      hospital: "কুইন্স হাসপাতাল, যশোর",
      contact: "01819-667788",
      bagsNeeded: 1,
      dateNeeded: "আগামীকাল সকালে",
      status: "জরুরি",
      details: "সড়ক দুর্ঘটনায় আহত রোগীর জন্য রক্ত প্রয়োজন।"
    }
  ],

  donations: [
    {
      id: "don-1",
      donorName: "আলহাজ্ব রফিকুল ইসলাম",
      amount: 5000,
      method: "bKash",
      trxId: "BK9X82M1",
      date: "২০২৬-০8-০২",
      status: "অনুমোদিত"
    },
    {
      id: "don-2",
      donorName: "তানজিলা বেগম",
      amount: 2000,
      method: "Nagad",
      trxId: "NG7Y33P9",
      date: "২০২৬-০8-০৫",
      status: "অনুমোদিত"
    }
  ]
};

// Storage Engine
class StorageManager {
  constructor() {
    this.STORAGE_KEY = 'jashore_sharapol_sanstha_db';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    }
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || INITIAL_DATA;
    } catch (e) {
      console.error("Error reading LocalStorage data:", e);
      return INITIAL_DATA;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving data:", e);
    }
  }

  // Activities CRUD
  getActivities() {
    return this.getData().activities || [];
  }

  addActivity(activity) {
    const data = this.getData();
    activity.id = 'act-' + Date.now();
    data.activities.unshift(activity);
    data.stats.projectsCompleted = (data.stats.projectsCompleted || 0) + 1;
    this.saveData(data);
    return activity;
  }

  deleteActivity(id) {
    const data = this.getData();
    data.activities = data.activities.filter(a => a.id !== id);
    this.saveData(data);
  }

  // Future Plans CRUD
  getFuturePlans() {
    return this.getData().futurePlans || [];
  }

  addFuturePlan(plan) {
    const data = this.getData();
    plan.id = 'plan-' + Date.now();
    data.futurePlans.unshift(plan);
    this.saveData(data);
    return plan;
  }

  deleteFuturePlan(id) {
    const data = this.getData();
    data.futurePlans = data.futurePlans.filter(p => p.id !== id);
    this.saveData(data);
  }

  // Committee CRUD
  getCommittee() {
    return this.getData().committee || [];
  }

  addCommitteeMember(member) {
    const data = this.getData();
    member.id = 'com-' + Date.now();
    data.committee.push(member);
    data.stats.membersCount = (data.stats.membersCount || 0) + 1;
    this.saveData(data);
    return member;
  }

  deleteCommitteeMember(id) {
    const data = this.getData();
    data.committee = data.committee.filter(c => c.id !== id);
    this.saveData(data);
  }

  // Blood Donors CRUD
  getBloodDonors() {
    return this.getData().bloodDonors || [];
  }

  addBloodDonor(donor) {
    const data = this.getData();
    donor.id = 'donor-' + Date.now();
    data.bloodDonors.unshift(donor);
    data.stats.donorsCount = (data.stats.donorsCount || 0) + 1;
    this.saveData(data);
    return donor;
  }

  deleteBloodDonor(id) {
    const data = this.getData();
    data.bloodDonors = data.bloodDonors.filter(d => d.id !== id);
    this.saveData(data);
  }

  // Blood Requests CRUD
  getBloodRequests() {
    return this.getData().bloodRequests || [];
  }

  addBloodRequest(req) {
    const data = this.getData();
    req.id = 'req-' + Date.now();
    data.bloodRequests.unshift(req);
    this.saveData(data);
    return req;
  }

  deleteBloodRequest(id) {
    const data = this.getData();
    data.bloodRequests = data.bloodRequests.filter(r => r.id !== id);
    this.saveData(data);
  }

  // Financial Donations CRUD
  getDonations() {
    return this.getData().donations || [];
  }

  addDonation(don) {
    const data = this.getData();
    don.id = 'don-' + Date.now();
    data.donations.unshift(don);
    this.saveData(data);
    return don;
  }

  // Stats
  getStats() {
    return this.getData().stats;
  }
}

window.db = new StorageManager();
