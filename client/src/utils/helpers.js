import { COMPANY, WHATSAPP_NUMBER } from '../data/company';

export function captureUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  const utm = {};
  utmKeys.forEach(k => { const v = params.get(k); if (v) utm[k] = v; });
  if (Object.keys(utm).length) sessionStorage.setItem('utm_params', JSON.stringify(utm));
  return utm;
}

export function getStoredUTM() {
  try { return JSON.parse(sessionStorage.getItem('utm_params') || '{}'); } catch { return {}; }
}

export function trackEvent(action, category = 'engagement', label = '', value = 0) {
  if (window.gtag) window.gtag('event', action, { event_category: category, event_label: label, value });
  if (window.dataLayer) window.dataLayer.push({ event: action, category, label, value });
}

export function submitForm(formData) {
  const utm = getStoredUTM();
  const data = new URLSearchParams({ ...formData, ...utm, source: 'website', page: window.location.pathname });
  return fetch(COMPANY.formApi, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
}

export function getWhatsAppLink(message = '') {
  const text = message || `Hi, I'm interested in loan services from ${COMPANY.shortName}. Please share more details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatIndianNumber(num) {
  if (!num && num !== 0) return '';
  const n = typeof num === 'string' ? parseInt(num.replace(/,/g, ''), 10) : num;
  if (isNaN(n)) return '';
  return n.toLocaleString('en-IN');
}

export function parseIndianNumber(str) {
  if (!str) return 0;
  return parseInt(String(str).replace(/,/g, ''), 10) || 0;
}

export function calculateEMI(principal, ratePercent, tenureMonths) {
  const r = ratePercent / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const emi = principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getPartnerLogoUrl(url) {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return `${apiUrl.replace('/api', '')}${url}`;
  }
  return url;
}
