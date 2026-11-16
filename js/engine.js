/* ==========================================================================
   Broc. For Lenders — Underwriting Simulation & Financial Math Engine
   Zero-build static module preserving CBI caps, +2% stress test & 30-Yr LTV
   ========================================================================== */

function getEffectiveLenderPolicy(baseLender) {
  if (!baseLender) return baseLender;
  if (typeof window !== 'undefined' && window.portalState && window.portalState.policyOverrides) {
    const overrides = window.portalState.policyOverrides[baseLender.id];
    if (overrides && typeof overrides === 'object') {
      return { ...baseLender, ...overrides };
    }
  }
  return baseLender;
}

function getMacroScenario(overrideId) {
  let val = overrideId;
  if (!val && typeof window !== 'undefined' && window.portalState && window.portalState.macroScenario) {
    val = window.portalState.macroScenario;
  }
  if (!val && typeof document !== 'undefined') {
    const el = document.getElementById('macroScenarioSelect');
    if (el) val = el.value;
  }
  if (!val) val = 'BASE';

  if (val === 'STRESSED') {
    return {
      id: 'STRESSED',
      label: 'Downside Stress (-5% Yr1 HPI, +1.0% Rate)',
      hpiAnnual: 0.008,
      yr1Shock: -0.05,
      rateAddon: 1.0
    };
  }
  if (val === 'UPSIDE') {
    return {
      id: 'UPSIDE',
      label: 'Green Growth (+4.0% HPI, Clive Overpay)',
      hpiAnnual: 0.04,
      yr1Shock: 0.0,
      rateAddon: -0.15
    };
  }
  return {
    id: 'BASE',
    label: 'CBI Base Case (+2.5% HPI)',
    hpiAnnual: 0.025,
    yr1Shock: 0.0,
    rateAddon: 0.0
  };
}

function extractPropertyContext(applicant) {
  const addr = String(applicant.targetPropertyAddress || '');
  let saleAgreedPrice = null;
  let switcherBalance = null;

  const saleMatch = addr.match(/Sale Agreed\s*@\s*€([\d,]+)/i);
  if (saleMatch) {
    saleAgreedPrice = Number(saleMatch[1].replace(/,/g, ''));
  }

  const switchMatch = addr.match(/Switching\s*€([\d,]+)(k)?/i);
  if (switchMatch) {
    const raw = Number(switchMatch[1].replace(/,/g, ''));
    switcherBalance = switchMatch[2] ? raw * 1000 : raw;
  }

  return { saleAgreedPrice, switcherBalance };
}

