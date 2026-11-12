
        const STORAGE_KEY = 'rexora_admin_state';

        function getDefaultState() {
            return {
                config: {
                    siteRate: 1000,
                    starterNgn: 1500,
                    starterUsd: 2.00,
                    proNgn: 3000,
                    proUsd: 3.00,
                    apiPublicKey: '',
                    apiSecretKey: '',
                    apiStatus: 'enabled',
                    directLinkUrl: 'https://afrixapay.com/pay/rexora-activation',
                    directLinkStatus: 'enabled',
                    manualBankName: 'Wema Bank',
                    manualAccName: 'REXORA GLOBAL TECH',
                    manualAccNum: '0294810293',
                    manualBankStatus: 'enabled'
                },
                adminAuth: {
                    displayName: 'REXORA Super Admin',
                    email: 'admin@rexora.com',
                    username: '@admin',
                    password: 'admin1234',
                    pin: '1234'
                },
                remoteJobs: [],
                socialGlobalRate: 0.00,
                socialTasks: [],
                socialSubmissions: [],
                surveys: [],
                articles: [],
                users: []
            };
        }

        let adminState = (() => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) return Object.assign(getDefaultState(), JSON.parse(saved));
            } catch (e) { }
            return getDefaultState();
        })();

        function persistState(msg) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(adminState));
            if (msg) showToast(msg);
            renderAll();
        }

        function showToast(text) {
            const t = document.getElementById('adminToast');
            t.textContent = text;
            t.classList.remove('hidden');
            clearTimeout(window._toastTimer);
            window._toastTimer = setTimeout(() => t.classList.add('hidden'), 3000);
        }

        // Navigation & Drawer
        function toggleMobileDrawer() {
            document.getElementById('mobileDrawer').classList.toggle('hidden');
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
            const activeSec = document.getElementById(`tab-${tabId}`);
            if (activeSec) activeSec.classList.remove('hidden');

            document.querySelectorAll('.nav-btn').forEach(btn => {
                if (btn.dataset.tab === tabId) {
                    btn.className = 'nav-btn w-full text-left px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider bg-black text-white';
                    document.getElementById('headerSectionTitle').textContent = btn.textContent.replace(/^\d+\.\s*/, '');
                } else {
                    btn.className = 'nav-btn w-full text-left px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-zinc-700 hover:bg-zinc-100';
                }
            });
        }

        // Populate Form Inputs from Saved State
        function hydrateInputs() {
            const c = adminState.config;
            document.getElementById('cfgSiteRate').value = c.siteRate;
            document.getElementById('cfgStarterNgn').value = c.starterNgn;
            document.getElementById('cfgStarterUsd').value = c.starterUsd;
            document.getElementById('cfgProNgn').value = c.proNgn;
            document.getElementById('cfgProUsd').value = c.proUsd;
            document.getElementById('cfgApiPublicKey').value = c.apiPublicKey;
            document.getElementById('cfgApiSecretKey').value = c.apiSecretKey;
            document.getElementById('cfgApiStatus').value = c.apiStatus;
            document.getElementById('cfgDirectLinkUrl').value = c.directLinkUrl;
            document.getElementById('cfgDirectLinkStatus').value = c.directLinkStatus;
            document.getElementById('cfgManualBankName').value = c.manualBankName;
            document.getElementById('cfgManualAccName').value = c.manualAccName;
            document.getElementById('cfgManualAccNum').value = c.manualAccNum;
            document.getElementById('cfgManualBankStatus').value = c.manualBankStatus;

            document.getElementById('seGlobalRateInput').value = adminState.socialGlobalRate;
            document.getElementById('admDisplayName').value = adminState.adminAuth.displayName;
            document.getElementById('admEmail').value = adminState.adminAuth.email;
            document.getElementById('admUsername').value = adminState.adminAuth.username;
            document.getElementById('headerAdminName').textContent = adminState.adminAuth.displayName;
            document.getElementById('headerRateBadge').textContent = `Rate: $1 = ₦${Number(c.siteRate).toLocaleString()}`;
        }

        // Tab 1: Save Gateways & Rate
        document.getElementById('gatewaySettingsForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.config = {
                siteRate: parseFloat(document.getElementById('cfgSiteRate').value) || 1000,
                starterNgn: parseFloat(document.getElementById('cfgStarterNgn').value) || 1500,
                starterUsd: parseFloat(document.getElementById('cfgStarterUsd').value) || 2.00,
                proNgn: parseFloat(document.getElementById('cfgProNgn').value) || 3000,
                proUsd: parseFloat(document.getElementById('cfgProUsd').value) || 3.00,
                apiPublicKey: document.getElementById('cfgApiPublicKey').value.trim(),
                apiSecretKey: document.getElementById('cfgApiSecretKey').value.trim(),
                apiStatus: document.getElementById('cfgApiStatus').value,
                directLinkUrl: document.getElementById('cfgDirectLinkUrl').value.trim(),
                directLinkStatus: document.getElementById('cfgDirectLinkStatus').value,
                manualBankName: document.getElementById('cfgManualBankName').value.trim(),
                manualAccName: document.getElementById('cfgManualAccName').value.trim(),
                manualAccNum: document.getElementById('cfgManualAccNum').value.trim(),
                manualBankStatus: document.getElementById('cfgManualBankStatus').value
            };
            persistState('Gateway and site rate settings saved.');
        });

        // Tab 2: Remote Jobs
        document.getElementById('remoteJobForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.remoteJobs.unshift({
                id: Date.now(),
                client: document.getElementById('rjClient').value.trim(),
                category: document.getElementById('rjCategory').value,
                reward: parseFloat(document.getElementById('rjReward').value) || 0,
                window: document.getElementById('rjWindow').value.trim(),
                title: document.getElementById('rjTitle').value.trim(),
                instructions: document.getElementById('rjInstructions').value.trim()
            });
            e.target.reset();
            persistState('Remote job published to marketplace.');
        });

        function deleteRemoteJob(id) {
            adminState.remoteJobs = adminState.remoteJobs.filter(j => j.id !== id);
            persistState('Remote job removed.');
        }

        // Tab 3: Social Engagement
        function saveSocialGlobalRate() {
            adminState.socialGlobalRate = parseFloat(document.getElementById('seGlobalRateInput').value) || 0;
            persistState('Global social task reward updated.');
        }

        document.getElementById('socialTaskForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.socialTasks.unshift({
                id: Date.now(),
                title: document.getElementById('seTitle').value.trim(),
                platform: document.getElementById('sePlatform').value,
                reward: parseFloat(document.getElementById('seReward').value) || 0,
                limit: parseInt(document.getElementById('seLimit').value, 10) || 100,
                status: document.getElementById('seStatus').value,
                url: document.getElementById('seUrl').value.trim(),
                instructions: document.getElementById('seInstructions').value.trim()
            });
            e.target.reset();
            persistState('Social engagement task added.');
        });

        function deleteSocialTask(id) {
            adminState.socialTasks = adminState.socialTasks.filter(t => t.id !== id);
            persistState('Social task deleted.');
        }

        function approveAllSocialSubmissions() {
            if (adminState.socialSubmissions.length === 0) {
                showToast('No pending submissions to approve.');
                return;
            }
            adminState.socialSubmissions.forEach(s => s.status = 'Approved');
            persistState('All pending social proofs approved.');
        }

        // Tab 4: Surveys
        document.getElementById('surveyForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.surveys.unshift({
                id: Date.now(),
                title: document.getElementById('svTitle').value.trim(),
                category: document.getElementById('svCategory').value,
                sponsor: document.getElementById('svSponsor').value.trim(),
                reward: parseFloat(document.getElementById('svReward').value) || 0,
                tier: document.getElementById('svTier').value,
                status: 'Live'
            });
            e.target.reset();
            persistState('Survey published live.');
        });

        function toggleSurveyStatus(id) {
            const item = adminState.surveys.find(s => s.id === id);
            if (item) {
                item.status = item.status === 'Live' ? 'Paused' : 'Live';
                persistState(`Survey status set to ${item.status}.`);
            }
        }

        function deleteSurvey(id) {
            adminState.surveys = adminState.surveys.filter(s => s.id !== id);
            persistState('Survey deleted.');
        }

        // Tab 5: Streaks
        document.getElementById('streaksForm').addEventListener('submit', e => {
            e.preventDefault();
            const total =
                (parseFloat(document.getElementById('stWin1Usd').value) || 0) +
                (parseFloat(document.getElementById('stWin2Usd').value) || 0) +
                (parseFloat(document.getElementById('stWin3Usd').value) || 0);
            document.getElementById('stVaultPoolKpi').textContent = `$${total.toFixed(2)}`;
            document.getElementById('stReqRefKpi').textContent = `${document.getElementById('stRequiredRefs').value || 2} Ref`;
            showToast('Daily Streak rules and drop windows updated.');
        });

        // Tab 6: Read to Earn
        document.getElementById('readArticleForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.articles.unshift({
                id: Date.now(),
                title: document.getElementById('rdTitle').value.trim(),
                category: document.getElementById('rdCategory').value,
                starterUsd: parseFloat(document.getElementById('rdStarterUsd').value) || 0,
                proUsd: parseFloat(document.getElementById('rdProUsd').value) || 0
            });
            e.target.reset();
            persistState('Editorial briefing published live.');
        });

        function deleteArticle(id) {
            adminState.articles = adminState.articles.filter(a => a.id !== id);
            persistState('Briefing removed.');
        }

        // Tab 7 & 9: Referrals & Support
        document.getElementById('referralConfigForm').addEventListener('submit', e => {
            e.preventDefault();
            showToast('Affiliate commission splits and milestone quests saved.');
        });

        document.getElementById('supportConfigForm').addEventListener('submit', e => {
            e.preventDefault();
            showToast('Telegram routing links updated.');
        });

        // Tab 8: Withdrawals Sync with User Payout History
        function getWithdrawalQueue() {
            try {
                return JSON.parse(localStorage.getItem('rexora_payout_history') || '[]');
            } catch (e) { return []; }
        }

        function disburseWithdrawal(index) {
            const list = getWithdrawalQueue();
            if (list[index]) {
                list[index].status = 'Disbursed';
                localStorage.setItem('rexora_payout_history', JSON.stringify(list));
                persistState('Payout marked as Disbursed.');
            }
        }

        function approveAllWithdrawals() {
            const list = getWithdrawalQueue();
            if (list.length === 0) {
                showToast('No withdrawal requests in queue.');
                return;
            }
            list.forEach(r => r.status = 'Disbursed');
            localStorage.setItem('rexora_payout_history', JSON.stringify(list));
            persistState('All queued withdrawals marked as Disbursed.');
        }

        // Tab 10: Users Management
        function openAddUserModal(idx = -1) {
            document.getElementById('editUserIdx').value = idx;
            if (idx >= 0 && adminState.users[idx]) {
                const u = adminState.users[idx];
                document.getElementById('usrName').value = u.name;
                document.getElementById('usrHandle').value = u.handle;
                document.getElementById('usrEmail').value = u.email;
                document.getElementById('usrPlan').value = u.plan;
                document.getElementById('usrBalance').value = u.balanceUSD;
            } else {
                document.getElementById('userEditForm').reset();
            }
            document.getElementById('userModal').classList.remove('hidden');
        }

        function closeUserModal() {
            document.getElementById('userModal').classList.add('hidden');
        }

        document.getElementById('userEditForm').addEventListener('submit', e => {
            e.preventDefault();
            const idx = parseInt(document.getElementById('editUserIdx').value, 10);
            const userObj = {
                id: idx >= 0 ? adminState.users[idx].id : `RX-${Math.floor(1000 + Math.random() * 9000)}`,
                name: document.getElementById('usrName').value.trim(),
                handle: document.getElementById('usrHandle').value.trim(),
                email: document.getElementById('usrEmail').value.trim(),
                plan: document.getElementById('usrPlan').value,
                balanceUSD: parseFloat(document.getElementById('usrBalance').value) || 0
            };
            if (idx >= 0) adminState.users[idx] = userObj;
            else adminState.users.unshift(userObj);

            closeUserModal();
            persistState('Member account updated.');
        });

        // Tab 11: Settings & Security
        document.getElementById('adminProfileForm').addEventListener('submit', e => {
            e.preventDefault();
            adminState.adminAuth.displayName = document.getElementById('admDisplayName').value.trim();
            adminState.adminAuth.email = document.getElementById('admEmail').value.trim();
            adminState.adminAuth.username = document.getElementById('admUsername').value.trim();
            persistState('Admin profile updated.');
        });

        document.getElementById('adminSecurityForm').addEventListener('submit', e => {
            e.preventDefault();
            const cur = document.getElementById('admCurPass').value;
            const next = document.getElementById('admNewPass').value;
            const conf = document.getElementById('admConfirmPass').value;
            const pin = document.getElementById('admMasterPin').value.trim();

            if (cur !== adminState.adminAuth.password) {
                showToast('Error: Current password does not match.');
                return;
            }
            if (next.length < 8) {
                showToast('Error: New password must be at least 8 characters.');
                return;
            }
            if (next !== conf) {
                showToast('Error: New passwords do not match.');
                return;
            }
            adminState.adminAuth.password = next;
            if (pin.length === 4 && !isNaN(pin)) {
                adminState.adminAuth.pin = pin;
            }
            e.target.reset();
            persistState('Admin password and security PIN updated.');
        });

        function exportPlatformBackup() {
            const blob = new Blob([JSON.stringify(adminState, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `REXORA-Admin-Backup-${Date.now()}.json`;
            a.click();
        }

        function resetAllLogsToZero() {
            if (!confirm('Reset all test logs, users, tasks, and balances back to zero?')) return;
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem('rexora_payout_history');
            localStorage.removeItem('rexora_wallet_data');
            localStorage.removeItem('rexora_affiliate_data');
            localStorage.removeItem('rexora_remote_earnings');
            adminState = getDefaultState();
            persistState('All platform logs reset to zero.');
        }

        function adminLogout() {
            if (confirm('Sign out of REXORA Admin Control Panel?')) {
                window.location.href = '../auth/login.html';
            }
        }

        // Master Render Engine
        function renderAll() {
            hydrateInputs();

            // Overview KPIs
            const rate = adminState.config.siteRate || 1000;
            const starterCount = adminState.users.filter(u => u.plan === 'starter').length;
            const proCount = adminState.users.filter(u => u.plan === 'pro').length;
            const planRevUsd = (starterCount * adminState.config.starterUsd) + (proCount * adminState.config.proUsd);

            const withdrawals = getWithdrawalQueue();
            const disbursedUsd = withdrawals
                .filter(w => w.status === 'Disbursed')
                .reduce((sum, w) => sum + (parseFloat(w.amountUSD) || 0), 0);

            document.getElementById('kpiTotalUsers').textContent = adminState.users.length;
            document.getElementById('kpiStarterUsers').textContent = starterCount;
            document.getElementById('kpiProUsers').textContent = proCount;
            document.getElementById('kpiPlanRevenue').textContent = `$${planRevUsd.toFixed(2)}`;
            document.getElementById('kpiPlanRevenueSub').textContent = `₦${(planRevUsd * rate).toLocaleString()} NGN Equivalent`;
            document.getElementById('kpiTotalPaidOut').textContent = `$${disbursedUsd.toFixed(2)}`;
            document.getElementById('kpiTotalPaidOutSub').textContent = `₦${(disbursedUsd * rate).toLocaleString()} Disbursed to banks`;

            // Remote Jobs KPIs & Table
            const rjBudget = adminState.remoteJobs.reduce((sum, j) => sum + j.reward, 0);
            document.getElementById('rjTotalTasks').textContent = adminState.remoteJobs.length;
            document.getElementById('rjContractBudget').textContent = `$${rjBudget.toFixed(2)}`;
            const rjBody = document.getElementById('rjTableBody');
            rjBody.innerHTML = adminState.remoteJobs.length === 0
                ? `<tr><td colspan="5" class="py-8 text-center text-zinc-400">No remote jobs published yet.</td></tr>`
                : adminState.remoteJobs.map(j => `
            <tr>
              <td class="py-3 px-2"><div class="font-black text-black">${j.title}</div><div class="text-[10px] text-zinc-500">${j.client}</div></td>
              <td class="py-3 px-2">${j.category}</td>
              <td class="py-3 px-2 font-black">$${j.reward.toFixed(2)}</td>
              <td class="py-3 px-2">${j.window}</td>
              <td class="py-3 px-2 text-right"><button onclick="deleteRemoteJob(${j.id})" class="px-2.5 py-1 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white">Delete</button></td>
            </tr>
          `).join('');

            // Social Engagement KPIs & Tables
            document.getElementById('seGlobalRewardKpi').textContent = `$${Number(adminState.socialGlobalRate).toFixed(2)}`;
            document.getElementById('sePendingProofsKpi').textContent = adminState.socialSubmissions.filter(s => s.status !== 'Approved').length;
            document.getElementById('seActiveTasksKpi').textContent = adminState.socialTasks.filter(t => t.status === 'Active').length;

            const seTasksBody = document.getElementById('seTasksBody');
            seTasksBody.innerHTML = adminState.socialTasks.length === 0
                ? `<tr><td colspan="5" class="py-8 text-center text-zinc-400">No social engagement tasks added yet.</td></tr>`
                : adminState.socialTasks.map(t => `
            <tr>
              <td class="py-3 px-2"><div class="font-black text-black">${t.title}</div><div class="text-[10px] text-zinc-500">${t.platform}</div></td>
              <td class="py-3 px-2 font-black">$${t.reward.toFixed(2)}</td>
              <td class="py-3 px-2">${t.limit}</td>
              <td class="py-3 px-2 uppercase text-[10px]">${t.status}</td>
              <td class="py-3 px-2 text-right"><button onclick="deleteSocialTask(${t.id})" class="px-2.5 py-1 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white">Delete</button></td>
            </tr>
          `).join('');

            // Surveys Table
            document.getElementById('svLiveKpi').textContent = adminState.surveys.filter(s => s.status === 'Live').length;
            const svBody = document.getElementById('svTableBody');
            svBody.innerHTML = adminState.surveys.length === 0
                ? `<tr><td colspan="6" class="py-8 text-center text-zinc-400">No active surveys configured.</td></tr>`
                : adminState.surveys.map(s => `
            <tr>
              <td class="py-3 px-2"><div class="font-black text-black">${s.title}</div><div class="text-[10px] text-zinc-500">${s.sponsor}</div></td>
              <td class="py-3 px-2">${s.category}</td>
              <td class="py-3 px-2">${s.tier}</td>
              <td class="py-3 px-2 font-black">$${s.reward.toFixed(2)}</td>
              <td class="py-3 px-2 uppercase text-[10px]">${s.status}</td>
              <td class="py-3 px-2 text-right space-x-1">
                <button onclick="toggleSurveyStatus(${s.id})" class="px-2 py-1 border border-zinc-400 text-[10px] font-black uppercase">${s.status === 'Live' ? 'Pause' : 'Resume'}</button>
                <button onclick="deleteSurvey(${s.id})" class="px-2 py-1 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white">Delete</button>
              </td>
            </tr>
          `).join('');

            // Articles Table
            document.getElementById('rdArticlesKpi').textContent = adminState.articles.length;
            const rdBody = document.getElementById('rdTableBody');
            rdBody.innerHTML = adminState.articles.length === 0
                ? `<tr><td colspan="4" class="py-8 text-center text-zinc-400">No editorial briefings published yet.</td></tr>`
                : adminState.articles.map(a => `
            <tr>
              <td class="py-3 px-2 font-black text-black">${a.title}</td>
              <td class="py-3 px-2">${a.category}</td>
              <td class="py-3 px-2">$${a.starterUsd.toFixed(2)} / $${a.proUsd.toFixed(2)}</td>
              <td class="py-3 px-2 text-right"><button onclick="deleteArticle(${a.id})" class="px-2.5 py-1 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white">Delete</button></td>
            </tr>
          `).join('');

            // Withdrawals Table
            document.getElementById('wdPendingKpi').textContent = withdrawals.filter(w => w.status !== 'Disbursed').length;
            document.getElementById('wdSettledKpi').textContent = `$${disbursedUsd.toFixed(2)}`;
            const wdBody = document.getElementById('wdTableBody');
            wdBody.innerHTML = withdrawals.length === 0
                ? `<tr><td colspan="6" class="py-8 text-center text-zinc-400">No withdrawal requests in queue.</td></tr>`
                : withdrawals.map((w, i) => `
            <tr>
              <td class="py-3 px-2"><div class="font-black text-black">${w.refId}</div><div class="text-[10px] text-zinc-500">${w.date}</div></td>
              <td class="py-3 px-2">${w.type}</td>
              <td class="py-3 px-2">${w.bank}</td>
              <td class="py-3 px-2 font-black">$${Number(w.amountUSD).toFixed(2)}</td>
              <td class="py-3 px-2 uppercase text-[10px]">${w.status}</td>
              <td class="py-3 px-2 text-right">
                ${w.status !== 'Disbursed'
                        ? `<button onclick="disburseWithdrawal(${i})" class="px-2.5 py-1 bg-black text-white text-[10px] font-black uppercase">Approve</button>`
                        : `<span class="text-[10px] font-black uppercase text-zinc-500">Settled</span>`}
              </td>
            </tr>
          `).join('');

            // Users Table
            const usersBody = document.getElementById('usersTableBody');
            usersBody.innerHTML = adminState.users.length === 0
                ? `<tr><td colspan="5" class="py-8 text-center text-zinc-400">No member records found.</td></tr>`
                : adminState.users.map((u, i) => `
            <tr>
              <td class="py-3 px-2"><div class="font-black text-black">${u.name}</div><div class="text-[10px] text-zinc-500">${u.handle}</div></td>
              <td class="py-3 px-2"><div>${u.email}</div><div class="text-[10px] text-zinc-500">${u.id}</div></td>
              <td class="py-3 px-2 uppercase font-black">${u.plan}</td>
              <td class="py-3 px-2 font-black">$${Number(u.balanceUSD).toFixed(2)}</td>
              <td class="py-3 px-2 text-right"><button onclick="openAddUserModal(${i})" class="px-2.5 py-1 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white">Edit / Balance</button></td>
            </tr>
          `).join('');
        }

        renderAll();
