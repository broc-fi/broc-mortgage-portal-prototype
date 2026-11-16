/* ==========================================================================
   Broc. For Lenders — Clara & Clive Floating AI Copilot Drawer (840px)
   Deterministic Underwriting Intelligence over Live Queue & CBI Stress Math
   ========================================================================== */

let copilotMessages = [];

function toggleAssistant(forceOpen) {
  const drawer = document.getElementById('assistantDrawer');
  const overlay = document.getElementById('assistantOverlay');
  const fab = document.getElementById('vivienFabTrigger');
  if (!drawer || !overlay) return;

  const isCurrentlyOpen = drawer.classList.contains('open');
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isCurrentlyOpen;

  drawer.classList.toggle('open', shouldOpen);
  overlay.classList.toggle('show', shouldOpen);
  if (fab) {
    fab.classList.toggle('hidden-fab', shouldOpen);
  }

  if (shouldOpen) {
    if (copilotMessages.length === 0) {
      seedCopilotWelcome();
    } else {
      renderCopilotMessages();
    }
    const input = document.getElementById('assistantInput');
    if (input) setTimeout(() => input.focus(), 220);
  }
}

function openAssistantWithPrompt(prompt) {
  toggleAssistant(true);
  if (prompt) {
    setTimeout(() => handleAssistantChip(prompt), 120);
  }
}

function clearAssistantChat() {
  copilotMessages = [];
  seedCopilotWelcome();
}

function handleAssistantChip(prompt) {
  const input = document.getElementById('assistantInput');
  if (input) input.value = prompt;
  handleAssistantSend();
}

function openApplicantFromCopilot(applicantId) {
  toggleAssistant(false);
  if (typeof selectAndOpenDrawer === 'function') {
    selectAndOpenDrawer(applicantId);
  }
}

function previewAipFromCopilot(applicantId) {
  toggleAssistant(false);
  if (typeof window.portalState !== 'undefined') {
    window.portalState.selectedApplicantId = applicantId;
  }
  if (typeof selectAndOpenDrawer === 'function') {
    selectAndOpenDrawer(applicantId, 'OFFERS');
  }
  if (typeof triggerUnderwriterAction === 'function') {
    setTimeout(() => triggerUnderwriterAction('APPROVE'), 120);
  }
}

function handleAssistantKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleAssistantSend();
  }
}

function seedCopilotWelcome() {
  const state = window.portalState || { currentLenderId: 'BOI', currentDatasetMode: 'CURATED_7' };
  const lender = LENDERS[state.currentLenderId] || LENDERS.BOI;
  const dataset = typeof getActiveDataset === 'function' ? getActiveDataset() : CURATED_7_APPLICANTS;
  const fullCount = dataset.filter(a => a.targetStage === 'FULL').length;
  const aipCount = dataset.filter(a => a.targetStage === 'AIP').length;
  const nurtureCount = dataset.filter(a => a.targetStage === 'NURTURE').length;

  copilotMessages = [
    {
      role: 'assistant',
      html: `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span class="analytics-badge is-indigo">Clara &amp; Clive Live Desk</span>
          <span style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(lender.name)} • ${dataset.length} Packaged Files</span>
        </div>
        <p style="margin:0 0 8px 0;">
          Hi there! I'm tracking <strong>${dataset.length} borrower files</strong> in your active queue:
          <strong>${fullCount} Full Mortgage</strong>, <strong>${aipCount} Instant AIP</strong>, and
          <strong>${nurtureCount} in Clive Remediation</strong> (held cleanly inside <code>app.broc.fi</code> before submission).
        </p>
        <p style="margin:0;color:var(--text-muted);font-size:0.83rem;">
          Ask me to surface Score 90+ fast-track packs, audit Stamp 4 / Self-Employed files, inspect Churn Watchlist accounts, or explain any borrower's <strong>+${lender.stressBuffer.toFixed(1)}% CBI stress test</strong>.
        </p>
      `
    }
  ];
  renderCopilotMessages();
}

