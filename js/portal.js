/* ==========================================================================
   Broc. For Lenders — Core B2B Application Controller & View Router
   Anchored in Broc B2B Vendor Portal Architecture (css/portal.css)
   ========================================================================== */

const PAGE_SIZE = 25;

const STANDARD_CONDITIONS = [
  'Panel Valuation >= Purchase Price',
  'Confirm Existing Debt / PCP Closure',
  'Donor Gift Letter + Bank Statement',
  'Signed & Stamped Employer Salary Cert',
  'SEAI BER B3+ Verification',
  'Solicitor Undertaking & Clean Title'
];

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
  quickChips: new Set(),           // stackable quick chips: GREEN_A, SCORE_90, LOW_LTV, HIGH_CHURN, STAMP4
  sortOrder: 'SCORE_DESC',
  currentPage: 1,
  selectedIds: new Set(),
  expandedCriteria: new Set(),
  decisions: {},
  selectedConditions: {},
  auditLog: {},
  policyOverrides: {
    BOI: {},
    WHITELABEL: {}
  }
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

function getActiveLender() {
  return getEffectiveLenderPolicy(LENDERS[window.portalState.currentLenderId]);
}

function getActiveDataset() {
  return window.portalState.currentDatasetMode === 'CURATED_7' ? CURATED_7_APPLICANTS : MONTHLY_517_APPLICANTS;
}

function getSelectedApplicant() {
  const dataset = getActiveDataset();
  return dataset.find(a => a.id === window.portalState.selectedApplicantId) || dataset[0];
}

function getDecisionBadgeHtml(applicantId) {
  const dec = window.portalState.decisions[applicantId];
  if (!dec) return '';
  const map = {
    AIP_ISSUED: { cls: 'approved', label: '✓ AIP Issued' },
    OFFER_ISSUED: { cls: 'approved', label: '✓ Loan Offer Issued' },
    CONDITIONAL_AIP: { cls: 'conditional', label: 'Conditional AIP' },
    RFI_SENT: { cls: 'rfi', label: 'RFI Dispatched' },
    REFERRED: { cls: 'referred', label: 'Credit Referred' },
    HOLD: { cls: 'blocked', label: 'Held in Clive' }
  };
  const info = map[dec.status];
  if (!info) return '';
  return `<span class="decision-badge ${info.cls}">${info.label}</span>`;
}

function computeCohortSummary(list, baseLender) {
  const lender = getEffectiveLenderPolicy(baseLender);
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
  let stressPassCount = 0;

  list.forEach(a => {
    if (a.targetStage === 'AIP') aipReady++;
    else if (a.targetStage === 'FULL') fullReady++;
    else nurtureCount++;

    const c = calculateLoanQualification(a, lender);
    totalLoan += c.loanForPricing;
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
    if (c.passesStressTest) stressPassCount++;
  });

  if (list.length === 0) {
    return {
      count: 0, totalLoan: 0, totalLow: 0, totalHigh: 0, avgScore: 0, avgGain: 0,
      avgInitLtv: '0.0', avgYr10Ltv: '0.0', avgChurn: 0, avgManagedChurn: 0,
      avgPdBps: 0, totalNii: 0, aipReady: 0, fullReady: 0, nurtureCount: 0,
      greenCount: 0, highChurnCount: 0, stressPassCount: 0
    };
  }

  const n = list.length;
  return {
    count: n,
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
    highChurnCount,
    stressPassCount
  };
}

function hasActivePipelineFilters() {
  const s = window.portalState;
  return (
    s.search !== '' ||
    s.area !== 'ALL' ||
    s.buyerType !== 'ALL' ||
    s.berFilter !== 'ALL' ||
    s.riskFilter !== 'ALL' ||
    s.currentStageFilter !== 'ALL' ||
    (s.quickChips && s.quickChips.size > 0)
  );
}

function matchesNonStageFilters(a, lender) {
  const s = window.portalState;
  const search = (s.search || '').toLowerCase().trim();

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

  // Stackable quick chips
  if (s.quickChips && s.quickChips.size > 0) {
    if (s.quickChips.has('GREEN_A') && !a.propertyBER.startsWith('A')) return false;
    if (s.quickChips.has('SCORE_90') && a.brocScore < 90) return false;
    if (s.quickChips.has('LOW_LTV') && calc.initialLtvPct > 75) return false;
    if (s.quickChips.has('HIGH_CHURN') && calc.churnRisk5YrPct < 30) return false;
    if (s.quickChips.has('STAMP4') && !`${a.citizenship} ${a.kycBadge}`.toLowerCase().includes('stamp 4')) return false;
  }

  if (search) {
    const hay = `${a.names} ${a.id} ${a.county} ${a.targetPropertyAddress} ${a.citizenship} ${a.kycBadge} ${a.buyerType} ${a.propertyBER} ${a.dataSource} ${a.statusBadge} ${a.cliveStory}`.toLowerCase();
    const terms = search.split(/\s+/).filter(Boolean);
    if (!terms.every(t => hay.includes(t))) return false;
  }

  return true;
}

function getFilteredApplicants() {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = getActiveLender();

  const filtered = dataset.filter(a => {
    if (s.currentStageFilter !== 'ALL' && a.targetStage !== s.currentStageFilter) return false;
    return matchesNonStageFilters(a, lender);
  });

  filtered.sort((a, b) => {
    if (s.sortOrder === 'SCORE_DESC') return b.brocScore - a.brocScore;
    const calcA = calculateLoanQualification(a, lender);
    const calcB = calculateLoanQualification(b, lender);
    if (s.sortOrder === 'LOAN_DESC') return calcB.loanForPricing - calcA.loanForPricing;
    if (s.sortOrder === 'LTV_ASC') return calcA.initialLtvPct - calcB.initialLtvPct;
    if (s.sortOrder === 'CHURN_ASC') return calcA.churnRisk5YrPct - calcB.churnRisk5YrPct;
    if (s.sortOrder === 'CHURN_DESC') return calcB.churnRisk5YrPct - calcA.churnRisk5YrPct;
    if (s.sortOrder === 'NAME_ASC') return a.names.localeCompare(b.names);
    return 0;
  });

  return filtered;
}

/* ==========================================================================
   Chrome, Sidebar & Navigation Controls
   ========================================================================== */
