
        // 1. Theme Configuration
    function initTheme() {
            const savedTheme = localStorage.getItem('rexora_theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    document.getElementById('themeIcon').textContent = '☀️';
            } else {
        document.documentElement.classList.remove('dark');
    document.getElementById('themeIcon').textContent = '🌙';
            }
        }
    function toggleTheme() {
            const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('rexora_theme', isDark ? 'dark' : 'light');
    document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
        }
    initTheme();

    // 2. Mobile Drawer
    function toggleMobileDrawer() {
        document.getElementById('mobileDrawer').classList.toggle('hidden');
        }

    // 3. User Plan & Currency State
    let userPlan = 'pro';
    const storedUser = localStorage.getItem('rexora_user');
    if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
    if (parsed.plan) userPlan = parsed.plan;
            } catch (e) {console.error(e); }
        }

    let activeCurrency = 'USD'; // 'USD' or 'NGN'
    const rate = 1000;

    function toggleCurrency() {
        activeCurrency = activeCurrency === 'USD' ? 'NGN' : 'USD';
    document.getElementById('curToggleBtnText').textContent = activeCurrency === 'USD' ? 'Swap to ₦ Naira' : 'Swap to $ USD';

    const heroVal = userPlan === 'pro' ? 2.00 : 0.75;
    document.getElementById('heroRateText').textContent = activeCurrency === 'USD'
    ? `+$${heroVal.toFixed(2)} / Task`
    : `+₦${(heroVal * rate).toLocaleString()} / Task`;

    renderTasks();
    renderSubmissions();
        }

    // 4. Social Engagement Tasks Data List
    const socialTasks = [
    {
        id: 1,
    platform: "WhatsApp",
    platformIcon: "💬",
    badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    title: "Join Official Tech Community Group",
    instruction: "Join the WhatsApp group, stay active, and take a screenshot of the group member list showing you are inside.",
    duration: "About 1 minute",
    actionUrl: "https://chat.whatsapp.com/",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.75
            },
    {
        id: 2,
    platform: "Telegram",
    platformIcon: "✈️",
    badgeBg: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    title: "Subscribe to REXORA Alerts Channel",
    instruction: "Join the Telegram announcement channel and capture a screenshot showing you have subscribed.",
    duration: "About 1 minute",
    actionUrl: "https://t.me/",
    usdPayout: userPlan === 'pro' ? 2.50 : 0.80
            },
    {
        id: 3,
    platform: "Instagram",
    platformIcon: "📸",
    badgeBg: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    title: "Follow & Like Recent Product Post",
    instruction: "Follow the business Instagram account, like the pinned product post, and upload screenshot proof of both.",
    duration: "About 2 minutes",
    actionUrl: "https://instagram.com/",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.75
            },
    {
        id: 4,
    platform: "YouTube",
    platformIcon: "▶️",
    badgeBg: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    title: "Subscribe & Turn On Notifications",
    instruction: "Subscribe to the verified tech channel, turn on all bell notifications, and take a clear screenshot.",
    duration: "About 2 minutes",
    actionUrl: "https://youtube.com/",
    usdPayout: userPlan === 'pro' ? 3.00 : 1.00
            },
    {
        id: 5,
    platform: "Facebook",
    platformIcon: "👥",
    badgeBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    title: "Like & Follow Business Showcase Page",
    instruction: "Like the corporate page, follow it, and upload a screenshot displaying the 'Following' status.",
    duration: "About 2 minutes",
    actionUrl: "https://facebook.com/",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.75
            },
    {
        id: 6,
    platform: "X",
    platformIcon: "🐦",
    badgeBg: "bg-slate-100 text-slate-800 dark:bg-darkblue-800 dark:text-slate-200",
    title: "Repost & Bookmark Web3 Ecosystem Tweet",
    instruction: "Repost the pinned announcement tweet, bookmark it, and capture your profile timeline screenshot.",
    duration: "About 1 minute",
    actionUrl: "https://x.com/",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.75
            }
    ];

    let activeFilter = 'All';
    let searchQuery = '';
    let selectedTask = null;
    let uploadedProofFile = null;

    // 5. Render Tasks
    function renderTasks() {
            const container = document.getElementById('tasksContainer');
    container.innerHTML = '';

            const filtered = socialTasks.filter(t => {
                const matchesFilter = activeFilter === 'All' || t.platform.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.instruction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
            });

    if (filtered.length === 0) {
        container.innerHTML = `
          <div class="p-8 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200/80 dark:border-darkblue-border text-center text-slate-400 font-bold text-xs">
            No engagement tasks matching your criteria.
          </div>
        `;
    return;
            }

            filtered.forEach(task => {
                const ngnVal = task.usdPayout * rate;
    const payoutDisplay = activeCurrency === 'USD'
    ? `+$${task.usdPayout.toFixed(2)}`
    : `+₦${ngnVal.toLocaleString()}`;

    const card = document.createElement('div');
    card.className = "p-6 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200/80 dark:border-darkblue-border shadow-sm hover:border-brand-500 transition-all flex flex-col justify-between";
    card.innerHTML = `
    <div>
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkblue-border">
            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${task.badgeBg} flex items-center gap-1.5">
                <span>${task.platformIcon}</span>
                <span>${task.platform}</span>
            </span>
            <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">${payoutDisplay}</span>
        </div>

        <h4 class="text-base font-black text-slate-900 dark:text-white mt-3">${task.title}</h4>
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${task.instruction}</p>

        <div class="mt-4 flex items-center gap-4 text-[11px] font-bold text-slate-400">
            <span>⏱ ${task.duration}</span>
            <span>📸 Screenshot proof required</span>
        </div>
    </div>

    <div class="mt-6 pt-4 border-t border-slate-100 dark:border-darkblue-border flex flex-col sm:flex-row gap-3">
        <a
            href="${task.actionUrl}"
            target="_blank"
            class="flex-1 text-center py-2.5 rounded-xl border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-darkblue-800 text-xs font-black uppercase tracking-wider transition-all"
        >
            Do Task
        </a>
        <button
            onclick="openProofModal(${task.id})"
            class="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-brand-500/20 transition-all"
        >
            Upload Proof
        </button>
    </div>
    `;
    container.appendChild(card);
            });
        }

    // 6. Platform Filter Handling
    function filterPlatform(platform) {
        activeFilter = platform;
    const pills = document.querySelectorAll('.plat-pill');
            pills.forEach(p => {
                if (p.textContent.trim().toLowerCase().includes(platform.toLowerCase()) || (platform === 'All' && p.textContent.trim().includes('All Tasks'))) {
        p.className = "plat-pill px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md shadow-brand-500/20 whitespace-nowrap";
                } else {
        p.className = "plat-pill px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all bg-white dark:bg-darkblue-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-darkblue-border hover:border-brand-500 whitespace-nowrap";
                }
            });
    renderTasks();
        }

    function handleSearch() {
        searchQuery = document.getElementById('taskSearchInput').value.trim();
    renderTasks();
        }

    // 7. My Submissions State (Defaults to 00.00 / Zero Demo)
    function getStoredSubmissions() {
            const data = localStorage.getItem('rexora_social_submissions');
    if (data) {
                try { return JSON.parse(data); } catch (e) {console.error(e); }
            }
    return [];
        }

    const mySubmissions = getStoredSubmissions();

    function renderSubmissions() {
            const emptyView = document.getElementById('emptySubmissionsView');
    const list = document.getElementById('submissionsList');
    const countBadge = document.getElementById('submissionCountBadge');

    countBadge.textContent = `${mySubmissions.length} Submissions`;

    if (mySubmissions.length === 0) {
        emptyView.classList.remove('hidden');
    list.classList.add('hidden');
    list.innerHTML = '';
    return;
            }

    emptyView.classList.add('hidden');
    list.classList.remove('hidden');
    list.innerHTML = '';

            mySubmissions.forEach(sub => {
                const item = document.createElement('div');
    item.className = "p-3.5 rounded-2xl bg-slate-50 dark:bg-darkblue-800 border border-slate-100 dark:border-darkblue-border flex items-center justify-between";

    const payout = activeCurrency === 'USD'
    ? `+$${sub.amountUSD.toFixed(2)}`
    : `+₦${(sub.amountUSD * rate).toLocaleString()}`;

    item.innerHTML = `
    <div>
        <div class="text-xs font-black text-slate-900 dark:text-white truncate max-w-[180px]">${sub.taskTitle}</div>
        <span class="text-[10px] font-bold text-slate-400">${sub.date} • ${sub.handle}</span>
    </div>
    <div class="text-right">
        <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">${payout}</span>
        <div class="text-[9px] font-black uppercase text-amber-500">Under Review</div>
    </div>
    `;
    list.appendChild(item);
            });
        }

    // 8. Proof Modal Handlers
    function openProofModal(taskId) {
        selectedTask = socialTasks.find(t => t.id === taskId);
    if (!selectedTask) return;

    document.getElementById('modalTaskTitle').textContent = `Upload Proof: ${selectedTask.title}`;
    const ngnVal = selectedTask.usdPayout * rate;
    document.getElementById('modalTaskPayout').textContent = `$${selectedTask.usdPayout.toFixed(2)} (₦${ngnVal.toLocaleString()})`;

    resetProofModal();
    document.getElementById('proofModal').classList.remove('hidden');
        }

    function closeProofModal() {
        document.getElementById('proofModal').classList.add('hidden');
    resetProofModal();
        }

    function resetProofModal() {
        uploadedProofFile = null;
    document.getElementById('proofFileInput').value = '';
    document.getElementById('socialHandleInput').value = '';
    document.getElementById('proofDropDefault').classList.remove('hidden');
    document.getElementById('proofDropPreview').classList.add('hidden');
    document.getElementById('proofPreviewImg').src = '';
    clearProofErrors();
        }

    function clearProofErrors() {
        document.getElementById('proofDropzone').classList.remove('border-rose-400', 'bg-rose-50/20');
    document.getElementById('err-proof-file').classList.add('hidden');
    document.getElementById('socialHandleInput').classList.remove('border-rose-400', 'bg-rose-50/20');
    document.getElementById('err-handle').classList.add('hidden');
        }

    // 9. Screenshot Drag-and-Drop Handlers
    function handleProofSelect(e) {
            if (e.target.files && e.target.files[0]) processProofFile(e.target.files[0]);
        }

    function handleProofDragOver(e) {
        e.preventDefault();
    document.getElementById('proofDropzone').classList.add('border-brand-500', 'bg-brand-50/20');
        }

    function handleProofDragLeave(e) {
        e.preventDefault();
    document.getElementById('proofDropzone').classList.remove('border-brand-500', 'bg-brand-50/20');
        }

    function handleProofDrop(e) {
        e.preventDefault();
    document.getElementById('proofDropzone').classList.remove('border-brand-500', 'bg-brand-50/20');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processProofFile(e.dataTransfer.files[0]);
            }
        }

    function processProofFile(file) {
            if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
                const err = document.getElementById('err-proof-file');
    err.textContent = "Please upload a valid image screenshot (.PNG, .JPG).";
    err.classList.remove('hidden');
    return;
            }

    uploadedProofFile = file;
    clearProofErrors();

    const reader = new FileReader();
    reader.onload = function (evt) {
        document.getElementById('proofPreviewImg').src = evt.target.result;
    document.getElementById('proofFileNameText').textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    document.getElementById('proofDropDefault').classList.add('hidden');
    document.getElementById('proofDropPreview').classList.remove('hidden');
            };
    reader.readAsDataURL(file);
        }

    function removeProofFile(e) {
        e.stopPropagation();
    resetProofModal();
        }

        // 10. Form Validation & Submission Handler
        document.getElementById('proofForm').addEventListener('submit', (e) => {
        e.preventDefault();
    clearProofErrors();

    let isValid = true;

    if (!uploadedProofFile) {
        document.getElementById('proofDropzone').classList.add('border-rose-400', 'bg-rose-50/20');
    const err = document.getElementById('err-proof-file');
    err.textContent = "Please attach your screenshot proof to proceed.";
    err.classList.remove('hidden');
    isValid = false;
            }

    const handleVal = document.getElementById('socialHandleInput').value.trim();
    if (handleVal === '') {
                const hInput = document.getElementById('socialHandleInput');
    hInput.classList.add('border-rose-400', 'bg-rose-50/20');
    const err = document.getElementById('err-handle');
    err.textContent = "Please enter your social username or phone number used.";
    err.classList.remove('hidden');
    isValid = false;
            }

    if (!isValid) return;

    const submitBtn = document.getElementById('submitProofBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting Proof...";

            setTimeout(() => {
                // Record submission locally
                const newSubmission = {
        id: Date.now(),
    taskTitle: selectedTask.title,
    platform: selectedTask.platform,
    amountUSD: selectedTask.usdPayout,
    handle: handleVal,
    date: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' }),
    status: 'pending'
                };

    mySubmissions.unshift(newSubmission);
    localStorage.setItem('rexora_social_submissions', JSON.stringify(mySubmissions));

    alert(`Screenshot proof for "${selectedTask.title}" submitted successfully! Payout of $${selectedTask.usdPayout.toFixed(2)} will credit upon verification.`);

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Proof for Review";
    closeProofModal();
    renderSubmissions();
            }, 1000);
        });

    // 11. Sign Out Trigger
    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }

    // Initial Render
    renderTasks();
    renderSubmissions();