function buildCopilotCustomerCard(applicant, calc, customNote) {
  const privacyCls = (window.portalState && window.portalState.isPrivacyMode) ? 'privacy-masked' : '';
  const stageCls = applicant.targetStage === 'FULL'
    ? 'full-ready'
    : applicant.targetStage === 'AIP'
    ? 'aip-ready'
    : 'remediating';
  const stageText = applicant.targetStage === 'FULL'
    ? 'B) Full Mortgage'
    : applicant.targetStage === 'AIP'
    ? 'A) AIP Ready'
    : 'Clive Remediating';

  return `
    <div class="chat-customer-card">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <div class="customer-avatar" style="width:36px;height:36px;font-size:0.78rem;">${escapeHtml(getInitials(applicant.names))}</div>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <strong class="${privacyCls}" style="color:var(--text-primary);font-size:0.86rem;">${escapeHtml(applicant.names)}</strong>
              <span class="customer-stage-badge ${stageCls}"><span class="badge-dot"></span>${stageText}</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
              ${escapeHtml(applicant.id)} • <span class="${privacyCls}">${escapeHtml(applicant.county)}</span> • BER ${escapeHtml(applicant.propertyBER)} • Score <strong>${applicant.brocScore}/100</strong>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:0.95rem;color:var(--text-primary);">${formatEuro(calc.qualifiedLoan)}</div>
          <div style="font-size:0.71rem;color:var(--text-muted);">LTV ${calc.initialLtvPct}% • Churn ${calc.churnRisk5YrPct}%</div>
        </div>
      </div>
      ${customNote ? `<div style="margin-top:7px;font-size:0.76rem;color:var(--text-secondary);line-height:1.45;">${customNote}</div>` : ''}
      <div style="display:flex;gap:8px;margin-top:9px;flex-wrap:wrap;">
        <button class="btn-vivien-pill-primary" style="padding:0.32rem 0.78rem;font-size:0.74rem;" onclick="openApplicantFromCopilot('${applicant.id}')">
          Open 360° File →
        </button>
        ${applicant.targetStage !== 'NURTURE' ? `
          <button class="btn-pill-outline" style="padding:0.32rem 0.78rem;font-size:0.74rem;" onclick="previewAipFromCopilot('${applicant.id}')">
            Preview AIP Letter
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

function generateCopilotReply(queryText) {
  const q = queryText.toLowerCase().trim();
  const state = window.portalState || { currentLenderId: 'BOI', selectedApplicantId: 'BROC-IE-9001' };
  const lender = LENDERS[state.currentLenderId] || LENDERS.BOI;
  const dataset = typeof getActiveDataset === 'function' ? getActiveDataset() : CURATED_7_APPLICANTS;
  const selectedApp = dataset.find(a => a.id === state.selectedApplicantId) || dataset[0];

  // 1. Selected applicant +2% stress pass explanation
  if (q.includes('explain') || q.includes('stress') || q.includes('selected') || q.includes('ndi')) {
    const calc = calculateLoanQualification(selectedApp, lender);
    const privacyCls = state.isPrivacyMode ? 'privacy-masked' : '';
    return `
      <div style="margin-bottom:8px;">
        <strong>CBI +2.0% Stress Test Breakdown — <span class="${privacyCls}">${escapeHtml(selectedApp.names)}</span> (${escapeHtml(selectedApp.id)})</strong>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px;font-size:0.78rem;">
        <div style="padding:8px 10px;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-default);">
          <div style="color:var(--text-muted);">Recognized Income (${lender.shortName})</div>
          <strong style="color:var(--text-primary);">${formatEuro(calc.recognizedIncome)}</strong>
          <div style="color:var(--text-caption);">CBI ${calc.ltiMultiplier}x Cap = ${formatEuro(calc.maxLoanByLTI)}</div>
        </div>
        <div style="padding:8px 10px;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-default);">
          <div style="color:var(--text-muted);">Proven Capacity vs +2% Stressed</div>
          <strong style="color:var(--status-success-text);">${formatEuro(calc.effectiveMonthlyCapacity)}/mo vs ${formatEuro(calc.stressedMonthlyPayment)}/mo</strong>
          <div style="color:var(--text-caption);">Stressed @ ${calc.stressedRate.toFixed(2)}% (Offered ${calc.appliedRate.toFixed(2)}%)</div>
        </div>
      </div>
      <p style="margin:0 0 8px 0;font-size:0.8rem;">
        <strong>Clive Remediation Impact:</strong> Saved <strong>${formatEuro(selectedApp.cliveMonthlySavingsUnlocked)}/mo</strong> in recurring utility &amp; subscription tenders, expanding stress-tested borrowing capacity by <strong>+${formatEuro(calc.cliveLoanBoost)}</strong> and lifting Broc Score from <strong>${selectedApp.brocScoreBefore} → ${selectedApp.brocScore}/100</strong>.
      </p>
      ${buildCopilotCustomerCard(selectedApp, calc, `Binding Cap: <strong>${formatEuro(calc.qualifiedLoan)}</strong> (${calc.initialLtvPct}% LTV • PD ${calc.pd12MoBps} bps)`)}
    `;
  }

  // 2. Fast-track 90+ queue
  if (q.includes('90+') || q.includes('fast-track') || q.includes('fast track') || q.includes('top')) {
    const matches = dataset
      .filter(a => a.brocScore >= 90 && a.targetStage !== 'NURTURE')
      .sort((a, b) => b.brocScore - a.brocScore);
    const totalVol = matches.reduce((s, a) => s + calculateLoanQualification(a, lender).qualifiedLoan, 0);
    const preview = matches.slice(0, 4);
    return `
      <p style="margin:0 0 8px 0;">
        Found <strong>${matches.length} Fast-Track Ready Applications (Score ≥90)</strong> totaling
        <strong>${formatCompactEuro(totalVol)}</strong> in qualified ${escapeHtml(lender.shortName)} lending volume with clean CCR and 100% Stage A checks met:
      </p>
      ${preview.map(a => buildCopilotCustomerCard(a, calculateLoanQualification(a, lender), a.cliveStory)).join('')}
      ${matches.length > 4 ? `<p style="margin:8px 0 0 0;font-size:0.75rem;color:var(--text-muted);">Showing top 4 of ${matches.length}. Use the <strong>Score 90+</strong> filter inside Applicant Pipeline for the full cohort.</p>` : ''}
    `;
  }

  // 3. Churn watchlist >=30%
  if (q.includes('churn') || q.includes('watchlist') || q.includes('switcher') || q.includes('refinance') || q.includes('retention')) {
    const items = dataset
      .map(a => ({ a, calc: calculateLoanQualification(a, lender) }))
      .filter(x => x.calc.churnRisk5YrPct >= 30)
      .sort((x, y) => y.calc.churnRisk5YrPct - x.calc.churnRisk5YrPct);
    const avgBefore = items.length ? Math.round(items.reduce((s, x) => s + x.calc.churnRisk5YrPct, 0) / items.length) : 0;
    const avgAfter = items.length ? Math.round(items.reduce((s, x) => s + x.calc.churnRiskManagedPct, 0) / items.length) : 0;

    return `
      <p style="margin:0 0 8px 0;">
        Identified <strong>${items.length} Elevated Churn Risk Borrowers (5-Yr Hazard ≥30%)</strong> — primarily low-LTV switchers or non-Green BER profiles rolling off Yr 3/Yr 5 fixed terms.
        Activating Clive's 90-day pre-expiry re-fix alerts lowers churn from <strong>${avgBefore}% → ${avgAfter}%</strong>.
      </p>
      ${items.slice(0, 4).map(x => buildCopilotCustomerCard(
        x.a,
        x.calc,
        `5-Yr Unmanaged Churn: <strong>${x.calc.churnRisk5YrPct}%</strong> → Broc Auto-Retained: <strong>${x.calc.churnRiskManagedPct}%</strong> • 10-Yr Est. NII: <strong>${formatEuro(x.calc.est10YrNII)}</strong>`
      )).join('')}
    `;
  }

  // 4. Stamp 4 & Self-Employed complex underwriting
  if (q.includes('stamp 4') || q.includes('self-employed') || q.includes('self employed') || q.includes('form 11') || q.includes('residency')) {
    const complex = dataset.filter(a => {
      const hay = `${a.citizenship} ${a.kycBadge} ${a.statusBadge}`.toLowerCase();
      return hay.includes('stamp 4') || hay.includes('self-employed') || hay.includes('cta') || hay.includes('eu');
    });
    return `
      <p style="margin:0 0 8px 0;">
        Found <strong>${complex.length} Specialist Underwriting Packs</strong> with pre-verified residency (Stamp 4 IRP / CTA / EU) or self-employed Form 11 + ROS Tax Clearance documentation:
      </p>
      ${complex.slice(0, 4).map(a => buildCopilotCustomerCard(a, calculateLoanQualification(a, lender), `<strong>KYC / Docs:</strong> ${escapeHtml(a.kycBadge)} • ${escapeHtml(a.cliveStory)}`)).join('')}
    `;
  }

  // 5. Clive Remediation / Nurture queue
  if (q.includes('remediation') || q.includes('nurture') || q.includes('klarna') || q.includes('bnpl') || q.includes('clive')) {
    const nurture = dataset.filter(a => a.targetStage === 'NURTURE');
    return `
      <p style="margin:0 0 8px 0;">
        <strong>${nurture.length} Borrower${nurture.length === 1 ? '' : 's'} Protected in Pre-Submission Remediation Mode</strong> inside <code>app.broc.fi</code>.
        Clive automatically paused submission until Klarna/BNPL streaks clear and 6 clean savings months complete — preserving ${escapeHtml(lender.shortName)} approval conversion at &gt;94%.
      </p>
      ${nurture.slice(0, 4).map(a => buildCopilotCustomerCard(a, calculateLoanQualification(a, lender), a.cliveStory)).join('')}
    `;
  }

  // 6. General search across dataset (county, names, id, BER, HTB, etc.)
  const terms = q.split(/\s+/).filter(t => t.length > 1 && !['show', 'me', 'find', 'the', 'for', 'and', 'with', 'who', 'are', 'what'].includes(t));
  const matched = terms.length > 0
    ? dataset.filter(a => {
        const hay = `${a.names} ${a.id} ${a.county} ${a.citizenship} ${a.buyerType} ${a.propertyBER} ${a.statusBadge} ${a.cliveStory} ${a.helpToBuyGrant > 0 ? 'htb help to buy' : ''}`.toLowerCase();
        return terms.every(t => hay.includes(t));
      })
    : dataset.slice(0, 3);

  if (matched.length > 0) {
    return `
      <p style="margin:0 0 8px 0;">
        Matched <strong>${matched.length} application${matched.length === 1 ? '' : 's'}</strong> in the active ${escapeHtml(lender.shortName)} cohort for "<em>${escapeHtml(queryText)}</em>":
      </p>
      ${matched.slice(0, 4).map(a => buildCopilotCustomerCard(a, calculateLoanQualification(a, lender), a.cliveStory)).join('')}
    `;
  }

  return `
    <p style="margin:0 0 8px 0;">
      I searched all <strong>${dataset.length} applications</strong> for "<em>${escapeHtml(queryText)}</em>" under ${escapeHtml(lender.shortName)} credit rules.
      Try filtering by county (e.g. <strong>Dublin</strong>, <strong>Cork</strong>, <strong>Galway</strong>), borrower name, <strong>Stamp 4</strong>, <strong>BER A2</strong>, <strong>Switcher</strong>, or tap a quick prompt below!
    </p>
  `;
}

function handleAssistantSend() {
  const input = document.getElementById('assistantInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  copilotMessages.push({
    role: 'user',
    html: escapeHtml(text)
  });

  const replyHtml = generateCopilotReply(text);
  copilotMessages.push({
    role: 'assistant',
    html: replyHtml
  });

  renderCopilotMessages();
}

function renderCopilotMessages() {
  const body = document.getElementById('assistantChatBody');
  if (!body) return;
  body.innerHTML = copilotMessages.map(m => {
    const cls = m.role === 'user' ? 'message-user' : 'message-vivien';
    return `<div class="message-bubble ${cls}">${m.html}</div>`;
  }).join('');
  body.scrollTop = body.scrollHeight;
}