function calculateLoanQualification(applicant, baseLender, rateMode = 'DEFAULT') {
  const lender = getEffectiveLenderPolicy(baseLender);
  const macro = getMacroScenario();
  const propCtx = extractPropertyContext(applicant);

  const ltiMultiplier = applicant.buyerType === 'FTB' ? 4.0 : 3.5;
  const recognizedIncome = applicant.baseIncome + (applicant.bonusIncome * lender.maxVariableBonusPct);
  const maxLoanByLTI = Math.round(recognizedIncome * ltiMultiplier);

  const totalDeposit = applicant.depositSaved + applicant.helpToBuyGrant + applicant.giftAmount;
  const maxLoanByDeposit90LTV = applicant.buyerType === 'SWITCHER' && propCtx.switcherBalance
    ? Math.round((propCtx.switcherBalance + applicant.depositSaved) * 0.9)
    : totalDeposit * 9;

  const isGreenEligible = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].includes(applicant.propertyBER);

  let appliedRate = isGreenEligible ? lender.greenRate : lender.stdRate;
  if (rateMode === 'STANDARD') {
    appliedRate = lender.stdRate;
  } else if (rateMode === 'GREEN_RECOMMENDED') {
    appliedRate = lender.greenRate;
  }
  const effectiveAppliedRate = Math.max(2.0, appliedRate + (macro.rateAddon * 0.35));
  const stressedRate = effectiveAppliedRate + lender.stressBuffer;

  const provenMonthlyCapacity = applicant.verifiedRentPm + applicant.verifiedSavingsPm - applicant.existingDebtPm;
  const minLivingCost = (applicant.applicantsCount === 2 ? lender.livingCostCouple : lender.livingCostSingle) +
    (applicant.dependents * lender.livingCostPerChild);
  const ndiCapacity = applicant.netMonthlyIncome - minLivingCost - applicant.existingDebtPm;
  const effectiveMonthlyCapacity = Math.min(provenMonthlyCapacity, ndiCapacity);

  const r = (stressedRate / 100) / 12;
  const n = applicant.termYears * 12;
  const annuityFactor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const maxLoanByStressTest = Math.max(0, Math.round(effectiveMonthlyCapacity / annuityFactor));
  const cliveLoanBoost = Math.max(0, Math.round(applicant.cliveMonthlySavingsUnlocked / annuityFactor));

  const rawMaxLoan = Math.min(maxLoanByLTI, maxLoanByStressTest, maxLoanByDeposit90LTV);
  let qualifiedLoan = Math.max(0, Math.round(rawMaxLoan / 1000) * 1000);

  // Determine which rule actually constrained max borrowing
  let bindingConstraint = 'LTI';
  let bindingLabel = `CBI ${ltiMultiplier.toFixed(1)}x LTI Cap`;
  if (rawMaxLoan === maxLoanByDeposit90LTV) {
    bindingConstraint = 'DEPOSIT_LTV';
    bindingLabel = applicant.buyerType === 'SWITCHER' ? '90% LTV Equity Cap' : '90% LTV Deposit Cap';
  } else if (rawMaxLoan === maxLoanByStressTest) {
    bindingConstraint = 'STRESS_NDI';
    bindingLabel = ndiCapacity < provenMonthlyCapacity ? 'NDI Living Buffer' : `+${lender.stressBuffer.toFixed(1)}% Stress Test`;
  }

  // For Switchers with an explicit balance (like €320k) or Stage B Sale Agreed loans,
  // track both max capacity and the actual requested/target facility
  let requestedLoan = qualifiedLoan;
  let targetPropertyValue = qualifiedLoan + totalDeposit;
  if (applicant.buyerType === 'SWITCHER' && propCtx.switcherBalance) {
    requestedLoan = Math.min(qualifiedLoan, propCtx.switcherBalance);
    targetPropertyValue = propCtx.switcherBalance + applicant.depositSaved;
    bindingConstraint = 'SWITCHER_BALANCE';
    bindingLabel = 'Like-for-Like Switch Balance';
  } else if (propCtx.saleAgreedPrice) {
    targetPropertyValue = propCtx.saleAgreedPrice;
    requestedLoan = Math.max(0, Math.min(qualifiedLoan, propCtx.saleAgreedPrice - totalDeposit));
  }

  const loanForPricing = applicant.buyerType === 'SWITCHER' && propCtx.switcherBalance
    ? requestedLoan
    : (propCtx.saleAgreedPrice ? requestedLoan : qualifiedLoan);

  const stressedMonthlyPayment = Math.round(loanForPricing * annuityFactor);
  const actualMonthlyRate = (effectiveAppliedRate / 100) / 12;
  const actualAnnuityFactor = (actualMonthlyRate * Math.pow(1 + actualMonthlyRate, n)) / (Math.pow(1 + actualMonthlyRate, n) - 1);
  const actualMonthlyPayment = Math.round(loanForPricing * actualAnnuityFactor);

  const passesStressTest = effectiveMonthlyCapacity >= stressedMonthlyPayment;
  const stressMarginPm = effectiveMonthlyCapacity - stressedMonthlyPayment;
  const stressCoveragePct = stressedMonthlyPayment > 0
    ? Math.round((effectiveMonthlyCapacity / stressedMonthlyPayment) * 100)
    : 100;
  const actualLtiRatio = recognizedIncome > 0
    ? Number((loanForPricing / recognizedIncome).toFixed(2))
    : 0;
  const isCbiExceptionCandidate = actualLtiRatio > ltiMultiplier;

  // Projected Grant Range (P10 Conservative Floor vs P50 Qualified Base vs P90 Clive + CBI Exception Ceiling)
  const rConservative = ((stressedRate + 0.75) / 100) / 12;
  const conservativeAnnuity = (rConservative * Math.pow(1 + rConservative, n)) / (Math.pow(1 + rConservative, n) - 1);
  const preCliveCapacity = Math.max(800, effectiveMonthlyCapacity - Math.round(applicant.cliveMonthlySavingsUnlocked * 0.65));
  const loanGrantLow = Math.round(Math.min(applicant.baseIncome * ltiMultiplier * 0.94, preCliveCapacity / conservativeAnnuity, qualifiedLoan * 0.91) / 1000) * 1000;
  const loanGrantMid = qualifiedLoan;
  const cbiExceptionLtiCap = Math.round((applicant.baseIncome + applicant.bonusIncome * 0.85) * (ltiMultiplier + 0.35));
  const loanGrantHigh = Math.round(Math.min(cbiExceptionLtiCap, maxLoanByStressTest + cliveLoanBoost, maxLoanByDeposit90LTV) / 1000) * 1000;

  // Property Value & Initial LTV
  const maxPurchasingPower = qualifiedLoan + totalDeposit;
  const initialLtvPct = targetPropertyValue > 0
    ? Number(((loanForPricing / targetPropertyValue) * 100).toFixed(1))
    : 80.0;

  // Amortization & LTV Series (extends to full term so 32/35 yr FTB loans amortize cleanly)
  const seriesMaxYear = Math.max(30, applicant.termYears);
  const ltv30YrSeries = [];
  let cliveBalance = loanForPricing;
  const rm = (effectiveAppliedRate / 100) / 12;
  const monthlyScheduledPmt = loanForPricing * ((rm * Math.pow(1 + rm, n)) / (Math.pow(1 + rm, n) - 1));
  const monthlyOverpay = Math.round(applicant.cliveMonthlySavingsUnlocked * 0.85);
  let clivePayoffYear = applicant.termYears;
  const scheduledTotalInterest = Math.max(0, Math.round((monthlyScheduledPmt * n) - loanForPricing));
  let cliveInterestPaid = 0;

  for (let yr = 0; yr <= seriesMaxYear; yr++) {
    const monthsElapsed = yr * 12;
    let schedBal = 0;
    if (monthsElapsed < n) {
      schedBal = loanForPricing * ((Math.pow(1 + rm, n) - Math.pow(1 + rm, monthsElapsed)) / (Math.pow(1 + rm, n) - 1));
    }
    schedBal = Math.max(0, Math.round(schedBal));

    if (yr > 0) {
      for (let m = 0; m < 12; m++) {
        if (cliveBalance > 0) {
          const interestM = cliveBalance * rm;
          cliveInterestPaid += interestM;
          const principalM = (monthlyScheduledPmt - interestM) + monthlyOverpay;
          cliveBalance = Math.max(0, cliveBalance - principalM);
        }
      }
      if (cliveBalance === 0 && clivePayoffYear === applicant.termYears) {
        clivePayoffYear = yr;
      }
    }

    const hpiFactor = yr === 0
      ? 1.0
      : (1 + macro.yr1Shock) * Math.pow(1 + macro.hpiAnnual, Math.max(0, yr - 1));
    const projectedPropVal = targetPropertyValue * hpiFactor;

    const flatHpiLtv = Number(((schedBal / Math.max(1, targetPropertyValue)) * 100).toFixed(1));
    const baseHpiLtv = Number(((schedBal / Math.max(1, projectedPropVal)) * 100).toFixed(1));
    const cliveOverpayLtv = Number(((cliveBalance / Math.max(1, projectedPropVal)) * 100).toFixed(1));

    ltv30YrSeries.push({
      year: yr,
      remainingBalance: schedBal,
      cliveBalance: Math.round(cliveBalance),
      propertyValue: Math.round(projectedPropVal),
      flatHpiLtv,
      baseHpiLtv,
      cliveOverpayLtv
    });
  }

  const year10LtvPct = ltv30YrSeries[10] ? ltv30YrSeries[10].baseHpiLtv : 0;
  const year10CliveLtvPct = ltv30YrSeries[10] ? ltv30YrSeries[10].cliveOverpayLtv : 0;
  const year20LtvPct = ltv30YrSeries[20] ? ltv30YrSeries[20].baseHpiLtv : 0;
  const yearsSavedByClive = Math.max(1, applicant.termYears - clivePayoffYear);
  const interestSavedByClive = Math.max(4200, Math.round(scheduledTotalInterest - cliveInterestPaid));

  // Churn Risk & Refinance Propensity
  let baseChurn5Yr = 22;
  if (applicant.buyerType === 'SWITCHER') baseChurn5Yr += 14;
  else if (applicant.buyerType === 'SSB') baseChurn5Yr += 5;
  if (!isGreenEligible) baseChurn5Yr += 9;
  else if (['A1', 'A2'].includes(applicant.propertyBER)) baseChurn5Yr -= 6;
  if (initialLtvPct <= 70) baseChurn5Yr += 6;
  if (applicant.baseIncome >= 120000) baseChurn5Yr += 4;
  if (macro.id === 'STRESSED') baseChurn5Yr += 5;

  const churnRisk5YrPct = Math.min(62, Math.max(11, Math.round(baseChurn5Yr)));
  const churnRiskManagedPct = Math.max(6, Math.round(churnRisk5YrPct * 0.38));
  const churnRiskLabel = churnRisk5YrPct < 20 ? 'Low' : churnRisk5YrPct <= 30 ? 'Moderate' : 'Elevated';

  // 12-Month Probability of Default (PD in bps) & 10-Year Net Interest Income (NII)
  const pd12MoBps = Math.max(12, Math.round(145 - (applicant.brocScore * 1.28) + (initialLtvPct > 82 ? 14 : 0)));
  const avg10YrBalance = (loanForPricing + (ltv30YrSeries[10] ? ltv30YrSeries[10].remainingBalance : loanForPricing * 0.75)) / 2;
  const est10YrNII = Math.round(avg10YrBalance * 0.0185 * 10);

  return {
    ltiMultiplier,
    actualLtiRatio,
    isCbiExceptionCandidate,
    recognizedIncome,
    maxLoanByLTI,
    maxLoanByDeposit90LTV,
    totalDeposit,
    isGreenEligible,
    appliedRate: effectiveAppliedRate,
    baseOfferedRate: appliedRate,
    stressedRate,
    provenMonthlyCapacity,
    ndiCapacity,
    effectiveMonthlyCapacity,
    maxLoanByStressTest,
    cliveLoanBoost,
    qualifiedLoan,
    requestedLoan,
    loanForPricing,
    targetPropertyValue,
    saleAgreedPrice: propCtx.saleAgreedPrice,
    switcherBalance: propCtx.switcherBalance,
    bindingConstraint,
    bindingLabel,
    passesStressTest,
    stressMarginPm,
    stressCoveragePct,
    loanGrantLow,
    loanGrantMid,
    loanGrantHigh,
    cbiExceptionLtiCap,
    maxPurchasingPower,
    initialLtvPct,
    year10LtvPct,
    year10CliveLtvPct,
    year20LtvPct,
    yearsSavedByClive,
    clivePayoffYear,
    monthlyOverpay,
    interestSavedByClive,
    seriesMaxYear,
    ltv30YrSeries,
    churnRisk5YrPct,
    churnRiskManagedPct,
    churnRiskLabel,
    pd12MoBps,
    est10YrNII,
    stressedMonthlyPayment,
    actualMonthlyPayment,
    effectiveTermYears: rateMode === 'CLIVE_OVERPAY' ? clivePayoffYear : applicant.termYears,
    effectiveMonthlyOutlay: rateMode === 'CLIVE_OVERPAY' ? (actualMonthlyPayment + monthlyOverpay) : actualMonthlyPayment
  };
}

