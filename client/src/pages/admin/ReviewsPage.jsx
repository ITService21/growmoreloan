import { useCallback, useEffect, useState } from 'react';
import { apiRequest, apiUpload } from '../../utils/adminApi';

const EMPTY_FORM = {
  reviewer_name: '',
  reviewer_image: '',
  reviewer_image_file: null,
  rating: 5,
  location: '',
  description: '',
};

function StarDisplay({ rating }) {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBF24]">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className="w-4 h-4" fill={n <= rating ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </span>
  );
}

function StarSelector({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`p-1 transition-colors ${n <= value ? 'text-[#FBBF24]' : 'text-[#7A6F5F] hover:text-[#FBBF24]/60'}`}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <svg className="w-7 h-7" fill={n <= value ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/reviews');
      setReviews(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (review) => {
    setEditingId(review.id);
    setForm({
      reviewer_name: review.reviewer_name || '',
      reviewer_image: review.reviewer_image || '',
      reviewer_image_file: null,
      rating: review.rating || 5,
      location: review.location || '',
      description: review.description || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const hasFile = form.reviewer_image_file instanceof File;

      if (hasFile) {
        const formData = new FormData();
        formData.append('reviewer_name', form.reviewer_name);
        formData.append('reviewer_image', form.reviewer_image || '');
        formData.append('rating', String(form.rating));
        formData.append('location', form.location || '');
        formData.append('description', form.description || '');
        formData.append('reviewer_image_file', form.reviewer_image_file);

        if (editingId) {
          await apiUpload(`/reviews/${editingId}`, formData, 'PUT');
        } else {
          await apiUpload('/reviews', formData, 'POST');
        }
      } else {
        const payload = {
          reviewer_name: form.reviewer_name,
          reviewer_image: form.reviewer_image,
          rating: form.rating,
          location: form.location,
          description: form.description,
        };

        if (editingId) {
          await apiRequest(`/reviews/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } else {
          await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
        }
      }

      closeModal();
      await fetchReviews();
    } catch (err) {
      setError(err.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/reviews/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchReviews();
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...reviews];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setReviews(updated);
    setDragIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragIndex === null) return;
    setDragIndex(null);
    try {
      await Promise.all(
        reviews.map((review, index) =>
          apiRequest(`/reviews/${review.id}`, {
            method: 'PUT',
            body: JSON.stringify({ sort_order: index }),
          })
        )
      );
      await fetchReviews();
    } catch (err) {
      setError(err.message || 'Failed to reorder reviews');
      await fetchReviews();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Google Reviews
          </h2>
          <p className="text-sm text-[#B8A98A] mt-1">Manage Google Maps reviews displayed on the website. Drag cards to reorder.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-orange shrink-0">
          + Add Review
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-12 text-center text-[#B8A98A] !transform-none">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-12 text-center !transform-none">
          <p className="text-[#B8A98A] mb-4">No reviews yet. Add your first Google review.</p>
          <button type="button" onClick={openCreate} className="btn-orange">
            Add Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`glass-card p-5 cursor-grab active:cursor-grabbing !transform-none hover:!translate-y-0 hover:!scale-100 ${
                dragIndex === index ? 'opacity-60 border-[#F97316]/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <svg className="w-5 h-5 text-[#7A6F5F] cursor-grab" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                  {review.reviewer_image ? (
                    <img
                      src={review.reviewer_image}
                      alt={review.reviewer_name}
                      className="w-12 h-12 rounded-full object-cover border border-[rgba(255,200,100,0.1)]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[rgba(249,115,22,0.15)] flex items-center justify-center text-[#F97316] font-semibold shrink-0">
                      {(review.reviewer_name || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white truncate">{review.reviewer_name}</p>
                      <StarDisplay rating={review.rating} />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => openEdit(review)} className="text-xs text-[#F97316] hover:underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(review)} className="text-xs text-red-400 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                  {review.location && (
                    <p className="text-xs text-[#7A6F5F] mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {review.location}
                    </p>
                  )}
                  {review.description && (
                    <p className="text-sm text-[#B8A98A] mt-2 line-clamp-3">{review.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={closeModal}>
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-scroll !transform-none hover:!transform-none relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#B8A98A] hover:text-white hover:bg-white/10 transition-colors z-10" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-6 pr-8" style={{ fontFamily: 'var(--font-display)' }}>
              {editingId ? 'Edit Review' : 'Add Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Reviewer Name *</label>
                <input
                  type="text"
                  value={form.reviewer_name}
                  onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Reviewer Image URL</label>
                <input
                  type="url"
                  value={form.reviewer_image}
                  onChange={(e) => setForm({ ...form, reviewer_image: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Or Upload Reviewer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, reviewer_image_file: e.target.files[0] })}
                  className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F97316]/10 file:text-[#F97316] file:text-sm file:font-medium hover:file:bg-[#F97316]/20 file:cursor-pointer"
                />
                <p className="text-xs text-[#7A6F5F] mt-1">JPG, PNG, WebP up to 5MB. URL takes priority if both provided.</p>
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Rating *</label>
                <StarSelector
                  value={form.rating}
                  onChange={(rating) => setForm({ ...form, rating })}
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Rajkot, Gujarat"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="form-input resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`btn-orange flex-1 ${saving ? 'btn-loading' : ''}`}>
                  {saving ? 'Saving…' : editingId ? 'Update Review' : 'Create Review'}
                </button>
                <button type="button" onClick={closeModal} className="btn-dark">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-card w-full max-w-md p-6 !transform-none hover:!transform-none">
            <h3 className="text-lg font-bold text-white mb-2">Delete Review?</h3>
            <p className="text-sm text-[#B8A98A] mb-6">
              Are you sure you want to delete the review by <strong className="text-white">{deleteTarget.reviewer_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/30 transition-colors ${deleting ? 'opacity-70' : ''}`}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
              <button type="button" onClick={() => setDeleteTarget(null)} className="btn-dark flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
