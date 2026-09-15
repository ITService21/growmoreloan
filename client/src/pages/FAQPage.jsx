import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import BLOG_ARTICLES from '../data/blogArticles';
import { COMPANY } from '../data/company';
import { getWhatsAppLink } from '../utils/helpers';
import { useScrollAnimationMulti } from '../utils/hooks';

const CATEGORIES = [
  'All',
  'General',
  'Personal Loan',
  'Business Loan',
  'Home Loan',
  'MSME',
  'Process',
];

const FAQ_DATA = [
  {
    category: 'General',
    q: 'What loan services does Grow More offer?',
    a: 'Grow More Loan Consultancy Group provides end-to-end guidance for Personal Loans, Business Loans, Machinery Loans, Cash Credit (CC), Overdraft (OD), MSME Loans, Home Loans, Mortgage Loans (LAP), Car Loans, and Insurance products. We act as your single point of contact — comparing offers from 15+ banks and NBFCs, preparing documentation, submitting applications, and following up until disbursement.',
  },
  {
    category: 'General',
    q: 'Is there a fee for your consultancy services?',
    a: 'Our initial consultation is completely free with absolutely no obligation to proceed. We earn through commissions from partner banks and NBFCs only when your loan is successfully disbursed — meaning our success is directly aligned with yours. There are no upfront consultancy charges, hidden fees, or surprise deductions at any stage.',
  },
  {
    category: 'General',
    q: 'How does the loan consultancy process work?',
    a: 'We begin with a free consultation to understand your financial needs, income profile, and goals. Our team then compares offers from multiple lenders to identify the best interest rates and terms for your situation. We guide you through document preparation, submit the application on your behalf, and maintain proactive follow-ups with the bank until approval and disbursement.',
  },
  {
    category: 'General',
    q: 'How long does the entire loan process take?',
    a: 'Timelines vary depending on the loan type, lender, and completeness of your documentation. Personal loans typically take 2–5 working days, business loans 3–7 days, home loans 7–15 days, and MSME scheme loans 5–10 days with complete paperwork. Our streamlined process and established bank relationships often reduce these timelines compared to applying directly.',
  },
  {
    category: 'General',
    q: 'Which banks and NBFCs do you partner with?',
    a: 'We maintain active partnerships with 15+ leading financial institutions including State Bank of India, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Bank of Baroda, Bajaj Finserv, Tata Capital, and LIC Housing Finance among others. This wide network allows us to compare multiple offers simultaneously and negotiate competitive terms on your behalf.',
  },
  {
    category: 'General',
    q: 'What happens during the free consultation?',
    a: 'During your free consultation, one of our loan advisors reviews your financial requirements, employment or business profile, existing liabilities, and credit history. We assess your eligibility across multiple loan products and provide honest recommendations — including advising against a loan if it is not in your best interest. There is no pressure to proceed.',
  },
  {
    category: 'Personal Loan',
    q: 'What is the eligibility criteria for a personal loan?',
    a: 'Most lenders require applicants to be Indian citizens aged 21–58 years with a minimum monthly income of ₹15,000. Salaried professionals typically need at least one year of stable employment, while self-employed individuals may require two or more years of business vintage. A credit score of 650 or above is generally preferred.',
  },
  {
    category: 'Personal Loan',
    q: 'What is the maximum personal loan amount I can get?',
    a: 'The maximum personal loan amount depends on your net monthly income, credit score, employment stability, and existing financial obligations. Most lenders offer up to 10–15 times your monthly salary, with an overall cap of around ₹25 lakh for salaried professionals. We evaluate your complete profile and suggest lenders most likely to offer the highest sanction.',
  },
  {
    category: 'Personal Loan',
    q: 'Can I prepay or foreclose my personal loan early?',
    a: 'Yes, most lenders allow part prepayment or full foreclosure after an initial lock-in period of 6–12 months from disbursement. Some lenders charge a prepayment penalty of 2–4% on the outstanding amount, while others offer zero-charge prepayment after a certain number of EMIs.',
  },
  {
    category: 'Personal Loan',
    q: 'What documents are required for a personal loan?',
    a: 'Salaried applicants typically need PAN Card, Aadhaar Card, last 3 months salary slips, last 6 months bank statements, Form 16 or IT Returns, and address proof. Self-employed applicants require PAN, Aadhaar, last 2 years IT Returns, 6–12 months bank statements, business proof, and address proof.',
  },
  {
    category: 'Business Loan',
    q: 'Can a new or startup business get a loan?',
    a: 'Most conventional business loans require a minimum vintage of 2 years with positive profitability. However, we have options for businesses with 1+ year of operations under government schemes like Mudra, PMEGP, and Stand-Up India. Our MSME specialists guide you through government-backed programs designed for new and growing businesses.',
  },
  {
    category: 'Business Loan',
    q: 'Is collateral required for a business loan?',
    a: 'For unsecured business loans up to ₹25 lakh, collateral-free options are available under the CGTMSE credit guarantee scheme for eligible MSMEs. Loans above this threshold typically require collateral in the form of residential or commercial property, fixed deposits, or business assets.',
  },
  {
    category: 'Business Loan',
    q: 'How long does business loan approval take?',
    a: 'With complete and accurate documentation, business loan approval typically takes 3–5 working days for unsecured products and 7–10 days for secured loans requiring property valuation. Disbursement follows within 2–3 working days after sanction.',
  },
  {
    category: 'Business Loan',
    q: 'What turnover is required for a business loan?',
    a: 'Most lenders require a minimum annual turnover of ₹10 lakh for unsecured business loans, though this varies by loan amount and lender policy. Higher loan amounts above ₹25 lakh typically require turnovers of ₹25 lakh or more with audited financial statements.',
  },
  {
    category: 'Home Loan',
    q: 'What is the maximum Loan-to-Value (LTV) ratio for home loans?',
    a: 'Banks generally finance 75–90% of the property\'s registered value as a home loan, depending on the loan amount, property type, and location. For loans up to ₹30 lakh, up to 90% LTV may be available for properties in approved projects.',
  },
  {
    category: 'Home Loan',
    q: 'What tax benefits are available on home loans?',
    a: 'Home loan borrowers can claim up to ₹1.5 lakh deduction on principal repayment under Section 80C and up to ₹2 lakh on interest paid under Section 24(b) for self-occupied properties each financial year. First-time buyers of affordable housing may qualify for an additional ₹1.5 lakh interest deduction under Section 80EEA.',
  },
  {
    category: 'Home Loan',
    q: 'Should I choose a fixed or floating interest rate?',
    a: 'Floating interest rates are linked to external benchmarks and typically start 0.5–1.5% lower than fixed rates at the time of sanction. Fixed rates provide EMI certainty but are usually priced higher. For most borrowers with 15–20 year tenures, floating rates tend to be more economical over the full loan life.',
  },
  {
    category: 'Home Loan',
    q: 'How does home loan balance transfer work?',
    a: 'Balance transfer allows you to move your existing home loan to a new lender offering a lower interest rate, potentially saving lakhs over the remaining tenure. We specialise in balance transfers for Rajkot and Ahmedabad homeowners and provide free savings calculations.',
  },
  {
    category: 'MSME',
    q: 'What is Udyam Registration and do I need it?',
    a: 'Udyam Registration is the Government of India\'s free, online registration system for Micro, Small, and Medium Enterprises. It is required to access MSME loan benefits, government subsidies, priority sector lending, and participation in many tender processes. We provide free Udyam registration assistance to our loan consultancy clients.',
  },
  {
    category: 'MSME',
    q: 'What is the CGTMSE scheme for MSME loans?',
    a: 'The Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) provides credit guarantee cover to banks, enabling them to lend to MSMEs without requiring traditional collateral. Under this scheme, eligible micro and small enterprises can access collateral-free loans up to ₹1 crore.',
  },
  {
    category: 'MSME',
    q: 'Are there government subsidies available for MSME loans?',
    a: 'Yes, several central and state government schemes offer interest subsidies, capital subsidies, and margin money assistance for MSME borrowers. PMEGP provides subsidised loans for new micro enterprises, CLCSS offers capital subsidy on approved machinery, and Gujarat state policies announce sector-specific incentives.',
  },
  {
    category: 'MSME',
    q: 'Can a newly registered MSME get a loan?',
    a: 'Yes, several schemes specifically target new and startup MSMEs. PMEGP supports new micro enterprises with margin money subsidy. Mudra loans under the Shishu category offer up to ₹50,000 for micro units. Stand-Up India provides loans for women and SC/ST entrepreneurs starting greenfield projects.',
  },
  {
    category: 'Process',
    q: 'What is the complete document checklist for loan applications?',
    a: 'While specific requirements vary by loan type, common documents include PAN Card, Aadhaar Card, passport-size photographs, and address proof for all applicants. Salaried individuals additionally need salary slips, bank statements, and Form 16 or IT Returns. Business owners require GST registration, business proof, IT Returns, and current account statements.',
  },
  {
    category: 'Process',
    q: 'What are the step-by-step application stages?',
    a: 'Our five-step process begins with a free consultation where we understand your needs and assess eligibility. Step two involves document collection and preparation. In step three, we compare offers from multiple banks. Step four covers application submission, bank verification, and our proactive follow-ups until sanction. Step five is loan disbursement with post-disbursement support.',
  },
  {
    category: 'Process',
    q: 'What is the typical timeline from application to disbursement?',
    a: 'Personal loans typically disburse within 2–5 working days, business loans within 3–7 days, car loans within 1–3 days, and home loans within 7–15 days after property verification. MSME scheme loans may take 5–10 days depending on guarantee processing. Our pre-submission review process catches documentation issues early to avoid delays.',
  },
  {
    category: 'General',
    q: 'How does Grow More help compared to applying directly to a bank?',
    a: `We compare offers from 15+ banks, negotiate better rates, handle documentation, follow up with lenders, and provide end-to-end support — all at no extra cost to you. Our ${COMPANY.experience} years of experience and ${COMPANY.clients} satisfied clients reflect the value we deliver beyond what a single bank can offer.`,
  },
  {
    category: 'General',
    q: 'Do you have offices in both Rajkot and Ahmedabad?',
    a: 'Yes, we have two office locations — our Rajkot office on Gondal Road and our Ahmedabad office near Vastral Gam Metro Station on SP Ring Road. You can visit either location for in-person consultations, or complete the entire process remotely via phone and WhatsApp.',
  },
];

