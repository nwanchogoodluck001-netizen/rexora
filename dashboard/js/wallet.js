
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

    // 2. Wallet State (Strictly 0.00 Default - No Demo Balance)
    function getStoredWalletData() {
            const data = localStorage.getItem('rexora_wallet_data');
    if (data) {
                try { return JSON.parse(data); } catch (e) {console.error(e); }
            }
    return {
        taskUSD: 0.00,
    affiliateUSD: 0.00,
    currency: 'USD',
    rate: 1000,
    bank: null, // {bankName, accountNumber, accountName}
    ledger: []  // [{title, category, amountUSD, type: 'credit'|'debit', timestamp, status }]
            };
        }

    const walletState = getStoredWalletData();

    function saveWalletData() {
        localStorage.setItem('rexora_wallet_data', JSON.stringify(walletState));
        }

    // 3. Render Cards & Currency Toggles
    function renderWalletUI() {
            const taskDisplay = document.getElementById('taskBalanceDisplay');
    const taskSub = document.getElementById('taskBalanceSub');
    const affDisplay = document.getElementById('affiliateBalanceDisplay');
    const affSub = document.getElementById('affiliateBalanceSub');
    const curLabel = document.getElementById('walletCurLabel');

    if (walletState.currency === 'USD') {
        curLabel.textContent = "USD ($)";
    taskDisplay.textContent = `$${walletState.taskUSD.toFixed(2)}`;
    taskSub.textContent = `≈ ₦${(walletState.taskUSD * walletState.rate).toLocaleString()} NGN Available`;

    affDisplay.textContent = `$${walletState.affiliateUSD.toFixed(2)}`;
    affSub.textContent = `≈ ₦${(walletState.affiliateUSD * walletState.rate).toLocaleString()} NGN (Settles Fri – Sun)`;
            } else {
        curLabel.textContent = "NGN (₦)";
    taskDisplay.textContent = `₦${(walletState.taskUSD * walletState.rate).toLocaleString()}`;
    taskSub.textContent = `≈ $${walletState.taskUSD.toFixed(2)} USD Available`;

    affDisplay.textContent = `₦${(walletState.affiliateUSD * walletState.rate).toLocaleString()}`;
    affSub.textContent = `≈ $${walletState.affiliateUSD.toFixed(2)} USD (Settles Fri – Sun)`;
            }

    renderBankDetails();
    renderLedgerTable();
        }

    function toggleWalletCurrency() {
        walletState.currency = walletState.currency === 'USD' ? 'NGN' : 'USD';
    saveWalletData();
    renderWalletUI();
        }
    renderWalletUI();

    // 4. Bank Manager Handlers
    function renderBankDetails() {
            const bankNameEl = document.getElementById('savedBankName');
    const bankDetailsEl = document.getElementById('savedAccountDetails');

    if (walletState.bank) {
        bankNameEl.innerHTML = `<span>🏦</span> ${walletState.bank.bankName}`;
    bankDetailsEl.textContent = `${walletState.bank.accountName} ••••• ${walletState.bank.accountNumber.slice(-4)}`;
            } else {
        bankNameEl.innerHTML = `<span>🏦</span> Not Linked Yet`;
    bankDetailsEl.textContent = `No bank account saved. Add your Nigerian bank details to receive withdrawals.`;
            }
        }

    function openBankModal() {
            if (walletState.bank) {
        document.getElementById('bankNameInput').value = walletState.bank.bankName;
    document.getElementById('accountNumberInput').value = walletState.bank.accountNumber;
    document.getElementById('accountNameInput').value = walletState.bank.accountName;
            }
    document.getElementById('bankModal').classList.remove('hidden');
        }

    function closeBankModal() {
        document.getElementById('bankModal').classList.add('hidden');
        }

        document.getElementById('bankForm').addEventListener('submit', (e) => {
        e.preventDefault();
    const bName = document.getElementById('bankNameInput').value.trim();
    const accNum = document.getElementById('accountNumberInput').value.trim();
    const accName = document.getElementById('accountNameInput').value.trim();

    if (!bName || accNum.length < 10 || !accName) {
        alert("Please provide a valid bank name, 10-digit account number, and account holder name.");
    return;
            }

    walletState.bank = {bankName: bName, accountNumber: accNum, accountName: accName };
    saveWalletData();
    renderBankDetails();
    closeBankModal();
    alert("Settlement bank details successfully updated!");
        });

    // 5. Render Ledger Table
    function renderLedgerTable() {
            const emptyView = document.getElementById('emptyLedgerView');
    const tableWrapper = document.getElementById('ledgerTableWrapper');
    const tableBody = document.getElementById('ledgerTableBody');

    if (walletState.ledger.length === 0) {
        emptyView.classList.remove('hidden');
    tableWrapper.classList.add('hidden');
    tableBody.innerHTML = '';
    return;
            }

    emptyView.classList.add('hidden');
    tableWrapper.classList.remove('hidden');
    tableBody.innerHTML = '';

            walletState.ledger.forEach(entry => {
                const row = document.createElement('tr');

    const isCredit = entry.type === 'credit';
    const sign = isCredit ? '+' : '-';
    const amountDisplay = walletState.currency === 'USD'
    ? `${sign}$${entry.amountUSD.toFixed(2)}`
    : `${sign}₦${(entry.amountUSD * walletState.rate).toLocaleString()}`;

    const amountColor = isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500';

    row.innerHTML = `
    <td class="py-3 px-2 font-black text-slate-900 dark:text-white">${entry.title}</td>
    <td class="py-3 px-2 text-[10px] uppercase text-slate-400 font-bold">${entry.category}</td>
    <td class="py-3 px-2 font-black ${amountColor}">${amountDisplay}</td>
    <td class="py-3 px-2 text-[10px] text-slate-400">${entry.timestamp}</td>
    <td class="py-3 px-2 text-right">
        <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            ${entry.status}
        </span>
    </td>
    `;
    tableBody.appendChild(row);
            });
        }

    // 6. Simulation Controls (For testing 0.00 vs Credit Flow)
    function simulateCredit() {
            const sampleCredits = [
    {title: "Remote Job: Banner Deliverable", category: "Micro-Contract", amount: 40.00, target: 'task' },
    {title: "Affiliate Cut: @victor_pro", category: "Referral 50%", amount: 1.50, target: 'affiliate' },
    {title: "Daily Streak: Morning Drop", category: "Daily Streak", amount: 0.50, target: 'task' },
    {title: "Market Research: Fintech Usability", category: "Survey Drop", amount: 2.00, target: 'task' }
    ];

    const item = sampleCredits[Math.floor(Math.random() * sampleCredits.length)];
    if (item.target === 'task') {
        walletState.taskUSD += item.amount;
            } else {
        walletState.affiliateUSD += item.amount;
            }

    walletState.ledger.unshift({
        title: item.title,
    category: item.category,
    amountUSD: item.amount,
    type: 'credit',
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' }),
    status: 'Settled'
            });

    saveWalletData();
    renderWalletUI();
        }

    function resetLedger() {
        walletState.taskUSD = 0.00;
    walletState.affiliateUSD = 0.00;
    walletState.ledger = [];
    saveWalletData();
    renderWalletUI();
        }

    // 7. Sign Out Handler
    function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }
