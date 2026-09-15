import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { COMPANY } from '../data/company';
import SERVICES from '../data/services';
import { getWhatsAppLink } from '../utils/helpers';
import { useScrollAnimationMulti } from '../utils/hooks';

const ARTICLES_PER_PAGE = 6;

const BLOG_IMAGES = {
  'personal-loan': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
  'business-loan': 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
  'machinery-loan': 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
  'cash-credit': 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800',
  overdraft: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800',
  'msme-loan': 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  'home-loan': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
  'mortgage-loan': 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
  'car-loan': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
  insurance: 'https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=800',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SectionBgObjects() {
  return (
    <>
      <div className="bg-object-large obj-orange geo-float-1" style={{ top: '10%', right: '-5%' }} />
      <div className="bg-object-large obj-green geo-float-3" style={{ bottom: '15%', left: '-8%' }} />
      <div className="bg-object-large obj-gold geo-float-2" style={{ top: '45%', left: '35%' }} />
    </>
  );
}

function renderContentBlock(section, index) {
  switch (section.type) {
    case 'heading':
      return (
        <h3
          key={index}
          className="text-lg sm:text-xl font-bold text-[#1a1710] mt-8 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {section.text}
        </h3>
      );
    case 'list':
      return (
        <ul key={index} className="space-y-2 mb-5 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#5a5040] text-sm sm:text-base leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F97316]/15 flex items-center justify-center text-[#F97316] text-xs mt-0.5">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      );
    case 'paragraph':
    default:
      return (
        <p key={index} className="text-[#5a5040] text-sm sm:text-base leading-relaxed mb-4">
          {section.text}
        </p>
      );
  }
}

function BlogArticleModal({ article, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!article) return null;

  const imageUrl = BLOG_IMAGES[article.category] || BLOG_IMAGES['personal-loan'];
  const content = Array.isArray(article.content) ? article.content : [];

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10, 9, 6, 0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.3s ease-out' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close article"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-6 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F97316] text-white">
              {article.categoryName}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h2
              id="blog-modal-title"
              className="text-xl sm:text-2xl font-bold text-[#1a1710] mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {article.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#9a8a6a] mb-6 pb-4 border-b border-black/8">
              <time dateTime={article.date}>{formatDateLong(article.date)}</time>
              <span className="w-1 h-1 rounded-full bg-[#9a8a6a]" aria-hidden="true" />
              <span>{article.readTime}</span>
            </div>

            <div className="article-content">
              {content.map((section, index) => renderContentBlock(section, index))}
            </div>

            {article.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-black/8">
                <p className="text-xs font-semibold text-[#9a8a6a] uppercase tracking-wide mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

function transformBlog(b) {
  return {
    id: b.id,
    title: b.title,
    category: b.category,
    categoryName: b.category_name,
    excerpt: b.excerpt || '',
    date: b.date,
    readTime: b.read_time || '5 min read',
    content: typeof b.content === 'string' ? JSON.parse(b.content) : b.content,
    tags: typeof b.tags === 'string' ? JSON.parse(b.tags) : (b.tags || []),
  };
}

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useScrollAnimationMulti();

  useEffect(() => {
    document.title = 'Financial Insights & Loan Guides | Grow More Loan Consultancy';
    return () => {
      document.title = COMPANY.name;
    };
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ARTICLES_PER_PAGE),
      });
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs?${params}`);
      const json = await res.json();

      if (json.success) {
        setArticles(json.data.map(transformBlog));
        setTotalPages(json.pagination?.totalPages || 1);
        setTotalArticles(json.pagination?.total || json.data.length);
      } else {
        setArticles([]);
        setError(json.message || 'Failed to load articles.');
      }
    } catch {
      setArticles([]);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const openArticle = (article) => setSelectedArticle(article);
  const closeArticle = () => setSelectedArticle(null);

  return (
    <main className="bg-rich-dark">
      <section className="relative pt-28 pb-20 sm:pb-24 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <SectionBgObjects />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6">✦ Our Blog</span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Financial Insights &amp; Loan Guides
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            Expert articles on personal loans, business funding, home financing, MSME schemes, and
            insurance — practical guides for individuals and businesses across India.
          </p>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      <section className="section-cream relative py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
            <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0 sm:justify-center">
              <button
                type="button"
                onClick={() => { setCategory('all'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                  category === 'all'
                    ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10'
                    : 'border-black/8 bg-white/80 text-[#5a5040] hover:border-[#F97316]/30'
                }`}
              >
                All
              </button>
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => { setCategory(service.id); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                    category === service.id
                      ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10'
                      : 'border-black/8 bg-white/80 text-[#5a5040] hover:border-[#F97316]/30'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-on-scroll max-w-xl mx-auto">
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search articles by title..."
              className="form-input"
              aria-label="Search blog articles"
            />
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-10 h-10 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[var(--text-secondary)]">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="animate-on-scroll text-center py-16">
              <span className="text-5xl mb-4 block">⚠️</span>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Something went wrong
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">{error}</p>
              <button type="button" onClick={fetchBlogs} className="btn-outline">
                Try Again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="animate-on-scroll text-center py-16">
              <span className="text-5xl mb-4 block">📭</span>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No articles found
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">Try adjusting your search or category filter.</p>
              <button
                type="button"
                onClick={() => {
                  setCategory('all');
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-muted)] mb-8 animate-on-scroll">
                Showing {totalArticles} article{totalArticles !== 1 ? 's' : ''}
                {category !== 'all' && ` in ${SERVICES.find((s) => s.id === category)?.name || category}`}
                {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article, index) => (
                  <article
                    key={article.id}
                    className="animate-on-scroll premium-card p-6 sm:p-7 flex flex-col"
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="relative h-40 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-4 overflow-hidden rounded-t-xl">
                      <img
                        src={BLOG_IMAGES[article.category] || BLOG_IMAGES['personal-loan']}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F97316]/90 text-white">
                        {article.categoryName}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold text-[var(--text-primary)] mb-3 leading-snug line-clamp-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {article.title}
                    </h3>

                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-4 pt-4 border-t border-[var(--border-subtle)]">
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                      <span>{article.readTime}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openArticle(article)}
                      className="text-sm font-semibold text-[#F97316] hover:text-[#FBBF24] transition-colors mt-auto text-left"
                    >
                      Read More →
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {!loading && totalPages > 1 && (
        <section className="section-cream relative py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-outline px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25'
                      : 'bg-white/80 text-[#5a5040] border border-black/8 hover:border-[#F97316]/30'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-outline px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <span className="section-badge mb-6 inline-flex">✦ Stay Connected</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Need Personalised <span className="text-gradient-orange">Loan Guidance</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Reading about loans is a great start — but every financial profile is unique. Contact our team
            for a free consultation. With {COMPANY.experience} years of experience and {COMPANY.clients}{' '}
            satisfied clients, we compare offers from 15+ lenders so you never have to apply blindly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-orange">Contact Us</Link>
            <a
              href={getWhatsAppLink('Hi, I read your blog and would like personalised loan guidance. Please assist.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {selectedArticle && (
        <BlogArticleModal article={selectedArticle} onClose={closeArticle} />
      )}
    </main>
  );
}