function resetDemoState() {
  const s = window.portalState;
  s.currentDatasetMode = 'CURATED_7';
  s.currentLenderId = 'BOI';
  s.macroScenario = 'BASE';
  s.decisions = {};
  s.selectedConditions = {};
  s.auditLog = {};
  s.policyOverrides = { BOI: {}, WHITELABEL: {} };
  s.selectedIds.clear();
  clearAllSearchAndFilters(true);
  s.selectedApplicantId = CURATED_7_APPLICANTS[0].id;
  renderAll();
  if (document.getElementById('assistantDrawer')?.classList.contains('open')) {
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
  if (window.MorganaGuidance) window.MorganaGuidance.stopTour();
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
  else if (preset === 'SCORE_90') window.portalState.quickChips.add('SCORE_90');
  else if (preset === 'HIGH_CHURN') {
    window.portalState.quickChips.add('HIGH_CHURN');
    window.portalState.sortOrder = 'CHURN_DESC';
  }
  window.portalState.activeView = 'pipeline';
  window.portalState.currentPage = 1;
  renderAll();
}

function selectDatasetMode(mode) {
  window.portalState.currentDatasetMode = mode;
  window.portalState.currentPage = 1;
  window.portalState.selectedIds.clear();
  const ds = getActiveDataset();
  if (!ds.some(a => a.id === window.portalState.selectedApplicantId)) {
    window.portalState.selectedApplicantId = ds[0].id;
  }
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
  const lender = getActiveLender();
  const dataset = getActiveDataset();
  const isBoi = s.currentLenderId === 'BOI';

  // Active nav highlighting
  ['overview', 'pipeline', 'rules', 'analytics'].forEach(v => {
    const el = document.getElementById(`nav-${v}`);
    if (el) el.classList.toggle('active', s.activeView === v);
  });

  const pipeBadge = document.getElementById('navBadgePipeline');
  if (pipeBadge) pipeBadge.textContent = String(dataset.length);
  const rulesBadge = document.getElementById('navBadgeRules');
  if (rulesBadge) rulesBadge.textContent = String(UNDERWRITING_RULES.length);

  // Consolidated Ever-Present Floating Demo Controls Dock (Bottom of Side Navbar)
  const footerContainer = document.getElementById('sidebarFooter');
  if (footerContainer) {
    const overrideCount = Object.keys(s.policyOverrides[s.currentLenderId] || {}).length;
    const hasDemoMutations = (
      s.currentDatasetMode !== 'CURATED_7' ||
      s.currentLenderId !== 'BOI' ||
      s.macroScenario !== 'BASE' ||
      overrideCount > 0 ||
      Object.keys(s.decisions).length > 0
    );

    footerContainer.innerHTML = `
      <div class="demo-dock-header">
        <span class="demo-dock-badge">
          <span class="demo-dock-dot"></span>
          Demo Controls
        </span>
        <div class="demo-dock-header-actions">
          ${hasDemoMutations ? `<button class="demo-dock-mini-link" onclick="resetDemoState()" title="Reset demo presets, overrides and decisions">↺ Reset</button>` : ''}
          <a href="demo.html" class="demo-dock-mini-link" title="Open interactive consumer-to-bank walkthrough">
            ${portalIcon('video', 11)}
            <span>Video</span>
          </a>
        </div>
      </div>

      <div>
        <div class="demo-dock-label">Lender Tenant</div>
        <div class="sidebar-toggle-group" role="group" aria-label="Lender Tenant Switcher">
          <button class="sidebar-toggle-btn ${isBoi ? 'active is-boi' : ''}" onclick="selectLender('BOI')">BOI</button>
          <button class="sidebar-toggle-btn ${!isBoi ? 'active is-mint' : ''}" onclick="selectLender('WHITELABEL')">White-Label</button>
        </div>
      </div>

      <div>
        <div class="demo-dock-label">Pipeline Queue</div>
        <div class="sidebar-toggle-group" role="group" aria-label="Pipeline Volume Switcher">
          <button class="sidebar-toggle-btn ${s.currentDatasetMode === 'CURATED_7' ? 'active' : ''}" onclick="selectDatasetMode('CURATED_7')">7-Select</button>
          <button class="sidebar-toggle-btn ${s.currentDatasetMode === 'MONTHLY_517' ? 'active' : ''}" onclick="selectDatasetMode('MONTHLY_517')">517 Monthly</button>
        </div>
      </div>

      <div>
        <div class="demo-dock-label">Macro Stress Scenario</div>
        <select id="macroScenarioSelect" class="demo-dock-select" onchange="onMacroScenarioChange(this.value)" aria-label="Macro Stress Scenario">
          <option value="BASE" ${s.macroScenario === 'BASE' ? 'selected' : ''}>CBI Base (+2.5% HPI)</option>
          <option value="STRESSED" ${s.macroScenario === 'STRESSED' ? 'selected' : ''}>Downside (-5% Yr1, +1%)</option>
          <option value="UPSIDE" ${s.macroScenario === 'UPSIDE' ? 'selected' : ''}>Green Growth (+4.0% HPI)</option>
        </select>
      </div>

      <button class="demo-dock-pill-btn" style="width:100%;" onclick="openScoreModal()">
        ${portalIcon('score', 13)}
        <span>How Broc Score Works</span>
      </button>
    `;
  }

  // Clean Top Context Strip (passive readout only)
  const breadcrumb = document.getElementById('topContextBreadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      ${isBoi ? '<img src="assets/images/banks/bank-of-ireland-logo.png" alt="BOI" />' : '<img src="assets/images/logos/brokerly-logo.png" alt="Broc" />'}
      <span style="color:var(--text-primary);">${escapeHtml(lender.shortName)}</span>
      <span style="color:var(--text-caption);">•</span>
      <span>Green ${lender.greenRate.toFixed(2)}% / Std ${lender.stdRate.toFixed(2)}%</span>
      <span style="color:var(--text-caption);">•</span>
      <span class="font-mono">${dataset.length} Packs</span>
    `;
  }
}

/* ==========================================================================
   VIEW 1: EXECUTIVE OVERVIEW (Matched to vendor.css V2 Overview)
   ========================================================================== */
function renderOverviewView(container) {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = getActiveLender();
  const stats = computeCohortSummary(dataset, lender);
  const cbi = computeCbiExceptionMetrics(dataset, lender);
  const priorityApps = [...dataset].sort((a, b) => b.brocScore - a.brocScore).slice(0, 5);
  const decisionsCount = Object.keys(s.decisions).length;

  container.innerHTML = `
    <div class="auth-header-wrapper">
      <div>
        <h1 class="section-title">Underwriting Desk Overview</h1>
        <p class="section-subtitle">
          ${escapeHtml(lender.portalName)} • Pre-verified Open Banking, Revenue EDS &amp; 18-point CBI underwriting packs.
        </p>
      </div>
      <div class="gen3-header-actions">
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

    <div id="overviewKpiGrid" class="v2-metrics-grid">
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

    <div id="overviewCbiQuotaCard" class="cbi-quota-card">
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700;">
          <span style="color:var(--text-primary);">CBI FTB LTI Exception Allowance (&gt;4.0x)</span>
          <span style="color:var(--vivien-indigo);">${cbi.ftbUsedPct}% / ${cbi.ftbAllowanceCapPct.toFixed(0)}% Cap</span>
        </div>
        <div class="cbi-quota-track">
          <div class="cbi-quota-fill" style="width:${Math.round((cbi.ftbUsedPct / cbi.ftbAllowanceCapPct) * 100)}%;"></div>
        </div>
        <div style="font-size:0.71rem;color:var(--text-muted);margin-top:4px;">
          ${(cbi.ftbAllowanceCapPct - cbi.ftbUsedPct).toFixed(1)}% headroom available across ${cbi.ftbCount} active FTB packs
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700;">
          <span style="color:var(--text-primary);">CBI Mover (SSB) LTI Allowance (&gt;3.5x)</span>
          <span style="color:var(--status-success-text);">${cbi.ssbUsedPct}% / ${cbi.ssbAllowanceCapPct.toFixed(0)}% Cap</span>
        </div>
        <div class="cbi-quota-track">
          <div class="cbi-quota-fill emerald" style="width:${Math.round((cbi.ssbUsedPct / cbi.ssbAllowanceCapPct) * 100)}%;"></div>
        </div>
        <div style="font-size:0.71rem;color:var(--text-muted);margin-top:4px;">
          ${(cbi.ssbAllowanceCapPct - cbi.ssbUsedPct).toFixed(1)}% headroom available • ${decisionsCount} underwriter action${decisionsCount === 1 ? '' : 's'} logged this session
        </div>
      </div>
    </div>

    <div class="overview-two-col">
      <!-- LEFT CARD: UNDERWRITING INSIGHTS -->
      <div id="overviewRiskInsightsCard" class="v2-analytics-card">
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
          <span class="insight-label">+${lender.stressBuffer.toFixed(1)}% Stress Test Pass Rate</span>
          <span class="insight-value" style="color:var(--status-success-text);">${stats.stressPassCount} of ${stats.count} (${Math.round((stats.stressPassCount / Math.max(1, stats.count)) * 100)}%)</span>
        </div>
      </div>

      <!-- RIGHT CARD: PRIORITY UNDERWRITER QUEUE -->
      <div id="overviewPriorityQueueCard" class="v2-analytics-card">
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
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <span class="customer-name-link" style="font-size:0.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(a.names)}</span>
                      ${getDecisionBadgeHtml(a.id)}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                      ${escapeHtml(a.county)} • ${escapeHtml(a.buyerType)} • BER ${escapeHtml(a.propertyBER)} • ${escapeHtml(calc.bindingLabel)}
                    </div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                  <span class="customer-stage-badge ${stageCls}"><span class="badge-dot"></span>${stageLabel}</span>
                  <div style="text-align:right;">
                    <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-primary);">${formatEuro(calc.loanForPricing)}</div>
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

    <div id="pipelineControlsBar" class="pipeline-controls-bar">
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
        <button id="moreFiltersBtn" class="btn-pill-outline ${s.filtersExpanded ? 'is-active' : ''}" onclick="toggleFiltersPopover()">
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
    <div id="bulkActionMount"></div>

    <div id="pipelineTableContainer" class="customer-table-container">
      <div class="table-responsive">
        <table class="customer-table">
          <thead>
            <tr>
              <th style="width:40px;"><input type="checkbox" id="selectAllVisibleCheck" class="table-check" onchange="toggleSelectAllVisible(this.checked)" aria-label="Select all visible rows" /></th>
              <th>Applicant &amp; Profile</th>
              <th>Stage &amp; Decision</th>
              <th>LTI, Binding Cap &amp; Stress</th>
              <th>LTV → Yr10 &amp; Churn</th>
              <th>Broc Score &amp; PD</th>
              <th style="text-align:right;">Facility / Max Cap</th>
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
  const chips = window.portalState.quickChips;
  if (chips.has(preset)) {
    chips.delete(preset);
  } else {
    chips.add(preset);
    if (preset === 'LOW_LTV') window.portalState.sortOrder = 'LTV_ASC';
    if (preset === 'HIGH_CHURN') window.portalState.sortOrder = 'CHURN_DESC';
  }
  window.portalState.currentPage = 1;
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
  s.quickChips.clear();
  s.sortOrder = 'SCORE_DESC';
  s.currentStageFilter = 'ALL';
  s.currentPage = 1;

  const inputEl = document.getElementById('pipelineSearchInput');
  if (inputEl) inputEl.value = '';
  syncFilterDropdownValues();
  if (!skipRender) {
    if (s.activeView === 'pipeline') renderPipelineDynamicParts();
    else if (s.activeView === 'analytics') renderAnalyticsView(document.getElementById('viewContainer'));
  }
}

function changePage(page) {
  window.portalState.currentPage = page;
  renderPipelineDynamicParts();
  window.scrollTo({ top: 180, behavior: 'smooth' });
}

function toggleRowSelection(id, checked) {
  if (checked) window.portalState.selectedIds.add(id);
  else window.portalState.selectedIds.delete(id);
  renderPipelineDynamicParts();
}

function toggleSelectAllVisible(checked) {
  const filtered = getFilteredApplicants();
  const startIdx = (window.portalState.currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  pageItems.forEach(a => {
    if (checked) window.portalState.selectedIds.add(a.id);
    else window.portalState.selectedIds.delete(a.id);
  });
  renderPipelineDynamicParts();
}

function clearBulkSelection() {
  window.portalState.selectedIds.clear();
  renderPipelineDynamicParts();
}

function batchApproveSelected() {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = getActiveLender();
  let issued = 0;
  let skipped = 0;

  s.selectedIds.forEach(id => {
    const app = dataset.find(a => a.id === id);
    if (!app) return;
    const calc = calculateLoanQualification(app, lender);
    if (app.targetStage === 'NURTURE' || !calc.passesStressTest) {
      skipped++;
      return;
    }
    const status = app.targetStage === 'FULL' ? 'OFFER_ISSUED' : 'AIP_ISSUED';
    s.decisions[id] = {
      status,
      rate: calc.appliedRate,
      amount: calc.loanForPricing,
      timestamp: new Date().toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })
    };
    recordAuditEvent(id, status === 'OFFER_ISSUED' ? 'Batch Loan Offer Issued' : 'Batch AIP Issued', `${lender.shortName} ${formatEuro(calc.loanForPricing)} @ ${calc.appliedRate.toFixed(2)}%`);
    issued++;
  });

  s.selectedIds.clear();
  renderAll();
  const banner = document.getElementById('stageContextBanner');
  if (banner) {
    banner.innerHTML = `<div style="color:var(--status-success-text);font-weight:600;">✅ Batch action complete: ${issued} ${lender.code} decision(s) issued${skipped > 0 ? ` • ${skipped} ineligible/remediating file(s) safely skipped` : ''}.</div>`;
  }
}

