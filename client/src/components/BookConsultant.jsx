import { useState, useEffect } from 'react';
import { APPLY_PHONE } from '../data/company';
import PhoneInput from './common/PhoneInput';
import SERVICES from '../data/services';
import { submitForm, validatePhone, formatIndianNumber, parseIndianNumber } from '../utils/helpers';

export default function BookConsultant() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', loanAmount: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClose = () => {
    if (!loading) { setOpen(false); setStatus(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setStatus({ type: 'error', msg: 'Please enter your name.' }); return; }
    if (!validatePhone(formData.phone)) { setStatus({ type: 'error', msg: 'Enter a valid 10-digit phone number.' }); return; }
    setLoading(true); setStatus(null);
    try {
      const res = await submitForm({ ...formData, formType: 'book-consultant' });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'We will connect with you soon!' });
        setFormData({ name: '', email: '', phone: '', loanAmount: '', service: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
      }
    } catch { setStatus({ type: 'error', msg: 'Network error.' }); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="book-consultant-float">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', boxShadow: '0 4px 25px rgba(249,115,22,0.35)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Book Consultant
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,9,6,0.88)', backdropFilter: 'blur(8px)' }} onClick={handleClose}>
          <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative" onClick={e => e.stopPropagation()} style={{ animation: 'modalIn 0.3s ease-out' }}>
            <button type="button" onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#B8A98A] hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Book Free Consultation</h2>
            <p className="text-sm text-[#B8A98A] mb-5">Speak with our financial experts — no fees, no obligation.</p>

            <div className="flex gap-3 mb-6">
              <a href={`tel:${APPLY_PHONE}`} className="flex-1 btn-orange text-center text-sm !py-2.5">📞 Call Now</a>
              <a href={`https://wa.me/91${APPLY_PHONE}?text=${encodeURIComponent("Hi, I'd like to book a free consultation.")}`} target="_blank" rel="noopener noreferrer" className="flex-1 btn-outline text-center text-sm !py-2.5">💬 WhatsApp</a>
            </div>

            <div className="border-t border-[rgba(255,200,100,0.06)] pt-5">
              <p className="text-sm text-[#B8A98A] font-medium mb-4">Or fill the enquiry form below:</p>

              {status?.type === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-lg font-bold text-white mb-1">Enquiry Submitted!</p>
                  <p className="text-[#22C55E] font-medium">We will connect with you soon! 🎉</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#B8A98A] mb-1.5">Full Name *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" placeholder="Full Name" required />
                    </div>
                    <div>
                      <label className="block text-sm text-[#B8A98A] mb-1.5">Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input" placeholder="Email Address" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#B8A98A] mb-1.5">Phone Number *</label>
                      <PhoneInput value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" required />
                    </div>
                    <div>
                      <label className="block text-sm text-[#B8A98A] mb-1.5">Loan Amount (₹)</label>
                      <input type="text" inputMode="numeric" value={formData.loanAmount ? formatIndianNumber(formData.loanAmount) : ''} onChange={e => setFormData({...formData, loanAmount: String(parseIndianNumber(e.target.value))})} className="form-input no-spinner" placeholder="e.g. 5,00,000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#B8A98A] mb-1.5">Select Service</label>
                    <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="form-input">
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#B8A98A] mb-1.5">Message</label>
                    <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="form-input resize-none" placeholder="Tell us about your requirements..." />
                  </div>
                  {status?.type === 'error' && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{status.msg}</p>}
                  <button type="submit" disabled={loading} className={`btn-orange w-full flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}>
                    {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                    {loading ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </>
  );
}
