import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import { COMPANY } from '../data/company';
import { useScrollAnimationMulti } from '../utils/hooks';

const SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: (
      <>
        <p>
          By accessing or using the website and services of {COMPANY.name}, you agree to be bound by these
          Terms and Conditions. If you do not agree with any part of these terms, please do not use our
          website or services.
        </p>
        <p className="mt-4">
          These terms apply to all visitors, users, and clients who access our website, submit enquiry forms,
          or engage our loan consultancy services in Rajkot, Ahmedabad, or remotely.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'services',
    title: 'Services Description',
    content: (
      <>
        <p>
          {COMPANY.name} provides loan consultancy and facilitation services. We help clients identify
          suitable loan products, prepare documentation, submit applications to partner banks and NBFCs,
          and follow up on processing until disbursement.
        </p>
        <p className="mt-4">
          Our services include but are not limited to: Personal Loans, Business Loans, Home Loans, Mortgage
          Loans (LAP), MSME Loans, Machinery Loans, Cash Credit, Overdraft facilities, Car Loans, and
          Insurance product guidance.
        </p>
        <div className="mt-6 p-4 rounded-xl bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.15)]">
          <p className="font-semibold text-[#F97316]">
            Important Disclaimer: We are loan consultants, not lenders. Loan approval is subject to bank/NBFC
            policies and applicant eligibility. We do not guarantee loan approval or specific interest rates.
          </p>
        </div>
      </>
    ),
    dark: false,
  },
  {
    id: 'eligibility',
    title: 'User Eligibility',
    content: (
      <>
        <p>To use our services, you must:</p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Be at least 18 years of age and a resident of India</li>
          <li>Provide accurate, complete, and truthful information during consultations and applications</li>
          <li>Have the legal capacity to enter into binding agreements</li>
          <li>Not use our services for any unlawful, fraudulent, or misleading purpose</li>
        </ul>
      </>
    ),
    dark: true,
  },
  {
    id: 'loan-facilitation',
    title: 'Loan Facilitation',
    content: (
      <>
        <p>
          Our role is limited to advisory and facilitation. We compare offers from multiple partner lenders,
          assist with documentation, and coordinate the application process. The final decision on loan approval,
          sanctioned amount, interest rate, tenure, and terms rests solely with the respective bank or NBFC.
        </p>
        <p className="mt-4">
          We may receive commissions or referral fees from partner lenders upon successful loan disbursement.
          This does not increase the cost to you — our consultancy fee structure is transparent and discussed
          during your initial consultation.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'no-guarantee',
    title: 'No Guarantee',
    content: (
      <>
        <p>
          While we leverage our experience and banking relationships to maximise your chances of approval,
          we make no guarantees regarding:
        </p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Loan approval or sanction amount</li>
          <li>Specific interest rates, processing fees, or EMI amounts</li>
          <li>Processing timelines (which depend on lender policies and document completeness)</li>
          <li>Eligibility for government schemes or subsidies</li>
        </ul>
        <p className="mt-4">
          Interest rates mentioned on our website or during consultations are indicative and subject to change
          based on market conditions, RBI guidelines, and individual credit profiles.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'fees',
    title: 'Fees & Charges',
    content: (
      <>
        <p>
          Initial consultations with {COMPANY.shortName} are free of charge with no obligation to proceed.
          We primarily earn through commissions from partner banks and NBFCs upon successful loan disbursement.
        </p>
        <p className="mt-4">
          Any applicable processing fees, stamp duty, legal charges, or other costs levied by the lender
          will be communicated to you before you commit to a loan product. We maintain full transparency
          regarding all fees involved in the loan process.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'responsibilities',
    title: 'User Responsibilities',
    content: (
      <>
        <p>As a user of our services, you agree to:</p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Provide genuine and verifiable documents for loan processing</li>
          <li>Respond promptly to requests for additional information or clarification</li>
          <li>Review all loan terms, conditions, and sanction letters before signing</li>
          <li>Repay your loan EMIs as per the agreed schedule with the lender</li>
          <li>Inform us of any changes to your contact details or financial circumstances</li>
          <li>Not misrepresent your income, employment, or credit history</li>
        </ul>
      </>
    ),
    dark: true,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <>
        <p>
          All content on this website — including text, graphics, logos, images, and software — is the property
          of {COMPANY.name} or its content suppliers and is protected by applicable intellectual property laws.
          You may not reproduce, distribute, modify, or create derivative works without our prior written consent.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <p>
          To the fullest extent permitted by law, {COMPANY.name} shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from your use of our services,
          including but not limited to loan rejection, delayed disbursement, or changes in interest rates
          by the lender.
        </p>
        <p className="mt-4">
          Our total liability for any claim arising from these terms or our services shall not exceed the
          amount of fees (if any) paid by you directly to us for the specific service in question.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: (
      <>
        <p>
          Your use of our services is also governed by our{' '}
          <Link to="/privacy-policy" className="text-[#F97316] hover:underline">
            Privacy Policy
          </Link>
          , which describes how we collect, use, and protect your personal information. By using our services,
          you consent to the data practices described therein.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
          Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction
          of the courts in Rajkot, Gujarat.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'amendments',
    title: 'Amendments',
    content: (
      <>
        <p>
          We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
          immediately upon posting on this page. Your continued use of our website or services after any
          modifications constitutes acceptance of the updated terms.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <>
        <p>For questions about these Terms and Conditions, please contact us:</p>
        <div className="mt-6 space-y-4">
          <p><strong>{COMPANY.name}</strong></p>
          {COMPANY.offices.map((office) => (
            <div key={office.city}>
              <p className="font-medium">{office.label}</p>
              <p>{office.address}</p>
            </div>
          ))}
          <p>
            Email:{' '}
            <a href={`mailto:${COMPANY.email}`} className="text-[#F97316] hover:underline">
              {COMPANY.email}
            </a>
          </p>
        </div>
      </>
    ),
    dark: true,
  },
];

export default function TermsPage() {
  useScrollAnimationMulti();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-rich-dark pt-32 pb-20 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-badge mb-6 inline-flex">
            <span>✦</span>
            Legal
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Terms &amp; <span className="text-gradient-orange">Conditions</span>
          </h1>
          <p className="text-lg text-[#B8A98A] max-w-2xl mx-auto">
            Please read these terms carefully before using our loan consultancy services.
          </p>
          <p className="text-sm text-[#7A6F5F] mt-4">Last updated: September 2026</p>
        </div>
      </section>

      {/* Content sections */}
      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 sm:py-20 ${section.dark ? 'bg-rich-dark' : 'section-cream'}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className={`animate-on-scroll ${index === 0 ? 'visible' : ''}`}>
              <h2
                className={`text-2xl sm:text-3xl font-bold mb-6 ${section.dark ? 'text-white' : 'text-[#1a1710]'}`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {section.title}
              </h2>
              <div className={`prose prose-lg max-w-none leading-relaxed ${section.dark ? 'text-[#B8A98A]' : 'text-[#5a5040]'}`}>
                {section.content}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center animate-on-scroll">
          <SectionHeading
            title="Ready to Get Started?"
            subtitle="Book a free consultation with our loan experts — no obligation, no hidden fees."
            badge="Free Consultation"
            light
          />
          <Link to="/contact" className="btn-orange">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
