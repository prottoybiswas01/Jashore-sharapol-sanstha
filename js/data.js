/* ==========================================================================
   Jashore Sharapol Sanstha (যশোর শারাপোল সংস্থা) - Production Data Engine
   ========================================================================== */

const INITIAL_DATA = {
  stats: {
    membersCount: 0,
    donorsCount: 0,
    projectsCompleted: 0,
    livesImpacted: 0
  },
  activities: [],
  futurePlans: [],
  committee: [],
  bloodDonors: [],
  bloodRequests: [],
  donations: []
};

class StorageManager {
  constructor() {
    this.STORAGE_KEY = 'jashore_sharapol_sanstha_prod_db';
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

  getActivities() { return this.getData().activities || []; }
  addActivity(activity) {
    const data = this.getData();
    activity.id = 'act-' + Date.now();
    data.activities.unshift(activity);
    this.saveData(data);
    return activity;
  }
  deleteActivity(id) {
    const data = this.getData();
    data.activities = data.activities.filter(a => a.id !== id);
    this.saveData(data);
  }

  getFuturePlans() { return this.getData().futurePlans || []; }
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

  getCommittee() { return this.getData().committee || []; }
  addCommitteeMember(member) {
    const data = this.getData();
    member.id = 'com-' + Date.now();
    data.committee.push(member);
    this.saveData(data);
    return member;
  }
  deleteCommitteeMember(id) {
    const data = this.getData();
    data.committee = data.committee.filter(c => c.id !== id);
    this.saveData(data);
  }

  getBloodDonors() { return this.getData().bloodDonors || []; }
  addBloodDonor(donor) {
    const data = this.getData();
    donor.id = 'donor-' + Date.now();
    data.bloodDonors.unshift(donor);
    this.saveData(data);
    return donor;
  }
  deleteBloodDonor(id) {
    const data = this.getData();
    data.bloodDonors = data.bloodDonors.filter(d => d.id !== id);
    this.saveData(data);
  }

  getBloodRequests() { return this.getData().bloodRequests || []; }
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

  getDonations() { return this.getData().donations || []; }
  addDonation(don) {
    const data = this.getData();
    don.id = 'don-' + Date.now();
    data.donations.unshift(don);
    this.saveData(data);
    return don;
  }

  getStats() { return this.getData().stats; }
}

window.db = new StorageManager();