const RELATED_BLOG_IDS = [
  'how-to-get-personal-loan-in-rajkot',
  'home-loan-guide-first-time-buyers',
  'msme-loan-schemes-gujarat-2026',
];

function SectionBgObjects({ variant }) {
  const configs = {
    hero: [
      { cls: 'obj-orange geo-float-1', style: { top: '10%', right: '-5%' } },
      { cls: 'obj-green geo-float-3', style: { bottom: '15%', left: '-8%' } },
    ],
    faq: [
      { cls: 'obj-green geo-float-4', style: { top: '8%', left: '-6%' } },
      { cls: 'obj-orange geo-float-2', style: { bottom: '10%', right: '-4%' } },
      { cls: 'obj-gold geo-float-5', style: { top: '50%', right: '10%' } },
    ],
    blog: [
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

export default function FAQPage() {
  useScrollAnimationMulti();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = `FAQs | ${COMPANY.name}`;
    return () => {
      document.title = 'Grow More Loan Consultancy Group';
    };
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const relatedArticles = BLOG_ARTICLES.filter((a) => RELATED_BLOG_IDS.includes(a.id));

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenIndex(null);
  };

  return (
    <main className="bg-rich-dark">
      {/* Hero — dark */}
      <section className="relative pt-28 pb-20 sm:pb-24 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <SectionBgObjects variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <span className="section-badge mb-6">✦ FAQs</span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              Find detailed answers to common questions about loans, eligibility, documentation, government
              schemes, and our consultancy process. With {COMPANY.experience} years of experience and{' '}
              {COMPANY.clients} happy clients — our Rajkot and Ahmedabad experts are just a call away.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Search + Tabs — cream */}
      <section className="section-cream relative py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-2xl mx-auto mb-8">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search FAQs by keyword..."
              className="form-input text-base"
              aria-label="Search FAQs"
            />
          </div>

          <div className="animate-on-scroll flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10'
                    : 'border-black/8 bg-white/80 text-[#5a5040] hover:border-[#F97316]/30 hover:text-[#1a1710]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-center text-[#9a8a6a] text-sm mt-6 animate-on-scroll">
            {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      {/* FAQ List — dark, 2 columns */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="faq" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="animate-on-scroll text-center py-12">
              <p className="text-[var(--text-secondary)] text-lg">No FAQs found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[#F97316] font-semibold mt-4 hover:text-[#FBBF24] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="animate-on-scroll grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={`${faq.category}-${faq.q}`}
                  className={`faq-item ${openIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    aria-expanded={openIndex === index}
                  >
                    <div className="pr-4">
                      <span className="text-xs text-[#F97316] font-semibold uppercase tracking-wide block mb-1.5">
                        {faq.category}
                      </span>
                      <span
                        className="text-sm sm:text-base font-semibold text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={`text-[#F97316] text-2xl flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Questions — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6 inline-flex">✦ Need Help?</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a1710] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Still Have <span className="text-gradient-orange">Questions</span>?
          </h2>
          <p className="text-[#5a5040] text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            Our loan experts in Rajkot and Ahmedabad are ready to provide personalised guidance on your
            specific financial situation. Every consultation is free, confidential, and tailored to your profile.
          </p>
          <p className="text-[#9a8a6a] text-sm mb-8">
            📧 {COMPANY.email} &nbsp;|&nbsp; 📍 Rajkot &amp; Ahmedabad
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-orange">Contact Us</Link>
            <a
              href={getWhatsAppLink('Hi, I have a question about loan services. Please assist.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Blog Links — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="blog" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="From Our Blog"
            title="Related Articles"
            subtitle="Dive deeper into loan guides and financial insights written by our consultancy team."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedArticles.map((article, index) => (
              <article
                key={article.id}
                className="animate-on-scroll premium-card p-6 flex flex-col"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  {article.categoryName}
                </span>
                <h3
                  className="text-lg font-bold text-[var(--text-primary)] mb-3 leading-snug line-clamp-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {article.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                <Link
                  to={`/blog/${article.id}`}
                  className="text-sm font-semibold text-[#F97316] hover:text-[#FBBF24] transition-colors mt-auto"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>

          <div className="animate-on-scroll text-center mt-10">
            <Link to="/blog" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
