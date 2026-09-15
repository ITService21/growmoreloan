import { useCallback, useEffect, useState } from 'react';
import { apiRequest, apiUpload } from '../../utils/adminApi';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    const base = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${base}${url}`;
  }
  return url;
};

const CATEGORIES = [
  { value: 'bank', label: 'Bank' },
  { value: 'nbfc', label: 'NBFC' },
  { value: 'hfc', label: 'HFC' },
];

const EMPTY_FORM = {
  name: '',
  logo_url: '',
  logo_file: null,
  website: '',
  category: 'bank',
  sort_order: 0,
  is_active: true,
};

function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

function isPartnerActive(partner) {
  return partner.is_active === 1 || partner.is_active === true;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  const displayedPartners = partners.filter((p) => {
    const isActive = isPartnerActive(p);
    return activeTab === 'active' ? isActive : !isActive;
  });

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/partners/admin');
      setPartners(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const openCreate = () => {
    setEditingId(null);
    const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.sort_order || 0)) : 0;
    setForm({ ...EMPTY_FORM, sort_order: maxOrder + 1 });
    setModalOpen(true);
  };

  const openEdit = (partner) => {
    setEditingId(partner.id);
    setForm({
      name: partner.name || '',
      logo_url: partner.logo_url || '',
      logo_file: null,
      website: partner.website || '',
      category: partner.category || 'bank',
      sort_order: partner.sort_order ?? 0,
      is_active: isPartnerActive(partner),
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
      const hasFile = form.logo_file instanceof File;

      if (hasFile) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('logo_url', form.logo_url || '');
        formData.append('website', form.website || '');
        formData.append('category', form.category);
        formData.append('sort_order', String(parseInt(form.sort_order, 10) || 0));
        formData.append('is_active', form.is_active ? '1' : '0');
        formData.append('logo_file', form.logo_file);

        if (editingId) {
          await apiUpload(`/partners/${editingId}`, formData, 'PUT');
        } else {
          await apiUpload('/partners', formData, 'POST');
        }
      } else {
        const payload = {
          name: form.name,
          logo_url: form.logo_url,
          website: form.website,
          category: form.category,
          is_active: form.is_active ? 1 : 0,
          sort_order: parseInt(form.sort_order, 10) || 0,
        };

        if (editingId) {
          await apiRequest(`/partners/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } else {
          await apiRequest('/partners', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
        }
      }

      closeModal();
      await fetchPartners();
    } catch (err) {
      setError(err.message || 'Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/partners/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchPartners();
    } catch (err) {
      setError(err.message || 'Failed to delete partner');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (partner) => {
    const isActive = isPartnerActive(partner);
    try {
      await apiRequest(`/partners/${partner.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
      });
      await fetchPartners();
    } catch (err) {
      setError(err.message || 'Failed to update partner status');
    }
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...displayedPartners];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);

    const otherPartners = partners.filter((p) =>
      activeTab === 'active' ? !isPartnerActive(p) : isPartnerActive(p)
    );
    setPartners(activeTab === 'active' ? [...updated, ...otherPartners] : [...otherPartners, ...updated]);
    setDragIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragIndex === null) return;
    setDragIndex(null);

    try {
      await Promise.all(
        partners.map((partner, index) =>
          apiRequest(`/partners/${partner.id}`, {
            method: 'PUT',
            body: JSON.stringify({ sort_order: index }),
          })
        )
      );
      await fetchPartners();
    } catch (err) {
      setError(err.message || 'Failed to reorder partners');
      await fetchPartners();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Bank Partners
          </h2>
          <p className="text-sm text-[#B8A98A] mt-1">
            Manage partner logos displayed on the website. Drag cards to reorder.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-orange shrink-0">
          + Add Partner
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-12 text-center text-[#B8A98A] !transform-none">Loading partners…</div>
      ) : partners.length === 0 ? (
        <div className="glass-card p-12 text-center !transform-none">
          <p className="text-[#B8A98A] mb-4">No partners yet. Add your first bank partner.</p>
          <button type="button" onClick={openCreate} className="btn-orange">
            Add Partner
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'active'
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'bg-[rgba(255,200,100,0.04)] text-[#B8A98A] border border-[rgba(255,200,100,0.06)] hover:text-white'
              }`}
            >
              Active ({partners.filter((p) => isPartnerActive(p)).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inactive')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'inactive'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                  : 'bg-[rgba(255,200,100,0.04)] text-[#B8A98A] border border-[rgba(255,200,100,0.06)] hover:text-white'
              }`}
            >
              Inactive ({partners.filter((p) => !isPartnerActive(p)).length})
            </button>
          </div>

          {displayedPartners.length === 0 ? (
            <div className="glass-card p-12 text-center !transform-none">
              <p className="text-[#B8A98A]">
                {activeTab === 'inactive' ? 'No inactive partners' : 'No active partners'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPartners.map((partner, index) => {
                const isActive = isPartnerActive(partner);
                return (
                  <div
                    key={partner.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`glass-card p-5 cursor-grab active:cursor-grabbing !transform-none hover:!translate-y-0 hover:!scale-100 ${
                      dragIndex === index ? 'opacity-60 border-[#F97316]/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#7A6F5F]">Order: {partner.sort_order ?? index}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="h-16 flex items-center justify-center mb-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,200,100,0.06)] p-3">
                      {partner.logo_url && !partner.logo_url.includes('logo.clearbit.com') ? (
                        <img
                          src={getImageUrl(partner.logo_url)}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-[#B8A98A] text-sm font-semibold">{partner.name}</span>
                      )}
                    </div>

                    <p className="font-semibold text-white mb-1 truncate">{partner.name}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-[rgba(249,115,22,0.1)] text-[#F97316] border border-[rgba(249,115,22,0.15)] mb-4">
                      {categoryLabel(partner.category)}
                    </span>

                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,200,100,0.06)]">
                      <label className="flex items-center gap-2 text-xs text-[#B8A98A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleActive(partner)}
                          className="accent-[#F97316]"
                        />
                        Active
                      </label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(partner)} className="text-xs text-[#F97316] hover:underline">
                          Edit
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(partner)} className="text-xs text-red-400 hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={closeModal}>
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-scroll !transform-none hover:!transform-none relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#B8A98A] hover:text-white hover:bg-white/10 transition-colors z-10" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-6 pr-8" style={{ fontFamily: 'var(--font-display)' }}>
              {editingId ? 'Edit Partner' : 'Add Partner'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Partner Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Logo URL</label>
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="https://logo.clearbit.com/sbi.co.in"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Or Upload Logo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, logo_file: e.target.files[0] })}
                  className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F97316]/10 file:text-[#F97316] file:text-sm file:font-medium hover:file:bg-[#F97316]/20 file:cursor-pointer"
                />
                <p className="text-xs text-[#7A6F5F] mt-1">JPG, PNG, WebP up to 5MB. URL takes priority if both provided.</p>
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Website URL</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="form-input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  min={0}
                  className="form-input no-spinner"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="accent-[#F97316] w-4 h-4"
                />
                <span className="text-sm text-[#B8A98A]">Is Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`btn-orange flex-1 ${saving ? 'btn-loading' : ''}`}>
                  {saving ? 'Saving…' : editingId ? 'Update Partner' : 'Create Partner'}
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Partner?</h3>
            <p className="text-sm text-[#B8A98A] mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteTarget.name}</strong>? This action cannot be undone.
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
