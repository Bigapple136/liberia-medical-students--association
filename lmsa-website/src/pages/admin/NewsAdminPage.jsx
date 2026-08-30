// ============================================
// FILE: src/pages/admin/NewsAdminPage.jsx
// Admin interface for managing news posts
// ============================================
import { useState, useEffect } from 'react';
import {
  Newspaper, Plus, Pencil, Trash2, Loader, Filter,
  Eye, Clock, Archive, Send, X, Save, ChevronDown, ChevronUp,
  Image, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { newsService } from '@services/news.service';
import Select from '@components/common/Select';

// ─── Constants ─────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { value: 'draft',     label: 'Draft',     color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'published', label: 'Published', color: 'bg-lmsa-50 text-lmsa-700 border-lmsa-200' },
  { value: 'archived',  label: 'Archived',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'all',       label: 'All',       color: 'bg-blue-50 text-blue-700 border-blue-200' },
];

const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived',  label: 'Archived' },
];

const CATEGORY_OPTIONS = [
  { value: 'news',         label: 'News' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'achievement',  label: 'Achievement' },
  { value: 'opportunity',  label: 'Opportunity' },
  { value: 'health',       label: 'Health' },
  { value: 'academic',     label: 'Academic' },
  { value: 'event',        label: 'Event' },
];

const CATEGORY_COLORS = {
  news:         'bg-blue-50 text-blue-700',
  announcement: 'bg-purple-50 text-purple-700',
  achievement:  'bg-lmsa-50 text-lmsa-700',
  opportunity:  'bg-amber-50 text-amber-700',
  health:       'bg-red-50 text-red-700',
  academic:     'bg-indigo-50 text-indigo-700',
  event:        'bg-cyan-50 text-cyan-700',
};

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  featured_image_url: '',
  category: 'news',
  status: 'draft',
  tag_ids: [],
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function NewsAdminPage() {
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId]   = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [allTags, setAllTags]         = useState([]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    newsService.getTags()
      .then(setAllTags)
      .catch(() => {});
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const params = activeFilter !== 'all' ? { status: activeFilter } : {};
      const data = await newsService.getAllAdmin(params);
      setPosts(data);
    } catch {
      toast.error('Failed to load news posts');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNew() {
    setEditingPost(null);
    setShowForm(true);
  }

  function handleEdit(post) {
    setEditingPost(post);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingPost(null);
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingPost(null);
    loadPosts();
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await newsService.delete(post.id);
      toast.success('Post deleted');
      loadPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  }

  async function handleQuickStatus(post, newStatus) {
    try {
      await newsService.update(post.id, { ...post, status: newStatus });
      toast.success(`Post ${newStatus}`);
      loadPosts();
    } catch {
      toast.error(`Failed to ${newStatus} post`);
    }
  }

  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
            <Newspaper size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">News Management</h1>
            <p className="text-sm text-gray-500">
              {activeFilter === 'all'
                ? `${posts.length} total posts`
                : `${posts.length} ${activeFilter} post${posts.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Show All
            </button>
          )}
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>
      </div>

      {/* ── Status Filter Tabs ──────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              activeFilter === f.value
                ? f.color + ' border-current'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter size={14} />
            {f.label}
            {f.value === 'draft' && draftCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-gray-200 text-gray-700">
                {draftCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Create/Edit Form ────────────────────────────────────────── */}
      {showForm && (
        <PostForm
          post={editingPost}
          tags={allTags}
          onSave={handleFormSaved}
          onClose={handleFormClose}
        />
      )}

      {/* ── Posts List ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin text-lmsa-600" size={28} />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          message={`No ${activeFilter === 'all' ? '' : activeFilter + ' '}posts`}
          sub={activeFilter === 'all' ? 'Create your first post to get started' : 'Try a different filter'}
        />
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              expanded={expandedId === post.id}
              onToggle={() => setExpandedId(expandedId === post.id ? null : post.id)}
              onEdit={() => handleEdit(post)}
              onDelete={() => handleDelete(post)}
              onQuickStatus={handleQuickStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────
function PostCard({ post, expanded, onToggle, onEdit, onDelete, onQuickStatus }) {
  const statusInfo = STATUS_FILTERS.find(f => f.value === post.status) || STATUS_FILTERS[0];
  const catColor = CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
      {/* Card Header */}
      <div
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Thumbnail */}
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt=""
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Newspaper size={18} className="text-gray-400" />
            </div>
          )}

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm truncate">{post.title}</p>
              {post.category && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                  {post.category}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color} border`}>
                {post.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}
              </span>
              {post.views != null && (
                <span>{post.views} view{post.views !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>

        {/* Expand */}
        <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0 sm:ml-3">
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          {post.excerpt && (
            <p className="text-sm text-gray-600">{post.excerpt}</p>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>

            {post.status !== 'published' && (
              <button
                onClick={(e) => { e.stopPropagation(); onQuickStatus(post, 'published'); }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors"
              >
                <Send size={14} /> Publish
              </button>
            )}

            {post.status === 'published' && (
              <button
                onClick={(e) => { e.stopPropagation(); onQuickStatus(post, 'archived'); }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Archive size={14} /> Archive
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create / Edit Form ────────────────────────────────────────────────────
function PostForm({ post, tags, onSave, onClose }) {
  const isEditing = !!post;
  const [form, setForm] = useState(() => {
    if (post) {
      return {
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image_url: post.featured_image_url || '',
        category: post.category || 'news',
        status: post.status || 'draft',
        tag_ids: post.tag_ids || [],
      };
    }
    return { ...EMPTY_FORM };
  });
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleTagToggle(tagId) {
    setForm(prev => {
      const has = prev.tag_ids.includes(tagId);
      return {
        ...prev,
        tag_ids: has
          ? prev.tag_ids.filter(id => id !== tagId)
          : [...prev.tag_ids, tagId],
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await newsService.update(post.id, form);
        toast.success('Post updated');
      } else {
        await newsService.create(form);
        toast.success('Post created');
      }
      onSave();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to save post';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'New Post'}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Title */}
        <div>
          <Label required>Title</Label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            className="input"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <Label>Excerpt</Label>
          <input
            type="text"
            value={form.excerpt}
            onChange={e => handleChange('excerpt', e.target.value)}
            className="input"
            placeholder="Brief summary (optional)"
          />
        </div>

        {/* Content */}
        <div>
          <Label required>Content</Label>
          <textarea
            value={form.content}
            onChange={e => handleChange('content', e.target.value)}
            className="input resize-none"
            rows={10}
            placeholder="Write your post content here..."
            required
          />
        </div>

        {/* Category + Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            options={CATEGORY_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Featured Image URL */}
        <div>
          <Label>Featured Image URL</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Image size={16} />
            </div>
            <input
              type="url"
              value={form.featured_image_url}
              onChange={e => handleChange('featured_image_url', e.target.value)}
              className="input pl-9"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    form.tag_ids.includes(tag.id)
                      ? 'bg-lmsa-50 text-lmsa-700 border-lmsa-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Tag size={12} />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            {isEditing ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Shared UI Components ──────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <Icon size={40} className="mx-auto mb-3 text-gray-300" />
      <p className="font-medium text-gray-500">{message}</p>
      {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
