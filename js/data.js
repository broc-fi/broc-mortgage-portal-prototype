/* ==========================================================================
   Broc. For Lenders — Static Underwriting Dataset & Modular Rules Catalog
   Zero-build static module preserving CURATED_7 + MONTHLY_517 PRNG (seed 421337)
   ========================================================================== */

const LENDERS = {
  BOI: {
    id: 'BOI',
    code: 'BOI',
    name: 'Bank of Ireland (BOI)',
    shortName: 'Bank of Ireland',
    portalName: 'Bank of Ireland — Mortgage Readiness & Underwriting Hub',
    color: '#002663',
    greenRate: 3.65,
    stdRate: 4.10,
    stressBuffer: 2.0,
    aipValidity: '6 Months',
    maxVariableBonusPct: 0.60,
    livingCostSingle: 1450,
    livingCostCouple: 2350,
    livingCostPerChild: 300
  },
  WHITELABEL: {
    id: 'WHITELABEL',
    code: 'BROC',
    name: 'Broc. White-Label',
    shortName: 'Broc Partner Lender',
    portalName: 'Broc. White-Label Mortgage Underwriting Portal',
    color: '#059669',
    greenRate: 3.55,
    stdRate: 3.95,
    stressBuffer: 2.0,
    aipValidity: '6–12 Months',
    maxVariableBonusPct: 0.50,
    livingCostSingle: 1420,
    livingCostCouple: 2300,
    livingCostPerChild: 300
  }
};

