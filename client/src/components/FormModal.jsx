import { useEffect, useCallback } from 'react';
import { useFormState } from '../utils/hooks';
import { submitForm, validatePhone, validateEmail, trackEvent, formatIndianNumber, parseIndianNumber } from '../utils/helpers';
import PhoneInput from './common/PhoneInput';
import SERVICES from '../data/services';

const DEFAULT_FIELDS = ['name', 'email', 'phone', 'loanAmount', 'service'];

const FIELD_LABELS = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  loanAmount: 'Loan Amount (₹)',
  service: 'Select Service',
  location: 'Location / City',
  monthlySalary: 'Monthly Salary (₹)',
  firmType: 'Firm Type',
  insuranceType: 'Insurance Type',
};

const INSURANCE_TYPES = ['Life Insurance', 'Health Insurance', 'Vehicle Insurance', 'Business Insurance'];
const FIRM_TYPES = ['New Firm', 'Old Firm'];

function buildInitialFields(fieldNames, service) {
  const fields = {};
  fieldNames.forEach((field) => {
    if (field === 'service' && service) {
      fields.service = service.name;
    } else {
      fields[field] = '';
    }
  });
  return fields;
}

export default function FormModal({ isOpen, onClose, service = null, title = 'Apply Now' }) {
  const fieldNames = service?.formFields || DEFAULT_FIELDS;
  const initialFields = buildInitialFields(fieldNames, service);

  const { formData, setFormData, loading, setLoading, status, setStatus, handleChange, reset } =
    useFormState(initialFields);

  useEffect(() => {
    if (isOpen) {
      reset();
      setFormData(buildInitialFields(fieldNames, service));
    }
  }, [isOpen, service]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

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
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        loanAmount: formData.loanAmount ? String(formData.loanAmount) : '',
        monthlySalary: formData.monthlySalary ? String(formData.monthlySalary) : '',
        service: service?.name || formData.service,
      };
      const response = await submitForm(payload);

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! We will contact you shortly.' });
        trackEvent('form_submit', 'conversion', service?.id || formData.service || 'general');
        setTimeout(() => {
          handleClose();
          reset();
        }, 2500);
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const label = FIELD_LABELS[field] || field;

    if (field === 'service') {
      return (
        <div key={field}>
          <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="form-input"
            required
            disabled={!!service}
          >
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field === 'firmType') {
      return (
        <div key={field}>
          <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
          <select name="firmType" value={formData.firmType} onChange={handleChange} className="form-input" required>
            <option value="">Select firm type</option>
            {FIRM_TYPES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field === 'insuranceType') {
      return (
        <div key={field}>
          <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
          <select name="insuranceType" value={formData.insuranceType} onChange={handleChange} className="form-input" required>
            <option value="">Select insurance type</option>
            {INSURANCE_TYPES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field === 'phone') {
      return (
        <div key={field}>
          <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
          <PhoneInput
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={label}
            required
          />
        </div>
      );
    }

    if (field === 'loanAmount' || field === 'monthlySalary') {
      return (
        <div key={field}>
          <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
          <input
            type="text"
            inputMode="numeric"
            name={field}
            value={formatIndianNumber(formData[field])}
            onChange={(e) => {
              const raw = parseIndianNumber(e.target.value);
              setFormData((prev) => ({ ...prev, [field]: raw || '' }));
            }}
            className="form-input"
            placeholder={label}
            required
          />
        </div>
      );
    }

    const inputType = field === 'email' ? 'email' : 'text';

    return (
      <div key={field}>
        <label className="block text-sm font-medium text-[#F5F0E8] mb-1.5">{label}</label>
        <input
          type={inputType}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          className="form-input"
          placeholder={label}
          required
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10, 9, 6, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        className="glass-card w-full max-w-lg p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.3s ease-out' }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#B8A98A] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{title}</h2>
        {service && (
          <p className="text-sm text-[#B8A98A] mb-6">
            Apply for {service.name}
          </p>
        )}
        {!service && <div className="mb-6" />}

        {status?.type === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Application Submitted!</h3>
            <p className="text-[#B8A98A] mb-2">Thank you for choosing Grow More.</p>
            <p className="text-[#22C55E] font-medium">We will connect with you soon! 🎉</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldNames.map(renderField)}

            {status?.type === 'error' && (
              <div className="text-sm px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
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

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
