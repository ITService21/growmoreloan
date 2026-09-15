import { Link } from 'react-router-dom';
import { TEAM } from '../data/company';

export default function MobileCTA() {
  const founder = TEAM[0];

  return (
    <div
      id="mobile-sticky-cta"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
    >
      <div className="flex items-stretch" style={{ background: 'linear-gradient(90deg, #0a0906, #14110a, #0a0906)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent" />
        <Link
          to="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Apply Now
        </Link>
        <a
          href={`tel:${founder.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#F5F0E8] border-l border-white/10 hover:bg-white/5 transition-colors"
        >
          <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </a>
      </div>
    </div>
  );
}
