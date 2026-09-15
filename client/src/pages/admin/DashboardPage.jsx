import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser, apiRequest } from '../../utils/adminApi';

export default function DashboardPage() {
  const user = getUser();
  const [stats, setStats] = useState({ reviews: 0, partners: 0, activePartners: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const [reviewsRes, partnersRes] = await Promise.all([
          apiRequest('/reviews'),
          apiRequest('/partners'),
        ]);
        const partners = partnersRes.data || [];
        setStats({
          reviews: (reviewsRes.data || []).length,
          partners: partners.length,
          activePartners: partners.filter((p) => p.is_active === 1 || p.is_active === true).length,
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Reviews', value: stats.reviews, icon: '⭐', color: 'from-[#F97316] to-[#EA580C]' },
    { label: 'Total Partners', value: stats.partners, icon: '🏦', color: 'from-[#FBBF24] to-[#F59E0B]' },
    { label: 'Active Partners', value: stats.activePartners, icon: '✅', color: 'from-[#22C55E] to-[#16A34A]' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h2>
        <p className="text-[#B8A98A]">Manage your Google reviews and bank partners from here.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="glass-card p-6 !transform-none hover:!translate-y-0 hover:!scale-100"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-white stat-glow mb-1">
              {loading ? '—' : card.value}
            </p>
            <p className="text-sm text-[#B8A98A]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 sm:p-8 !transform-none hover:!translate-y-0 hover:!scale-100">
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/reviews" className="btn-orange !py-3 !px-6">
            Manage Reviews
          </Link>
          <Link to="/admin/partners" className="btn-outline !py-3 !px-6">
            Manage Partners
          </Link>
        </div>
      </div>
    </div>
  );
}