function exportApplicantsCsv(applicantsList, filenameSuffix) {
  const lender = getActiveLender();
  const s = window.portalState;
  const headers = [
    'Application ID', 'Applicant Names', 'County', 'Buyer Type', 'Stage', 'Broc Score',
    'Recognized Income EUR', 'LTI Ratio', 'Qualified Loan EUR', 'Target Facility EUR',
    'Initial LTV %', 'Binding Constraint', 'Rate %', '+2% Stress Margin EUR',
    '5-Yr Churn %', 'Decision Status'
  ];

  const rows = applicantsList.map(a => {
    const c = calculateLoanQualification(a, lender);
    const dec = s.decisions[a.id]?.status || 'PENDING_REVIEW';
    return [
      a.id, a.names, a.county, a.buyerType, a.targetStage, a.brocScore,
      c.recognizedIncome, c.actualLtiRatio, c.qualifiedLoan, c.loanForPricing,
      c.initialLtvPct, c.bindingLabel, c.appliedRate.toFixed(2), c.stressMarginPm,
      c.churnRisk5YrPct, dec
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `broc-${lender.code.toLowerCase()}-${filenameSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {}
}

function exportSelectedCsv() {
  const dataset = getActiveDataset();
  const picked = dataset.filter(a => window.portalState.selectedIds.has(a.id));
  if (picked.length > 0) {
    exportApplicantsCsv(picked, `selected-${picked.length}`);
  }
}

function renderPipelineDynamicParts() {
  const s = window.portalState;
  const dataset = getActiveDataset();
  const lender = getActiveLender();
  const filtered = getFilteredApplicants();
  const nonStageMatches = dataset.filter(a => matchesNonStageFilters(a, lender));
  const stageChipStats = computeCohortSummary(nonStageMatches, lender);
  const filteredStats = computeCohortSummary(filtered, lender);

  // Header count & subtitle
  const countPill = document.getElementById('pipelineCountPill');
  if (countPill) countPill.textContent = `${filtered.length} of ${dataset.length} Packs`;
  const subEl = document.getElementById('pipelineSubtitle');
  if (subEl) {
    subEl.textContent = `${formatCompactEuro(filteredStats.totalLoan)} Qualified Volume • ${lender.shortName} CBI Rules (${lender.greenRate.toFixed(2)}% Green / ${lender.stdRate.toFixed(2)}% Std)`;
  }

  // Show/hide reset button
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) clearBtn.style.display = hasActivePipelineFilters() ? 'inline-flex' : 'none';

  // Gen-3 KPI Grid (shows 0 cleanly when filters return 0 records!)
  const kpiGrid = document.getElementById('pipelineKpiGrid');
  if (kpiGrid) {
    kpiGrid.innerHTML = `
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Avg Broc Score</span>
          <div class="customer-kpi-icon emerald">${portalIcon('score', 16)}</div>
        </div>
        <div class="customer-kpi-value emerald">${filteredStats.count > 0 ? `${filteredStats.avgScore}/100` : '—'}</div>
        <div class="customer-kpi-sub">${filteredStats.count > 0 ? `↑ +${filteredStats.avgGain} pts uplift across ${filteredStats.count} packs` : '0 matching packs'}</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">Projected Loans Granted</span>
          <div class="customer-kpi-icon indigo">${portalIcon('euro', 16)}</div>
        </div>
        <div class="customer-kpi-value">${formatCompactEuro(filteredStats.totalLoan)}</div>
        <div class="customer-kpi-sub">P10 ${formatCompactEuro(filteredStats.totalLow)} – P90 ${formatCompactEuro(filteredStats.totalHigh)}</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">LTV Trajectory (Yr 10)</span>
          <div class="customer-kpi-icon blue">${portalIcon('analytics', 16)}</div>
        </div>
        <div class="customer-kpi-value">${filteredStats.count > 0 ? `${filteredStats.avgInitLtv}% → ${filteredStats.avgYr10Ltv}%` : '—'}</div>
        <div class="customer-kpi-sub">Weighted Day-1 LTV → Amortized</div>
      </div>
      <div class="customer-kpi-card">
        <div class="customer-kpi-top">
          <span class="customer-kpi-label">5-Yr Switcher Churn</span>
          <div class="customer-kpi-icon amber">${portalIcon('shieldAlert', 16)}</div>
        </div>
        <div class="customer-kpi-value amber">${filteredStats.count > 0 ? `${filteredStats.avgChurn}% → ${filteredStats.avgManagedChurn}%` : '—'}</div>
        <div class="customer-kpi-sub">Yr 3 &amp; Yr 5 cliff retention w/ Broc</div>
      </div>
    `;
  }

  // Filter chips strip (stage chip counts dynamically reflect active non-stage filters; quick chips stack!)
  const chipsEl = document.getElementById('pipelineFilterChips');
  if (chipsEl) {
    chipsEl.innerHTML = `
      <button class="policy-filter-chip ${s.currentStageFilter === 'ALL' ? 'active' : ''}" onclick="setStageFilter('ALL')">
        <span>All</span><span class="chip-count">${nonStageMatches.length}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'AIP' ? 'active' : ''}" onclick="setStageFilter('AIP')">
        <span>A) AIP Ready</span><span class="chip-count">${stageChipStats.aipReady}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'FULL' ? 'active' : ''}" onclick="setStageFilter('FULL')">
        <span>B) Full Mortgage</span><span class="chip-count">${stageChipStats.fullReady}</span>
      </button>
      <button class="policy-filter-chip ${s.currentStageFilter === 'NURTURE' ? 'active' : ''}" onclick="setStageFilter('NURTURE')">
        <span>Clive Remediating</span><span class="chip-count">${stageChipStats.nurtureCount}</span>
      </button>
      <button class="policy-filter-chip ${s.quickChips.has('GREEN_A') ? 'active' : ''}" onclick="toggleQuickPresetChip('GREEN_A')">
        Green BER A1–A3
      </button>
      <button class="policy-filter-chip ${s.quickChips.has('SCORE_90') ? 'active' : ''}" onclick="toggleQuickPresetChip('SCORE_90')">
        Score 90+
      </button>
      <button class="policy-filter-chip ${s.quickChips.has('LOW_LTV') ? 'active' : ''}" onclick="toggleQuickPresetChip('LOW_LTV')">
        LTV ≤75%
      </button>
      <button class="policy-filter-chip ${s.quickChips.has('HIGH_CHURN') ? 'active' : ''}" onclick="toggleQuickPresetChip('HIGH_CHURN')">
        Churn ≥30%
      </button>
      <button class="policy-filter-chip ${s.quickChips.has('STAMP4') ? 'active' : ''}" onclick="toggleQuickPresetChip('STAMP4')">
        Stamp 4 IRP
      </button>
    `;
  }

  // Context Banner
  const banner = document.getElementById('stageContextBanner');
  if (banner) {
    if (s.currentStageFilter === 'AIP') {
      banner.innerHTML = `<div><span class="customer-stage-badge aip-ready"><span class="badge-dot"></span>Stage A: AIP (10 Core Criteria)</span> <span style="margin-left:8px;">Identity KYC, Citizenship/Stamp 4, Address AML, PPSN, CCR Bureau, Permanent PAYE, Revenue EDS, 6-Mo Statements, Clean Conduct, Deposit AML + +${lender.stressBuffer.toFixed(1)}% Stress.</span></div>`;
    } else if (s.currentStageFilter === 'FULL') {
      banner.innerHTML = `<div><span class="customer-stage-badge full-ready"><span class="badge-dot"></span>Stage B: Full Mortgage (18 Criteria)</span> <span style="margin-left:8px;">Includes all Stage A checks + Stamped Salary Cert, Refresh, Sales Advice Note, Panel Valuation, SEAI BER, Engineer Survey, Solicitor Undertaking &amp; Bound Protection.</span></div>`;
    } else if (s.currentStageFilter === 'NURTURE') {
      banner.innerHTML = `<div><span class="customer-stage-badge remediating"><span class="badge-dot"></span>Clive AI Remediation Mode</span> <span style="margin-left:8px;">Applicants held in <code>app.broc.fi</code> until conduct clears — automated AIP issuance disabled by guardrail.</span></div>`;
    } else {
      banner.innerHTML = `<div><strong>Active Ruleset: ${escapeHtml(lender.name)}</strong> • Green ${lender.greenRate.toFixed(2)}% (+${lender.stressBuffer.toFixed(1)}% stressed @ ${(lender.greenRate + lender.stressBuffer).toFixed(2)}%) • ${Math.round(lender.maxVariableBonusPct * 100)}% Bonus Recognition</div><div class="font-mono" style="font-size:0.74rem;color:var(--text-muted);">${filtered.length} matching records</div>`;
    }
  }

  // Bulk Action Bar
  const bulkMount = document.getElementById('bulkActionMount');
  if (bulkMount) {
    if (s.selectedIds.size > 0) {
      bulkMount.innerHTML = `
        <div class="bulk-action-bar">
          <div style="font-size:0.82rem;font-weight:700;color:var(--vivien-indigo-dark);">
            ${s.selectedIds.size} application${s.selectedIds.size === 1 ? '' : 's'} selected
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <button class="btn-broc-primary" style="padding:0.38rem 0.9rem;font-size:0.76rem;" onclick="batchApproveSelected()">
              ✓ Batch Issue Eligible AIP / Offer
            </button>
            <button class="btn-pill-outline" style="padding:0.38rem 0.85rem;font-size:0.76rem;" onclick="exportSelectedCsv()">
              ${portalIcon('download', 14)} Export Selected CSV
            </button>
            <button class="btn-xs-pill" onclick="clearBulkSelection()">Clear</button>
          </div>
        </div>
      `;
    } else {
      bulkMount.innerHTML = '';
    }
  }

  // Paginated Customer Table
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  if (s.currentPage > totalPages) s.currentPage = totalPages;

  const startIdx = (s.currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const masterCheck = document.getElementById('selectAllVisibleCheck');
  if (masterCheck) {
    masterCheck.checked = pageItems.length > 0 && pageItems.every(a => s.selectedIds.has(a.id));
  }

  const tbody = document.getElementById('applicantTableBody');
  if (tbody) {
    if (pageItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state-box">
              <div style="font-weight:700;color:var(--text-primary);font-size:0.95rem;">No applications match your current search or filters</div>
              <p style="font-size:0.8rem;margin:6px 0 14px;">Try adjusting county, BER, or quick filter chips to see matching borrower files.</p>
              <button class="btn-broc-primary" onclick="clearAllSearchAndFilters()">Reset Search &amp; Filters</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = pageItems.map(a => {
        const calc = calculateLoanQualification(a, lender);
        const isSelected = a.id === s.selectedApplicantId;
        const isChecked = s.selectedIds.has(a.id);
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
            <td onclick="event.stopPropagation()">
              <input type="checkbox" class="table-check" ${isChecked ? 'checked' : ''} onchange="toggleRowSelection('${a.id}', this.checked)" aria-label="Select ${escapeHtml(a.id)}" />
            </td>
            <td>
              <div style="display:flex;align-items:center;gap:11px;">
                <div class="customer-avatar">${escapeHtml(getInitials(a.names))}</div>
                <div style="min-width:0;">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span class="customer-name-link">${escapeHtml(a.names)}</span>
                    <span class="policy-tag">${escapeHtml(a.buyerType)}</span>
                    <span class="policy-tag" style="${calc.isGreenEligible ? 'border-color:var(--status-success-border);color:var(--status-success-text);background:var(--status-success-bg);' : ''}">BER ${escapeHtml(a.propertyBER)}</span>
                  </div>
                  <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                    ${escapeHtml(a.county)} • ${escapeHtml(a.citizenship)}
                  </div>
                  <div class="font-mono" style="font-size:0.69rem;color:var(--text-caption);margin-top:1px;">
                    ${escapeHtml(a.id)} • ${escapeHtml(a.dataSource.split('(')[0].trim())}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px;">
                <span class="customer-stage-badge ${stageBadgeCls}"><span class="badge-dot"></span>${stageText}</span>
                ${getDecisionBadgeHtml(a.id)}
                <div style="font-size:0.72rem;color:var(--text-muted);">
                  AIP: ${aipMet}/10 • Full: ${aipMet + fullMet}/18
                </div>
              </div>
            </td>
            <td>
              <div style="font-weight:700;font-size:0.81rem;color:var(--text-primary);">
                ${calc.actualLtiRatio}x LTI <span style="color:var(--text-muted);font-weight:500;">(cap ${calc.ltiMultiplier.toFixed(1)}x)</span>
              </div>
              <div style="font-size:0.73rem;color:var(--vivien-indigo);font-weight:600;margin-top:2px;">
                ${escapeHtml(calc.bindingLabel)}
              </div>
              <div style="font-size:0.71rem;color:${calc.passesStressTest ? 'var(--status-success-text)' : 'var(--status-danger-text)'};font-weight:600;margin-top:1px;">
                Stress: ${calc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(calc.stressMarginPm)}/mo
              </div>
            </td>
            <td>
              <div style="font-weight:700;color:var(--text-primary);font-size:0.83rem;">
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
              <div style="font-size:0.72rem;color:var(--status-success-text);font-weight:600;margin-top:4px;">
                ↑ from ${a.brocScoreBefore} • PD ${calc.pd12MoBps}bps
              </div>
            </td>
            <td style="text-align:right;">
              <div style="display:flex;align-items:center;justify-content:flex-end;gap:10px;">
                <div>
                  <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:0.96rem;color:var(--text-primary);">${formatEuro(calc.loanForPricing)}</div>
                  ${calc.loanForPricing !== calc.qualifiedLoan
                    ? `<div style="font-size:0.7rem;color:var(--vivien-indigo);font-weight:600;">Max Cap ${formatCompactEuro(calc.qualifiedLoan)}</div>`
                    : `<div style="font-size:0.7rem;color:var(--text-muted);">Range ${formatCompactEuro(calc.loanGrantLow)}–${formatCompactEuro(calc.loanGrantHigh)}</div>`}
                  <div style="font-size:0.7rem;color:var(--status-success-text);font-weight:600;">+${formatCompactEuro(calc.totalDeposit)} ${a.buyerType === 'SWITCHER' ? 'Equity' : 'Deposit'}</div>
                </div>
                <button class="btn-vivien-pill-primary" style="padding:0.38rem 0.78rem;font-size:0.74rem;" onclick="event.stopPropagation(); selectAndOpenDrawer('${a.id}')">
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
        <div style="display:flex;gap:8px;align-items:center;">
          ${totalFiltered > 0 ? `<button class="btn-xs-pill" onclick="exportApplicantsCsv(getFilteredApplicants(), 'cohort')">Export Cohort CSV</button>` : ''}
        </div>
      `;
    } else {
      footer.innerHTML = `
        <div>Showing <strong>${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, totalFiltered)}</strong> of <strong>${totalFiltered}</strong> monthly applications (Page ${s.currentPage} of ${totalPages})</div>
        <div style="display:flex;gap:6px;">
          <button class="btn-xs-pill" onclick="exportApplicantsCsv(getFilteredApplicants(), 'filtered-cohort')">Export CSV</button>
          <button class="btn-xs-pill" onclick="changePage(${s.currentPage - 1})" ${s.currentPage === 1 ? 'disabled' : ''}>← Prev</button>
          <button class="btn-xs-pill" onclick="changePage(${s.currentPage + 1})" ${s.currentPage === totalPages ? 'disabled' : ''}>Next →</button>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   VIEW 3: UNDERWRITING RULES & INTERACTIVE POLICY SIMULATOR
   ========================================================================== */
function updatePolicyOverride(field, rawValue) {
  const s = window.portalState;
  const val = Number(rawValue);
  if (!Number.isFinite(val)) return;
  if (!s.policyOverrides[s.currentLenderId]) {
    s.policyOverrides[s.currentLenderId] = {};
  }
  s.policyOverrides[s.currentLenderId][field] = val;
  renderAll();
}

function resetPolicyOverrides() {
  const s = window.portalState;
  s.policyOverrides[s.currentLenderId] = {};
  renderAll();
}

function renderRulesView(container) {
  const s = window.portalState;
  const baseLender = LENDERS[s.currentLenderId];
  const activeLender = getActiveLender();
  const dataset = getActiveDataset();
  const baselineStats = computeCohortSummary(dataset, baseLender);
  const simStats = computeCohortSummary(dataset, activeLender);
  const volDelta = simStats.totalLoan - baselineStats.totalLoan;
  const passDelta = simStats.stressPassCount - baselineStats.stressPassCount;
  const hasOverrides = Object.keys(s.policyOverrides[s.currentLenderId] || {}).length > 0;

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
          <h1 class="gen3-title">Underwriting Rules &amp; Credit Policy</h1>
          <span class="gen3-count-pill">${filteredRules.length} of ${UNDERWRITING_RULES.length} Rules</span>
        </div>
        <p class="gen3-subtitle">Live credit policy parameters for <strong>${escapeHtml(activeLender.name)}</strong> plus the 23-rule Broc Score &amp; CBI matrix.</p>
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

    <!-- INTERACTIVE POLICY SIMULATOR -->
    <div id="policySimulatorCard" class="policy-simulator-card">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="analytics-badge is-indigo">Live Credit Policy Simulator</span>
            <strong style="font-family:'Outfit',sans-serif;font-size:1rem;color:var(--text-primary);">${escapeHtml(activeLender.shortName)} Thresholds</strong>
            ${hasOverrides ? `<span class="decision-badge conditional">Modified Policy Active</span>` : ''}
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:3px;">
            Adjust rates, variable bonus recognition, or NDI living cost benchmarks to simulate real-time impact across all <strong>${dataset.length} packs</strong>.
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="text-align:right;font-size:0.76rem;">
            <div style="color:var(--text-muted);">Simulated Cohort Volume</div>
            <strong style="font-family:'Outfit',sans-serif;font-size:0.98rem;color:var(--text-primary);">${formatCompactEuro(simStats.totalLoan)}</strong>
            <span style="color:${volDelta >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)'};font-weight:700;margin-left:4px;">(${volDelta >= 0 ? '+' : ''}${formatCompactEuro(volDelta)})</span>
          </div>
          <div style="text-align:right;font-size:0.76rem;">
            <div style="color:var(--text-muted);">Stress Pass Rate</div>
            <strong style="font-family:'Outfit',sans-serif;font-size:0.98rem;color:var(--status-success-text);">${simStats.stressPassCount}/${dataset.length}</strong>
            <span style="color:${passDelta >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)'};font-weight:700;margin-left:4px;">(${passDelta >= 0 ? '+' : ''}${passDelta})</span>
          </div>
          ${hasOverrides ? `<button class="btn-xs-pill" onclick="resetPolicyOverrides()">Reset Defaults</button>` : ''}
        </div>
      </div>

      <div class="policy-slider-grid">
        <div class="policy-control-box">
          <label for="simGreenRate"><span>Green EcoSaver APR</span><span class="font-mono">${activeLender.greenRate.toFixed(2)}%</span></label>
          <input id="simGreenRate" type="range" min="3.10" max="4.50" step="0.05" value="${activeLender.greenRate.toFixed(2)}" oninput="updatePolicyOverride('greenRate', this.value)" />
        </div>
        <div class="policy-control-box">
          <label for="simStdRate"><span>Standard Fixed APR</span><span class="font-mono">${activeLender.stdRate.toFixed(2)}%</span></label>
          <input id="simStdRate" type="range" min="3.40" max="5.10" step="0.05" value="${activeLender.stdRate.toFixed(2)}" oninput="updatePolicyOverride('stdRate', this.value)" />
        </div>
        <div class="policy-control-box">
          <label for="simBonusPct"><span>Variable Bonus Recognized</span><span class="font-mono">${Math.round(activeLender.maxVariableBonusPct * 100)}%</span></label>
          <input id="simBonusPct" type="range" min="0.20" max="1.00" step="0.05" value="${activeLender.maxVariableBonusPct.toFixed(2)}" oninput="updatePolicyOverride('maxVariableBonusPct', this.value)" />
        </div>
        <div class="policy-control-box">
          <label for="simCoupleNdi"><span>Couple NDI Living Cost</span><span class="font-mono">${formatEuro(activeLender.livingCostCouple)}/mo</span></label>
          <input id="simCoupleNdi" type="range" min="2000" max="2900" step="50" value="${activeLender.livingCostCouple}" oninput="updatePolicyOverride('livingCostCouple', this.value)" />
        </div>
      </div>
    </div>

    <div id="rulesStageSummaryGrid" class="customer-kpi-grid cols-3">
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
        <div class="customer-kpi-sub">KYC, Residency, EDS, CCR &amp; +${activeLender.stressBuffer.toFixed(1)}% Stress</div>
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

    <div id="rulesFilterControlsBar" class="pipeline-controls-bar">
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
  const isFilteredCohort = hasActivePipelineFilters();
  const activeList = filtered.length > 0 ? filtered : dataset;
  const lender = getActiveLender();
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
        <div id="analyticsScopeBar" class="scope-segmented-control">
          <button class="scope-seg-btn ${s.analyticsScope === 'PORTFOLIO' ? 'active' : ''}" onclick="setAnalyticsScope('PORTFOLIO')">Portfolio (${activeList.length})</button>
          <button class="scope-seg-btn ${s.analyticsScope === 'APPLICANT' ? 'active' : ''}" onclick="setAnalyticsScope('APPLICANT')">Selected (${escapeHtml(selectedApp.id)})</button>
        </div>
      </div>
    </div>

    ${isFilteredCohort && s.analyticsScope === 'PORTFOLIO' ? `
      <div class="analytics-filter-alert">
        <div>
          <strong>Pipeline Filter Active:</strong> Showing <strong>${filtered.length}</strong> of <strong>${dataset.length}</strong> applications matching your Pipeline filters${filtered.length === 0 ? ' (showing full cohort fallback because 0 rows matched)' : ''}.
        </div>
        <button class="btn-xs-pill" onclick="clearAllSearchAndFilters()">Reset to All ${dataset.length} Packs</button>
      </div>
    ` : ''}

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
    analyticsScope: s.analyticsScope
  });
}

function setAnalyticsScope(scope) {
  window.portalState.analyticsScope = scope;
  if (window.portalState.activeView === 'analytics') {
    if (window.MorganaGuidance) window.MorganaGuidance.renderMorganaHelpUI();
    renderAnalyticsView(document.getElementById('viewContainer'));
  }
}

function onMacroScenarioChange(val) {
  window.portalState.macroScenario = val;
  renderAll();
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
  if (window.MorganaGuidance) window.MorganaGuidance.stopTour();
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
  const applicant = getSelectedApplicant();
  const lender = getActiveLender();
  const scenarios = getApplicantOfferScenarios(applicant, lender);
  if (scenarios[key] && scenarios[key].isIssuable === false) {
    return; // Non-Green properties cannot issue Green EcoSaver rate directly
  }
  window.portalState.selectedScenarioKey = key;
  renderApplicantDrawer();
}

function toggleCriterionEvidence(critKey) {
  const set = window.portalState.expandedCriteria;
  if (set.has(critKey)) set.delete(critKey);
  else set.add(critKey);
  renderApplicantDrawer();
}

function toggleConditionForApplicant(applicantId, conditionLabel) {
  const map = window.portalState.selectedConditions;
  if (!map[applicantId]) map[applicantId] = [];
  const idx = map[applicantId].indexOf(conditionLabel);
  if (idx >= 0) map[applicantId].splice(idx, 1);
  else map[applicantId].push(conditionLabel);
  renderApplicantDrawer();
}

function recordAuditEvent(applicantId, action, detail) {
  const log = window.portalState.auditLog;
  if (!log[applicantId]) log[applicantId] = [];
  const time = new Date().toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  log[applicantId].unshift({
    time,
    actor: `${getActiveLender().code} Underwriter`,
    action,
    detail
  });
}

function buildEvidenceSnippet(applicant, item, lender, calc) {
  const name = item.name.toLowerCase();
  if (name.includes('income') || name.includes('payslips') || name.includes('eds')) {
    return `Revenue EDS matched against 3 payroll cycles: Base ${formatEuro(applicant.baseIncome)} + Variable ${formatEuro(applicant.bonusIncome)} (${Math.round(lender.maxVariableBonusPct * 100)}% recognized = ${formatEuro(calc.recognizedIncome)}).`;
  }
  if (name.includes('statements') || name.includes('conduct') || name.includes('refresh')) {
    return `Feed: ${escapeHtml(applicant.dataSource)} • Net Income ${formatEuro(applicant.netMonthlyIncome)}/mo • Rent ${formatEuro(applicant.verifiedRentPm)}/mo + Savings ${formatEuro(applicant.verifiedSavingsPm)}/mo • Debt ${formatEuro(applicant.existingDebtPm)}/mo.`;
  }
  if (name.includes('deposit') || name.includes('stress')) {
    return `Deposit Source: Savings ${formatEuro(applicant.depositSaved)}${applicant.helpToBuyGrant ? ` + HTB ${formatEuro(applicant.helpToBuyGrant)}` : ''}${applicant.giftAmount ? ` + Gift ${formatEuro(applicant.giftAmount)}` : ''} • Stress Margin: ${calc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(calc.stressMarginPm)}/mo @ ${calc.stressedRate.toFixed(2)}%.`;
  }
  if (name.includes('ber')) {
    return `SEAI Register Lookup: Rating <strong>${escapeHtml(applicant.propertyBER)}</strong> • ${calc.isGreenEligible ? `Qualifies for ${lender.greenRate.toFixed(2)}% Green EcoSaver` : `Standard ${lender.stdRate.toFixed(2)}% rate applies (requires BER B3+ for Green discount)`}.`;
  }
  return `${escapeHtml(item.detail)} • Source verified via Broc Automated Underwriting Vault.`;
}

function renderApplicantDrawer() {
  const root = document.getElementById('drawerContentRoot');
  if (!root) return;

  const s = window.portalState;
  const lender = getActiveLender();
  const applicant = getSelectedApplicant();
  const baseCalc = calculateLoanQualification(applicant, lender);
  const scenarios = getApplicantOfferScenarios(applicant, lender);
  let activeScenario = scenarios[s.selectedScenarioKey] || scenarios.STANDARD;
  if (activeScenario.isIssuable === false) {
    activeScenario = scenarios.STANDARD;
    s.selectedScenarioKey = 'STANDARD';
  }
  const scenarioCalc = activeScenario.calc;
  const dynamicPillars = getDynamicScorePillars(applicant, lender, baseCalc);

  const aipMet = applicant.aipCriteria.filter(c => c.met).length;
  const fullMet = applicant.fullCriteria.filter(c => c.met).length;
  const isNurtureBlocked = applicant.targetStage === 'NURTURE';
  const canIssueDirect = !isNurtureBlocked && scenarioCalc.passesStressTest;
  const stageCls = applicant.targetStage === 'FULL' ? 'full-ready' : applicant.targetStage === 'AIP' ? 'aip-ready' : 'remediating';
  const stageLabel = applicant.targetStage === 'FULL' ? 'B) Full Mortgage Ready' : applicant.targetStage === 'AIP' ? 'A) Instant AIP Qualified' : 'Clive AI Remediating';
  const activeConditions = s.selectedConditions[applicant.id] || [];
  const auditEntries = s.auditLog[applicant.id] || [];

  let bodyHtml = '';

  if (s.activeDrawerTab === 'SCORE') {
    bodyHtml = `
      ${isNurtureBlocked ? `
        <div class="drawer-guardrail-banner">
          <strong>⛔ Pre-Submission Hold Active:</strong> Only ${aipMet}/10 Stage A checks met. Direct AIP issuance is blocked until Clive finishes conduct remediation inside <code>app.broc.fi</code>.
        </div>
      ` : ''}

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
        ${dynamicPillars.map(p => {
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
            <div style="font-size:0.78rem;color:var(--text-muted);">
              ${escapeHtml(applicant.dataSource)} • Net Monthly Income ${formatEuro(applicant.netMonthlyIncome)} • Effective Capacity ${formatEuro(baseCalc.effectiveMonthlyCapacity)}/mo vs ${formatEuro(baseCalc.stressedMonthlyPayment)}/mo stressed (${baseCalc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(baseCalc.stressMarginPm)}/mo)
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (s.activeDrawerTab === 'ANALYTICS') {
    const maxTerm = baseCalc.seriesMaxYear || 30;
    const milestoneYears = [0, 5, 10, 15, 20, 25, maxTerm].filter((v, i, arr) => arr.indexOf(v) === i);
    bodyHtml = `
      <div class="customer-drawer-card">
        ${renderDrawerLtvAndConstraintSvg(applicant, lender)}
      </div>

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
          <strong style="font-size:0.86rem;color:var(--text-primary);">2. ${maxTerm}-Yr LTV Amortization (${applicant.termYears}-Yr Term)</strong>
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
                const pt = baseCalc.ltv30YrSeries[yr] || baseCalc.ltv30YrSeries[baseCalc.ltv30YrSeries.length - 1];
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
    const renderCriterionList = (items, prefix) => items.map((item, idx) => {
      const critKey = `${applicant.id}-${prefix}-${idx}`;
      const isExpanded = s.expandedCriteria.has(critKey);
      return `
        <div class="criterion-item expandable" onclick="toggleCriterionEvidence('${critKey}')">
          <span class="criterion-status-dot ${item.met ? 'met' : 'pending'}">${item.met ? '✓' : '•'}</span>
          <div class="criterion-content">
            <div class="criterion-head">
              <span class="criterion-title">${escapeHtml(item.name)}</span>
              <span class="criterion-cat-badge">${escapeHtml(item.cat)} ${isExpanded ? '▾' : '▸'}</span>
            </div>
            <div class="criterion-detail">${escapeHtml(item.detail)}</div>
            ${isExpanded ? `
              <div class="criterion-evidence-box" onclick="event.stopPropagation()">
                <div><strong>Audit Evidence:</strong> ${buildEvidenceSnippet(applicant, item, lender, baseCalc)}</div>
                ${!item.met ? `
                  <div style="margin-top:6px;">
                    <button class="btn-xs-pill" style="color:var(--vivien-indigo);border-color:var(--vivien-border-strong);" onclick="triggerUnderwriterAction('RFI', '${escapeHtml(item.name)}')">
                      Dispatch RFI Task to app.broc.fi →
                    </button>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    bodyHtml = `
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.8rem;">
        Click any criterion row to inspect verified underlying data or dispatch a document RFI to <code>app.broc.fi</code>.
      </div>
      <div style="margin-bottom:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;">
          <span class="policy-badge policy-badge-clause">A) MORTGAGE IN PRINCIPLE (${aipMet}/10 VERIFIED)</span>
        </div>
        <div class="criterion-list">
          ${renderCriterionList(applicant.aipCriteria, 'A')}
        </div>
      </div>

      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;">
          <span class="policy-badge policy-badge-rider">B) FULL MORTGAGE POST SALE-AGREED (${fullMet}/8 VERIFIED)</span>
        </div>
        <div class="criterion-list">
          ${renderCriterionList(applicant.fullCriteria, 'B')}
        </div>
      </div>
    `;
  } else {
    // OFFERS Tab: 3-Tile Vivien Scenario Modeler + Conditions + Audit Trail
    const tileOrder = ['STANDARD', 'GREEN_RECOMMENDED', 'CLIVE_OVERPAY'];
    bodyHtml = `
      ${isNurtureBlocked ? `
        <div class="drawer-guardrail-banner">
          <strong>⛔ Issuance Guardrail:</strong> ${escapeHtml(applicant.names)} is currently in <strong>Clive Remediation Mode</strong> (${aipMet}/10 Stage A verified). Use <em>Request Info (RFI)</em> or <em>Refer Credit Override</em> below rather than issuing an unverified AIP.
        </div>
      ` : ''}

      <div class="vivien-guidance-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.8rem;gap:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="analytics-badge is-indigo">Clive &amp; ${escapeHtml(lender.code)} Offer Modeler</span>
            <span style="font-size:0.78rem;color:var(--text-muted);">Select eligible rate tier to bind terms</span>
          </div>
          <span style="font-size:0.74rem;font-weight:700;color:${baseCalc.isGreenEligible ? 'var(--status-success-text)' : 'var(--status-warn-text)'};">BER ${escapeHtml(applicant.propertyBER)} ${baseCalc.isGreenEligible ? '• Green Eligible' : '• Std Rate Only'}</span>
        </div>

        <div class="vivien-tiles-grid">
          ${tileOrder.map(key => {
            const tile = scenarios[key];
            const isSelected = s.selectedScenarioKey === key;
            const projCls = tile.isIssuable === false ? 'is-projection-only' : '';
            return `
              <button
                type="button"
                class="vivien-price-tile ${tile.isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''} ${projCls}"
                onclick="selectDrawerScenario('${key}')"
                ${tile.isIssuable === false ? 'title="Requires BER B3+ retrofit certification before issuance"' : ''}
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

      <div class="customer-drawer-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <strong style="font-size:0.86rem;color:var(--text-primary);">Selected Offer Preview: ${escapeHtml(activeScenario.title)}</strong>
          <span class="analytics-badge is-emerald">${activeScenario.rate.toFixed(2)}% APR</span>
        </div>
        <div class="drawer-p-grid">
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Scheduled Monthly</span>
            <span class="analytics-mini-stat-val">${formatEuro(activeScenario.monthlyPayment)}/mo</span>
          </div>
          <div class="drawer-p-box ${scenarioCalc.passesStressTest ? 'is-highlight' : ''}">
            <span class="analytics-mini-stat-label" style="color:${scenarioCalc.passesStressTest ? 'var(--status-success-text)' : 'var(--status-danger-text)'};">+${lender.stressBuffer.toFixed(1)}% CBI Stress Test</span>
            <span class="analytics-mini-stat-val" style="color:${scenarioCalc.passesStressTest ? 'var(--status-success-text)' : 'var(--status-danger-text)'};">${formatEuro(activeScenario.stressedPayment)}/mo ${scenarioCalc.passesStressTest ? 'PASS' : 'FAIL'}</span>
          </div>
          <div class="drawer-p-box">
            <span class="analytics-mini-stat-label">Effective Payoff</span>
            <span class="analytics-mini-stat-val">${scenarioCalc.effectiveTermYears} Yrs (${s.selectedScenarioKey === 'CLIVE_OVERPAY' ? scenarioCalc.year10CliveLtvPct : scenarioCalc.year10LtvPct}% Yr10 LTV)</span>
          </div>
        </div>
      </div>

      <div class="customer-drawer-card">
        <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary);margin-bottom:8px;">Attach Offer Conditions Precedent (${activeConditions.length} selected)</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${STANDARD_CONDITIONS.map(cond => {
            const isActive = activeConditions.includes(cond);
            return `<button type="button" class="condition-chip-btn ${isActive ? 'active' : ''}" onclick="toggleConditionForApplicant('${applicant.id}', '${escapeHtml(cond)}')">${isActive ? '✓ ' : '+ '}${escapeHtml(cond)}</button>`;
          }).join('')}
        </div>
      </div>

      ${auditEntries.length > 0 ? `
        <div class="customer-drawer-card" style="margin-bottom:0;">
          <div style="font-weight:700;font-size:0.82rem;color:var(--text-primary);margin-bottom:8px;">Underwriter Decision Audit Trail</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:0.75rem;">
            ${auditEntries.map(ev => `
              <div style="padding:6px 8px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border-default);display:flex;justify-content:space-between;gap:8px;">
                <div><strong>${escapeHtml(ev.action)}</strong> — ${escapeHtml(ev.detail)}</div>
                <span class="font-mono" style="color:var(--text-caption);white-space:nowrap;">${escapeHtml(ev.time)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  root.innerHTML = `
    <div id="drawerHeaderBox" class="drawer-header">
      <div style="display:flex;align-items:flex-start;gap:12px;min-width:0;">
        <div class="customer-avatar" style="width:46px;height:46px;font-size:0.95rem;">${escapeHtml(getInitials(applicant.names))}</div>
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <h2 style="font-family:'Outfit',sans-serif;font-size:1.18rem;font-weight:700;margin:0;color:var(--text-primary);">${escapeHtml(applicant.names)}</h2>
            <span class="customer-stage-badge ${stageCls}"><span class="badge-dot"></span>${stageLabel}</span>
            ${getDecisionBadgeHtml(applicant.id)}
          </div>
          <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">
            <span class="font-mono">${escapeHtml(applicant.id)}</span> • ${escapeHtml(applicant.kycBadge)} • ${escapeHtml(applicant.citizenship)}
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
            📍 ${escapeHtml(applicant.targetPropertyAddress)}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
        ${window.MorganaGuidance ? window.MorganaGuidance.getDrawerMorganaHeaderPillHtml() : ''}
        <div style="text-align:right;">
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);">Broc Score</div>
          <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:700;color:var(--status-success-text);line-height:1;">${applicant.brocScore}<span style="font-size:0.75rem;font-weight:500;">/100</span></div>
        </div>
        <button class="close-icon-btn" onclick="closeApplicantDrawer()" aria-label="Close drawer">${portalIcon('close', 16)}</button>
      </div>
    </div>

    <div id="drawerMetricRibbon" class="drawer-metric-ribbon">
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">${baseCalc.loanForPricing !== baseCalc.qualifiedLoan ? 'Target Facility' : 'Qualified Loan'}</div>
        <div class="drawer-metric-val">${formatEuro(baseCalc.loanForPricing)}</div>
        ${baseCalc.loanForPricing !== baseCalc.qualifiedLoan ? `<div style="font-size:0.67rem;color:var(--text-muted);">Max Cap ${formatCompactEuro(baseCalc.qualifiedLoan)}</div>` : ''}
      </div>
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">Binding Rule</div>
        <div class="drawer-metric-val" style="font-size:0.9rem;">${escapeHtml(baseCalc.bindingLabel)}</div>
        <div style="font-size:0.67rem;color:var(--text-muted);">${baseCalc.actualLtiRatio}x / ${baseCalc.ltiMultiplier.toFixed(1)}x LTI</div>
      </div>
      <div class="drawer-metric-box">
        <div class="drawer-metric-label">Day-1 → Yr10 LTV</div>
        <div class="drawer-metric-val" style="color:var(--vivien-indigo);">${baseCalc.initialLtvPct}% → ${baseCalc.year10LtvPct}%</div>
        <div style="font-size:0.67rem;color:${baseCalc.passesStressTest ? 'var(--status-success-text)' : 'var(--status-danger-text)'};">Stress ${baseCalc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(baseCalc.stressMarginPm)}/mo</div>
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
      <button class="drawer-tab-btn ${s.activeDrawerTab === 'OFFERS' ? 'active' : ''}" onclick="switchDrawerTab('OFFERS')">AIP Offer &amp; Decisions</button>
    </div>

    <div id="drawerBodyScroll" class="drawer-body custom-scroll">
      ${window.MorganaGuidance ? window.MorganaGuidance.getDrawerMorganaBannerHtml(applicant, lender, baseCalc) : ''}
      ${bodyHtml}
    </div>

    <div id="drawerFooterBar" class="drawer-footer">
      <div class="drawer-action-row">
        <button
          class="drawer-btn-primary ${s.currentLenderId === 'BOI' ? 'is-boi' : ''}"
          onclick="triggerUnderwriterAction('APPROVE')"
          ${!canIssueDirect ? 'disabled title="Blocked while in Clive Remediation or Stress Shortfall — use RFI or Refer"' : ''}
        >
          ${portalIcon('checkCircle', 16)}
          <span>${!canIssueDirect
            ? `Blocked (${aipMet}/10 Stage A)`
            : `${applicant.targetStage === 'FULL' ? `Issue ${lender.code} Loan Offer` : `Issue ${lender.code} AIP`} (${activeScenario.rate.toFixed(2)}%)`}</span>
        </button>
        <button class="btn-pill-outline" onclick="triggerUnderwriterAction('RFI')">
          Request Info (RFI)
        </button>
        <button class="btn-pill-outline" onclick="triggerUnderwriterAction('REFER')">
          Refer Exception
        </button>
        <button class="btn-pill-outline" onclick="triggerUnderwriterAction('EXPORT')" title="Download CSV Underwriting Pack">
          ${portalIcon('download', 15)}
          <span>Export</span>
        </button>
      </div>
      <div id="actionFeedbackToast" class="action-feedback-toast" style="display:none;"></div>
    </div>
  `;
}

/* ==========================================================================
   UNDERWRITER ACTIONS & COMPLIANCE MODALS (AIP Certificate, Score, 18-Pt)
   ========================================================================== */
function triggerUnderwriterAction(type, customSubject) {
  const s = window.portalState;
  const lender = getActiveLender();
  const applicant = getSelectedApplicant();
  const scenarios = getApplicantOfferScenarios(applicant, lender);
  let chosen = scenarios[s.selectedScenarioKey] || scenarios.STANDARD;
  if (chosen.isIssuable === false) chosen = scenarios.STANDARD;
  const calc = chosen.calc;
  const conditions = s.selectedConditions[applicant.id] || [];

  if (type === 'APPROVE') {
    if (applicant.targetStage === 'NURTURE' || !calc.passesStressTest) {
      return; // Enforce guardrail
    }
    const status = conditions.length > 0
      ? 'CONDITIONAL_AIP'
      : (applicant.targetStage === 'FULL' ? 'OFFER_ISSUED' : 'AIP_ISSUED');
    s.decisions[applicant.id] = {
      status,
      rate: chosen.rate,
      amount: calc.loanForPricing,
      conditions: [...conditions]
    };
    recordAuditEvent(
      applicant.id,
      status === 'CONDITIONAL_AIP' ? 'Conditional AIP Issued' : (applicant.targetStage === 'FULL' ? 'Formal Loan Offer Issued' : 'Instant AIP Issued'),
      `${formatEuro(calc.loanForPricing)} @ ${chosen.rate.toFixed(2)}%${conditions.length ? ` (${conditions.length} condition${conditions.length === 1 ? '' : 's'})` : ''}`
    );

    const docTitle = applicant.targetStage === 'FULL' ? 'FORMAL MORTGAGE LETTER OF OFFER' : 'MORTGAGE APPROVAL IN PRINCIPLE (AIP)';
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

          <h3 style="font-family:'Outfit',sans-serif;font-size:1.3rem;font-weight:800;margin:8px 0 4px;color:${lender.color};">${docTitle}${conditions.length ? ' (CONDITIONAL)' : ''}</h3>
          <p style="font-size:0.82rem;color:#475569;margin:0;">
            Issued to <strong>${escapeHtml(applicant.names)}</strong> (${escapeHtml(applicant.county)}) following 18-point automated verification via <strong>Broc.fi (Broc Score™ ${applicant.brocScore}/100)</strong>:
          </p>

          <div class="aip-cert-metrics">
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Approved Facility</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:${lender.color};margin-top:2px;">${formatEuro(calc.loanForPricing)}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Verified Deposit / Equity</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:#059669;margin-top:2px;">${formatEuro(calc.totalDeposit)}</div>
            </div>
            <div>
              <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:#64748b;">Target Property Value</div>
              <div style="font-family:'Outfit',sans-serif;font-size:1.35rem;font-weight:800;color:#0f172a;margin-top:2px;">${formatEuro(calc.targetPropertyValue)}</div>
            </div>
          </div>

          <div class="aip-cert-terms-box">
            <div><strong>Selected Product Tier:</strong> ${escapeHtml(chosen.title)} — ${chosen.rate.toFixed(2)}% APR (${calc.effectiveTermYears} yrs • ${formatEuro(chosen.monthlyPayment)}/mo${s.selectedScenarioKey === 'CLIVE_OVERPAY' ? ` incl. +${formatEuro(calc.monthlyOverpay)}/mo Clive Overpay` : ''})</div>
            <div style="margin-top:4px;"><strong>CBI +${lender.stressBuffer.toFixed(1)}% Stress Verification:</strong> Stressed @ ${chosen.stressedRate.toFixed(2)}% (${formatEuro(chosen.stressedPayment)}/mo) vs Net Capacity ${formatEuro(calc.effectiveMonthlyCapacity)}/mo — <strong>PASSED (+${formatEuro(calc.stressMarginPm)}/mo)</strong></div>
            ${conditions.length > 0 ? `<div style="margin-top:4px;"><strong>Conditions Precedent:</strong> ${conditions.map(c => escapeHtml(c)).join(' • ')}</div>` : ''}
            <div style="margin-top:4px;"><strong>Instant Consumer Delivery:</strong> Dispatched straight into <strong>${escapeHtml(applicant.names)}</strong>'s <code>https://app.broc.fi</code> workspace.</div>
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
    renderAll();
    const toast = document.getElementById('actionFeedbackToast');
    if (toast) {
      toast.style.display = 'block';
      toast.textContent = `✅ ${lender.shortName} ${applicant.targetStage === 'FULL' ? 'Formal Offer' : 'AIP'} (${formatEuro(calc.loanForPricing)} @ ${chosen.rate.toFixed(2)}%) issued & logged.`;
    }
  } else if (type === 'RFI') {
    const subject = customSubject || 'Updated Payslip / Conduct Verification';
    s.decisions[applicant.id] = { status: 'RFI_SENT' };
    recordAuditEvent(applicant.id, 'RFI Dispatched', `Task sent to app.broc.fi: ${subject}`);
    renderAll();
    const toast = document.getElementById('actionFeedbackToast');
    if (toast) {
      toast.style.display = 'block';
      toast.textContent = `📨 RFI dispatched to ${applicant.names}'s app.broc.fi Tasks (${subject}).`;
    }
  } else if (type === 'REFER') {
    s.decisions[applicant.id] = { status: 'REFERRED' };
    recordAuditEvent(applicant.id, 'Referred to Senior Credit', `Flagged for manual / CBI LTI exception review (${calc.actualLtiRatio}x LTI)`);
    renderAll();
    const toast = document.getElementById('actionFeedbackToast');
    if (toast) {
      toast.style.display = 'block';
      toast.textContent = `⚖️ File ${applicant.id} referred to Senior Credit Committee for exception review.`;
    }
  } else {
    exportApplicantsCsv([applicant], applicant.id.toLowerCase());
    recordAuditEvent(applicant.id, '18-Pt Pack Exported', `Downloaded CSV summary for ${lender.shortName}`);
    renderAll();
    const toast = document.getElementById('actionFeedbackToast');
    if (toast) {
      toast.style.display = 'block';
      toast.textContent = `📦 Downloaded underwriting pack CSV for ${applicant.id}.`;
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
        <button class="btn-vivien-pill-primary" style="padding:0.35rem 0.85rem;font-size:0.76rem;" onclick="closeRuleDetailModal(); openAssistantWithPrompt('Explain Selected +2% Stress Pass');">Ask Morgana →</button>
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
  renderSidebarAndChrome();
  if (window.MorganaGuidance) {
    window.MorganaGuidance.renderMorganaHelpUI();
  }

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
    if (window.MorganaGuidance && window.MorganaGuidance.isTourOpen()) {
      window.MorganaGuidance.stopTour();
      return;
    }
    if (typeof closeChatHelpModal === 'function') closeChatHelpModal();
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
  document.documentElement.classList.remove('dark');
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem('broc_portal_theme');
  } catch (e) {}
  renderAll();
});
