import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import SectionHeading from "../components/SectionHeading";
import GoogleReviews from "../components/GoogleReviews";
import { COMPANY, TEAM, WHY_US, PROCESS_STEPS } from "../data/company";
import { getWhatsAppLink, trackEvent, getPartnerLogoUrl } from "../utils/helpers";
import { useScrollAnimationMulti, useCountUp } from "../utils/hooks";

const ABOUT_FEATURES = [
  `Expert Financial Advisors with ${COMPANY.experience} Years Experience`,
  "Customized Loan Solutions for Every Profile",
  "Transparent & Competitive Interest Rates",
  "Wide Network of 15+ Bank & NBFC Partners",
];

const TEAM_BIOS = {
  "Meet Patel":
    "A visionary leader with deep expertise in financial services, Meet founded Grow More with a mission to make loan access simple and transparent for every Rajkot and Ahmedabad resident. His hands-on approach ensures every client receives personalised attention and honest guidance tailored to their unique financial situation.",
  "Viraj Bhadak":
    "As Co-Founder, Viraj drives strategic growth and partnerships with leading banks and NBFCs across Gujarat. He ensures our clients always get the most competitive offers available in the market and maintains strong relationships with lender officials to expedite approvals and negotiate better terms.",
  "Jigar Padhariya":
    "As Managing Director, Jigar leads client relationships at Grow More with warmth, dedication, and exceptional communication skills. He ensures each client feels supported and informed from the first consultation through final disbursement — and remains available for any post-loan queries or future financial needs.",
};

const CORE_VALUES = [
  {
    title: "Transparency",
    icon: "🔍",
    description:
      "Trust is the cornerstone of every financial relationship, and we never compromise on honesty. From your very first consultation, we provide a complete breakdown of interest rates, processing fees, prepayment terms, and all applicable charges — with absolutely no hidden costs or surprise deductions.",
  },
  {
    title: "Client-First Approach",
    icon: "❤️",
    description:
      "Your financial goals, constraints, and aspirations always come first — not the lender's sales targets or our commission structures. We take time to understand your complete financial picture before recommending any product. If a particular loan is not right for you, we say so honestly and suggest alternatives.",
  },
  {
    title: "Financial Expertise",
    icon: "💡",
    description: `With over ${COMPANY.experience} years of specialised experience across personal loans, business funding, home financing, MSME schemes, and insurance products, our team brings deep, practical knowledge of the Rajkot and Gujarat financial landscape.`,
  },
  {
    title: "Trust & Reliability",
    icon: "🤝",
    description: `Our reputation is built on delivering results and keeping our promises. With ${COMPANY.clients} happy clients and a growing referral network across Rajkot and Ahmedabad, we measure success by lasting relationships rather than transaction volume.`,
  },
];

const EXPANDED_WHY_US = WHY_US.map((item, i) => {
  const extras = [
    `Our seasoned financial advisors bring over ${COMPANY.experience} years of hands-on experience in the Rajkot and Ahmedabad loan market. We take time to understand your unique financial situation before recommending the perfect loan product.`,
    "Time is money, especially when you need funds urgently. Our streamlined documentation process and established bank relationships mean faster approvals and quicker disbursements.",
    "We maintain partnerships with 15+ leading banks and NBFCs across India, giving us the leverage to negotiate the most competitive interest rates on your behalf.",
    "Trust is the foundation of every financial relationship. From the very first consultation, we provide a clear breakdown of all charges, processing fees, and terms — with absolutely no hidden costs.",
    "Every client at Grow More is assigned a dedicated relationship manager who serves as your single point of contact throughout the loan journey.",
    `Our growing family of ${COMPANY.clients} satisfied clients across Rajkot and Ahmedabad is a testament to our unwavering commitment to service excellence.`,
  ];
  return { ...item, description: extras[i] || item.description };
});

