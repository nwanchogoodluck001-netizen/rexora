
        // 1. Light / Custom Dark-Blue Theme Handler
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

        // 2. Mobile Drawer Toggle
        function toggleMobileDrawer() {
            const drawer = document.getElementById('mobileDrawer');
            drawer.classList.toggle('hidden');
        }

        // 3. Welcome Community Modal Dismissal
        function closeModal() {
            const modal = document.getElementById('communityModal');
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        // 4. Dynamic Greeting By Time of Day
        function setGreeting() {
            const hour = new Date().getHours();
            let greeting = "Good evening";
            if (hour < 12) greeting = "Good morning";
            else if (hour < 18) greeting = "Good afternoon";
            document.getElementById('greetingMessage').textContent = `${greeting}, Guzy 👋`;
        }
        setGreeting();

        // 5. Balance Slideshow (Slide 1: Available, Slide 2: Affiliate)
        let currentSlide = 1;
        function setBalanceSlide(slide) {
            currentSlide = slide;
            const s1 = document.getElementById('balanceSlide1');
            const s2 = document.getElementById('balanceSlide2');
            const d1 = document.getElementById('dot1');
            const d2 = document.getElementById('dot2');
            if (slide === 1) {
                s1.classList.remove('hidden');
                s2.classList.add('hidden');
                d1.className = 'w-3 h-3 rounded-full bg-white transition-all';
                d2.className = 'w-3 h-3 rounded-full bg-white/40 transition-all';
            } else {
                s2.classList.remove('hidden');
                s1.classList.add('hidden');
                d2.className = 'w-3 h-3 rounded-full bg-white transition-all';
                d1.className = 'w-3 h-3 rounded-full bg-white/40 transition-all';
            }
        }
        // Auto rotate slide every 6 seconds
        setInterval(() => {
            setBalanceSlide(currentSlide === 1 ? 2 : 1);
        }, 6000);

        // 6. Currency Swapper ($ USD <-> ₦ NGN)
        let currentCurrency = 'USD'; // 'USD' or 'NGN'
        const balances = {
            taskUSD: 84.50,
            affiliateUSD: 45.00,
            rate: 1000 // 1 USD = ₦1,000
        };
        function toggleCurrency() {
            currentCurrency = currentCurrency === 'USD' ? 'NGN' : 'USD';
            const flag = document.getElementById('activeCurrencyFlag');
            const hint = document.getElementById('activeCurrencyHint');
            const taskEl = document.getElementById('taskBalanceDisplay');
            const affEl = document.getElementById('affiliateBalanceDisplay');
            if (currentCurrency === 'NGN') {
                flag.textContent = 'Swap: NGN (₦)';
                hint.textContent = 'Switch to USD ($)';
                taskEl.textContent = `₦${(balances.taskUSD * balances.rate).toLocaleString()}`;
                affEl.textContent = `₦${(balances.affiliateUSD * balances.rate).toLocaleString()}`;
            } else {
                flag.textContent = 'Swap: USD ($)';
                hint.textContent = 'Switch to NGN (₦)';
                taskEl.textContent = `$${balances.taskUSD.toFixed(2)}`;
                affEl.textContent = `$${balances.affiliateUSD.toFixed(2)}`;
            }
        }

        // 7. Referral Link Copy Mechanism
        function copyAffiliateLink() {
            const input = document.getElementById('affiliateLinkInput');
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = document.getElementById('copyLinkBtn');
                btn.textContent = 'Copied!';
                btn.classList.add('bg-emerald-500');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('bg-emerald-500');
                }, 2000);
            });
        }

        // 8. Conversion Calculator Engine
        function convertFromUsd() {
            const usdVal = parseFloat(document.getElementById('calcUsdInput').value) || 0;
            const ngnVal = usdVal * 1000;
            document.getElementById('calcNgnOutput').value = `₦${ngnVal.toLocaleString()}`;
        }

        // 9. Sign Out Trigger
        function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
                window.location.href = '../auth/login.html';
            }
        }
