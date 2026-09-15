import { useState } from 'react';
import { APPLY_PHONE } from '../data/company';
import PhoneInput from './common/PhoneInput';
import { submitForm, validatePhone } from '../utils/helpers';

export default function BookConsultant() {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatus({ type: 'error', msg: 'Please enter your name.' });
      return;
    }
    if (!validatePhone(formData.phone)) {
      setStatus({ type: 'error', msg: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await submitForm({
        ...formData,
        service: 'Free Consultation',
        formType: 'book-consultant',
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'We will connect with you soon!' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setShowForm(false);
          setStatus(null);
        }, 3000);
      } else {
        setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-consultant-float">
      {expanded && (
        <div
          className="absolute bottom-16 left-0 glass-card p-5 w-80 mb-2"
          style={{
            animation: 'slideDown 0.3s ease',
            background: 'rgba(26,23,16,0.97)',
            border: '1px solid rgba(249,115,22,0.15)',
          }}
        >
          {!showForm ? (
            <>
              <p className="text-sm text-[#F5F0E8] font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Book Free Consultation
              </p>
              <p className="text-xs text-[#B8A98A] mb-4">
                Speak with our expert financial advisors — no fees, no obligation.
              </p>
              <a href={`tel:${APPLY_PHONE}`} className="btn-orange w-full text-center text-sm !py-2.5 block mb-2">
                📞 Call Now
              </a>
              <a
                href={`https://wa.me/91${APPLY_PHONE}?text=${encodeURIComponent("Hi, I'd like to book a free consultation.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center text-sm !py-2.5 block mb-2"
              >
                💬 WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full text-center text-sm !py-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/25 text-[#22C55E] font-semibold hover:bg-[#22C55E]/15 transition-all"
              >
                📝 Enquiry Form
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#F5F0E8] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  Quick Enquiry
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setStatus(null);
                  }}
                  className="text-xs text-[#B8A98A] hover:text-white"
                >
                  ← Back
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name *"
                  className="form-input !py-2 text-sm"
                  required
                />
                <PhoneInput
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone Number *"
                  className="!py-2 text-sm"
                  required
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email (optional)"
                  className="form-input !py-2 text-sm"
                />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your requirements..."
                  rows={2}
                  className="form-input !py-2 text-sm resize-none"
                />
                {status && (
                  <p
                    className={`text-xs px-3 py-2 rounded-lg ${
                      status.type === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {status.msg}
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-orange w-full text-sm !py-2.5">
                  {loading ? 'Sending...' : 'Submit Enquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (expanded) {
            setShowForm(false);
            setStatus(null);
          }
        }}
        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #F97316, #EA580C)',
          boxShadow: '0 4px 25px rgba(249,115,22,0.35)',
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {expanded ? 'Close' : 'Book Consultant'}
      </button>
    </div>
  );
}
