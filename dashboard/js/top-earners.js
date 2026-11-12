
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

    // 2. Leaderboard Dataset (USD Default)
    let activeCurrency = 'USD'; // Defaults to USD ($)
    const rate = 1000;

    const topEarnersData = [
    {rank: 1, name: "Smart", handle: "@smart", initial: "S", plan: "PRO", earningsUSD: 4.00 },
    {rank: 2, name: "Buff", handle: "@buffunique890", initial: "B", plan: "PRO", earningsUSD: 4.00 },
    {rank: 3, name: "David_FX", handle: "@david_fx", initial: "D", plan: "PRO", earningsUSD: 1.50 },
    {rank: 4, name: "Chidex Dev", handle: "@chidex_ui", initial: "C", plan: "PRO", earningsUSD: 1.50 },
    {rank: 5, name: "Amina_K", handle: "@amina_k", initial: "A", plan: "STARTER", earningsUSD: 0.75 },
    {rank: 6, name: "Victor Tech", handle: "@victortech", initial: "V", plan: "PRO", earningsUSD: 0.75 }
    ];

    function formatAmount(usdAmount) {
            if (activeCurrency === 'USD') {
                return `$${usdAmount.toFixed(2)}`;
            } else {
                const ngn = usdAmount * rate;
    return `₦${ngn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        }

    function toggleLeaderboardCurrency() {
        activeCurrency = activeCurrency === 'USD' ? 'NGN' : 'USD';
    document.getElementById('lbCurLabel').textContent = activeCurrency === 'USD' ? 'USD ($)' : 'NGN (₦)';
    renderLeaderboard();
        }

    function renderLeaderboard() {
            // Update Podium Top 3
            const p1 = topEarnersData[0];
    const p2 = topEarnersData[1];
    const p3 = topEarnersData[2];

    document.getElementById('podium1Avatar').textContent = p1.initial;
    document.getElementById('podium1Name').textContent = p1.name;
    document.getElementById('podium1Handle').textContent = p1.handle;
    document.getElementById('podium1Amount').textContent = formatAmount(p1.earningsUSD);

    document.getElementById('podium2Avatar').textContent = p2.initial;
    document.getElementById('podium2Name').textContent = p2.name;
    document.getElementById('podium2Handle').textContent = p2.handle;
    document.getElementById('podium2Amount').textContent = formatAmount(p2.earningsUSD);

    document.getElementById('podium3Avatar').textContent = p3.initial;
    document.getElementById('podium3Name').textContent = p3.name;
    document.getElementById('podium3Handle').textContent = p3.handle;
    document.getElementById('podium3Amount').textContent = formatAmount(p3.earningsUSD);

    // Update Table Body
    const tbody = document.getElementById('leaderboardTableBody');
    tbody.innerHTML = '';

            topEarnersData.forEach(user => {
                const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 dark:hover:bg-darkblue-850/60 transition-colors";

    let rankBadge = `<span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-darkblue-800 text-slate-600 dark:text-slate-300 inline-flex items-center justify-center font-black text-[11px]">#${user.rank}</span>`;
    if (user.rank === 1) {
        rankBadge = `<span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 inline-flex items-center justify-center font-black text-[11px]">🥇</span>`;
                } else if (user.rank === 2) {
        rankBadge = `<span class="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 inline-flex items-center justify-center font-black text-[11px]">🥈</span>`;
                } else if (user.rank === 3) {
        rankBadge = `<span class="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 inline-flex items-center justify-center font-black text-[11px]">🥉</span>`;
                }

    const tierPill = user.plan === 'PRO'
    ? `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">PRO</span>`
    : `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">STARTER</span>`;

    tr.innerHTML = `
    <td class="py-3.5 px-3">${rankBadge}</td>
    <td class="py-3.5 px-3">
        <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-xs flex items-center justify-center shrink-0">
                ${user.initial}
            </div>
            <div>
                <div class="font-black text-slate-900 dark:text-white">${user.name}</div>
                <div class="text-[10px] font-bold text-slate-400">${user.handle}</div>
            </div>
        </div>
    </td>
    <td class="py-3.5 px-3">${tierPill}</td>
    <td class="py-3.5 px-3">
        <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            ✓ Verified Active
        </span>
    </td>
    <td class="py-3.5 px-3 text-right font-black text-sm text-slate-900 dark:text-white">
        ${formatAmount(user.earningsUSD)}
    </td>
    `;
    tbody.appendChild(tr);
            });
        }

    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }

    // Initial render
    renderLeaderboard();
