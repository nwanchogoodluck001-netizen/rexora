
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

    // 2. Mobile Drawer Controls
    function toggleMobileDrawer() {
        document.getElementById('mobileDrawer').classList.toggle('hidden');
        }

    // 3. Plan & Currency State
    let userPlan = 'pro';
    const storedUser = localStorage.getItem('rexora_user');
    if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
    if (parsed.plan) userPlan = parsed.plan;
            } catch (e) {console.error(e); }
        }

    // 4. Survey KPI Stats (Strict 0.00 Default - No Demo Balance)
    function getStoredSurveyStats() {
            const data = localStorage.getItem('rexora_survey_stats');
    if (data) {
                try { return JSON.parse(data); } catch (e) {console.error(e); }
            }
    return {totalUSD: 0.00, completedCount: 0, currency: 'USD', rate: 1000 };
        }

    const surveyStats = getStoredSurveyStats();

    function saveSurveyStats() {
        localStorage.setItem('rexora_survey_stats', JSON.stringify(surveyStats));
        }

    function renderSurveyStats() {
            const totalDisplay = document.getElementById('totalSurveyEarningsDisplay');
    const totalSub = document.getElementById('totalSurveySub');
    const countDisplay = document.getElementById('completedSurveysDisplay');
    const label = document.getElementById('surveyCurLabel');

    countDisplay.textContent = `${surveyStats.completedCount} Completed`;

    if (surveyStats.currency === 'USD') {
        label.textContent = "USD ($)";
    totalDisplay.textContent = `$${surveyStats.totalUSD.toFixed(2)}`;
    totalSub.textContent = `≈ ₦${(surveyStats.totalUSD * surveyStats.rate).toLocaleString()} (Approved)`;
            } else {
        label.textContent = "NGN (₦)";
    totalDisplay.textContent = `₦${(surveyStats.totalUSD * surveyStats.rate).toLocaleString()}`;
    totalSub.textContent = `≈ $${surveyStats.totalUSD.toFixed(2)} USD (Approved)`;
            }
        }

    function toggleSurveyCurrency() {
        surveyStats.currency = surveyStats.currency === 'USD' ? 'NGN' : 'USD';
    saveSurveyStats();
    renderSurveyStats();
    renderSurveys();
        }
    renderSurveyStats();

    // 5. Surveys Dataset
    const surveyPool = [
    {
        id: 1,
    category: "Fintech & Remittance",
    title: "Cross-Border Remittance Fees & Speed Evaluation",
    duration: "⏱ 3–5 Mins",
    slots: "🔥 42 / 100 spots remaining",
    description: "Answer 3 multiple-choice questions assessing your preferred payment rails, app delays, and fee tolerances when converting funds.",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.75,
    questions: [
    {
        title: "What is your primary method for receiving digital international payments?",
    options: ["Cryptocurrency / Stablecoins (USDT)", "Local Bank Transfer / Virtual Accounts", "Fintech Mobile Wallets", "Peer-to-Peer (P2P) Networks"]
                    },
    {
        title: "What is the biggest challenge you face with traditional bank transfers?",
    options: ["High conversion spreads & hidden charges", "Excessive processing settlement delays", "Complex verification requirements", "Account freezes or transaction limits"]
                    },
    {
        title: "How often do you withdraw earnings to your local bank account?",
    options: ["Daily as soon as received", "Weekly (e.g. Weekend payouts)", "Twice a month", "Monthly in bulk"]
                    }
    ]
            },
    {
        id: 2,
    category: "Consumer Tech & AI",
    title: "AI Tools & Workflow Adoption Survey",
    duration: "⏱ 2–4 Mins",
    slots: "🔥 68 / 150 spots remaining",
    description: "Provide feedback on your daily use of artificial intelligence generators, script writing software, and automated content tools.",
    usdPayout: userPlan === 'pro' ? 1.80 : 0.60,
    questions: [
    {
        title: "Which generative AI tooling do you use most frequently?",
    options: ["ChatGPT / Claude / Gemini (Text & Code)", "Canva / Midjourney (Graphics)", "ElevenLabs / NarraVox (Voice synthesis)", "I do not use AI tools regularly"]
                    },
    {
        title: "For what task does AI save you the most time?",
    options: ["Writing content briefs and social copy", "Graphic design and marketing banners", "Coding and web debugging", "Research and concept summarization"]
                    },
    {
        title: "Are you willing to pay a recurring subscription for premium AI features?",
    options: ["Yes, if it directly increases my income", "No, I strictly use free tiers", "Only for one-time project needs", "Undecided"]
                    }
    ]
            },
    {
        id: 3,
    category: "Digital Work Habits",
    title: "African Remote Freelancer Productivity Audit",
    duration: "⏱ 3 Mins",
    slots: "🔥 19 / 50 spots remaining",
    description: "Assess device accessibility, data cost constraints, and peak productive working hours for mobile-first digital contributors.",
    usdPayout: userPlan === 'pro' ? 2.50 : 0.90,
    questions: [
    {
        title: "What device do you use primarily to complete remote jobs and micro-tasks?",
    options: ["Smartphone / Mobile Data only", "Laptop / Desktop on Wi-Fi", "Tablet / Mobile Hybrid", "Shared Internet Cybercafé"]
                    },
    {
        title: "What is your estimated weekly mobile data expenditure?",
    options: ["Under ₦2,000 / $2.00", "₦2,000 – ₦5,000 / $5.00", "₦5,000 – ₦10,000", "Above ₦10,000 / $10.00+"]
                    },
    {
        title: "What time of day are you most active completing online tasks?",
    options: ["Early morning (6 AM – 11 AM)", "Afternoon (12 PM – 5 PM)", "Evening (6 PM – 10 PM)", "Late night / Midnight hours"]
                    }
    ]
            },
    {
        id: 4,
    category: "Lifestyle & Media",
    title: "Short-Form Video & Streaming Content Preferences",
    duration: "⏱ 2 Mins",
    slots: "🔥 85 / 200 spots remaining",
    description: "Review current viewing trends across short-form platforms, video engagement lengths, and sponsored marketing formats.",
    usdPayout: userPlan === 'pro' ? 1.50 : 0.50,
    questions: [
    {
        title: "On which platform do you spend the most personal screen time?",
    options: ["TikTok", "YouTube / YouTube Shorts", "Instagram Reels", "X (Twitter)"]
                    },
    {
        title: "What style of promotional videos keeps your attention longest?",
    options: ["Faceless aesthetic walkthroughs with voiceover", "Direct creator talking head reviews", "High-energy comedic skits", "Before-and-after case studies"]
                    },
    {
        title: "Have you ever bought a product directly after watching a social video ad?",
    options: ["Yes, multiple times", "Yes, once or twice", "No, never", "Only if it had a large discount code"]
                    }
    ]
            },
    {
        id: 5,
    category: "Fintech & Remittance",
    title: "Mobile Banking Security & KYC Usability Survey",
    duration: "⏱ 3 Mins",
    slots: "🔥 34 / 80 spots remaining",
    description: "Share your preferences on biometric authentication, identity document verification, and password safety.",
    usdPayout: userPlan === 'pro' ? 2.00 : 0.70,
    questions: [
    {
        title: "Which login authentication method do you consider most secure on mobile?",
    options: ["Biometrics (Fingerprint / Face ID)", "SMS / WhatsApp OTP verification", "Hardware security keys or Authenticator App", "Standard alphanumeric passwords"]
                    },
    {
        title: "How do you feel about government ID verification (e.g. NIN, BVN) on earning apps?",
    options: ["Comfortable, if it guarantees instant payouts", "Hesitant, I prefer anonymous platforms", "Neutral, standard procedure", "Only for high withdrawal volumes"]
                    },
    {
        title: "Have you experienced unauthorized account access attempts in the past year?",
    options: ["No, never", "Yes, caught via 2FA alerts", "Yes, had to reset passwords", "Prefer not to disclose"]
                    }
    ]
            },
    {
        id: 6,
    category: "Consumer Tech & AI",
    title: "Web3 Wallet Usability & Token Swapping Feedback",
    duration: "⏱ 4 Mins",
    slots: "🔥 12 / 60 spots remaining",
    description: "Evaluate decentralized wallet interfaces, slippage comprehension, and transaction speed expectations.",
    usdPayout: userPlan === 'pro' ? 3.00 : 1.00,
    questions: [
    {
        title: "How comfortable are you managing your own crypto private keys or seed phrases?",
    options: ["Very comfortable (Self-custody native)", "Somewhat comfortable", "Prefer custodial wallets (with email recovery)", "Brand new to crypto"]
                    },
    {
        title: "What is your main priority when swapping stablecoins or tokens?",
    options: ["Lowest possible gas / network fees", "Instant transaction confirmation", "Clean and simple mobile UI", "Guaranteed zero slippage"]
                    },
    {
        title: "Would you prefer direct automated weekend withdrawals into stablecoins or local bank naira?",
    options: ["Local bank naira (NGN)", "USDT / USDC stablecoins", "A 50/50 split option", "No preference"]
                    }
    ]
            }
    ];

    let activeCategory = 'All';
    let currentSurvey = null;
    let currentQuestionIdx = 0;
    let selectedOption = null;

    // 6. Render Surveys Feed
    function renderSurveys() {
            const grid = document.getElementById('surveyGrid');
    grid.innerHTML = '';

    const filtered = activeCategory === 'All'
    ? surveyPool
                : surveyPool.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));

    if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
            No active surveys in this category. Check back shortly for new research drops.
          </div>
        `;
    return;
            }

            filtered.forEach(survey => {
                const card = document.createElement('div');
    card.className = "p-4 sm:p-6 rounded-3xl bg-white dark:bg-darkblue-900 border border-slate-200/80 dark:border-darkblue-border shadow-sm flex flex-col justify-between min-w-0 hover:border-brand-500 transition-all";

    const ngnVal = survey.usdPayout * surveyStats.rate;
    const payoutText = surveyStats.currency === 'USD'
    ? `+$${survey.usdPayout.toFixed(2)}`
    : `+₦${ngnVal.toLocaleString()}`;

    card.innerHTML = `
    <div class="min-w-0">
        <!-- Header Badges -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkblue-border">
            <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 truncate max-w-[170px]">
                ${survey.category}
            </span>
            <span class="text-[9px] sm:text-[10px] font-black text-slate-400 shrink-0">
                ${survey.duration}
            </span>
        </div>

        <!-- Slots Remaining -->
        <div class="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <span>${survey.slots}</span>
        </div>

        <!-- Title & Snippet -->
        <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1.5 leading-snug break-words">
            ${survey.title}
        </h3>
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            ${survey.description}
        </p>
    </div>

    <!-- Payout and CTA Button -->
    <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-darkblue-border flex items-center justify-between gap-2">
        <div class="min-w-0">
            <span class="text-[8px] sm:text-[9px] font-black uppercase text-slate-400 block">Reward</span>
            <div class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 truncate">
                ${payoutText}
            </div>
        </div>

        <button
            onclick="startSurveyModal(${survey.id})"
            class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-500/20 transition-all shrink-0 uppercase tracking-wider"
        >
            Start Survey
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
                if (btn.textContent.trim().toLowerCase().includes(cat.toLowerCase()) || (cat === 'All' && btn.textContent.trim().includes('All Surveys'))) {
        btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md whitespace-nowrap shrink-0";
                } else {
        btn.className = "cat-pill px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all bg-white dark:bg-darkblue-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-darkblue-border whitespace-nowrap shrink-0";
                }
            });
    renderSurveys();
        }

    // 8. Interactive Survey Modal Handlers
    function startSurveyModal(surveyId) {
        currentSurvey = surveyPool.find(s => s.id === surveyId);
    if (!currentSurvey) return;

    currentQuestionIdx = 0;
    selectedOption = null;

    document.getElementById('surveyQuestionView').classList.remove('hidden');
    document.getElementById('surveySuccessView').classList.add('hidden');

    document.getElementById('modalCategoryBadge').textContent = currentSurvey.category;

    const ngnVal = currentSurvey.usdPayout * surveyStats.rate;
    const payoutFormatted = surveyStats.currency === 'USD'
    ? `+$${currentSurvey.usdPayout.toFixed(2)}`
    : `+₦${ngnVal.toLocaleString()}`;
    document.getElementById('modalPayoutDisplay').textContent = payoutFormatted;

    renderCurrentQuestion();
    document.getElementById('surveyModal').classList.remove('hidden');
        }

    function renderCurrentQuestion() {
            const q = currentSurvey.questions[currentQuestionIdx];
    const totalQuestions = currentSurvey.questions.length;

    document.getElementById('modalQuestionCounter').textContent = `Question ${currentQuestionIdx + 1} of ${totalQuestions}`;

    const progressPercent = ((currentQuestionIdx + 1) / totalQuestions) * 100;
    document.getElementById('modalProgressBar').style.width = `${progressPercent}%`;

    document.getElementById('modalQuestionTitle').textContent = q.title;

    const optionsBox = document.getElementById('modalOptionsContainer');
    optionsBox.innerHTML = '';
    selectedOption = null;

    const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestionIdx === totalQuestions - 1 ? "Submit & Credit Reward" : "Continue";

            q.options.forEach((optText, idx) => {
                const optButton = document.createElement('button');
    optButton.type = "button";
    optButton.className = "w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 dark:border-darkblue-border bg-slate-50/50 dark:bg-darkblue-850 hover:border-brand-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between";
    optButton.innerHTML = `
    <span>${optText}</span>
    <span class="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 radio-dot shrink-0 ml-2"></span>
    `;
                optButton.onclick = () => selectSurveyOption(idx, optButton);
    optionsBox.appendChild(optButton);
            });
        }

    function selectSurveyOption(idx, btnElement) {
        selectedOption = idx;
    const allButtons = document.querySelectorAll('#modalOptionsContainer button');
            allButtons.forEach(b => {
        b.className = "w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 dark:border-darkblue-border bg-slate-50/50 dark:bg-darkblue-850 hover:border-brand-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between";
    b.querySelector('.radio-dot').className = "w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 radio-dot shrink-0 ml-2";
            });

    btnElement.className = "w-full text-left p-3.5 rounded-2xl border-2 border-brand-500 bg-brand-50/30 dark:bg-brand-950/40 text-xs font-bold text-slate-900 dark:text-white transition-all flex items-center justify-between";
    btnElement.querySelector('.radio-dot').className = "w-4 h-4 rounded-full border-4 border-brand-500 bg-white radio-dot shrink-0 ml-2";

    document.getElementById('nextQuestionBtn').disabled = false;
        }

    function handleNextQuestion() {
            if (selectedOption === null) return;

    if (currentQuestionIdx < currentSurvey.questions.length - 1) {
        currentQuestionIdx++;
    renderCurrentQuestion();
            } else {
                // Complete Survey: Settle & Credit
                const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = "Processing Reward...";

                setTimeout(() => {
        surveyStats.totalUSD += currentSurvey.usdPayout;
    surveyStats.completedCount += 1;
    saveSurveyStats();
    renderSurveyStats();

    const ngnVal = currentSurvey.usdPayout * surveyStats.rate;
    const payoutFormatted = surveyStats.currency === 'USD'
    ? `$${currentSurvey.usdPayout.toFixed(2)}`
    : `₦${ngnVal.toLocaleString()}`;

    document.getElementById('rewardCreditedText').textContent = payoutFormatted;
    document.getElementById('surveyQuestionView').classList.add('hidden');
    document.getElementById('surveySuccessView').classList.remove('hidden');
                }, 700);
            }
        }

    function closeSurveyModal() {
        document.getElementById('surveyModal').classList.add('hidden');
        }

    // 9. Sign Out Trigger
    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }

    // Initial feed render
    renderSurveys();