/**
 * Reconciles Pillar 1 note dynamically against live lender policy & macro stress
 * so switching BOI <-> White-Label never shows stale BOI numbers in the Score tab.
 */
function getDynamicScorePillars(applicant, baseLender, calc) {
  const lender = getEffectiveLenderPolicy(baseLender);
  return (applicant.scorePillars || []).map((p, idx) => {
    if (idx === 0) {
      const statusText = calc.passesStressTest
        ? `${calc.stressCoveragePct}% stress coverage (+${formatEuro(calc.stressMarginPm)}/mo headroom)`
        : `${calc.stressCoveragePct}% stress coverage (${formatEuro(calc.stressMarginPm)}/mo shortfall)`;
      return {
        ...p,
        note: `${formatEuro(calc.effectiveMonthlyCapacity)}/mo net capacity vs ${formatEuro(calc.stressedMonthlyPayment)}/mo stressed @ ${calc.stressedRate.toFixed(2)}% (${lender.shortName}) — ${statusText}`
      };
    }
    if (idx === 2 && applicant.bonusIncome > 0) {
      const capPct = Math.round(lender.maxVariableBonusPct * 100);
      return {
        ...p,
        note: `${p.note} • ${lender.shortName} recognizes ${capPct}% variable bonus (${formatEuro(calc.recognizedIncome)} total)`
      };
    }
    return p;
  });
}

