/* ==========================================================================
   Broc. For Lenders — Core B2B Application Controller & View Router
   Anchored in Broc B2B Vendor Portal Architecture (css/portal.css)
   ========================================================================== */

const PAGE_SIZE = 25;

window.portalState = {
  activeView: 'overview',          // 'overview' | 'pipeline' | 'rules' | 'analytics'
  currentDatasetMode: 'CURATED_7', // 'CURATED_7' | 'MONTHLY_517'
  currentLenderId: 'BOI',          // 'BOI' | 'WHITELABEL'
  currentStageFilter: 'ALL',       // 'ALL' | 'AIP' | 'FULL' | 'NURTURE'
  selectedApplicantId: CURATED_7_APPLICANTS[0].id,
  activeDrawerTab: 'SCORE',        // 'SCORE' | 'ANALYTICS' | 'CHECKLIST' | 'OFFERS'
  selectedScenarioKey: 'GREEN_RECOMMENDED', // 'STANDARD' | 'GREEN_RECOMMENDED' | 'CLIVE_OVERPAY'
  drawerOpen: false,
  filtersExpanded: false,
  analyticsScope: 'PORTFOLIO',     // 'PORTFOLIO' | 'APPLICANT'
  macroScenario: 'BASE',           // 'BASE' | 'STRESSED' | 'UPSIDE'
  rulesFilter: 'ALL',              // 'ALL' | 'template' | 'clause' | 'rider'
  rulesSearch: '',
  search: '',
  area: 'ALL',
  buyerType: 'ALL',
  berFilter: 'ALL',
  riskFilter: 'ALL',
  sortOrder: 'SCORE_DESC',
  currentPage: 1,
  isPrivacyMode: false,
  isDarkMode: (typeof localStorage !== 'undefined' && localStorage.getItem('broc_portal_theme') === 'dark')
};

/* Crisp inline SVG icon library matching Feather / Lucide aesthetic */
function portalIcon(name, size = 18) {
  const icons = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    pipeline: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    rules: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    analytics: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    score: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    menu: '<line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    shieldAlert: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    euro: '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
}

function getActiveDataset() {
  return window.portalState.currentDatasetMode === 'CURATED_7' ? CURATED_7_APPLICANTS : MONTHLY_517_APPLICANTS;
}

function getSelectedApplicant() {
  const dataset = getActiveDataset();
  return dataset.find(a => a.id === window.portalState.selectedApplicantId) || dataset[0];
}

function computeCohortSummary(list, lender) {
  let totalLoan = 0;
  let totalLow = 0;
  let totalHigh = 0;
  let totalScore = 0;
  let totalScoreGain = 0;
  let totalInitLtv = 0;
  let totalYr10Ltv = 0;
  let totalChurn = 0;
  let totalManagedChurn = 0;
  let totalPd = 0;
  let totalNii = 0;
  let aipReady = 0;
  let fullReady = 0;
  let nurtureCount = 0;
  let greenCount = 0;
  let highChurnCount = 0;

  list.forEach(a => {
    if (a.targetStage === 'AIP') aipReady++;
    else if (a.targetStage === 'FULL') fullReady++;
    else nurtureCount++;

    const c = calculateLoanQualification(a, lender);
    totalLoan += c.qualifiedLoan;
    totalLow += c.loanGrantLow;
    totalHigh += c.loanGrantHigh;
    totalScore += a.brocScore;
    totalScoreGain += (a.brocScore - a.brocScoreBefore);
    totalInitLtv += c.initialLtvPct;
    totalYr10Ltv += c.year10LtvPct;
    totalChurn += c.churnRisk5YrPct;
    totalManagedChurn += c.churnRiskManagedPct;
    totalPd += c.pd12MoBps;
    totalNii += c.est10YrNII;
    if (c.isGreenEligible) greenCount++;
    if (c.churnRisk5YrPct >= 30) highChurnCount++;
  });

  const n = Math.max(1, list.length);
  return {
    count: list.length,
    totalLoan,
    totalLow,
    totalHigh,
    avgScore: Math.round(totalScore / n),
    avgGain: Math.round(totalScoreGain / n),
    avgInitLtv: (totalInitLtv / n).toFixed(1),
    avgYr10Ltv: (totalYr10Ltv / n).toFixed(1),
    avgChurn: Math.round(totalChurn / n),
    avgManagedChurn: Math.round(totalManagedChurn / n),
    avgPdBps: Math.round(totalPd / n),
    totalNii,
    aipReady,
    fullReady,
    nurtureCount,
    greenCount,
    highChurnCount
  };
}

function getFilteredApplicants() {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = LENDERS[s.currentLenderId];
  const search = (s.search || '').toLowerCase().trim();

  const filtered = dataset.filter(a => {
    if (s.currentStageFilter !== 'ALL' && a.targetStage !== s.currentStageFilter) return false;
    if (s.buyerType !== 'ALL' && a.buyerType !== s.buyerType) return false;

    if (s.area !== 'ALL') {
      const countyLower = a.county.toLowerCase();
      if (s.area === 'Meath') {
        if (!countyLower.includes('meath') && !countyLower.includes('louth')) return false;
      } else if (s.area === 'OTHER') {
        const major = ['dublin', 'cork', 'galway', 'limerick', 'kildare', 'wicklow', 'meath', 'louth'];
        if (major.some(m => countyLower.includes(m))) return false;
      } else if (!countyLower.includes(s.area.toLowerCase())) {
        return false;
      }
    }

    if (s.berFilter !== 'ALL') {
      if (s.berFilter === 'GREEN' && !['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].includes(a.propertyBER)) return false;
      if (s.berFilter === 'A_RATED' && !a.propertyBER.startsWith('A')) return false;
      if (s.berFilter === 'B_RATED' && !a.propertyBER.startsWith('B')) return false;
      if (s.berFilter === 'NON_GREEN' && ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].includes(a.propertyBER)) return false;
    }

    const calc = calculateLoanQualification(a, lender);
    if (s.riskFilter !== 'ALL') {
      if (s.riskFilter === 'SCORE_90' && a.brocScore < 90) return false;
      if (s.riskFilter === 'LOW_LTV' && calc.initialLtvPct > 75) return false;
      if (s.riskFilter === 'HIGH_LTV' && calc.initialLtvPct <= 80) return false;
      if (s.riskFilter === 'LOW_CHURN' && calc.churnRisk5YrPct >= 20) return false;
      if (s.riskFilter === 'HIGH_CHURN' && calc.churnRisk5YrPct < 30) return false;
    }

    if (search) {
      const hay = `${a.names} ${a.id} ${a.county} ${a.targetPropertyAddress} ${a.citizenship} ${a.kycBadge} ${a.buyerType} ${a.propertyBER} ${a.dataSource} ${a.statusBadge} ${a.cliveStory}`.toLowerCase();
      const terms = search.split(/\s+/).filter(Boolean);
      if (!terms.every(t => hay.includes(t))) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (s.sortOrder === 'SCORE_DESC') return b.brocScore - a.brocScore;
    const calcA = calculateLoanQualification(a, lender);
    const calcB = calculateLoanQualification(b, lender);
    if (s.sortOrder === 'LOAN_DESC') return calcB.qualifiedLoan - calcA.qualifiedLoan;
    if (s.sortOrder === 'LTV_ASC') return calcA.initialLtvPct - calcB.initialLtvPct;
    if (s.sortOrder === 'CHURN_ASC') return calcA.churnRisk5YrPct - calcB.churnRisk5YrPct;
    if (s.sortOrder === 'CHURN_DESC') return calcB.churnRisk5YrPct - calcA.churnRisk5YrPct;
    if (s.sortOrder === 'NAME_ASC') return a.names.localeCompare(b.names);
    return 0;
  });

  return filtered;
}

/* ==========================================================================
   Theme, Chrome, Sidebar & Navigation Controls
   ========================================================================== */
function applyThemeUI() {
  const dark = window.portalState.isDarkMode;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.toggle('dark', dark);
  }
  const btn = document.getElementById('darkModeToggleBtn');
  if (btn) {
    btn.classList.toggle('is-active', dark);
    btn.innerHTML = `${portalIcon(dark ? 'sun' : 'moon', 15)}<span>${dark ? 'Light Mode' : 'Dark Mode'}</span>`;
  }
}

function toggleDarkMode() {
  window.portalState.isDarkMode = !window.portalState.isDarkMode;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('broc_portal_theme', window.portalState.isDarkMode ? 'dark' : 'light');
    }
  } catch (e) {}
  renderAll();
}

function togglePrivacyMode() {
  window.portalState.isPrivacyMode = !window.portalState.isPrivacyMode;
  renderAll();
  if (typeof copilotMessages !== 'undefined' && copilotMessages.length > 0 && typeof renderCopilotMessages === 'function') {
    seedCopilotWelcome();
  }
}

