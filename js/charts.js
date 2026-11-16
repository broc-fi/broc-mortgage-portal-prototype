/* ==========================================================================
   Broc. For Lenders — Reactive 4-Chart Inline SVG Portfolio Analytics Hub
   Zero-dependency inline SVG visualization matching Broc B2B Design Tokens
   ========================================================================== */

function renderDrawerLtvAndConstraintSvg(applicant, baseLender) {
  const lender = getEffectiveLenderPolicy(baseLender);
  const c = calculateLoanQualification(applicant, lender);
  const maxTerm = c.seriesMaxYear || 30;
  const w = 480, h = 148, padL = 42, padR = 16, padT = 14, padB = 24;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const gridStroke = '#e2e8f0';
  const emeraldStroke = '#059669';
  const indigoStroke = '#4f46e5';

  const x = yr => padL + (yr / maxTerm) * plotW;
  const y = pct => padT + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;

  const flatPath = c.ltv30YrSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x(yr).toFixed(1)},${y(d.flatHpiLtv).toFixed(1)}`).join(' ');
  const basePath = c.ltv30YrSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x(yr).toFixed(1)},${y(d.baseHpiLtv).toFixed(1)}`).join(' ');
  const clivePath = c.ltv30YrSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x(yr).toFixed(1)},${y(d.cliveOverpayLtv).toFixed(1)}`).join(' ');
  const bandPolygon = c.ltv30YrSeries.map((d, yr) => `${x(yr).toFixed(1)},${y(d.flatHpiLtv).toFixed(1)}`).join(' ') + ' ' +
    [...c.ltv30YrSeries].reverse().map(d => `${x(d.year).toFixed(1)},${y(d.cliveOverpayLtv).toFixed(1)}`).join(' ');

  const ticks = [0, 5, 10, 15, 20, 25, maxTerm].filter((v, i, arr) => arr.indexOf(v) === i && v <= maxTerm);

  // Horizontal cap comparison bars
  const maxBarVal = Math.max(c.maxLoanByLTI, c.maxLoanByDeposit90LTV, c.maxLoanByStressTest, c.loanGrantHigh, 100000);
  const capRows = [
    { label: `CBI ${c.ltiMultiplier.toFixed(1)}x LTI`, val: c.maxLoanByLTI, isBind: c.bindingConstraint === 'LTI', color: '#4f46e5' },
    { label: '90% LTV Deposit', val: c.maxLoanByDeposit90LTV, isBind: c.bindingConstraint === 'DEPOSIT_LTV', color: '#0ea5e9' },
    { label: `+${lender.stressBuffer.toFixed(1)}% Stress / NDI`, val: c.maxLoanByStressTest, isBind: c.bindingConstraint === 'STRESS_NDI', color: '#10b981' }
  ];

  return `
    <div style="margin-bottom:0.85rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
        <span style="font-size:0.74rem;font-weight:700;color:var(--text-secondary);">Binding Cap Breakdown</span>
        <span class="analytics-badge is-indigo">Binding: ${escapeHtml(c.bindingLabel)}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${capRows.map(row => {
          const pct = Math.min(100, Math.max(8, Math.round((row.val / maxBarVal) * 100)));
          return `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.72rem;margin-bottom:2px;">
                <span style="font-weight:${row.isBind ? '700' : '500'};color:${row.isBind ? 'var(--text-primary)' : 'var(--text-muted)'};">
                  ${escapeHtml(row.label)} ${row.isBind ? '• BINDING' : ''}
                </span>
                <span class="font-mono" style="font-weight:700;color:${row.isBind ? 'var(--vivien-indigo)' : 'var(--text-secondary)'};">${formatEuro(row.val)}</span>
              </div>
              <div style="height:6px;border-radius:999px;background:var(--bg-elevated);overflow:hidden;border:1px solid var(--border-hairline);">
                <div style="height:100%;width:${pct}%;background:${row.isBind ? row.color : '#94a3b8'};border-radius:999px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="chart-legend-row">
      <span class="chart-legend-item"><span class="legend-swatch dashed-slate"></span>0% Flat HPI</span>
      <span class="chart-legend-item"><span class="legend-swatch solid-indigo"></span>Base HPI LTV</span>
      <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>Clive Overpay (-${c.yearsSavedByClive} yrs)</span>
    </div>
    <div class="analytics-svg-well" style="margin-top:0.35rem;">
      <svg viewBox="0 0 ${w} ${h}" class="analytics-svg" style="height:148px;">
        ${[80, 60, 40, 20].map(pct => {
          const gy = y(pct);
          return `
            <line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="${pct === 60 ? indigoStroke : gridStroke}" stroke-dasharray="3 3" stroke-opacity="${pct === 60 ? '0.6' : '1'}" />
            <text x="${padL - 5}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${pct}%</text>
          `;
        }).join('')}
        <text x="${w - padR - 2}" y="${y(60) - 3}" text-anchor="end" class="svg-highlight-blue">60% RWA Tier</text>
        <polygon points="${bandPolygon}" fill="rgba(79, 70, 229, 0.11)" />
        <path d="${flatPath}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />
        <path d="${basePath}" fill="none" stroke="${indigoStroke}" stroke-width="2.2" />
        <path d="${clivePath}" fill="none" stroke="${emeraldStroke}" stroke-width="2.2" />
        ${ticks.map(yr => {
          const pt = c.ltv30YrSeries[yr] || c.ltv30YrSeries[c.ltv30YrSeries.length - 1];
          return `
            <circle cx="${x(yr)}" cy="${y(pt.baseHpiLtv)}" r="2.8" fill="${indigoStroke}">
              <title>Yr ${yr}: Base ${pt.baseHpiLtv}% | Clive ${pt.cliveOverpayLtv}%</title>
            </circle>
            <text x="${x(yr)}" y="${h - 6}" text-anchor="middle" class="svg-axis-label">Yr ${yr}</text>
          `;
        }).join('')}
      </svg>
    </div>
  `;
}

function renderAnalyticsCharts(options) {
  const {
    container,
    subtitleEl,
    dataset,
    activeList,
    lender: baseLender,
    macro,
    selectedApplicant,
    analyticsScope
  } = options;

  if (!container) return;

  const lender = getEffectiveLenderPolicy(baseLender);
  const selectedApp = selectedApplicant || activeList[0] || dataset[0];
  const isSingleApplicant = analyticsScope === 'APPLICANT';
  const scopeItems = isSingleApplicant ? [selectedApp] : activeList;
  const scopeLabel = isSingleApplicant
    ? `${selectedApp.names} (${selectedApp.id})`
    : `${activeList.length} Filtered Application${activeList.length === 1 ? '' : 's'}`;

  if (subtitleEl) {
    subtitleEl.innerHTML = `Viewing: <strong style="color: var(--brand-emerald-dark)">${escapeHtml(scopeLabel)}</strong> • Scenario: <strong>${escapeHtml(macro.label)}</strong> • Lender: <strong>${escapeHtml(lender.shortName)}</strong>`;
  }

  let sumLow = 0;
  let sumMid = 0;
  let sumHigh = 0;
  let sumChurnRaw = 0;
  let sumChurnManaged = 0;
  let sum10YrNII = 0;
  let sumPdBps = 0;
  let greenCount = 0;
  let highChurnCount = 0;

  const maxTermYr = isSingleApplicant ? Math.max(30, selectedApp.termYears || 30) : 30;
  const avgLtvSeries = Array.from({ length: maxTermYr + 1 }, (_, yr) => ({
    year: yr,
    flatHpiLtv: 0,
    baseHpiLtv: 0,
    cliveOverpayLtv: 0,
    remainingBalance: 0
  }));

  let singleCalc = null;
  scopeItems.forEach(a => {
    const c = calculateLoanQualification(a, lender);
    if (isSingleApplicant) singleCalc = c;
    sumLow += c.loanGrantLow;
    sumMid += c.loanGrantMid;
    sumHigh += c.loanGrantHigh;
    sumChurnRaw += c.churnRisk5YrPct;
    sumChurnManaged += c.churnRiskManagedPct;
    sum10YrNII += c.est10YrNII;
    sumPdBps += c.pd12MoBps;
    if (c.isGreenEligible) greenCount++;
    if (c.churnRisk5YrPct >= 30) highChurnCount++;

    for (let yr = 0; yr <= maxTermYr; yr++) {
      const pt = c.ltv30YrSeries[yr] || { flatHpiLtv: 0, baseHpiLtv: 0, cliveOverpayLtv: 0, remainingBalance: 0 };
      avgLtvSeries[yr].flatHpiLtv += pt.flatHpiLtv;
      avgLtvSeries[yr].baseHpiLtv += pt.baseHpiLtv;
      avgLtvSeries[yr].cliveOverpayLtv += pt.cliveOverpayLtv;
      avgLtvSeries[yr].remainingBalance += pt.remainingBalance;
    }
  });

  const n = Math.max(1, scopeItems.length);
  avgLtvSeries.forEach(pt => {
    pt.flatHpiLtv = Number((pt.flatHpiLtv / n).toFixed(1));
    pt.baseHpiLtv = Number((pt.baseHpiLtv / n).toFixed(1));
    pt.cliveOverpayLtv = Number((pt.cliveOverpayLtv / n).toFixed(1));
  });

  const avgChurn5Yr = Math.round(sumChurnRaw / n);
  const avgManaged5Yr = Math.round(sumChurnManaged / n);
  const avgPdBps = Math.round(sumPdBps / n);
  const greenPct = Math.round((greenCount / n) * 100);

  // Common SVG geometry
  const c1W = 520, c1H = 190, padL = 52, padR = 18, padT = 16, padB = 28;
  const plotW = c1W - padL - padR;
  const plotH = c1H - padT - padB;

  const gridStroke = '#e2e8f0';
  const actualStroke = '#0f172a';
  const emeraldStroke = '#059669';
  const indigoStroke = '#4f46e5';

  // =========================================================================
  // CHART 1: PORTFOLIO LENDING FAN vs SINGLE-APPLICANT CONSTRAINT BRIDGE
  // =========================================================================
  let chart1CardHtml = '';
  if (isSingleApplicant && singleCalc) {
    const capItems = [
      { label: `CBI ${singleCalc.ltiMultiplier.toFixed(1)}x LTI`, val: singleCalc.maxLoanByLTI, color: indigoStroke, tag: singleCalc.bindingConstraint === 'LTI' ? 'BINDING' : '' },
      { label: '90% LTV Deposit', val: singleCalc.maxLoanByDeposit90LTV, color: '#0ea5e9', tag: singleCalc.bindingConstraint === 'DEPOSIT_LTV' ? 'BINDING' : '' },
      { label: `+${lender.stressBuffer.toFixed(1)}% Stress`, val: singleCalc.maxLoanByStressTest, color: emeraldStroke, tag: singleCalc.bindingConstraint === 'STRESS_NDI' ? 'BINDING' : '' },
      { label: 'P50 Qualified', val: singleCalc.qualifiedLoan, color: actualStroke, tag: 'BASE CAP' },
      { label: 'P90 Clive + Exc', val: singleCalc.loanGrantHigh, color: '#10b981', tag: 'UPSIDE' }
    ];
    const maxCapVal = Math.max(...capItems.map(x => x.val), 100000) * 1.12;
    const barW = 58;
    const stepX = plotW / capItems.length;

    chart1CardHtml = `
      <div id="analyticsChart1" class="analytics-chart-card">
        <div>
          <div class="analytics-chart-header">
            <div>
              <span class="analytics-badge is-emerald">Credit Envelope • Constraint Bridge</span>
              <h3 class="analytics-chart-title">Borrowing Power Limits (${escapeHtml(singleCalc.bindingLabel)})</h3>
            </div>
            <div class="analytics-chart-kpi">
              <span class="analytics-chart-kpi-label">Qualified Base</span>
              <span class="analytics-chart-kpi-val">${formatEuro(singleCalc.qualifiedLoan)}</span>
            </div>
          </div>

          <div class="chart-legend-row">
            <span class="chart-legend-item"><span class="legend-swatch solid-indigo"></span>Policy Caps (LTI / LTV / Stress)</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-slate"></span>Binding Qualified Base</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>Clive + Exception Upside</span>
          </div>

          <div class="analytics-svg-well">
            <svg viewBox="0 0 ${c1W} ${c1H}" class="analytics-svg">
              ${[0.25, 0.5, 0.75, 1.0].map(f => {
                const gy = padT + plotH * (1 - f);
                const gVal = maxCapVal * f;
                return `
                  <line x1="${padL}" y1="${gy}" x2="${c1W - padR}" y2="${gy}" stroke="${gridStroke}" stroke-dasharray="3 3" />
                  <text x="${padL - 6}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${formatCompactEuro(gVal)}</text>
                `;
              }).join('')}

              ${capItems.map((item, idx) => {
                const bx = padL + idx * stepX + (stepX - barW) / 2;
                const bh = Math.max(4, (item.val / maxCapVal) * plotH);
                const by = padT + plotH - bh;
                return `
                  <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW}" height="${bh.toFixed(1)}" rx="6" fill="${item.color}" opacity="${item.tag === 'BINDING' || item.tag === 'BASE CAP' ? '0.95' : '0.72'}">
                    <title>${item.label}: ${formatEuro(item.val)}</title>
                  </rect>
                  <text x="${(bx + barW / 2).toFixed(1)}" y="${(by - 5).toFixed(1)}" text-anchor="middle" class="svg-note-label">${formatCompactEuro(item.val)}</text>
                  <text x="${(bx + barW / 2).toFixed(1)}" y="${c1H - 12}" text-anchor="middle" class="svg-axis-label">${escapeHtml(item.label)}</text>
                  ${item.tag ? `<text x="${(bx + barW / 2).toFixed(1)}" y="${c1H - 2}" text-anchor="middle" style="font-size:7.5px;font-weight:700;fill:${item.color};">${item.tag}</text>` : ''}
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <div class="analytics-stat-strip">
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">P10 Stressed Floor</span>
            <span class="analytics-mini-stat-val">${formatEuro(sumLow)}</span>
            <span class="analytics-mini-stat-sub">+2.75% stress / pre-Clive</span>
          </div>
          <div class="analytics-mini-stat is-emerald">
            <span class="analytics-mini-stat-label">Binding Constraint</span>
            <span class="analytics-mini-stat-val">${escapeHtml(singleCalc.bindingLabel)}</span>
            <span class="analytics-mini-stat-sub">LTI ${singleCalc.actualLtiRatio}x / ${singleCalc.ltiMultiplier.toFixed(1)}x</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">P90 Clive Upside</span>
            <span class="analytics-mini-stat-val">${formatEuro(sumHigh)}</span>
            <span class="analytics-mini-stat-sub" style="color:var(--brand-emerald-dark);">+${formatCompactEuro(Math.max(0, sumHigh - sumMid))} headroom</span>
          </div>
        </div>
      </div>
    `;
  } else {
    const monthsLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov*', 'Dec*', 'Jan*', 'Feb*', 'Mar*', 'Apr*', 'May*', 'Jun*'];
    const baseMonthlyVol = sumMid;
    const histMultipliers = [0.78, 0.84, 0.91, 0.96];
    const fwdMidMultipliers = [1.00, 1.04, 1.09, 1.13, 1.18, 1.22, 1.27, 1.32];
    const macroFactor = macro.id === 'STRESSED' ? 0.91 : macro.id === 'UPSIDE' ? 1.08 : 1.0;

    const grantSeries = monthsLabels.map((m, idx) => {
      if (idx < 4) {
        const v = baseMonthlyVol * histMultipliers[idx];
        return { label: m, isForecast: false, low: v, mid: v, high: v };
      }
      const fIdx = idx - 4;
      const spreadGrow = 1 + fIdx * 0.035;
      const mid = baseMonthlyVol * fwdMidMultipliers[fIdx] * macroFactor;
      const low = sumLow * fwdMidMultipliers[fIdx] * (macroFactor * 0.94) / Math.pow(spreadGrow, 0.4);
      const high = sumHigh * fwdMidMultipliers[fIdx] * (macroFactor * 1.05) * Math.pow(spreadGrow, 0.45);
      return { label: m, isForecast: true, low, mid, high };
    });

    const maxGrantVal = Math.max(...grantSeries.map(d => d.high)) * 1.1;
    const minGrantVal = Math.min(...grantSeries.map(d => d.low)) * 0.82;
    const x1 = i => padL + (i / (grantSeries.length - 1)) * plotW;
    const y1 = val => padT + plotH - ((val - minGrantVal) / Math.max(1, maxGrantVal - minGrantVal)) * plotH;

    const fanForecastPts = grantSeries.slice(3);
    const fanTop = fanForecastPts.map((d, i) => `${x1(i + 3).toFixed(1)},${y1(d.high).toFixed(1)}`).join(' ');
    const fanBot = [...fanForecastPts].reverse().map((d, revI) => {
      const origI = fanForecastPts.length - 1 - revI + 3;
      return `${x1(origI).toFixed(1)},${y1(d.low).toFixed(1)}`;
    }).join(' ');
    const fanPolygon = `${fanTop} ${fanBot}`;

    const actualPath = grantSeries.slice(0, 4).map((d, i) => `${i === 0 ? 'M' : 'L'}${x1(i).toFixed(1)},${y1(d.mid).toFixed(1)}`).join(' ');
    const midForecastPath = grantSeries.slice(3).map((d, i) => `${i === 0 ? 'M' : 'L'}${x1(i + 3).toFixed(1)},${y1(d.mid).toFixed(1)}`).join(' ');
    const highForecastPath = grantSeries.slice(3).map((d, i) => `${i === 0 ? 'M' : 'L'}${x1(i + 3).toFixed(1)},${y1(d.high).toFixed(1)}`).join(' ');
    const lowForecastPath = grantSeries.slice(3).map((d, i) => `${i === 0 ? 'M' : 'L'}${x1(i + 3).toFixed(1)},${y1(d.low).toFixed(1)}`).join(' ');

    chart1CardHtml = `
      <div id="analyticsChart1" class="analytics-chart-card">
        <div>
          <div class="analytics-chart-header">
            <div>
              <span class="analytics-badge is-emerald">Time Series 1 • Lending Volume &amp; Fan</span>
              <h3 class="analytics-chart-title">Projected Range of Loans Granted (P10 / P50 / P90)</h3>
            </div>
            <div class="analytics-chart-kpi">
              <span class="analytics-chart-kpi-label">Cohort P50 Base</span>
              <span class="analytics-chart-kpi-val">${formatCompactEuro(sumMid)}</span>
            </div>
          </div>

          <div class="chart-legend-row">
            <span class="chart-legend-item"><span class="legend-swatch solid-slate"></span>Historical Originations</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>P50 Forecast Base</span>
            <span class="chart-legend-item"><span class="legend-swatch dashed-emerald"></span>P10–P90 Confidence Fan</span>
          </div>

          <div class="analytics-svg-well">
            <svg viewBox="0 0 ${c1W} ${c1H}" class="analytics-svg">
              ${[0.2, 0.5, 0.8].map(f => {
                const gy = padT + f * plotH;
                const gVal = maxGrantVal - f * (maxGrantVal - minGrantVal);
                return `
                  <line x1="${padL}" y1="${gy}" x2="${c1W - padR}" y2="${gy}" stroke="${gridStroke}" stroke-dasharray="3 3" />
                  <text x="${padL - 6}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${formatCompactEuro(gVal)}</text>
                `;
              }).join('')}

              <line x1="${x1(3)}" y1="${padT}" x2="${x1(3)}" y2="${padT + plotH}" stroke="#94a3b8" stroke-dasharray="4 3" />
              <text x="${x1(3) + 5}" y="${padT + 10}" class="svg-note-label">Forecast Fan →</text>

              <polygon points="${fanPolygon}" fill="rgba(16, 185, 129, 0.16)" />
              <path d="${highForecastPath}" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 3" />
              <path d="${lowForecastPath}" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 3" />
              <path d="${actualPath}" fill="none" stroke="${actualStroke}" stroke-width="2.5" />
              <path d="${midForecastPath}" fill="none" stroke="${emeraldStroke}" stroke-width="2.5" />

              ${grantSeries.map((d, i) => `
                <circle cx="${x1(i)}" cy="${y1(d.mid)}" r="3.2" fill="${d.isForecast ? emeraldStroke : actualStroke}">
                  <title>${d.label}: Base ${formatEuro(Math.round(d.mid))} (${formatEuro(Math.round(d.low))} – ${formatEuro(Math.round(d.high))})</title>
                </circle>
                <text x="${x1(i)}" y="${c1H - 8}" text-anchor="middle" class="svg-axis-label">${d.label}</text>
              `).join('')}
            </svg>
          </div>
        </div>

        <div class="analytics-stat-strip">
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">P10 Stressed Floor</span>
            <span class="analytics-mini-stat-val">${formatCompactEuro(sumLow)}</span>
            <span class="analytics-mini-stat-sub">+2.75% stress / pre-Clive</span>
          </div>
          <div class="analytics-mini-stat is-emerald">
            <span class="analytics-mini-stat-label">P50 Qualified Base</span>
            <span class="analytics-mini-stat-val">${formatCompactEuro(sumMid)}</span>
            <span class="analytics-mini-stat-sub">Standard CBI 4x / 3.5x</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">P90 Clive Upside</span>
            <span class="analytics-mini-stat-val">${formatCompactEuro(sumHigh)}</span>
            <span class="analytics-mini-stat-sub" style="color:var(--brand-emerald-dark);">+${formatCompactEuro(sumHigh - sumMid)} upside</span>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHART 2: PROJECTED FULL-TERM LTV AMORTIZATION TRAJECTORY
  // =========================================================================
  const ltvMilestones = [0, 3, 5, 10, 15, 20, 25, maxTermYr].filter((v, i, arr) => arr.indexOf(v) === i);
  const x2 = yr => padL + (yr / maxTermYr) * plotW;
  const y2 = pct => padT + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;

  const flatLtvPath = avgLtvSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x2(yr).toFixed(1)},${y2(d.flatHpiLtv).toFixed(1)}`).join(' ');
  const baseLtvPath = avgLtvSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x2(yr).toFixed(1)},${y2(d.baseHpiLtv).toFixed(1)}`).join(' ');
  const cliveLtvPath = avgLtvSeries.map((d, yr) => `${yr === 0 ? 'M' : 'L'}${x2(yr).toFixed(1)},${y2(d.cliveOverpayLtv).toFixed(1)}`).join(' ');
  const ltvBandPolygon = avgLtvSeries.map((d, yr) => `${x2(yr).toFixed(1)},${y2(d.flatHpiLtv).toFixed(1)}`).join(' ') + ' ' +
    [...avgLtvSeries].reverse().map(d => `${x2(d.year).toFixed(1)},${y2(d.cliveOverpayLtv).toFixed(1)}`).join(' ');

  // =========================================================================
  // CHART 3: 10-YEAR CHURN RISK & FIXED-RATE EXPIRY CLIFF HAZARD
  // =========================================================================
  const scaleChurn = avgChurn5Yr / 24;
  const rawHazardProfile = [3.2, 5.1, 18.4, 9.8, 22.6, 11.2, 8.5, 13.4, 7.2, 6.0];
  const brocHazardProfile = [1.4, 2.1, 6.2, 3.8, 7.5, 4.2, 3.3, 4.8, 2.9, 2.4];
  const churnSeries = Array.from({ length: 10 }, (_, idx) => {
    const yr = idx + 1;
    const unmanaged = Math.min(48, Number((rawHazardProfile[idx] * scaleChurn).toFixed(1)));
    const managed = Math.min(24, Number((brocHazardProfile[idx] * scaleChurn).toFixed(1)));
    return { year: `Yr ${yr}`, yrNum: yr, unmanaged, managed };
  });
  const peakChurn = Math.max(...churnSeries.map(d => d.unmanaged), 30);
  const maxChurnY = Math.max(40, Math.ceil((peakChurn + 4) / 10) * 10);
  const churnTicks = maxChurnY >= 50 ? [10, 20, 30, 40, 50] : [10, 20, 30, 40];
  const x3 = idx => padL + (idx / 9) * plotW;
  const y3 = pct => padT + plotH - (Math.min(maxChurnY, pct) / maxChurnY) * plotH;
  const unmanagedChurnPath = churnSeries.map((d, i) => `${i === 0 ? 'M' : 'L'}${x3(i).toFixed(1)},${y3(d.unmanaged).toFixed(1)}`).join(' ');
  const managedChurnPath = churnSeries.map((d, i) => `${i === 0 ? 'M' : 'L'}${x3(i).toFixed(1)},${y3(d.managed).toFixed(1)}`).join(' ');
  const churnSavedPolygon = churnSeries.map((d, i) => `${x3(i).toFixed(1)},${y3(d.unmanaged).toFixed(1)}`).join(' ') + ' ' +
    [...churnSeries].reverse().map((d, revI) => `${x3(9 - revI).toFixed(1)},${y3(d.managed).toFixed(1)}`).join(' ');

  // =========================================================================
  // CHART 4: 6-MONTH READINESS & DEFAULT RISK (PD) VELOCITY (DUAL Y-AXIS)
  // =========================================================================
  const avgBeforeScore = Math.round(scopeItems.reduce((s, a) => s + a.brocScoreBefore, 0) / n);
  const avgNowScore = Math.round(scopeItems.reduce((s, a) => s + a.brocScore, 0) / n);
  const readinessMonths = ['M-6', 'M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'Now'];
  const velocitySeries = readinessMonths.map((m, idx) => {
    const curveProgress = Math.pow(idx / 6, 0.85);
    const score = Math.round(avgBeforeScore + (avgNowScore - avgBeforeScore) * curveProgress);
    const pdBps = Math.max(12, Math.round(150 - score * 1.3));
    return { label: m, score, pdBps };
  });
  const padR4 = 48;
  const plotW4 = c1W - padL - padR4;
  const maxPdScale = Math.max(110, Math.ceil((velocitySeries[0].pdBps + 10) / 20) * 20);
  const x4 = idx => padL + (idx / 6) * plotW4;
  const y4Score = sc => padT + plotH - ((sc - 40) / 60) * plotH;
  const y4Pd = pd => padT + plotH - ((pd - 0) / maxPdScale) * plotH;
  const scoreVelPath = velocitySeries.map((d, i) => `${i === 0 ? 'M' : 'L'}${x4(i).toFixed(1)},${y4Score(d.score).toFixed(1)}`).join(' ');
  const pdVelPath = velocitySeries.map((d, i) => `${i === 0 ? 'M' : 'L'}${x4(i).toFixed(1)},${y4Pd(d.pdBps).toFixed(1)}`).join(' ');

  container.innerHTML = `
    <div class="analytics-charts-grid">

      ${chart1CardHtml}

      <!-- CHART 2: FULL-TERM LTV AMORTIZATION -->
      <div id="analyticsChart2" class="analytics-chart-card">
        <div>
          <div class="analytics-chart-header">
            <div>
              <span class="analytics-badge is-blue">Time Series 2 • ${maxTermYr}-Year LTV Curve</span>
              <h3 class="analytics-chart-title">Loan-to-Value (LTV %) Trajectory (Flat vs Base vs Clive Overpay)</h3>
            </div>
            <div class="analytics-chart-kpi">
              <span class="analytics-chart-kpi-label">Day-1 → Yr 10</span>
              <span class="analytics-chart-kpi-val blue">${avgLtvSeries[0].baseHpiLtv}% → ${avgLtvSeries[10].baseHpiLtv}%</span>
            </div>
          </div>

          <div class="chart-legend-row">
            <span class="chart-legend-item"><span class="legend-swatch dashed-slate"></span>0% Flat HPI</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-indigo"></span>Base HPI Trajectory</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>Clive Overpay Acceleration</span>
          </div>

          <div class="analytics-svg-well">
            <svg viewBox="0 0 ${c1W} ${c1H}" class="analytics-svg">
              ${[80, 60, 40, 20].map(pct => {
                const gy = y2(pct);
                return `
                  <line x1="${padL}" y1="${gy}" x2="${c1W - padR}" y2="${gy}" stroke="${pct === 60 ? indigoStroke : gridStroke}" stroke-dasharray="3 3" stroke-opacity="${pct === 60 ? '0.6' : '1'}" />
                  <text x="${padL - 6}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${pct}%</text>
                `;
              }).join('')}
              <text x="${c1W - padR - 4}" y="${y2(60) - 4}" text-anchor="end" class="svg-highlight-blue">60% RWA Tier Threshold</text>

              <polygon points="${ltvBandPolygon}" fill="rgba(79, 70, 229, 0.11)" />
              <path d="${flatLtvPath}" fill="none" stroke="#94a3b8" stroke-width="1.75" stroke-dasharray="4 3" />
              <path d="${baseLtvPath}" fill="none" stroke="${indigoStroke}" stroke-width="2.5" />
              <path d="${cliveLtvPath}" fill="none" stroke="${emeraldStroke}" stroke-width="2.25" />

              ${ltvMilestones.map(yr => {
                const pt = avgLtvSeries[yr];
                return `
                  <circle cx="${x2(yr)}" cy="${y2(pt.baseHpiLtv)}" r="3.2" fill="${indigoStroke}">
                    <title>Year ${yr}: Base LTV ${pt.baseHpiLtv}% | Flat HPI ${pt.flatHpiLtv}% | Clive Overpay ${pt.cliveOverpayLtv}%</title>
                  </circle>
                  <circle cx="${x2(yr)}" cy="${y2(pt.cliveOverpayLtv)}" r="2.6" fill="${emeraldStroke}">
                    <title>Year ${yr} Clive Overpay: ${pt.cliveOverpayLtv}% LTV</title>
                  </circle>
                  <text x="${x2(yr)}" y="${c1H - 8}" text-anchor="middle" class="svg-axis-label">Yr ${yr}</text>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <div class="analytics-stat-strip cols-4">
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">Day 1 → Yr 5</span>
            <span class="analytics-mini-stat-val">${avgLtvSeries[0].baseHpiLtv}% → ${avgLtvSeries[5].baseHpiLtv}%</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">Yr 10 → Yr 20</span>
            <span class="analytics-mini-stat-val" style="color:var(--vivien-indigo);">${avgLtvSeries[10].baseHpiLtv}% → ${avgLtvSeries[20].baseHpiLtv}%</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">0% HPI Yr 10</span>
            <span class="analytics-mini-stat-val">${avgLtvSeries[10].flatHpiLtv}%</span>
          </div>
          <div class="analytics-mini-stat is-emerald">
            <span class="analytics-mini-stat-label">Clive Overpay</span>
            <span class="analytics-mini-stat-val">${avgLtvSeries[10].cliveOverpayLtv}% Yr10</span>
          </div>
        </div>
      </div>

      <!-- CHART 3: 10-YEAR CHURN RISK & FIXED-TERM CLIFF -->
      <div id="analyticsChart3" class="analytics-chart-card">
        <div>
          <div class="analytics-chart-header">
            <div>
              <span class="analytics-badge is-amber">Time Series 3 • Switcher Churn Hazard</span>
              <h3 class="analytics-chart-title">Yr 3 &amp; Yr 5 Fixed-Rate Expiry Hazard vs Broc Auto-Retention</h3>
            </div>
            <div class="analytics-chart-kpi">
              <span class="analytics-chart-kpi-label">5-Yr Churn Drop</span>
              <span class="analytics-chart-kpi-val emerald">${avgChurn5Yr}% → ${avgManaged5Yr}%</span>
            </div>
          </div>

          <div class="chart-legend-row">
            <span class="chart-legend-item"><span class="legend-swatch solid-amber"></span>Unmanaged Refinance Hazard</span>
            <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>Broc 90-Day Re-Fix Retention</span>
          </div>

          <div class="analytics-svg-well">
            <svg viewBox="0 0 ${c1W} ${c1H}" class="analytics-svg">
              ${churnTicks.map(pct => {
                const gy = y3(pct);
                return `
                  <line x1="${padL}" y1="${gy}" x2="${c1W - padR}" y2="${gy}" stroke="${gridStroke}" stroke-dasharray="3 3" />
                  <text x="${padL - 6}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${pct}%</text>
                `;
              }).join('')}

              <line x1="${x3(2)}" y1="${padT}" x2="${x3(2)}" y2="${padT + plotH}" stroke="#f59e0b" stroke-dasharray="3 3" />
              <text x="${x3(2)}" y="${padT + 9}" text-anchor="middle" class="svg-highlight-amber">3-Yr Cliff</text>
              <line x1="${x3(4)}" y1="${padT}" x2="${x3(4)}" y2="${padT + plotH}" stroke="#f59e0b" stroke-dasharray="3 3" />
              <text x="${x3(4)}" y="${padT + 9}" text-anchor="middle" class="svg-highlight-amber">5-Yr Cliff</text>

              <polygon points="${churnSavedPolygon}" fill="rgba(245, 158, 11, 0.14)" />
              <path d="${unmanagedChurnPath}" fill="none" stroke="#d97706" stroke-width="2.25" />
              <path d="${managedChurnPath}" fill="none" stroke="${emeraldStroke}" stroke-width="2.5" />

              ${churnSeries.map((d, i) => `
                <circle cx="${x3(i)}" cy="${y3(d.unmanaged)}" r="3.2" fill="#d97706">
                  <title>${d.year} Unmanaged Switcher Hazard: ${d.unmanaged}%</title>
                </circle>
                <circle cx="${x3(i)}" cy="${y3(d.managed)}" r="3" fill="${emeraldStroke}">
                  <title>${d.year} Broc Re-Fix Hazard: ${d.managed}%</title>
                </circle>
                <text x="${x3(i)}" y="${c1H - 8}" text-anchor="middle" class="svg-axis-label">${d.year}</text>
              `).join('')}
            </svg>
          </div>
        </div>

        <div class="analytics-stat-strip">
          <div class="analytics-mini-stat is-amber">
            <span class="analytics-mini-stat-label">Baseline 5-Yr Churn</span>
            <span class="analytics-mini-stat-val">${avgChurn5Yr}% (${highChurnCount} Watch)</span>
            <span class="analytics-mini-stat-sub">Spikes at Yr 3 &amp; Yr 5</span>
          </div>
          <div class="analytics-mini-stat is-emerald">
            <span class="analytics-mini-stat-label">With Clive Alert</span>
            <span class="analytics-mini-stat-val">${avgManaged5Yr}% (-${avgChurn5Yr - avgManaged5Yr} pts)</span>
            <span class="analytics-mini-stat-sub">LTV-band auto rate lock</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">Est. 10-Yr NII</span>
            <span class="analytics-mini-stat-val">${formatCompactEuro(sum10YrNII)}</span>
            <span class="analytics-mini-stat-sub" style="color:var(--brand-emerald-dark);">185 bps avg net margin</span>
          </div>
        </div>
      </div>

      <!-- CHART 4: 6-MONTH READINESS & PD VELOCITY -->
      <div id="analyticsChart4" class="analytics-chart-card">
        <div>
          <div class="analytics-chart-header">
            <div>
              <span class="analytics-badge is-indigo">Time Series 4 • Readiness &amp; PD (bps)</span>
              <h3 class="analytics-chart-title">Pre-Submission Score Climb vs 12-Mo Probability of Default</h3>
            </div>
            <div class="analytics-chart-kpi">
              <span class="analytics-chart-kpi-label">Est. 12-Mo PD</span>
              <span class="analytics-chart-kpi-val emerald">${avgPdBps} bps (${(avgPdBps / 100).toFixed(2)}%)</span>
            </div>
          </div>

          <div class="chart-legend-row">
            <span class="chart-legend-item"><span class="legend-swatch solid-emerald"></span>Broc Score (Left Axis, pts)</span>
            <span class="chart-legend-item"><span class="legend-swatch dashed-red"></span>12-Mo PD Risk (Right Axis, bps)</span>
          </div>

          <div class="analytics-svg-well">
            <svg viewBox="0 0 ${c1W} ${c1H}" class="analytics-svg">
              ${[50, 70, 90].map((sc, idx) => {
                const gy = y4Score(sc);
                const pdLabelVal = Math.round(maxPdScale * (1 - ((gy - padT) / plotH)));
                return `
                  <line x1="${padL}" y1="${gy}" x2="${c1W - padR4}" y2="${gy}" stroke="${gridStroke}" stroke-dasharray="3 3" />
                  <text x="${padL - 6}" y="${gy + 3}" text-anchor="end" class="svg-axis-label">${sc} pts</text>
                  <text x="${c1W - padR4 + 6}" y="${gy + 3}" text-anchor="start" style="font-size:9px;font-weight:600;fill:#ef4444;">${pdLabelVal} bps</text>
                `;
              }).join('')}

              <path d="${pdVelPath}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" />
              <path d="${scoreVelPath}" fill="none" stroke="${emeraldStroke}" stroke-width="2.5" />

              ${velocitySeries.map((d, i) => `
                <circle cx="${x4(i)}" cy="${y4Score(d.score)}" r="3.5" fill="${emeraldStroke}">
                  <title>${d.label}: Broc Score ${d.score}/100</title>
                </circle>
                <circle cx="${x4(i)}" cy="${y4Pd(d.pdBps)}" r="3" fill="#ef4444">
                  <title>${d.label}: 12-Mo PD ${d.pdBps} bps</title>
                </circle>
                <text x="${x4(i)}" y="${c1H - 8}" text-anchor="middle" class="svg-axis-label">${d.label}</text>
              `).join('')}
            </svg>
          </div>
        </div>

        <div class="analytics-stat-strip">
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">Readiness Climb</span>
            <span class="analytics-mini-stat-val" style="color:var(--brand-emerald-dark);">${avgBeforeScore} → ${avgNowScore}/100</span>
            <span class="analytics-mini-stat-sub">BNPL &amp; bill hygiene fixed</span>
          </div>
          <div class="analytics-mini-stat">
            <span class="analytics-mini-stat-label">12-Mo PD Drop</span>
            <span class="analytics-mini-stat-val">${velocitySeries[0].pdBps} → ${avgPdBps} bps</span>
            <span class="analytics-mini-stat-sub" style="color:var(--brand-emerald-dark);">-${velocitySeries[0].pdBps - avgPdBps} bps improvement</span>
          </div>
          <div class="analytics-mini-stat is-emerald">
            <span class="analytics-mini-stat-label">Green BER Mix</span>
            <span class="analytics-mini-stat-val">${greenPct}% Eligible</span>
            <span class="analytics-mini-stat-sub">${greenCount} of ${n} @ ${lender.greenRate}%</span>
          </div>
        </div>
      </div>

    </div>
  `;
}
