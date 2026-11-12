
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

        // 3. User Plan Gating
        let userPlan = 'pro';
        const storedUser = localStorage.getItem('rexora_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.plan) userPlan = parsed.plan;
            } catch (e) { console.error(e); }
        }

        // 4. Read to Earn KPI Stats (Strictly 0.00 Default - No Demo Balance)
        function getStoredReadStats() {
            const data = localStorage.getItem('rexora_read_stats');
            if (data) {
                try { return JSON.parse(data); } catch (e) { console.error(e); }
            }
            return { totalUSD: 0.00, readCount: 0, currency: 'USD', rate: 1000 };
        }

        const readStats = getStoredReadStats();

        function saveReadStats() {
            localStorage.setItem('rexora_read_stats', JSON.stringify(readStats));
        }

        function renderReadStats() {
            const totalDisplay = document.getElementById('totalReadEarningsDisplay');
            const totalSub = document.getElementById('totalReadSub');
            const countDisplay = document.getElementById('completedArticlesDisplay');
            const curLabel = document.getElementById('readCurLabel');

            countDisplay.textContent = `${readStats.readCount} Articles`;

            if (readStats.currency === 'USD') {
                curLabel.textContent = "USD ($)";
                totalDisplay.textContent = `$${readStats.totalUSD.toFixed(2)}`;
                totalSub.textContent = `≈ ₦${(readStats.totalUSD * readStats.rate).toLocaleString()} (Approved & Withdrawable)`;
            } else {
                curLabel.textContent = "NGN (₦)";
                totalDisplay.textContent = `₦${(readStats.totalUSD * readStats.rate).toLocaleString()}`;
                totalSub.textContent = `≈ $${readStats.totalUSD.toFixed(2)} USD (Approved & Withdrawable)`;
            }
        }

        function toggleReadCurrency() {
            readStats.currency = readStats.currency === 'USD' ? 'NGN' : 'USD';
            saveReadStats();
            renderReadStats();
            renderArticles();
        }
        renderReadStats();

        // 5. Articles Dataset
        const articlesPool = [
            {
                id: 1,
                category: "Forex & Liquidity",
                title: "USD/NGN Currency Outlook & Global Foreign Exchange Liquidity in 2026",
                readTime: "⏱ 2 Mins Read",
                usdPayout: userPlan === 'pro' ? 1.50 : 0.40,
                excerpt: "An empirical overview of central bank clearing rails, interbank liquidity pools, and digital hedging instruments for emerging market professionals.",
                body: [
                    "Cross-border payment infrastructure across Sub-Saharan Africa has entered a transformative era. As global inflation metrics normalize and high-frequency trading networks deepen liquidity access, individual remote contributors are finding unprecedented utility in dollar-denominated task settlement.",
                    "Central bank frameworks throughout 2026 have increasingly accommodated digital verification mechanisms. This regulatory clarity has reduced clearing slippage, making peer-to-peer liquidity and immediate weekend settlements far more accessible for independent web developers and technical freelancers.",
                    "Key Takeaway: Preserving active capital across decentralized dollar accounts buffers local earnings against currency volatility while guaranteeing predictable weekly payouts."
                ]
            },
            {
                id: 2,
                category: "Web3 & DeFi",
                title: "Self-Custody Wallets vs. Institutional Escrow: Safe Task Settlement",
                readTime: "⏱ 2 Mins Read",
                usdPayout: userPlan === 'pro' ? 2.00 : 0.50,
                excerpt: "Examining smart contract escrow mechanisms, counterparty risk mitigation, and instant settlement speed for digital platform workers.",
                body: [
                    "Traditional freelance marketplaces often hold earner balances for up to fourteen business days under the guise of fraud prevention. In contrast, modern task platforms rely on pre-funded escrow pools that disburse directly upon proof validation.",
                    "By utilizing verified client contracts, platforms can guarantee that funds are already locked in reserve before an assignment is published. This architecture eliminates non-payment risk entirely for contributors submitting remote deliverables.",
                    "Key Takeaway: Always ensure task platforms offer visible escrow verification or audited settlement schedules to maximize your productive earning hours."
                ]
            },
            {
                id: 3,
                category: "Remote Work",
                title: "Top High-Yield Remote Skills: Frontend Web Architecture in Demand",
                readTime: "⏱ 3 Mins Read",
                usdPayout: userPlan === 'pro' ? 1.75 : 0.45,
                excerpt: "Why clean HTML5, Tailwind CSS, and lightweight Vanilla JavaScript interfaces command premium micro-job contract pricing.",
                body: [
                    "While heavy single-page application frameworks dominate enterprise engineering, high-converting digital marketplaces and landing portals favor lightweight, clean codebases with zero bloat and near-instant initial render speeds.",
                    "Frontend developers who master responsive layout primitives, viewport-locked mobile drawers, and smooth touch-first filter carousels are uniquely positioned to win verified client micro-contracts across digital earning hubs.",
                    "Key Takeaway: Focus on core fundamentals—speed, mobile responsiveness, and clean CSS architecture—to consistently qualify for top-tier marketplace contracts."
                ]
            },
            {
                id: 4,
                category: "Tech & AI",
                title: "Generative AI Workflow Integration for Digital Marketers",
                readTime: "⏱ 2 Mins Read",
                usdPayout: userPlan === 'pro' ? 1.25 : 0.35,
                excerpt: "Leveraging structured prompt engineering to accelerate social engagement campaigns, script writing, and ad deliverables.",
                body: [
                    "The modern digital task economy does not penalize the use of artificial intelligence; it rewards those who leverage automated tools to deliver superior client results in a fraction of the time.",
                    "From synthesizing short video ad hooks to generating high-CTR thumbnail ideas, creators who combine AI drafting with human editorial refinement consistently achieve higher contract acceptance rates and faster escrow releases.",
                    "Key Takeaway: Use AI to handle preliminary conceptualization, but always apply personalized design review to ensure brand compliance."
                ]
            },
            {
                id: 5,
                category: "Forex & Liquidity",
                title: "Managing Risk & Leverage: Principles of Sustainable Day Trading",
                readTime: "⏱ 2 Mins Read",
                usdPayout: userPlan === 'pro' ? 1.50 : 0.40,
                excerpt: "Essential position-sizing formulas and psychological guidelines for emerging forex market analysts.",
                body: [
                    "Capital preservation is the cornerstone of sustainable financial market participation. Professional analysts never evaluate a trade based on potential profit alone; risk exposure per transaction is strictly calculated before entry.",
                    "Adhering to fixed risk-to-reward ratios and avoiding over-leveraged lots during high-impact economic news releases protects the learning trader's capital base during volatile market cycles.",
                    "Key Takeaway: Consistent technical execution paired with structured time management yields superior long-term results compared to aggressive risk-taking."
                ]
            },
            {
                id: 6,
                category: "Remote Work",
                title: "Building Sustainable Multi-Stream Online Earning Regimens",
                readTime: "⏱ 2 Mins Read",
                usdPayout: userPlan === 'pro' ? 2.50 : 0.50,
                excerpt: "How balancing remote jobs, daily streaks, and passive referral commissions compounds your weekly income.",
                body: [
                    "Top earners on platform ecosystems rarely depend on a single task module. By combining daily consistency routines—such as claiming triple streak drops and answering research surveys—with higher-yield remote contracts, users establish steady baseline revenue.",
                    "Supplementing active work with optional affiliate invites generates recurring 50% commission cuts that payout automatically during weekend settlements, creating a resilient dual-income mechanism.",
                    "Key Takeaway: Diversify your daily platform activity across both active tasks and streak multipliers to maximize cumulative earnings."
                ]
            }
        ];

        let activeCategory = 'All';
        let currentArticle = null;
        let timerInterval = null;
        let secondsRemaining = 45;

        // 6. Render Articles
        function renderArticles() {
            const grid = document.getElementById('articlesGrid');
            grid.innerHTML = '';

            const filtered = activeCategory === 'All'
                ? articlesPool
                : articlesPool.filter(a => a.category.toLowerCase().includes(activeCategory.toLowerCase()));

            if (filtered.length === 0) {
                grid.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
            No articles currently published in this category.
          </div>
        `;
                return;
            }

            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = "p-4 sm:p-6 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200/80 dark:border-darkblue-border shadow-sm flex flex-col justify-between min-w-0 hover:border-brand-500 transition-all";

                const ngnVal = article.usdPayout * readStats.rate;
                const payoutText = readStats.currency === 'USD'
                    ? `+$${article.usdPayout.toFixed(2)}`
                    : `+₦${ngnVal.toLocaleString()}`;

                card.innerHTML = `
          <div class="min-w-0">
            <!-- Header Badges -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkblue-border">
              <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 truncate max-w-[170px]">
                ${article.category}
              </span>
              <span class="text-[9px] sm:text-[10px] font-black text-slate-400 shrink-0">
                ${article.readTime}
              </span>
            </div>

            <!-- Title & Snippet -->
            <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-3 leading-snug break-words">
              ${article.title}
            </h3>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              ${article.excerpt}
            </p>
          </div>

          <!-- Payout and Read Action -->
          <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-darkblue-border flex items-center justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[8px] sm:text-[9px] font-black uppercase text-slate-400 block">Reward</span>
              <div class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 truncate">
                ${payoutText}
              </div>
            </div>

            <button 
              onclick="openReaderModal(${article.id})" 
              class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-500/20 transition-all shrink-0 uppercase tracking-wider"
            >
              Read Article
            </button>
          </div>
        `;
                grid.appendChild(card);
            });
        }

        // 7. Filter Buttons Click Logic
        function filterCategory(cat) {
            activeCategory = cat;
            const buttons = document.querySelectorAll('.cat-pill');
            buttons.forEach(btn => {
                if (btn.textContent.trim().toLowerCase().includes(cat.toLowerCase()) || (cat === 'All' && btn.textContent.trim().includes('All Articles'))) {
                    btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md whitespace-nowrap shrink-0";
                } else {
                    btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-white dark:bg-darkblue-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-darkblue-border whitespace-nowrap shrink-0";
                }
            });
            renderArticles();
        }

        // 8. Reader Modal & 45s Verification Timer Engine
        function openReaderModal(articleId) {
            currentArticle = articlesPool.find(a => a.id === articleId);
            if (!currentArticle) return;

            document.getElementById('modalArticleCategory').textContent = currentArticle.category;

            const ngnVal = currentArticle.usdPayout * readStats.rate;
            const payoutFormatted = readStats.currency === 'USD'
                ? `+$${currentArticle.usdPayout.toFixed(2)} Escrow`
                : `+₦${ngnVal.toLocaleString()} Escrow`;
            document.getElementById('modalRewardLabel').textContent = payoutFormatted;

            document.getElementById('modalArticleTitle').textContent = currentArticle.title;

            const contentBox = document.getElementById('modalArticleContent');
            contentBox.innerHTML = '';
            currentArticle.body.forEach(para => {
                const p = document.createElement('p');
                p.textContent = para;
                contentBox.appendChild(p);
            });

            // Reset Verification Timer
            clearInterval(timerInterval);
            secondsRemaining = 45;
            updateTimerUI();

            const claimBtn = document.getElementById('claimReadRewardBtn');
            claimBtn.disabled = true;
            claimBtn.className = "w-full xs:w-auto px-6 py-3 rounded-2xl bg-slate-200 dark:bg-darkblue-800 text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-wider disabled:cursor-not-allowed transition-all";

            document.getElementById('readerModal').classList.remove('hidden');

            // Start countdown
            timerInterval = setInterval(() => {
                secondsRemaining--;
                updateTimerUI();

                if (secondsRemaining <= 0) {
                    clearInterval(timerInterval);
                    claimBtn.disabled = false;
                    claimBtn.textContent = `Claim ${payoutFormatted.replace(' Escrow', '')} Reward`;
                    claimBtn.className = "w-full xs:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer";
                }
            }, 1000);
        }

        function updateTimerUI() {
            const percent = Math.min(100, Math.round(((45 - secondsRemaining) / 45) * 100));
            document.getElementById('readingProgressBar').style.width = `${percent}%`;

            if (secondsRemaining > 0) {
                document.getElementById('timerCountdown').textContent = `${secondsRemaining}s remaining`;
                document.getElementById('claimReadRewardBtn').textContent = `🔒 Reading (${secondsRemaining}s)`;
            } else {
                document.getElementById('timerCountdown').textContent = "✓ Verified Active";
            }
        }

        function handleClaimReadReward() {
            if (secondsRemaining > 0) return;

            readStats.totalUSD += currentArticle.usdPayout;
            readStats.readCount += 1;
            saveReadStats();
            renderReadStats();

            const ngnVal = currentArticle.usdPayout * readStats.rate;
            const amountClaimed = readStats.currency === 'USD'
                ? `$${currentArticle.usdPayout.toFixed(2)}`
                : `₦${ngnVal.toLocaleString()}`;

            alert(`Success! ${amountClaimed} reading reward has been deposited into your withdrawable balance.`);
            closeReaderModal();
        }

        function closeReaderModal() {
            clearInterval(timerInterval);
            document.getElementById('readerModal').classList.add('hidden');
        }

        // 9. Sign Out Trigger
        function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
                window.location.href = '../auth/login.html';
            }
        }

        // Initial render
        renderArticles();
