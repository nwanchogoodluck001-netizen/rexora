
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

    function toggleMobileDrawer() {
        document.getElementById('mobileDrawer').classList.toggle('hidden');
        }

    // 2. Streaks State (Strictly 0.00 Default - No Demo Balance)
    function getStoredStreakData() {
            const data = localStorage.getItem('rexora_streak_data');
    if (data) {
                try { return JSON.parse(data); } catch (e) {console.error(e); }
            }
    return {
        totalUSD: 0.00,
    dayLevel: 1,
    currency: 'USD',
    rate: 1000,
    todayReferrals: 0,
    claims: {
        morning: false,
    afternoon: false,
    night: false
                }
            };
        }

    const streakState = getStoredStreakData();

    function saveStreakData() {
        localStorage.setItem('rexora_streak_data', JSON.stringify(streakState));
        }

    // 3. Render Metric Cards & Currency Toggle
    function renderStreakStats() {
            const totalDisplay = document.getElementById('totalStreakEarningsDisplay');
    const totalSub = document.getElementById('totalStreakSub');
    const curLabel = document.getElementById('streakCurLabel');

    if (streakState.currency === 'USD') {
        curLabel.textContent = "USD ($)";
    totalDisplay.textContent = `$${streakState.totalUSD.toFixed(2)}`;
    totalSub.textContent = `≈ ₦${(streakState.totalUSD * streakState.rate).toLocaleString()} (Approved)`;

    document.getElementById('payoutMorningText').textContent = "+$0.50";
    document.getElementById('payoutAfternoonText').textContent = "+$0.75";
    document.getElementById('payoutNightText').textContent = "+$1.00";
            } else {
        curLabel.textContent = "NGN (₦)";
    totalDisplay.textContent = `₦${(streakState.totalUSD * streakState.rate).toLocaleString()}`;
    totalSub.textContent = `≈ $${streakState.totalUSD.toFixed(2)} USD (Approved)`;

    document.getElementById('payoutMorningText').textContent = "+₦500";
    document.getElementById('payoutAfternoonText').textContent = "+₦750";
    document.getElementById('payoutNightText').textContent = "+₦1,000";
            }
        }

    function toggleStreakCurrency() {
        streakState.currency = streakState.currency === 'USD' ? 'NGN' : 'USD';
    saveStreakData();
    renderStreakStats();
        }
    renderStreakStats();

    // 4. Update 2-Referral Gate Visuals
    function updateReferralGateVisuals() {
            const summaryText = document.getElementById('refCountSummary');
    summaryText.textContent = `${streakState.todayReferrals} / 2 Referrals Completed Today`;

    const slot1Icon = document.getElementById('slot1Icon');
    const slot1Status = document.getElementById('slot1Status');
    const slot1Badge = document.getElementById('slot1Badge');

    const slot2Icon = document.getElementById('slot2Icon');
    const slot2Status = document.getElementById('slot2Status');
    const slot2Badge = document.getElementById('slot2Badge');

            if (streakState.todayReferrals >= 1) {
        slot1Icon.className = "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 font-black text-sm flex items-center justify-center";
    slot1Icon.textContent = "✓";
    slot1Status.textContent = "Paid & Verified Active";
    slot1Status.className = "text-[10px] font-bold text-emerald-600";
    slot1Badge.textContent = "Verified";
    slot1Badge.className = "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700";
            } else {
        slot1Icon.className = "w-9 h-9 rounded-xl bg-slate-100 dark:bg-darkblue-800 text-slate-400 font-black text-sm flex items-center justify-center";
    slot1Icon.textContent = "1";
    slot1Status.textContent = "Waiting for today's invite...";
    slot1Status.className = "text-[10px] font-bold text-slate-400";
    slot1Badge.textContent = "Pending";
    slot1Badge.className = "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 dark:bg-darkblue-800 dark:text-slate-400";
            }

            if (streakState.todayReferrals >= 2) {
        slot2Icon.className = "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 font-black text-sm flex items-center justify-center";
    slot2Icon.textContent = "✓";
    slot2Status.textContent = "Paid & Verified Active";
    slot2Status.className = "text-[10px] font-bold text-emerald-600";
    slot2Badge.textContent = "Verified";
    slot2Badge.className = "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700";
            } else {
        slot2Icon.className = "w-9 h-9 rounded-xl bg-slate-100 dark:bg-darkblue-800 text-slate-400 font-black text-sm flex items-center justify-center";
    slot2Icon.textContent = "2";
    slot2Status.textContent = "Waiting for today's invite...";
    slot2Status.className = "text-[10px] font-bold text-slate-400";
    slot2Badge.textContent = "Pending";
    slot2Badge.className = "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 dark:bg-darkblue-800 dark:text-slate-400";
            }

    updateClaimButtons();
        }

    // 5. Update Claim Buttons based on Referrals & Time of Day
    function updateClaimButtons() {
            const isGateUnlocked = streakState.todayReferrals >= 2;
    const currentHour = new Date().getHours();

            // Morning: 06:00 - 11:59 (hours 6 to 11)
            setupButton('btnClaimMorning', 'cardMorning', streakState.claims.morning, isGateUnlocked, currentHour >= 6 && currentHour < 12, "Claim Morning Drop ($0.50)");

            // Afternoon: 12:00 - 17:59 (hours 12 to 17)
            setupButton('btnClaimAfternoon', 'cardAfternoon', streakState.claims.afternoon, isGateUnlocked, currentHour >= 12 && currentHour < 18, "Claim Afternoon Drop ($0.75)");

            // Night: 18:00 - 23:59 (hours 18 to 23)
            setupButton('btnClaimNight', 'cardNight', streakState.claims.night, isGateUnlocked, currentHour >= 18 || currentHour < 6, "Claim Night Drop ($1.00)");
        }

    function setupButton(btnId, cardId, isClaimed, isGateUnlocked, isWindowActive, labelText) {
            const btn = document.getElementById(btnId);
    const card = document.getElementById(cardId);

    if (isClaimed) {
        btn.disabled = true;
    btn.textContent = "✓ Claimed Today";
    btn.className = "w-full py-3 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs uppercase cursor-default";
    card.classList.remove('border-brand-500', 'border-amber-400');
    card.classList.add('border-emerald-500/40');
            } else if (!isGateUnlocked) {
        btn.disabled = true;
    btn.textContent = "🔒 Locked (Need 2 Referrals)";
    btn.className = "w-full py-3 rounded-2xl bg-slate-200 dark:bg-darkblue-800 text-slate-400 dark:text-slate-500 font-black text-xs uppercase disabled:cursor-not-allowed";
    card.classList.remove('border-brand-500', 'border-emerald-500/40');
            } else if (!isWindowActive) {
        btn.disabled = true;
    btn.textContent = "⏱ Window Not Active";
    btn.className = "w-full py-3 rounded-2xl bg-slate-200 dark:bg-darkblue-800 text-slate-400 dark:text-slate-500 font-black text-xs uppercase disabled:cursor-not-allowed";
    card.classList.remove('border-brand-500');
            } else {
        btn.disabled = false;
    btn.textContent = labelText;
    btn.className = "w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer";
    card.classList.add('border-brand-500');
            }
        }

    // 6. Claim Action Handlers
    function claimSession(sessionName) {
            if (streakState.todayReferrals < 2) {
        alert("You must have 2 active paid referrals today to unlock daily streak drops.");
    return;
            }

    let rewardUSD = 0;
    if (sessionName === 'morning') rewardUSD = 0.50;
    if (sessionName === 'afternoon') rewardUSD = 0.75;
    if (sessionName === 'night') rewardUSD = 1.00;

    streakState.claims[sessionName] = true;
    streakState.totalUSD += rewardUSD;
    saveStreakData();

    renderStreakStats();
    updateReferralGateVisuals();

    alert(`Success! Your ${sessionName.toUpperCase()} streak reward of $${rewardUSD.toFixed(2)} has been credited to your withdrawable balance.`);
        }

    // 7. Simulation Controls (For testing 0 / 2 vs 2 / 2 unlocked states)
    function simulateAddReferral() {
            if (streakState.todayReferrals < 2) {
        streakState.todayReferrals += 1;
    saveStreakData();
    updateReferralGateVisuals();
            }
        }

    function resetReferralsSim() {
        streakState.todayReferrals = 0;
    streakState.claims = {morning: false, afternoon: false, night: false };
    saveStreakData();
    updateReferralGateVisuals();
        }

    // 8. 24h Cycle Countdown Timer
    function startCountdown() {
        function tick() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
            const diff = tomorrow - now;

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            const mins = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
            const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

            document.getElementById('countdownTimer').textContent = `${hours}h : ${mins}m : ${secs}s`;
        }
            tick();
    setInterval(tick, 1000);
        }
    startCountdown();

    // 9. Copy Affiliate Link
    function copyStreakRefLink() {
            const input = document.getElementById('refLinkInput');
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = document.getElementById('copyRefBtn');
    btn.textContent = "Copied!";
    btn.classList.add('bg-emerald-500');
                setTimeout(() => {
        btn.textContent = "Copy";
    btn.classList.remove('bg-emerald-500');
                }, 2000);
            });
        }

    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }

    updateReferralGateVisuals();
