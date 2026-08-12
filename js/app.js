/* ==========================================================================
   Jashore Sharapol Sanstha (যশোর শারাপোল সংস্থা) - Application Controller
   ========================================================================== */

class AppController {
  constructor() {
    this.currentSection = 'home';
    this.isAdminLoggedIn = false;
    this.init();
  }

  init() {
    // Check saved theme
    const savedTheme = localStorage.getItem('jashore_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    // Initial render
    this.renderAllViews();

    // Setup window event handlers for closing modals on overlay click
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
      }
    });
  }

  // Render all views across sections
  renderAllViews() {
    this.renderHomeSection();
    this.renderActivitiesSection();
    this.renderCommitteeSection();
    this.renderBloodSection();
    this.renderDonateSection();
    this.renderAdminSection();
    this.updateStatsCounters();
  }

  // Navigation SPA Router
  showSection(sectionId) {
    this.currentSection = sectionId;

    // Hide all page sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.style.display = 'none');

    // Show target section
    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
      target.style.display = 'block';
    }

    // Update nav links active state
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    document.getElementById('nav-menu').classList.remove('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh view data
    this.renderAllViews();
  }

  // Toggle Dark/Light Theme
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jashore_theme', next);
    this.updateThemeIcon(next);
    this.showToast(next === 'dark' ? 'ডিম / ডার্ক থিম চালুকৃত' : 'লাইটার থিম চালুকৃত', 'info');
  }

  updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
    }
  }

  toggleMobileMenu() {
    document.getElementById('nav-menu').classList.toggle('open');
  }

  // Toast Notification System
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>';
    if (type === 'blood' || type === 'error') {
      icon = '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
    } else if (type === 'info') {
      icon = '<i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Modal Dialog Handlers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  // Clipboard Utility
  copyText(text) {
    navigator.clipboard.writeText(text);
    this.showToast(`কপি করা হয়েছে: ${text}`, 'info');
  }

  // Update Statistics
  updateStatsCounters() {
    const stats = window.db.getStats();
    if (document.getElementById('stat-members')) document.getElementById('stat-members').innerText = `${stats.membersCount}+`;
    if (document.getElementById('stat-donors')) document.getElementById('stat-donors').innerText = `${stats.donorsCount}+`;
    if (document.getElementById('stat-projects')) document.getElementById('stat-projects').innerText = `${stats.projectsCompleted}+`;
    if (document.getElementById('stat-lives')) document.getElementById('stat-lives').innerText = `${stats.livesImpacted.toLocaleString()}+`;
  }

  /* ==========================================================================
     Render Sections
     ========================================================================== */

  // 1. Home Section Render
  renderHomeSection() {
    // Recent activities grid (Top 3)
    const activities = window.db.getActivities().slice(0, 3);
    const actGrid = document.getElementById('home-activities-grid');
    if (actGrid) {
      actGrid.innerHTML = activities.map(act => `
        <div class="activity-card">
          <img src="${act.image}" alt="${act.title}" class="activity-img">
          <div class="activity-body">
            <div class="activity-date">
              <i class="fa-regular fa-calendar-days"></i> ${act.date} &bull; <i class="fa-solid fa-location-dot"></i> ${act.location}
            </div>
            <h3 class="activity-title">${act.title}</h3>
            <p class="activity-desc">${act.description}</p>
            <div class="flex justify-between items-center" style="margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
              <span class="badge badge-primary">${act.category}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark);">${act.impact}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Emergency blood requests preview (Top 2)
    const requests = window.db.getBloodRequests().slice(0, 2);
    const reqList = document.getElementById('home-blood-requests-list');
    if (reqList) {
      if (requests.length === 0) {
        reqList.innerHTML = `<p style="color: var(--text-muted);">বর্তমানে কোনো জরুরি রক্ত আবেদন নেই।</p>`;
      } else {
        reqList.innerHTML = requests.map(r => `
          <div class="request-card">
            <div class="flex items-center gap-3">
              <div class="blood-badge-large">${r.bloodGroup}</div>
              <div>
                <h4 style="font-size: 1.15rem; margin-bottom: 0.2rem;">${r.patientName} (${r.bagsNeeded} ব্যাগ)</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);">
                  <i class="fa-solid fa-hospital" style="color: var(--blood-red);"></i> ${r.hospital}
                </p>
                <small style="color: var(--text-muted);">${r.details || ''}</small>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a href="tel:${r.contact}" class="btn btn-blood btn-sm">
                <i class="fa-solid fa-phone-volume"></i> ${r.contact}
              </a>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // 2. Activities & Plans Section
  switchActivitiesTab(tab) {
    const btnComp = document.getElementById('btn-tab-completed');
    const btnFut = document.getElementById('btn-tab-future');
    const viewComp = document.getElementById('tab-completed-view');
    const viewFut = document.getElementById('tab-future-view');

    if (tab === 'completed') {
      btnComp.className = 'btn btn-primary';
      btnFut.className = 'btn btn-outline';
      viewComp.style.display = 'block';
      viewFut.style.display = 'none';
    } else {
      btnComp.className = 'btn btn-outline';
      btnFut.className = 'btn btn-primary';
      viewComp.style.display = 'none';
      viewFut.style.display = 'block';
    }
  }

  renderActivitiesSection() {
    // Completed Activities
    const activities = window.db.getActivities();
    const actGrid = document.getElementById('all-activities-grid');
    if (actGrid) {
      actGrid.innerHTML = activities.map(act => `
        <div class="activity-card">
          <img src="${act.image}" alt="${act.title}" class="activity-img">
          <div class="activity-body">
            <div class="activity-date">
              <i class="fa-regular fa-calendar-days"></i> ${act.date} &bull; <i class="fa-solid fa-location-dot"></i> ${act.location}
            </div>
            <h3 class="activity-title">${act.title}</h3>
            <p class="activity-desc">${act.description}</p>
            <div class="flex justify-between items-center" style="margin-top: auto;">
              <span class="badge badge-primary">${act.category}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">${act.impact}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Future Plans
    const plans = window.db.getFuturePlans();
    const planGrid = document.getElementById('all-future-plans-grid');
    if (planGrid) {
      planGrid.innerHTML = plans.map(p => `
        <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div class="flex justify-between items-center" style="margin-bottom: 0.75rem;">
            <span class="badge badge-gold">${p.category}</span>
            <span class="badge badge-info"><i class="fa-regular fa-clock"></i> টার্গেট: ${p.targetDate || 'নির্ধারিত নয়'}</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary-dark);">${p.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${p.description}</p>
        </div>
      `).join('');
    }
  }

  // 3. Committee Section
  renderCommitteeSection() {
    const committee = window.db.getCommittee();
    const grid = document.getElementById('committee-members-grid');
    if (grid) {
      grid.innerHTML = committee.map(c => `
        <div class="committee-card">
          <img src="${c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${c.name}" class="member-photo">
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">${c.role}</span>
          <h3 class="member-name">${c.name}</h3>
          <div class="member-phone">
            <i class="fa-solid fa-phone" style="color: var(--primary);"></i> ${c.phone}
          </div>
          ${c.email ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">${c.email}</p>` : ''}
        </div>
      `).join('');
    }
  }

  // 4. Blood Donation Section
  renderBloodSection() {
    // Render Full Requests Feed
    const requests = window.db.getBloodRequests();
    const reqContainer = document.getElementById('full-blood-requests-list');
    if (reqContainer) {
      if (requests.length === 0) {
        reqContainer.innerHTML = `<p style="color: var(--text-muted);">বর্তমানে কোনো জরুরি রক্ত আবেদন নেই।</p>`;
      } else {
        reqContainer.innerHTML = requests.map(r => `
          <div class="request-card">
            <div class="flex items-center gap-3">
              <div class="blood-badge-large">${r.bloodGroup}</div>
              <div>
                <h4 style="font-size: 1.2rem; margin-bottom: 0.25rem;">${r.patientName} &bull; ${r.bagsNeeded} ব্যাগ রক্ত</h4>
                <p style="font-size: 0.95rem; color: var(--text-muted);">
                  <i class="fa-solid fa-hospital" style="color: var(--blood-red);"></i> ${r.hospital} &bull; <i class="fa-regular fa-clock"></i> ${r.dateNeeded}
                </p>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${r.details || ''}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a href="tel:${r.contact}" class="btn btn-blood">
                <i class="fa-solid fa-phone-volume"></i> কল দিন: ${r.contact}
              </a>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Filtered Donors
    this.filterDonors();
  }

  filterDonors() {
    const selectedGroup = document.getElementById('filter-blood-group')?.value || 'ALL';
    const selectedUpazila = document.getElementById('filter-upazila')?.value || 'ALL';

    let donors = window.db.getBloodDonors();

    if (selectedGroup !== 'ALL') {
      donors = donors.filter(d => d.bloodGroup === selectedGroup);
    }
    if (selectedUpazila !== 'ALL') {
      donors = donors.filter(d => d.upazila === selectedUpazila);
    }

    const grid = document.getElementById('donors-grid');
    const title = document.getElementById('donor-directory-title');

    if (title) {
      title.innerText = `নিবন্ধিত রক্তদাতা (${donors.length} জন পাওয়া গেছে)`;
    }

    if (grid) {
      if (donors.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">দুঃখিত, নির্ধারিত ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি।</div>`;
      } else {
        grid.innerHTML = donors.map(d => `
          <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="flex justify-between items-center" style="margin-bottom: 0.75rem;">
                <span class="badge badge-blood" style="font-size: 1rem; padding: 0.3rem 0.8rem;">${d.bloodGroup}</span>
                <span class="badge badge-primary"><i class="fa-solid fa-location-dot"></i> ${d.upazila}</span>
              </div>
              <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.3rem;">${d.name}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                সর্বশেষ রক্তদান: ${d.lastDonation || 'তথ্য নেই'}
              </p>
            </div>
            <a href="tel:${d.phone}" class="btn btn-outline btn-sm" style="width: 100%;">
              <i class="fa-solid fa-phone"></i> ${d.phone}
            </a>
          </div>
        `).join('');
      }
    }
  }

  resetDonorFilters() {
    if (document.getElementById('filter-blood-group')) document.getElementById('filter-blood-group').value = 'ALL';
    if (document.getElementById('filter-upazila')) document.getElementById('filter-upazila').value = 'ALL';
    this.filterDonors();
  }

  // Handlers for Blood Request & Donor Registration
  handleBloodRequestSubmit(e) {
    e.preventDefault();
    const req = {
      patientName: document.getElementById('req-patient').value,
      bloodGroup: document.getElementById('req-group').value,
      hospital: document.getElementById('req-hospital').value,
      contact: document.getElementById('req-phone').value,
      bagsNeeded: 1,
      dateNeeded: "জরুরি",
      details: document.getElementById('req-details').value
    };

    window.db.addBloodRequest(req);
    this.closeModal('modal-blood-request');
    this.showToast('জরুরি রক্তের আবেদন সফলভাবে প্রকাশিত হয়েছে!', 'blood');
    e.target.reset();
    this.renderAllViews();
  }

  handleDonorRegisterSubmit(e) {
    e.preventDefault();
    const donor = {
      name: document.getElementById('reg-name').value,
      bloodGroup: document.getElementById('reg-group').value,
      upazila: document.getElementById('reg-upazila').value,
      phone: document.getElementById('reg-phone').value,
      lastDonation: document.getElementById('reg-lastdate').value || 'সম্প্রতি',
      available: true
    };

    window.db.addBloodDonor(donor);
    this.closeModal('modal-donor-register');
    this.showToast('অভিনন্দন! আপনি সফলভাবে রক্তদাতা হিসেবে নিবন্ধিত হয়েছেন।', 'success');
    e.target.reset();
    this.renderAllViews();
  }

  // 5. Donation Section
  renderDonateSection() {
    const donations = window.db.getDonations();
    const tbody = document.getElementById('public-donations-tbody');
    if (tbody) {
      tbody.innerHTML = donations.map(d => `
        <tr>
          <td><strong>${d.donorName}</strong></td>
          <td style="color: var(--primary); font-weight: 700;">৳ ${d.amount.toLocaleString()}</td>
          <td><span class="badge badge-info">${d.method}</span></td>
          <td>${d.date || '২০২৬-০৮-১২'}</td>
          <td><span class="badge badge-primary">${d.status || 'অনুমোদিত'}</span></td>
        </tr>
      `).join('');
    }
  }

  handleDonationSubmit(e) {
    e.preventDefault();
    const donation = {
      donorName: document.getElementById('don-name').value,
      amount: parseInt(document.getElementById('don-amount').value),
      method: document.getElementById('don-method').value,
      trxId: document.getElementById('don-trx').value,
      date: new Date().toISOString().split('T')[0],
      status: "অনুমোদিত"
    };

    window.db.addDonation(donation);
    this.showToast('আপনার অনুদানের তথ্য ধন্যবাদান্তে গ্রহণ করা হয়েছে!', 'success');
    e.target.reset();
    this.renderDonateSection();
  }

  /* ==========================================================================
     Admin Panel Controller & Actions
     ========================================================================== */

  handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'admin' && pass === 'admin123') {
      this.isAdminLoggedIn = true;
      document.getElementById('admin-login-view').style.display = 'none';
      document.getElementById('admin-dashboard-view').style.display = 'block';
      this.showToast('এডমিন প্যানেলে স্বাগতম!', 'info');
      this.renderAdminSection();
    } else {
      this.showToast('ভুল ইউজার বা পাসওয়ার্ড!', 'error');
    }
  }

  adminLogout() {
    this.isAdminLoggedIn = false;
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'block';
    this.showToast('সফলভাবে লগআউট করা হয়েছে।', 'info');
  }

  switchAdminTab(tabId) {
    const tabs = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(t => t.style.display = 'none');

    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';

    const menuItems = document.querySelectorAll('.admin-menu-item');
    menuItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.renderAdminSection();
  }

  renderAdminSection() {
    if (!this.isAdminLoggedIn) return;

    // Overview stats
    const activities = window.db.getActivities();
    const donors = window.db.getBloodDonors();
    const committee = window.db.getCommittee();
    const requests = window.db.getBloodRequests();
    const plans = window.db.getFuturePlans();
    const donations = window.db.getDonations();

    if (document.getElementById('adm-stat-activities')) document.getElementById('adm-stat-activities').innerText = activities.length;
    if (document.getElementById('adm-stat-donors')) document.getElementById('adm-stat-donors').innerText = donors.length;
    if (document.getElementById('adm-stat-committee')) document.getElementById('adm-stat-committee').innerText = committee.length;
    if (document.getElementById('adm-stat-requests')) document.getElementById('adm-stat-requests').innerText = requests.length;

    // Render Admin Tables
    // Activities
    const actBody = document.getElementById('adm-activities-tbody');
    if (actBody) {
      actBody.innerHTML = activities.map(a => `
        <tr>
          <td><img src="${a.image}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;"></td>
          <td><strong>${a.title}</strong></td>
          <td>${a.category}</td>
          <td>${a.date}</td>
          <td>${a.location}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.deleteActivity('${a.id}')" style="color: var(--blood-red); border-color: var(--blood-red);">
              <i class="fa-solid fa-trash"></i> মুছুন
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Plans
    const planBody = document.getElementById('adm-plans-tbody');
    if (planBody) {
      planBody.innerHTML = plans.map(p => `
        <tr>
          <td><strong>${p.title}</strong></td>
          <td>${p.category}</td>
          <td>${p.targetDate || '-'}</td>
          <td><span class="badge badge-gold">${p.status || 'চলমান'}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.deletePlan('${p.id}')" style="color: var(--blood-red); border-color: var(--blood-red);">
              <i class="fa-solid fa-trash"></i> মুছুন
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Committee
    const comBody = document.getElementById('adm-committee-tbody');
    if (comBody) {
      comBody.innerHTML = committee.map(c => `
        <tr>
          <td><img src="${c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
          <td><strong>${c.name}</strong></td>
          <td><span class="badge badge-primary">${c.role}</span></td>
          <td>${c.phone}</td>
          <td>${c.email || '-'}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.deleteCommitteeMember('${c.id}')" style="color: var(--blood-red); border-color: var(--blood-red);">
              <i class="fa-solid fa-trash"></i> মুছুন
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Donors & Requests
    const reqBody = document.getElementById('adm-requests-tbody');
    if (reqBody) {
      reqBody.innerHTML = requests.map(r => `
        <tr>
          <td><strong>${r.patientName}</strong></td>
          <td><span class="badge badge-blood">${r.bloodGroup}</span></td>
          <td>${r.hospital}</td>
          <td>${r.contact}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="app.deleteBloodRequest('${r.id}')">
              <i class="fa-solid fa-check"></i> সম্পন্ন নিশ্চিত
            </button>
          </td>
        </tr>
      `).join('');
    }

    const donorBody = document.getElementById('adm-donors-tbody');
    if (donorBody) {
      donorBody.innerHTML = donors.map(d => `
        <tr>
          <td><strong>${d.name}</strong></td>
          <td><span class="badge badge-blood">${d.bloodGroup}</span></td>
          <td>${d.upazila}</td>
          <td>${d.phone}</td>
          <td>${d.lastDonation}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.deleteDonor('${d.id}')" style="color: var(--blood-red); border-color: var(--blood-red);">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Donations
    const donBody = document.getElementById('adm-donations-tbody');
    if (donBody) {
      donBody.innerHTML = donations.map(d => `
        <tr>
          <td><strong>${d.donorName}</strong></td>
          <td>৳ ${d.amount}</td>
          <td>${d.method}</td>
          <td><code>${d.trxId}</code></td>
          <td>${d.date}</td>
          <td><span class="badge badge-primary">${d.status}</span></td>
        </tr>
      `).join('');
    }
  }

  // Admin Add Handlers
  handleAdminAddActivity(e) {
    e.preventDefault();
    const act = {
      title: document.getElementById('adm-act-title').value,
      category: document.getElementById('adm-act-cat').value || 'সামাজিক সেবা',
      date: document.getElementById('adm-act-date').value,
      location: document.getElementById('adm-act-loc').value || 'যশোর',
      image: document.getElementById('adm-act-img').value || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
      description: document.getElementById('adm-act-desc').value,
      impact: 'প্রকল্প'
    };

    window.db.addActivity(act);
    this.closeModal('modal-add-activity');
    this.showToast('নতুন কাজের রেকর্ড যুক্ত হয়েছে!', 'success');
    e.target.reset();
    this.renderAllViews();
  }

  handleAdminAddPlan(e) {
    e.preventDefault();
    const plan = {
      title: document.getElementById('adm-plan-title').value,
      category: document.getElementById('adm-plan-cat').value || 'পরিকল্পনা',
      targetDate: document.getElementById('adm-plan-date').value,
      description: document.getElementById('adm-plan-desc').value,
      status: 'পরিকল্পিত'
    };

    window.db.addFuturePlan(plan);
    this.closeModal('modal-add-plan');
    this.showToast('ভবিষ্যৎ পরিকল্পনা যুক্ত হয়েছে!', 'success');
    e.target.reset();
    this.renderAllViews();
  }

  handleAdminAddMember(e) {
    e.preventDefault();
    const member = {
      name: document.getElementById('adm-mem-name').value,
      role: document.getElementById('adm-mem-role').value,
      phone: document.getElementById('adm-mem-phone').value || '01700-000000',
      image: document.getElementById('adm-mem-img').value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };

    window.db.addCommitteeMember(member);
    this.closeModal('modal-add-member');
    this.showToast('কমিটিতে নতুন সদস্য যুক্ত হয়েছেন!', 'success');
    e.target.reset();
    this.renderAllViews();
  }

  // Admin Delete Handlers
  deleteActivity(id) {
    if (confirm('আপনি কি এই কাজের রেকর্ডটি মুছে ফেলতে চান?')) {
      window.db.deleteActivity(id);
      this.showToast('রেকর্ড মুছে ফেলা হয়েছে', 'info');
      this.renderAllViews();
    }
  }

  deletePlan(id) {
    if (confirm('আপনি কি এই পরিকল্পনাটি মুছে ফেলতে চান?')) {
      window.db.deleteFuturePlan(id);
      this.showToast('পরিকল্পনা মুছে ফেলা হয়েছে', 'info');
      this.renderAllViews();
    }
  }

  deleteCommitteeMember(id) {
    if (confirm('আপনি কি এই পদবী/সদস্যটি মুছে ফেলতে চান?')) {
      window.db.deleteCommitteeMember(id);
      this.showToast('সদস্য রেকর্ড মুছে ফেলা হয়েছে', 'info');
      this.renderAllViews();
    }
  }

  deleteBloodRequest(id) {
    window.db.deleteBloodRequest(id);
    this.showToast('রক্তের আবেদন সম্পন্ন হিসেবে চিহ্ণিত করা হয়েছে!', 'success');
    this.renderAllViews();
  }

  deleteDonor(id) {
    if (confirm('রক্তদাতার নাম তালিকা থেকে সরিয়ে ফেলবেন?')) {
      window.db.deleteBloodDonor(id);
      this.showToast('রক্তদাতার নাম মুছে ফেলা হয়েছে', 'info');
      this.renderAllViews();
    }
  }
}

// Global App Instance
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
