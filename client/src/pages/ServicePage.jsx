import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import EMICalculator from '../components/common/EMICalculator';
import GoogleReviews from '../components/GoogleReviews';
import PhoneInput from '../components/common/PhoneInput';
import SERVICES from '../data/services';
import { COMPANY, PROCESS_STEPS } from '../data/company';
import {
  formatIndianNumber,
  parseIndianNumber,
  submitForm,
  validatePhone,
  validateEmail,
  getWhatsAppLink,
  trackEvent,
} from '../utils/helpers';
import { useScrollAnimationMulti, useFormState } from '../utils/hooks';

const FEATURE_ICONS = ['✨', '⚡', '📋', '💰', '📊', '🎯'];

const HERO_IMAGES = {
  'personal-loan': 'https://images.pexels.com/photos/5900227/pexels-photo-5900227.jpeg?auto=compress&w=1200',
  'business-loan': 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&w=1200',
  'machinery-loan': 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&w=1200',
  'cash-credit': 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&w=1200',
  overdraft: 'https://images.pexels.com/photos/7578901/pexels-photo-7578901.jpeg?auto=compress&w=1200',
  'msme-loan': 'https://images.pexels.com/photos/5717546/pexels-photo-5717546.jpeg?auto=compress&w=1200',
  'home-loan': 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&w=1200',
  'mortgage-loan': 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&w=1200',
  'car-loan': 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&w=1200',
  insurance: 'https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&w=1200',
};

const HERO_HIGHLIGHTS = {
  'personal-loan': 'Instant Personal Loan',
  'business-loan': 'Easy Business Loans',
  'machinery-loan': 'Machinery Loan',
  'cash-credit': 'Cash Credit Facility',
  overdraft: 'Overdraft (OD) Facility',
  'msme-loan': 'MSME Loan',
  'home-loan': 'Dream Home',
  'mortgage-loan': 'Mortgage Loan',
  'car-loan': 'Dream Car',
  insurance: 'Insurance Solutions',
};

const BG_OBJECTS = {
  features: [
    { cls: 'obj-orange geo-float-1', style: { top: '10%', right: '-5%' } },
    { cls: 'obj-green geo-float-3', style: { bottom: '15%', left: '-8%' } },
    { cls: 'obj-gold geo-float-2', style: { top: '50%', right: '20%' } },
  ],
  documents: [
    { cls: 'obj-green geo-float-4', style: { top: '8%', left: '-6%' } },
    { cls: 'obj-orange geo-float-2', style: { bottom: '10%', right: '-4%' } },
  ],
  emi: [
    { cls: 'obj-orange geo-float-3', style: { top: '12%', right: '5%' } },
    { cls: 'obj-green geo-float-1', style: { bottom: '20%', left: '-10%' } },
    { cls: 'obj-gold geo-float-5', style: { top: '60%', right: '-8%' } },
  ],
  faq: [
    { cls: 'obj-green geo-float-2', style: { top: '5%', right: '-7%' } },
    { cls: 'obj-orange geo-float-4', style: { bottom: '12%', left: '3%' } },
  ],
  related: [
    { cls: 'obj-orange geo-float-1', style: { top: '15%', left: '-5%' } },
    { cls: 'obj-green geo-float-6', style: { bottom: '18%', right: '-6%' } },
    { cls: 'obj-gold geo-float-3', style: { top: '45%', left: '35%' } },
  ],
};

function SectionBgObjects({ variant }) {
  const items = BG_OBJECTS[variant] || BG_OBJECTS.features;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={`bg-object-large ${item.cls}`} style={item.style} />
      ))}
    </>
  );
}

function parseAmount(str) {
  if (!str || str === 'Custom') return 500000;
  const cleaned = str.replace(/[₹,\s]/g, '');
  const crMatch = cleaned.match(/([\d.]+)\s*Cr/i);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;
  const lMatch = cleaned.match(/([\d.]+)\s*L/i);
  if (lMatch) return parseFloat(lMatch[1]) * 100000;
  const kMatch = cleaned.match(/([\d.]+)\s*K/i);
  if (kMatch) return parseFloat(kMatch[1]) * 1000;
  return Number(cleaned) || 500000;
}

function parseRate(str) {
  if (!str || str === 'Best Premiums') return 10.5;
  const match = str.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 10.5;
}