const CURATED_7_APPLICANTS = [
  {
    id: 'BROC-IE-9001',
    names: "Ciara & Ronan O'Sullivan",
    county: 'Dublin 14 (Dundrum)',
    citizenship: 'Irish Citizens (Both Passports Verified)',
    kycBadge: 'eKYC Passport + PPSN Verified',
    buyerType: 'FTB',
    applicantsCount: 2,
    dependents: 0,
    targetStage: 'FULL',
    statusBadge: 'Full Loan Offer Ready',
    dataSource: 'Yapily Open Banking (BOI + Revolut)',
    baseIncome: 112000,
    bonusIncome: 12000,
    netMonthlyIncome: 6850,
    verifiedRentPm: 2150,
    verifiedSavingsPm: 1150,
    cliveMonthlySavingsUnlocked: 245,
    existingDebtPm: 0,
    depositSaved: 55000,
    helpToBuyGrant: 30000,
    giftAmount: 0,
    targetPropertyAddress: '18 Meadowbrook Park, Dundrum, Dublin 14 (Sale Agreed @ €540,000)',
    propertyBER: 'A2',
    termYears: 30,
    brocScoreBefore: 81,
    brocScore: 97,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 29, max: 30, note: '€3,300/mo proven vs €2,668 stressed payment (124% coverage)' },
      { name: '6-Month Account Conduct & Hygiene', earned: 25, max: 25, note: '0 unpaid DDs, 0 overdrafts, 0% gambling, €0 BNPL across 1,420 txns' },
      { name: 'Income Stability & Revenue EDS Match', earned: 19, max: 20, note: 'Both permanent PAYE (4+ yrs tenure), probation passed, EDS matched' },
      { name: 'Deposit AML Source & Clean CCR', earned: 14, max: 15, note: '€55k BOI GoalSaver + €30k Revenue HTB code; 0 CCR arrears' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 10, max: 10, note: 'Irish Passports, PPSNs, Utility Address & all 18 docs verified' }
    ],
    cliveStory: 'Over 90 days on app.broc.fi, Clive cancelled €110/mo in duplicate subscriptions and tendered electricity + broadband to save €135/mo, lifting their Broc Score from 81 → 97 and unlocking +€43k in stress-tested borrowing capacity.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: '2x Irish Passports verified via biometric liveness check.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish Citizens by birth; permanent Irish tax residents.' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'Bord Gáis Energy bill & BOI statement matched to Ranelagh rental.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'Both PPS Numbers matched to Revenue Commissioners EDS.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'CCR report pulled: 0 active loans, 0 historical arrears, clean ISI/Stubbs.' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Permanent full-time roles (Pfizer & Stripe); probation passed >3 yrs ago.' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€112k combined base + €12k bonus verified against bank salary credits.' },
      { cat: 'Open Banking', name: '8. 6-Month Bank, Savings & Revolut Statements', met: true, detail: '6 consecutive months (BOI Current, BOI Saver, Revolut Joint) via Yapily.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid DDs, 0 referral fees, 0 overdrafts, 0.0% betting, 0 Klarna.' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€85k deposit (€55k savings + €30k HTB) + €3,300/mo proven repayment.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificates', met: true, detail: 'BOI Salary Certs signed & stamped by Pfizer & Stripe HR.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: true, detail: 'Live Yapily sync confirms October savings & zero new credit taken.' },
      { cat: 'Sale Agreed', name: '13. Sales Advice Note & Booking Deposit Receipt', met: true, detail: 'Sherry FitzGerald Sales Advice (€540k) + €15k booking deposit receipt.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: true, detail: 'Panel valuer inspected 18 Meadowbrook Park — valued at €545,000.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: true, detail: 'BER A2 (#109482910) verified — qualifies for 3.65% EcoSaver Green rate.' },
      { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: true, detail: 'Chartered Engineer survey & Architect Opinion of Compliance clear.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: true, detail: 'ByrneWallace LLP (Approved Panel) undertaking & title check complete.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: true, detail: 'Royal London Life Cover (€42/mo) & Allianz Home Cover bound via Broc Tender.' }
    ]
  },
  {
    id: 'BROC-IE-9002',
    names: 'Cian Murphy & Priya Sharma',
    county: 'Cork City (Blackrock)',
    citizenship: 'Irish Citizen + Stamp 4 Residency',
    kycBadge: 'Passport + Stamp 4 IRP Verified',
    buyerType: 'FTB',
    applicantsCount: 2,
    dependents: 0,
    targetStage: 'AIP',
    statusBadge: 'Instant AIP Qualified',
    dataSource: 'Yapily Open Banking (AIB + N26 + BOI)',
    baseIncome: 104000,
    bonusIncome: 8000,
    netMonthlyIncome: 6180,
    verifiedRentPm: 1750,
    verifiedSavingsPm: 1050,
    cliveMonthlySavingsUnlocked: 210,
    existingDebtPm: 0,
    depositSaved: 52000,
    helpToBuyGrant: 0,
    giftAmount: 15000,
    targetPropertyAddress: 'Stage A: House Hunting — Cork South / Blackrock (Pre-Approval)',
    propertyBER: 'B2',
    termYears: 32,
    brocScoreBefore: 79,
    brocScore: 94,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 28, max: 30, note: '€2,800/mo proven (Rent €1,750 + Savings €1,050) vs €2,290 stressed' },
      { name: '6-Month Account Conduct & Hygiene', earned: 24, max: 25, note: '0 unpaid items, 0 overdrafts; Revolut Pay Later cleared 5 mos ago' },
      { name: 'Income Stability & Revenue EDS Match', earned: 19, max: 20, note: 'Apple Cork & Eli Lilly permanent roles; EDS & payslips matched' },
      { name: 'Deposit AML Source & Clean CCR', earned: 14, max: 15, note: '€52k savings + €15k AML-cleared parental Gift Letter; clean CCR' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 9, max: 10, note: 'Irish Passport + Stamp 4 IRP Card (4 yrs in IE) + PPSNs verified' }
    ],
    cliveStory: 'Clive cleared a recurring Revolut Pay Later balance 5 months ago, cut €210/mo in telecom/insurance bills, and pre-verified Priya’s Stamp 4 IRP card + Critical Skills history.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport (Cian) + Indian Passport & GNIB/IRP Card (Priya) verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Cian: Irish Citizen. Priya: Stamp 4 Residency held >3 yrs (meets BOI policy).' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'Electric Ireland bill & RTB tenancy registration at Blackrock Rd, Cork.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'Both PPSNs verified via Revenue Employment Detail Summary.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'Clean CCR report for both applicants; zero active credit facilities.' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Apple Cork (3 yrs) & Eli Lilly Kinsale (2.5 yrs); permanent, probation passed.' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€104k combined base + €8k bonus verified via payroll & Revenue EDS.' },
      { cat: 'Open Banking', name: '8. 6-Month Bank, Savings & Neobank Statements', met: true, detail: '890 transactions audited across AIB, BOI Saver & N26 via Yapily.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid DDs, 0 overdrafts, 0.0% gambling, €0 BNPL over last 5 mos.' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€67k deposit (€52k savings + €15k signed Gift Letter & donor AML proof).' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificates', met: true, detail: 'Digitally pre-verified via Apple & Eli Lilly HR.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: true, detail: 'Live Yapily feed active.' },
      { cat: 'Sale Agreed', name: '13. Sales Advice Note & Booking Deposit Receipt', met: false, detail: 'Stage A Applicant — currently bidding on properties in Cork.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: false, detail: 'Awaiting Sale Agreed property.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: false, detail: 'Targeting BER B2+ property.' },
      { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: false, detail: 'Awaiting Sale Agreed property.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: true, detail: 'JW O’Donovan LLP (Cork) nominated and ready.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: false, detail: 'Broc Tender pre-quoted Life Cover at €29/mo; binds at Stage B.' }
    ]
  },
  {
    id: 'BROC-IE-9003',
    names: 'Aoife Kelly & Liam Doyle',
    county: 'Galway (Knocknacarra)',
    citizenship: 'Irish & UK Citizens (CTA Verified)',
    kycBadge: 'Passports + CTA Residency Verified',
    buyerType: 'SSB',
    applicantsCount: 2,
    dependents: 2,
    targetStage: 'FULL',
    statusBadge: 'Full Loan Offer Ready',
    dataSource: 'Yapily + CSV Upload (BOI + Credit Union)',
    baseIncome: 138000,
    bonusIncome: 16000,
    netMonthlyIncome: 7920,
    verifiedRentPm: 1650,
    verifiedSavingsPm: 1400,
    cliveMonthlySavingsUnlocked: 310,
    existingDebtPm: 220,
    depositSaved: 145000,
    helpToBuyGrant: 0,
    giftAmount: 0,
    targetPropertyAddress: '42 Seacrest Road, Knocknacarra, Co. Galway (Sale Agreed @ €620,000)',
    propertyBER: 'B1',
    termYears: 25,
    brocScoreBefore: 78,
    brocScore: 91,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 27, max: 30, note: '€2,830/mo net capacity after €220 car loan & 2 child buffers' },
      { name: '6-Month Account Conduct & Hygiene', earned: 24, max: 25, note: 'Clean conduct across BOI & St. Anthony’s Credit Union CSVs' },
      { name: 'Income Stability & Revenue EDS Match', earned: 19, max: 20, note: 'Medtronic & University of Galway permanent roles (7+ yrs)' },
      { name: 'Deposit AML Source & Clean CCR', earned: 11, max: 15, note: '€145k net equity deposit (23% deposit); 1 small CCR car loan (€220/mo)' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 10, max: 10, note: 'Irish & UK Passports (Common Travel Area), PPSNs & all 18 docs met' }
    ],
    cliveStory: 'Clive restructured family health insurance, broadband, and energy bills via Broc Tenders, saving €310/mo to comfortably clear the NDI living-cost buffer for 2 dependent children.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport (Aoife) & UK Passport (Liam) verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish Citizen + UK Citizen under Common Travel Area (CTA); 9 yrs in Galway.' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'Local Property Tax (LPT) receipt & Electric Ireland bill verified.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'Both PPSNs verified on Revenue EDS & current mortgage deed.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'CCR shows existing mortgage (redeeming on sale) + €220/mo car loan (0 arrears).' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Permanent roles at Medtronic & University of Galway.' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€138k base + €16k bonus verified.' },
      { cat: 'Open Banking', name: '8. 6-Month Bank & Credit Union Statements', met: true, detail: 'BOI Open Banking + St. Anthony’s Credit Union CSV batch verified.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid items, 0 overdrafts, 0.1% lottery spend.' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€145k verified net equity from contracted sale of current home.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificates', met: true, detail: 'Signed & stamped Employer Salary Certs uploaded.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: true, detail: 'Up-to-date through current month.' },
      { cat: 'Sale Agreed', name: '13. Sales Advice Note & Back-to-Back Sale Contract', met: true, detail: 'Unconditional contracts signed on existing property sale + purchase.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: true, detail: 'Valued at €620,000 by O’Donnellan & Joyce panel valuer.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: true, detail: 'BER B1 confirmed — qualifies for Green Mortgage discount.' },
      { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: true, detail: 'Full structural survey & planning search completed.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: true, detail: 'MacSweeney & Co. Solicitors undertaking received.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: true, detail: 'Dual-life cover & buildings insurance bound via Broc.' }
    ]
  },
  {
    id: 'BROC-IE-9004',
    names: 'Siobhán Ní Bhriain',
    county: 'Kildare (Naas)',
    citizenship: 'Irish Citizen (Self-Employed Director)',
    kycBadge: 'Passport + ROS Tax Clearance Verified',
    buyerType: 'FTB',
    applicantsCount: 1,
    dependents: 0,
    targetStage: 'AIP',
    statusBadge: 'AIP Ready (Self-Employed)',
    dataSource: 'Yapily Open Banking (BOI Business + Personal)',
    baseIncome: 92000,
    bonusIncome: 0,
    netMonthlyIncome: 5150,
    verifiedRentPm: 1500,
    verifiedSavingsPm: 1100,
    cliveMonthlySavingsUnlocked: 195,
    existingDebtPm: 0,
    depositSaved: 62000,
    helpToBuyGrant: 24000,
    giftAmount: 0,
    targetPropertyAddress: 'New Build — Finlay Park, Naas, Co. Kildare',
    propertyBER: 'A1',
    termYears: 30,
    brocScoreBefore: 76,
    brocScore: 89,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 28, max: 30, note: '€2,600/mo proven (Rent €1,500 + Savings €1,100) vs €1,990 stressed' },
      { name: '6-Month Account Conduct & Hygiene', earned: 24, max: 25, note: '12 mos Business + Personal accounts clean; 0 unpaid items' },
      { name: 'Income Stability & Revenue EDS Match', earned: 17, max: 20, note: 'Self-Employed (3 yrs): 2 yrs Audited Accounts + Form 11 + Tax Clearance' },
      { name: 'Deposit AML Source & Clean CCR', earned: 11, max: 15, note: '€62k savings + €24k HTB approved; clean personal & company CCR' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 9, max: 10, note: 'Irish Passport, CRO Company Printout, PPSN & Address verified' }
    ],
    cliveStory: 'Clara automatically separated business vs personal cashflows across 12 months of BOI feeds and packaged 2 years of certified accounts, Form 11s, and ROS Tax Clearance.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport & CRO Director ID verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish Citizen & domicile.' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'Sky Broadband bill & BOI Personal statement verified.' },
      { cat: 'Tax ID', name: '4. PPSN & Revenue Tax Clearance Certificate', met: true, detail: 'PPSN + live eTax Clearance Certificate verified via ROS.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'Clean personal & SME CCR check; zero Revenue sheriff judgments.' },
      { cat: 'Employment', name: '6. Self-Employed Trading History (≥2–3 Yrs)', met: true, detail: '3.5 years trading as IT Consultancy Ltd (CRO #684920).' },
      { cat: 'Income & Tax', name: '7. 2–3 Yrs Certified Accounts & Form 11 / Notice of Assessment', met: true, detail: '2024 & 2025 Chartered Accountant certified accounts + Form 11s (€92k avg).' },
      { cat: 'Open Banking', name: '8. 12-Month Business & Personal Bank Statements', met: true, detail: '12 mos BOI Business + Personal current/savings audited by Clara.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid items, 0 overdrafts, 0 VAT/PREM arrears.' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€86k deposit (€62k savings + €24k HTB) + €2,600/mo proven capacity.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Accountant Letter Confirming Current Trading', met: true, detail: 'Signed Chartered Accountant confirmation of 2026 profit stability.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: true, detail: 'Live BOI Open Banking connection active.' },
      { cat: 'Sale Agreed', name: '13. New Build Booking Deposit & Contracts', met: true, detail: '€10,000 booking deposit receipt for Finlay Park New Build.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: false, detail: 'Scheduled upon developer completion notice.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: true, detail: 'Provisional BER A1 certificate provided by developer.' },
      { cat: 'Survey & Planning', name: '16. HomeBond Structural Warranty & Certified Costings', met: false, detail: 'Awaiting final architect stage certificate from builder.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: true, detail: 'Coonan Cawley Solicitors (Naas) reviewing developer contract.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: false, detail: 'Broc Tender quotes ready to bind at drawdown.' }
    ]
  },
  {
    id: 'BROC-IE-9005',
    names: 'Declan & Maeve Gallagher',
    county: 'Wicklow (Greystones)',
    citizenship: 'Irish & EU (German) Citizens',
    kycBadge: 'Irish + EU Passports Verified',
    buyerType: 'SWITCHER',
    applicantsCount: 2,
    dependents: 1,
    targetStage: 'FULL',
    statusBadge: 'Fast-Track Switcher',
    dataSource: 'Yapily Open Banking (AIB + PTSB)',
    baseIncome: 124000,
    bonusIncome: 6000,
    netMonthlyIncome: 7100,
    verifiedRentPm: 2280,
    verifiedSavingsPm: 650,
    cliveMonthlySavingsUnlocked: 410,
    existingDebtPm: 0,
    depositSaved: 230000,
    helpToBuyGrant: 0,
    giftAmount: 0,
    targetPropertyAddress: '9 Sea Road, Greystones, Co. Wicklow (Switching €320k Balance, LTV 58%)',
    propertyBER: 'B2',
    termYears: 22,
    brocScoreBefore: 86,
    brocScore: 96,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 29, max: 30, note: 'Already paying €2,280/mo mortgage + €650/mo savings (€2,930/mo proven)' },
      { name: '6-Month Account Conduct & Hygiene', earned: 25, max: 25, note: '24 consecutive on-time mortgage payments; 0 overdrafts or missed DDs' },
      { name: 'Income Stability & Revenue EDS Match', earned: 20, max: 20, note: 'Both permanent civil service / tech roles; EDS verified' },
      { name: 'Deposit AML Source & Clean CCR', earned: 12, max: 15, note: '58.2% LTV (€230k equity); spotless CCR redemption record' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 10, max: 10, note: 'Irish & German EU Passports, PPSNs & full switcher pack complete' }
    ],
    cliveStory: 'Clive detected their 3-year fixed rate expired onto a 4.95% variable rate and auto-packaged a complete 18-point Switcher file saving €340/mo.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport (Declan) + German EU Passport (Maeve) verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish & EU Citizen (unrestricted EU right to reside).' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'SSE Airtricity bill & Annual Mortgage Statement for 9 Sea Road.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'Both PPSNs verified via Revenue EDS.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'CCR confirms 100% on-time repayment history on existing mortgage.' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Permanent roles (8+ yrs tenure).' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€124k base + €6k bonus verified.' },
      { cat: 'Open Banking', name: '8. 12-Month Current & Mortgage Account Statements', met: true, detail: 'Full 12-month mortgage redemption statement & current account via Yapily.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid DDs, 0 overdrafts, 0% gambling.' },
      { cat: 'Affordability', name: '10. LTV Equity Check & +2% Stress Capacity', met: true, detail: '58.2% LTV (€230k equity) + €2,930/mo proven capacity.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificates', met: true, detail: 'Completed & verified for both applicants.' },
      { cat: 'Statement Refresh', name: '12. Redemption Statement & Latest Payslips', met: true, detail: 'Up-to-date redemption figure verified.' },
      { cat: 'Sale Agreed', name: '13. Switcher Redemption Request (N/A Purchase)', met: true, detail: 'Like-for-like balance switch (€320,000).' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: true, detail: 'Panel valuation confirmed at €550,000.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: true, detail: 'BER B2 verified on SEAI national register.' },
      { cat: 'Survey & Planning', name: '16. Title & Planning Compliance', met: true, detail: 'Clean family home title.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Title Deeds Requisition', met: true, detail: 'Panel switcher solicitor undertaking signed.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection Assignment & SEPA DD', met: true, detail: 'Existing Irish Life policy assigned + SEPA DD signed.' }
    ]
  },
  {
    id: 'BROC-IE-9006',
    names: "Tadhg O'Connor",
    county: 'Limerick (Castletroy)',
    citizenship: 'Irish Citizen',
    kycBadge: 'Driving Licence + Passport Verified',
    buyerType: 'FTB',
    applicantsCount: 1,
    dependents: 0,
    targetStage: 'AIP',
    statusBadge: 'Instant AIP Qualified',
    dataSource: 'CSV Batch Upload (PTSB + Revolut)',
    baseIncome: 68000,
    bonusIncome: 4000,
    netMonthlyIncome: 3990,
    verifiedRentPm: 1100,
    verifiedSavingsPm: 750,
    cliveMonthlySavingsUnlocked: 140,
    existingDebtPm: 0,
    depositSaved: 36000,
    helpToBuyGrant: 0,
    giftAmount: 0,
    targetPropertyAddress: 'Stage A: House Hunting — Castletroy / Annacotty, Co. Limerick',
    propertyBER: 'B3',
    termYears: 35,
    brocScoreBefore: 74,
    brocScore: 86,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 26, max: 30, note: '€1,850/mo proven (Rent €1,100 + Savings €750) vs €1,515 stressed' },
      { name: '6-Month Account Conduct & Hygiene', earned: 22, max: 25, note: '0 unpaid DDs, 0 overdrafts, €15/mo National Lottery (0.3% net)' },
      { name: 'Income Stability & Revenue EDS Match', earned: 18, max: 20, note: 'Regeneron Limerick permanent PAYE (2 yrs); EDS matched' },
      { name: 'Deposit AML Source & Clean CCR', earned: 11, max: 15, note: '€36k organic savings (11.4% deposit); clean CCR' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 9, max: 10, note: 'Irish Passport, PPSN & Proof of Address verified; Stage A complete' }
    ],
    cliveStory: 'Tadhg uploaded 6 months of PTSB & Revolut CSVs; Clara verified running balances in 4 seconds and Clive trimmed €140/mo in broadband & streaming bills, raising his Broc Score from 74 → 86.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport & Irish Driving Licence verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish Citizen.' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'Virgin Media bill & PTSB statement matched.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'PPSN matched to Revenue EDS.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'Clean CCR report; 0 loans or credit cards.' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Regeneron Ireland permanent bioprocess associate (2 yrs).' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€68k base + €4k shift/bonus verified.' },
      { cat: 'Open Banking', name: '8. 6-Month Bank & Revolut Statements (CSV Verified)', met: true, detail: '6-month PTSB + Revolut CSV batch cryptographic balance check passed.' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: true, detail: '0 unpaid DDs, 0 overdrafts, €15/mo lottery (well inside <1.5% threshold).' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€36k savings accumulated over 36 mos + €1,850/mo proven capacity.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificate', met: false, detail: 'Sent to Regeneron HR for signature.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: true, detail: 'Current to this month.' },
      { cat: 'Sale Agreed', name: '13. Sales Advice Note & Booking Deposit Receipt', met: false, detail: 'Stage A Applicant — house hunting.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: false, detail: 'Pending Stage B.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: false, detail: 'Pending Stage B.' },
      { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: false, detail: 'Pending Stage B.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: false, detail: 'Pending Stage B.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: false, detail: 'Pending Stage B.' }
    ]
  },
  {
    id: 'BROC-IE-9007',
    names: 'Niamh Fitzpatrick',
    county: 'Dublin 8 (Portobello)',
    citizenship: 'Irish Citizen',
    kycBadge: 'KYC Verified • Conduct Remediating',
    buyerType: 'FTB',
    applicantsCount: 1,
    dependents: 0,
    targetStage: 'NURTURE',
    statusBadge: 'Clive Remediating (45 Days to AIP)',
    dataSource: 'Yapily Open Banking (BOI + Revolut)',
    baseIncome: 84000,
    bonusIncome: 6000,
    netMonthlyIncome: 4720,
    verifiedRentPm: 1450,
    verifiedSavingsPm: 450,
    cliveMonthlySavingsUnlocked: 290,
    existingDebtPm: 185,
    depositSaved: 44000,
    helpToBuyGrant: 0,
    giftAmount: 0,
    targetPropertyAddress: 'Held in app.broc.fi until Broc Score hits ≥85 (Est. 18 Dec)',
    propertyBER: 'B3',
    termYears: 30,
    brocScoreBefore: 54,
    brocScore: 68,
    scorePillars: [
      { name: 'Repayment Capacity & +2% Stress Margin', earned: 21, max: 30, note: '€1,900/mo current; rises to €2,190/mo with Clive €290/mo bill cuts' },
      { name: '6-Month Account Conduct & Hygiene', earned: 13, max: 25, note: 'Flagged: 3 Klarna split-pays 4 mos ago + 1 dipped savings month' },
      { name: 'Income Stability & Revenue EDS Match', earned: 18, max: 20, note: 'Stripe Dublin permanent PAYE; 3 payslips & Revenue EDS verified' },
      { name: 'Deposit AML Source & Clean CCR', earned: 9, max: 15, note: '€44k verified in BOI GoalSaver; €185/mo PCP finishing in 60 days' },
      { name: 'KYC ID, Citizenship & Pack Completeness', earned: 7, max: 10, note: 'Irish Passport, PPSN & Address verified; awaiting Month 6 clean statement' }
    ],
    cliveStory: 'Instead of letting Niamh apply to BOI today and get rejected for Klarna usage and inconsistent savings, Broc held her application in Remediation Mode: Clive cleared the Klarna habit, cut €290/mo in bills, and set an automated €740/mo standing order. Her Broc Score has already climbed from 54 → 68 and will hit 88 on 18 December.',
    aipCriteria: [
      { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: 'Irish Passport verified.' },
      { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: 'Irish Citizen.' },
      { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: 'BOI statement & Electric Ireland bill verified.' },
      { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'PPSN matched to Revenue EDS.' },
      { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: '€185/mo VW Bank PCP closing in 2 payments; 0 arrears.' },
      { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: 'Stripe Dublin permanent role; probation passed.' },
      { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: '€84k base + €6k bonus verified.' },
      { cat: 'Open Banking', name: '8. 6-Month Bank & Revolut Statements', met: false, detail: '5 of 6 clean months completed (Month 6 completes 18 Dec).' },
      { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: false, detail: 'Klarna installments detected 4 mos ago — Clive auto-blocked & cleared.' },
      { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: '€44k deposit verified; Clive standing order building 6-mo streak.' }
    ],
    fullCriteria: [
      { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificate', met: false, detail: 'Unlocks after Stage A AIP pass.' },
      { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: false, detail: 'Unlocks after Stage A.' },
      { cat: 'Sale Agreed', name: '13. Sales Advice Note & Booking Deposit Receipt', met: false, detail: 'Unlocks at Stage B.' },
      { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: false, detail: 'Unlocks at Stage B.' },
      { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: false, detail: 'Unlocks at Stage B.' },
      { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: false, detail: 'Unlocks at Stage B.' },
      { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: false, detail: 'Unlocks at Stage B.' },
      { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: false, detail: 'Unlocks at Stage B.' }
    ]
  }
];

