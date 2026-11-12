
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

    // 2. Affiliate & Milestone Quests State (Strict 0.00 Default - No Demo Balance)
    function getStoredAffiliateData() {
            const data = localStorage.getItem('rexora_affiliate_data');
    if (data) {
                try {
                    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.downline)) parsed.downline = [];
    if (!Array.isArray(parsed.claimedMilestones)) parsed.claimedMilestones = [];
    if (typeof parsed.totalUSD !== 'number') parsed.totalUSD = 0.00;
    if (!parsed.currency) parsed.currency = 'USD';
    if (!parsed.rate) parsed.rate = 1000;
    return parsed;
                } catch (e) {console.error(e); }
            }
    return {
        totalUSD: 0.00,
    currency: 'USD',
    rate: 1000,
    downline: [],          // [{username, plan, amountUSD, date, status}]
    claimedMilestones: []  // ['tier_1', 'tier_2', ...]
            };
        }

    const affiliateState = getStoredAffiliateData();

    function saveAffiliateData() {
        localStorage.setItem('rexora_affiliate_data', JSON.stringify(affiliateState));
        }

    // 3. Milestone Tiers Definition
    const milestoneTiers = [
    {
        id: 'tier_1',
    badge: 'TIER 01 • BRONZE SCOUT',
    title: 'First 3 Paid Referrals',
    description: 'Invite 3 paid members on any package (Starter or Pro).',
    target: 3,
    type: 'all', // Any paid referral
    rewardUSD: 2.00,
    icon: '🥉',
    accentBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
            },
    {
        id: 'tier_2',
    badge: 'TIER 02 • SILVER BUILDER',
    title: '10 Active Network Invites',
    description: 'Grow your verified paid referral network to 10 members.',
    target: 10,
    type: 'all', // Any paid referral
    rewardUSD: 7.50,
    icon: '🥈',
    accentBg: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            },
    {
        id: 'tier_3',
    badge: 'TIER 03 • GOLD PARTNER',
    title: '25 PRO Plan Activations',
    description: 'Invite 25 members who activate the PRO ($3 / ₦3,000) tier.',
    target: 25,
    type: 'pro', // Pro referrals only
    rewardUSD: 25.00,
    icon: '🥇',
    accentBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
            },
    {
        id: 'tier_4',
    badge: 'TIER 04 • DIAMOND AMBASSADOR',
    title: '50 PRO Plan Activations',
    description: 'Reach 50 verified PRO referrals to unlock the Ambassador Grant.',
    target: 50,
    type: 'pro', // Pro referrals only
    rewardUSD: 60.00,
    icon: '💎',
    accentBg: 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
            }
    ];

    // Count actual member referrals (excluding milestone ledger rows)
    function getReferralCounts() {
            const members = affiliateState.downline.filter(item => item.plan === 'starter' || item.plan === 'pro');
            const starterCount = members.filter(m => m.plan === 'starter').length;
            const proCount = members.filter(m => m.plan === 'pro').length;
    return {
        totalMembers: members.length,
    starterCount,
    proCount
            };
        }

    // 4. Render Cards, Milestones & Currency Toggles
    function renderAffiliateStats() {
            const totalDisplay = document.getElementById('totalAffiliateDisplay');
    const totalSub = document.getElementById('totalAffiliateSub');
    const networkCount = document.getElementById('networkCountDisplay');
    const networkSub = document.getElementById('networkBreakdownSub');
    const curLabel = document.getElementById('refCurLabel');

    const {totalMembers, starterCount, proCount} = getReferralCounts();

    networkCount.textContent = `${totalMembers} Referral${totalMembers === 1 ? '' : 's'}`;
    networkSub.textContent = `${starterCount} Starter • ${proCount} Pro Verified`;

    if (affiliateState.currency === 'USD') {
        curLabel.textContent = "USD ($)";
    totalDisplay.textContent = `$${affiliateState.totalUSD.toFixed(2)}`;
    totalSub.textContent = `≈ ₦${(affiliateState.totalUSD * affiliateState.rate).toLocaleString()} (Pending Weekend Settlement)`;
            } else {
        curLabel.textContent = "NGN (₦)";
    totalDisplay.textContent = `₦${(affiliateState.totalUSD * affiliateState.rate).toLocaleString()}`;
    totalSub.textContent = `≈ $${affiliateState.totalUSD.toFixed(2)} USD (Pending Weekend Settlement)`;
            }

    renderMilestones();
    renderDownlineTable();
        }

    function renderMilestones() {
            const grid = document.getElementById('milestonesGrid');
    const claimedHeader = document.getElementById('claimedMilestonesCount');
    const {totalMembers, proCount} = getReferralCounts();

    claimedHeader.textContent = `${affiliateState.claimedMilestones.length} / ${milestoneTiers.length} Unlocked`;
    grid.innerHTML = '';

            milestoneTiers.forEach(tier => {
                const currentCount = tier.type === 'pro' ? proCount : totalMembers;
    const cappedCount = Math.min(currentCount, tier.target);
    const pct = Math.min(100, Math.round((currentCount / tier.target) * 100));
    const isClaimed = affiliateState.claimedMilestones.includes(tier.id);
                const isUnlocked = currentCount >= tier.target;
    const remaining = Math.max(0, tier.target - currentCount);

    const rewardText = affiliateState.currency === 'USD'
    ? `+$${tier.rewardUSD.toFixed(2)}`
    : `+₦${(tier.rewardUSD * affiliateState.rate).toLocaleString()}`;

    const unitLabel = tier.type === 'pro' ? 'Pro Referrals' : 'Paid Referrals';

    let actionBtnHtml = '';
    if (isClaimed) {
        actionBtnHtml = `
                        <button disabled class="w-full py-2.5 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs uppercase tracking-wider cursor-default">
                            ✓ Claimed & Credited
                        </button>
                    `;
                } else if (isUnlocked) {
        actionBtnHtml = `
                        <button onclick="claimMilestoneBonus('${tier.id}')" class="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer">
                            Claim ${rewardText} Bonus
                        </button>
                    `;
                } else {
        actionBtnHtml = `
                        <button disabled class="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-darkblue-800 text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-wider cursor-not-allowed">
                            🔒 ${remaining} More Needed
                        </button>
                    `;
                }

    const card = document.createElement('div');
    card.className = `p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 min-w-0 ${isUnlocked && !isClaimed
        ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-400/70 shadow-md'
        : 'bg-slate-50/70 dark:bg-darkblue-850 border-slate-200/80 dark:border-darkblue-border'
    }`;

    card.innerHTML = `
    <div class="space-y-3">
        <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-10 h-10 rounded-xl ${tier.accentBg} flex items-center justify-center text-lg shrink-0 font-black">
                    ${tier.icon}
                </div>
                <div class="min-w-0">
                    <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block truncate">${tier.badge}</span>
                    <h4 class="text-sm font-black text-slate-900 dark:text-white truncate">${tier.title}</h4>
                </div>
            </div>
            <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                ${rewardText}
            </span>
        </div>

        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            ${tier.description}
        </p>

        <!-- Progress Bar -->
        <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-black">
                <span class="text-slate-600 dark:text-slate-300">${cappedCount} / ${tier.target} ${unitLabel}</span>
                <span class="text-brand-600 dark:text-brand-400">${pct}%</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-darkblue-900 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-500' : 'bg-brand-500'}" style="width: ${pct}%;"></div>
            </div>
        </div>
    </div>

    <div>
        ${actionBtnHtml}
    </div>
    `;

    grid.appendChild(card);
            });
        }

    function claimMilestoneBonus(tierId) {
            const tier = milestoneTiers.find(t => t.id === tierId);
    if (!tier) return;
    if (affiliateState.claimedMilestones.includes(tierId)) return;

    const {totalMembers, proCount} = getReferralCounts();
    const currentCount = tier.type === 'pro' ? proCount : totalMembers;
    if (currentCount < tier.target) return;

    affiliateState.claimedMilestones.push(tierId);
    affiliateState.totalUSD += tier.rewardUSD;

    // Log into downline/credits ledger
    affiliateState.downline.unshift({
        username: `Milestone: ${tier.title}`,
    plan: 'milestone',
    amountUSD: tier.rewardUSD,
    date: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' }),
    status: 'Credited'
            });

    saveAffiliateData();
    renderAffiliateStats();

    const claimedDisplay = affiliateState.currency === 'USD'
    ? `$${tier.rewardUSD.toFixed(2)}`
    : `₦${(tier.rewardUSD * affiliateState.rate).toLocaleString()}`;

    alert(`🎉 Congratulations! You claimed ${claimedDisplay} for completing "${tier.title}". Added to your Affiliate Reserve!`);
        }

    function toggleRefCurrency() {
        affiliateState.currency = affiliateState.currency === 'USD' ? 'NGN' : 'USD';
    saveAffiliateData();
    renderAffiliateStats();
        }
    renderAffiliateStats();

    // 5. Projection Slider Engine
    function updateProjection(value) {
        document.getElementById('sliderValueText').textContent = `${value} Member${value === '1' ? '' : 's'}`;
    const yieldUSD = value * 1.50;
    const yieldNGN = yieldUSD * 1000;
    document.getElementById('projectedYieldText').textContent = `$${yieldUSD.toFixed(2)}`;
    document.getElementById('projectedNgnText').textContent = `₦${yieldNGN.toLocaleString()} NGN`;
        }
    updateProjection(10);

    // 6. Render Downline Table
    function renderDownlineTable() {
            const emptyView = document.getElementById('emptyDownlineView');
    const tableWrapper = document.getElementById('tableContainer');
    const tableBody = document.getElementById('downlineTableBody');

    if (affiliateState.downline.length === 0) {
        emptyView.classList.remove('hidden');
    tableWrapper.classList.add('hidden');
    tableBody.innerHTML = '';
    return;
            }

    emptyView.classList.add('hidden');
    tableWrapper.classList.remove('hidden');
    tableBody.innerHTML = '';

            affiliateState.downline.forEach(member => {
                const row = document.createElement('tr');
    const cutDisplay = affiliateState.currency === 'USD'
    ? `+$${member.amountUSD.toFixed(2)}`
    : `+₦${(member.amountUSD * affiliateState.rate).toLocaleString()}`;

    let planBadge = '';
    if (member.plan === 'milestone') {
        planBadge = `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">🏆 Milestone Quest</span>`;
                } else if (member.plan === 'pro') {
        planBadge = `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">PRO (₦3k)</span>`;
                } else {
        planBadge = `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700 dark:bg-darkblue-800 dark:text-slate-300">Starter (₦1.5k)</span>`;
                }

    row.innerHTML = `
    <td class="py-3 px-2 font-black text-slate-900 dark:text-white">${member.username}</td>
    <td class="py-3 px-2">${planBadge}</td>
    <td class="py-3 px-2 font-black text-emerald-600 dark:text-emerald-400">${cutDisplay}</td>
    <td class="py-3 px-2 text-[10px] text-slate-400">${member.date}</td>
    <td class="py-3 px-2 text-right">
        <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Weekend Payout
        </span>
    </td>
    `;
    tableBody.appendChild(row);
            });
        }

    // 7. Copy Affiliate Link Handler
    function copyAffiliateLink() {
            const input = document.getElementById('mainAffiliateLinkInput');
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = document.getElementById('copyMainLinkBtn');
    btn.textContent = "Copied!";
    btn.classList.add('bg-emerald-500');
                setTimeout(() => {
        btn.textContent = "Copy Link";
    btn.classList.remove('bg-emerald-500');
                }, 2000);
            });
        }

    // 8. Simulation Controls (For testing 0 vs active downline & milestone unlocks)
    function simulateAddReferralDownline() {
            const sampleNames = ['@alex_dev', '@sarah_k', '@chidex_99', '@victor_fx', '@faith_hub', '@emeka_ui'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)] + Math.floor(Math.random() * 10);
            const isPro = Math.random() > 0.35;
    const cut = isPro ? 1.50 : 0.75;

    const newMember = {
        username: randomName,
    plan: isPro ? 'pro' : 'starter',
    amountUSD: cut,
    date: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' }),
    status: 'pending'
            };

    affiliateState.downline.unshift(newMember);
    affiliateState.totalUSD += cut;
    saveAffiliateData();
    renderAffiliateStats();
        }

    function resetReferralsDownline() {
        affiliateState.downline = [];
    affiliateState.claimedMilestones = [];
    affiliateState.totalUSD = 0.00;
    saveAffiliateData();
    renderAffiliateStats();
        }

    // 9. Sign Out Handler
    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }
