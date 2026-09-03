// ============================================
// FILE: src/pages/admin/ExecutiveAdminPage.jsx
// Admin interface for managing executive positions
// ============================================
import { useState, useEffect, useCallback } from 'react';
import {
  Crown, Plus, Pencil, Trash2, Loader, User,
  Search, X, Check, ChevronDown, ChevronUp,
  CalendarDays, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { executiveService } from '@services/executive.service';
import NominationsAdminPanel from '@components/admin/NominationsAdminPanel';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-lmsa-50 text-lmsa-700 border-lmsa-200' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const DEFAULT_FORM = {
  position_name: '',
  position_rank: 0,
  user_id: '',
  academic_year: '2025-2026',
  elected_at: '',
  term_start: '',
  term_end: '',
  status: 'active',
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ExecutiveAdminPage() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [view, setView] = useState('positions');

  const loadPositions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await executiveService.getAllAdmin();
      setPositions(data || []);
    } catch {
      toast.error('Failed to load executive positions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  // Filter positions
  const filtered = statusFilter === 'all'
    ? positions
    : positions.filter(p => p.status === statusFilter);

  // ── User search ────────────────────────────────────────────────────────
  let searchTimeout = null;
  function handleUserSearch(value) {
    setUserSearch(value);
    setSelectedUser(null);
    if (value.length < 2) {
      setUserResults([]);
      return;
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const results = await executiveService.searchUsers(value);
        setUserResults(results || []);
      } catch {
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);
  }

  function selectUser(user) {
    setSelectedUser(user);
    setUserSearch(user.full_name || user.email);
    setUserResults([]);
    setForm(f => ({ ...f, user_id: user.id }));
  }

  // ── Create / Edit ──────────────────────────────────────────────────────
  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setSelectedUser(null);
    setUserSearch('');
    setShowForm(true);
  }

  function openEdit(pos) {
    setEditingId(pos.id);
    setForm({
      position_name: pos.position_name || '',
      position_rank: pos.position_rank || 0,
      user_id: pos.user_id || '',
      academic_year: pos.academic_year || '2025-2026',
      elected_at: pos.elected_at ? pos.elected_at.split('T')[0] : '',
      term_start: pos.term_start ? pos.term_start.split('T')[0] : '',
      term_end: pos.term_end ? pos.term_end.split('T')[0] : '',
      status: pos.status || 'active',
    });
    setSelectedUser(pos.user_id ? { id: pos.user_id, full_name: pos.holder_name } : null);
    setUserSearch(pos.holder_name || '');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.position_name.trim()) {
      toast.error('Position name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        position_rank: Number(form.position_rank) || 0,
        user_id: form.user_id || null,
        elected_at: form.elected_at || null,
        term_start: form.term_start || null,
        term_end: form.term_end || null,
      };
      if (editingId) {
        await executiveService.update(editingId, payload);
        toast.success('Position updated');
      } else {
        await executiveService.create(payload);
        toast.success('Position created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(DEFAULT_FORM);
      setSelectedUser(null);
      loadPositions();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save position');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await executiveService.deletePosition(id);
      toast.success('Position deleted');
      setPositions(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete position');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
            <Crown size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Executive Positions</h1>
            <p className="text-sm text-gray-500">
              {positions.length} total position{positions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Add Position
        </button>
      </div>

      {/* ── View toggle ──────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'positions', label: 'Positions' },
          { id: 'nominations', label: 'Nominations & election cycle' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              view === v.id
                ? 'bg-lmsa-50 text-lmsa-700 border-lmsa-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {v.id === 'nominations' ? <CalendarDays size={14} /> : <Shield size={14} />}
            {v.label}
          </button>
        ))}
      </div>

      {view === 'nominations' ? (
        <NominationsAdminPanel />
      ) : (
        <>

      {/* ── Status Filter Tabs ────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              statusFilter === s.value
                ? s.color + ' border-current'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Shield size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Create / Edit Form ────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">
              {editingId ? 'Edit Position' : 'Create Position'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Position Name *</Label>
                <input
                  className="input"
                  placeholder="e.g. President, Vice President"
                  value={form.position_name}
                  onChange={e => setForm(f => ({ ...f, position_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Rank (ordering)</Label>
                <input
                  className="input"
                  type="number"
                  placeholder="1 = highest priority"
                  value={form.position_rank}
                  onChange={e => setForm(f => ({ ...f, position_rank: e.target.value }))}
                />
              </div>
            </div>

            {/* User picker */}
            <div className="relative">
              <Label>Assign User (optional)</Label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-9"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={e => handleUserSearch(e.target.value)}
                />
                {searchingUsers && (
                  <Loader size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>
              {userResults.length > 0 && !selectedUser && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {userResults.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => selectUser(user)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-lmsa-100 flex items-center justify-center text-lmsa-700 font-bold text-xs shrink-0">
                        {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedUser && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-lmsa-50 rounded-lg text-sm">
                  <User size={14} className="text-lmsa-600" />
                  <span className="font-medium text-lmsa-800">{selectedUser.full_name}</span>
                  <button
                    type="button"
                    onClick={() => { setSelectedUser(null); setUserSearch(''); setForm(f => ({ ...f, user_id: '' })); }}
                    className="ml-auto p-0.5 rounded hover:bg-lmsa-100"
                  >
                    <X size={14} className="text-lmsa-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Academic Year</Label>
                <input
                  className="input"
                  placeholder="2025-2026"
                  value={form.academic_year}
                  onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))}
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="input"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label>Elected Date</Label>
                <input
                  className="input"
                  type="date"
                  value={form.elected_at}
                  onChange={e => setForm(f => ({ ...f, elected_at: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Term Start</Label>
                <input
                  className="input"
                  type="date"
                  value={form.term_start}
                  onChange={e => setForm(f => ({ ...f, term_start: e.target.value }))}
                />
              </div>
              <div>
                <Label>Term End</Label>
                <input
                  className="input"
                  type="date"
                  value={form.term_end}
                  onChange={e => setForm(f => ({ ...f, term_end: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                {editingId ? 'Save Changes' : 'Create Position'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Positions List ────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin text-lmsa-600" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Crown size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">
            {statusFilter === 'all' ? 'No positions yet' : `No ${statusFilter} positions`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {statusFilter === 'all' ? 'Create your first executive position above.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(pos => (
            <div key={pos.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === pos.id ? null : pos.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-lmsa-100 flex items-center justify-center text-lmsa-700 font-bold text-sm shrink-0">
                    {pos.holder_photo_url ? (
                      <img src={pos.holder_photo_url} alt={pos.holder_name} className="w-full h-full rounded-full object-cover" />
                    ) : pos.holder_name ? (
                      pos.holder_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                    ) : (
                      <Crown size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">{pos.position_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        pos.status === 'active' ? 'bg-lmsa-50 text-lmsa-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {pos.status}
                      </span>
                      <span className="text-xs text-gray-400">#{pos.position_rank}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      {pos.holder_name ? (
                        <span className="flex items-center gap-1">
                          <User size={12} /> {pos.holder_name}
                          {pos.holder_year_level && <span className="text-gray-400">· Year {pos.holder_year_level}</span>}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No user assigned</span>
                      )}
                      {pos.academic_year && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} /> {pos.academic_year}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0 sm:ml-3">
                  {expandedId === pos.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === pos.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {pos.elected_at && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Elected</p>
                        <p className="text-sm text-gray-700">{new Date(pos.elected_at).toLocaleDateString()}</p>
                      </div>
                    )}
                    {pos.term_start && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Term Start</p>
                        <p className="text-sm text-gray-700">{new Date(pos.term_start).toLocaleDateString()}</p>
                      </div>
                    )}
                    {pos.term_end && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Term End</p>
                        <p className="text-sm text-gray-700">{new Date(pos.term_end).toLocaleDateString()}</p>
                      </div>
                    )}
                    {pos.created_at && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Created</p>
                        <p className="text-sm text-gray-700">{new Date(pos.created_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(pos)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-lmsa-700 bg-lmsa-50 border border-lmsa-200 rounded-lg hover:bg-lmsa-100 transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pos.id, pos.position_name)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

// ─── Shared UI Component ────────────────────────────────────────────────────
function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}
