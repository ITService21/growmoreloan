import { useCallback, useEffect, useState } from 'react';
import { apiRequest, apiUpload } from '../../utils/adminApi';
import { slugify } from '../../utils/helpers';
import SERVICES from '../../data/services';

const EMPTY_FORM = {
  id: '',
  title: '',
  category: '',
  category_name: '',
  excerpt: '',
  image_url: '',
  image_file: null,
  date: new Date().toISOString().slice(0, 10),
  read_time: '5 min read',
  content: '',
  tags: '',
  seo_title: '',
  seo_description: '',
  is_published: true,
};

function parseContentForSave(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return [{ type: 'paragraph', text: '' }];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    return [{ type: 'paragraph', text: trimmed }];
  } catch {
    return [{ type: 'paragraph', text: trimmed }];
  }
}

function contentToTextarea(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return '';
  }
}

function tagsToInput(tags) {
  if (!tags) return '';
  if (Array.isArray(tags)) return tags.join(', ');
  return String(tags);
}

function tagsToArray(input) {
  if (!input || !input.trim()) return [];
  return input.split(',').map((t) => t.trim()).filter(Boolean);
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/blogs/admin');
      setBlogs(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCategoryChange = (categoryId) => {
    const service = SERVICES.find((s) => s.id === categoryId);
    setForm((prev) => ({
      ...prev,
      category: categoryId,
      category_name: service?.name || prev.category_name,
    }));
  };

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      id: editingId ? prev.id : slugify(title),
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      id: blog.id || '',
      title: blog.title || '',
      category: blog.category || '',
      category_name: blog.category_name || '',
      excerpt: blog.excerpt || '',
      image_url: blog.image_url || '',
      image_file: null,
      date: blog.date || '',
      read_time: blog.read_time || '5 min read',
      content: contentToTextarea(blog.content),
      tags: tagsToInput(blog.tags),
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      is_published: blog.is_published === 1 || blog.is_published === true,
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

    const content = parseContentForSave(form.content);
    const tags = tagsToArray(form.tags);
    const hasFile = form.image_file instanceof File;

    try {
      if (hasFile) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('category', form.category);
        formData.append('category_name', form.category_name);
        formData.append('excerpt', form.excerpt || '');
        formData.append('image_url', '');
        formData.append('date', form.date);
        formData.append('read_time', form.read_time || '5 min read');
        formData.append('content', JSON.stringify(content));
        formData.append('tags', JSON.stringify(tags));
        formData.append('seo_title', form.seo_title || '');
        formData.append('seo_description', form.seo_description || '');
        formData.append('is_published', form.is_published ? '1' : '0');
        formData.append('image_file', form.image_file);

        if (editingId) {
          await apiUpload(`/blogs/${editingId}`, formData, 'PUT');
        } else {
          formData.append('id', form.id);
          await apiUpload('/blogs', formData, 'POST');
        }
      } else {
        const payload = {
          title: form.title,
          category: form.category,
          category_name: form.category_name,
          excerpt: form.excerpt || '',
          image_url: form.image_url || '',
          date: form.date,
          read_time: form.read_time || '5 min read',
          content,
          tags,
          seo_title: form.seo_title || '',
          seo_description: form.seo_description || '',
          is_published: form.is_published ? 1 : 0,
        };

        if (editingId) {
          await apiRequest(`/blogs/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } else {
          await apiRequest('/blogs', {
            method: 'POST',
            body: JSON.stringify({ ...payload, id: form.id }),
          });
        }
      }

      closeModal();
      await fetchBlogs();
    } catch (err) {
      setError(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/blogs/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchBlogs();
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Blog Articles
          </h2>
          <p className="text-sm text-[#B8A98A] mt-1">Create and manage blog articles displayed on the website</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-orange shrink-0">
          + Add Article
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-12 text-center text-[#B8A98A] !transform-none">Loading articles…</div>
      ) : blogs.length === 0 ? (
        <div className="glass-card p-12 text-center !transform-none">
          <p className="text-[#B8A98A] mb-4">No blog articles yet. Create your first article.</p>
          <button type="button" onClick={openCreate} className="btn-orange">
            Add Article
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden !transform-none hover:!transform-none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,200,100,0.06)] text-left">
                  <th className="px-4 py-3 text-[#B8A98A] font-medium">Title</th>
                  <th className="px-4 py-3 text-[#B8A98A] font-medium">Category</th>
                  <th className="px-4 py-3 text-[#B8A98A] font-medium">Date</th>
                  <th className="px-4 py-3 text-[#B8A98A] font-medium">Status</th>
                  <th className="px-4 py-3 text-[#B8A98A] font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => {
                  const isPublished = blog.is_published === 1 || blog.is_published === true;
                  return (
                    <tr key={blog.id} className="border-b border-[rgba(255,200,100,0.04)] hover:bg-[rgba(255,200,100,0.02)]">
                      <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{blog.title}</td>
                      <td className="px-4 py-3 text-[#B8A98A]">{blog.category_name || blog.category}</td>
                      <td className="px-4 py-3 text-[#B8A98A] whitespace-nowrap">{blog.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isPublished
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button type="button" onClick={() => openEdit(blog)} className="text-xs text-[#F97316] hover:underline mr-3">
                          Edit
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(blog)} className="text-xs text-red-400 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={closeModal}>
          <div className="glass-card w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto modal-scroll !transform-none hover:!transform-none relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#B8A98A] hover:text-white hover:bg-white/10 transition-colors z-10" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-6 pr-8" style={{ fontFamily: 'var(--font-display)' }}>
              {editingId ? 'Edit Article' : 'Add Article'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Slug ID *</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  required
                  disabled={!!editingId}
                  className="form-input disabled:opacity-60"
                  placeholder="auto-generated-from-title"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#B8A98A] mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#B8A98A] mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={form.category_name}
                    onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="form-input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Or Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image_file: e.target.files[0], image_url: '' })}
                  className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F97316]/10 file:text-[#F97316] file:text-sm file:font-medium hover:file:bg-[#F97316]/20 file:cursor-pointer"
                />
                <p className="text-xs text-[#7A6F5F] mt-1">JPG, PNG, WebP up to 5MB. Uploaded file takes priority over URL.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#B8A98A] mb-2">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8A98A] mb-2">Read Time</label>
                  <input
                    type="text"
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    placeholder="5 min read"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Content * (JSON array or plain text)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  required
                  className="form-input resize-none font-mono text-xs"
                  placeholder='[{"type":"paragraph","text":"Your content here..."}]'
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="personal loan, rajkot, tips"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">SEO Title</label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B8A98A] mb-2">SEO Description</label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  rows={2}
                  className="form-input resize-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="accent-[#F97316] w-4 h-4"
                />
                <span className="text-sm text-[#B8A98A]">Published</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`btn-orange flex-1 ${saving ? 'btn-loading' : ''}`}>
                  {saving ? 'Saving…' : editingId ? 'Update Article' : 'Create Article'}
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Article?</h3>
            <p className="text-sm text-[#B8A98A] mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteTarget.title}</strong>? This action cannot be undone.
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
