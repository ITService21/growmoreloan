import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import SectionHeading from "../components/SectionHeading";
import {
  COMPANY,
  STATS,
  WHY_US,
  PROCESS_STEPS,
  TEAM,
  APPLY_PHONE,
} from "../data/company";
import SERVICES from "../data/services";
import EMICalculator from "../components/common/EMICalculator";
import GoogleReviews from "../components/GoogleReviews";
import { trackEvent, getPartnerLogoUrl } from "../utils/helpers";
import { useScrollAnimationMulti, useCountUp } from "../utils/hooks";

const HERO_HEADLINES = [
  {
    text: (
      <>
        Grow Your Business with{" "}
        <span className="text-gradient-orange">Proven Financial Expertise</span>
      </>
    ),
  },
  {
    text: (
      <>
        Get <span className="text-gradient-orange">Instant Personal Loan</span>{" "}
        at Best Interest Rates
      </>
    ),
  },
  {
    text: (
      <>
        <span className="text-gradient-orange">Home Loan</span> Starting from
        Just <span className="text-gradient-orange">7.15% Interest</span>
      </>
    ),
  },
  {
    text: (
      <>
        <span className="text-gradient-orange">MSME & Business Loans</span> with
        Government Schemes
      </>
    ),
  },
  {
    text: (
      <>
        Drive Your <span className="text-gradient-orange">Dream Car</span> with
        Easy Car Loans
      </>
    ),
  },
];

const TRUST_BADGES = [
  { label: "7+ Years Experience", icon: "📅" },
  { label: "450+ Happy Clients", icon: "😊" },
  { label: "10+ Services", icon: "📋" },
  { label: "Best Interest Rates", icon: "💰" },
];

const ABOUT_FEATURES = [
  "Expert Financial Advisors",
  "Customized Financial Solutions",
  "Transparent & Competitive Rates",
  "Wide Network of Bank Partners",
];

const ABOUT_HIGHLIGHTS = [
  { label: "7+ Years Experience", icon: "📅" },
  { label: "450+ Happy Clients", icon: "😊" },
  { label: "15+ Bank Partners", icon: "🏦" },
  { label: "2 Office Locations", icon: "📍" },
];

const EXPANDED_WHY_US = [
  {
    ...WHY_US[0],
    description:
      "Our seasoned financial advisors bring over seven years of hands-on experience in the Rajkot, Ahmedabad, and Gujarat loan market. We take time to understand your unique financial situation, income profile, and long-term goals before recommending the perfect loan product. Whether you are a salaried professional, business owner, or MSME entrepreneur, our personalized approach ensures you receive guidance that truly fits your needs — not a one-size-fits-all solution.",
  },
  {
    ...WHY_US[1],
    description:
      "Time is money, especially when you need funds urgently for business expansion, medical emergencies, or property purchase. Our streamlined documentation process and established relationships with banks mean faster approvals and quicker disbursements. We proactively follow up with lenders, resolve queries on your behalf, and keep the entire process moving smoothly so you can focus on what matters most.",
  },
  {
    ...WHY_US[2],
    description:
      "We maintain partnerships with 15+ leading banks and NBFCs across India, giving us the leverage to negotiate the most competitive interest rates on your behalf. Our team constantly monitors market trends and rate changes to ensure you always get the best deal available. From home loans starting at 7.15% to business loans with government subsidies, we fight for every basis point to save you money.",
  },
  {
    ...WHY_US[3],
    description:
      "Trust is the foundation of every financial relationship, and we never take it lightly. From the very first consultation, we provide a clear breakdown of all charges, processing fees, and terms — with absolutely no hidden costs or surprise deductions. You will always know exactly what you are signing up for, and our team is available to explain every clause in plain language before you commit.",
  },
  {
    ...WHY_US[4],
    description:
      "Every client at Grow More is assigned a dedicated relationship manager who serves as your single point of contact throughout the loan journey. From document collection to final disbursement, your manager handles coordination, provides status updates, and resolves any issues that arise. This personal touch ensures seamless communication and gives you peace of mind knowing someone is always looking out for your interests.",
  },
  {
    ...WHY_US[5],
    description:
      "Our growing family of 450+ satisfied clients across Rajkot and Ahmedabad is a testament to our unwavering commitment to service excellence. Many of our clients return for additional loans and refer their friends, family, and business associates to us. We measure our success not by the number of loans processed, but by the lasting relationships we build and the financial goals we help our clients achieve.",
  },
];