const EXPANDED_PROCESS = PROCESS_STEPS.map((step) => {
  const expansions = {
    1: "During your free consultation, our expert advisors sit down with you to understand your financial requirements, income sources, existing liabilities, and future goals. We assess your eligibility across multiple loan products and provide honest recommendations on the best options available.",
    2: "Once you decide to proceed, our team provides a comprehensive checklist of required documents tailored to your loan type and employment profile. We review your paperwork for completeness and accuracy before submission.",
    3: "Leveraging our extensive network of banking partners, we simultaneously compare offers from multiple lenders to identify the best interest rates, tenure options, and terms for your profile.",
    4: "Our team manages the entire application lifecycle — from submission and verification to credit appraisal and sanction. We maintain regular follow-ups with bank officials and keep you updated at every milestone.",
    5: "Upon loan approval, we coordinate the disbursement process to ensure funds reach your account as quickly as possible. Even after disbursement, we remain available for any queries regarding repayments or top-up loans.",
  };
  return { ...step, description: expansions[step.step] };
});

const BANK_PARTNER_LOGOS = [
  { name: "State Bank of India", url: "https://logo.clearbit.com/sbi.co.in" },
  { name: "HDFC Bank", url: "https://logo.clearbit.com/hdfcbank.com" },
  { name: "ICICI Bank", url: "https://logo.clearbit.com/icicibank.com" },
  { name: "Axis Bank", url: "https://logo.clearbit.com/axisbank.com" },
  {
    name: "Bank of Baroda",
    url: "https://logo.clearbit.com/bankofbaroda.co.in",
  },
  { name: "Punjab National Bank", url: "https://logo.clearbit.com/pnb.co.in" },
  { name: "Kotak Mahindra Bank", url: "https://logo.clearbit.com/kotak.com" },
  { name: "IndusInd Bank", url: "https://logo.clearbit.com/indusind.com" },
  { name: "Yes Bank", url: "https://logo.clearbit.com/yesbank.in" },
  {
    name: "IDFC First Bank",
    url: "https://logo.clearbit.com/idfcfirstbank.com",
  },
  { name: "Bajaj Finserv", url: "https://logo.clearbit.com/bajajfinserv.in" },
  { name: "Tata Capital", url: "https://logo.clearbit.com/tatacapital.com" },
  {
    name: "Mahindra Finance",
    url: "https://logo.clearbit.com/mahindrafinance.com",
  },
  {
    name: "LIC Housing Finance",
    url: "https://logo.clearbit.com/lichousing.com",
  },
  {
    name: "Aditya Birla Capital",
    url: "https://logo.clearbit.com/adityabirlacapital.com",
  },
];

const FALLBACK_PARTNERS = BANK_PARTNER_LOGOS.map((p) => ({
  name: p.name,
  logo_url: p.url,
  website: p.url.replace('https://logo.clearbit.com/', 'https://'),
}));

const SECTION_IMAGES = {
  story: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
  values: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
};

function SectionBgObjects({ variant }) {
  const configs = {
    mission: [
      { cls: "obj-orange geo-float-1", style: { top: "10%", right: "-5%" } },
      { cls: "obj-green geo-float-3", style: { bottom: "15%", left: "-8%" } },
    ],
    values: [
      { cls: "obj-green geo-float-4", style: { top: "8%", left: "-6%" } },
      { cls: "obj-orange geo-float-2", style: { bottom: "10%", right: "-4%" } },
      { cls: "obj-gold geo-float-5", style: { top: "50%", right: "10%" } },
    ],
    why: [
      { cls: "obj-orange geo-float-3", style: { top: "12%", right: "5%" } },
      { cls: "obj-green geo-float-1", style: { bottom: "20%", left: "-10%" } },
    ],
    network: [
      { cls: "obj-green geo-float-2", style: { top: "5%", right: "-7%" } },
      { cls: "obj-orange geo-float-4", style: { bottom: "12%", left: "3%" } },
      { cls: "obj-gold geo-float-6", style: { top: "40%", left: "30%" } },
    ],
  };
  const items = configs[variant] || configs.mission;
  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className={`bg-object-large ${item.cls}`}
          style={item.style}
        />
      ))}
    </>
  );
}