function buildMonthly517Applicants() {
  const firstNames = [
    'Conor', 'Aoife', 'Seán', 'Ciara', 'Oisín', 'Niamh', 'Cillian', 'Saoirse', 'Fionn', 'Róisín',
    'Darragh', 'Caoimhe', 'Cathal', 'Aisling', 'Eoin', 'Orla', 'Padraig', 'Clodagh', 'Ronan', 'Maeve',
    'Shane', 'Sinead', 'Colm', 'Deirdre', 'Brian', 'Eimear', 'Cormac', 'Fiona', 'Diarmuid', 'Gráinne',
    'Liam', 'Emma', 'Jack', 'Grace', 'Daniel', 'Sophie', 'Luke', 'Hannah', 'Adam', 'Rachel'
  ];
  const surnames = [
    'Murphy', 'Kelly', "O'Sullivan", 'Walsh', 'Smith', "O'Brien", 'Byrne', 'Ryan', "O'Connor", "O'Neill",
    "O'Reilly", 'Doyle', 'McCarthy', 'Gallagher', "O'Doherty", 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore',
    'McLaughlin', "O'Carroll", 'Connolly', 'Daly', "O'Connell", 'Wilson', 'Dunne', 'Brennan', 'Burke', 'Collins',
    'Campbell', 'Clarke', 'Johnston', 'Hughes', "O'Farrell", 'Fitzgerald', 'Brown', 'Martin', 'Maguire', 'Nolan'
  ];
  const locations = [
    { county: 'Dublin 6 (Ranelagh)', street: 'Beechwood Ave, Ranelagh, Dublin 6' },
    { county: 'Dublin 15 (Castleknock)', street: 'Collegewood, Castleknock, Dublin 15' },
    { county: 'Co. Dublin (Swords)', street: 'Millers Glen, Swords, Co. Dublin' },
    { county: 'Cork (Douglas)', street: 'Maryborough Ridge, Douglas, Cork' },
    { county: 'Cork (Ballincollig)', street: 'Steeplewoods, Ballincollig, Co. Cork' },
    { county: 'Galway (Oranmore)', street: 'Costa Na Mara, Oranmore, Co. Galway' },
    { county: 'Limerick (Raheen)', street: 'Kylemore, Raheen, Co. Limerick' },
    { county: 'Kildare (Maynooth)', street: 'Mariavilla, Maynooth, Co. Kildare' },
    { county: 'Wicklow (Bray)', street: 'Belmont, Southern Cross, Bray, Co. Wicklow' },
    { county: 'Meath (Dunshaughlin)', street: 'Fairfields, Dunshaughlin, Co. Meath' },
    { county: 'Waterford (Dunmore Rd)', street: 'Ardkeen Woods, Waterford' },
    { county: 'Louth (Drogheda)', street: 'Ballymakenny Park, Drogheda, Co. Louth' },
    { county: 'Kilkenny City', street: 'Archersfield, Kilkenny' },
    { county: 'Wexford (Gorey)', street: 'Clonattin Village, Gorey, Co. Wexford' },
    { county: 'Clare (Ennis)', street: 'Roslevan, Ennis, Co. Clare' }
  ];
  const citizenships = [
    { label: 'Irish Citizens (Passports Verified)', badge: 'eKYC Passport + PPSN Verified' },
    { label: 'Irish Citizen', badge: 'Passport + Driving Licence Verified' },
    { label: 'Irish & EU Citizens', badge: 'Irish + EU Passports Verified' },
    { label: 'Irish Citizen + Stamp 4 IRP', badge: 'Passport + Stamp 4 IRP Verified' },
    { label: 'Irish & UK Citizens (CTA)', badge: 'Passports + CTA Residency Verified' },
    { label: 'EU Citizen (5+ Yrs IE Residency)', badge: 'EU Passport + PPSN Verified' }
  ];
  const dataSources = [
    'Yapily Open Banking (BOI + Revolut)',
    'Yapily Open Banking (AIB + Revolut)',
    'Yapily Open Banking (PTSB + N26)',
    'CSV Batch Upload (BOI + Credit Union)',
    'Yapily Open Banking (BOI Current + GoalSaver)',
    'CSV Batch Upload (AIB + Revolut)'
  ];
  const employers = [
    'Pfizer Grange Castle', 'Stripe Dublin', 'Apple Cork', 'Medtronic Galway', 'HSE National',
    'Dept. of Education', 'Intel Leixlip', 'Eli Lilly Kinsale', 'Google Ireland', 'Regeneron Limerick',
    'Kerry Group', 'ESB Engineering', 'Deloitte Ireland', 'Arthur Cox LLP', 'Boston Scientific'
  ];
  const bers = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1'];

  const all = [...CURATED_7_APPLICANTS];
  let seed = 421337;
  function rand() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  for (let i = 8; i <= 517; i++) {
    const isCouple = rand() > 0.36;
    const fn1 = firstNames[i % firstNames.length];
    const fn2 = firstNames[(i * 7 + 3) % firstNames.length];
    const sn = surnames[(i * 3 + 5) % surnames.length];
    const names = isCouple ? `${fn1} & ${fn2} ${sn}` : `${fn1} ${sn}`;

    const loc = locations[i % locations.length];
    const cit = citizenships[i % citizenships.length];
    const source = dataSources[i % dataSources.length];
    const emp = employers[i % employers.length];
    const ber = bers[i % bers.length];

    const rBuyer = rand();
    const buyerType = rBuyer < 0.62 ? 'FTB' : rBuyer < 0.86 ? 'SSB' : 'SWITCHER';

    const rStage = rand();
    const targetStage = rStage < 0.48 ? 'AIP' : rStage < 0.82 ? 'FULL' : 'NURTURE';

    const baseIncome = isCouple
      ? Math.round((86000 + rand() * 78000) / 1000) * 1000
      : Math.round((58000 + rand() * 52000) / 1000) * 1000;
    const bonusIncome = rand() > 0.45 ? Math.round((4000 + rand() * 14000) / 1000) * 1000 : 0;
    const netMonthlyIncome = Math.round((baseIncome * 0.69) / 12);

    const verifiedRentPm = Math.round((1150 + rand() * 1150) / 50) * 50;
    const verifiedSavingsPm = Math.round((500 + rand() * 1050) / 50) * 50;
    const cliveMonthlySavingsUnlocked = Math.round((115 + rand() * 260) / 5) * 5;
    const existingDebtPm = targetStage === 'NURTURE' ? 175 : (rand() > 0.8 ? 190 : 0);

    const depositSaved = buyerType === 'FTB'
      ? Math.round((34000 + rand() * 48000) / 1000) * 1000
      : Math.round((95000 + rand() * 130000) / 1000) * 1000;
    const helpToBuyGrant = (buyerType === 'FTB' && ber.startsWith('A') && rand() > 0.4) ? 25000 : 0;
    const giftAmount = (buyerType === 'FTB' && helpToBuyGrant === 0 && rand() > 0.7) ? 15000 : 0;

    const p1 = targetStage === 'NURTURE' ? 20 + Math.floor(rand() * 4) : 26 + Math.floor(rand() * 5);
    const p2 = targetStage === 'NURTURE' ? 12 + Math.floor(rand() * 5) : 22 + Math.floor(rand() * 4);
    const p3 = 17 + Math.floor(rand() * 4);
    const p4 = targetStage === 'NURTURE' ? 9 + Math.floor(rand() * 3) : 12 + Math.floor(rand() * 4);
    const p5 = targetStage === 'NURTURE' ? 7 + Math.floor(rand() * 2) : 9 + Math.floor(rand() * 2);
    const brocScore = Math.min(99, p1 + p2 + p3 + p4 + p5);
    const brocScoreBefore = Math.max(48, brocScore - (9 + Math.floor(rand() * 12)));

    const statusBadge = targetStage === 'FULL'
      ? (buyerType === 'SWITCHER' ? 'Fast-Track Switcher' : 'Full Loan Offer Ready')
      : targetStage === 'AIP'
      ? 'Instant AIP Qualified'
      : 'Clive Remediating (In App)';

    const isNurture = targetStage === 'NURTURE';
    const isFull = targetStage === 'FULL';

    all.push({
      id: `BROC-IE-${9000 + i}`,
      names,
      county: loc.county,
      citizenship: cit.label,
      kycBadge: cit.badge,
      buyerType,
      applicantsCount: isCouple ? 2 : 1,
      dependents: isCouple && rand() > 0.6 ? 1 : 0,
      targetStage,
      statusBadge,
      dataSource: source,
      baseIncome,
      bonusIncome,
      netMonthlyIncome,
      verifiedRentPm,
      verifiedSavingsPm,
      cliveMonthlySavingsUnlocked,
      existingDebtPm,
      depositSaved,
      helpToBuyGrant,
      giftAmount,
      targetPropertyAddress: isFull
        ? `${(i % 64) + 1} ${loc.street} (Sale Agreed)`
        : isNurture
        ? `Pre-Application Coaching in app.broc.fi (${loc.county})`
        : `Stage A: House Hunting — ${loc.county}`,
      propertyBER: ber,
      termYears: buyerType === 'FTB' ? 30 : 25,
      brocScoreBefore,
      brocScore,
      scorePillars: [
        { name: 'Repayment Capacity & +2% Stress Margin', earned: p1, max: 30, note: `€${(verifiedRentPm + verifiedSavingsPm).toLocaleString('en-IE')}/mo proven capacity (Rent + Savings)` },
        { name: '6-Month Account Conduct & Hygiene', earned: p2, max: 25, note: isNurture ? 'Clive clearing historical BNPL installments & building 6-mo streak' : '0 unpaid DDs, 0 unarranged overdrafts, gambling <0.5%' },
        { name: 'Income Stability & Revenue EDS Match', earned: p3, max: 20, note: `${emp} permanent PAYE verified via Revenue EDS & 3 mos payslips` },
        { name: 'Deposit AML Source & Clean CCR', earned: p4, max: 15, note: `€${(depositSaved + helpToBuyGrant + giftAmount).toLocaleString('en-IE')} verified deposit + clean CCR check` },
        { name: 'KYC ID, Citizenship & Pack Completeness', earned: p5, max: 10, note: `${cit.label}, PPSN & utility address verified` }
      ],
      cliveStory: `Clara audited 6 months of ${source} feeds for ${names} (${emp}) and Clive unlocked €${cliveMonthlySavingsUnlocked}/mo in recurring bill & subscription savings, lifting their Broc Score from ${brocScoreBefore} → ${brocScore}.`,
      aipCriteria: [
        { cat: 'Identity & KYC', name: '1. Photo ID & Biometric Liveness', met: true, detail: `Biometric Passport / ID verified for ${names}.` },
        { cat: 'Citizenship', name: '2. Citizenship & Right to Reside in Ireland', met: true, detail: `${cit.label} — right to reside verified.` },
        { cat: 'Address AML', name: '3. Proof of Current Address (<3 Mos)', met: true, detail: `Utility bill & bank statement matched in ${loc.county}.` },
        { cat: 'Tax ID', name: '4. PPSN Official Verification', met: true, detail: 'PPSN matched to Revenue Employment Detail Summary (EDS).' },
        { cat: 'Credit Bureau', name: '5. Central Credit Register (CCR) & Judgments', met: true, detail: 'Clean CCR report pulled; zero arrears or judgments.' },
        { cat: 'Employment', name: '6. Employment Contract, Tenure & Probation', met: true, detail: `Permanent role at ${emp}; probation confirmed passed.` },
        { cat: 'Income & Tax', name: '7. 3 Months Payslips & Revenue EDS (P60)', met: true, detail: `€${baseIncome.toLocaleString('en-IE')} base salary matched to payroll credits.` },
        { cat: 'Open Banking', name: '8. 6-Month Bank, Savings & Neobank Statements', met: !isNurture, detail: isNurture ? '5 of 6 clean months completed in app.broc.fi.' : `6 consecutive months verified via ${source}.` },
        { cat: 'Conduct', name: '9. Account Conduct, Gambling & BNPL Screen', met: !isNurture, detail: isNurture ? 'Clive remediating BNPL habit prior to submission.' : '0 unpaid DDs, 0 overdrafts, <0.5% betting, €0 BNPL.' },
        { cat: 'Affordability', name: '10. Deposit Source (AML) & +2% Stress Capacity', met: true, detail: `€${(depositSaved + helpToBuyGrant + giftAmount).toLocaleString('en-IE')} AML-verified deposit + stress test passed.` }
      ],
      fullCriteria: [
        { cat: 'Employer Cert', name: '11. Standardized Lender Salary Certificates', met: isFull, detail: isFull ? `Signed & stamped by ${emp} HR.` : 'Pending Stage B progression.' },
        { cat: 'Statement Refresh', name: '12. Pre-Offer Statement & Payslip Refresh', met: !isNurture, detail: 'Live Open Banking / CSV feed active.' },
        { cat: 'Sale Agreed', name: '13. Sales Advice Note & Booking Deposit Receipt', met: isFull, detail: isFull ? `Sales Advice Note & booking deposit verified (${loc.street}).` : 'Awaiting Sale Agreed property.' },
        { cat: 'Valuation', name: '14. Lender Panel Property Valuation Report', met: isFull, detail: isFull ? 'Approved panel valuation report completed.' : 'Awaiting Sale Agreed property.' },
        { cat: 'Green BER', name: '15. SEAI BER Certificate & Advisory Report', met: isFull, detail: isFull ? `BER ${ber} verified via SEAI register.` : `Targeting BER ${ber}.` },
        { cat: 'Survey & Planning', name: '16. Structural Survey & Planning Compliance', met: isFull, detail: isFull ? 'Engineer survey & planning compliance confirmed.' : 'Pending Stage B.' },
        { cat: 'Conveyancing', name: '17. Solicitor Undertaking & Contracts for Sale', met: isFull, detail: isFull ? 'Approved panel solicitor undertaking signed.' : 'Pending Stage B.' },
        { cat: 'Protection & DD', name: '18. Mortgage Protection, Home Insurance & SEPA DD', met: isFull, detail: isFull ? 'Life cover & buildings insurance bound via Broc Tender.' : 'Pre-quoted via Broc Tender Engine.' }
      ]
    });
  }
  return all;
}

