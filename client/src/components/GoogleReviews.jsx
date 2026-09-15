import { useState, useEffect, useCallback } from 'react';
import SectionHeading from './SectionHeading';

const REVIEWS_PER_PAGE = 20;

export default function GoogleReviews({ light = false, className = '' }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = useCallback(async (pageNum) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews?page=${pageNum}&limit=${REVIEWS_PER_PAGE}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        if (pageNum === 1) {
          setReviews(json.data);
        } else {
          setReviews((prev) => [...prev, ...json.data]);
        }
        setHasMore(json.data.length === REVIEWS_PER_PAGE);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  if (loading || reviews.length === 0) return null;

  return (
    <section className={`relative py-20 sm:py-24 overflow-hidden ${className}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          title="What Our Clients Say"
          subtitle="Real reviews from clients who trusted us with their financial goals."
          light={light}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={review.id} className="premium-card p-6 opacity-0 animate-fadeIn" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                {review.reviewer_image ? (
                  <img
                    src={review.reviewer_image}
                    alt={review.reviewer_name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/15 flex items-center justify-center text-[#F97316] font-bold text-lg">
                    {(review.reviewer_name || '?')[0]}
                  </div>
                )}
                <div>
                  <p
                    className="font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {review.reviewer_name}
                  </p>
                  {review.location && <p className="text-xs text-[var(--text-muted)]">{review.location}</p>}
                </div>
              </div>
              <div className="flex gap-0.5 mb-3 text-[#FBBF24]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg
                    key={n}
                    className="w-4 h-4"
                    fill={n <= review.rating ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              {review.description && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                  {review.description}
                </p>
              )}
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button type="button" onClick={loadMore} className="btn-outline">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
