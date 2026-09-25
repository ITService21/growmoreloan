import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHeaderScroll } from '../utils/hooks';
import { COMPANY } from '../data/company';
import SERVICES from '../data/services';

export default function Header({ onApply }) {
  const scrolled = useHeaderScroll();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isServicesActive = location.pathname.startsWith('/services');

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link-hover text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'rounded-full bg-[#F97316] text-white px-4 py-1.5 shadow-md shadow-[#F97316]/25'
        : 'text-[#B8A98A] hover:text-[#F97316] px-4 py-1.5'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-3.5 px-5 text-base font-medium border-b border-[rgba(255,200,100,0.06)] transition-all duration-300 ${
      isActive
        ? 'text-[#F97316] bg-[rgba(249,115,22,0.08)] border-l-2 border-l-[#F97316]'
        : 'text-[#B8A98A] hover:text-[#F97316] hover:bg-[rgba(249,115,22,0.04)]'
    }`;

  const handleApplyClick = () => {
    if (onApply) onApply();
    closeMobile();
  };

  const mobileMenuItems = [
    { type: 'link', to: '/', label: 'Home', end: true },
    { type: 'link', to: '/about', label: 'About Us' },
    { type: 'services' },
    { type: 'link', to: '/blog', label: 'Blog' },
    { type: 'link', to: '/emi-calculator', label: 'EMI Calculator' },
    { type: 'link', to: '/contact', label: 'Contact Us' },
  ];

  let mobileAnimIndex = 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'header-scrolled'
          : 'bg-[rgba(12,10,6,0.4)] backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0" onClick={closeMobile}>
            <div className="md:w-[61px] md:h-[61px] w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center ring-2 ring-[rgba(249,115,22,0.25)] group-hover:ring-[#F97316]/50 transition-all duration-300 shrink-0">
              <img
                src="/images/logo.jpeg"
                alt={COMPANY.name}
                className="w-full h-full rounded-full object-contain p-[2px]"
              />
            </div>
            {/* Mobile-only brand name */}
            <div className="flex flex-col min-w-0 sm:hidden">
              <span
                className="text-base font-bold text-white tracking-tight leading-tight truncate"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {COMPANY.shortName}
              </span>
              <span className="text-base font-medium tracking-wider text-[#FBBF24] truncate">
                {COMPANY.slogan}
              </span>
            </div>
            {/* Desktop brand + slogan */}
            <div className="hidden sm:flex flex-col min-w-0">
              <span
                className="text-lg font-bold text-white tracking-tight block leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {COMPANY.shortName}
              </span>
              <span className="text-base sm:text-lg font-medium tracking-wider text-[#FBBF24] block mt-0.5">
                {COMPANY.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-link-hover flex items-center gap-1.5 text-sm font-medium transition-all duration-300 ${
                  isServicesActive || servicesOpen
                    ? 'rounded-full bg-[#F97316] text-white px-4 py-1.5 shadow-md shadow-[#F97316]/25'
                    : 'text-[#B8A98A] hover:text-[#F97316] px-4 py-1.5'
                }`}
                onClick={() => setServicesOpen(!servicesOpen)}
                onMouseEnter={() => setServicesOpen(true)}
              >
                Services
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  className="nav-dropdown-white absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 py-2 rounded-xl !transform-none hover:!transform-none"
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[rgba(0,0,0,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                      Our Loan Services
                    </p>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto py-1">
                    {SERVICES.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        <span className="text-base w-6 text-center">{service.icon}</span>
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/emi-calculator" className={navLinkClass}>
              EMI Calculator
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact Us
            </NavLink>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="btn-orange text-sm !py-2.5 !px-6"
              onClick={handleApplyClick}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`lg:hidden hamburger flex flex-col gap-1.5 p-2.5 rounded-lg hover:bg-[rgba(249,115,22,0.08)] transition-colors ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-[#110f0a]/98 backdrop-blur-xl border-t border-[rgba(255,200,100,0.08)] overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div
            className="mobile-menu-item px-4 py-3 border-b border-[rgba(255,200,100,0.06)]"
            style={{ animationDelay: '0s' }}
          >
            <p className="text-xs text-[#7A6F5F] uppercase tracking-wider font-medium">
              Navigation
            </p>
          </div>

          {mobileMenuItems.map((item) => {
            if (item.type === 'services') {
              const servicesIndex = mobileAnimIndex++;
              return (
                <div key="services">
                  <button
                    type="button"
                    className={`mobile-menu-item flex items-center justify-between w-full py-3.5 px-5 text-base font-medium border-b border-[rgba(255,200,100,0.06)] transition-all duration-300 ${
                      mobileServicesOpen || isServicesActive
                        ? 'text-[#F97316] bg-[rgba(249,115,22,0.08)]'
                        : 'text-[#B8A98A] hover:text-[#F97316]'
                    }`}
                    style={{ animationDelay: `${servicesIndex * 0.05}s` }}
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  >
                    Services
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileServicesOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-[#1a1710] border-b border-[rgba(255,200,100,0.06)]">
                      {SERVICES.map((service, idx) => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          className="mobile-menu-item flex items-center gap-3 py-2.5 px-8 text-sm text-[#B8A98A] hover:text-[#F97316] hover:bg-[rgba(249,115,22,0.04)] transition-colors"
                          style={{ animationDelay: `${(servicesIndex + 1 + idx) * 0.05}s` }}
                          onClick={closeMobile}
                        >
                          <span className="w-5 text-center">{service.icon}</span>
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            const itemIndex = mobileAnimIndex++;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={(props) => `mobile-menu-item ${mobileNavLinkClass(props)}`}
                style={{ animationDelay: `${itemIndex * 0.05}s` }}
                onClick={closeMobile}
              >
                {item.label}
              </NavLink>
            );
          })}

          <div
            className="mobile-menu-item p-5 border-t border-[rgba(255,200,100,0.06)]"
            style={{ animationDelay: `${mobileAnimIndex * 0.05}s` }}
          >
            <Link
              to="/contact"
              className="btn-orange w-full text-center block !py-3"
              onClick={handleApplyClick}
            >
              Apply Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
