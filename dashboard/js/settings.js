
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

    // 2. Load User Profile & Bank State from localStorage
    function getUserProfile() {
            const saved = localStorage.getItem('rexora_user');
    if (saved) {
                try { return JSON.parse(saved); } catch (e) { }
            }
    return {
        fullName: "Guzy",
    handle: "guzy",
    userId: "RX-9284",
    email: "guzy@rexora.com",
    phone: "+234 800 000 0000",
    plan: "pro"
            };
        }

    let userProfile = getUserProfile();

    function renderProfileUI() {
            const initials = userProfile.fullName
    .split(' ')
                .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'GZ';

    document.getElementById('profileAvatarBadge').textContent = initials;
    document.getElementById('headerAvatar').textContent = initials[0];
    document.getElementById('headerUsername').textContent = userProfile.fullName.split(' ')[0];
    document.getElementById('profileDisplayName').textContent = userProfile.fullName;
    document.getElementById('profileHandleAndId').textContent = `@${userProfile.handle} • ID: ${userProfile.userId}`;
    document.getElementById('profileDisplayEmail').textContent = userProfile.email;

    const tierBadge = document.getElementById('profileTierBadge');
    if (userProfile.plan === 'pro') {
        tierBadge.textContent = "PRO VERIFIED";
    tierBadge.className = "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300";
            } else {
        tierBadge.textContent = "STARTER";
    tierBadge.className = "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300";
            }

    // Sync Bank Row Subtitle
    const walletData = JSON.parse(localStorage.getItem('rexora_wallet_data') || '{ }');
    const bankSub = document.getElementById('bankRowSubtitle');
    if (walletData.bank && walletData.bank.bankName) {
        bankSub.textContent = `${walletData.bank.bankName} ••••• ${walletData.bank.accountNumber.slice(-4)} (${walletData.bank.accountName})`;
            } else {
        bankSub.textContent = "Configure destination account for cashouts";
            }
        }
    renderProfileUI();

    // 3. Modal Controls
    function openModal(modalId) {
            if (modalId === 'personalModal') {
        document.getElementById('inputFullName').value = userProfile.fullName;
    document.getElementById('inputEmail').value = userProfile.email;
    document.getElementById('inputPhone').value = userProfile.phone || '';
            } else if (modalId === 'bankModal') {
                const walletData = JSON.parse(localStorage.getItem('rexora_wallet_data') || '{ }');
    if (walletData.bank) {
        document.getElementById('settingsBankSelect').value = walletData.bank.bankName || '';
    document.getElementById('settingsAccNumber').value = walletData.bank.accountNumber || '';
    document.getElementById('settingsAccName').value = walletData.bank.accountName || '';
                }
            }
    document.getElementById(modalId).classList.remove('hidden');
        }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        }

        // 4. Form Submissions
        document.getElementById('personalForm').addEventListener('submit', (e) => {
        e.preventDefault();
    const nameVal = document.getElementById('inputFullName').value.trim();
    const emailVal = document.getElementById('inputEmail').value.trim();
    const phoneVal = document.getElementById('inputPhone').value.trim();

    if (!nameVal || !emailVal) {
        alert("Full name and email address are required.");
    return;
            }

    userProfile.fullName = nameVal;
    userProfile.email = emailVal;
    userProfile.phone = phoneVal;
    localStorage.setItem('rexora_user', JSON.stringify(userProfile));

    renderProfileUI();
    closeModal('personalModal');
    alert("Personal information updated successfully.");
        });

        document.getElementById('settingsBankForm').addEventListener('submit', (e) => {
        e.preventDefault();
    const bankName = document.getElementById('settingsBankSelect').value;
    const accNum = document.getElementById('settingsAccNumber').value.trim();
    const accName = document.getElementById('settingsAccName').value.trim();

    if (!bankName || accNum.length !== 10 || isNaN(accNum) || !accName) {
        alert("Please select a bank and enter a valid 10-digit account number and holder name.");
    return;
            }

    const walletData = JSON.parse(localStorage.getItem('rexora_wallet_data') || '{"taskUSD":0,"affiliateUSD":0,"currency":"USD","rate":1000,"ledger":[]}');
    walletData.bank = {bankName, accountNumber: accNum, accountName: accName };
    localStorage.setItem('rexora_wallet_data', JSON.stringify(walletData));

    renderProfileUI();
    closeModal('bankModal');
    alert("Bank account details saved for cashouts.");
        });

        document.getElementById('securityForm').addEventListener('submit', (e) => {
        e.preventDefault();
    const curPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const pin = document.getElementById('withdrawalPin').value.trim();

    if (!curPass || newPass.length < 6) {
        alert("Please enter your current password and a new password of at least 6 characters.");
    return;
            }

    if (pin && (pin.length !== 4 || isNaN(pin))) {
        alert("Transaction PIN must be exactly 4 numeric digits.");
    return;
            }

    if (pin) {
        userProfile.withdrawalPin = pin;
    localStorage.setItem('rexora_user', JSON.stringify(userProfile));
            }

    document.getElementById('securityForm').reset();
    closeModal('securityModal');
    alert("Security credentials updated successfully.");
        });

    // 5. Logout Handler
    function handleLogout() {
            if (confirm('Are you sure you want to log out of REXORA?')) {
        window.location.href = '../auth/login.html';
            }
        }