function ProfileAvatar({ color, size = 80 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg border-2 border-white/20"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[45%] h-[45%] text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  useScrollAnimationMulti();

  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const partnersScrollRef = useRef(null);

  const [ref1, count1] = useCountUp(7, 2000);
  const [ref2, count2] = useCountUp(450, 2000);
  const [ref3, count3] = useCountUp(10, 2000);
  const [ref4, count4] = useCountUp(100, 2000);

  const animatedStats = [
    {
      ref: ref1,
      count: count1,
      suffix: "+",
      label: "Years Experience",
      icon: "📅",
    },
    {
      ref: ref2,
      count: count2,
      suffix: "+",
      label: "Happy Clients",
      icon: "😊",
    },
    {
      ref: ref3,
      count: count3,
      suffix: "+",
      label: "Loan Services",
      icon: "📋",
    },
    {
      ref: ref4,
      count: count4,
      suffix: "%",
      label: "Dedicated Support",
      icon: "🤝",
    },
  ];

  useEffect(() => {
    document.title = `About Us | ${COMPANY.name}`;
    return () => {
      document.title = "Grow More Loan Consultancy Group";
    };
  }, []);

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

  return (
    <main className="bg-rich-dark">
      {/* Hero — dark */}
      <section className="relative pt-28 pb-20 sm:pb-24 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <SectionBgObjects variant="mission" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <span className="section-badge mb-8">✦ About Us</span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Trusted Partner for{" "}
              <span className="text-gradient-orange">All Financial Needs</span>
            </h1>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#22C55E] mb-6 mx-auto" />
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {COMPANY.name} empowers individuals, entrepreneurs, and MSMEs
              across Rajkot &amp; Ahmedabad with personalised financial
              solutions. With {COMPANY.experience} years of expertise,{" "}
              {COMPANY.clients} satisfied clients, and partnerships with 15+
              leading banks — we deliver the best interest rates, fastest
              approvals, and unwavering support. {COMPANY.slogan}.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Story — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Story"
            title="Built on Passion, Driven by Results"
            subtitle="From a small team in Rajkot to a trusted name across Gujarat — here's how Grow More became the consultancy clients rely on."
            light
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-on-scroll">
              <p className="text-[#5a5040] leading-relaxed mb-5">
                {COMPANY.name} was founded with a clear vision — to simplify the
                loan process for individuals and businesses across Rajkot and
                Ahmedabad. What began as a passionate team operating from
                Darshan Complex on Gondal Road has grown into a trusted
                consultancy serving {COMPANY.clients} happy clients over{" "}
                {COMPANY.experience} years.
              </p>
              <p className="text-[#5a5040] leading-relaxed mb-5">
                Our founders witnessed firsthand how confusing loan applications
                could be — hidden charges, endless paperwork, and timelines that
                stretched without updates. They set out to change that with
                transparent, end-to-end loan consultancy that puts clients first
                at every stage.
              </p>
              <p className="text-[#5a5040] leading-relaxed mb-5">
                Today, we partner with 15+ banks and NBFCs to offer personal
                loans, business loans, home loans, MSME schemes, machinery
                financing, cash credit, overdraft, car loans, mortgage loans,
                and insurance solutions — always subject to bank policies and
                eligibility criteria.
              </p>
              <p className="text-[#5a5040] leading-relaxed mb-8">
                Our mission remains unchanged: make financial growth accessible
                to everyone across our two office locations in Rajkot and
                Ahmedabad.
              </p>
              <ul className="space-y-3">
                {ABOUT_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-[#1a1710]"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--green)]/15 flex items-center justify-center text-[var(--green)] text-sm">
                      ✓
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="animate-on-scroll relative"
              style={{ transitionDelay: "150ms" }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-black/6">
                  <img
                    src={SECTION_IMAGES.story}
                    alt="Grow More team at work"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1710]/90 via-[#1a1710]/20 to-transparent" />
                  <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none" />
                  <div className="absolute top-6 right- 6 glass-card px-4 py-2">
                    <span className="text-sm font-bold text-[var(--orange)]">
                      {COMPANY.experience} Years
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-28 bg-gradient-to-t from-[#1a1710]/80 via-[#1a1710]/25 to-transparent">
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-28">
  <p
    className="text-2xl font-bold mb-1"
    style={{
      fontFamily: "var(--font-display)",
      background: "linear-gradient(90deg, #fb923c, #ea580c, #c2410c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    {COMPANY.experience} Years of Excellence
  </p>

  <p
    className="text-sm"
    style={{
      color: "#fed7aa",
    }}
  >
    Serving Rajkot & Ahmedabad with pride
  </p>
</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="glass-card p-5 aspect-square flex flex-col items-center justify-center text-center">
                  <span className="text-3xl mb-2">🏆</span>
                  <p className="text-sm font-semibold text-[#1a1710]">
                    Trusted Consultancy
                  </p>
                </div>
                <div className="glass-card p-5 aspect-square flex flex-col items-center justify-center text-center">
                  <span className="text-3xl mb-2">🤝</span>
                  <p className="text-sm font-semibold text-[#1a1710]">
                    {COMPANY.clients} Happy Clients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="mission" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Purpose" title="Our Mission & Vision" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="animate-on-scroll premium-card p-8 sm:p-10">
              <div className="icon-box mb-6">🎯</div>
              <h3
                className="text-2xl font-bold text-[var(--text-primary)] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Mission
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To provide transparent, hassle-free loan consultancy services
                with the best interest rates available — guiding every client
                from first consultation to final disbursement with honesty,
                expertise, and a genuine commitment to their financial success.
              </p>
            </div>

            <div
              className="animate-on-scroll premium-card p-8 sm:p-10"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="icon-box icon-box-green mb-6">🚀</div>
              <h3
                className="text-2xl font-bold text-[var(--text-primary)] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Vision
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To be Gujarat&apos;s most trusted loan consultancy partner for
                every financial milestone — with offices in Rajkot and Ahmedabad
                serving clients across the state with excellence and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Team"
            title="Meet the Experts Behind Grow More"
            subtitle="Dedicated professionals committed to your financial success — available by phone, WhatsApp, and in-person at our Rajkot and Ahmedabad offices."
            light
          />

          <div className="animate-on-scroll mb-12 rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <img
              src={SECTION_IMAGES.team}
              alt="Team collaboration at Grow More"
              className="w-full h-48 sm:h-64 object-cover"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TEAM.map((member, index) => (
              <div
                key={member.name}
                className="animate-on-scroll premium-card p-8 text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProfileAvatar color={member.color} />
                <h3
                  className="text-xl font-bold text-[#1a1710] mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {member.name}
                </h3>
                <p className="text-[#F97316] text-sm font-semibold mb-4">
                  {member.role}
                </p>
                <a
                  href={`tel:+91${member.phone}`}
                  className="text-[#5a5040] hover:text-[#F97316] text-sm transition-colors inline-block mb-3"
                  onClick={() =>
                    trackEvent(
                      "call_click",
                      "engagement",
                      `about_team_${member.name}`,
                    )
                  }
                >
                  📞 {member.phoneDisplay}
                </a>
                <div className="mb-5">
                  <a
                    href={getWhatsAppLink(
                      `Hi ${member.name}, I'd like to discuss my financial requirements with Grow More Loan Consultancy.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] font-semibold text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                    onClick={() =>
                      trackEvent(
                        "whatsapp_click",
                        "engagement",
                        `about_team_${member.name}`,
                      )
                    }
                  >
                    WhatsApp →
                  </a>
                </div>
                <p className="text-[#5a5040] text-sm leading-relaxed">
                  {TEAM_BIOS[member.name]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="values" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Values"
            title="Our Core Values"
            subtitle="The principles that guide every consultation, every recommendation, and every relationship we build."
          />

          <div className="animate-on-scroll mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]">
              <img
                src={SECTION_IMAGES.values}
                alt="Handshake symbolizing trust"
                className="w-full h-56 sm:h-72 object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              At {COMPANY.shortName}, every decision is guided by integrity and
              a genuine commitment to your financial wellbeing. Trust isn&apos;t
              just our slogan — it&apos;s how we operate every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((value, index) => (
              <div
                key={value.title}
                className="animate-on-scroll premium-card p-7"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mb-5">{value.icon}</div>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)] mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="By the Numbers"
            title="Grow More in Numbers"
            subtitle="Our track record speaks to our commitment — real results for real people across Rajkot and Ahmedabad."
            light
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {animatedStats.map((stat, index) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="animate-on-scroll glass-card p-8 sm:p-10 text-center counter-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-3xl mb-4 block">{stat.icon}</span>
                <p
                  className="text-5xl sm:text-6xl font-bold text-gradient-orange stat-glow mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.count}
                  {stat.suffix}
                </p>
                <p className="text-[#5a5040] font-semibold text-sm sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="why" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Choose Us"
            title="Why Grow More Loan Consultancy?"
            subtitle="We go far beyond simply connecting you with banks — our end-to-end consultancy ensures expert guidance, competitive rates, and dedicated support at every stage."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPANDED_WHY_US.map((item, index) => (
              <div
                key={item.title}
                className="animate-on-scroll premium-card p-7"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="icon-box mb-5">{item.icon}</div>
                <h3
                  className="text-xl font-bold text-[var(--text-primary)] mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Process"
            title="Simple 5-Step Loan Process"
            subtitle="Our proven methodology makes securing a loan straightforward, transparent, and stress-free."
            light
          />

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
                    className={`relative z-10 flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      index % 2 === 0
                        ? "bg-gradient-to-br from-[var(--green)] to-[#16A34A]"
                        : "bg-gradient-to-br from-[var(--orange)] to-[#EA580C]"
                    }`}
                  >
                    {step.step}
                  </div>
                  <div className="glass-card p-6 flex-grow">
                    <h3
                      className="text-xl font-bold text-[#1a1710] mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#5a5040] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="network" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Network"
            title="Associated with Leading Banks and NBFCs"
            subtitle="Our partnerships with 15+ banking institutions give us the leverage to find the best rates, fastest approvals, and most suitable products for your profile."
          />

          <div className="animate-on-scroll glass-card p-8 sm:p-12 mb-8">
            <p className="text-[var(--text-secondary)] leading-relaxed text-center max-w-3xl mx-auto mb-10">
              Grow More maintains active tie-ups with India&apos;s leading
              public sector banks, private banks, housing finance companies, and
              NBFCs — with offices in Rajkot and Ahmedabad to serve you across
              Gujarat.
            </p>

            <div className="relative mb-10 -mx-2 sm:-mx-4">
              <button
                type="button"
                onClick={() => partnersScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
                aria-label="Scroll partners left"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div
                ref={partnersScrollRef}
                className="overflow-x-auto flex gap-8 py-4 px-14 sm:px-16 items-center scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...partners, ...partners].map((partner, index) => {
                  const domain =
                    (partner.website || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0] ||
                    partner.logo_url?.replace(/^https?:\/\/logo\.clearbit\.com\//, '');
                  const logoUrl = partner.logo_url
                    ? getPartnerLogoUrl(partner.logo_url)
                    : domain
                      ? `https://logo.clearbit.com/${domain}`
                      : '';
                  const name = partner.name || domain;
                  return (
                    <div key={`${name}-${index}`} className="partner-logo-card">
                      <img
                        src={logoUrl}
                        alt={name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.insertAdjacentHTML(
                            'beforeend',
                            `<span class="text-xs font-semibold text-[var(--text-primary)] text-center px-2">${name}</span>`
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => partnersScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0c0c0c]/90 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center hover:bg-[#F97316]/10 transition-all"
                aria-label="Scroll partners right"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--border-subtle)]">
              {COMPANY.offices.map((office) => (
                <div key={office.city} className="glow-card p-6">
                  <h3
                    className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="text-[var(--orange)]">📍</span>{" "}
                    {office.label}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {office.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GoogleReviews light className="section-cream wave-divider-top" />

      {/* CTA — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6">✦ Get in Touch</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1710] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let&apos;s Discuss Your{" "}
            <span className="text-gradient-orange">Financial Goals</span>
          </h2>
          <p className="text-[#5a5040] text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Ready to take the next step? Our team is here to help you find the
            right loan solution — with a free consultation, honest eligibility
            assessment, and dedicated support from start to finish.
          </p>
          <p className="text-[#9a8a6a] text-sm mb-10">
            📧 {COMPANY.email} &nbsp;|&nbsp; Offices in Rajkot &amp; Ahmedabad
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-orange w-full sm:w-auto">
              Contact Us Today →
            </Link>
            <a
              href={getWhatsAppLink(
                `Hi, I'd like to discuss my financial goals with ${COMPANY.shortName} Loan Consultancy.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto text-center"
              onClick={() =>
                trackEvent("whatsapp_click", "engagement", "about_cta")
              }
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