const EXPANDED_PROCESS = PROCESS_STEPS.map((step) => {
  const expansions = {
    1: "During your free consultation, our expert advisors sit down with you to understand your financial requirements, income sources, existing liabilities, and future goals. We assess your eligibility across multiple loan products and provide honest recommendations on the best options available. There is absolutely no obligation — our goal is to educate and empower you to make informed financial decisions.",
    2: "Once you decide to proceed, our team provides a comprehensive checklist of required documents tailored to your loan type and employment profile. We review your paperwork for completeness and accuracy before submission, helping you avoid common mistakes that cause delays. For business loans and MSME schemes, we also assist with project reports and financial statements preparation.",
    3: "Leveraging our extensive network of banking partners, we simultaneously compare offers from multiple lenders to identify the best interest rates, tenure options, and terms for your profile. We present you with a clear comparison of 2-3 top options, explaining the pros and cons of each. Once you choose, we initiate the formal application and liaise directly with the bank on your behalf.",
    4: "Our team manages the entire application lifecycle — from submission and verification to credit appraisal and sanction. We maintain regular follow-ups with bank officials, address any queries or additional document requests promptly, and keep you updated at every milestone. Our proactive approach significantly reduces processing time compared to applying directly.",
    5: "Upon loan approval, we coordinate the disbursement process to ensure funds reach your account as quickly as possible. We verify the sanction letter, EMI schedule, and all terms match what was agreed upon. Even after disbursement, we remain available for any queries regarding repayments, prepayment options, top-up loans, or balance transfers in the future.",
  };
  return { ...step, description: expansions[step.step] };
});

const LOAN_JOURNEY = [
  {
    step: 1,
    title: "Free Consultation",
    description:
      "We begin with a complimentary one-on-one session where we listen carefully to your financial needs, assess your eligibility, and outline the best loan options available for your unique situation. No pressure, no obligation — just expert guidance.",
  },
  {
    step: 2,
    title: "Document Preparation",
    description:
      "Our dedicated team helps you gather, organize, and verify all required documents — from identity proofs and income statements to property papers and business registrations. We ensure everything is complete and accurate before submission.",
  },
  {
    step: 3,
    title: "Bank Processing",
    description:
      "We submit your application to multiple banks simultaneously and negotiate on your behalf for the best interest rates and terms. Our established relationships with lenders ensure faster processing and higher approval chances.",
  },
  {
    step: 4,
    title: "Loan Disbursement",
    description:
      "Once approved, we coordinate the final disbursement to ensure funds reach your account quickly and without complications. We verify all terms, provide your EMI schedule, and remain available for any post-disbursement support.",
  },
];

const HOME_FAQS = [
  {
    q: "What is the minimum credit score required for a personal loan?",
    a: "Most lenders require a minimum credit score of 650. However, we work with multiple banks and NBFCs, so even with a lower score, we may find suitable options for you. Our team evaluates your complete financial profile — not just your credit score — to identify lenders who may approve your application.",
  },
  {
    q: "How quickly can I get a personal loan?",
    a: "With complete documentation, personal loans can be approved within 24–48 hours and disbursed within 2–3 working days. Our streamlined process and bank partnerships help expedite approvals significantly compared to applying directly. For urgent requirements, we prioritize your application and maintain daily follow-ups with the lender.",
  },
  {
    q: "What is the maximum home loan I can get?",
    a: "The maximum loan amount depends on your income, age, existing liabilities, and the property value. Generally, banks offer 75–90% of the property value. We help you maximize your eligibility by optimizing your application profile and selecting the right co-applicants and lender combinations.",
  },
  {
    q: "Can a new business get a loan?",
    a: "Most lenders require at least 2 years of business vintage. However, we have options for businesses with 1+ year of operations under specific schemes like Mudra, PMEGP, and Stand-Up India. Our MSME specialists guide you through government-backed programs designed specifically for new and growing businesses.",
  },
  {
    q: "Is collateral required for a business loan?",
    a: "For loans up to ₹25 lakh, collateral-free options are available under the CGTMSE scheme. For higher amounts, collateral may be required depending on the lender and your business profile. We explore all available options — including government guarantee schemes — to minimize or eliminate collateral requirements wherever possible.",
  },
  {
    q: "What are the tax benefits on a home loan?",
    a: "You can claim up to ₹1.5 lakh deduction on principal repayment under Section 80C and up to ₹2 lakh on interest under Section 24(b) for self-occupied property. We help you understand these benefits while structuring your home loan for maximum savings.",
  },
  {
    q: "What is Udyam Registration and do I need it?",
    a: "Udyam Registration is the government's free online registration for MSMEs. It is required to avail MSME loan benefits, subsidies, and priority lending schemes. If you don't have it yet, our team can guide you through the registration process.",
  },
  {
    q: "What is the difference between Cash Credit and a Term Loan?",
    a: "Cash Credit is a revolving facility where you withdraw and repay repeatedly, paying interest only on the utilized amount. A term loan is a lump sum with fixed EMIs. We help you choose the right product based on your business cash flow and funding needs.",
  },
  {
    q: "Can I get 100% financing for a new car?",
    a: "Yes, for salaried professionals with a good credit score and select car models, 100% on-road financing is available from some lenders. We compare offers across banks to find the best car loan deal for your profile.",
  },
  {
    q: "Should I opt for fixed or floating interest rate?",
    a: "Floating rates are generally lower and adjust with market conditions. Fixed rates provide certainty but are usually 1–2% higher. We analyze your loan type, tenure, and market outlook to recommend the option that saves you the most over time.",
  },
  {
    q: "How does Grow More help compared to applying directly to a bank?",
    a: "We compare offers from 15+ banks, negotiate better rates, handle documentation, follow up with lenders, and provide end-to-end support — all at no extra cost to you. Our 7+ years of experience and 450+ satisfied clients reflect the value we deliver beyond what a single bank can offer.",
  },
  {
    q: "Do you charge any consultancy fees?",
    a: "Our initial consultation is completely free. We earn through bank commissions, so our services come at no direct cost to you. We maintain full transparency about all processing fees and charges before you proceed with any loan application.",
  },
];

