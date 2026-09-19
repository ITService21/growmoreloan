import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuth, getToken, getUser } from '../../utils/adminApi';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/admin/reviews', label: 'Google Reviews', icon: StarIcon },
  { to: '/admin/partners', label: 'Bank Partners', icon: BuildingIcon },
  { to: '/admin/blogs', label: 'Blog Articles', icon: BlogIcon },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login', { replace: true });
  };

  if (!getToken()) return null;

  return (
    <div className="min-h-screen bg-rich-dark flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0906] border-r border-[rgba(255,200,100,0.06)] flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-[rgba(255,200,100,0.06)]">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <img src="/images/logo.jpeg" alt="Grow More" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Grow More
              </p>
              <p className="text-xs text-[#F97316]">Admin Panel</p>
            </div>
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[rgba(249,115,22,0.12)] text-[#F97316] border border-[rgba(249,115,22,0.2)]'
                    : 'text-[#B8A98A] hover:text-white hover:bg-[rgba(255,200,100,0.04)]'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(255,200,100,0.06)]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#B8A98A] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[rgba(12,12,12,0.95)] backdrop-blur-xl border-b border-[rgba(255,200,100,0.06)] px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-[rgba(255,200,100,0.06)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6 text-[#F5F0E8]" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Admin Panel
            </h1>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-sm text-white font-medium">{user.name || 'Administrator'}</p>
              <p className="text-xs text-[#7A6F5F]">{user.phone}</p>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function BlogIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
