import { useState, useEffect, useMemo } from 'react';
import { calculateEMI, formatCurrency, formatIndianNumber, parseIndianNumber } from '../../utils/helpers';

function getAmortizationSchedule(principal, ratePercent, tenureMonths) {
  const r = ratePercent / 12 / 100;
  const emi = calculateEMI(principal, ratePercent, tenureMonths);
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = r === 0 ? 0 : Math.round(balance * r);
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({
      month,
      emi,
      principal: principalPaid,
      interest,
      balance: Math.round(balance),
    });
  }

  return schedule;
}

export default function EMICalculator({
  defaultAmount = 500000,
  defaultRate = 10.5,
  defaultTenure = 5,
  amountMin = 50000,
  amountMax = 10000000,
  tenureMinYears = 1,
  tenureMaxYears = 7,
  showAmortization = false,
  className = '',
}) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount);
  const [interestRate, setInterestRate] = useState(defaultRate);
  const [tenureYears, setTenureYears] = useState(defaultTenure);
  const [amountInput, setAmountInput] = useState(formatIndianNumber(defaultAmount));
  const [rateInput, setRateInput] = useState(String(defaultRate));
  const [tenureInput, setTenureInput] = useState(String(defaultTenure));

  useEffect(() => {
    setLoanAmount(defaultAmount);
    setInterestRate(defaultRate);
    setTenureYears(defaultTenure);
    setAmountInput(formatIndianNumber(defaultAmount));
    setRateInput(String(defaultRate));
    setTenureInput(String(defaultTenure));
  }, [defaultAmount, defaultRate, defaultTenure]);

  const tenureMonths = Math.round(tenureYears * 12);
  const emi = calculateEMI(loanAmount, interestRate, tenureMonths);
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - loanAmount;

  const schedule = useMemo(
    () => (showAmortization ? getAmortizationSchedule(loanAmount, interestRate, tenureMonths) : []),
    [showAmortization, loanAmount, interestRate, tenureMonths]
  );

  const handleAmountInput = (value) => {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    const parsed = parseInt(digitsOnly, 10) || 0;
    const clamped = Math.min(parsed, amountMax);
    setLoanAmount(clamped);
    setAmountInput(clamped > 0 ? formatIndianNumber(clamped) : '');
  };

  const handleAmountSlider = (value) => {
    const v = Number(value);
    setLoanAmount(v);
    setAmountInput(formatIndianNumber(v));
  };

  const handleRateInput = (value) => {
    setRateInput(value);
    if (value === '' || value === '.') {
      setInterestRate(0);
      return;
    }
    const val = parseFloat(value);
    if (!isNaN(val) && val >= 0 && val <= 30) {
      setInterestRate(val);
    }
  };

  const handleRateBlur = () => {
    const val = parseFloat(rateInput);
    if (isNaN(val) || val < 1) {
      setInterestRate(1);
      setRateInput('1');
    } else if (val > 30) {
      setInterestRate(30);
      setRateInput('30');
    } else {
      setInterestRate(val);
      setRateInput(String(val));
    }
  };

  const handleRateSlider = (value) => {
    const v = Number(value);
    setInterestRate(v);
    setRateInput(String(v));
  };

  const handleTenureInput = (value) => {
    setTenureInput(value);
    if (value === '' || value === '.') {
      setTenureYears(0);
      return;
    }
    const val = parseFloat(value);
    if (!isNaN(val) && val >= 0 && val <= tenureMaxYears) {
      setTenureYears(val);
    }
  };

  const handleTenureBlur = () => {
    const val = parseFloat(tenureInput);
    if (isNaN(val) || val < tenureMinYears) {
      setTenureYears(tenureMinYears);
      setTenureInput(String(tenureMinYears));
    } else if (val > tenureMaxYears) {
      setTenureYears(tenureMaxYears);
      setTenureInput(String(tenureMaxYears));
    } else {
      setTenureYears(val);
      setTenureInput(String(val));
    }
  };

  const handleTenureSlider = (value) => {
    const v = Number(value);
    setTenureYears(v);
    setTenureInput(String(v));
  };

  return (
    <div className={`glass-card p-6 sm:p-10 ${className}`}>
      <div className="space-y-8 mb-10">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-[var(--text-primary)] block">Loan Amount (₹)</label>
            <span className="font-semibold text-[#F97316]">{formatCurrency(loanAmount)}</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            className="form-input no-spinner mb-3"
            value={amountInput}
            onChange={(e) => handleAmountInput(e.target.value)}
            placeholder="e.g. 5,00,000"
          />
          <input
            type="range"
            min={amountMin}
            max={amountMax}
            step={amountMax > 10000000 ? 100000 : 50000}
            value={loanAmount}
            onChange={(e) => handleAmountSlider(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>{formatCurrency(amountMin)}</span>
            <span>{formatCurrency(amountMax)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-[var(--text-primary)] block">Interest Rate (% p.a.)</label>
            <span className="font-semibold text-[#F97316]">{interestRate}% p.a.</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            className="form-input no-spinner mb-3"
            value={rateInput}
            onChange={(e) => handleRateInput(e.target.value)}
            onBlur={handleRateBlur}
            placeholder="e.g. 10.5"
          />
          <input
            type="range"
            min={1}
            max={30}
            step={0.25}
            value={interestRate}
            onChange={(e) => handleRateSlider(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Tenure in YEARS */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-[var(--text-primary)] block">Tenure (Years)</label>
            <span className="font-semibold text-[#F97316]">
              {tenureYears} year{tenureYears !== 1 ? 's' : ''} ({tenureMonths} months)
            </span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            className="form-input no-spinner mb-3"
            value={tenureInput}
            onChange={(e) => handleTenureInput(e.target.value)}
            onBlur={handleTenureBlur}
            placeholder={`e.g. ${defaultTenure}`}
          />
          <input
            type="range"
            min={tenureMinYears}
            max={tenureMaxYears}
            step={0.5}
            value={tenureYears}
            onChange={(e) => handleTenureSlider(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>{tenureMinYears} yr</span>
            <span>{tenureMaxYears} yrs</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Monthly EMI', value: formatCurrency(emi), gradient: 'from-[#F97316]/15 to-[#FBBF24]/10' },
          { label: 'Total Interest', value: formatCurrency(totalInterest), gradient: 'from-[#22C55E]/15 to-[#16A34A]/10' },
          { label: 'Total Amount', value: formatCurrency(totalAmount), gradient: 'from-[#FBBF24]/15 to-[#F97316]/10' },
        ].map((item) => (
          <div key={item.label} className={`glass-card p-6 text-center bg-gradient-to-br ${item.gradient}`}>
            <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#F97316] stat-glow" style={{ fontFamily: 'var(--font-display)' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Amortization Schedule */}
      {showAmortization && (
        <div className="mt-10 mb-4 text-center">
          <span className="section-badge mb-2 inline-flex">📊 Schedule</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F97316]" style={{ fontFamily: 'var(--font-display)' }}>
            Amortization Schedule
          </h3>
          <div className="mx-auto mt-2 w-16 h-1 rounded-full bg-gradient-to-r from-[#F97316] via-[#22C55E] to-[#FBBF24]" />
        </div>
      )}
      {showAmortization && schedule.length > 0 && (
        <div className="mt-10 rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
          <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-[#1a1710] to-[#0c0c0c] border-b border-[#F97316]/20">
                  <th className="text-left p-4 text-[#F97316] font-semibold">Month #</th>
                  <th className="text-right p-4 text-[#F97316] font-semibold">EMI Amount</th>
                  <th className="text-right p-4 text-[#22C55E] font-semibold">Principal</th>
                  <th className="text-right p-4 text-[#FBBF24] font-semibold">Interest</th>
                  <th className="text-right p-4 text-[#B8A98A] font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, index) => (
                  <tr
                    key={row.month}
                    className={`border-b border-[rgba(255,200,100,0.06)] transition-colors hover:bg-gray -800 ${
                      index % 2 === 0 ? 'bg-[#0c0c0c]' : 'bg-[#110f0a]'
                    }`}
                  >
                    <td className="p-4 text-[#F5F0E8] font-medium">{row.month}</td>
                    <td className="p-4 text-right text-[#F5F0E8]">{formatCurrency(row.emi)}</td>
                    <td className="p-4 text-right text-[#22C55E]">{formatCurrency(row.principal)}</td>
                    <td className="p-4 text-right text-[#F97316]">{formatCurrency(row.interest)}</td>
                    <td className="p-4 text-right text-[#B8A98A]">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