function toggleMobileSidebar(forceOpen) {
  const sidebar = document.getElementById('lenderSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar || !backdrop) return;
  const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('mobile-open');
  sidebar.classList.toggle('mobile-open', open);
  backdrop.classList.toggle('show', open);
}

function switchView(viewName) {
  window.portalState.activeView = viewName;
  toggleMobileSidebar(false);
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drillToPipelinePreset(preset) {
  clearAllSearchAndFilters(true);
  if (preset === 'AIP') window.portalState.currentStageFilter = 'AIP';
  else if (preset === 'FULL') window.portalState.currentStageFilter = 'FULL';
  else if (preset === 'NURTURE') window.portalState.currentStageFilter = 'NURTURE';
  else if (preset === 'SCORE_90') window.portalState.riskFilter = 'SCORE_90';
  else if (preset === 'HIGH_CHURN') {
    window.portalState.riskFilter = 'HIGH_CHURN';
    window.portalState.sortOrder = 'CHURN_DESC';
  }
  window.portalState.activeView = 'pipeline';
  window.portalState.currentPage = 1;
  renderAll();
}

function selectDatasetMode(mode) {
  window.portalState.currentDatasetMode = mode;
  window.portalState.currentPage = 1;
  renderAll();
  if (document.getElementById('assistantDrawer')?.classList.contains('open')) {
    seedCopilotWelcome();
  }
}

function selectLender(lenderId) {
  window.portalState.currentLenderId = lenderId;
  renderAll();
  if (document.getElementById('assistantDrawer')?.classList.contains('open')) {
    seedCopilotWelcome();
  }
}

function renderSidebarAndChrome() {
  const s = window.portalState;
  const lender = LENDERS[s.currentLenderId];
  const dataset = getActiveDataset();

  // Active nav highlighting
  ['overview', 'pipeline', 'rules', 'analytics'].forEach(v => {
    const el = document.getElementById(`nav-${v}`);
    if (el) el.classList.toggle('active', s.activeView === v);
  });

  const pipeBadge = document.getElementById('navBadgePipeline');
  if (pipeBadge) pipeBadge.textContent = String(dataset.length);
  const rulesBadge = document.getElementById('navBadgeRules');
  if (rulesBadge) rulesBadge.textContent = String(UNDERWRITING_RULES.length);

  // Sticky sidebar footer
  const footerContainer = document.getElementById('sidebarFooter');
  if (footerContainer) {
    const isBoi = s.currentLenderId === 'BOI';
    const queueShort = s.currentDatasetMode === 'CURATED_7' ? '7-Select Queue' : '517 Monthly Avg';
    footerContainer.innerHTML = `
      <div class="sidebar-tenant-row">
        <div class="sidebar-tenant-left">
          <div class="sidebar-avatar ${isBoi ? 'is-boi' : ''}">
            <img src="${isBoi ? 'assets/images/banks/bank-of-ireland-logo.png' : 'assets/images/logos/brokerly-logo.png'}" alt="${escapeHtml(lender.shortName)}" />
          </div>
          <div style="min-width:0;">
            <div class="sidebar-footer-name">${escapeHtml(lender.shortName)}</div>
            <div class="sidebar-footer-role">${queueShort} • CBI Rules</div>
          </div>
        </div>
      </div>

      <div>
        <div style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-caption);margin-bottom:4px;">Active Lender Portal</div>
        <div class="sidebar-toggle-group">
          <button class="sidebar-toggle-btn ${isBoi ? 'active is-boi' : ''}" onclick="selectLender('BOI')">BOI Co-Brand</button>
          <button class="sidebar-toggle-btn ${!isBoi ? 'active is-mint' : ''}" onclick="selectLender('WHITELABEL')">White-Label</button>
        </div>
      </div>

      <div>
        <div style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-caption);margin-bottom:4px;">Pipeline Volume Preset</div>
        <div class="sidebar-toggle-group">
          <button class="sidebar-toggle-btn ${s.currentDatasetMode === 'CURATED_7' ? 'active' : ''}" onclick="selectDatasetMode('CURATED_7')">7-Select</button>
          <button class="sidebar-toggle-btn ${s.currentDatasetMode === 'MONTHLY_517' ? 'active' : ''}" onclick="selectDatasetMode('MONTHLY_517')">517 Monthly</button>
        </div>
      </div>
    `;
  }

  // Top utility strip
  const breadcrumb = document.getElementById('topContextBreadcrumb');
  if (breadcrumb) {
    const isBoi = s.currentLenderId === 'BOI';
    breadcrumb.innerHTML = `
      ${isBoi ? '<img src="assets/images/banks/bank-of-ireland-logo.png" alt="BOI" />' : '<img src="assets/images/logos/brokerly-logo.png" alt="Broc" />'}
      <span style="color:var(--text-primary);">${escapeHtml(lender.shortName)}</span>
      <span style="color:var(--text-caption);">•</span>
      <span>Green ${lender.greenRate.toFixed(2)}% / Std ${lender.stdRate.toFixed(2)}%</span>
      <span style="color:var(--text-caption);">•</span>
      <span class="font-mono">${dataset.length} Packs</span>
    `;
  }

  const privacyBtn = document.getElementById('privacyToggleBtn');
  if (privacyBtn) {
    privacyBtn.classList.toggle('is-active', s.isPrivacyMode);
    privacyBtn.innerHTML = `${portalIcon(s.isPrivacyMode ? 'eyeOff' : 'eye', 15)}<span>${s.isPrivacyMode ? 'PII Hidden' : 'Privacy Blur'}</span>`;
  }
}

/* ==========================================================================
   VIEW 1: EXECUTIVE OVERVIEW (Matched to vendor.css V2 Overview)
   ========================================================================== */
function renderOverviewView(container) {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = LENDERS[s.currentLenderId];
  const stats = computeCohortSummary(dataset, lender);
  const priorityApps = [...dataset].sort((a, b) => b.brocScore - a.brocScore).slice(0, 5);
  const privacyCls = s.isPrivacyMode ? 'privacy-masked' : '';

  container.innerHTML = `
    <div class="auth-header-wrapper">
      <div>
        <h1 class="section-title">Underwriting Desk Overview</h1>
        <p class="section-subtitle">
          ${escapeHtml(lender.portalName)} • Pre-verified Open Banking, Revenue EDS &amp; 18-point CBI underwriting packs.
        </p>
      </div>
      <div class="gen3-header-actions">
        <button class="btn-vivien-pill-primary" onclick="toggleAssistant(true)">
          ${portalIcon('sparkles', 15)}
          <span>Ask Clara &amp; Clive</span>
        </button>
        <button class="btn-broc-mint" onclick="switchView('pipeline')">
          <span>Open Full Pipeline (${dataset.length})</span>
          ${portalIcon('arrowRight', 15)}
        </button>
      </div>
    </div>

    <div class="v2-section-header">
      <span>Portfolio Snapshot</span>
      <span class="muted-tag">(${s.currentDatasetMode === 'CURATED_7' ? '7-Select Showcase' : '517 Monthly Volume'})</span>
    </div>

    <div class="v2-metrics-grid">
      <div class="v2-metric-card" onclick="drillToPipelinePreset('ALL')">
        <div class="v2-metric-icon-circle">${portalIcon('euro', 20)}</div>
        <div class="v2-metric-data">
          <div class="v2-metric-value">${formatCompactEuro(stats.totalLoan)}</div>
          <div class="v2-metric-label">Qualified Lending Volume (Range ${formatCompactEuro(stats.totalLow)}–${formatCompactEuro(stats.totalHigh)})</div>
        </div>
        <span class="v2-metric-arrow">${portalIcon('arrowRight', 16)}</span>
      </div>

      <div class="v2-metric-card" onclick="drillToPipelinePreset('SCORE_90')">
        <div class="v2-metric-icon-circle">${portalIcon('score', 20)}</div>
        <div class="v2-metric-data">
          <div class="v2-metric-value">${stats.avgScore}/100</div>
          <div class="v2-metric-label">Avg Broc Readiness Score (↑ +${stats.avgGain} pts via Clive AI)</div>
        </div>
        <span class="v2-metric-arrow">${portalIcon('arrowRight', 16)}</span>
      </div>

      <div class="v2-metric-card" onclick="switchView('analytics')">
        <div class="v2-metric-icon-circle">${portalIcon('analytics', 20)}</div>
        <div class="v2-metric-data">
          <div class="v2-metric-value">${stats.avgInitLtv}% → ${stats.avgYr10Ltv}%</div>
          <div class="v2-metric-label">Projected Day-1 → Year 10 Amortized LTV Trajectory</div>
        </div>
        <span class="v2-metric-arrow">${portalIcon('arrowRight', 16)}</span>
      </div>

      <div class="v2-metric-card" onclick="drillToPipelinePreset('HIGH_CHURN')">
        <div class="v2-metric-icon-circle">${portalIcon('shieldAlert', 20)}</div>
        <div class="v2-metric-data">
          <div class="v2-metric-value">${stats.avgChurn}% → ${stats.avgManagedChurn}%</div>
          <div class="v2-metric-label">5-Yr Switcher Churn Hazard w/ Broc Re-Fix (${stats.highChurnCount} Watchlist)</div>
        </div>
        <span class="v2-metric-arrow">${portalIcon('arrowRight', 16)}</span>
      </div>
    </div>

    <div class="overview-two-col">
      <!-- LEFT CARD: UNDERWRITING INSIGHTS -->
      <div class="v2-analytics-card">
        <div class="analytics-header">
          <h2 class="analytics-title">Underwriting &amp; Risk Insights</h2>
          <button class="btn-xs-pill" onclick="switchView('analytics')">Open Charts →</button>
        </div>

        <div class="insight-row">
          <span class="insight-label">Stage A (AIP) vs Stage B (Full Offer)</span>
          <span class="insight-value">${stats.fullReady} Full • ${stats.aipReady} AIP • ${stats.nurtureCount} Remediating</span>
        </div>
        <div class="insight-row">
          <span class="insight-label">Weighted 12-Mo Default Risk (PD)</span>
          <span class="insight-value" style="color:var(--status-success-text);">${stats.avgPdBps} bps (${(stats.avgPdBps / 100).toFixed(2)}%)</span>
        </div>
        <div class="insight-row">
          <span class="insight-label">Green EcoSaver Eligible (BER A1–B3)</span>
          <span class="insight-value">${stats.greenCount} of ${stats.count} packs @ ${lender.greenRate.toFixed(2)}% APR</span>
        </div>
        <div class="insight-row">
          <span class="insight-label">Est. 10-Yr Net Interest Income (NII)</span>
          <span class="insight-value">${formatCompactEuro(stats.totalNii)} (185 bps margin)</span>
        </div>
        <div class="insight-row">
          <span class="insight-label">Underwriter Touch Time (Broc Packaged)</span>
          <span class="insight-value">4.2 hrs manual → 18 secs review</span>
        </div>
      </div>

      <!-- RIGHT CARD: PRIORITY UNDERWRITER QUEUE -->
      <div class="v2-analytics-card">
        <div class="analytics-header">
          <h2 class="analytics-title">Priority Fast-Track Queue</h2>
          <button class="btn-xs-pill" onclick="switchView('pipeline')">View All (${dataset.length}) →</button>
        </div>

        <div>
          ${priorityApps.map(a => {
            const calc = calculateLoanQualification(a, lender);
            const stageCls = a.targetStage === 'FULL' ? 'full-ready' : a.targetStage === 'AIP' ? 'aip-ready' : 'remediating';
            const stageLabel = a.targetStage === 'FULL' ? 'Full Offer' : a.targetStage === 'AIP' ? 'AIP Ready' : 'Remediating';
            return `
              <div class="recent-queue-row" onclick="selectAndOpenDrawer('${a.id}')">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                  <div class="customer-avatar" style="width:36px;height:36px;font-size:0.78rem;">${escapeHtml(getInitials(a.names))}</div>
                  <div style="min-width:0;">
                    <div class="customer-name-link ${privacyCls}" style="font-size:0.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(a.names)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                      <span class="${privacyCls}">${escapeHtml(a.county)}</span> • ${escapeHtml(a.buyerType)} • BER ${escapeHtml(a.propertyBER)}
                    </div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                  <span class="customer-stage-badge ${stageCls}"><span class="badge-dot"></span>${stageLabel}</span>
                  <div style="text-align:right;">
                    <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-primary);">${formatEuro(calc.qualifiedLoan)}</div>
                    <div style="font-size:0.71rem;color:var(--status-success-text);font-weight:600;">Score ${a.brocScore}/100</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   VIEW 2: APPLICANT PIPELINE (Gen-3 KPIs, Chips, Search & Customer Table)
   ========================================================================== */
function renderPipelineView(container) {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = LENDERS[s.currentLenderId];

  container.innerHTML = `
    <div class="gen3-page-header">
      <div>
        <div class="gen3-title-row">
          <h1 class="gen3-title">Applicant Pipeline</h1>
          <span id="pipelineCountPill" class="gen3-count-pill">${dataset.length} Packs</span>
        </div>
        <p id="pipelineSubtitle" class="gen3-subtitle">
          Loading active underwriting cohort...
        </p>
      </div>
      <div class="gen3-header-actions">
        <button class="btn-vivien-pill-primary" onclick="openAssistantWithPrompt('Fast-Track Score 90+')">
          ${portalIcon('sparkles', 15)}
          <span>Fast-Track 90+ via AI</span>
        </button>
        <button class="btn-broc-primary" onclick="openRulesComparisonModal()">
          ${portalIcon('rules', 15)}
          <span>18-Criteria Matrix</span>
        </button>
      </div>
    </div>

    <div id="pipelineKpiGrid" class="customer-kpi-grid"></div>

    <div class="pipeline-controls-bar">
      <div id="pipelineFilterChips" class="chip-scroll-strip"></div>

      <div class="pipeline-search-actions">
        <div class="pill-search-group">
          ${portalIcon('search', 15)}
          <input
            id="pipelineSearchInput"
            type="text"
            value="${escapeHtml(s.search)}"
            placeholder="Search name, ID, county, BER, Stamp 4..."
            oninput="onPipelineSearchInput(this.value)"
          />
        </div>
        <button id="moreFiltersBtn" class="btn-pill-outline" onclick="toggleFiltersPopover()">
          ${portalIcon('sliders', 14)}
          <span>Filters</span>
        </button>
        <button id="clearFiltersBtn" class="btn-pill-outline" style="display:none;color:var(--status-danger-text);border-color:var(--status-danger-border);" onclick="clearAllSearchAndFilters()">
          Reset
        </button>
      </div>
    </div>

    <div id="filterPopoverPanel" class="filter-popover-panel" style="display:${s.filtersExpanded ? 'grid' : 'none'};">
      <div class="filter-field">
        <label for="areaFilter">County / Region</label>
        <select id="areaFilter" onchange="onFilterDropdownChange('area', this.value)">
          <option value="ALL">All Ireland (All Counties)</option>
          <option value="Dublin">Dublin (City &amp; County)</option>
          <option value="Cork">Cork (City &amp; County)</option>
          <option value="Galway">Galway</option>
          <option value="Kildare">Kildare</option>
          <option value="Wicklow">Wicklow</option>
          <option value="Limerick">Limerick</option>
          <option value="Meath">Meath / Louth</option>
          <option value="OTHER">Other Regions</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="buyerTypeFilter">Buyer Profile</label>
        <select id="buyerTypeFilter" onchange="onFilterDropdownChange('buyerType', this.value)">
          <option value="ALL">All Buyer Types</option>
          <option value="FTB">First-Time Buyer (4.0x LTI)</option>
          <option value="SSB">Second-Time Mover (3.5x)</option>
          <option value="SWITCHER">Mortgage Switcher</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="berFilter">BER / Green Rate</label>
        <select id="berFilter" onchange="onFilterDropdownChange('berFilter', this.value)">
          <option value="ALL">All BER Ratings</option>
          <option value="GREEN">Green Eligible (A1–B3)</option>
          <option value="A_RATED">New Build / BER A1–A3</option>
          <option value="B_RATED">Green BER B1–B3</option>
          <option value="NON_GREEN">Non-Green (BER C1+)</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="riskFilter">Score, LTV &amp; Churn</label>
        <select id="riskFilter" onchange="onFilterDropdownChange('riskFilter', this.value)">
          <option value="ALL">All Risk Bands</option>
          <option value="SCORE_90">Fast-Track: Score 90+</option>
          <option value="LOW_LTV">Low LTV (≤75% Initial)</option>
          <option value="HIGH_LTV">High LTV (80%–90%)</option>
          <option value="LOW_CHURN">Sticky Cohort (&lt;20% Churn)</option>
          <option value="HIGH_CHURN">Churn Watchlist (≥30%)</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="sortOrderFilter">Sort Order</label>
        <select id="sortOrderFilter" onchange="onFilterDropdownChange('sortOrder', this.value)">
          <option value="SCORE_DESC">Broc Score (High → Low)</option>
          <option value="LOAN_DESC">Loan Amount (High → Low)</option>
          <option value="LTV_ASC">Lowest Initial LTV First</option>
          <option value="CHURN_DESC">Highest Churn Watch First</option>
          <option value="CHURN_ASC">Lowest Churn Risk First</option>
          <option value="NAME_ASC">Name (A → Z)</option>
        </select>
      </div>
    </div>

    <div id="stageContextBanner" class="stage-context-banner"></div>

    <div class="customer-table-container">
      <div class="table-responsive">
        <table class="customer-table">
          <thead>
            <tr>
              <th>Applicant &amp; Profile</th>
              <th>Underwriting Stage</th>
              <th>LTV → Yr10 &amp; Churn</th>
              <th>Broc Score &amp; PD</th>
              <th style="text-align:right;">Max Qualified Loan</th>
            </tr>
          </thead>
          <tbody id="applicantTableBody"></tbody>
        </table>
      </div>
      <div id="paginationFooter" class="table-footer-bar"></div>
    </div>
  `;

  syncFilterDropdownValues();
  renderPipelineDynamicParts();
}

function syncFilterDropdownValues() {
  const s = window.portalState;
  const map = {
    areaFilter: s.area,
    buyerTypeFilter: s.buyerType,
    berFilter: s.berFilter,
    riskFilter: s.riskFilter,
    sortOrderFilter: s.sortOrder
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = map[id];
  });
}

function toggleFiltersPopover() {
  window.portalState.filtersExpanded = !window.portalState.filtersExpanded;
  const panel = document.getElementById('filterPopoverPanel');
  const btn = document.getElementById('moreFiltersBtn');
  if (panel) panel.style.display = window.portalState.filtersExpanded ? 'grid' : 'none';
  if (btn) btn.classList.toggle('is-active', window.portalState.filtersExpanded);
}

function onPipelineSearchInput(val) {
  window.portalState.search = val;
  window.portalState.currentPage = 1;
  renderPipelineDynamicParts();
}

function onFilterDropdownChange(key, val) {
  window.portalState[key] = val;
  window.portalState.currentPage = 1;
  renderPipelineDynamicParts();
}

function setStageFilter(stage) {
  window.portalState.currentStageFilter = stage;
  window.portalState.currentPage = 1;
  renderPipelineDynamicParts();
}

function toggleQuickPresetChip(preset) {
  const s = window.portalState;
  if (preset === 'GREEN_A') {
    s.berFilter = s.berFilter === 'A_RATED' ? 'ALL' : 'A_RATED';
  } else if (preset === 'LOW_LTV') {
    s.riskFilter = s.riskFilter === 'LOW_LTV' ? 'ALL' : 'LOW_LTV';
    if (s.riskFilter === 'LOW_LTV') s.sortOrder = 'LTV_ASC';
  } else if (preset === 'SCORE_90') {
    s.riskFilter = s.riskFilter === 'SCORE_90' ? 'ALL' : 'SCORE_90';
  } else if (preset === 'HIGH_CHURN') {
    s.riskFilter = s.riskFilter === 'HIGH_CHURN' ? 'ALL' : 'HIGH_CHURN';
    if (s.riskFilter === 'HIGH_CHURN') s.sortOrder = 'CHURN_DESC';
  } else if (preset === 'STAMP4') {
    s.search = s.search.toLowerCase() === 'stamp 4' ? '' : 'Stamp 4';
    const inputEl = document.getElementById('pipelineSearchInput');
    if (inputEl) inputEl.value = s.search;
  }
  s.currentPage = 1;
  syncFilterDropdownValues();
  renderPipelineDynamicParts();
}

function clearAllSearchAndFilters(skipRender) {
  const s = window.portalState;
  s.search = '';
  s.area = 'ALL';
  s.buyerType = 'ALL';
  s.berFilter = 'ALL';
  s.riskFilter = 'ALL';
  s.sortOrder = 'SCORE_DESC';
  s.currentStageFilter = 'ALL';
  s.currentPage = 1;

  const inputEl = document.getElementById('pipelineSearchInput');
  if (inputEl) inputEl.value = '';
  syncFilterDropdownValues();
  if (!skipRender && s.activeView === 'pipeline') {
    renderPipelineDynamicParts();
  }
}

function changePage(page) {
  window.portalState.currentPage = page;
  renderPipelineDynamicParts();
  window.scrollTo({ top: 180, behavior: 'smooth' });
}

function renderPipelineDynamicParts() {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const filtered = getFilteredApplicants();
  const activeList = filtered.length > 0 ? filtered : dataset;
  const lender = LENDERS[s.currentLenderId];
  const fullStats = computeCohortSummary(dataset, lender);
  const filteredStats = computeCohortSummary(filtered, lender);

  // Header count & subtitle
  const countPill = document.getElementById('pipelineCountPill');
  if (countPill) countPill.textContent = `${filtered.length} of ${dataset.length} Packs`;
  const subEl = document.getElementById('pipelineSubtitle');
  if (subEl) {
    subEl.textContent = `${formatCompactEuro(filteredStats.totalLoan)} Qualified Volume • ${lender.shortName} CBI Rules (${lender.greenRate.toFixed(2)}% Green / ${lender.stdRate.toFixed(2)}% Std)`;
  }

  // Show/hide reset button
  const hasFilters = s.search !== '' || s.area !== 'ALL' || s.buyerType !== 'ALL' || s.berFilter !== 'ALL' || s.riskFilter !== 'ALL' || s.currentStageFilter !== 'ALL';
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) clearBtn.style.display = hasFilters ? 'inline-flex' : 'none';

  // Gen-3 KPI Grid
  const displayStats = filtered.length > 0 ? filteredStats : fullStats;
  const kpiGrid = document.getElementById('pipelineKpiGrid');
  if (kpiGrid) {
    kpiGrid.innerHTML = `
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Avg Broc Score</span>
          <div class="customer-kpi-icon emerald">${portalIcon('score', 16)}</div>
        </div>
        <div class="customer-kpi-value emerald">${displayStats.avgScore}/100</div>
        <div class="customer-kpi-sub">↑ +${displayStats.avgGain} pts uplift across ${displayStats.count} packs</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Projected Loans Granted</span>
          <div class="customer-kpi-icon indigo">${portalIcon('euro', 16)}</div>
        </div>
        <div class="customer-kpi-value">${formatCompactEuro(displayStats.totalLoan)}</div>
        <div class="customer-kpi-sub">P10 ${formatCompactEuro(displayStats.totalLow)} – P90 ${formatCompactEuro(displayStats.totalHigh)}</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">LTV Trajectory (Yr 10)</span>
          <div class="customer-kpi-icon blue">${portalIcon('analytics', 16)}</div>
        </div>
        <div class="customer-kpi-value">${displayStats.avgInitLtv}% → ${displayStats.avgYr10Ltv}%</div>
        <div class="customer-kpi-sub">Weighted Day-1 LTV → 30-Yr Amortized</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">5-Yr Switcher Churn</span>
          <div class="customer-kpi-icon amber">${portalIcon('shieldAlert', 16)}</div>
        </div>
        <div class="customer-kpi-value amber">${displayStats.avgChurn}% → ${displayStats.avgManagedChurn}%</div>
        <div class="customer-kpi-sub">Yr 3 &amp; Yr 5 cliff retention w/ Broc</div>
      </div>
    `;
  }

  // Filter chips strip
  const chipsEl = document.getElementById('pipelineFilterChips');
  if (chipsEl) {
    chipsEl.innerHTML = `
      <button class="policy-filter-chip ${s.currentStageFilter === 'ALL' ? 'active' : ''}" onclick="setStageFilter('ALL')">
        <span>All</span><span class="chip-count">${dataset.length}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'AIP' ? 'active' : ''}" onclick="setStageFilter('AIP')">
        <span>A) AIP Ready</span><span class="chip-count">${fullStats.aipReady}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'FULL' ? 'active' : ''}" onclick="setStageFilter('FULL')">
        <span>B) Full Mortgage</span><span class="chip-count">${fullStats.fullReady}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'NURTURE' ? 'active' : ''}" onclick="setStageFilter('NURTURE')">
        <span>Clive Remediating</span><span class="chip-count">${fullStats.nurtureCount}</span>
      </button>
      <button class="policy-filter-chip ${s.berFilter === 'A_RATED' ? 'active' : ''}" onclick="toggleQuickPresetChip('GREEN_A')">
        Green BER A1–A3
      </button>
      <button class="policy-filter-chip ${s.riskFilter === 'SCORE_90' ? 'active' : ''}" onclick="toggleQuickPresetChip('SCORE_90')">
        Score 90+
      </button>
      <button class="policy-filter-chip ${s.riskFilter === 'LOW_LTV' ? 'active' : ''}" onclick="toggleQuickPresetChip('LOW_LTV')">
        LTV ≤75%
      </button>
      <button class="policy-filter-chip ${s.riskFilter === 'HIGH_CHURN' ? 'active' : ''}" onclick="toggleQuickPresetChip('HIGH_CHURN')">
        Churn ≥30%
      </button>
      <button class="policy-filter-chip ${s.search.toLowerCase() === 'stamp 4' ? 'active' : ''}" onclick="toggleQuickPresetChip('STAMP4')">
        Stamp 4 IRP
      </button>
    `;
  }

  // Context Banner
  const banner = document.getElementById('stageContextBanner');
  if (banner) {
    if (s.currentStageFilter === 'AIP') {
      banner.innerHTML = `<div><span class="customer-stage-badge aip-ready"><span class="badge-dot"></span>Stage A: AIP (10 Core Criteria)</span> <span style="margin-left:8px;">Identity KYC, Citizenship/Stamp 4, Address AML, PPSN, CCR Bureau, Permanent PAYE, Revenue EDS, 6-Mo Statements, Clean Conduct, Deposit AML + +2% Stress.</span></div>`;
    } else if (s.currentStageFilter === 'FULL') {
      banner.innerHTML = `<div><span class="customer-stage-badge full-ready"><span class="badge-dot"></span>Stage B: Full Mortgage (18 Criteria)</span> <span style="margin-left:8px;">Includes all Stage A checks + Stamped Salary Cert, Refresh, Sales Advice Note, Panel Valuation, SEAI BER, Engineer Survey, Solicitor Undertaking &amp; Bound Protection.</span></div>`;
    } else if (s.currentStageFilter === 'NURTURE') {
      banner.innerHTML = `<div><span class="customer-stage-badge remediating"><span class="badge-dot"></span>Clive AI Remediation Mode</span> <span style="margin-left:8px;">Applicants held in <code>app.broc.fi</code> to clear Klarna/BNPL &amp; complete 6 clean savings months before reaching underwriter queue.</span></div>`;
    } else {
      banner.innerHTML = `<div><strong>Active Ruleset: ${escapeHtml(lender.name)}</strong> • Green ${lender.greenRate.toFixed(2)}% (+2% stressed @ ${(lender.greenRate + lender.stressBuffer).toFixed(2)}%) • CBI Caps: 4.0x FTB / 3.5x Mover</div><div class="font-mono" style="font-size:0.74rem;color:var(--text-muted);">${filtered.length} matching records</div>`;
    }
  }

  // Paginated Customer Table
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  if (s.currentPage > totalPages) s.currentPage = totalPages;

  const startIdx = (s.currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const privacyCls = s.isPrivacyMode ? 'privacy-masked' : '';

  const tbody = document.getElementById('applicantTableBody');
  if (tbody) {
    if (pageItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state-box">
              <div style="font-weight:700;color:var(--text-primary);font-size:0.95rem;">No applications match your current search or filters</div>
              <p style="font-size:0.8rem;margin:6px 0 14px;">Try searching for another county (Dublin, Cork, Galway), BER rating, or clear active filters.</p>
              <button class="btn-broc-primary" onclick="clearAllSearchAndFilters()">Reset Search &amp; Filters</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = pageItems.map(a => {
        const calc = calculateLoanQualification(a, lender);
        const isSelected = a.id === s.selectedApplicantId;
        const aipMet = a.aipCriteria.filter(c => c.met).length;
        const fullMet = a.fullCriteria.filter(c => c.met).length;

        const stageBadgeCls = a.targetStage === 'FULL'
          ? 'full-ready'
          : a.targetStage === 'AIP'
          ? 'aip-ready'
          : 'remediating';
        const stageText = a.targetStage === 'FULL'
          ? 'B) Full Mortgage'
          : a.targetStage === 'AIP'
          ? 'A) AIP Ready'
          : 'Clive Remediating';

        const churnCls = calc.churnRisk5YrPct < 20
          ? 'full-ready'
          : calc.churnRisk5YrPct <= 30
          ? 'aip-ready'
          : 'churn-watch';

        const scoreBadgeCls = a.brocScore >= 90
          ? 'full-ready'
          : a.brocScore >= 80
          ? 'aip-ready'
          : 'remediating';

        return `
          <tr class="${isSelected && s.drawerOpen ? 'is-selected' : ''}" onclick="selectAndOpenDrawer('${a.id}')">
            <td>
              <div style="display:flex;align-items:center;gap:12px;">
                <div class="customer-avatar">${escapeHtml(getInitials(a.names))}</div>
                <div style="min-width:0;">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span class="customer-name-link ${privacyCls}">${escapeHtml(a.names)}</span>
                    <span class="policy-tag">${escapeHtml(a.buyerType)}</span>
                    <span class="policy-tag" style="${calc.isGreenEligible ? 'border-color:var(--status-success-border);color:var(--status-success-text);background:var(--status-success-bg);' : ''}">BER ${escapeHtml(a.propertyBER)}</span>
                  </div>
                  <div style="font-size:0.76rem;color:var(--text-muted);margin-top:2px;">
                    <span class="${privacyCls}">${escapeHtml(a.county)}</span> • ${escapeHtml(a.citizenship)}
                  </div>
                  <div class="font-mono" style="font-size:0.7rem;color:var(--text-caption);margin-top:1px;">
                    ${escapeHtml(a.id)} • ${escapeHtml(a.dataSource.split('(')[0].trim())}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="customer-stage-badge ${stageBadgeCls}"><span class="badge-dot"></span>${stageText}</span>
              <div style="font-size:0.74rem;color:var(--text-muted);margin-top:5px;">
                AIP: ${aipMet}/10 • Full: ${aipMet + fullMet}/18
              </div>
            </td>
            <td>
              <div style="font-weight:700;color:var(--text-primary);font-size:0.84rem;">
                ${calc.initialLtvPct}% <span style="color:var(--vivien-indigo);font-weight:600;">→ ${calc.year10LtvPct}% Yr10</span>
              </div>
              <div style="margin-top:4px;">
                <span class="customer-stage-badge ${churnCls}" style="font-size:0.7rem;padding:0.15rem 0.52rem;">
                  Churn ${calc.churnRisk5YrPct}% (${calc.churnRiskLabel})
                </span>
              </div>
            </td>
            <td>
              <span class="customer-stage-badge ${scoreBadgeCls}">${a.brocScore}/100</span>
              <div style="font-size:0.73rem;color:var(--status-success-text);font-weight:600;margin-top:4px;">
                ↑ from ${a.brocScoreBefore} • PD ${calc.pd12MoBps}bps
              </div>
            </td>
            <td style="text-align:right;">
              <div style="display:flex;align-items:center;justify-content:flex-end;gap:12px;">
                <div>
                  <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:0.98rem;color:var(--text-primary);">${formatEuro(calc.qualifiedLoan)}</div>
                  <div style="font-size:0.71rem;color:var(--text-muted);">Range ${formatCompactEuro(calc.loanGrantLow)}–${formatCompactEuro(calc.loanGrantHigh)}</div>
                  <div style="font-size:0.71rem;color:var(--status-success-text);font-weight:600;">+${formatCompactEuro(calc.totalDeposit)} Deposit</div>
                </div>
                <button class="btn-vivien-pill-primary" style="padding:0.38rem 0.8rem;font-size:0.75rem;" onclick="event.stopPropagation(); selectAndOpenDrawer('${a.id}')">
                  360° File
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Pagination footer
  const footer = document.getElementById('paginationFooter');
  if (footer) {
    if (totalFiltered <= PAGE_SIZE) {
      footer.innerHTML = `
        <span>Showing all <strong>${totalFiltered}</strong> matching applications</span>
        ${s.currentDatasetMode === 'CURATED_7'
          ? `<button class="btn-xs-pill" onclick="selectDatasetMode('MONTHLY_517')">Switch to 517 Monthly Avg Queue →</button>`
          : ''}
      `;
    } else {
      footer.innerHTML = `
        <div>Showing <strong>${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, totalFiltered)}</strong> of <strong>${totalFiltered}</strong> monthly applications (Page ${s.currentPage} of ${totalPages})</div>
        <div style="display:flex;gap:6px;">
          <button class="btn-xs-pill" onclick="changePage(${s.currentPage - 1})" ${s.currentPage === 1 ? 'disabled' : ''}>← Prev</button>
          <button class="btn-xs-pill" onclick="changePage(${s.currentPage + 1})" ${s.currentPage === totalPages ? 'disabled' : ''}>Next →</button>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   VIEW 3: UNDERWRITING RULES & CRITERIA (Modular .policy-card Library)
   ========================================================================== */
function renderRulesView(container) {
  const s = window.portalState;
  const searchLower = (s.rulesSearch || '').toLowerCase().trim();
  const filteredRules = UNDERWRITING_RULES.filter(r => {
    if (s.rulesFilter !== 'ALL' && r.type !== s.rulesFilter) return false;
    if (searchLower) {
      const hay = `${r.code} ${r.title} ${r.category} ${r.summary} ${r.detail} ${r.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(searchLower)) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div class="gen3-page-header">
      <div>
        <div class="gen3-title-row">
          <h1 class="gen3-title">Underwriting Rules &amp; Criteria</h1>
          <span class="gen3-count-pill">${filteredRules.length} of ${UNDERWRITING_RULES.length} Rules</span>
        </div>
        <p class="gen3-subtitle">Modular policy bank governing Broc Score™ (0–100), Stage A (AIP 10-Pt), and Stage B (Full Offer 18-Pt) checks.</p>
      </div>
      <div class="gen3-header-actions">
        <button class="btn-vivien-pill-primary" onclick="openScoreModal()">
          ${portalIcon('score', 15)}
          <span>Score Methodology</span>
        </button>
        <button class="btn-broc-primary" onclick="openRulesComparisonModal()">
          ${portalIcon('rules', 15)}
          <span>Compare Stage A vs B</span>
        </button>
      </div>
    </div>

    <div class="customer-kpi-grid cols-3">
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Broc Score Framework</span>
          <div class="customer-kpi-icon indigo">${portalIcon('score', 16)}</div>
        </div>
        <div class="customer-kpi-value indigo">5 Pillars</div>
        <div class="customer-kpi-sub">Deterministic 0–100 readiness index</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Stage A: AIP Core</span>
          <div class="customer-kpi-icon blue">${portalIcon('rules', 16)}</div>
        </div>
        <div class="customer-kpi-value">10 Criteria</div>
        <div class="customer-kpi-sub">KYC, Residency, EDS, CCR &amp; +2% Stress</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Stage B: Post Sale-Agreed</span>
          <div class="customer-kpi-icon emerald">${portalIcon('checkCircle', 16)}</div>
        </div>
        <div class="customer-kpi-value emerald">+8 Riders</div>
        <div class="customer-kpi-sub">Salary Cert, Valuation, BER, Legal &amp; Life</div>
      </div>
    </div>

    <div class="pipeline-controls-bar">
      <div class="chip-scroll-strip">
        <button class="policy-filter-chip ${s.rulesFilter === 'ALL' ? 'active' : ''}" onclick="setRulesFilter('ALL')">All Rules <span class="chip-count">${UNDERWRITING_RULES.length}</span></button>
        <button class="policy-filter-chip ${s.rulesFilter === 'template' ? 'active' : ''}" onclick="setRulesFilter('template')">5 Score Pillars <span class="chip-count">5</span></button>
        <button class="policy-filter-chip ${s.rulesFilter === 'clause' ? 'active' : ''}" onclick="setRulesFilter('clause')">Stage A: AIP <span class="chip-count">10</span></button>
        <button class="policy-filter-chip ${s.rulesFilter === 'rider' ? 'active' : ''}" onclick="setRulesFilter('rider')">Stage B: Full <span class="chip-count">8</span></button>
      </div>
      <div class="pill-search-group">
        ${portalIcon('search', 15)}
        <input type="text" id="rulesSearchInput" value="${escapeHtml(s.rulesSearch)}" placeholder="Filter criteria, BER, Stamp 4, CCR..." oninput="onRulesSearchInput(this.value)" />
      </div>
    </div>

    <div id="rulesCardsGrid" class="policy-cards-grid"></div>
  `;
  renderRulesGridOnly();
}

function setRulesFilter(filterVal) {
  window.portalState.rulesFilter = filterVal;
  renderAll();
}

function onRulesSearchInput(val) {
  window.portalState.rulesSearch = val;
  renderRulesGridOnly();
}

function renderRulesGridOnly() {
  const s = window.portalState;
  const grid = document.getElementById('rulesCardsGrid');
  if (!grid) return;

  const searchLower = (s.rulesSearch || '').toLowerCase().trim();
  const filteredRules = UNDERWRITING_RULES.filter(r => {
    if (s.rulesFilter !== 'ALL' && r.type !== s.rulesFilter) return false;
    if (searchLower) {
      const hay = `${r.code} ${r.title} ${r.category} ${r.summary} ${r.detail} ${r.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(searchLower)) return false;
    }
    return true;
  });

  if (filteredRules.length === 0) {
    grid.innerHTML = `<div class="empty-state-box" style="grid-column:1/-1;">No underwriting rules match "${escapeHtml(s.rulesSearch)}".</div>`;
    return;
  }

  grid.innerHTML = filteredRules.map(r => {
    const cardCls = r.type === 'template' ? 'is-template' : r.type === 'clause' ? 'is-clause' : 'is-rider';
    const badgeCls = r.type === 'template' ? 'policy-badge-template' : r.type === 'clause' ? 'policy-badge-clause' : 'policy-badge-rider';
    return `
      <div class="policy-card ${cardCls}" style="cursor:pointer;" onclick="openRuleDetailModal('${r.id}')">
        <div>
          <div class="policy-card-header">
            <span class="policy-badge ${badgeCls}">${escapeHtml(r.category)}</span>
            <span class="policy-code-pill">${escapeHtml(r.code)} • ${escapeHtml(r.pointsOrStage)}</span>
          </div>
          <h3 class="policy-title">${escapeHtml(r.title)}</h3>
          <p class="policy-desc">${escapeHtml(r.summary)}</p>
          <div class="policy-tags-row">
            ${r.tags.map(t => `<span class="policy-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <div class="policy-card-footer">
          <span style="color:var(--text-muted);">Verified by <strong>${escapeHtml(r.autoVerified)}</strong></span>
          <span style="color:var(--vivien-indigo);font-weight:600;">Inspect →</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   VIEW 4: PORTFOLIO & CHURN ANALYTICS
   ========================================================================== */
function renderAnalyticsView(container) {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const filtered = getFilteredApplicants();
  const activeList = filtered.length > 0 ? filtered : dataset;
  const lender = LENDERS[s.currentLenderId];
  const macro = getMacroScenario();
  const selectedApp = getSelectedApplicant();

  container.innerHTML = `
    <div class="gen3-page-header">
      <div>
        <div class="gen3-title-row">
          <h1 class="gen3-title">Portfolio &amp; Churn Analytics</h1>
          <span class="gen3-count-pill">${s.analyticsScope === 'APPLICANT' ? escapeHtml(selectedApp.id) : `${activeList.length} Packs`}</span>
        </div>
        <p id="analyticsHeaderSubtitle" class="gen3-subtitle"></p>
      </div>
      <div class="analytics-control-bar">
        <div class="scope-segmented-control">
          <button class="scope-seg-btn ${s.analyticsScope === 'PORTFOLIO' ? 'active' : ''}" onclick="setAnalyticsScope('PORTFOLIO')">Portfolio (${activeList.length})</button>
          <button class="scope-seg-btn ${s.analyticsScope === 'APPLICANT' ? 'active' : ''}" onclick="setAnalyticsScope('APPLICANT')">Selected (${escapeHtml(selectedApp.id)})</button>
        </div>
        <select id="macroScenarioSelect" class="macro-select-pill" onchange="onMacroScenarioChange(this.value)">
          <option value="BASE" ${s.macroScenario === 'BASE' ? 'selected' : ''}>Scenario: CBI Base Case (+2.5% HPI)</option>
          <option value="STRESSED" ${s.macroScenario === 'STRESSED' ? 'selected' : ''}>Scenario: Downside Stress (-5% Yr1, +1% Rate)</option>
          <option value="UPSIDE" ${s.macroScenario === 'UPSIDE' ? 'selected' : ''}>Scenario: Green Growth (+4.0% HPI, Overpay)</option>
        </select>
      </div>
    </div>

    <div id="analyticsChartsBody"></div>
  `;

  renderAnalyticsCharts({
    container: document.getElementById('analyticsChartsBody'),
    subtitleEl: document.getElementById('analyticsHeaderSubtitle'),
    dataset,
    activeList,
    lender,
    macro,
    selectedApplicant: selectedApp,
    analyticsScope: s.analyticsScope,
    isDarkMode: s.isDarkMode,
    isPrivacyMode: s.isPrivacyMode
  });
}

function setAnalyticsScope(scope) {
  window.portalState.analyticsScope = scope;
  if (window.portalState.activeView === 'analytics') {
    renderAnalyticsView(document.getElementById('viewContainer'));
  }
}

function onMacroScenarioChange(val) {
  window.portalState.macroScenario = val;
  if (window.portalState.activeView === 'analytics') {
    renderAnalyticsView(document.getElementById('viewContainer'));
  }
  if (window.portalState.drawerOpen) {
    renderApplicantDrawer();
  }
}

/* ==========================================================================
   640px SLIDE-OVER 360-DEGREE APPLICANT DRAWER (.applicant-drawer-panel)
   ========================================================================== */
function selectAndOpenDrawer(applicantId, forceTab) {
  window.portalState.selectedApplicantId = applicantId;
  if (forceTab) {
    window.portalState.activeDrawerTab = forceTab;
  }
  const app = getSelectedApplicant();
  // Default scenario selection smoothly aligns to Green if BER A1–B3, else Standard
  const isGreen = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].includes(app.propertyBER);
  window.portalState.selectedScenarioKey = isGreen ? 'GREEN_RECOMMENDED' : 'STANDARD';

  window.portalState.drawerOpen = true;
  document.getElementById('drawerBackdrop')?.classList.add('open');
  document.getElementById('applicantDrawerPanel')?.classList.add('open');

  renderApplicantDrawer();
  if (window.portalState.activeView === 'pipeline') {
    renderPipelineDynamicParts();
  }
}

function closeApplicantDrawer() {
  window.portalState.drawerOpen = false;
  document.getElementById('drawerBackdrop')?.classList.remove('open');
  document.getElementById('applicantDrawerPanel')?.classList.remove('open');
  if (window.portalState.activeView === 'pipeline') {
    renderPipelineDynamicParts();
  }
}

function switchDrawerTab(tab) {
  window.portalState.activeDrawerTab = tab;
  renderApplicantDrawer();
}

function selectDrawerScenario(key) {
  window.portalState.selectedScenarioKey = key;
  renderApplicantDrawer();
}

function renderApplicantDrawer() {
  const root = document.getElementById('drawerContentRoot');
  if (!root) return;

  const s = window.portalState;
  const lender = LENDERS[s.currentLenderId];
  const applicant = getSelectedApplicant();
  const baseCalc = calculateLoanQualification(applicant, lender);
  const scenarios = getApplicantOfferScenarios(applicant, lender);
  const activeScenario = scenarios[s.selectedScenarioKey] || scenarios.GREEN_RECOMMENDED;
  const scenarioCalc = activeScenario.calc;

  const aipMet = applicant.aipCriteria.filter(c => c.met).length;
  const fullMet = applicant.fullCriteria.filter(c => c.met).length;
  const privacyCls = s.isPrivacyMode ? 'privacy-masked' : '';
  const stageCls = applicant.targetStage === 'FULL' ? 'full-ready' : applicant.targetStage === 'AIP' ? 'aip-ready' : 'remediating';
  const stageLabel = applicant.targetStage === 'FULL' ? 'B) Full Mortgage Ready' : applicant.targetStage === 'AIP' ? 'A) Instant AIP Qualified' : 'Clive AI Remediating';

  let bodyHtml = '';

  if (s.activeDrawerTab === 'SCORE') {
    bodyHtml = `
      <div class="customer-drawer-vivien-card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="sidebar-ai-avatar-stack">
              <img src="assets/images/avatars/clara.png" alt="Clara" class="sidebar-ai-avatar" style="width:34px;height:34px;" />
              <img src="assets/images/avatars/clive.png" alt="Clive" class="sidebar-ai-avatar second" style="width:34px;height:34px;" />
            </div>
            <div>
              <div style="font-weight:700;font-size:0.88rem;color:var(--vivien-indigo-dark);">Clara &amp; Clive Pre-Underwriting Uplift</div>
              <div style="font-size:0.78rem;color:var(--text-secondary);">
                Initial: <strong>${applicant.brocScoreBefore}/100</strong> → Packaged: <strong>${applicant.brocScore}/100</strong> (+${applicant.brocScore - applicant.brocScoreBefore} pts)
              </div>
            </div>
          </div>
          <span class="analytics-badge is-emerald">+${formatEuro(baseCalc.cliveLoanBoost)} Capacity</span>
        </div>
      </div>

      <div class="score-progress-list" style="margin-bottom:1rem;">
        ${applicant.scorePillars.map(p => {
          const pct = Math.round((p.earned / p.max) * 100);
          const barCls = pct >= 90 ? 'is-emerald' : pct >= 75 ? 'is-blue' : 'is-amber';
          return `
            <div class="score-progress-row">
              <div class="score-progress-header">
                <span class="score-progress-title">${escapeHtml(p.name)}</span>
                <span class="score-progress-pts">${p.earned} / ${p.max} pts</span>
              </div>
              <div class="score-progress-track">
                <div class="score-progress-fill ${barCls}" style="width:${pct}%;"></div>
              </div>
              <div class="score-progress-note">${escapeHtml(p.note)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="customer-timeline">
        <div class="customer-timeline-item">
          <div class="customer-timeline-dot"></div>
          <div class="customer-timeline-content">
            <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary);margin-bottom:4px;">Clive Financial Strategist Intervention</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.5;">${escapeHtml(applicant.cliveStory)}</div>
          </div>
        </div>
        <div class="customer-timeline-item" style="margin-bottom:0;">
          <div class="customer-timeline-dot" style="background:var(--brand-emerald);"></div>
          <div class="customer-timeline-content">
            <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary);margin-bottom:4px;">Verified Data Provenance &amp; Audit Feed</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(applicant.dataSource)} • Net Monthly Income ${formatEuro(applicant.netMonthlyIncome)} • Proven Repayment Capacity ${formatEuro(baseCalc.provenMonthlyCapacity)}/mo vs ${formatEuro(baseCalc.stressedMonthlyPayment)}/mo stressed</div>
          </div>
        </div>
      </div>
    `;
  } else if (s.activeDrawerTab === 'ANALYTICS') {
    const milestoneYears = [0, 5, 10, 15, 20, 25, 30];
    bodyHtml = `
      <div class="customer-drawer-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <strong style="font-size:0.86rem;color:var(--text-primary);">1. Projected Loan Grant Range (${escapeHtml(lender.shortName)})</strong>
          <span class="analytics-badge is-emerald">${baseCalc.appliedRate.toFixed(2)}% (${baseCalc.isGreenEligible ? 'Green' : 'Std'})</span>
        </div>
        <div class="drawer-p-grid">
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">P10 Stressed Floor</span>
            <span class="analytics-mini-stat-val">${formatEuro(baseCalc.loanGrantLow)}</span>
          </div>
          <div class="drawer-p-box is-highlight">
            <span class="analytics-mini-stat-label" style="color:var(--status-success-text);">P50 Qualified Base</span>
            <span class="analytics-mini-stat-val" style="color:var(--status-success-text);">${formatEuro(baseCalc.loanGrantMid)}</span>
          </div>
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">P90 Clive + Exception</span>
            <span class="analytics-mini-stat-val">${formatEuro(baseCalc.loanGrantHigh)}</span>
          </div>
        </div>
      </div>

      <div class="customer-drawer-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <strong style="font-size:0.86rem;color:var(--text-primary);">2. 30-Yr LTV Amortization (${applicant.termYears}-Yr Term)</strong>
          <span style="font-size:0.76rem;font-weight:700;color:var(--status-success-text);">Clive saves ${baseCalc.yearsSavedByClive} yrs</span>
        </div>
        <div class="table-responsive" style="border:1px solid var(--border-default);border-radius:10px;overflow:hidden;">
          <table class="ltv-milestone-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Sched. Bal</th>
                <th>Flat HPI</th>
                <th>Base HPI</th>
                <th style="color:var(--status-success-text);">Clive Overpay</th>
              </tr>
            </thead>
            <tbody>
              ${milestoneYears.map(yr => {
                const pt = baseCalc.ltv30YrSeries[yr];
                return `
                  <tr>
                    <td><strong>Yr ${yr}</strong></td>
                    <td>${formatCompactEuro(pt.remainingBalance)}</td>
                    <td>${pt.flatHpiLtv}%</td>
                    <td style="color:var(--vivien-indigo);font-weight:600;">${pt.baseHpiLtv}%</td>
                    <td style="color:var(--status-success-text);font-weight:700;">${pt.cliveOverpayLtv}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="customer-drawer-card" style="margin-bottom:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <strong style="font-size:0.86rem;color:var(--text-primary);">3. Churn Risk, 12-Mo PD &amp; 10-Yr Lender NII</strong>
          <span class="analytics-badge is-amber">Churn: ${baseCalc.churnRisk5YrPct}% → ${baseCalc.churnRiskManagedPct}%</span>
        </div>
        <div class="drawer-p-grid">
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Unmanaged 5-Yr Churn</span>
            <span class="analytics-mini-stat-val" style="color:var(--status-warn-text);">${baseCalc.churnRisk5YrPct}% (${baseCalc.churnRiskLabel})</span>
          </div>
          <div class="drawer-p-box is-highlight">
            <span class="analytics-mini-stat-label" style="color:var(--status-success-text);">Broc Auto-Retained</span>
            <span class="analytics-mini-stat-val" style="color:var(--status-success-text);">${baseCalc.churnRiskManagedPct}% Hazard</span>
          </div>
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Est. 10-Yr NII</span>
            <span class="analytics-mini-stat-val">${formatEuro(baseCalc.est10YrNII)}</span>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">
          12-Mo PD: <strong>${baseCalc.pd12MoBps} bps</strong> • Clive dispatches automatic LTV-tier re-fix offers 90 days ahead of fixed-rate expiry.
        </div>
      </div>
    `;
  } else if (s.activeDrawerTab === 'CHECKLIST') {
    bodyHtml = `
      <div style="margin-bottom:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;">
          <span class="policy-badge policy-badge-clause">A) MORTGAGE IN PRINCIPLE (${aipMet}/10 VERIFIED)</span>
        </div>
        <div class="criterion-list">
          ${applicant.aipCriteria.map(item => `
            <div class="criterion-item">
              <span class="criterion-status-dot ${item.met ? 'met' : 'pending'}">${item.met ? '✓' : '•'}</span>
              <div class="criterion-content">
                <div class="criterion-head">
                  <span class="criterion-title">${escapeHtml(item.name)}</span>
                  <span class="criterion-cat-badge">${escapeHtml(item.cat)}</span>
                </div>
                <div class="criterion-detail">${escapeHtml(item.detail)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;">
          <span class="policy-badge policy-badge-rider">B) FULL MORTGAGE POST SALE-AGREED (${fullMet}/8 VERIFIED)</span>
        </div>
        <div class="criterion-list">
          ${applicant.fullCriteria.map(item => `
            <div class="criterion-item">
              <span class="criterion-status-dot ${item.met ? 'met' : 'pending'}">${item.met ? '✓' : '•'}</span>
              <div class="criterion-content">
                <div class="criterion-head">
                  <span class="criterion-title">${escapeHtml(item.name)}</span>
                  <span class="criterion-cat-badge">${escapeHtml(item.cat)}</span>
                </div>
                <div class="criterion-detail">${escapeHtml(item.detail)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // OFFERS Tab: 3-Tile Vivien Scenario Modeler
    const tileOrder = ['STANDARD', 'GREEN_RECOMMENDED', 'CLIVE_OVERPAY'];
    bodyHtml = `
      <div class="vivien-guidance-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.8rem;gap:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="analytics-badge is-indigo">Clive &amp; ${escapeHtml(lender.code)} Offer Modeler</span>
            <span style="font-size:0.78rem;color:var(--text-muted);">Select rate tier to bind certificate terms</span>
          </div>
          <span style="font-size:0.74rem;font-weight:700;color:var(--status-success-text);">BER ${escapeHtml(applicant.propertyBER)}</span>
        </div>

        <div class="vivien-tiles-grid">
          ${tileOrder.map(key => {
            const tile = scenarios[key];
            const isSelected = s.selectedScenarioKey === key;
            return `
              <button
                type="button"
                class="vivien-price-tile ${tile.isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''}"
                onclick="selectDrawerScenario('${key}')"
              >
                <div>
                  <div class="tile-header">
                    <span class="tile-label">${escapeHtml(tile.title)}</span>
                    ${tile.isRecommended ? `<span class="tile-badge">${escapeHtml(tile.badgeText)}</span>` : `<span class="tile-stat">${escapeHtml(tile.badgeText)}</span>`}
                  </div>
                  <div class="tile-amount">${formatEuro(tile.monthlyPayment)}<span style="font-size:0.72rem;font-weight:500;">/mo</span></div>
                </div>
                <div>
                  <div class="tile-meta" style="font-weight:600;color:var(--text-secondary);">${escapeHtml(tile.termLabel)}</div>
                  <div class="tile-meta">${escapeHtml(tile.metaLine)}</div>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="customer-drawer-card" style="margin-bottom:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <strong style="font-size:0.86rem;color:var(--text-primary);">Selected Certificate Offer Preview: ${escapeHtml(activeScenario.title)}</strong>
          <span class="analytics-badge is-emerald">${activeScenario.rate.toFixed(2)}% APR</span>
        </div>
        <div class="drawer-p-grid">
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Scheduled Monthly</span>
            <span class="analytics-mini-stat-val">${formatEuro(activeScenario.monthlyPayment)}/mo</span>
          </div>
          <div class="drawer-p-box is-highlight">
            <span class="analytics-mini-stat-label" style="color:var(--status-success-text);">+2% CBI Stress Test</span>
            <span class="analytics-mini-stat-val" style="color:var(--status-success-text);">${formatEuro(activeScenario.stressedPayment)}/mo PASS</span>
          </div>
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Effective Payoff</span>
            <span class="analytics-mini-stat-val">${scenarioCalc.effectiveTermYears} Yrs (${s.selectedScenarioKey === 'CLIVE_OVERPAY' ? scenarioCalc.year10CliveLtvPct : scenarioCalc.year10LtvPct}% Yr10 LTV)</span>
          </div>
        </div>
        <p style="font-size:0.76rem;color:var(--text-muted);margin:10px 0 0 0;line-height:1.45;">
          Issuing the ${applicant.targetStage === 'FULL' ? 'Formal Loan Offer' : 'AIP Certificate'} below transmits these exact <strong>${escapeHtml(activeScenario.title)}</strong> terms straight into <strong>${escapeHtml(applicant.names)}</strong>'s <code>app.broc.fi</code> workspace.
        </p>
      </div>
    `;
  }

  root.innerHTML = `
    <div class="drawer-header">
      <div style="display:flex;align-items:flex-start;gap:12px;min-width:0;">
        <div class="customer-avatar" style="width:46px;height:46px;font-size:0.95rem;">${escapeHtml(getInitials(applicant.names))}</div>
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <h2 class="${privacyCls}" style="font-family:'Outfit',sans-serif;font-size:1.18rem;font-weight:700;margin:0;color:var(--text-primary);">${escapeHtml(applicant.names)}</h2>
            <span class="customer-stage-badge ${stageCls}"><span class="badge-dot"></span>${stageLabel}</span>
          </div>
          <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">
            <span class="font-mono">${escapeHtml(applicant.id)}</span> • ${escapeHtml(applicant.kycBadge)} • ${escapeHtml(applicant.citizenship)}
          </div>
          <div class="${privacyCls}" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
            📍 ${escapeHtml(applicant.targetPropertyAddress)}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
        <div style="text-align:right;">
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);">Broc Score</div>
          <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:700;color:var(--status-success-text);line-height:1;">${applicant.brocScore}<span style="font-size:0.75rem;font-weight:500;">/100</span></div>
        </div>
        <button class="close-icon-btn" onclick="closeApplicantDrawer()" aria-label="Close drawer">${portalIcon('close', 16)}</button>
      </div>
    </div>

    <div class="drawer-metric-ribbon">
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">Qualified Loan</div>
        <div class="drawer-metric-val">${formatEuro(baseCalc.qualifiedLoan)}</div>
      </div>
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">Grant Range (P10–90)</div>
        <div class="drawer-metric-val">${formatCompactEuro(baseCalc.loanGrantLow)}–${formatCompactEuro(baseCalc.loanGrantHigh)}</div>
      </div>
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">Day-1 → Yr10 LTV</div>
        <div class="drawer-metric-val" style="color:var(--vivien-indigo);">${baseCalc.initialLtvPct}% → ${baseCalc.year10LtvPct}%</div>
      </div>
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">5-Yr Churn Hazard</div>
        <div class="drawer-metric-val" style="color:var(--status-warn-text);">${baseCalc.churnRisk5YrPct}% → ${baseCalc.churnRiskManagedPct}%</div>
      </div>
    </div>

    <div id="drawerProfileTabs" class="drawer-tabs-bar">
      <button class="drawer-tab-btn ${s.activeDrawerTab === 'SCORE' ? 'active' : ''}" onclick="switchDrawerTab('SCORE')">Readiness &amp; Score (${applicant.brocScore})</button>
      <button class="drawer-tab-btn ${s.activeDrawerTab === 'ANALYTICS' ? 'active' : ''}" onclick="switchDrawerTab('ANALYTICS')">LTV &amp; Risk</button>
      <button class="drawer-tab-btn ${s.activeDrawerTab === 'CHECKLIST' ? 'active' : ''}" onclick="switchDrawerTab('CHECKLIST')">18-Pt Checklist (${aipMet + fullMet}/18)</button>
      <button class="drawer-tab-btn ${s.activeDrawerTab === 'OFFERS' ? 'active' : ''}" onclick="switchDrawerTab('OFFERS')">AIP Offer &amp; Scenarios</button>
    </div>

    <div class="drawer-body custom-scroll">
      ${bodyHtml}
    </div>

    <div class="drawer-footer">
      <button
        class="drawer-btn-primary ${s.currentLenderId === 'BOI' ? 'is-boi' : ''}"
        onclick="triggerUnderwriterAction('APPROVE')"
      >
        ${portalIcon('checkCircle', 16)}
        <span>${applicant.targetStage === 'FULL' ? `Issue ${lender.code} Loan Offer` : `Issue Instant ${lender.code} AIP`} (${activeScenario.rate.toFixed(2)}%)</span>
      </button>
      <button class="btn-pill-outline" onclick="triggerUnderwriterAction('EXPORT')">
        ${portalIcon('download', 15)}
        <span>Export 18-Pt Pack</span>
      </button>
      <div id="actionFeedbackToast" class="action-feedback-toast" style="display:none;"></div>
    </div>
  `;
}

/* ==========================================================================
   UNDERWRITER ACTIONS & COMPLIANCE MODALS (AIP Certificate, Score, 18-Pt)
   ========================================================================== */
function triggerUnderwriterAction(type) {
  const s = window.portalState;
  const lender = LENDERS[s.currentLenderId];
  const applicant = getSelectedApplicant();
  const scenarios = getApplicantOfferScenarios(applicant, lender);
  const chosen = scenarios[s.selectedScenarioKey] || scenarios.GREEN_RECOMMENDED;
  const calc = chosen.calc;

  const toast = document.getElementById('actionFeedbackToast');
  if (toast) toast.style.display = 'block';

  if (type === 'APPROVE') {
    const docTitle = applicant.targetStage === 'FULL' ? 'FORMAL MORTGAGE LETTER OF OFFER' : 'MORTGAGE APPROVAL IN PRINCIPLE (AIP)';
    if (toast) {
      toast.textContent = `✅ ${lender.shortName} ${applicant.targetStage === 'FULL' ? 'Formal Offer' : 'AIP'} (${formatEuro(calc.qualifiedLoan)} @ ${chosen.rate.toFixed(2)}%) dispatched to ${s.isPrivacyMode ? applicant.id : applicant.names}!`;
    }
    const modal = document.getElementById('aipCertificateModal');
    const content = document.getElementById('aipCertificateModalContent');
    if (modal && content) {
      content.innerHTML = `
        <div class="aip-cert-body">
          <div class="aip-cert-header" style="border-color:${lender.color};">
            <div class="modal-brand-lockup">
              ${s.currentLenderId === 'BOI' ? `<img src="assets/images/banks/bank-of-ireland-logo.png" alt="Bank of Ireland" style="height:28px;width:auto;" /><span style="color:#cbd5e1;">|</span>` : ''}
              <img src="assets/images/logos/brokerly-logo.png" alt="Broc" />
              <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">${escapeHtml(lender.shortName)} × Broc. Automated Underwriting</span>
            </div>
            <button class="close-icon-btn" style="background:#f1f5f9;color:#334155;" onclick="closeAipCertificateModal()">✕</button>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#64748b;flex-wrap:wrap;gap:6px;">
            <span><strong>Certificate Ref:</strong> ${escapeHtml(lender.code)}-AIP-${escapeHtml(applicant.id)}</span>
            <span><strong>Validity:</strong> ${escapeHtml(lender.aipValidity)} from Issue Date</span>
          </div>

          <h3 style="font-family:'Outfit',sans-serif;font-size:1.3rem;font-weight:800;margin:8px 0 4px;color:${lender.color};">${docTitle}</h3>
          <p style="font-size:0.82rem;color:#475569;margin:0;">
            Issued to <strong>${escapeHtml(applicant.names)}</strong> (${escapeHtml(applicant.county)}) following 18-point automated verification via <strong>Broc.fi (Broc Score™ ${applicant.brocScore}/100)</strong>:
          </p>

          <div class="aip-cert-metrics">
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Approved Loan Amount</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:${lender.color};margin-top:2px;">${formatEuro(calc.qualifiedLoan)}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Verified Cash + HTB Deposit</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:#059669;margin-top:2px;">${formatEuro(calc.totalDeposit)}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Max Purchase Price</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:#0f172a;margin-top:2px;">${formatEuro(calc.maxPurchasingPower)}</div>
            </div>
          </div>

          <div class="aip-cert-terms-box">
            <div><strong>Selected Product Tier:</strong> ${escapeHtml(chosen.title)} — ${chosen.rate.toFixed(2)}% APR (${calc.effectiveTermYears} yrs • ${formatEuro(chosen.monthlyPayment)}/mo${s.selectedScenarioKey === 'CLIVE_OVERPAY' ? ` incl. +${formatEuro(calc.monthlyOverpay)}/mo Clive Overpay` : ''})</div>
            <div style="margin-top:4px;"><strong>CBI +2.0% Stress Verification:</strong> Stressed @ ${chosen.stressedRate.toFixed(2)}% (${formatEuro(chosen.stressedPayment)}/mo) vs Proven Capacity ${formatEuro(calc.provenMonthlyCapacity)}/mo — <strong>PASSED</strong></div>
            <div style="margin-top:4px;"><strong>Instant Consumer Delivery:</strong> Dispatched straight into <strong>${escapeHtml(applicant.names)}</strong>'s <code>https://app.broc.fi</code> workspace with Stage B checklists attached.</div>
          </div>

          <div class="aip-cert-footer-sig">
            <div>
              <div style="font-weight:700;font-size:0.78rem;color:#0f172a;">Signed: Retail Credit Underwriting Desk (${escapeHtml(lender.shortName)})</div>
              <div style="font-size:0.71rem;color:#64748b;">Audited via Yapily Open Banking + Revenue EDS • 100% CBI Compliant</div>
            </div>
            <span class="sha-hash-badge">SHA256-${escapeHtml(applicant.id)}-VERIFIED</span>
          </div>
        </div>
      `;
      modal.classList.add('open');
    }
  } else {
    if (toast) {
      toast.textContent = `📦 Exported complete 18-Criteria Underwriting Pack (${applicant.id} — KYC, Citizenship, Revenue EDS & 6-Mo Audited CSVs).`;
    }
  }
}

function closeAipCertificateModal() {
  document.getElementById('aipCertificateModal')?.classList.remove('open');
}

function openScoreModal() {
  document.getElementById('scoreModal')?.classList.add('open');
}

function closeScoreModal() {
  document.getElementById('scoreModal')?.classList.remove('open');
}

function openRulesComparisonModal() {
  document.getElementById('rulesModal')?.classList.add('open');
}

function closeRulesComparisonModal() {
  document.getElementById('rulesModal')?.classList.remove('open');
}

function openRuleDetailModal(ruleId) {
  const rule = UNDERWRITING_RULES.find(r => r.id === ruleId);
  const modal = document.getElementById('ruleDetailModal');
  const content = document.getElementById('ruleDetailModalContent');
  if (!rule || !modal || !content) return;

  const badgeCls = rule.type === 'template' ? 'policy-badge-template' : rule.type === 'clause' ? 'policy-badge-clause' : 'policy-badge-rider';
  content.innerHTML = `
    <div class="portal-modal-header">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span class="policy-badge ${badgeCls}">${escapeHtml(rule.category)}</span>
        <span class="policy-code-pill">${escapeHtml(rule.code)} • ${escapeHtml(rule.pointsOrStage)}</span>
      </div>
      <button class="close-icon-btn" onclick="closeRuleDetailModal()">✕</button>
    </div>
    <div class="portal-modal-body">
      <h3 style="font-family:'Outfit',sans-serif;font-size:1.15rem;font-weight:700;margin:0 0 8px 0;color:var(--text-primary);">${escapeHtml(rule.title)}</h3>
      <p style="margin:0 0 12px 0;font-size:0.86rem;color:var(--text-secondary);line-height:1.55;">${escapeHtml(rule.detail)}</p>
      <div class="policy-tags-row">
        ${rule.tags.map(t => `<span class="policy-tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div style="padding:0.75rem 0.9rem;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-default);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span>Automation Engine: <strong style="color:var(--text-primary);">${escapeHtml(rule.autoVerified)}</strong></span>
        <button class="btn-vivien-pill-primary" style="padding:0.35rem 0.85rem;font-size:0.76rem;" onclick="closeRuleDetailModal(); openAssistantWithPrompt('Explain Selected +2% Stress Pass');">Ask Clara &amp; Clive →</button>
      </div>
    </div>
  `;
  modal.classList.add('open');
}

function closeRuleDetailModal() {
  document.getElementById('ruleDetailModal')?.classList.remove('open');
}

/* ==========================================================================
   MASTER RENDER ROUTER & STARTUP
   ========================================================================== */
function renderAll() {
  applyThemeUI();
  renderSidebarAndChrome();

  const viewEl = document.getElementById('viewContainer');
  if (viewEl) {
    const view = window.portalState.activeView;
    if (view === 'overview') renderOverviewView(viewEl);
    else if (view === 'pipeline') renderPipelineView(viewEl);
    else if (view === 'rules') renderRulesView(viewEl);
    else if (view === 'analytics') renderAnalyticsView(viewEl);
  }

  if (window.portalState.drawerOpen) {
    renderApplicantDrawer();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAipCertificateModal();
    closeScoreModal();
    closeRulesComparisonModal();
    closeRuleDetailModal();
    if (document.getElementById('assistantDrawer')?.classList.contains('open')) {
      toggleAssistant(false);
    } else if (window.portalState.drawerOpen) {
      closeApplicantDrawer();
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
});