function computeCbiExceptionMetrics(list, baseLender) {
  const lender = getEffectiveLenderPolicy(baseLender);
  let ftbCount = 0;
  let ftbNearOrException = 0;
  let ssbCount = 0;
  let ssbNearOrException = 0;
  let eligibleTotal = 0;

  list.forEach(a => {
    if (a.targetStage === 'NURTURE') return;
    eligibleTotal++;
    const c = calculateLoanQualification(a, lender);
    if (a.buyerType === 'FTB') {
      ftbCount++;
      if (c.actualLtiRatio >= 3.85 || c.bindingConstraint === 'LTI') ftbNearOrException++;
    } else if (a.buyerType === 'SSB') {
      ssbCount++;
      if (c.actualLtiRatio >= 3.35 || c.bindingConstraint === 'LTI') ssbNearOrException++;
    }
  });

  // CBI allows up to 15% of total lending volume to exceed standard LTI thresholds
  const ftbUsedPct = ftbCount > 0 ? Math.min(14.5, Number(((ftbNearOrException / Math.max(1, ftbCount)) * 12).toFixed(1))) : 0;
  const ssbUsedPct = ssbCount > 0 ? Math.min(14.5, Number(((ssbNearOrException / Math.max(1, ssbCount)) * 10).toFixed(1))) : 0;

  return {
    eligibleTotal,
    ftbCount,
    ftbAllowanceCapPct: 15.0,
    ftbUsedPct,
    ssbCount,
    ssbAllowanceCapPct: 15.0,
    ssbUsedPct
  };
}

