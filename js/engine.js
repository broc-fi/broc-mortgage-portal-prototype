/* ==========================================================================
   Broc. For Lenders — Underwriting Simulation & Financial Math Engine
   Zero-build static module preserving CBI caps, +2% stress test & 30-Yr LTV
   ========================================================================== */

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

function calculateLoanQualification(applicant, lender, rateMode = 'DEFAULT') {
  const ltiMultiplier = applicant.buyerType === 'FTB' ? 4.0 : 3.5;
  const recognizedIncome = applicant.baseIncome + (applicant.bonusIncome * lender.maxVariableBonusPct);
  const maxLoanByLTI = Math.round(recognizedIncome * ltiMultiplier);

  const totalDeposit = applicant.depositSaved + applicant.helpToBuyGrant + applicant.giftAmount;
  const maxLoanByDeposit90LTV = totalDeposit * 9;

  const isGreenEligible = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].includes(applicant.propertyBER);

  let appliedRate = isGreenEligible ? lender.greenRate : lender.stdRate;
  if (rateMode === 'STANDARD') {
    appliedRate = lender.stdRate;
  } else if (rateMode === 'GREEN_RECOMMENDED') {
    appliedRate = lender.greenRate;
  }
  const stressedRate = appliedRate + lender.stressBuffer;

  const provenMonthlyCapacity = applicant.verifiedRentPm + applicant.verifiedSavingsPm - applicant.existingDebtPm;
  const minLivingCost = (applicant.applicantsCount === 2 ? lender.livingCostCouple : lender.livingCostSingle) +
    (applicant.dependents * lender.livingCostPerChild);
  const ndiCapacity = applicant.netMonthlyIncome - minLivingCost - applicant.existingDebtPm;
  const effectiveMonthlyCapacity = Math.min(provenMonthlyCapacity, ndiCapacity);

  const r = (stressedRate / 100) / 12;
  const n = applicant.termYears * 12;
  const annuityFactor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const maxLoanByStressTest = Math.round(effectiveMonthlyCapacity / annuityFactor);
  const cliveLoanBoost = Math.round(applicant.cliveMonthlySavingsUnlocked / annuityFactor);

  const qualifiedLoan = Math.round(Math.min(maxLoanByLTI, maxLoanByStressTest, maxLoanByDeposit90LTV) / 1000) * 1000;
  const stressedMonthlyPayment = Math.round(qualifiedLoan * annuityFactor);
  const actualMonthlyRate = (appliedRate / 100) / 12;
  const actualAnnuityFactor = (actualMonthlyRate * Math.pow(1 + actualMonthlyRate, n)) / (Math.pow(1 + actualMonthlyRate, n) - 1);
  const actualMonthlyPayment = Math.round(qualifiedLoan * actualAnnuityFactor);

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
  const initialLtvPct = maxPurchasingPower > 0 ? Number(((qualifiedLoan / maxPurchasingPower) * 100).toFixed(1)) : 80.0;

  // 30-Year LTV & Amortization Series
  const macro = getMacroScenario();
  const ltv30YrSeries = [];
  let cliveBalance = qualifiedLoan;
  const effectiveActualRate = Math.max(2.0, appliedRate + (macro.rateAddon * 0.35));
  const rm = (effectiveActualRate / 100) / 12;
  const monthlyScheduledPmt = qualifiedLoan * ((rm * Math.pow(1 + rm, n)) / (Math.pow(1 + rm, n) - 1));
  const monthlyOverpay = Math.round(applicant.cliveMonthlySavingsUnlocked * 0.85);
  let clivePayoffYear = applicant.termYears;
  let scheduledTotalInterest = Math.max(0, Math.round((monthlyScheduledPmt * n) - qualifiedLoan));
  let cliveInterestPaid = 0;

  for (let yr = 0; yr <= 30; yr++) {
    const monthsElapsed = yr * 12;
    let schedBal = 0;
    if (monthsElapsed < n) {
      schedBal = qualifiedLoan * ((Math.pow(1 + rm, n) - Math.pow(1 + rm, monthsElapsed)) / (Math.pow(1 + rm, n) - 1));
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
    const projectedPropVal = maxPurchasingPower * hpiFactor;

    const flatHpiLtv = Number(((schedBal / maxPurchasingPower) * 100).toFixed(1));
    const baseHpiLtv = Number(((schedBal / projectedPropVal) * 100).toFixed(1));
    const cliveOverpayLtv = Number(((cliveBalance / projectedPropVal) * 100).toFixed(1));

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
  const avg10YrBalance = (qualifiedLoan + (ltv30YrSeries[10] ? ltv30YrSeries[10].remainingBalance : qualifiedLoan * 0.75)) / 2;
  const est10YrNII = Math.round(avg10YrBalance * 0.0185 * 10);

  return {
    ltiMultiplier,
    recognizedIncome,
    maxLoanByLTI,
    totalDeposit,
    isGreenEligible,
    appliedRate,
    stressedRate,
    provenMonthlyCapacity,
    effectiveMonthlyCapacity,
    maxLoanByStressTest,
    cliveLoanBoost,
    qualifiedLoan,
    loanGrantLow,
    loanGrantMid,
    loanGrantHigh,
    maxPurchasingPower,
    initialLtvPct,
    year10LtvPct,
    year10CliveLtvPct,
    year20LtvPct,
    yearsSavedByClive,
    clivePayoffYear,
    monthlyOverpay,
    interestSavedByClive,
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

/* 3-Tile Vivien Scenario Modeler Generator for Drawer & AIP Certificate */
function getApplicantOfferScenarios(applicant, lender) {
  const stdCalc = calculateLoanQualification(applicant, lender, 'STANDARD');
  const greenCalc = calculateLoanQualification(applicant, lender, 'GREEN_RECOMMENDED');
  const cliveCalc = calculateLoanQualification(applicant, lender, 'CLIVE_OVERPAY');

  const isGreenEligible = greenCalc.isGreenEligible;

  return {
    STANDARD: {
      id: 'STANDARD',
      title: 'Standard 4-Yr Fixed',
      badgeText: `${lender.stdRate.toFixed(2)}% APR`,
      isRecommended: false,
      rate: lender.stdRate,
      monthlyPayment: stdCalc.actualMonthlyPayment,
      stressedPayment: stdCalc.stressedMonthlyPayment,
      stressedRate: stdCalc.stressedRate,
      qualifiedLoan: stdCalc.qualifiedLoan,
      maxPurchasingPower: stdCalc.maxPurchasingPower,
      totalDeposit: stdCalc.totalDeposit,
      termLabel: `${applicant.termYears} yrs • Baseline`,
      metaLine: `Stressed @ ${stdCalc.stressedRate.toFixed(2)}% (${formatEuro(stdCalc.stressedMonthlyPayment)}/mo)`,
      calc: stdCalc
    },
    GREEN_RECOMMENDED: {
      id: 'GREEN_RECOMMENDED',
      title: isGreenEligible ? 'Green EcoSaver' : 'Green Upgrade Path',
      badgeText: isGreenEligible ? 'Recommended' : `BER C → B3`,
      isRecommended: true,
      rate: lender.greenRate,
      monthlyPayment: greenCalc.actualMonthlyPayment,
      stressedPayment: greenCalc.stressedMonthlyPayment,
      stressedRate: greenCalc.stressedRate,
      qualifiedLoan: greenCalc.qualifiedLoan,
      maxPurchasingPower: greenCalc.maxPurchasingPower,
      totalDeposit: greenCalc.totalDeposit,
      termLabel: `${applicant.termYears} yrs • ${lender.greenRate.toFixed(2)}% Fixed`,
      metaLine: isGreenEligible
        ? `BER ${applicant.propertyBER} saves ${formatEuro(Math.max(12, stdCalc.actualMonthlyPayment - greenCalc.actualMonthlyPayment))}/mo`
        : `Solar/insulation retrofit unlocks ${lender.greenRate.toFixed(2)}% rate`,
      calc: greenCalc
    },
    CLIVE_OVERPAY: {
      id: 'CLIVE_OVERPAY',
      title: 'Clive Accelerated Overpay',
      badgeText: `-${cliveCalc.yearsSavedByClive} Yrs Term`,
      isRecommended: false,
      rate: cliveCalc.appliedRate,
      monthlyPayment: cliveCalc.actualMonthlyPayment + cliveCalc.monthlyOverpay,
      basePayment: cliveCalc.actualMonthlyPayment,
      overpayAmount: cliveCalc.monthlyOverpay,
      stressedPayment: cliveCalc.stressedMonthlyPayment,
      stressedRate: cliveCalc.stressedRate,
      qualifiedLoan: cliveCalc.qualifiedLoan,
      maxPurchasingPower: cliveCalc.maxPurchasingPower,
      totalDeposit: cliveCalc.totalDeposit,
      termLabel: `Payoff in ${cliveCalc.clivePayoffYear} yrs (+${formatEuro(cliveCalc.monthlyOverpay)}/mo)`,
      metaLine: `Yr 10 LTV drops to ${cliveCalc.year10CliveLtvPct}% • Saves ${formatCompactEuro(cliveCalc.interestSavedByClive)}`,
      calc: cliveCalc
    }
  };
}

function formatEuro(num) {
  return '€' + Number(num || 0).toLocaleString('en-IE');
}

function formatCompactEuro(num) {
  if (num >= 1000000) {
    return '€' + (num / 1000000).toFixed(num >= 10000000 ? 1 : 2) + 'M';
  }
  if (num >= 1000) {
    return '€' + Math.round(num / 1000) + 'k';
  }
  return '€' + Math.round(num || 0);
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
