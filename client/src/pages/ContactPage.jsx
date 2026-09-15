import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import { COMPANY, TEAM, WHATSAPP_NUMBER } from '../data/company';
import SERVICES from '../data/services';
import PhoneInput from '../components/common/PhoneInput';
import {
  submitForm,
  validatePhone,
  validateEmail,
  formatIndianNumber,
  parseIndianNumber,
  getWhatsAppLink,
  trackEvent,
} from '../utils/helpers';
import { useScrollAnimationMulti, useFormState } from '../utils/hooks';

const CONTACT_FAQS = [
  {
    q: 'How quickly will you respond to my enquiry?',
    a: 'We typically respond to phone calls and WhatsApp messages within a few hours during business hours (Mon–Sat, 10 AM–7 PM). Form submissions are reviewed within 24 hours. For urgent loan needs, call us directly or message on WhatsApp for the fastest response.',
  },
  {
    q: 'Do I need to visit your office?',
    a: 'While we welcome in-person visits at our Rajkot or Ahmedabad offices, it is not mandatory. Many clients complete the entire process over phone, WhatsApp, and email. We can arrange document pickup within city limits.',
  },
  {
    q: 'Is the initial consultation really free?',
    a: 'Yes, absolutely. Your first consultation is completely free with no obligation. We only earn when your loan is successfully disbursed through our partner banks — there are no upfront consultancy fees or hidden charges.',
  },
  {
    q: 'Which languages do you support for consultations?',
    a: 'Our team conducts consultations in Hindi, Gujarati, and English — ensuring clear communication throughout the entire loan process from first call to final disbursement.',
  },
];

