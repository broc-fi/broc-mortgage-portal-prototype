/* ==========================================================================
   Broc. For Lenders — Morgana Help, Live Contextual Analysis & Guided Tours
   Modeled on broc-web-app's signature Help Pill, Progressive Disclosure
   Banner, Interactive Cheat Sheet, and SVG Spotlight Guided Tour Manager.
   ========================================================================== */

(function () {
  const STORAGE_PREFIX = 'broc_lender_help_expanded_';

  const guidanceState = {
    helpExpandedByView: {
      overview: false,
      pipeline: false,
      rules: false,
      analytics: false
    },
    drawerHelpExpanded: false,
    activeDisclosureByView: {},
    activeDrawerDisclosure: null
  };

  function getStoredExpanded(viewName) {
    try {
      const saved = sessionStorage.getItem(STORAGE_PREFIX + viewName);
      if (saved === 'true') return true;
      if (saved === 'false') return false;
    } catch (e) {}
    return Boolean(guidanceState.helpExpandedByView[viewName]);
  }

  function setStoredExpanded(viewName, expanded) {
    guidanceState.helpExpandedByView[viewName] = Boolean(expanded);
    try {
      sessionStorage.setItem(STORAGE_PREFIX + viewName, expanded ? 'true' : 'false');
    } catch (e) {}
  }

  function isViewHelpExpanded(viewName) {
    return getStoredExpanded(viewName);
  }

  function toggleViewHelpBanner(forceState) {
    const viewName = (window.portalState && window.portalState.activeView) || 'overview';
    const next = typeof forceState === 'boolean' ? forceState : !isViewHelpExpanded(viewName);
    setStoredExpanded(viewName, next);
    renderMorganaHelpUI();
  }

  function toggleDrawerHelpBanner(forceState) {
    guidanceState.drawerHelpExpanded = typeof forceState === 'boolean'
      ? forceState
      : !guidanceState.drawerHelpExpanded;
    if (typeof renderApplicantDrawer === 'function') {
      renderApplicantDrawer();
    }
  }

  function toggleDisclosureChip(key, isDrawer) {
    if (isDrawer) {
      guidanceState.activeDrawerDisclosure =
        guidanceState.activeDrawerDisclosure === key ? null : key;
      if (typeof renderApplicantDrawer === 'function') renderApplicantDrawer();
      return;
    }
    const viewName = (window.portalState && window.portalState.activeView) || 'overview';
    guidanceState.activeDisclosureByView[viewName] =
      guidanceState.activeDisclosureByView[viewName] === key ? null : key;
    renderMorganaHelpUI();
  }

  /* ========================================================================
     1. Live View Analysis Content Builder (Computed from Engine State)
     ======================================================================== */
  function getViewHelpConfig(viewName) {
    const s = window.portalState || {};
    const dataset = getActiveDataset();
    const lender = getActiveLender();
    const baseLender = LENDERS[s.currentLenderId || 'BOI'];
    const macro = getMacroScenario();
    const stats = computeCohortSummary(dataset, lender);
    const cbi = computeCbiExceptionMetrics(dataset, lender);
    const filtered = getFilteredApplicants();
    const activeCohort = filtered.length > 0 ? filtered : dataset;
    const filteredStats = computeCohortSummary(activeCohort, lender);
    const priorityTop = [...dataset].sort((a, b) => b.brocScore - a.brocScore)[0];
    const topCalc = priorityTop ? calculateLoanQualification(priorityTop, lender) : null;
    const decisionsCount = Object.keys(s.decisions || {}).length;

    if (viewName === 'pipeline') {
      const ltiBound = activeCohort.filter(a => calculateLoanQualification(a, lender).bindingConstraint === 'LTI').length;
      const depBound = activeCohort.filter(a => calculateLoanQualification(a, lender).bindingConstraint === 'DEPOSIT_LTV').length;
      const ndiBound = activeCohort.filter(a => calculateLoanQualification(a, lender).bindingConstraint === 'STRESS_NDI').length;
      const stamp4Count = activeCohort.filter(a => /stamp 4|critical skills/i.test(a.citizenship)).length;

      return {
        badge: `Morgana • Live Pipeline Analysis (${filtered.length} of ${dataset.length})`,
        summaryHtml: `Reviewing <strong>${filtered.length}</strong> ${s.currentDatasetMode === 'CURATED_7' ? 'curated showcase' : 'monthly volume'} packs under <strong>${escapeHtml(lender.shortName)}</strong> (${lender.greenRate.toFixed(2)}% Green / +${lender.stressBuffer.toFixed(1)}% stress). <strong>${filteredStats.fullReady + filteredStats.aipReady}</strong> are credit-cleared, while <strong>${filteredStats.nurtureCount}</strong> remain protected in Clive remediation.`,
        disclosures: [
          {
            id: 'pipe_caps',
            label: 'Binding Cap Mix',
            body: `Across the active cohort, <strong>${ltiBound}</strong> borrowers are capped by CBI LTI (4.0x FTB / 3.5x SSB), <strong>${depBound}</strong> by 90% LTV deposit ceiling, and <strong>${ndiBound}</strong> by the +${lender.stressBuffer.toFixed(1)}% stressed NDI affordability buffer.`
          },
          {
            id: 'pipe_cohorts',
            label: 'Stamp 4 & Churn Watch',
            body: `<strong>${stamp4Count}</strong> pack${stamp4Count === 1 ? '' : 's'} hold pre-verified Non-EEA Stamp 4 IRP / Critical Skills status, and <strong>${filteredStats.highChurnCount}</strong> switcher file${filteredStats.highChurnCount === 1 ? '' : 's'} sit above the 30% fixed-cliff hazard threshold.`
          },
          {
            id: 'pipe_actions',
            label: 'Session Audit Status',
            body: `<strong>${decisionsCount}</strong> underwriter decision${decisionsCount === 1 ? '' : 's'} logged this session. Use the table checkboxes to batch-approve eligible AIP/Full packs or export redacted underwriting CSVs.`
          }
        ]
      };
    }

    if (viewName === 'rules') {
      const baseStats = computeCohortSummary(dataset, baseLender);
      const volDelta = stats.totalLoan - baseStats.totalLoan;
      const passDelta = stats.stressPassCount - baseStats.stressPassCount;
      const hasOverrides = Object.keys((s.policyOverrides && s.policyOverrides[s.currentLenderId]) || {}).length > 0;

      return {
        badge: `Morgana • Credit Policy Intelligence (${escapeHtml(lender.code)})`,
        summaryHtml: hasOverrides
          ? `Simulated policy overrides active for <strong>${escapeHtml(lender.shortName)}</strong>: qualified cohort volume is <strong>${formatCompactEuro(stats.totalLoan)}</strong> (<span style="color:${volDelta >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)'};font-weight:700;">${volDelta >= 0 ? '+' : ''}${formatCompactEuro(volDelta)}</span> vs baseline) with <strong>${stats.stressPassCount}/${dataset.length}</strong> passing stressed NDI (${passDelta >= 0 ? '+' : ''}${passDelta}).`
          : `All <strong>23 underwriting criteria</strong> active for <strong>${escapeHtml(lender.shortName)}</strong>: 5 deterministic Broc Score™ pillars (0–100), 10 core Stage A (AIP) checks, and 8 post-Sale-Agreed Stage B settlement riders.`,
        disclosures: [
          {
            id: 'rules_sim',
            label: 'Live Slider Sensitivity',
            body: `Current policy recognizes <strong>${Math.round(lender.maxVariableBonusPct * 100)}%</strong> of variable bonus/RSU pay, stresses repayments at Rate + <strong>${lender.stressBuffer.toFixed(1)}%</strong>, and tests couple NDI against <strong>${formatEuro(lender.livingCostCouple)}/mo</strong> living costs.`
          },
          {
            id: 'rules_gates',
            label: 'Stage A vs Stage B Gate',
            body: `Stage A verifies Identity, Citizenship/Stamp 4, Address, PPSN, CCR Bureau, Permanent PAYE, Revenue EDS, 6-Mo Statements, Account Conduct, and Deposit AML. Stage B adds Salary Cert, Valuation, BER, Survey, Solicitor Undertaking &amp; Protection.`
          },
          {
            id: 'rules_wl',
            label: 'BOI vs White-Label Spread',
            body: `Switch tenant in the Demo Controls dock to compare BOI (<strong>${LENDERS.BOI.greenRate.toFixed(2)}%</strong> Green, 25% bonus) against Broc White-Label (<strong>${LENDERS.WHITELABEL.greenRate.toFixed(2)}%</strong> Green, 50% bonus recognition).`
          }
        ]
      };
    }

    if (viewName === 'analytics') {
      const scopeLabel = s.analyticsScope === 'APPLICANT'
        ? `${getSelectedApplicant().names} (${getSelectedApplicant().id})`
        : `${activeCohort.length}-Pack Cohort`;
      const hpiAnnualPct = ((macro.hpiAnnual || 0) * 100);
      const rateAddonVal = Number(macro.rateAddon || 0);
      const yr1Note = macro.yr1Shock ? `, ${(macro.yr1Shock * 100).toFixed(0)}% Yr1 shock` : '';
      return {
        badge: `Morgana • Portfolio Analytics (${escapeHtml(macro.label)})`,
        summaryHtml: `Analyzing <strong>${escapeHtml(scopeLabel)}</strong> under <strong>${escapeHtml(macro.label)}</strong> (${hpiAnnualPct >= 0 ? '+' : ''}${hpiAnnualPct.toFixed(1)}% HPI/yr${yr1Note} / ${rateAddonVal >= 0 ? '+' : ''}${rateAddonVal.toFixed(2)}% rate shift). Broc pre-packaging lifts average readiness from <strong>${stats.avgScore - stats.avgGain}</strong> → <strong>${stats.avgScore}/100</strong> while cutting 5-yr churn hazard from <strong>${stats.avgChurn}% → ${stats.avgManagedChurn}%</strong>.`,
        disclosures: [
          {
            id: 'ana_fan',
            label: 'P10–P90 Stress Variance',
            body: `Forecast grant capacity spans <strong>${formatCompactEuro(filteredStats.totalLow)}</strong> (P10 Stressed) to <strong>${formatCompactEuro(filteredStats.totalHigh)}</strong> (P90 Clive + CBI exception upside), centered on <strong>${formatCompactEuro(filteredStats.totalLoan)}</strong> base qualified volume.`
          },
          {
            id: 'ana_ltv',
            label: 'Day-1 → Yr 10 Equity Buffer',
            body: `Weighted LTV amortizes from <strong>${filteredStats.avgInitLtv}%</strong> at origination to <strong>${filteredStats.avgYr10Ltv}%</strong> by Year 10 under ${escapeHtml(macro.label)}, keeping book risk well below standard Irish loss-given-default ceilings.`
          },
          {
            id: 'ana_pd',
            label: '12-Mo Default Compression',
            body: `Clara's 6-month conduct screening and Clive's overdraft/BNPL remediation compress portfolio 12-month Probability of Default to <strong>${filteredStats.avgPdBps} bps (${(filteredStats.avgPdBps / 100).toFixed(2)}%)</strong> across <strong>${filteredStats.greenCount}</strong> Green BER A1–B3 eligible loans.`
          }
        ]
      };
    }

    // Default: Overview
    const ftbHeadroom = (cbi.ftbAllowanceCapPct - cbi.ftbUsedPct).toFixed(1);
    const ssbHeadroom = (cbi.ssbAllowanceCapPct - cbi.ssbUsedPct).toFixed(1);
    return {
      badge: `Morgana • Underwriting Desk Brief (${escapeHtml(lender.code)})`,
      summaryHtml: `<strong>${escapeHtml(lender.shortName)}</strong> holds <strong>${formatCompactEuro(stats.totalLoan)}</strong> across <strong>${dataset.length} pre-verified packs</strong> (avg Broc Score <strong>${stats.avgScore}/100</strong>, weighted PD <strong>${stats.avgPdBps} bps</strong>). <strong>${stats.fullReady + stats.aipReady}</strong> packs are immediately actionable, led by <strong>${escapeHtml(priorityTop?.names || 'Sarah & Liam O\'Connor')}</strong>${topCalc ? ` (${formatEuro(topCalc.loanForPricing)} @ Score ${priorityTop.brocScore}/100)` : ''}.`,
      disclosures: [
        {
          id: 'ov_nii',
          label: 'Liquidity & 10-Yr NII',
          body: `Base qualified lending is <strong>${formatCompactEuro(stats.totalLoan)}</strong> (P10–P90: ${formatCompactEuro(stats.totalLow)}–${formatCompactEuro(stats.totalHigh)}), generating an estimated <strong>${formatCompactEuro(stats.totalNii)}</strong> in 10-Year Net Interest Income at a 185 bps margin.`
        },
        {
          id: 'ov_cbi',
          label: 'CBI Allowance Headroom',
          body: `FTB LTI (&gt;4.0x) exception usage sits at <strong>${cbi.ftbUsedPct}% / ${cbi.ftbAllowanceCapPct.toFixed(0)}% Cap</strong> (${ftbHeadroom}% headroom), while Mover SSB (&gt;3.5x) sits at <strong>${cbi.ssbUsedPct}% / ${cbi.ssbAllowanceCapPct.toFixed(0)}% Cap</strong> (${ssbHeadroom}% headroom).`
        },
        {
          id: 'ov_green',
          label: 'Green BER & Retention Split',
          body: `<strong>${stats.greenCount} of ${stats.count}</strong> packs qualify for the <strong>${lender.greenRate.toFixed(2)}%</strong> EcoSaver BER A1–B3 rate. Continuous Broc Re-Fix monitoring lowers 5-year switcher churn from <strong>${stats.avgChurn}% → ${stats.avgManagedChurn}%</strong>.`
        }
      ]
    };
  }

  /* ========================================================================
     2. Build Header Pill & Expandable Banner DOM
     ======================================================================== */
  function buildExpandedBannerHtml(config, contextKey, isDrawer) {
    const activeKey = isDrawer
      ? guidanceState.activeDrawerDisclosure
      : guidanceState.activeDisclosureByView[contextKey];
    const activeChip = config.disclosures.find(d => d.id === activeKey) || null;
    const insightsAction = isDrawer
      ? `startMorganaApplicantInsights()`
      : `startMorganaInsightsTour('${contextKey}')`;
    const tourAction = isDrawer
      ? `startMorganaApplicantTour()`
      : `startMorganaPageTour('${contextKey}')`;
    const minAction = isDrawer
      ? `toggleDrawerHelpBanner(false)`
      : `toggleViewHelpBanner(false)`;

    return `
      <div class="assistant-signature-banner morgana-banner ${isDrawer ? 'in-drawer' : ''}" id="${isDrawer ? 'drawerMorganaBanner' : 'morganaSignatureBanner'}">
        <div class="banner-avatar-container">
          <img src="assets/images/avatars/morgana.png" alt="Morgana" class="banner-avatar" />
        </div>
        <div class="banner-content-col">
          <div class="banner-kicker-row">
            <span class="banner-kicker-pill">${escapeHtml(config.badge)}</span>
          </div>
          <div class="banner-text">${config.summaryHtml}</div>
          ${config.disclosures && config.disclosures.length ? `
            <div class="banner-disclosures">
              <div class="banner-disclosure-chips-row">
                ${config.disclosures.map(d => {
                  const isActive = activeChip && activeChip.id === d.id;
                  return `
                    <button
                      type="button"
                      class="banner-disclosure-chip ${isActive ? 'active' : ''}"
                      onclick="toggleMorganaDisclosure('${d.id}', ${isDrawer ? 'true' : 'false'})"
                      aria-expanded="${isActive ? 'true' : 'false'}"
                    >
                      <span>${escapeHtml(d.label)}</span>
                      <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                  `;
                }).join('')}
              </div>
              ${activeChip ? `<div class="banner-disclosure-body">${activeChip.body}</div>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="banner-actions">
          <button type="button" class="banner-tour-pill-btn primary" onclick="${insightsAction}" title="${isDrawer ? 'Run Live File Analysis' : 'Run Live Portfolio Insights'}">
            ${portalIcon('sparkles', 13)}
            <span>${isDrawer ? 'Analyze File' : 'Show Insights'}</span>
          </button>
          <button type="button" class="banner-tour-pill-btn secondary" onclick="${tourAction}" title="Give me a guided spotlight tour">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <span>${isDrawer ? 'Tour 360° File' : 'Give me a Tour'}</span>
          </button>
          <button type="button" class="banner-toggle-minimize-btn" onclick="${minAction}" title="Collapse Help Banner" aria-label="Minimize Morgana Help Banner">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
        </div>
      </div>
    `;
  }

  function renderMorganaHelpUI() {
    const viewName = (window.portalState && window.portalState.activeView) || 'overview';
    const expanded = isViewHelpExpanded(viewName);
    const anchorEl = document.getElementById('morganaHelpHeaderAnchor');
    const slotEl = document.getElementById('morganaBannerSlot');
    if (!anchorEl || !slotEl) return;

    if (!expanded) {
      anchorEl.innerHTML = `
        <button
          id="morganaHelpPill"
          type="button"
          class="morgana-help-pill"
          onclick="toggleMorganaHelp(true)"
          title="Help • Morgana Live Analysis &amp; Page Tour"
          aria-expanded="false"
        >
          <img src="assets/images/avatars/morgana.png" alt="Morgana" class="morgana-help-pill-avatar" />
          <span class="morgana-help-pill-label">Help</span>
        </button>
      `;
      slotEl.innerHTML = '';
      slotEl.classList.remove('has-banner');
    } else {
      const cfg = getViewHelpConfig(viewName);
      anchorEl.innerHTML = `
        <button
          id="morganaHelpGhostPill"
          type="button"
          class="morgana-help-ghost-pill"
          onclick="toggleMorganaHelp(false)"
          title="Minimize Morgana Help Banner"
          aria-expanded="true"
        >
          <span class="ghost-pill-avatar-ring"></span>
          <span class="ghost-pill-label">Hide Help</span>
        </button>
      `;
      slotEl.innerHTML = buildExpandedBannerHtml(cfg, viewName, false);
      slotEl.classList.add('has-banner');
    }
  }

  function getDrawerMorganaHeaderPillHtml() {
    if (!guidanceState.drawerHelpExpanded) {
      return `
        <button
          id="drawerMorganaHelpPill"
          type="button"
          class="morgana-help-pill is-compact"
          onclick="toggleDrawerHelpBanner(true)"
          title="Help • Analyze File &amp; Tour 360° Drawer"
          aria-expanded="false"
        >
          <img src="assets/images/avatars/morgana.png" alt="Morgana" class="morgana-help-pill-avatar" />
          <span class="morgana-help-pill-label">Help</span>
        </button>
      `;
    }
    return `
      <button
        id="drawerMorganaHelpGhost"
        type="button"
        class="morgana-help-ghost-pill is-compact"
        onclick="toggleDrawerHelpBanner(false)"
        title="Hide File Analysis Banner"
        aria-expanded="true"
      >
        <span class="ghost-pill-avatar-ring"></span>
        <span class="ghost-pill-label">Hide Help</span>
      </button>
    `;
  }

  function getDrawerMorganaBannerHtml(applicant, lender, baseCalc) {
    if (!guidanceState.drawerHelpExpanded || !applicant || !baseCalc) return '';
    const aipMet = applicant.aipCriteria.filter(c => c.met).length;
    const fullMet = applicant.fullCriteria.filter(c => c.met).length;
    const isBlocked = applicant.targetStage === 'NURTURE' || !baseCalc.passesStressTest;

    const cfg = {
      badge: `Morgana • File Assessment (${escapeHtml(applicant.id)})`,
      summaryHtml: isBlocked
        ? `<strong>${escapeHtml(applicant.names)}</strong> scores <strong>${applicant.brocScore}/100</strong> (${aipMet}/10 Stage A checks met). Direct AIP is locked under Broc policy guardrails until Clive completes account remediation or NDI stress margin turns positive.`
        : `<strong>${escapeHtml(applicant.names)}</strong> clears <strong>${aipMet}/10 Stage A</strong> checks (${aipMet + fullMet}/18 total) with a <strong>${formatEuro(baseCalc.loanForPricing)}</strong> qualified facility. Primary limiter is <strong>${escapeHtml(baseCalc.bindingLabel)}</strong> at <strong>${baseCalc.initialLtvPct}% LTV</strong>.`,
      disclosures: [
        {
          id: 'drw_stress',
          label: 'Affordability & NDI',
          body: `Recognized income is <strong>${formatEuro(baseCalc.recognizedIncome)}/yr</strong> (${baseCalc.actualLtiRatio}x LTI vs ${baseCalc.ltiMultiplier.toFixed(1)}x limit). Stressed monthly capacity margin is <strong>${baseCalc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(baseCalc.stressMarginPm)}/mo</strong> at ${baseCalc.stressedRate.toFixed(2)}%.`
        },
        {
          id: 'drw_uplift',
          label: 'Clara & Clive Uplift',
          body: `Automated hygiene &amp; savings sweeping lifted score from <strong>${applicant.brocScoreBefore} → ${applicant.brocScore}/100</strong>, unlocking <strong>+${formatEuro(baseCalc.cliveLoanBoost)}</strong> additional borrowing power.`
        },
        {
          id: 'drw_rate',
          label: 'Green BER & Retention',
          body: `BER <strong>${escapeHtml(applicant.propertyBER)}</strong> ${baseCalc.isGreenEligible ? `qualifies for the <strong>${lender.greenRate.toFixed(2)}%</strong> Green EcoSaver rate` : `uses Standard <strong>${lender.stdRate.toFixed(2)}%</strong> rate`}. 5-yr churn drops from <strong>${baseCalc.churnRisk5YrPct}% → ${baseCalc.churnRiskManagedPct}%</strong> w/ Broc Re-Fix.`
        }
      ]
    };

    return buildExpandedBannerHtml(cfg, 'drawer', true);
  }

  /* ========================================================================
     3. Spotlight & Guided Tour Engine (Mirrors GuidedTourManager + AIPointing)
     ======================================================================== */
  const TourEngine = {
    tour: null,
    stepIndex: 0,
    overlayEl: null,
    rafId: null,
    trackingBound: null,

    start(tourDef) {
      if (!tourDef || !Array.isArray(tourDef.steps) || tourDef.steps.length === 0) return;
      this.cleanup(true);
      this.tour = tourDef;
      this.stepIndex = 0;

      if (!this.overlayEl) {
        this.overlayEl = document.createElement('div');
        this.overlayEl.id = 'morganaTourOverlay';
        this.overlayEl.className = 'ai-pointer-overlay morgana-tour-overlay';
        document.documentElement.appendChild(this.overlayEl);
      }

      this.trackingBound = () => this.reposition();
      window.addEventListener('resize', this.trackingBound, { passive: true });
      window.addEventListener('scroll', this.trackingBound, true);

      this.showStep(0);
    },

    findStepElement(step) {
      if (!step) return null;
      if (step.selector) {
        const el = document.querySelector(step.selector);
        if (el) return el;
      }
      if (step.elementId) {
        return document.getElementById(step.elementId);
      }
      return null;
    },

    showStep(idx) {
      if (!this.tour) return;
      const steps = this.tour.steps;
      if (idx < 0 || idx >= steps.length) {
        this.end();
        return;
      }

      this.stepIndex = idx;
      const step = steps[idx];
      const el = this.findStepElement(step);

      if (!el || el.offsetParent === null && window.getComputedStyle(el).position !== 'fixed') {
        if (idx < steps.length - 1) {
          this.showStep(idx + 1);
        } else {
          this.end();
        }
        return;
      }

      const isFixedTarget = window.getComputedStyle(el).position === 'fixed' || Boolean(el.closest('.lender-sidebar'));
      if (!isFixedTarget) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }

      setTimeout(() => {
        if (!this.tour) return;
        this.renderStepOverlay(el, step, idx);
        requestAnimationFrame(() => {
          if (this.overlayEl) this.overlayEl.classList.add('visible');
        });
      }, isFixedTarget ? 20 : 160);
    },

    getVisibleRect(el) {
      const r = el.getBoundingClientRect();
      const pad = 6;
      const left = Math.max(4, r.left - pad);
      const top = Math.max(4, r.top - pad);
      const right = Math.min(window.innerWidth - 4, r.right + pad);
      const bottom = Math.min(window.innerHeight - 4, r.bottom + pad);
      return {
        left,
        top,
        width: Math.max(24, right - left),
        height: Math.max(24, bottom - top)
      };
    },

    computeCalloutPos(frame, cardW, cardH) {
      const margin = 16;
      const gap = 18;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const clampX = x => Math.max(margin, Math.min(x, vw - cardW - margin));
      const clampY = y => Math.max(margin, Math.min(y, vh - cardH - margin));

      // Prefer below
      if (frame.top + frame.height + gap + cardH <= vh - margin) {
        return { x: clampX(frame.left + frame.width / 2 - cardW / 2), y: frame.top + frame.height + gap };
      }
      // Prefer above
      if (frame.top - gap - cardH >= margin) {
        return { x: clampX(frame.left + frame.width / 2 - cardW / 2), y: frame.top - gap - cardH };
      }
      // Try left (great for right-hand drawer footer/ribbon)
      if (frame.left - gap - cardW >= margin) {
        return { x: frame.left - gap - cardW, y: clampY(frame.top + frame.height / 2 - cardH / 2) };
      }
      // Try right (great for left sidebar items)
      if (frame.left + frame.width + gap + cardW <= vw - margin) {
        return { x: frame.left + frame.width + gap, y: clampY(frame.top + frame.height / 2 - cardH / 2) };
      }
      // Fallback anchored top/bottom center
      return {
        x: Math.round((vw - cardW) / 2),
        y: Math.max(margin, vh - cardH - margin)
      };
    },

    renderStepOverlay(el, step, idx) {
      if (!this.overlayEl || !this.tour) return;
      const frame = this.getVisibleRect(el);
      const total = this.tour.steps.length;
      const isFirst = idx === 0;
      const isLast = idx === total - 1;
      const isInsights = this.tour.mode === 'insights';
      const cardW = Math.min(340, window.innerWidth - 32);
      const cardH = 220;
      const pos = this.computeCalloutPos(frame, cardW, cardH);

      const dotsHtml = Array.from({ length: total }, (_, i) =>
        `<span class="guidance-step-dot ${i === idx ? 'active' : i < idx ? 'done' : ''}"></span>`
      ).join('');

      this.overlayEl.style.display = 'block';
      this.overlayEl.innerHTML = `
        <div class="ai-pointer-backdrop" onclick="stopMorganaTour()">
          <svg class="ai-pointer-spotlight-svg" width="100%" height="100%" style="position:absolute;inset:0;pointer-events:none;">
            <defs>
              <mask id="morgana-spotlight-mask">
                <rect width="100%" height="100%" fill="white"></rect>
                <rect
                  id="morganaMaskCutout"
                  x="${frame.left}"
                  y="${frame.top}"
                  width="${frame.width}"
                  height="${frame.height}"
                  rx="14"
                  ry="14"
                  fill="black"
                ></rect>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.56)" mask="url(#morgana-spotlight-mask)"></rect>
          </svg>
        </div>

        <div
          id="morganaSpotlightRing"
          class="ai-pointer-highlight morgana pulse"
          style="left:${frame.left}px;top:${frame.top}px;width:${frame.width}px;height:${frame.height}px;"
        ></div>

        <div
          id="morganaTourCard"
          class="guidance-tour-card morgana"
          style="left:${pos.x}px;top:${pos.y}px;width:${cardW}px;"
          onclick="event.stopPropagation()"
        >
          <div class="guidance-tour-header">
            <img src="assets/images/avatars/morgana.png" alt="Morgana" class="guidance-tour-avatar" />
            <div class="guidance-tour-info">
              <div class="guidance-tour-name-row">
                <span class="guidance-tour-name">Morgana</span>
                <span class="guidance-mode-tag">${isInsights ? 'Live Analysis' : 'Page Tour'}</span>
              </div>
              <div class="guidance-tour-step-counter">
                <span>Step ${idx + 1} of ${total} • ${escapeHtml(step.title)}</span>
              </div>
            </div>
            <button type="button" class="close-icon-btn" style="width:26px;height:26px;font-size:0.75rem;" onclick="stopMorganaTour()" aria-label="Close tour">✕</button>
          </div>

          <div class="guidance-tour-message">${step.message}</div>

          <div class="guidance-tour-progress-row">
            <div class="guidance-step-dots">${dotsHtml}</div>
            ${step.chatPrompt ? `
              <button type="button" class="guidance-ask-chat-link" onclick="askMorganaFromTour('${escapeHtml(step.chatPrompt)}')">
                Ask Morgana in Chat →
              </button>
            ` : ''}
          </div>

          <div class="guidance-tour-actions">
            ${!isFirst
              ? `<button type="button" class="guidance-tour-btn secondary" onclick="prevMorganaTourStep()">← Previous</button>`
              : `<button type="button" class="guidance-tour-skip" onclick="stopMorganaTour()">Skip tour</button>`
            }
            <div class="guidance-tour-nav">
              ${!isFirst ? `<button type="button" class="guidance-tour-skip" style="margin-right:8px;" onclick="stopMorganaTour()">Skip</button>` : ''}
              <button type="button" class="guidance-tour-btn primary" onclick="nextMorganaTourStep()">
                ${isLast ? 'Done ✓' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      `;

      // Re-measure actual rendered card height to ensure zero viewport edge clip
      requestAnimationFrame(() => {
        const cardEl = document.getElementById('morganaTourCard');
        if (!cardEl) return;
        const cardRect = cardEl.getBoundingClientRect();
        const refined = this.computeCalloutPos(frame, cardRect.width, cardRect.height);
        cardEl.style.left = refined.x + 'px';
        cardEl.style.top = refined.y + 'px';
      });
    },

    reposition() {
      if (!this.tour || !this.overlayEl) return;
      if (this.rafId) return;
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        if (!this.tour) return;
        const step = this.tour.steps[this.stepIndex];
        const el = this.findStepElement(step);
        if (!el) return;
        const frame = this.getVisibleRect(el);
        const cutout = document.getElementById('morganaMaskCutout');
        const ring = document.getElementById('morganaSpotlightRing');
        const card = document.getElementById('morganaTourCard');
        if (cutout) {
          cutout.setAttribute('x', frame.left);
          cutout.setAttribute('y', frame.top);
          cutout.setAttribute('width', frame.width);
          cutout.setAttribute('height', frame.height);
        }
        if (ring) {
          ring.style.left = frame.left + 'px';
          ring.style.top = frame.top + 'px';
          ring.style.width = frame.width + 'px';
          ring.style.height = frame.height + 'px';
        }
        if (card) {
          const r = card.getBoundingClientRect();
          const pos = this.computeCalloutPos(frame, r.width, r.height);
          card.style.left = pos.x + 'px';
          card.style.top = pos.y + 'px';
        }
      });
    },

    next() {
      if (!this.tour) return;
      if (this.stepIndex < this.tour.steps.length - 1) {
        this.showStep(this.stepIndex + 1);
      } else {
        this.end();
      }
    },

    prev() {
      if (!this.tour || this.stepIndex <= 0) return;
      this.showStep(this.stepIndex - 1);
    },

    end() {
      this.cleanup(false);
    },

    cleanup(immediate) {
      this.tour = null;
      if (this.trackingBound) {
        window.removeEventListener('resize', this.trackingBound);
        window.removeEventListener('scroll', this.trackingBound, true);
        this.trackingBound = null;
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.overlayEl) {
        this.overlayEl.classList.remove('visible');
        const elRef = this.overlayEl;
        if (immediate) {
          elRef.style.display = 'none';
          elRef.innerHTML = '';
        } else {
          setTimeout(() => {
            if (!this.tour && elRef) {
              elRef.style.display = 'none';
              elRef.innerHTML = '';
            }
          }, 220);
        }
      }
    }
  };

  /* ========================================================================
     4. Concrete Tour & Insights Definitions Per View
     ======================================================================== */
  function startMorganaInsightsTour(viewName) {
    const targetView = viewName || (window.portalState && window.portalState.activeView) || 'overview';
    if (window.portalState && window.portalState.activeView !== targetView) {
      switchView(targetView);
    }

    const s = window.portalState || {};
    const dataset = getActiveDataset();
    const lender = getActiveLender();
    const baseLender = LENDERS[s.currentLenderId || 'BOI'];
    const macro = getMacroScenario();
    const stats = computeCohortSummary(dataset, lender);
    const cbi = computeCbiExceptionMetrics(dataset, lender);
    const filtered = getFilteredApplicants();
    const activeCohort = filtered.length > 0 ? filtered : dataset;
    const filteredStats = computeCohortSummary(activeCohort, lender);
    const priorityTop = [...dataset].sort((a, b) => b.brocScore - a.brocScore)[0];
    const topCalc = priorityTop ? calculateLoanQualification(priorityTop, lender) : null;

    if (targetView === 'pipeline') {
      TourEngine.start({
        name: 'morgana-pipeline-insights',
        mode: 'insights',
        steps: [
          {
            elementId: 'pipelineKpiGrid',
            title: 'Filtered Cohort Metrics',
            message: `This active slice of <strong>${filteredStats.count} pack${filteredStats.count === 1 ? '' : 's'}</strong> carries an average Broc Score™ of <strong>${filteredStats.avgScore}/100</strong> (+${filteredStats.avgGain} pts via Clive) and <strong>${formatCompactEuro(filteredStats.totalLoan)}</strong> in base lending volume.`,
            chatPrompt: 'Fast-Track Score 90+'
          },
          {
            elementId: 'pipelineControlsBar',
            title: 'Stage & Risk Segmentation',
            message: `Click stacked preset chips to isolate <strong>${filteredStats.greenCount} Green BER A1–B3</strong> files, <strong>Score 90+</strong> fast-tracks, or <strong>Churn ≥30%</strong> retention accounts right before opening full 360° inspections.`,
            chatPrompt: 'Churn Watchlist (≥30%)'
          },
          {
            elementId: 'pipelineTableContainer',
            title: 'Underwriter Queue Readiness',
            message: `Every row pre-calculates Day-1 → Yr 10 LTV, 5-year switcher churn hazard, and Stage A/B completeness. Select multiple eligible rows via checkboxes to batch-issue AIP letters cleanly.`,
            chatPrompt: 'Why is selected or nurture blocked?'
          }
        ]
      });
      return;
    }

    if (targetView === 'rules') {
      const baseStats = computeCohortSummary(dataset, baseLender);
      const volDelta = stats.totalLoan - baseStats.totalLoan;
      const passDelta = stats.stressPassCount - baseStats.stressPassCount;

      TourEngine.start({
        name: 'morgana-rules-insights',
        mode: 'insights',
        steps: [
          {
            elementId: 'policySimulatorCard',
            title: 'Live Policy Sensitivity',
            message: `Under <strong>${escapeHtml(lender.shortName)}</strong> (${lender.greenRate.toFixed(2)}% Green, <strong>${Math.round(lender.maxVariableBonusPct * 100)}%</strong> bonus recognition), qualified volume sits at <strong>${formatCompactEuro(stats.totalLoan)}</strong> (${volDelta >= 0 ? '+' : ''}${formatCompactEuro(volDelta)}) with <strong>${stats.stressPassCount}/${dataset.length}</strong> stress-passing (${passDelta >= 0 ? '+' : ''}${passDelta}).`,
            chatPrompt: 'Compare BOI vs White-Label'
          },
          {
            elementId: 'rulesStageSummaryGrid',
            title: '18-Criteria Two-Gate Split',
            message: `All <strong>5 Broc Score pillars</strong> score 0–100 financial health; <strong>Stage A (10 criteria)</strong> authorizes instant AIP in seconds, and <strong>Stage B (+8 riders)</strong> tracks valuation, SEAI BER, title, and protection through drawdown.`
          },
          {
            elementId: 'rulesCardsGrid',
            title: 'Automated Verification Provenance',
            message: `Click any rule card to inspect exact Yapily Open Banking, Revenue EDS, Central Credit Register, or SEAI register provenance logic used during underwriting.`
          }
        ]
      });
      return;
    }

    if (targetView === 'analytics') {
      TourEngine.start({
        name: 'morgana-analytics-insights',
        mode: 'insights',
        steps: [
          {
            elementId: 'analyticsChart1',
            title: 'Volume & Forecast Variance',
            message: `Under <strong>${escapeHtml(macro.label)}</strong>, base qualified volume is <strong>${formatCompactEuro(filteredStats.totalLoan)}</strong> with a Stressed P10 floor of <strong>${formatCompactEuro(filteredStats.totalLow)}</strong> and P90 upside of <strong>${formatCompactEuro(filteredStats.totalHigh)}</strong>.`,
            chatPrompt: 'Compare BOI vs White-Label'
          },
          {
            elementId: 'analyticsChart2',
            title: 'Amortized LTV Protection',
            message: `Weighted collateral security strengthens from <strong>${filteredStats.avgInitLtv}% Day-1 LTV</strong> down to <strong>${filteredStats.avgYr10Ltv}% by Year 10</strong> under baseline HPI and Clive overpayment velocity.`
          },
          {
            elementId: 'analyticsChart3',
            title: 'Clive Switcher Churn Shield',
            message: `Fixed-rate expiry cliffs at Yr 3 and Yr 5 expose un-managed books to <strong>${filteredStats.avgChurn}%</strong> churn; continuous Broc Re-Fix nudges retain borrowers down to <strong>${filteredStats.avgManagedChurn}%</strong> hazard.`,
            chatPrompt: 'Churn Watchlist (≥30%)'
          },
          {
            elementId: 'analyticsChart4',
            title: 'Score vs PD Compression',
            message: `Months of automated hygiene lift cohort Broc Score by <strong>+${filteredStats.avgGain} pts</strong> to <strong>${filteredStats.avgScore}/100</strong>, holding weighted 12-month Default Risk (PD) at <strong>${filteredStats.avgPdBps} bps</strong>.`
          }
        ]
      });
      return;
    }

    // Overview Live Insights
    TourEngine.start({
      name: 'morgana-overview-insights',
      mode: 'insights',
      steps: [
        {
          elementId: 'overviewKpiGrid',
          title: 'Portfolio Volume & Risk Uplift',
          message: `<strong>${escapeHtml(lender.shortName)}</strong> holds <strong>${formatCompactEuro(stats.totalLoan)}</strong> in qualified lending across ${dataset.length} packs (avg Broc Score <strong>${stats.avgScore}/100</strong>, weighted Day-1 → Yr 10 LTV <strong>${stats.avgInitLtv}% → ${stats.avgYr10Ltv}%</strong>).`,
          chatPrompt: 'Fast-Track Score 90+'
        },
        {
          elementId: 'overviewCbiQuotaCard',
          title: 'Central Bank Exception Cap Monitor',
          message: `CBI FTB (&gt;4.0x LTI) exception allowance is <strong>${cbi.ftbUsedPct}% / ${cbi.ftbAllowanceCapPct.toFixed(0)}% Cap</strong> (${(cbi.ftbAllowanceCapPct - cbi.ftbUsedPct).toFixed(1)}% headroom), while Mover SSB (&gt;3.5x) stands at <strong>${cbi.ssbUsedPct}% / ${cbi.ssbAllowanceCapPct.toFixed(0)}% Cap</strong>.`
        },
        {
          elementId: 'overviewRiskInsightsCard',
          title: 'Credit Quality & 10-Yr Yield',
          message: `<strong>${stats.fullReady} Full Offer</strong> and <strong>${stats.aipReady} AIP Ready</strong> packs run at just <strong>${stats.avgPdBps} bps PD</strong> with <strong>${stats.greenCount}/${stats.count}</strong> eligible for <strong>${lender.greenRate.toFixed(2)}%</strong> Green EcoSaver — generating ~<strong>${formatCompactEuro(stats.totalNii)}</strong> est. 10-yr NII.`
        },
        {
          elementId: 'overviewPriorityQueueCard',
          title: 'Top Fast-Track Candidate',
          message: priorityTop && topCalc
            ? `Top priority is <strong>${escapeHtml(priorityTop.names)}</strong> (Score <strong>${priorityTop.brocScore}/100</strong>, <strong>${formatEuro(topCalc.loanForPricing)}</strong>, BER ${escapeHtml(priorityTop.propertyBER)}). Click any queue row to inspect all 18 verified evidence artifacts.`
            : `Click any applicant row here to open their complete 360° underwriting file.`
        }
      ]
    });
  }

  function startMorganaPageTour(viewName) {
    const targetView = viewName || (window.portalState && window.portalState.activeView) || 'overview';
    if (window.portalState && window.portalState.activeView !== targetView) {
      switchView(targetView);
    }

    if (targetView === 'pipeline') {
      TourEngine.start({
        name: 'morgana-pipeline-tour',
        mode: 'tour',
        steps: [
          {
            elementId: 'pipelineKpiGrid',
            title: 'Dynamic Cohort KPIs',
            message: 'These 4 KPIs recalculate live as you filter by county, buyer type, BER rating, or lender policy.'
          },
          {
            elementId: 'pipelineControlsBar',
            title: 'Stackable Filter Chips & Search',
            message: 'Combine Stage filters (All / AIP / Full / Clive Remediating) with preset chips (Green BER, Score 90+, Stamp 4 IRP) or open Filters for granular county/LTI slicing.'
          },
          {
            elementId: 'stageContextBanner',
            title: 'Active Policy Readout',
            message: 'Shows the active lender rate card, stress buffer, variable bonus recognition, and current matching pack count.'
          },
          {
            elementId: 'pipelineTableContainer',
            title: 'Queue Inspection & Batch Ops',
            message: 'Checkboxes unlock bulk AIP issuance and CSV export. Clicking any borrower row opens the 640px 360° Underwriting File drawer.'
          }
        ]
      });
      return;
    }

    if (targetView === 'rules') {
      TourEngine.start({
        name: 'morgana-rules-tour',
        mode: 'tour',
        steps: [
          {
            elementId: 'policySimulatorCard',
            title: 'Real-Time Credit Policy Simulator',
            message: 'Adjust Green/Standard APRs, variable bonus %, or couple NDI living costs to stress-test portfolio volume and pass rates before committing policy changes.'
          },
          {
            elementId: 'rulesStageSummaryGrid',
            title: 'Two-Stage Framework Summary',
            message: 'Separates 5 deterministic Broc Score™ pillars from 10 Stage A AIP criteria and 8 post-Sale-Agreed Stage B completion riders.'
          },
          {
            elementId: 'rulesFilterControlsBar',
            title: 'Criteria Search & Category Pills',
            message: 'Filter across Score Pillars, Stage A AIP rules, or Stage B legal/valuation riders, or search keywords like "Stamp 4", "CCR", or "BER".'
          },
          {
            elementId: 'rulesCardsGrid',
            title: 'Rule Cards',
            message: 'Click any rule card for full Irish regulatory detail, data-source provenance, and a shortcut to stress-test reasoning in Morgana Chat.'
          }
        ]
      });
      return;
    }

    if (targetView === 'analytics') {
      TourEngine.start({
        name: 'morgana-analytics-tour',
        mode: 'tour',
        steps: [
          {
            elementId: 'analyticsScopeBar',
            title: 'Portfolio vs Single-File Scope',
            message: 'Switch between aggregated portfolio analytics (respecting active Pipeline filters) and the currently selected applicant.'
          },
          {
            elementId: 'analyticsChart1',
            title: 'Volume & Forecast Fan',
            message: 'Visualizes historical origination volume alongside P10 Stressed, P50 Base, and P90 Upside projections under your active Macro Scenario.'
          },
          {
            elementId: 'analyticsChart2',
            title: '30-Yr LTV Amortization Trajectory',
            message: 'Compares flat HPI amortization, macro Base HPI equity gain, and Clive-assisted overpayment acceleration.'
          },
          {
            elementId: 'analyticsChart3',
            title: 'Churn Prevention & PD Calibration',
            message: 'Tracks Year 3 & Year 5 fixed-cliff retention (Chart 3) paired with 6-month Readiness Score™ vs 12-month Default Risk compression (Chart 4).'
          }
        ]
      });
      return;
    }

    // Overview Page Tour
    TourEngine.start({
      name: 'morgana-overview-tour',
      mode: 'tour',
      steps: [
        {
          elementId: 'overviewKpiGrid',
          title: 'Clickable Portfolio KPIs',
          message: 'Each card summarizes real-time pipeline lending volume, Broc Readiness, LTV amortization, and churn risk — click any card to drill straight into the filtered queue.'
        },
        {
          elementId: 'overviewCbiQuotaCard',
          title: 'CBI Exception Allowances',
          message: 'Monitors regulatory headroom against Ireland\'s 15% FTB (&gt;4.0x LTI) and 15% Second-Time Mover (&gt;3.5x LTI) caps.'
        },
        {
          elementId: 'overviewPriorityQueueCard',
          title: 'Priority Fast-Track Queue',
          message: 'Surfaces your highest-scoring borrowers. Click any borrower to inspect KYC, Revenue EDS, 6-month statements, and issue an AIP Certificate.'
        },
        {
          elementId: 'sidebarFooter',
          title: 'Floating Demo Controls Dock',
          message: 'Switch tenants (BOI vs White-Label), pipeline scale (7-Select vs 517 Monthly), Macro Stress Scenario, open the Video Demo, or review How Broc Score Works.'
        },
        {
          elementId: 'vivienFabTrigger',
          title: 'Ask Morgana Copilot',
          message: 'Open Morgana anytime from the bottom-right pill to query borrowers by county, residency status, churn hazard, or lender spread.',
          chatPrompt: 'Fast-Track Score 90+'
        }
      ]
    });
  }

  function startMorganaApplicantInsights() {
    const s = window.portalState || {};
    if (!s.drawerOpen) return;
    const applicant = getSelectedApplicant();
    const lender = getActiveLender();
    const calc = calculateLoanQualification(applicant, lender);
    const scenarios = getApplicantOfferScenarios(applicant, lender);
    const activeScenario = scenarios[s.selectedScenarioKey] || scenarios.STANDARD;
    const aipMet = applicant.aipCriteria.filter(c => c.met).length;

    TourEngine.start({
      name: 'morgana-drawer-insights',
      mode: 'insights',
      steps: [
        {
          elementId: 'drawerHeaderBox',
          title: `${applicant.names} (${applicant.brocScore}/100)`,
          message: `Pre-verified via <strong>${escapeHtml(applicant.kycBadge)}</strong> (${escapeHtml(applicant.citizenship)}). Target property BER is <strong>${escapeHtml(applicant.propertyBER)}</strong> (${calc.isGreenEligible ? `qualifies for ${lender.greenRate.toFixed(2)}% Green rate` : `Standard ${lender.stdRate.toFixed(2)}% rate`}).`
        },
        {
          elementId: 'drawerMetricRibbon',
          title: 'Qualification Cap & Stress Test',
          message: `Binding ceiling is <strong>${escapeHtml(calc.bindingLabel)}</strong> capping max loan at <strong>${formatEuro(calc.qualifiedLoan)}</strong> (<strong>${calc.actualLtiRatio}x</strong> LTI, <strong>${calc.initialLtvPct}%</strong> Day-1 LTV, stress margin <strong>${calc.stressMarginPm >= 0 ? '+' : ''}${formatEuro(calc.stressMarginPm)}/mo</strong>).`,
          chatPrompt: 'Explain Selected +2% Stress Pass'
        },
        {
          elementId: 'drawerFooterBar',
          title: 'Automated Decision Recommendation',
          message: applicant.targetStage === 'NURTURE' || !calc.passesStressTest
            ? `Direct AIP issuance is blocked (${aipMet}/10 Stage A checks). Use <strong>Request Info (RFI)</strong> or <strong>Refer Exception</strong> while Clive completes remediation.`
            : `All ${aipMet}/10 Stage A criteria pass. Ready to issue <strong>${applicant.targetStage === 'FULL' ? 'Loan Offer' : 'AIP Letter'}</strong> at <strong>${activeScenario.rate.toFixed(2)}% APR</strong>.`
        }
      ]
    });
  }

  function startMorganaApplicantTour() {
    const s = window.portalState || {};
    if (!s.drawerOpen) return;
    TourEngine.start({
      name: 'morgana-drawer-tour',
      mode: 'tour',
      steps: [
        {
          elementId: 'drawerMetricRibbon',
          title: '4-Metric Underwriting Ribbon',
          message: 'Displays qualified facility, binding CBI/deposit/stress limiter, amortized LTV trajectory, and 5-year switcher churn hazard.'
        },
        {
          elementId: 'drawerProfileTabs',
          title: '4 Inspection Tabs',
          message: 'Switch between <strong>Readiness &amp; Score</strong> (5 pillars + Clive timeline), <strong>LTV &amp; Risk</strong> (SVG projections), <strong>18-Pt Checklist</strong>, and <strong>AIP Offer Tiers &amp; Audit</strong>.'
        },
        {
          elementId: 'drawerBodyScroll',
          title: 'Expandable Proof Evidence',
          message: 'Inside tabs, expand any Stage A/B criterion row to inspect live Revenue EDS, Yapily bank-feed, and deposit AML provenance.'
        },
        {
          elementId: 'drawerFooterBar',
          title: 'Compliance-Gated Decision Actions',
          message: 'Issue official co-branded AIP Certificates, attach special conditions, log RFIs, refer policy exceptions, or export CSV packs.'
        }
      ]
    });
  }

  function askMorganaFromTour(prompt) {
    TourEngine.cleanup(true);
    if (typeof openAssistantWithPrompt === 'function') {
      openAssistantWithPrompt(prompt);
    }
  }

  /* ========================================================================
     5. Interactive Morgana Help & Cheat Sheet Modal (#chatHelpBtn)
     ======================================================================== */
  function ensureChatHelpModal() {
    let modal = document.getElementById('chatHelpModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'chatHelpModal';
    modal.className = 'portal-modal-backdrop';
    modal.onclick = e => {
      if (e.target === modal) closeChatHelpModal();
    };
    document.body.appendChild(modal);
    return modal;
  }

  function openChatHelpModal() {
    const modal = ensureChatHelpModal();
    const viewName = (window.portalState && window.portalState.activeView) || 'overview';
    const viewTitles = {
      overview: 'Overview',
      pipeline: 'Applicant Pipeline',
      rules: 'Underwriting Rules',
      analytics: 'Portfolio Analytics'
    };

    modal.innerHTML = `
      <div class="portal-modal-card" style="max-width:680px;">
        <div class="portal-modal-header">
          <div class="modal-brand-lockup">
            <img src="assets/images/avatars/morgana.png" alt="Morgana" class="assistant-persona-squircle" style="width:36px;height:36px;" />
            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:1.05rem;font-weight:700;margin:0;color:var(--text-primary);">Morgana Copilot &amp; Guidance Cheat Sheet</h3>
              <p style="font-size:0.76rem;color:var(--text-muted);margin:2px 0 0;">Live underwriting analysis, page spotlight tours &amp; natural-language queries</p>
            </div>
          </div>
          <button class="close-icon-btn" onclick="closeChatHelpModal()" aria-label="Close help modal">✕</button>
        </div>
        <div class="portal-modal-body custom-scroll">
          <div class="chat-help-tour-callout">
            <div>
              <strong style="color:var(--text-primary);font-size:0.86rem;">Interactive Guidance on Current View (${escapeHtml(viewTitles[viewName] || 'Overview')})</strong>
              <div style="font-size:0.76rem;color:var(--text-muted);margin-top:2px;">Launch Morgana's spotlight analysis or walkthrough directly on screen.</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="banner-tour-pill-btn primary" onclick="closeChatHelpModal(); toggleAssistant(false); toggleMorganaHelp(true); startMorganaInsightsTour('${viewName}');">
                ${portalIcon('sparkles', 13)}
                <span>Show Live Insights</span>
              </button>
              <button type="button" class="banner-tour-pill-btn secondary" onclick="closeChatHelpModal(); toggleAssistant(false); toggleMorganaHelp(true); startMorganaPageTour('${viewName}');">
                <span>Give me a Tour</span>
              </button>
            </div>
          </div>

          <div style="font-size:0.73rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-caption);margin:14px 0 8px;">One-Click Morgana Copilot Queries</div>
          <div class="chat-help-grid">
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Fast-Track Score 90+');">
              <strong>Fast-Track Score 90+</strong>
              <span>Rank top-tier Green EcoSaver &amp; Full Mortgage files ready for instant AIP.</span>
            </button>
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Compare BOI vs White-Label');">
              <strong>Compare BOI vs White-Label</strong>
              <span>Quantify borrowing capacity gain from 50% variable bonus recognition &amp; 3.45% APR.</span>
            </button>
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Churn Watchlist (≥30%)');">
              <strong>Churn Watchlist (≥30%)</strong>
              <span>Surface high fixed-cliff switcher risks protected by Broc Re-Fix nudges.</span>
            </button>
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Why is selected or nurture blocked?');">
              <strong>Remediating &amp; Blocked Files</strong>
              <span>Explain incomplete Stage A conduct criteria holding pre-submission packs.</span>
            </button>
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Stamp 4 & Self-Employed');">
              <strong>Stamp 4 &amp; Form 11 Packs</strong>
              <span>Inspect verified Non-EEA Critical Skills IRP and self-employed ROS tax files.</span>
            </button>
            <button type="button" class="chat-help-item" onclick="closeChatHelpModal(); handleAssistantChip('Explain Selected +2% Stress Pass');">
              <strong>+2.0% CBI Stress Math</strong>
              <span>Break down net disposable income buffer on the currently selected applicant.</span>
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }

  function closeChatHelpModal() {
    document.getElementById('chatHelpModal')?.classList.remove('open');
  }

  // Expose global hooks cleanly
  window.MorganaGuidance = {
    renderMorganaHelpUI,
    toggleViewHelpBanner,
    toggleDrawerHelpBanner,
    getDrawerMorganaHeaderPillHtml,
    getDrawerMorganaBannerHtml,
    startMorganaInsightsTour,
    startMorganaPageTour,
    startMorganaApplicantInsights,
    startMorganaApplicantTour,
    stopTour: () => TourEngine.cleanup(true),
    isTourOpen: () => Boolean(TourEngine.tour)
  };
  window.toggleMorganaHelp = toggleViewHelpBanner;
  window.toggleDrawerHelpBanner = toggleDrawerHelpBanner;
  window.toggleMorganaDisclosure = toggleDisclosureChip;
  window.startMorganaInsightsTour = startMorganaInsightsTour;
  window.startMorganaPageTour = startMorganaPageTour;
  window.startMorganaApplicantInsights = startMorganaApplicantInsights;
  window.startMorganaApplicantTour = startMorganaApplicantTour;
  window.nextMorganaTourStep = () => TourEngine.next();
  window.prevMorganaTourStep = () => TourEngine.prev();
  window.stopMorganaTour = () => TourEngine.cleanup(false);
  window.askMorganaFromTour = askMorganaFromTour;
  window.openChatHelpModal = openChatHelpModal;
  window.closeChatHelpModal = closeChatHelpModal;
})();
