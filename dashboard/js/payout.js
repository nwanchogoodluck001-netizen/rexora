
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

        // 2. State Management (Strictly 00.00 Default - No Demo Balance)
        let currentMode = 'affiliate'; // 'affiliate' | 'tasks'
        let currentCurrency = 'USD';    // 'USD' | 'NGN'
        const rate = 1000;
        let activeReceipt = null;

        function getStoredPayoutData() {
            const stored = localStorage.getItem('rexora_payout_history');
            if (stored) {
                try { return JSON.parse(stored); } catch (e) { console.error(e); }
            }
            return [];
        }

        function getTaskBalance() {
            const wallet = localStorage.getItem('rexora_wallet_data');
            if (wallet) {
                try { return JSON.parse(wallet).taskUSD || 0.00; } catch (e) { }
            }
            return 0.00;
        }

        function getAffiliateBalance() {
            const aff = localStorage.getItem('rexora_affiliate_data');
            if (aff) {
                try { return JSON.parse(aff).totalUSD || 0.00; } catch (e) { }
            }
            return 0.00;
        }

        const payoutHistory = getStoredPayoutData();

        function savePayoutHistory() {
            localStorage.setItem('rexora_payout_history', JSON.stringify(payoutHistory));
        }

        // Prefill saved bank details if configured in Wallet or Settings
        function prefillSavedBank() {
            const wallet = JSON.parse(localStorage.getItem('rexora_wallet_data') || '{}');
            if (wallet.bank) {
                if (wallet.bank.bankName) document.getElementById('bankSelect').value = wallet.bank.bankName;
                if (wallet.bank.accountNumber) document.getElementById('accNumberInput').value = wallet.bank.accountNumber;
                if (wallet.bank.accountName) document.getElementById('accNameInput').value = wallet.bank.accountName;
            }
        }
        prefillSavedBank();

        // 3. Render Cards & Mode Switcher
        function renderBalances() {
            const taskUSD = getTaskBalance();
            const affUSD = getAffiliateBalance();

            const taskKpi = document.getElementById('taskBalanceKpi');
            const taskSub = document.getElementById('taskBalanceSub');
            const affKpi = document.getElementById('affiliateBalanceKpi');
            const affSub = document.getElementById('affiliateBalanceSub');
            const curLabel = document.getElementById('payoutCurLabel');

            if (currentCurrency === 'USD') {
                curLabel.textContent = "USD ($)";
                taskKpi.textContent = `$${taskUSD.toFixed(2)}`;
                taskSub.textContent = `≈ ₦${(taskUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })} (Approved & Withdrawable)`;
                affKpi.textContent = `$${affUSD.toFixed(2)}`;
                affSub.textContent = `≈ ₦${(affUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })} (Weekend Automated Window)`;
            } else {
                curLabel.textContent = "NGN (₦)";
                taskKpi.textContent = `₦${(taskUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                taskSub.textContent = `≈ $${taskUSD.toFixed(2)} USD (Approved & Withdrawable)`;
                affKpi.textContent = `₦${(affUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                affSub.textContent = `≈ $${affUSD.toFixed(2)} USD (Weekend Automated Window)`;
            }

            renderFormMode();
            renderHistoryTable();
        }

        function togglePayoutCurrency() {
            currentCurrency = currentCurrency === 'USD' ? 'NGN' : 'USD';
            document.getElementById('amountCurSymbol').textContent = currentCurrency === 'USD' ? '$' : '₦';
            renderBalances();
        }

        // 4. Tab Mode Switcher Logic
        function setPayoutMode(mode) {
            currentMode = mode;
            const tabAff = document.getElementById('tabAffiliate');
            const tabTsk = document.getElementById('tabTasks');

            if (mode === 'affiliate') {
                tabAff.className = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md shadow-brand-500/20";
                tabTsk.className = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-600 dark:text-slate-300 hover:text-brand-500";
            } else {
                tabTsk.className = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-brand-500 text-white shadow-md shadow-brand-500/20";
                tabAff.className = "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-600 dark:text-slate-300 hover:text-brand-500";
            }

            clearErrors();
            renderFormMode();
        }

        function renderFormMode() {
            const formTitle = document.getElementById('formHeaderTitle');
            const formSubtitle = document.getElementById('formHeaderSubtitle');
            const balLabel = document.getElementById('activeBalanceLabel');
            const balDisplay = document.getElementById('formBalanceDisplay');
            const minAmount = document.getElementById('minAmountLabel');
            const submitBtn = document.getElementById('btnCashOutSubmit');
            const rulesTitle = document.getElementById('rulesCardTitle');
            const rulesBody = document.getElementById('rulesCardBody');
            const availHelper = document.getElementById('availHelperText');

            const isAff = currentMode === 'affiliate';
            const balUSD = isAff ? getAffiliateBalance() : getTaskBalance();
            const balFormatted = currentCurrency === 'USD'
                ? `$${balUSD.toFixed(2)}`
                : `₦${(balUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

            if (isAff) {
                formTitle.textContent = "Affiliate Cash Out";
                formSubtitle.textContent = "Withdraw referral rewards and friend commission cuts.";
                balLabel.textContent = "Affiliate Balance";
                balDisplay.textContent = balFormatted;
                minAmount.textContent = "$2.00 (₦2,000.00)";
                submitBtn.textContent = "Cash Out Affiliate Funds";
                rulesTitle.innerHTML = `<span>🛡️</span> Affiliate Payout Rules`;
                rulesBody.innerHTML = `
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
            <span>Minimum cash out is $2.00 / ₦2,000.00.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
            <span>Affiliate commissions process automatically every weekend (Friday – Sunday).</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
            <span>Direct 50% split per paid Starter (₦750) and Pro (₦1,500) invitation.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
            <span>Bank settlements arrive within 15 to 45 minutes after automated review.</span>
          </div>
        `;
                availHelper.textContent = `Available to withdraw: ${balFormatted}`;
            } else {
                formTitle.textContent = "Non-Affiliate (Tasks) Cash Out";
                formSubtitle.textContent = "Withdraw earnings from Remote Jobs, Social Tasks, and Streaks.";
                balLabel.textContent = "Task Balance";
                balDisplay.textContent = balFormatted;
                minAmount.textContent = "$5.00 (₦5,000.00)";
                submitBtn.textContent = "Cash Out Task Earnings";
                rulesTitle.innerHTML = `<span>⚡</span> Task Payout Rules`;
                rulesBody.innerHTML = `
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>Minimum task withdrawal threshold is $5.00 / ₦5,000.00.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>All submitted task deliverables and proofs must pass client verification.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>Fast automated bank processing directly into your verified Nigerian account.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>Zero gas fees or processing deductions upon settlement.</span>
          </div>
        `;
                availHelper.textContent = `Available to withdraw: ${balFormatted}`;
            }
        }

        function setCashOutMax() {
            const isAff = currentMode === 'affiliate';
            const balUSD = isAff ? getAffiliateBalance() : getTaskBalance();
            const val = currentCurrency === 'USD' ? balUSD : balUSD * rate;
            document.getElementById('cashOutAmountInput').value = val.toFixed(2);
        }

        // 5. Form Validation & Submission
        function clearErrors() {
            ['bank', 'acc', 'name', 'amount'].forEach(id => {
                const el = document.getElementById(`err-${id}`);
                if (el) el.classList.add('hidden');
            });
        }

        document.getElementById('cashOutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const bank = document.getElementById('bankSelect').value;
            const acc = document.getElementById('accNumberInput').value.trim();
            const name = document.getElementById('accNameInput').value.trim();
            const amountRaw = parseFloat(document.getElementById('cashOutAmountInput').value);

            let hasError = false;

            if (!bank) {
                document.getElementById('err-bank').textContent = "Please select a destination bank.";
                document.getElementById('err-bank').classList.remove('hidden');
                hasError = true;
            }

            if (acc.length !== 10 || isNaN(acc)) {
                document.getElementById('err-acc').textContent = "Please enter a valid 10-digit NUBAN account number.";
                document.getElementById('err-acc').classList.remove('hidden');
                hasError = true;
            }

            if (!name) {
                document.getElementById('err-name').textContent = "Please provide the account holder full name.";
                document.getElementById('err-name').classList.remove('hidden');
                hasError = true;
            }

            const isAff = currentMode === 'affiliate';
            const balUSD = isAff ? getAffiliateBalance() : getTaskBalance();
            const minThreshold = isAff ? (currentCurrency === 'USD' ? 2.00 : 2000) : (currentCurrency === 'USD' ? 5.00 : 5000);
            const userBal = currentCurrency === 'USD' ? balUSD : balUSD * rate;

            if (isNaN(amountRaw) || amountRaw <= 0) {
                document.getElementById('err-amount').textContent = "Please enter a valid withdrawal amount.";
                document.getElementById('err-amount').classList.remove('hidden');
                hasError = true;
            } else if (amountRaw < minThreshold) {
                document.getElementById('err-amount').textContent = `Amount must meet the minimum threshold (${currentCurrency === 'USD' ? '$' : '₦'}${minThreshold.toFixed(2)}).`;
                document.getElementById('err-amount').classList.remove('hidden');
                hasError = true;
            } else if (amountRaw > userBal) {
                document.getElementById('err-amount').textContent = "Insufficient funds in your selected balance.";
                document.getElementById('err-amount').classList.remove('hidden');
                hasError = true;
            }

            if (hasError) return;

            const submitBtn = document.getElementById('btnCashOutSubmit');
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing Cash Out...";

            setTimeout(() => {
                const amountUSD = currentCurrency === 'USD' ? amountRaw : amountRaw / rate;

                if (isAff) {
                    const affData = JSON.parse(localStorage.getItem('rexora_affiliate_data') || '{}');
                    affData.totalUSD = Math.max(0, (affData.totalUSD || 0) - amountUSD);
                    localStorage.setItem('rexora_affiliate_data', JSON.stringify(affData));
                } else {
                    const walletData = JSON.parse(localStorage.getItem('rexora_wallet_data') || '{}');
                    walletData.taskUSD = Math.max(0, (walletData.taskUSD || 0) - amountUSD);
                    localStorage.setItem('rexora_wallet_data', JSON.stringify(walletData));
                }

                const refId = `REX-WD-${Math.floor(1000 + Math.random() * 9000)}`;
                const nowStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                const newRecord = {
                    refId: refId,
                    date: nowStr,
                    type: isAff ? 'Affiliate 50%' : 'Tasks & Jobs',
                    beneficiary: name,
                    bank: `${bank} (••••${acc.slice(-4)})`,
                    amountUSD: amountUSD,
                    status: 'Disbursed'
                };

                payoutHistory.unshift(newRecord);
                savePayoutHistory();

                submitBtn.disabled = false;
                document.getElementById('cashOutForm').reset();
                prefillSavedBank();
                renderBalances();

                // Automatically open the generated receipt for the user
                openReceiptModal(0);
            }, 900);
        });

        // 6. Render Payout History Table
        function renderHistoryTable() {
            const emptyView = document.getElementById('emptyPayoutView');
            const tableWrapper = document.getElementById('payoutTableWrapper');
            const tableBody = document.getElementById('payoutTableBody');

            if (payoutHistory.length === 0) {
                emptyView.classList.remove('hidden');
                tableWrapper.classList.add('hidden');
                tableBody.innerHTML = '';
                return;
            }

            emptyView.classList.add('hidden');
            tableWrapper.classList.remove('hidden');
            tableBody.innerHTML = '';

            payoutHistory.forEach((record, index) => {
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-50/80 dark:hover:bg-darkblue-850/60 cursor-pointer transition-colors";
                row.onclick = () => openReceiptModal(index);

                const amountDisplay = currentCurrency === 'USD'
                    ? `$${record.amountUSD.toFixed(2)}`
                    : `₦${(record.amountUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

                row.innerHTML = `
          <td class="py-3 px-2">
            <span class="font-black text-slate-900 dark:text-white block">${record.refId}</span>
            <span class="text-[10px] text-slate-400 font-bold">${record.date}</span>
          </td>
          <td class="py-3 px-2">
            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase ${record.type.includes('Affiliate') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'}">
              ${record.type}
            </span>
          </td>
          <td class="py-3 px-2 text-slate-700 dark:text-slate-300 font-bold">${record.bank}</td>
          <td class="py-3 px-2 font-black text-slate-900 dark:text-white">${amountDisplay}</td>
          <td class="py-3 px-2">
            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              ${record.status}
            </span>
          </td>
          <td class="py-3 px-2 text-right">
            <span class="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-darkblue-800 text-brand-600 dark:text-brand-400 font-black text-[10px] uppercase">
              Receipt
            </span>
          </td>
        `;
                tableBody.appendChild(row);
            });
        }

        // 7. Digital Receipt Modal & Canvas PNG Generator
        function openReceiptModal(index) {
            const record = payoutHistory[index];
            if (!record) return;
            activeReceipt = record;

            const ngnVal = (record.amountUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });

            document.getElementById('recHeroUsd').textContent = `$${record.amountUSD.toFixed(2)}`;
            document.getElementById('recHeroNgn').textContent = `₦${ngnVal} NGN`;
            document.getElementById('recRefId').textContent = record.refId;
            document.getElementById('recType').textContent = record.type;
            document.getElementById('recBeneficiary').textContent = record.beneficiary || 'Guzy';
            document.getElementById('recBank').textContent = record.bank;
            document.getElementById('recDate').textContent = record.date;

            document.getElementById('receiptModal').classList.remove('hidden');
        }

        function closeReceiptModal() {
            document.getElementById('receiptModal').classList.add('hidden');
        }

        function copyReceiptText() {
            if (!activeReceipt) return;
            const ngnVal = (activeReceipt.amountUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
            const text =
                `✅ REXORA OFFICIAL PAYOUT RECEIPT\n` +
                `• Ref ID: ${activeReceipt.refId}\n` +
                `• Amount: $${activeReceipt.amountUSD.toFixed(2)} (₦${ngnVal})\n` +
                `• Stream: ${activeReceipt.type}\n` +
                `• Bank: ${activeReceipt.bank}\n` +
                `• Status: ${activeReceipt.status}\n` +
                `• Date: ${activeReceipt.date}`;

            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('copyReceiptTextBtn');
                btn.innerHTML = '<span>✓</span> Copied!';
                setTimeout(() => {
                    btn.innerHTML = '<span>📋</span> Copy Proof';
                }, 2000);
            });
        }

        function downloadReceiptPNG() {
            if (!activeReceipt) return;
            const canvas = document.createElement('canvas');
            canvas.width = 720;
            canvas.height = 880;
            const ctx = canvas.getContext('2d');

            // Background Midnight Navy Card
            ctx.fillStyle = '#071626';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Inner Panel
            ctx.fillStyle = '#0B192C';
            ctx.strokeStyle = '#1E354F';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(40, 40, 640, 800, 32);
            ctx.fill();
            ctx.stroke();

            // Header Brand
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '900 34px sans-serif';
            ctx.fillText('REX', 80, 115);
            ctx.fillStyle = '#0EA5E9';
            ctx.fillText('ORA', 152, 115);

            ctx.fillStyle = '#94A3B8';
            ctx.font = '800 15px sans-serif';
            ctx.fillText('OFFICIAL SETTLEMENT RECEIPT', 80, 145);

            // Status Pill
            ctx.fillStyle = '#064E3B';
            ctx.beginPath();
            ctx.roundRect(485, 92, 155, 38, 19);
            ctx.fill();
            ctx.fillStyle = '#34D399';
            ctx.font = '900 15px sans-serif';
            ctx.fillText('✓ DISBURSED', 508, 117);

            // Divider
            ctx.strokeStyle = '#1E354F';
            ctx.beginPath();
            ctx.moveTo(80, 180);
            ctx.lineTo(640, 180);
            ctx.stroke();

            // Hero Amount
            const ngnVal = (activeReceipt.amountUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
            ctx.fillStyle = '#94A3B8';
            ctx.font = '800 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('SETTLEMENT AMOUNT', 360, 235);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '900 56px sans-serif';
            ctx.fillText(`$${activeReceipt.amountUSD.toFixed(2)}`, 360, 300);

            ctx.fillStyle = '#34D399';
            ctx.font = '800 24px sans-serif';
            ctx.fillText(`₦${ngnVal} NGN`, 360, 340);

            // Rows
            ctx.textAlign = 'left';
            const rows = [
                ['Reference ID', activeReceipt.refId],
                ['Settlement Rail', activeReceipt.type],
                ['Beneficiary', activeReceipt.beneficiary || 'Guzy'],
                ['Destination Bank', activeReceipt.bank],
                ['Applied Rate', '$1.00 = ₦1,000.00'],
                ['Timestamp', activeReceipt.date]
            ];

            let y = 430;
            rows.forEach(([label, val]) => {
                ctx.fillStyle = '#94A3B8';
                ctx.font = '700 18px sans-serif';
                ctx.fillText(label, 80, y);

                ctx.fillStyle = '#F8FAFC';
                ctx.font = '900 18px sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(String(val), 640, y);
                ctx.textAlign = 'left';
                y += 58;
            });

            // Footer
            ctx.fillStyle = '#38BDF8';
            ctx.font = '800 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Verified by REXORA Automated Escrow • rexora.com', 360, 800);

            const link = document.createElement('a');
            link.download = `${activeReceipt.refId}-Receipt.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }

        // 8. Logout Helper
        function handleLogout() {
            if (confirm('Are you sure you want to sign out of REXORA?')) {
                window.location.href = '../auth/login.html';
            }
        }

        renderBalances();