const MONTHLY_517_APPLICANTS = buildMonthly517Applicants();

/* Modular Underwriting Rules Catalog (23 Items: 5 Score Pillars + 10 Stage A + 8 Stage B) */
const UNDERWRITING_RULES = [
  // 5 Broc Score Pillars (Templates — Indigo)
  {
    id: 'RULE-P1',
    code: 'PILLAR-01',
    type: 'template',
    title: 'Stress-Tested Repayment Capacity & NDI Margin',
    category: 'Broc Score Pillar',
    pointsOrStage: 'Max 30 pts',
    summary: 'Verified rent + net savings minus existing debt tested against CBI Rate + 2.0% stress margin.',
    detail: 'Measures proven monthly repayment capacity (Verified Rent + Consistent Savings + Expiring Loans) against proposed mortgage payment stressed at Offered Rate + 2.0%. Full 30 pts requires >=115% stress coverage and passing Net Disposable Income (NDI) after standard Irish household living costs (€1,450 single / €2,350 couple / €300 per child).',
    tags: ['CBI +2% Stress', 'NDI Buffer', 'Repayment'],
    autoVerified: 'Clara Open Banking Engine'
  },
  {
    id: 'RULE-P2',
    code: 'PILLAR-02',
    type: 'template',
    title: '6-Month Account Conduct & Behavioural Hygiene',
    category: 'Broc Score Pillar',
    pointsOrStage: 'Max 25 pts',
    summary: 'Zero unpaid direct debits, unarranged overdrafts, gambling >1.5%, or active Klarna/BNPL.',
    detail: 'Clara scans 100% of current, joint, savings, and neobank (Revolut/N26) statements. Deducts points for unpaid direct debits (-10), unarranged overdrafts (-8), referral fees (-5), regular gambling/betting >1.5% of net pay (-10), or active BNPL/Klarna installments (-6).',
    tags: ['Yapily PSD2', 'BNPL Screen', 'Zero Unpaid DDs'],
    autoVerified: 'Clara Transaction Classifier'
  },
  {
    id: 'RULE-P3',
    code: 'PILLAR-03',
    type: 'template',
    title: 'Income Stability, Contract Tenure & Revenue Match',
    category: 'Broc Score Pillar',
    pointsOrStage: 'Max 20 pts',
    summary: '3 months payslips & Revenue EDS matched to net salary credits; permanent PAYE or 2-3 yr Form 11.',
    detail: 'Cross-checks 3 months payslips and Revenue Employment Detail Summary (EDS) against actual salary bank credits. Confirms permanent employment, probation passed, >=6-12 months tenure, or 2-3 years certified accounts + Form 11 + ROS Tax Clearance for self-employed applicants.',
    tags: ['Revenue EDS', 'PAYE / Form 11', 'Probation'],
    autoVerified: 'ROS & Payroll Cross-Check'
  },
  {
    id: 'RULE-P4',
    code: 'PILLAR-04',
    type: 'template',
    title: 'Deposit Source (AML), LTV & Central Credit Register',
    category: 'Broc Score Pillar',
    pointsOrStage: 'Max 15 pts',
    summary: 'Full AML provenance across organic savings, Revenue HTB, Gift Letters & clean CCR bureau.',
    detail: 'Verifies >=10% deposit (90% LTV max) with complete Anti-Money Laundering provenance: organic monthly savings build-up, Revenue Help-to-Buy access code, or signed Gift Letter with donor statement proof, alongside zero undisclosed loans or arrears on the CCR.',
    tags: ['AML Provenance', 'HTB Access', 'CCR Bureau'],
    autoVerified: 'AML Graph + CCR Check'
  },
  {
    id: 'RULE-P5',
    code: 'PILLAR-05',
    type: 'template',
    title: 'Identity (KYC), Residency & Pack Completeness',
    category: 'Broc Score Pillar',
    pointsOrStage: 'Max 10 pts',
    summary: 'Biometric Passport/Licence KYC, PPSN match & right-to-reside (IE/UK/EU/Stamp 4).',
    detail: 'Biometric Passport/Driving Licence KYC, Proof of Address (<3 mos), verified PPSN document, and right-to-reside eligibility (Irish/UK/EU/EEA Citizen, or Non-EEA Stamp 4 / Critical Skills Employment Permit with required Irish residency history).',
    tags: ['eKYC Biometric', 'Stamp 4 IRP', 'PPSN'],
    autoVerified: 'Identity Liveness Vault'
  },

  // 10 Stage A AIP Criteria (Clauses — Sky Blue)
  {
    id: 'RULE-A01',
    code: 'AIP-01',
    type: 'clause',
    title: '1. Photo ID & Biometric Liveness (KYC)',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (1/10)',
    summary: 'Valid Irish/EU/International Passport or Irish Driving Licence verified with biometric liveness.',
    detail: 'MRZ cryptographic chip verification and biometric selfie liveness match across all sole or joint applicants.',
    tags: ['Passport', 'Biometric', 'AML'],
    autoVerified: 'Instant KYC'
  },
  {
    id: 'RULE-A02',
    code: 'AIP-02',
    type: 'clause',
    title: '2. Citizenship & Residency Status (IE / Stamp 4)',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (2/10)',
    summary: 'Irish, UK (CTA), EU/EEA Citizen, or Non-EEA Stamp 4 / Critical Skills IRP card validated.',
    detail: 'Confirms unrestricted right to reside and work in Ireland under CBI and lender credit policy thresholds.',
    tags: ['Citizenship', 'Stamp 4', 'CTA'],
    autoVerified: 'IRP / Passport Check'
  },
  {
    id: 'RULE-A03',
    code: 'AIP-03',
    type: 'clause',
    title: '3. Proof of Current Address (AML <3–6 Mos)',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (3/10)',
    summary: 'Recent utility bill, bank statement, or RTB tenancy record matched to declared residence.',
    detail: 'Verifies current address within 90 days across Electric Ireland, Bord Gais, telecoms, or primary current account statements.',
    tags: ['Utility Bill', 'Address AML'],
    autoVerified: 'Document OCR'
  },
  {
    id: 'RULE-A04',
    code: 'AIP-04',
    type: 'clause',
    title: '4. Official PPSN Verification',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (4/10)',
    summary: 'Personal Public Service Number matched to official Revenue or DSP correspondence.',
    detail: 'PPSN extracted and cross-matched directly to Revenue Employment Detail Summary (EDS) and Help-to-Buy claims.',
    tags: ['PPSN', 'Revenue'],
    autoVerified: 'Revenue Match'
  },
  {
    id: 'RULE-A05',
    code: 'AIP-05',
    type: 'clause',
    title: '5. Central Credit Register (CCR) & Judgments',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (5/10)',
    summary: 'Zero undisclosed loans, zero historical arrears, clean Stubbs Gazette & ISI insolvency screen.',
    detail: 'Validates active consumer credit facilities (car loans, credit cards, overdraft limits) match Open Banking repayments with 0 arrears.',
    tags: ['CCR Report', 'Zero Arrears', 'Stubbs'],
    autoVerified: 'Bureau Feed'
  },
  {
    id: 'RULE-A06',
    code: 'AIP-06',
    type: 'clause',
    title: '6. Employment Contract, Tenure & Probation',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (6/10)',
    summary: 'Permanent PAYE role (probation passed) or >=2–3 yrs self-employed trading record.',
    detail: 'Detects employer continuity via recurring payroll credits and CRO company director verification for self-employed borrowers.',
    tags: ['PAYE', 'Probation', 'Self-Employed'],
    autoVerified: 'Payroll Pattern'
  },
  {
    id: 'RULE-A07',
    code: 'AIP-07',
    type: 'clause',
    title: '7. Verified Income & Revenue EDS / Form 11',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (7/10)',
    summary: '3 months payslips + Revenue EDS (or 2–3 yrs Certified Accounts + ROS Tax Clearance).',
    detail: 'Recognizes 100% basic salary plus variable bonus weighted by lender cap (60% BOI / 50% White-Label) and CBI 4.0x FTB / 3.5x Mover LTI caps.',
    tags: ['CBI 4.0x LTI', 'Payslips', 'ROS'],
    autoVerified: 'Income Reconciliation'
  },
  {
    id: 'RULE-A08',
    code: 'AIP-08',
    type: 'clause',
    title: '8. 6-Month Bank, Savings & Neobank Statements',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (8/10)',
    summary: 'All current, savings, Credit Union, Revolut & N26 accounts audited via Yapily / CSV.',
    detail: 'Cryptographic balance integrity check confirms zero missing statement days and complete inter-account transfer reconciliation.',
    tags: ['Yapily PSD2', 'Revolut/N26', '6-Mo History'],
    autoVerified: 'Open Banking'
  },
  {
    id: 'RULE-A09',
    code: 'AIP-09',
    type: 'clause',
    title: '9. Account Conduct, Gambling & BNPL Screen',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (9/10)',
    summary: '0 unpaid DDs, 0 unarranged overdrafts, betting <1.5% net pay, Klarna/BNPL remediated.',
    detail: 'Applies Clive pre-submission remediation hold if Klarna or conduct flags appear, holding the pack inside app.broc.fi until 6 clean months accumulate.',
    tags: ['Conduct Clean', 'BNPL Guard'],
    autoVerified: 'Clara Conduct Audit'
  },
  {
    id: 'RULE-A10',
    code: 'AIP-10',
    type: 'clause',
    title: '10. Deposit Source (AML) & +2% Stress Test',
    category: 'Stage A: AIP Core',
    pointsOrStage: 'Stage A (10/10)',
    summary: '>=10% deposit proven (Savings/HTB/Gift Letter) + Capacity >= Rate + 2.0%.',
    detail: 'Verifies 90% max LTV for FTB/SSB alongside CBI +2% annuity stress test and household NDI living-cost buffer.',
    tags: ['90% LTV', '+2% Stress', 'HTB / Gift'],
    autoVerified: 'Stress Engine'
  },

  // 8 Stage B Full Mortgage Riders (Riders — Emerald)
  {
    id: 'RULE-B11',
    code: 'FULL-11',
    type: 'rider',
    title: '11. Standardized Lender Salary Certificate',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (11/18)',
    summary: 'Employer HR signed & stamped certificate confirming basic salary, tenure, and permanent status.',
    detail: 'Or Chartered Accountant confirmation letter of current-year trading stability for self-employed company directors.',
    tags: ['HR Sign-Off', 'Salary Cert'],
    autoVerified: 'Digital HR Portal'
  },
  {
    id: 'RULE-B12',
    code: 'FULL-12',
    type: 'rider',
    title: '12. Pre-Offer Statement & Payslip Refresh',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (12/18)',
    summary: 'Live Open Banking refresh confirming continued savings trajectory and zero new credit.',
    detail: 'Continuous Yapily feed eliminates stale statement requests between Stage A AIP and Stage B Letter of Offer issuance.',
    tags: ['Live Feed', 'Zero New Debt'],
    autoVerified: 'Continuous Sync'
  },
  {
    id: 'RULE-B13',
    code: 'FULL-13',
    type: 'rider',
    title: '13. Sales Advice Note & Booking Deposit Receipt',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (13/18)',
    summary: 'Estate agent Sales Advice Note confirming Sale Agreed price and paid booking deposit.',
    detail: 'Matches property Eircode, agreed purchase price, vendor solicitor details, and booking deposit transfer receipt.',
    tags: ['Sale Agreed', 'Estate Agent'],
    autoVerified: 'Property Vault'
  },
  {
    id: 'RULE-B14',
    code: 'FULL-14',
    type: 'rider',
    title: '14. Lender Panel Property Valuation Report',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (14/18)',
    summary: 'Approved panel valuer inspection confirming market value >= Sale Agreed price.',
    detail: 'Confirms rebuild reinstatement value for buildings insurance and validates collateral security against CBI LTV tier.',
    tags: ['Panel Valuer', 'Security'],
    autoVerified: 'Valuer Dispatch'
  },
  {
    id: 'RULE-B15',
    code: 'FULL-15',
    type: 'rider',
    title: '15. SEAI BER Certificate & Green Rate Eligibility',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (15/18)',
    summary: 'Official SEAI BER rating (A1–B3 unlocks EcoSaver Green rate discount).',
    detail: 'Queries SEAI national BER register; BER A1–B3 automatically routes applicant to lender Green EcoSaver pricing (3.65% BOI / 3.55% White-Label).',
    tags: ['BER A1-B3', 'Green Rate', 'SEAI'],
    autoVerified: 'SEAI Register'
  },
  {
    id: 'RULE-B16',
    code: 'FULL-16',
    type: 'rider',
    title: '16. Structural Survey & Planning Compliance',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (16/18)',
    summary: 'Chartered Engineer structural survey & Architect Opinion of Compliance / HomeBond.',
    detail: 'Covers pre-1980 or rural inspections, septic/well compliance, or HomeBond structural warranty for new-build developments.',
    tags: ['Engineer Survey', 'Planning'],
    autoVerified: 'Legal Pack Check'
  },
  {
    id: 'RULE-B17',
    code: 'FULL-17',
    type: 'rider',
    title: '17. Solicitor Undertaking & Contracts for Sale',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (17/18)',
    summary: 'Approved panel solicitor undertaking, clean title deed requisition & signed purchase contracts.',
    detail: 'Tracks Law Society approved panel solicitor status, family home declaration, and drawdown funds requisition.',
    tags: ['Panel Solicitor', 'Title Deeds'],
    autoVerified: 'Solicitor Bridge'
  },
  {
    id: 'RULE-B18',
    code: 'FULL-18',
    type: 'rider',
    title: '18. Mortgage Protection, Home Insurance & SEPA DD',
    category: 'Stage B: Post Sale-Agreed',
    pointsOrStage: 'Stage B (18/18)',
    summary: 'Bound Life Cover assigned to lender + Buildings Insurance (via Broc Tender) + SEPA DD.',
    detail: 'Clive tenders life assurance and buildings cover across Irish underwriters in-app and assigns lender interest prior to funds release.',
    tags: ['Broc Tender', 'Life Cover', 'SEPA DD'],
    autoVerified: 'Insurance Tender'
  }
];
