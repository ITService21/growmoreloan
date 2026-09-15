import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import EMICalculator from '../components/common/EMICalculator';
import SERVICES from '../data/services';
import { COMPANY, APPLY_PHONE } from '../data/company';
import { getWhatsAppLink } from '../utils/helpers';
import { useScrollAnimationMulti } from '../utils/hooks';

const SERVICE_PRESETS = {
  'personal-loan': { amount: 500000, rate: 12, years: 3 },
  'business-loan': { amount: 2000000, rate: 14, years: 5 },
  'machinery-loan': { amount: 5000000, rate: 12, years: 7 },
  'cash-credit': { amount: 3000000, rate: 12, years: 5 },
  overdraft: { amount: 2500000, rate: 11, years: 5 },
  'msme-loan': { amount: 1000000, rate: 10, years: 5 },
  'home-loan': { amount: 5000000, rate: 8.5, years: 20 },
  'mortgage-loan': { amount: 3000000, rate: 10, years: 15 },
  'car-loan': { amount: 800000, rate: 9, years: 5 },
  insurance: { amount: 500000, rate: 10, years: 3 },
};

function SectionBgObjects({ variant }) {
  const configs = {
    hero: [
      { cls: 'obj-orange geo-float-1', style: { top: '10%', right: '-5%' } },
      { cls: 'obj-green geo-float-3', style: { bottom: '15%', left: '-8%' } },
      { cls: 'obj-gold geo-float-2', style: { top: '45%', left: '35%' } },
    ],
    disclaimer: [
      { cls: 'obj-orange geo-float-3', style: { top: '12%', right: '5%' } },
      { cls: 'obj-green geo-float-1', style: { bottom: '20%', left: '-10%' } },
    ],
  };
  const items = configs[variant] || configs.hero;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={`bg-object-large ${item.cls}`} style={item.style} />
      ))}
    </>
  );
}

export default function EMICalculatorPage() {
  useScrollAnimationMulti();

  const calculatorRef = useRef(null);
  const [calcKey, setCalcKey] = useState(0);
  const [calcDefaults, setCalcDefaults] = useState({ amount: 1000000, rate: 10.5, tenure: 60 });

  useEffect(() => {
    document.title = `EMI Calculator | ${COMPANY.name}`;
    return () => {
      document.title = 'Grow More Loan Consultancy Group';
    };
  }, []);

  const applyPreset = (serviceId) => {
    const preset = SERVICE_PRESETS[serviceId];
    if (preset) {
      setCalcDefaults({ amount: preset.amount, rate: preset.rate, tenure: preset.years });
      setCalcKey((k) => k + 1);
    }
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="bg-rich-dark">
      {/* Hero — dark with parallax */}
      <section className="hero-parallax relative pt-28 pb-20 sm:pb-24 overflow-hidden bg-warm-dark">
        <div
          className="hero-parallax-img"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200)' }}
          aria-hidden="true"
        />
        <AnimatedBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/85 via-[#0c0c0c]/60 to-[#0c0c0c] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <span className="section-badge">
                <span>✦</span>
                Financial Calculator
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F0E8] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Calculate Your <span className="text-gradient-orange">EMI</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#B8A98A] leading-relaxed max-w-3xl mx-auto">
              Plan your loan repayment with confidence using our interactive EMI calculator. Adjust the
              loan amount, interest rate, and tenure to see your monthly instalment, total interest outgo,
              and a complete amortisation schedule — before you apply.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Calculator — cream */}
      <section
        ref={calculatorRef}
        id="emi-calculator"
        className="section-cream relative py-20 sm:py-24 lg:py-28 scroll-mt-24 overflow-hidden"
      >
        <div className="gradient-blob blob-orange absolute top-10 -left-20 w-72 h-72 opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="gradient-blob blob-green absolute bottom-10 -right-16 w-64 h-64 opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="gradient-blob blob-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Interactive Tool"
            title={
              <>
                Loan <span className="text-gradient-orange">EMI Calculator</span>
              </>
            }
            subtitle="Adjust the sliders or enter values directly to instantly see your monthly EMI, total interest, and repayment breakdown."
            light
          />

          <div className="animate-on-scroll">
            <EMICalculator
              key={calcKey}
              defaultAmount={calcDefaults.amount}
              defaultRate={calcDefaults.rate}
              defaultTenure={calcDefaults.tenure}
              amountMin={50000}
              amountMax={50000000}
              tenureMinYears={1}
              tenureMaxYears={30}
              showAmortization={true}
              className="premium-card bg-gradient-to-br from-[#F97316]/5 via-white/90 to-[#FBBF24]/5 border border-[#F97316]/20 shadow-xl shadow-[#F97316]/5"
            />
          </div>
        </div>
      </section>

      {/* Service Presets — cream */}
      <section className="section-cream relative py-20 sm:py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Quick Presets"
            title="Calculate for Your Service"
            subtitle="One-click presets with typical loan amounts, rates, and tenures for each service we offer. Click to load values and scroll to the calculator."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => applyPreset(service.id)}
                className="animate-on-scroll premium-card p-6 flex flex-col text-left cursor-pointer w-full"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mb-4">{service.icon}</div>
                <h3
                  className="text-lg font-bold text-[#1a1710] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {service.name}
                </h3>
                <p className="text-[#9a8a6a] text-xs mb-1">
                  {service.interestRate} &nbsp;·&nbsp; {service.tenure}
                </p>
                <p className="text-[#5a5040] text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                  {service.shortDesc}
                </p>
                <span className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors mt-auto">
                  Calculate for {service.name} →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer — dark */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-warm-dark">
        <SectionBgObjects variant="disclaimer" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll glass-card p-6 sm:p-8 text-center">
            <p className="text-[#7A6F5F] text-sm leading-relaxed">
              <strong className="text-[#B8A98A]">Disclaimer:</strong> This calculator provides approximate
              values for reference and planning purposes only. Actual EMI may vary based on bank policies,
              processing fees, insurance charges, GST, and other applicable costs. Interest rates are
              subject to change and individual eligibility. Contact our experts at{' '}
              <a href={`tel:+91${APPLY_PHONE}`} className="text-[#F97316] hover:underline">
                {APPLY_PHONE}
              </a>{' '}
              for accurate quotes tailored to your profile.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — cream */}
      <section className="section-cream relative py-20 sm:py-24 lg:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6 inline-flex">✦ Get Started</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a1710] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to Apply? <span className="text-gradient-orange">Contact Our Experts</span>
          </h2>
          <p className="text-[#5a5040] text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            Now that you have an estimate, let our Rajkot &amp; Ahmedabad team find you the best actual
            rates from 15+ banks and NBFCs. We handle documentation, application, and follow-ups — so
            you get funded faster with complete transparency.
          </p>
          <p className="text-[#9a8a6a] text-sm mb-8">
            📧 {COMPANY.email} &nbsp;|&nbsp; 📍 {COMPANY.offices.map((o) => o.city).join(' & ')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-orange">
              Contact Our Experts
            </Link>
            <a
              href={getWhatsAppLink('Hi, I used the EMI calculator and would like to discuss loan options. Please assist.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