function parseTenureYears(str) {
  if (!str || str === 'Flexible') return 5;
  if (str === 'Renewable annually') return 1;
  const yearMatch = str.match(/(\d+)\s*years?/i);
  if (yearMatch) return parseInt(yearMatch[1], 10);
  return 5;
}

function buildInitialFormFields(formFields, serviceName) {
  const fields = { service: serviceName };
  if (Array.isArray(formFields)) {
    formFields.forEach((field) => {
      const name = typeof field === 'string' ? field : field.name;
      if (name !== 'service') fields[name] = '';
    });
  }
  return fields;
}

function renderHeroTitle(title, serviceId) {
  const highlight = HERO_HIGHLIGHTS[serviceId];
  if (!highlight || !title.includes(highlight)) {
    return (
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-[var(--text-primary)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h1>
    );
  }
  const [before, after] = title.split(highlight);
  return (
    <h1
      className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-[var(--text-primary)]"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {before}
      <span className="text-gradient-orange">{highlight}</span>
      {after}
    </h1>
  );
}

function getOverviewParagraphs(service) {
  return [
    `${service.shortDesc} At ${COMPANY.name}, we have spent over ${COMPANY.experience} years helping Rajkot and Ahmedabad residents and businesses access ${service.name.toLowerCase()} products that genuinely fit their financial profile. Our advisors take the time to understand your income, credit history, and long-term goals before recommending lenders — ensuring you never apply blindly or waste time on products you cannot qualify for.`,
    `Through partnerships with 15+ leading banks and NBFCs across Gujarat and India, we negotiate competitive interest rates, faster processing timelines, and transparent terms on your behalf. From the initial eligibility check and document preparation to final sanction and disbursement, our team manages every step with complete transparency — no hidden charges, no confusing jargon, and no surprises along the way.`,
  ];
}

function getWhyChooseReasons(serviceName) {
  return [
    {
      icon: '💡',
      title: 'Expert Guidance',
      desc: `Our specialists understand ${serviceName.toLowerCase()} inside out — from eligibility nuances and documentation requirements to disbursement timelines and post-loan support. We translate complex banking terms into plain language so you always know exactly where your application stands and what to expect next.`,
    },
    {
      icon: '📊',
      title: 'Best Rates',
      desc: 'We simultaneously compare offers from 15+ banks and NBFCs to negotiate the most competitive interest rates, processing fees, and tenure options for your unique profile. Our market knowledge and lender relationships often secure terms that are significantly better than what clients find when applying directly.',
    },
    {
      icon: '⚡',
      title: 'Quick Processing',
      desc: 'Streamlined documentation checklists, proactive bank follow-ups, and pre-submission verification mean your application moves faster through approval. We resolve queries on your behalf, coordinate with bank officials daily, and keep the entire process on track from first consultation to final disbursement.',
    },
    {
      icon: '🤝',
      title: 'Complete Support',
      desc: 'From your first free consultation through post-disbursement queries about EMIs, prepayment, or top-up facilities — your dedicated relationship manager stays with you throughout. We measure success by your satisfaction and long-term financial wellbeing, not just by closing a loan file.',
    },
  ];
}

const EXPANDED_PROCESS = PROCESS_STEPS.map((step) => {
  const expansions = {
    1: 'During your free consultation, our expert advisors sit down with you to understand your financial requirements, income sources, existing liabilities, and future goals. We assess your eligibility across multiple loan products and provide honest recommendations on the best options available. There is absolutely no obligation — our goal is to educate and empower you to make informed financial decisions.',
    2: 'Once you decide to proceed, our team provides a comprehensive checklist of required documents tailored to your loan type and employment profile. We review your paperwork for completeness and accuracy before submission, helping you avoid common mistakes that cause delays. For business loans and MSME schemes, we also assist with project reports and financial statements preparation.',
    3: 'Leveraging our extensive network of banking partners, we simultaneously compare offers from multiple lenders to identify the best interest rates, tenure options, and terms for your profile. We present you with a clear comparison of top options, explaining the pros and cons of each. Once you choose, we initiate the formal application and liaise directly with the bank on your behalf.',
    4: 'Our team manages the entire application lifecycle — from submission and verification to credit appraisal and sanction. We maintain regular follow-ups with bank officials, address any queries or additional document requests promptly, and keep you updated at every milestone. Our proactive approach significantly reduces processing time compared to applying directly.',
    5: 'Upon loan approval, we coordinate the disbursement process to ensure funds reach your account as quickly as possible. We verify the sanction letter, EMI schedule, and all terms match what was agreed upon. Even after disbursement, we remain available for any queries regarding repayments, prepayment options, top-up loans, or balance transfers in the future.',
  };
  return { ...step, description: expansions[step.step] };
});

export default function ServicePage() {
  const { serviceId } = useParams();
  const service = SERVICES.find((s) => s.id === serviceId);

  const [docTab, setDocTab] = useState('salaried');
  const [openFaq, setOpenFaq] = useState(null);

  const { formData, loading, setLoading, status, setStatus, handleChange, reset, setFormData } =
    useFormState(service ? buildInitialFormFields(service.formFields, service.name) : {});

  useScrollAnimationMulti();

  useEffect(() => {
    if (service) {
      document.title = service.seoTitle;
      setFormData(buildInitialFormFields(service.formFields, service.name));
      setStatus(null);
    }
    return () => {
      document.title = 'Grow More Loan Consultancy Group';
    };
  }, [service?.id]);

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 bg-rich-dark">
        <div className="text-center animate-on-scroll visible max-w-md">
          <span className="text-6xl mb-6 block">🔍</span>
          <h1
            className="text-3xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Service Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            The service you&apos;re looking for doesn&apos;t exist or may have been moved. Browse our
            full range of financial solutions from the homepage or contact our team for personalised
            assistance.
          </p>
          <Link to="/" className="btn-green inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const relatedServices = SERVICES.filter((s) => s.id !== service.id).slice(0, 3);
  const whyChooseReasons = getWhyChooseReasons(service.name);
  const overviewParagraphs = getOverviewParagraphs(service);
  const amountMin = Math.max(parseAmount(service.minAmount), 50000);
  let amountMax = Math.min(parseAmount(service.maxAmount) || 10000000, 100000000);
  if (amountMax <= amountMin) amountMax = Math.max(amountMin * 10, 5000000);
  const tenureMinYears = service.id === 'home-loan' ? 5 : 1;
  const tenureMaxYears = service.id === 'home-loan' ? 30 : service.id === 'insurance' ? 5 : 7;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyClick = () => {
    scrollTo('apply');
    trackEvent('apply_click', 'engagement', service.id);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormNumberChange = (name, value) => {
    const parsed = parseIndianNumber(value);
    setFormData((prev) => ({ ...prev, [name]: parsed ? String(parsed) : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name?.trim() && !formData.businessName?.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name.' });
      return;
    }
    const emailField = formData.email;
    if (!validateEmail(emailField)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (!validatePhone(formData.phone)) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, service: service.name, formType: `service-${service.id}` };
      const res = await submitForm(payload);
      if (res.ok) {
        setStatus({ type: 'success', message: 'Thank you! Our team will contact you within 24 hours.' });
        trackEvent('form_submit', 'conversion', service.id);
        reset();
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field) => {
    const config = typeof field === 'string'
      ? { name: field, label: FIELD_LABELS[field] || field, type: 'text', placeholder: FIELD_LABELS[field] || field, required: true }
      : field;

    const { name, label, type, placeholder, options, required: isRequired } = config;

    if (type === 'select' && options) {
      return (
        <div key={name}>
          <label className="block text-sm font-medium mb-1.5">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="form-input"
            required={isRequired}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'currency') {
      return (
        <div key={name}>
          <label className="block text-sm font-medium mb-1.5">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            inputMode="numeric"
            name={name}
            value={formData[name] ? formatIndianNumber(formData[name]) : ''}
            onChange={(e) => handleFormNumberChange(name, e.target.value)}
            className="form-input no-spinner"
            placeholder={`₹ ${placeholder || label}`}
            required={isRequired}
          />
        </div>
      );
    }

    if (type === 'phone') {
      return (
        <div key={name}>
          <label className="block text-sm font-medium mb-1.5">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <PhoneInput
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            placeholder={placeholder || label}
            required={isRequired}
          />
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={name} className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="form-input min-h-[100px] resize-y"
            placeholder={placeholder || label}
            required={isRequired}
            rows={3}
          />
        </div>
      );
    }

    const inputType = type === 'email' ? 'email' : 'text';

    return (
      <div key={name}>
        <label className="block text-sm font-medium mb-1.5">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={inputType}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className="form-input"
          placeholder={placeholder || label}
          required={isRequired}
        />
      </div>
    );
  };

  return (
    <main className="bg-rich-dark">
      {/* Breadcrumb */}
      <nav
        className="pt- 24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-on-scroll"
        aria-label="Breadcrumb"
      >
        {/* <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
          <li><Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link to="/#services" className="hover:text-[#F97316] transition-colors">Services</Link></li>
          <li>/</li>
          <li className="text-[var(--text-primary)] font-medium">{service.name}</li>
        </ol> */}
      </nav>

      {/* Hero — dark */}
      <section className="relative pb-20 sm:pb-24 overflow-hidden hero-parallax mt-16">
        <div
          className="hero-parallax-img"
          style={{ backgroundImage: `url(${HERO_IMAGES[service.id] || HERO_IMAGES['personal-loan']})` }}
          aria-hidden="true"
        />
        <AnimatedBackground variant="hero" />
        {/* <SectionBgObjects variant="features" /> */}
        <div className="mt-6 absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <span className="section-badge mb-8">{service.icon} {service.name}</span>
            {renderHeroTitle(service.heroTitle, service.id)}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10 max-w-3xl mx-auto">
              {service.heroSubtitle} Our team handles everything from eligibility assessment and document
              preparation to bank coordination and disbursement — backed by {COMPANY.experience} years of
              trusted financial consultancy and {COMPANY.clients} satisfied clients across Rajkot &amp; Ahmedabad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              {[
                { label: 'Loan Amount', value: `${service.minAmount} — ${service.maxAmount}` },
                { label: 'Interest Rate', value: service.interestRate },
                { label: 'Tenure', value: service.tenure },
              ].map((item) => (
                <div key={item.label} className="glass-card px-5 py-5">
                  <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] whitespace-nowrap">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button type="button" onClick={handleApplyClick} className="btn-orange w-full sm:w-auto">
                Apply Now →
              </button>
              <button type="button" onClick={() => scrollTo('eligibility')} className="btn-outline w-full sm:w-auto">
                Check Eligibility
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Detail — "What is X?" section with quick stats + Perfect For (Cash Credit, etc.) */}
 

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Overview — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden ">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Overview"
            title={`About ${service.name}`}
            subtitle="Key details to know before you apply — rates, limits, and how we help you secure the best deal."
            light
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="animate-on-scroll space-y-5">
              {/* {overviewParagraphs.map((para, i) => (
                <p key={i} className="text-[#5a5040] leading-relaxed text-base">{para}</p>
              ))} */}

              <div className="space-y-4">
                {[
                  { label: 'Interest Rate', value: service.interestRate, icon: '📉', sub: 'Competitive rates negotiated across 15+ partner banks' },
                  { label: 'Maximum Amount', value: service.maxAmount, icon: '💰', sub: 'Subject to eligibility, income, and lender policies' },
                  { label: 'Repayment Tenure', value: service.tenure, icon: '📅', sub: 'Flexible options tailored to your monthly budget' },
                ].map((card, index) => (
                  <div
                    key={card.label}
                    className="animate-on-scroll glow-card p-5 flex items-start gap-4"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="icon-box flex-shrink-0">{card.icon}</div>
                    <div>
                      <p className="text-xs text-[#9a8a6a] uppercase tracking-wider mb-1">{card.label}</p>
                      <p className="text-lg font-bold text-[#1a1710] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                        {card.value}
                      </p>
                      <p className="text-sm text-[#5a5040] leading-relaxed">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Image */}
            <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              {service.overviewImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[rgba(0,0,0,0.06)]">
                  <img
                    src={service.overviewImage}
                    alt={`${service.name} illustration`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md">
                    <p className="text-xs text-[#9a8a6a] uppercase tracking-wider">{COMPANY.experience} Years</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="features" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Features"
            title={`Key Features of ${service.name}`}
            subtitle="Discover the benefits that make this financial product the right choice for your goals — backed by expert guidance at every step."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-on-scroll premium-card p-7"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mb-5">{FEATURE_ICONS[index % FEATURE_ICONS.length]}</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility — cream */}
      <section id="eligibility" className="section-cream relative py-20 sm:py-24 scroll-mt-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Eligibility"
            title={`${service.name} Eligibility Criteria`}
            subtitle={`Review the standard requirements for ${service.name.toLowerCase()} with our partner banks and NBFCs — we help you find lenders where your profile fits best.`}
            light
          />

          {/* Two-column eligibility grid */}
          {(() => {
            const items = service.eligibility;
            const isStructured = items.length > 0 && typeof items[0] === 'object';
            if (!isStructured) {
              return (
                <div className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, index) => (
                    <div key={index} className="eligibility-card">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-[#5a5040] text-sm leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              );
            }

            const half = Math.ceil(items.length / 2);
            const leftCol = items.slice(0, half);
            const rightCol = items.slice(half);

            const ELIG_ICONS = [
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
            ];

            const renderEligCard = (item, idx) => (
              <div
                key={idx}
                className="animate-on-scroll eligibility-card"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-md text-white">
                  {ELIG_ICONS[idx % ELIG_ICONS.length]}
                </div>
                <div className="min-w-0">
                  <p className="text-[#1a1710] text-sm font-bold leading-tight">{item.title}</p>
                  <p className="text-[#5a5040] text-xs leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            );

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0">
                <div>
                  <h3 className="text-lg font-bold text-[#1a1710] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    Basic Eligibility
                  </h3>
                  <div className="space-y-3">
                    {leftCol.map((item, idx) => renderEligCard(item, idx))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1710] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    Financial Requirements
                  </h3>
                  <div className="space-y-3">
                    {rightCol.map((item, idx) => renderEligCard(item, idx + half))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Documents — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="documents" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Documentation"
            title="Documents Required"
            subtitle="Prepare these documents in advance for faster processing. Our team reviews everything before submission to avoid delays."
          />

          <div className="animate-on-scroll glass-card overflow-hidden">
            <div className="flex border-b border-[var(--border-subtle)]">
              {['salaried', 'selfEmployed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDocTab(tab)}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${
                    docTab === tab
                      ? 'text-[#F97316] bg-[#F97316]/8 border-b-2 border-[#F97316]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab === 'salaried' ? 'Salaried' : 'Self-Employed'}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.documents[docTab].map((doc, index) => (
                <div key={index} className="doc-card flex-col text-center min-h-[120px] justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/20 to-[#FBBF24]/10 flex items-center justify-center text-[#F97316] mx-auto mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[#F5F0E8] text-sm leading-relaxed">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Process"
            title="How to Apply"
            subtitle="Our proven five-step methodology makes securing your loan straightforward, transparent, and stress-free from start to finish."
            light
          />

          <div className="hidden lg:block animate-on-scroll mb-12">
            <div className="relative h-2 bg-white/60 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[var(--green)] via-[var(--orange)] to-[var(--orange-light)] rounded-full opacity-40" />
            </div>
            <div className="flex justify-between mt-3">
              {EXPANDED_PROCESS.map((step) => (
                <span key={step.step} className="text-xs text-[#9a8a6a] font-medium">Step {step.step}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--green)] via-[var(--orange)]/50 to-transparent hidden sm:block" />

            <div className="space-y-8">
              {EXPANDED_PROCESS.map((step, index) => (
                <div
                  key={step.step}
                  className="animate-on-scroll relative flex gap-5 sm:gap-6"
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div
                    className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 relative ${
                      index % 2 === 0
                        ? 'bg-gradient-to-br from-[var(--green)] to-[#16A34A]'
                        : 'bg-gradient-to-br from-[var(--orange)] to-[#EA580C]'
                    }`}
                  >
                    {step.step}
                  </div>
                  <div className="glass-card p-6 flex-grow">
                    <h3 className="text-xl font-bold text-[#1a1710] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-[#5a5040] text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="emi" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Calculator"
            title={`${service.name} EMI Calculator`}
            subtitle="Estimate your monthly EMI, total interest, and repayment amount based on typical values for this service type."
          />

          <div className="animate-on-scroll">
            <EMICalculator
              defaultAmount={parseAmount(service.minAmount)}
              defaultRate={parseRate(service.interestRate)}
              defaultTenure={parseTenureYears(service.tenure)}
              amountMin={amountMin}
              amountMax={amountMax}
              tenureMinYears={tenureMinYears}
              tenureMaxYears={tenureMaxYears}
            />
          </div>
        </div>
      </section>

      {/* Application Form — cream */}
      <section id="apply" className="section-cream relative py-20 sm:py-24 scroll-mt-24 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-2 ">
          <SectionHeading
            badge="Apply Now"
            title={`Apply for ${service.name}`}
            subtitle="Fill in your details below and our expert team will contact you within 24 hours with personalised options and next steps."
            light
          />

          <div className="animate-on-scroll rounded-2xl overflow-hidden border border-[#F97316]/15 bg-gradient-to-br from-white via-[#FFF7ED] to-[#FFF9F0] shadow-xl shadow-[#F97316]/5">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 p-8 sm:p-10 bg-gradient-to-br from-[#F97316]/10 via-[#FBBF24]/5 to-[#22C55E]/10 border-b lg:border-b-0 lg:border-r border-[#F97316]/10">
                <h3
                  className="text-2xl font-bold text-[#1a1710] mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Why Apply With Us?
                </h3>
                <ul className="space-y-5">
                  {[
                    { icon: '💡', title: 'Free Expert Consultation', desc: 'Personalized guidance with no obligation — we assess your profile and recommend the best lenders.' },
                    { icon: '📊', title: 'Best Rates Guaranteed', desc: 'We compare 15+ banks to negotiate the lowest interest rates and processing fees for you.' },
                    { icon: '⚡', title: 'Fast Processing', desc: 'Streamlined documentation and proactive bank follow-ups mean quicker approvals and disbursement.' },
                    { icon: '🤝', title: 'Dedicated Support', desc: 'Your personal relationship manager stays with you from application through disbursement and beyond.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-[#1a1710] text-[16px] mb-1">{item.title}</p>
                        <p className="text-[#5a5040] text-[13px] leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3 p-6 sm:p-10">
                {status?.type === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a1710] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Application Submitted!</h3>
                    <p className="text-[#5a5040] mb-2">Thank you for choosing Grow More Loan Consultancy.</p>
                    <p className="text-[#22C55E] font-semibold text-lg">We will connect with you soon! 🎉</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="hidden" name="service" value={service.name} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {service.formFields.map(renderFormField)}
                    </div>

                    {status?.type === 'error' && (
                      <div className="text-sm px-4 py-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                        {status.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn-orange w-full flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {loading && (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="faq" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="FAQ"
            title={`${service.name} — Frequently Asked Questions`}
            subtitle="Find detailed answers to the most common questions about this service — and reach out anytime if you need personalised guidance."
          />

          <div className="animate-on-scroll space-y-3">
            {service.faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'active' : ''}`}>
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-[var(--text-primary)] pr-4">{faq.q}</span>
                  <span className={`text-[#F97316] text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div className="faq-answer">
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews for this service */}
      <GoogleReviews category={service.name} />

      {/* Why Choose Us — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Us"
            title={`Why Choose Us for ${service.name}`}
            subtitle={`Trusted by ${COMPANY.clients} clients across Rajkot and Ahmedabad for reliable, transparent financial consultancy — with dedicated support at every stage.`}
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseReasons.map((reason, index) => (
              <div
                key={reason.title}
                className="animate-on-scroll premium-card p-7 text-center"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mx-auto mb-5">{reason.icon}</div>
                <h3 className="text-lg font-bold text-[#1a1710] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {reason.title}
                </h3>
                <p className="text-[#5a5040] text-sm leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="related" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Explore More"
            title="Related Services"
            subtitle="Discover more financial solutions tailored to your needs — each backed by the same expert guidance and transparent process."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((related, index) => (
              <Link
                key={related.id}
                to={`/services/${related.id}`}
                className="animate-on-scroll premium-card p-6 flex flex-col"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mb-5">{related.icon}</div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {related.name}
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-4 flex-grow line-clamp-3">
                  {related.shortDesc}
                </p>
                <span className="text-[#F97316] font-semibold text-sm">Learn More →</span>
              </Link>
            ))}
          </div>

          <div className="animate-on-scroll text-center mt-10">
            <Link to="/blog" className="btn-outline">
              Read More Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6">✦ Get Started</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1710] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Apply for <span className="text-gradient-orange">{service.name}</span>?
          </h2>
          <p className="text-[#5a5040] text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards your financial goals today. Our experts are ready to help you find
            the best deal with zero hidden charges, complete transparency, and dedicated support from
            consultation through disbursement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button type="button" onClick={handleApplyClick} className="btn-orange w-full sm:w-auto">
              Apply Now →
            </button>
            <a
              href={getWhatsAppLink(`Hi, I'm interested in ${service.name} from Grow More Loan Consultancy. Please share more details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto text-center"
              onClick={() => trackEvent('whatsapp_click', 'engagement', service.id)}
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
