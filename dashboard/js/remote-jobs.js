
        // 1. Theme Initialization
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

    function toggleMobileDrawer() {
        document.getElementById('mobileDrawer').classList.toggle('hidden');
        }

    // 2. Always-On Foreign Partnership Welcome Pop-Up Logic
    function openPartnerPopup() {
        document.getElementById('partnerPopupModal').classList.remove('hidden');
        }

    function closePartnerPopup() {
        document.getElementById('partnerPopupModal').classList.add('hidden');
        }

        // Triggers every single time the user enters, refreshes, or navigates to this page
        window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            openPartnerPopup();
        }, 300);
        });

    // 3. Plan Gating
    let userPlan = 'pro';
    const storedUser = localStorage.getItem('rexora_user');
    if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
    if (parsed.plan) userPlan = parsed.plan;
            } catch (e) {console.error(e); }
        }

    if (userPlan === 'starter') {
        document.getElementById('starterGateNotice').classList.remove('hidden');
        }

    // 4. Remote Earnings KPI State (Zero Demo Balance Default)
    function getInitialRemoteStats() {
            const savedData = localStorage.getItem('rexora_remote_earnings');
    if (savedData) {
                try { return JSON.parse(savedData); } catch (e) {console.error(e); }
            }
    return {totalUSD: 0.00, pendingUSD: 0.00, currency: 'USD', rate: 1000 };
        }

    const remoteStats = getInitialRemoteStats();

    function saveRemoteStats() {
        localStorage.setItem('rexora_remote_earnings', JSON.stringify(remoteStats));
        }

    function renderRemoteCards() {
            const totalDisplay = document.getElementById('totalRemoteDisplay');
    const totalSub = document.getElementById('totalRemoteSub');
    const pendingDisplay = document.getElementById('pendingRemoteDisplay');
    const pendingSub = document.getElementById('pendingRemoteSub');
    const label = document.getElementById('remoteCurLabel');

    if (remoteStats.currency === 'USD') {
        label.textContent = "USD ($)";
    totalDisplay.textContent = `$${remoteStats.totalUSD.toFixed(2)}`;
    totalSub.textContent = `≈ ₦${(remoteStats.totalUSD * remoteStats.rate).toLocaleString()} (Approved)`;

    pendingDisplay.textContent = `$${remoteStats.pendingUSD.toFixed(2)}`;
    pendingSub.textContent = `≈ ₦${(remoteStats.pendingUSD * remoteStats.rate).toLocaleString()} (Under Review)`;
            } else {
        label.textContent = "NGN (₦)";
    totalDisplay.textContent = `₦${(remoteStats.totalUSD * remoteStats.rate).toLocaleString()}`;
    totalSub.textContent = `≈ $${remoteStats.totalUSD.toFixed(2)} USD (Approved)`;

    pendingDisplay.textContent = `₦${(remoteStats.pendingUSD * remoteStats.rate).toLocaleString()}`;
    pendingSub.textContent = `≈ $${remoteStats.pendingUSD.toFixed(2)} USD (Under Review)`;
            }
        }

    function toggleRemoteEarningsCurrency() {
        remoteStats.currency = remoteStats.currency === 'USD' ? 'NGN' : 'USD';
    saveRemoteStats();
    renderRemoteCards();
        }

    function addPendingJobEarning(amountUSD) {
        remoteStats.pendingUSD += parseFloat(amountUSD);
    saveRemoteStats();
    renderRemoteCards();
        }
    renderRemoteCards();

    // 5. Foreign Partner Contracts Data
    const remoteJobs = [
    {
        id: 1,
    client: "Claire (UK Partner)",
    avatar: "C",
    avatarBg: "bg-indigo-500",
    deadline: "⏱ 72h left",
    category: "Graphic Design",
    title: "Hero Banner & Social Promo Graphics for Web3 Wallet",
    objective: "Design 3 social media promotional creatives (1080x1080) for an online course announcement using Figma, Canva, or Photoshop.",
    payoutUSD: 40.00,
    payoutNGN: "₦40,000"
            },
    {
        id: 2,
    client: "Creative Studio US",
    avatar: "CS",
    avatarBg: "bg-brand-500",
    deadline: "⏱ 24h left",
    category: "Script Writing",
    title: "Write 3 Short Video Ad Hooks (Coffee Brand)",
    objective: "Write 3 conversational 15-second video script hooks for a TikTok campaign introducing 'Boost Brew' cold coffee.",
    payoutUSD: 18.00,
    payoutNGN: "₦18,000"
            },
    {
        id: 3,
    client: "Michael Sterling",
    avatar: "MS",
    avatarBg: "bg-purple-600",
    deadline: "⏱ 24h left",
    category: "Script Writing",
    title: "Explainer Video Script for Mobile DeFi App",
    objective: "Draft a 60-second simple conversational video script explaining how everyday users deposit and withdraw USD on mobile wallets.",
    payoutUSD: 22.00,
    payoutNGN: "₦22,000"
            },
    {
        id: 4,
    client: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "bg-emerald-600",
    deadline: "⏱ 48h left",
    category: "Research",
    title: "Competitive Analysis: High-Performance Landing Pages",
    objective: "Review 5 modern fintech landing pages, document CTA positioning hierarchy, and write a concise summary report.",
    payoutUSD: 25.00,
    payoutNGN: "₦25,000"
            },
    {
        id: 5,
    client: "Apex AI Labs (EU)",
    avatar: "AL",
    avatarBg: "bg-sky-600",
    deadline: "⏱ 12h left",
    category: "Data Tasks",
    title: "AI Response Categorization & Sentiment Tagging",
    objective: "Categorize customer prompt responses into Technical, Billing, or Usability tags with clear sentiment labels.",
    payoutUSD: 15.00,
    payoutNGN: "₦15,000"
            },
    {
        id: 6,
    client: "Jone Smith Studio",
    avatar: "JS",
    avatarBg: "bg-amber-600",
    deadline: "⏱ 36h left",
    category: "Graphic Design",
    title: "YouTube Thumbnail Design for Tech Channel",
    objective: "Create 2 clean, high-CTR YouTube thumbnails for an upcoming coding tutorial. Use bold typography.",
    payoutUSD: 20.00,
    payoutNGN: "₦20,000"
            }
    ];

    let activeCategory = 'All';
    let selectedJob = null;
    let uploadedFile = null;

    // 6. Render Jobs Grid
    function renderJobs() {
            const grid = document.getElementById('jobGrid');
    grid.innerHTML = '';

    const filtered = activeCategory === 'All'
    ? remoteJobs
                : remoteJobs.filter(job => job.category === activeCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
            No contracts currently available in this category.
          </div>
        `;
    return;
            }

            filtered.forEach(job => {
                const card = document.createElement('div');
    card.className = "p-4 sm:p-6 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200/80 dark:border-darkblue-border shadow-sm flex flex-col justify-between min-w-0";

    const isGraphic = job.category === 'Graphic Design';
    const submissionTypeBadge = isGraphic ? '🖼️ Image Upload' : '📝 Text Deliverable';

    card.innerHTML = `
    <div class="min-w-0">
        <!-- Client Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkblue-border">
            <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-xl ${job.avatarBg} text-white flex items-center justify-center font-black text-xs shrink-0">
                    ${job.avatar}
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-1">
                        <span class="text-xs font-black text-slate-900 dark:text-white truncate">${job.client}</span>
                        <span class="text-[10px] text-brand-500 font-black shrink-0">✓</span>
                    </div>
                    <span class="text-[9px] font-bold text-slate-400 block truncate">Verified Foreign Client</span>
                </div>
            </div>
            <span class="text-[9px] sm:text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full shrink-0">
                ${job.deadline}
            </span>
        </div>

        <!-- Tags -->
        <div class="mt-3 flex flex-wrap gap-1.5">
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                ${job.category}
            </span>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-darkblue-800 dark:text-slate-300">
                ${submissionTypeBadge}
            </span>
        </div>

        <!-- Title & Snippet -->
        <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-2.5 leading-snug break-words">
            ${job.title}
        </h3>
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            ${job.objective}
        </p>
    </div>

    <!-- Payout and Actions -->
    <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-darkblue-border flex items-center justify-between gap-2">
        <div class="min-w-0">
            <span class="text-[8px] sm:text-[9px] font-black uppercase text-slate-400 block">Payout</span>
            <div class="text-sm sm:text-base font-black text-brand-600 dark:text-brand-400 truncate">
                $${job.payoutUSD.toFixed(2)}
                <span class="text-[9px] font-bold text-slate-400">(${job.payoutNGN})</span>
            </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
            <button
                onclick="viewBrief(${job.id})"
                class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-darkblue-800 text-slate-700 dark:text-slate-200 text-xs font-black transition-all"
            >
                Apply
            </button>
            <button
                onclick="openSubmit(${job.id})"
                class="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md transition-all"
            >
                Submit
            </button>
        </div>
    </div>
    `;
    grid.appendChild(card);
            });
        }

    function filterCategory(cat) {
        activeCategory = cat;
    const buttons = document.querySelectorAll('.cat-pill');
            buttons.forEach(btn => {
                if (btn.textContent.trim().includes(cat) || (cat === 'All' && btn.textContent.trim().includes('All Tasks'))) {
        btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md whitespace-nowrap shrink-0";
                } else {
        btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-white dark:bg-darkblue-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-darkblue-border whitespace-nowrap shrink-0";
                }
            });
    renderJobs();
        }

    // 7. Task Brief Modal Logic
    function viewBrief(jobId) {
            if (userPlan === 'starter') {
        alert("Remote-Jobs are strictly unlocked on PRO (₦3,000 / $3.00). Please upgrade.");
    return;
            }
            selectedJob = remoteJobs.find(j => j.id === jobId);
    if (!selectedJob) return;

    document.getElementById('briefCategoryBadge').textContent = selectedJob.category;
    document.getElementById('briefDeadline').textContent = selectedJob.deadline;
    document.getElementById('briefTitle').textContent = selectedJob.title;
    document.getElementById('briefPayout').textContent = `$${selectedJob.payoutUSD.toFixed(2)} (${selectedJob.payoutNGN})`;
    document.getElementById('briefObjective').textContent = selectedJob.objective;

    const reqList = document.getElementById('briefRequirementsList');
    if (selectedJob.category === 'Graphic Design') {
        reqList.innerHTML = `
          <li>Must be original and complete according to the design brief.</li>
          <li>Upload your final graphic file in high resolution (.PNG, .JPG).</li>
          <li>Funds are released to your balance upon verification.</li>
        `;
            } else {
        reqList.innerHTML = `
          <li>Must be original, clear, and written directly according to the prompt.</li>
          <li>Type or paste your completed text deliverable in the submission box.</li>
          <li>Funds are released to your balance upon verification.</li>
        `;
            }

    document.getElementById('briefModal').classList.remove('hidden');
        }

    function closeBriefModal() {
        document.getElementById('briefModal').classList.add('hidden');
        }

    function openSubmitModalFromBrief() {
        closeBriefModal();
    if (selectedJob) openSubmit(selectedJob.id);
        }

    // 8. Category-Adaptive Submit Modal Logic (Graphics = Image Upload ONLY | Others = Text Input ONLY)
    function openSubmit(jobId) {
            if (userPlan === 'starter') {
        alert("Remote-Jobs are strictly unlocked on PRO (₦3,000 / $3.00). Please upgrade.");
    return;
            }
            selectedJob = remoteJobs.find(j => j.id === jobId);
    if (!selectedJob) return;

    const isGraphic = selectedJob.category === 'Graphic Design';
    const graphicSection = document.getElementById('graphicUploadSection');
    const textSection = document.getElementById('textDeliverableSection');

    document.getElementById('submitCategoryPill').textContent = selectedJob.category;
    document.getElementById('submitJobTitle').textContent = selectedJob.title;
    document.getElementById('submitPayoutRate').textContent = `$${selectedJob.payoutUSD.toFixed(2)} (${selectedJob.payoutNGN})`;

    if (isGraphic) {
        document.getElementById('submitModalHeading').textContent = "Submit Graphic Design Work";
    graphicSection.classList.remove('hidden');
    textSection.classList.add('hidden');
            } else {
        document.getElementById('submitModalHeading').textContent = `Submit ${selectedJob.category} Work`;
    graphicSection.classList.add('hidden');
    textSection.classList.remove('hidden');

    const label = document.getElementById('textDeliverableLabel');
    const textarea = document.getElementById('textDeliverableInput');
    if (selectedJob.category === 'Script Writing') {
        label.textContent = "Write or Paste Your Video Script";
    textarea.placeholder = "Write or paste your full conversational video script and hooks here...";
                } else if (selectedJob.category === 'Research') {
        label.textContent = "Write or Paste Your Research Summary";
    textarea.placeholder = "Paste your competitive analysis findings and summary report here...";
                } else {
        label.textContent = "Write or Paste Your Completed Task Response";
    textarea.placeholder = "Enter your completed work response here...";
                }
            }

    resetSubmissionStates();
    clearSubmitErrors();
    document.getElementById('submitModal').classList.remove('hidden');
        }

    function closeSubmitModal() {
        document.getElementById('submitModal').classList.add('hidden');
    resetSubmissionStates();
        }

    function resetSubmissionStates() {
        uploadedFile = null;
    document.getElementById('graphicFileInput').value = '';
    document.getElementById('designToolInput').value = '';
    document.getElementById('textDeliverableInput').value = '';
    document.getElementById('deliverableUrl').value = '';
    document.getElementById('dropzoneDefault').classList.remove('hidden');
    document.getElementById('dropzonePreview').classList.add('hidden');
    document.getElementById('previewImage').src = '';
        }

    function clearSubmitErrors() {
        document.getElementById('dropzoneContainer').classList.remove('border-rose-400', 'bg-rose-50/20');
    document.getElementById('err-file').classList.add('hidden');
    document.getElementById('designToolInput').classList.remove('border-rose-400', 'bg-rose-50/20');
    document.getElementById('err-tool').classList.add('hidden');
    document.getElementById('textDeliverableInput').classList.remove('border-rose-400', 'bg-rose-50/20');
    document.getElementById('err-text').classList.add('hidden');
        }

    // Image Dropzone Handlers (For Graphic Design Only)
    function handleFileSelect(e) {
            const file = e.target.files[0];
    processFile(file);
        }

    function handleDragOver(e) {
        e.preventDefault();
    document.getElementById('dropzoneContainer').classList.add('border-brand-500', 'bg-brand-50/20');
        }

    function handleDragLeave(e) {
        e.preventDefault();
    document.getElementById('dropzoneContainer').classList.remove('border-brand-500', 'bg-brand-50/20');
        }

    function handleFileDrop(e) {
        e.preventDefault();
    document.getElementById('dropzoneContainer').classList.remove('border-brand-500', 'bg-brand-50/20');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
            }
        }

    function processFile(file) {
            if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
                const errFile = document.getElementById('err-file');
    errFile.textContent = "Please upload .PNG, .JPG, or .JPEG.";
    errFile.classList.remove('hidden');
    return;
            }

    uploadedFile = file;
    clearSubmitErrors();

    const reader = new FileReader();
    reader.onload = function (event) {
        document.getElementById('previewImage').src = event.target.result;
    document.getElementById('previewFilename').textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    document.getElementById('dropzoneDefault').classList.add('hidden');
    document.getElementById('dropzonePreview').classList.remove('hidden');
            };
    reader.readAsDataURL(file);
        }

    function removeSelectedFile(e) {
        e.stopPropagation();
    uploadedFile = null;
    document.getElementById('graphicFileInput').value = '';
    document.getElementById('dropzoneDefault').classList.remove('hidden');
    document.getElementById('dropzonePreview').classList.add('hidden');
    document.getElementById('previewImage').src = '';
        }

        // 9. Form Validation Based on Category
        document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
    clearSubmitErrors();

    let isValid = true;
    const isGraphic = selectedJob && selectedJob.category === 'Graphic Design';

    if (isGraphic) {
                if (!uploadedFile) {
        document.getElementById('dropzoneContainer').classList.add('border-rose-400', 'bg-rose-50/20');
    const errFile = document.getElementById('err-file');
    errFile.textContent = "Please upload your graphic design image (.PNG or .JPG).";
    errFile.classList.remove('hidden');
    isValid = false;
                }

    const toolInput = document.getElementById('designToolInput');
    if (toolInput.value.trim() === '') {
        toolInput.classList.add('border-rose-400', 'bg-rose-50/20');
    const errTool = document.getElementById('err-tool');
    errTool.textContent = "Specify the design tool used (e.g., Canva, Figma, Photoshop).";
    errTool.classList.remove('hidden');
    isValid = false;
                }
            } else {
                const textInput = document.getElementById('textDeliverableInput');
    if (textInput.value.trim() === '') {
        textInput.classList.add('border-rose-400', 'bg-rose-50/20');
    const errText = document.getElementById('err-text');
    errText.textContent = "Please write or paste your completed work in the text box above.";
    errText.classList.remove('hidden');
    isValid = false;
                }
            }

    if (!isValid) return;

    const submitBtn = document.getElementById('submitReviewBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting Review...";

            setTimeout(() => {
        addPendingJobEarning(selectedJob.payoutUSD);

    alert(`Deliverable for "${selectedJob.title}" submitted successfully! $${selectedJob.payoutUSD.toFixed(2)} added to Pending Remote Earnings.`);
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit for Admin Review";
    closeSubmitModal();
            }, 1000);
        });

    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }

    renderJobs();