function SectionBgObjects({ variant }) {
  const configs = {
    hero: [
      { cls: 'obj-orange geo-float-1', style: { top: '10%', right: '-5%' } },
      { cls: 'obj-green geo-float-3', style: { bottom: '15%', left: '-8%' } },
    ],
    form: [
      { cls: 'obj-green geo-float-4', style: { top: '8%', left: '-6%' } },
      { cls: 'obj-orange geo-float-2', style: { bottom: '10%', right: '-4%' } },
      { cls: 'obj-gold geo-float-5', style: { top: '45%', right: '15%' } },
    ],
    maps: [
      { cls: 'obj-orange geo-float-3', style: { top: '12%', right: '5%' } },
      { cls: 'obj-green geo-float-1', style: { bottom: '20%', left: '-10%' } },
    ],
    faq: [
      { cls: 'obj-green geo-float-2', style: { top: '5%', right: '-7%' } },
      { cls: 'obj-orange geo-float-4', style: { bottom: '12%', left: '3%' } },
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
      <svg viewBox="0 0 24 24" className="w-[45%] h-[45%] text-white" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

export default function ContactPage() {
  useScrollAnimationMulti();

  const [activeOffice, setActiveOffice] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const { formData, loading, setLoading, status, setStatus, handleChange, reset, setFormData } = useFormState({
    name: '',
    email: '',
    phone: '',
    service: '',
    loanAmount: '',
    message: '',
  });

  useEffect(() => {
    document.title = `Contact Us | ${COMPANY.name}`;
    return () => {
      document.title = 'Grow More Loan Consultancy Group';
    };
  }, []);

  const currentOffice = COMPANY.offices[activeOffice];

  const handleLoanAmountChange = (value) => {
    const parsed = parseIndianNumber(value);
    setFormData((prev) => ({ ...prev, loanAmount: parsed ? String(parsed) : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name?.trim()) {
      setStatus({ type: 'error', message: 'Please enter your full name.' });
      return;
    }
    if (!validateEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (!validatePhone(formData.phone)) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    if (!formData.service) {
      setStatus({ type: 'error', message: 'Please select a service.' });
      return;
    }

    setLoading(true);
    try {
      const res = await submitForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        loanAmount: formData.loanAmount?.trim() || '',
        message: formData.message?.trim() || '',
        formType: 'contact-page',
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Thank you! Our team will contact you within 24 hours.' });
        trackEvent('form_submit', 'lead', 'contact_page');
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

  return (
    <main className="bg-rich-dark">
      {/* Hero — dark */}
      <section className="relative pt-28 pb-20 sm:pb-24 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <SectionBgObjects variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll max-w-4xl mx-auto text-center">
            <span className="section-badge mb-6">✦ Contact Us</span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get In Touch With Our Experts
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              Whether you need a personal loan, business funding, or MSME scheme guidance — our team in
              Rajkot and Ahmedabad delivers personalised service at every step. Reach out today for a free,
              no-obligation consultation. {COMPANY.slogan}.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Team Cards — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Team"
            title="Talk to Our Loan Experts"
            subtitle="Connect directly with the people who will guide your loan journey — from first consultation to final disbursement."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TEAM.map((member, index) => (
              <div
                key={member.name}
                className="animate-on-scroll premium-card p-6 sm:p-8 text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProfileAvatar color={member.color} />
                <h3 className="text-xl font-bold text-[#1a1710] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {member.name}
                </h3>
                <p className="text-[#F97316] text-sm font-semibold mb-5">{member.role}</p>

                <a
                  href={`tel:+91${member.phone}`}
                  className="block text-[#1a1710] hover:text-[#F97316] text-base font-medium transition-colors mb-3"
                  onClick={() => trackEvent('call_click', 'engagement', `contact_${member.name}`)}
                >
                  📞 {member.phoneDisplay}
                </a>

                <a
                  href={`mailto:${COMPANY.email}`}
                  className="block text-[#5a5040] hover:text-[#F97316] text-sm transition-colors mb-5"
                >
                  ✉️ {COMPANY.email}
                </a>

                <a
                  href={getWhatsAppLink(`Hi ${member.name}, I'm interested in loan services from ${COMPANY.shortName}. Please share more details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green text-sm inline-flex px-5 py-2.5"
                  onClick={() => trackEvent('whatsapp_click', 'engagement', `contact_${member.name}`)}
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form — dark */}
      <section id="contact-form" className="relative py-20 sm:py-24 scroll-mt-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="form" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Enquiry Form"
            title="Send Us a Message"
            subtitle="Share your loan requirements and our advisors will prepare a personalised recommendation."
          />

          <div className="animate-on-scroll glass-card p-6 sm:p-8 lg:p-10">
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-8">
              Fill out the form below with as much detail as possible. Our team reviews every submission
              personally and responds within one business day with next steps and an honest eligibility assessment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Full Name *
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Your full name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Email Address *
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Phone Number *
                  </label>
                  <PhoneInput id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" required />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Service *
                  </label>
                  <select id="service" name="service" value={formData.service} onChange={handleChange} className="form-input" required>
                    <option value="">Select a Service</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Loan Amount (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount ? formatIndianNumber(formData.loanAmount) : ''}
                  onChange={(e) => handleLoanAmountChange(e.target.value)}
                  className="form-input no-spinner"
                  placeholder="e.g. 5,00,000"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input min-h-[140px] resize-y"
                  placeholder="Tell us about your requirements, employment type, and preferred timeline..."
                  rows={5}
                />
              </div>

              {status && (
                <p className={`text-sm text-center font-medium ${status.type === 'success' ? 'text-[var(--green)]' : 'text-[#F97316]'}`}>
                  {status.message}
                </p>
              )}

              <button type="submit" disabled={loading} className={`btn-orange w-full ${loading ? 'btn-loading' : ''}`}>
                {loading ? 'Submitting...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Info — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Visit Us" title="Our Office Locations" subtitle="Two convenient locations across Gujarat — Rajkot and Ahmedabad." light />

          <div className="space-y-6">
            {COMPANY.offices.map((office, index) => (
              <div key={office.city} className="animate-on-scroll glass-card p-6 sm:p-8" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="icon-box flex-shrink-0">📍</div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a1710] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        {office.label}
                      </h3>
                      <p className="text-[#5a5040] text-sm leading-relaxed">{office.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="icon-box flex-shrink-0">🕐</div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a1710] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Working Hours
                      </h3>
                      <p className="text-[#5a5040] text-sm">Monday – Saturday</p>
                      <p className="text-[#1a1710] text-sm font-semibold mt-1">10:00 AM – 7:00 PM</p>
                      <p className="text-[#9a8a6a] text-xs mt-2">Closed on Sundays and public holidays</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="animate-on-scroll glass-card p-6 sm:p-8 flex items-start gap-4">
              <div className="icon-box flex-shrink-0">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-[#1a1710] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Email
                </h3>
                <a href={`mailto:${COMPANY.email}`} className="text-[#F97316] hover:text-[#EA580C] text-sm transition-colors">
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="maps" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Location"
            title="Find Us on the Map"
            subtitle="Switch between our Rajkot and Ahmedabad offices to view directions."
          />

          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-on-scroll">
            {COMPANY.offices.map((office, index) => (
              <button
                key={office.city}
                type="button"
                onClick={() => setActiveOffice(index)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeOffice === index
                    ? 'bg-gradient-to-r from-[var(--orange)] to-[#EA580C] text-white shadow-lg shadow-[var(--orange)]/20'
                    : 'glass-card text-[var(--text-primary)] hover:border-[var(--orange)]/30'
                }`}
              >
                {office.label}
              </button>
            ))}
          </div>

          <div className="animate-on-scroll glass-card overflow-hidden p-2">
            <div className="aspect-video w-full rounded-xl overflow-hidden min-h-[300px]">
              <iframe
                title={`${currentOffice.label} Location`}
                src={currentOffice.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[var(--text-secondary)] text-sm p-4 text-center">{currentOffice.address}</p>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6 inline-flex">✦ Quick Chat</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1710] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Prefer <span className="text-gradient-orange">WhatsApp</span>?
          </h2>
          <p className="text-[#5a5040] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Skip the wait and chat with us instantly on WhatsApp. Share your loan requirement, upload
            documents, and get quick answers about eligibility, interest rates, and processing timelines.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex"
            onClick={() => trackEvent('whatsapp_click', 'engagement', 'contact_cta')}
          >
            Chat on WhatsApp — +91 {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}
          </a>
        </div>
      </section>

      {/* FAQ — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="faq" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Quick Answers"
            title="Common Contact Questions"
            subtitle="A few things clients often ask before reaching out — visit our full FAQ page for more."
          />

          <div className="animate-on-scroll space-y-3">
            {CONTACT_FAQS.map((faq, index) => (
              <div key={faq.q} className={`faq-item ${openFaq === index ? 'active' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)] pr-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {faq.q}
                  </span>
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

          <div className="animate-on-scroll text-center mt-10">
            <Link to="/faq" className="text-[#F97316] font-semibold hover:text-[#FBBF24] transition-colors">
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — cream */}
      <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1710] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Start? <span className="text-gradient-orange">Apply Now</span>
          </h2>
          <p className="text-[#5a5040] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Take the first step toward your financial goal today. With {COMPANY.experience} years of experience
            and {COMPANY.clients} satisfied clients, our experts are ready to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact-form" className="btn-orange">Apply Now</a>
            <Link to="/emi-calculator" className="btn-outline">Calculate EMI First</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
