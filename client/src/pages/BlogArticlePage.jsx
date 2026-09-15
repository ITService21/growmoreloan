import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import SectionHeading from '../components/SectionHeading';
import BLOG_ARTICLES from '../data/blogArticles';
import { COMPANY } from '../data/company';
import SERVICES from '../data/services';
import { getWhatsAppLink } from '../utils/helpers';
import { useScrollAnimationMulti } from '../utils/hooks';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SectionBgObjects({ variant }) {
  const configs = {
    hero: [
      { cls: 'obj-orange geo-float-1', style: { top: '10%', right: '-5%' } },
      { cls: 'obj-green geo-float-3', style: { bottom: '15%', left: '-8%' } },
    ],
    author: [
      { cls: 'obj-green geo-float-4', style: { top: '8%', left: '-6%' } },
      { cls: 'obj-orange geo-float-2', style: { bottom: '10%', right: '-4%' } },
    ],
    cta: [
      { cls: 'obj-orange geo-float-3', style: { top: '12%', right: '5%' } },
      { cls: 'obj-green geo-float-1', style: { bottom: '20%', left: '-10%' } },
      { cls: 'obj-gold geo-float-5', style: { top: '50%', right: '15%' } },
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

function renderContentSection(section, index, light = false) {
  const textClass = light ? 'text-[#5a5040]' : 'text-[var(--text-secondary)]';
  const headingClass = light ? 'text-[#1a1710]' : 'text-[var(--text-primary)]';

  switch (section.type) {
    case 'heading':
      return (
        <h2
          key={index}
          className={`text-xl sm:text-2xl font-bold ${headingClass} mt-10 mb-4`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {section.text}
        </h2>
      );
    case 'list':
      return (
        <ul key={index} className="space-y-3 mb-6 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 ${textClass} text-sm sm:text-base leading-relaxed`}>
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
        <p key={index} className={`${textClass} text-sm sm:text-base leading-relaxed mb-5`}>
          {section.text}
        </p>
      );
  }
}

export default function BlogArticlePage() {
  const { articleId } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.id === articleId);

  useScrollAnimationMulti();

  useEffect(() => {
    if (article) {
      document.title = article.seoTitle;
    }
    return () => {
      document.title = COMPANY.name;
    };
  }, [article]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return BLOG_ARTICLES.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 bg-rich-dark">
        <div className="text-center animate-on-scroll visible max-w-md">
          <span className="text-6xl mb-6 block">📄</span>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Article Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            The article you&apos;re looking for doesn&apos;t exist or may have been moved. Browse our blog
            for the latest loan guides and financial insights.
          </p>
          <Link to="/blog" className="btn-orange inline-flex">
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const service = SERVICES.find((s) => s.id === article.category);

  return (
    <main className="bg-rich-dark">
      {/* Hero / Header — dark */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <SectionBgObjects variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/60 via-transparent to-[var(--bg-primary)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="animate-on-scroll mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/blog" className="hover:text-[#F97316] transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--text-primary)] font-medium line-clamp-1">{article.title}</li>
            </ol>
          </nav>

          <header className="animate-on-scroll">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
              {article.categoryName}
            </span>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-5">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" aria-hidden="true" />
              <span>{article.readTime}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>
        </div>
      </section>

      {/* Article Content — cream */}
      <section className="section-cream relative py-12 lg:py-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="animate-on-scroll">
            <div className="glass-card p-6 sm:p-8 lg:p-10">
              {article.content.map((section, index) => renderContentSection(section, index, true))}

              {service && (
                <div className="mt-10 pt-8 border-t border-black/8">
                  <p className="text-[#5a5040] text-sm mb-3">
                    Interested in {article.categoryName}? Explore our dedicated service page:
                  </p>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-[#F97316] font-semibold text-sm hover:text-[#FBBF24] transition-colors"
                  >
                    Learn More about {service.name} →
                  </Link>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Author Card — dark */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="author" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 p-2 border border-[var(--border-subtle)]">
              <img
                src="/images/logo.png"
                alt={COMPANY.shortName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {COMPANY.name}
              </h3>
              <p className="text-[#F97316] text-sm font-semibold mb-3">{COMPANY.tagline}</p>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {COMPANY.description} With {COMPANY.experience} years of experience and {COMPANY.clients}{' '}
                happy clients across Rajkot and Ahmedabad, every article on our blog reflects our commitment
                to educating borrowers before they apply — because informed decisions lead to better financial outcomes.
              </p>
              <Link
                to="/about"
                className="inline-block mt-4 text-sm font-semibold text-[#F97316] hover:text-[#FBBF24] transition-colors"
              >
                Learn More About Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles — cream */}
      {relatedArticles.length > 0 && (
        <section className="section-cream relative py-20 sm:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading badge="Keep Reading" title="Related Articles" light />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedArticles.map((related, index) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  className="animate-on-scroll premium-card p-6 flex flex-col group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs font-semibold text-[#F97316] mb-2">{related.categoryName}</span>
                  <h3
                    className="text-base font-bold text-[#1a1710] mb-2 leading-snug line-clamp-2 group-hover:text-[#F97316] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {related.title}
                  </h3>
                  <p className="text-[#5a5040] text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                    {related.excerpt}
                  </p>
                  <span className="text-xs text-[#9a8a6a]">{related.readTime}</span>
                  <span className="text-sm font-semibold text-[#F97316] mt-3">Read More →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — dark */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedBackground />
        <SectionBgObjects variant="cta" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Need Help with <span className="text-gradient-orange">{article.categoryName}</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Contact us today for personalised guidance on {article.categoryName.toLowerCase()} options in
            Rajkot and Ahmedabad. Our team compares offers from multiple lenders and handles the entire
            process with complete transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-orange w-full sm:w-auto text-center">
              Contact Us
            </Link>
            {service && (
              <Link to={`/services/${service.id}`} className="btn-outline w-full sm:w-auto text-center">
                Explore {article.categoryName}
              </Link>
            )}
            <a
              href={getWhatsAppLink(
                `Hi, I read your article on "${article.title}" and need help with ${article.categoryName}. Please assist.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto text-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
