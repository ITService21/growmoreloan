import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import { COMPANY } from '../data/company';
import { useScrollAnimationMulti } from '../utils/hooks';

const SECTIONS = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          Welcome to {COMPANY.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are a loan consultancy
          firm based in Rajkot and Ahmedabad, Gujarat, dedicated to helping individuals and businesses find
          suitable financial products from our network of partner banks and NBFCs.
        </p>
        <p className="mt-4">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
          you visit our website, submit an enquiry form, contact us via phone or WhatsApp, or use our loan
          consultancy services. By accessing our services, you agree to the practices described in this policy.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>We may collect the following types of personal and financial information:</p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li><strong>Personal Details:</strong> Full name, date of birth, gender, and photograph (where required for loan processing)</li>
          <li><strong>Contact Information:</strong> Phone number, email address, residential and business address</li>
          <li><strong>Identity Documents:</strong> PAN card, Aadhaar number, passport, or other government-issued ID (when you proceed with a loan application)</li>
          <li><strong>Financial Information:</strong> Income details, employment status, business turnover, existing loans, credit score, bank statements, and IT returns</li>
          <li><strong>Loan Requirements:</strong> Loan type, amount sought, property details (for secured loans), and purpose of borrowing</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, pages visited, and referral source (including UTM parameters)</li>
          <li><strong>Communications:</strong> Records of phone calls, WhatsApp messages, emails, and consultation notes</li>
        </ul>
      </>
    ),
    dark: false,
  },
  {
    id: 'how-we-use',
    title: 'How We Use Information',
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Assessing your loan eligibility and recommending suitable financial products</li>
          <li>Preparing and submitting loan applications to partner banks and NBFCs on your behalf</li>
          <li>Communicating with you regarding your enquiry, application status, and documentation requirements</li>
          <li>Coordinating with lenders for verification, appraisal, and disbursement processes</li>
          <li>Improving our website, services, and customer experience</li>
          <li>Sending relevant updates about loan products, interest rate changes, and financial tips (with your consent)</li>
          <li>Complying with legal obligations, regulatory requirements, and preventing fraud</li>
        </ul>
      </>
    ),
    dark: true,
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    content: (
      <>
        <p>
          We do not sell your personal information. We may share your data with the following parties
          strictly for loan facilitation purposes:
        </p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li><strong>Partner Banks &amp; NBFCs:</strong> To process your loan application, conduct credit checks, and determine eligibility</li>
          <li><strong>Credit Bureaus:</strong> CIBIL, Experian, Equifax, or CRIF for credit score verification (with your consent)</li>
          <li><strong>Service Providers:</strong> Technology partners who assist with website hosting, form processing, and communication tools</li>
          <li><strong>Legal Authorities:</strong> When required by law, court order, or government regulation</li>
        </ul>
        <p className="mt-4">
          All third parties are contractually obligated to maintain the confidentiality and security of your data
          and use it only for the specified purpose.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: (
      <>
        <p>
          We implement appropriate technical and organisational measures to protect your personal information
          against unauthorised access, alteration, disclosure, or destruction. These measures include secure
          data storage, access controls, encrypted communications where applicable, and staff training on
          data protection practices.
        </p>
        <p className="mt-4">
          While we strive to protect your information, no method of transmission over the internet or electronic
          storage is 100% secure. We encourage you to use strong passwords for any accounts and avoid sharing
          sensitive documents over unsecured channels.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <>
        <p>
          Our website may use cookies and similar tracking technologies to enhance your browsing experience,
          analyse website traffic, and understand user preferences. Cookies are small data files stored on
          your device that help us remember your settings and improve site functionality.
        </p>
        <p className="mt-4">
          You can control cookie preferences through your browser settings. Disabling cookies may affect
          certain features of our website. We may also use analytics tools such as Google Analytics to
          understand how visitors interact with our site.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>Under applicable Indian data protection laws, you have the right to:</p>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Request deletion of your data, subject to legal and contractual obligations</li>
          <li>Withdraw consent for marketing communications at any time</li>
          <li>Lodge a complaint with the relevant data protection authority</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please contact us using the details provided in the Contact Us section below.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    content: (
      <>
        <p>
          Our website may contain links to third-party websites, including partner bank portals, government
          scheme pages, and financial resources. We are not responsible for the privacy practices or content
          of these external sites. We encourage you to review the privacy policies of any third-party websites
          you visit.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our services are intended for individuals aged 18 years and above. We do not knowingly collect
          personal information from children under 18. If we become aware that we have collected data from
          a minor without parental consent, we will take steps to delete such information promptly.
        </p>
      </>
    ),
    dark: true,
  },
  {
    id: 'changes',
    title: 'Changes to Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
          legal requirements, or business operations. The updated policy will be posted on this page with a
          revised &quot;Last Updated&quot; date. We encourage you to review this page periodically.
        </p>
      </>
    ),
    dark: false,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
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
          <p>
            Website:{' '}
            <a href={COMPANY.website} className="text-[#F97316] hover:underline" target="_blank" rel="noopener noreferrer">
              {COMPANY.website}
            </a>
          </p>
        </div>
      </>
    ),
    dark: true,
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy <span className="text-gradient-orange">Policy</span>
          </h1>
          <p className="text-lg text-[#B8A98A] max-w-2xl mx-auto">
            Your privacy matters to us. Learn how {COMPANY.shortName} collects, uses, and protects your personal information.
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
            title="Have Questions?"
            subtitle="Our team is happy to clarify how we handle your data. Reach out anytime."
            badge="Support"
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
