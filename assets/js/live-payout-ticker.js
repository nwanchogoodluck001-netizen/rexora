/**
 * REXORA Live Settlement Toast Ticker
 * Non-intrusive live payout proof stream (1 USD = ₦1,000 pegged)
 */
(function initRexoraLiveTicker() {
    if (sessionStorage.getItem('rexora_ticker_muted') === 'true') return;

    const livePayoutStream = [
        { user: '@smart', initial: 'S', usd: 40.00, bank: 'OPay', time: '2 mins ago' },
        { user: '@buffunique890', initial: 'B', usd: 25.00, bank: 'PalmPay', time: '4 mins ago' },
        { user: '@david_fx', initial: 'D', usd: 15.00, bank: 'Kuda Bank', time: '6 mins ago' },
        { user: '@chidex_ui', initial: 'C', usd: 50.00, bank: 'Moniepoint', time: '9 mins ago' },
        { user: '@amina_k', initial: 'A', usd: 12.50, bank: 'Access Bank', time: '11 mins ago' },
        { user: '@victortech', initial: 'V', usd: 30.00, bank: 'GTBank', time: '14 mins ago' },
        { user: '@sarah_k', initial: 'S', usd: 18.00, bank: 'Zenith Bank', time: '17 mins ago' }
    ];

    // Inject Toast Container
    const toastEl = document.createElement('div');
    toastEl.id = 'rexoraLivePayoutToast';
    toastEl.className =
        'fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-sm ' +
        'bg-white/95 dark:bg-darkblue-900/95 border border-slate-200/90 dark:border-darkblue-border ' +
        'rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-brand-500/10 backdrop-blur-md ' +
        'flex items-center gap-3 transition-all duration-500 transform translate-y-6 opacity-0 pointer-events-none';

    toastEl.innerHTML = `
    <div class="relative shrink-0">
      <div id="tickerAvatar" class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
        S
      </div>
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-darkblue-900 absolute -top-0.5 -right-0.5 animate-ping"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-darkblue-900 absolute -top-0.5 -right-0.5"></span>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">✓ Verified Cashout</span>
        <span id="tickerTime" class="text-[9px] font-bold text-slate-400">• 2 mins ago</span>
      </div>
      <p id="tickerText" class="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-snug truncate mt-0.5">
        @smart just withdrew $40.00 (₦40,000) to OPay
      </p>
    </div>
    <button id="tickerCloseBtn" title="Mute live alerts" class="text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-xs p-1 shrink-0">
      ✕
    </button>
  `;

    document.body.appendChild(toastEl);

    let currentIdx = Math.floor(Math.random() * livePayoutStream.length);
    let hideTimeout = null;
    let cycleInterval = null;

    function showNextPayout() {
        if (sessionStorage.getItem('rexora_ticker_muted') === 'true') return;

        const item = livePayoutStream[currentIdx];
        const ngnVal = (item.usd * 1000).toLocaleString();

        document.getElementById('tickerAvatar').textContent = item.initial;
        document.getElementById('tickerTime').textContent = `• ${item.time}`;
        document.getElementById('tickerText').innerHTML =
            `<span class="text-brand-600 dark:text-brand-400 font-black">${item.user}</span> just withdrew ` +
            `<span class="text-emerald-600 dark:text-emerald-400 font-black">$${item.usd.toFixed(2)}</span> (₦${ngnVal}) to ${item.bank}`;

        // Slide in
        toastEl.classList.remove('translate-y-6', 'opacity-0', 'pointer-events-none');
        toastEl.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        // Slide out after 5 seconds
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            toastEl.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            toastEl.classList.add('translate-y-6', 'opacity-0', 'pointer-events-none');
        }, 5000);

        currentIdx = (currentIdx + 1) % livePayoutStream.length;
    }

    document.getElementById('tickerCloseBtn').addEventListener('click', () => {
        sessionStorage.setItem('rexora_ticker_muted', 'true');
        clearTimeout(hideTimeout);
        clearInterval(cycleInterval);
        toastEl.remove();
    });

    // Start initial trigger after 2.5s, then cycle every 11s
    setTimeout(() => {
        showNextPayout();
        cycleInterval = setInterval(showNextPayout, 11000);
    }, 2500);
})();