const APPLY_PHONE_DISPLAY =
  TEAM.find((m) => m.phone === APPLY_PHONE)?.phoneDisplay || "90819 41882";

const FALLBACK_PARTNERS = [
  { name: "State Bank of India", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/200px-SBI-logo.svg.png" },
  { name: "HDFC Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/200px-HDFC_Bank_Logo.svg.png" },
  { name: "ICICI Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/200px-ICICI_Bank_Logo.svg.png" },
  { name: "Axis Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/200px-Axis_Bank_logo.svg.png" },
  { name: "Bank of Baroda", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bank_of_Baroda_logo.svg/200px-Bank_of_Baroda_logo.svg.png" },
  { name: "Punjab National Bank", logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Punjab_National_Bank_logo.svg/200px-Punjab_National_Bank_logo.svg.png" },
  { name: "Kotak Mahindra Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Kotak_Mahindra_Bank_logo.svg/200px-Kotak_Mahindra_Bank_logo.svg.png" },
  { name: "IndusInd Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/IndusInd_Bank_logo.svg/200px-IndusInd_Bank_logo.svg.png" },
  { name: "Yes Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Yes_Bank_logo.svg/200px-Yes_Bank_logo.svg.png" },
  { name: "IDFC First Bank", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/IDFC_First_Bank_logo.svg/200px-IDFC_First_Bank_logo.svg.png" },
  { name: "Bajaj Finserv", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Bajaj_Finserv_Logo.svg/200px-Bajaj_Finserv_Logo.svg.png" },
  { name: "Tata Capital", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png" },
  { name: "Mahindra Finance", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mahindra_and_Mahindra_Logo.svg/200px-Mahindra_and_Mahindra_Logo.svg.png" },
  { name: "LIC Housing Finance", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/LIC_India_logo.svg/200px-LIC_India_logo.svg.png" },
  { name: "Aditya Birla Capital", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Aditya_Birla_Group_Logo.svg/200px-Aditya_Birla_Group_Logo.svg.png" },
];

const EMI_BG_IMAGE =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200";

function WhyUsFloatingShapes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="geo-float-1 absolute top-[10%] left-[5%] w-16 h-16 opacity-[0.05]"
        viewBox="0 0 60 60"
      >
        <polygon
          points="30,5 55,50 5,50"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="geo-float-2 absolute top-[30%] right-[8%] w-20 h-20 opacity-[0.05]"
        viewBox="0 0 60 60"
      >
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="geo-float-3 absolute bottom-[20%] left-[12%] w-14 h-14 opacity-[0.05]"
        viewBox="0 0 50 50"
      >
        <rect
          x="8"
          y="8"
          width="34"
          height="34"
          rx="4"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
          transform="rotate(20 25 25)"
        />
      </svg>
      <svg
        className="geo-float-4 absolute top-[55%] right-[15%] w-12 h-12 opacity-[0.05]"
        viewBox="0 0 50 50"
      >
        <polygon
          points="25,3 45,15 45,35 25,47 5,35 5,15"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="geo-float-5 absolute bottom-[10%] right-[25%] w-10 h-10 opacity-[0.05]"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="premium-card p-6 sm:p-7 flex flex-col w-80 flex-shrink-0">
      <div className="icon-box mb-5">{service.icon}</div>
      <h3
        className="text-xl font-bold text-[var(--text-primary)] mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.name}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5 flex-grow">
        {service.shortDesc}
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--green)] mt-0.5">✓</span>
          <span>
            {service.minAmount} – {service.maxAmount}
          </span>
        </li>
        <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--green)] mt-0.5">✓</span>
          <span>Interest: {service.interestRate}</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--green)] mt-0.5">✓</span>
          <span>{service.features[0]?.title || service.tenure}</span>
        </li>
      </ul>
      <Link
        to={`/services/${service.id}`}
        className="text-[#F97316] font-semibold text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1"
      >
        Learn More →
      </Link>
    </div>
  );
}

function BackgroundObjects() {
  return (
    <>
      <div
        className="bg-object-large obj-orange geo-float-2"
        style={{ top: "8%", right: "3%", width: "280px", height: "280px" }}
      />
      <div
        className="bg-object-large obj-green geo-float-4"
        style={{ bottom: "12%", left: "2%", width: "250px", height: "250px" }}
      />
      <div
        className="bg-object-large obj-gold geo-float-3"
        style={{ top: "45%", left: "40%", width: "220px", height: "220px" }}
      />
    </>
  );
}

export default function HomePage({ onApply }) {
  useScrollAnimationMulti();

  const [ref1, count1] = useCountUp(7, 2000);
  const [ref2, count2] = useCountUp(450, 2000);
  const [ref3, count3] = useCountUp(10, 2000);
  const [ref4, count4] = useCountUp(100, 2000);

  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeOffice, setActiveOffice] = useState(0);
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const servicesScrollRef = useRef(null);
  const servicesAutoRef = useRef(null);

  const startServicesAutoScroll = useCallback(() => {
    if (servicesAutoRef.current) clearInterval(servicesAutoRef.current);
    servicesAutoRef.current = setInterval(() => {
      const container = servicesScrollRef.current;
      if (!container) return;
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({ left: 2, behavior: "auto" });
      }
    }, 30);
  }, []);

  useEffect(() => {
    startServicesAutoScroll();
    return () => {
      if (servicesAutoRef.current) clearInterval(servicesAutoRef.current);
    };
  }, [startServicesAutoScroll]);
  const partnersScrollRef = useRef(null);
  const partnerAutoRef = useRef(null);

  const startPartnerAutoScroll = useCallback(() => {
    if (partnerAutoRef.current) clearInterval(partnerAutoRef.current);
    partnerAutoRef.current = setInterval(() => {
      const container = partnersScrollRef.current;
      if (!container) return;
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({ left: 2, behavior: "auto" });
      }
    }, 30);
  }, []);

  useEffect(() => {
    startPartnerAutoScroll();
    return () => {
      if (partnerAutoRef.current) clearInterval(partnerAutoRef.current);
    };
  }, [startPartnerAutoScroll]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/partners`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPartners(json.data);
        }
      })
      .catch(() => setPartners(FALLBACK_PARTNERS));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => {
        setPrevHeroIndex(prev);
        return (prev + 1) % HERO_HEADLINES.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = () => {
    if (onApply) onApply();
    else trackEvent("apply_click", "engagement", "home_hero");
  };

  const leftFaqs = HOME_FAQS.slice(0, 6);
  const rightFaqs = HOME_FAQS.slice(6, 12);
  const currentOffice = COMPANY.offices[activeOffice];

  return (
    <main className="bg-rich-dark">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <BackgroundObjects />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/40 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="animate-on-scroll text-center max-w-5xl mx-auto">
            <p className="text-base sm:text-lg font-medium tracking-wider text-[#F97316] mb-8">
              ✦ {COMPANY.slogan}
            </p>

            <div className="hero-carousel mb-8">
              {HERO_HEADLINES.map((headline, index) => {
                const isActive = index === heroIndex;
                const isExit = index === prevHeroIndex && !isActive;
                return (
                  <div
                    key={index}
                    className={`hero-slide ${isActive ? "active" : ""} ${isExit ? "exit" : ""}`}
                  >
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight px-4"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {headline.text}
                    </h1>
                  </div>
                );
              })}
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-3xl mx-auto">
              {COMPANY.name} is Gujarat&apos;s premier loan consultancy,
              empowering individuals and businesses across Rajkot &amp;
              Ahmedabad with personalized financial solutions. With{" "}
              {COMPANY.experience} years of expertise and partnerships with 15+
              leading banks, we deliver the best interest rates, fastest
              approvals, and unwavering support — from your first consultation
              to final disbursement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/contact"
                className="btn-orange w-full sm:w-auto"
                onClick={handleApply}
              >
                Apply for Loan →
              </Link>
              <a href="#services" className="btn-outline w-full sm:w-auto">
                Explore Services →
              </a>
              <a
                href={`tel:+91${APPLY_PHONE}`}
                className="btn-dark w-full sm:w-auto"
                onClick={() =>
                  trackEvent("call_click", "engagement", "home_hero")
                }
              >
                📞 +91 {APPLY_PHONE_DISPLAY}
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {TRUST_BADGES.map((badge, i) => (
                <div
                  key={badge.label}
                  className="glass-card px-4 py-4 flex flex-col items-center gap-2 animate-on-scroll"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] text-center">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href="#about-preview"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">
            Scroll Down
          </span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ─── 2. ABOUT PREVIEW ─── */}
      <section
        id="about-preview"
        className="relative py-20 sm:py-24 overflow-hidden"
      >
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-on-scroll">
              <span className="section-badge mb-6">✦ About Us</span>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Trusted Partner for All Financial Needs
              </h2>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#22C55E] mb-6" />
              <p className="text-[var(--text-secondary)] leading-relaxed mb-5">
                Founded in 2019 in the heart of Rajkot, {COMPANY.shortName} has
                rapidly established itself as one of Gujarat&apos;s most trusted
                loan consultancy firms. We specialize in connecting individuals,
                entrepreneurs, and MSMEs with the right financial products from
                India&apos;s leading banks and NBFCs — ensuring every client
                receives tailored solutions at the most competitive rates.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                With offices in Rajkot and Ahmedabad, our team of experienced
                financial advisors understands the local market dynamics across
                Gujarat. From personal loans and home financing starting at
                7.15% to business funding and government-backed MSME schemes, we
                guide you through every step with transparency, integrity, and a
                genuine commitment to your financial success.
              </p>
              <ul className="space-y-3 mb-8">
                {ABOUT_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-[var(--text-primary)]"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--green)]/15 flex items-center justify-center text-[var(--green)] text-sm">
                      ✓
                    </span>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="text-[#F97316] font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                Learn More About Us →
              </Link>
            </div>

            <div
              className="animate-on-scroll"
              style={{ transitionDelay: "150ms" }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a1f12] via-[#1a1710] to-[#0f1a12] border border-[var(--border-subtle)] p-8 sm:p-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--green)]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--orange)]/20 to-[var(--orange)]/10 border border-[var(--orange)]/30">
                    <span className="text-sm font-bold text-[var(--orange)]">
                      Est. 2019
                    </span>
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--green)]/20 to-[var(--green)]/10 border border-[var(--green)]/30">
                    <span className="text-sm font-bold text-[var(--green)]">
                      450+ Clients Served
                    </span>
                  </div>
                </div>

                <h3
                  className="text-3xl sm:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  7+ Years of Excellence
                </h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  Serving Rajkot &amp; Ahmedabad with pride and dedication
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {ABOUT_HIGHLIGHTS.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-subtle)]"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {[
                    "Home loans from 7.15% interest rate",
                    "15+ partner banks & NBFCs",
                    "Free consultation & document support",
                    "Dedicated relationship manager",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-[var(--text-secondary)]"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--green)]/15 flex items-center justify-center text-[var(--green)] text-xs">
                        ✓
                      </span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-5 mt-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--orange)]/20 to-[var(--green)]/10 flex items-center justify-center text-2xl border border-[var(--border-subtle)]">
                  👤
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-white">{TEAM[0].name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {TEAM[0].role}
                  </p>
                </div>
                <a
                  href={`tel:+91${APPLY_PHONE}`}
                  className="text-[#F97316] font-semibold text-sm hover:opacity-80 transition-opacity"
                >
                  📞 {APPLY_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ─── 3. SERVICES AUTO-SCROLL CAROUSEL ─── */}
      <section
        id="services"
        className="relative py-20 sm:py-24 overflow-hidden"
      >
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="relative z-10 max-w-none px-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <SectionHeading
              badge="Our Services"
              title="Comprehensive Financial Solutions"
              subtitle="From personal loans to business funding and insurance — explore our full range of financial products designed to help you achieve every goal."
            />
          </div>

          <div
            className="relative animate-on-scroll"
            onMouseEnter={() => {
              if (servicesAutoRef.current)
                clearInterval(servicesAutoRef.current);
            }}
            onMouseLeave={() => {
              startServicesAutoScroll();
            }}
          >
            <button
              type="button"
              onClick={() =>
                servicesScrollRef.current?.scrollBy({
                  left: -300,
                  behavior: "smooth",
                })
              }
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
              aria-label="Scroll services left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              ref={servicesScrollRef}
              className="overflow-x-auto flex gap-6 py-4 px-14 sm:px-16 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[...SERVICES, ...SERVICES].map((service, index) => (
                <ServiceCard key={`${service.id}-${index}`} service={service} />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                servicesScrollRef.current?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
              aria-label="Scroll services right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* <div className="text-center mt-10 animate-on-scroll max-w-7xl mx-auto px-4">
            <Link to="/services" className="btn-outline">
              View All Services
            </Link>
          </div> */}
        </div>
      </section>

      {/* ─── 4. WHY CHOOSE US ─── */}
      <section className="section-cream wave-divider-top relative py-20 sm:py-24 overflow-hidden">
        <WhyUsFloatingShapes />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Choose Us"
            title="Why Grow More Loan Consultancy?"
            subtitle="We go far beyond simply connecting you with banks. Our end-to-end consultancy ensures you receive expert guidance, competitive rates, and dedicated support at every stage of your financial journey."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPANDED_WHY_US.map((item, index) => (
              <div
                key={item.title}
                className="glass-card p-7 animate-on-scroll"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box icon-box-green mb-5">{item.icon}</div>
                <h3
                  className="text-xl font-bold text-[#1a1710] mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#5a5040] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. STATS SECTION ─── */}
      <section className="relative py-20 sm:py-24 bg-warm-dark">
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange)]/5 via-transparent to-[var(--green)]/5 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { ref: ref1, count: count1, suffix: "+", label: STATS[0].label },
              { ref: ref2, count: count2, suffix: "+", label: STATS[1].label },
              { ref: ref3, count: count3, suffix: "+", label: STATS[2].label },
              { ref: ref4, count: count4, suffix: "%", label: STATS[3].label },
            ].map((stat, index) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="glass-card p-8 text-center animate-on-scroll"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p
                  className="text-5xl md:text-6xl font-bold text-gradient-orange stat-glow mb-3 leading-none counter-animate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.count}
                  {stat.suffix}
                </p>
                <p className="text-[var(--text-secondary)] font-semibold text-sm sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ─── 6. HOW IT WORKS ─── */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="How It Works"
            title="Simple 5-Step Loan Process"
            subtitle="Our proven five-step methodology makes securing a loan straightforward, transparent, and stress-free — whether you need a personal loan or complex business financing."
          />

          <div className="hidden lg:block animate-on-scroll mb-12">
            <div className="relative h-2 bg-[var(--bg-card)] rounded-full">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[var(--green)] via-[var(--orange)] to-[var(--orange-light)] rounded-full opacity-30" />
            </div>
            <div className="flex justify-between mt-3">
              {EXPANDED_PROCESS.map((step) => (
                <span
                  key={step.step}
                  className="text-xs text-[var(--text-muted)] font-medium"
                >
                  Step {step.step}
                </span>
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
                        ? "bg-gradient-to-br from-[var(--green)] to-[#16A34A]"
                        : "bg-gradient-to-br from-[var(--orange)] to-[#EA580C]"
                    }`}
                  >
                    {step.step}
                  </div>
                  <div className="glass-card p-6 flex-grow">
                    <h3
                      className="text-xl font-bold text-white mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6b. BANK PARTNERS ─── */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-section-alt">
        <AnimatedBackground />
        <div className="relative z-10 max-w-none px-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <SectionHeading
              badge="Our Partners"
              title="Associated with Leading Banks & NBFCs"
              subtitle="We maintain strong relationships with India's top banks and NBFCs to secure the best rates and fastest approvals for our clients."
            />
          </div>

          <div
            className="relative animate-on-scroll"
            onMouseEnter={() => {
              if (partnerAutoRef.current) clearInterval(partnerAutoRef.current);
            }}
            onMouseLeave={() => {
              startPartnerAutoScroll();
            }}
          >
            <button
              type="button"
              onClick={() => {
                const container = partnersScrollRef.current;
                if (!container) return;
                container.scrollBy({ left: -300, behavior: "smooth" });
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
              aria-label="Scroll partners left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              ref={partnersScrollRef}
              className="overflow-x-auto flex gap-5 py-4 px-12 sm:px-14 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[...partners, ...partners, ...partners].map((partner, index) => {
                const logoUrl = partner.logo_url
                  ? getPartnerLogoUrl(partner.logo_url)
                  : "";
                const name = partner.name || "Partner";
                const hasRealLogo =
                  logoUrl &&
                  !logoUrl.includes("logo.clearbit.com") &&
                  !logoUrl.includes("s2/favicons");
                return (
                  <div
                    key={`${name}-${index}`}
                    className="partner-logo-card flex flex-col items-center gap-2"
                  >
                    {hasRealLogo ? (
                      <div className="flex items-center justify-center w-[72px] h-[48px] overflow-hidden">
                        <img
                          src={logoUrl}
                          alt={name}
                          loading="lazy"
                          className="max-h-[48px] max-w-[68px] object-contain"
                          onLoad={(e) => {
                            if (e.target.naturalWidth <= 2 || e.target.naturalHeight <= 2) {
                              e.target.parentNode.innerHTML = `<span class="text-lg font-bold text-[#F97316]">${name[0]}</span>`;
                            }
                          }}
                          onError={(e) => {
                            e.target.parentNode.innerHTML = `<span class="text-lg font-bold text-[#F97316]">${name[0]}</span>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F97316]/20 to-[#FBBF24]/10 border border-[#F97316]/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#F97316]">
                          {name[0]}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-bold text-[var(--text-primary)] text-center px-2 leading-tight">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                const container = partnersScrollRef.current;
                if (!container) return;
                container.scrollBy({ left: 300, behavior: "smooth" });
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
              aria-label="Scroll partners right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <GoogleReviews />

      {/* ─── 7. EMI CALCULATOR ─── */}
      <section className="section-cream wave-divider-top relative py-20 sm:py-24 overflow-hidden hero-parallax">
        <div
          className="hero-parallax-img"
          style={{ backgroundImage: `url(${EMI_BG_IMAGE})`, opacity: 0.12 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/8 via-transparent to-[#22C55E]/8 pointer-events-none z-[1]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Financial Calculator"
            title={
              <>
                Calculate Your <span className="text-gradient-orange">EMI</span>
              </>
            }
            subtitle="Plan your finances with confidence. Adjust the values below to instantly see how loan amount, interest rate, and tenure affect your monthly EMI and total repayment."
            light
          />

          <div className="animate-on-scroll">
            <EMICalculator
              defaultAmount={2500000}
              defaultRate={10.5}
              defaultTenure={15}
              amountMin={100000}
              amountMax={50000000}
              tenureMinYears={1}
              tenureMaxYears={30}
              className="premium-card border-t-4 border-t-[var(--orange)]"
            />
            <div className="text-center mt-8">
              <Link
                to="/emi-calculator"
                className="text-[#F97316] font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                Go to Full Calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. LOAN JOURNEY / TRUST ─── */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Trusted By Businesses"
            title="What Our Process Looks Like"
            subtitle="Transparency is at the core of everything we do. Here is exactly what you can expect when you choose Grow More for your loan needs."
          />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOAN_JOURNEY.map((item, index) => (
              <div
                key={item.step}
                className="premium-card p-7 animate-on-scroll relative overflow-visible"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--orange)] to-[#EA580C] flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                  {item.step}
                </div>
                <h3
                  className="text-xl font-bold text-[var(--text-primary)] mb-3 mt-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOAN_JOURNEY.map((item, index) => (
              <div key={item.step} className="relative pt-4">
                {/* Step Number */}
                <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--orange)] to-[#EA580C] flex items-center justify-center text-white font-bold text-sm shadow-lg z-20">
                  {item.step}
                </div>

                {/* Card */}
                <div
                  className="premium-card p-7 animate-on-scroll relative"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3
                    className="text-xl font-bold text-[var(--text-primary)] mb-3 mt-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. CTA SECTION ─── */}
      <section className="section-cream wave-divider-top relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6 inline-flex">
            ✦ Expert Financial Guidance
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1710] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Achieve Your{" "}
            <span className="text-gradient-orange">Financial Goals</span>?
          </h2>
          <p className="text-[#5a5040] text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            Take the first step toward financial freedom with personalized loan
            solutions crafted exclusively for your needs. Our expert advisors
            provide free consultations, fast approvals, and competitive rates
            from India&apos;s top banks.
          </p>
          <p className="text-[#9a8a6a] text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Join 450+ satisfied clients across Rajkot and Ahmedabad who trust
            Grow More for transparent, reliable, and results-driven financial
            consultancy. Your success is our mission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-orange w-full sm:w-auto"
              onClick={handleApply}
            >
              Get Free Consultation →
            </Link>
            <a
              href={`tel:+91${APPLY_PHONE}`}
              className="btn-outline w-full sm:w-auto"
              onClick={() => trackEvent("call_click", "engagement", "home_cta")}
            >
              Call: {APPLY_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ─── 10. CONTACT / MAP ─── */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <BackgroundObjects />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Visit Our Offices"
            title="Our Offices in Gujarat"
            subtitle="Visit us for a face-to-face consultation with our loan experts. We have offices in Rajkot and Ahmedabad for your convenience."
          />

          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-on-scroll">
            {COMPANY.offices.map((office, index) => (
              <button
                key={office.city}
                type="button"
                onClick={() => setActiveOffice(index)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeOffice === index
                    ? "bg-gradient-to-r from-[var(--orange)] to-[#EA580C] text-white shadow-lg shadow-[var(--orange)]/20"
                    : "glass-card text-[var(--text-primary)] hover:border-[var(--orange)]/30"
                }`}
              >
                {office.label}
              </button>
            ))}
          </div>

          <div className="glass-card overflow-hidden animate-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 sm:p-10">
                <div className="mb-8">
                  <h3
                    className="text-lg font-bold text-white mb-3 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="text-[var(--orange)]">📍</span>{" "}
                    {currentOffice.label}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {currentOffice.address}
                  </p>
                </div>

                <div className="mb-8">
                  <h3
                    className="text-lg font-bold text-white mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Contact Our Team
                  </h3>
                  <div className="space-y-4">
                    {TEAM.map((member) => (
                      <div
                        key={member.phone}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-subtle)]"
                      >
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {member.name}
                          </p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {member.role}
                          </p>
                        </div>
                        <a
                          href={`tel:+91${member.phone}`}
                          className="text-[#F97316] font-semibold text-sm hover:opacity-80 transition-opacity whitespace-nowrap"
                        >
                          📞 {member.phoneDisplay}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Working Hours
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Monday – Saturday:{" "}
                    <span className="text-[var(--text-primary)] font-medium">
                      10:00 AM – 7:00 PM
                    </span>
                  </p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="aspect-video lg:aspect-auto min-h-[300px] lg:min-h-full">
                <iframe
                  title={`Grow More Loan Consultancy — ${currentOffice.label}`}
                  src={currentOffice.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ─── 11. FAQ PREVIEW ─── */}
      <section className="section-cream wave-divider-top relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="FAQs"
            title="Frequently Asked Questions"
            subtitle="Quick answers to the most common questions about loans, eligibility, and our consultancy services in Rajkot and Ahmedabad."
            light
          />

          <div className="animate-on-scroll grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 items-start">
            <div className="space-y-3">
              {leftFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${openFaq === index ? "active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[#1a1710] pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`text-[var(--orange)] text-xl flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[#5a5040] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {rightFaqs.map((faq, index) => {
                const faqIndex = index + 6;
                return (
                  <div
                    key={faqIndex}
                    className={`faq-item ${openFaq === faqIndex ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(openFaq === faqIndex ? null : faqIndex)
                      }
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    >
                      <span className="text-sm sm:text-base font-semibold text-[#1a1710] pr-4">
                        {faq.q}
                      </span>
                      <span
                        className={`text-[var(--orange)] text-xl flex-shrink-0 transition-transform duration-300 ${
                          openFaq === faqIndex ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div className="faq-answer">
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[#5a5040] leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-10 animate-on-scroll">
            <Link
              to="/faq"
              className="text-[#F97316] font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
            >
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