/* 3-Tile Vivien Scenario Modeler Generator for Drawer & AIP Certificate */
function getApplicantOfferScenarios(applicant, baseLender) {
  const lender = getEffectiveLenderPolicy(baseLender);
  const stdCalc = calculateLoanQualification(applicant, lender, 'STANDARD');
  const greenCalc = calculateLoanQualification(applicant, lender, 'GREEN_RECOMMENDED');
  const cliveCalc = calculateLoanQualification(applicant, lender, 'CLIVE_OVERPAY');

  const isGreenEligible = greenCalc.isGreenEligible;

  return {
    STANDARD: {
      id: 'STANDARD',
      title: 'Standard 4-Yr Fixed',
      badgeText: `${stdCalc.appliedRate.toFixed(2)}% APR`,
      isRecommended: !isGreenEligible,
      isIssuable: true,
      rate: stdCalc.appliedRate,
      monthlyPayment: stdCalc.actualMonthlyPayment,
      stressedPayment: stdCalc.stressedMonthlyPayment,
      stressedRate: stdCalc.stressedRate,
      qualifiedLoan: stdCalc.qualifiedLoan,
      loanForPricing: stdCalc.loanForPricing,
      maxPurchasingPower: stdCalc.maxPurchasingPower,
      totalDeposit: stdCalc.totalDeposit,
      termLabel: `${applicant.termYears} yrs • Baseline`,
      metaLine: `Stressed @ ${stdCalc.stressedRate.toFixed(2)}% (${formatEuro(stdCalc.stressedMonthlyPayment)}/mo)`,
      calc: stdCalc
    },
    GREEN_RECOMMENDED: {
      id: 'GREEN_RECOMMENDED',
      title: isGreenEligible ? 'Green EcoSaver' : 'Green Retrofit Path',
      badgeText: isGreenEligible ? 'Recommended' : `BER ${applicant.propertyBER} → B3 Req`,
      isRecommended: isGreenEligible,
      isIssuable: isGreenEligible,
      rate: greenCalc.appliedRate,
      monthlyPayment: greenCalc.actualMonthlyPayment,
      stressedPayment: greenCalc.stressedMonthlyPayment,
      stressedRate: greenCalc.stressedRate,
      qualifiedLoan: greenCalc.qualifiedLoan,
      loanForPricing: greenCalc.loanForPricing,
      maxPurchasingPower: greenCalc.maxPurchasingPower,
      totalDeposit: greenCalc.totalDeposit,
      termLabel: isGreenEligible
        ? `${applicant.termYears} yrs • ${greenCalc.appliedRate.toFixed(2)}% Fixed`
        : `Post-Upgrade Est. • ${greenCalc.appliedRate.toFixed(2)}%`,
      metaLine: isGreenEligible
        ? `BER ${applicant.propertyBER} saves ${formatEuro(Math.max(12, stdCalc.actualMonthlyPayment - greenCalc.actualMonthlyPayment))}/mo`
        : `Projection only — requires BER B3+ cert to lock`,
      calc: greenCalc
    },
    CLIVE_OVERPAY: {
      id: 'CLIVE_OVERPAY',
      title: 'Clive Accelerated Overpay',
      badgeText: `-${cliveCalc.yearsSavedByClive} Yrs Term`,
      isRecommended: false,
      isIssuable: true,
      rate: cliveCalc.appliedRate,
      monthlyPayment: cliveCalc.actualMonthlyPayment + cliveCalc.monthlyOverpay,
      basePayment: cliveCalc.actualMonthlyPayment,
      overpayAmount: cliveCalc.monthlyOverpay,
      stressedPayment: cliveCalc.stressedMonthlyPayment,
      stressedRate: cliveCalc.stressedRate,
      qualifiedLoan: cliveCalc.qualifiedLoan,
      loanForPricing: cliveCalc.loanForPricing,
      maxPurchasingPower: cliveCalc.maxPurchasingPower,
      totalDeposit: cliveCalc.totalDeposit,
      termLabel: `Payoff in ${cliveCalc.clivePayoffYear} yrs (+${formatEuro(cliveCalc.monthlyOverpay)}/mo)`,
      metaLine: `Yr 10 LTV drops to ${cliveCalc.year10CliveLtvPct}% • Saves ${formatCompactEuro(cliveCalc.interestSavedByClive)}`,
      calc: cliveCalc
    }
  };
}

function formatEuro(num) {
  const sign = num < 0 ? '-' : '';
  return sign + '€' + Math.abs(Number(num || 0)).toLocaleString('en-IE');
}

function formatCompactEuro(num) {
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(Number(num || 0));
  if (abs >= 1000000) {
    return sign + '€' + (abs / 1000000).toFixed(abs >= 10000000 ? 1 : 2) + 'M';
  }
  if (abs >= 1000) {
    return sign + '€' + Math.round(abs / 1000) + 'k';
  }
  return sign + '€' + Math.round(abs);
}

function getInitials(names) {
  if (!names) return 'BR';
  const cleaned = names.replace(/&/g, ' ').replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
