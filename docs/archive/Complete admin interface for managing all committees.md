// ============================================
// FILE: src/pages/admin/CommitteeAdminDashboard.jsx
// Complete admin interface for managing all committees
// ============================================
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Heart, FileText, Users, Utensils, Scale,
  Trophy, DollarSign, Globe, UserPlus, Megaphone, HandHeart,
  Edit3, Plus, Trash2, Upload, Save, X, Eye, ChevronRight,
  Bell, Award, BarChart2, Calendar, Download, Search,
  Check, AlertCircle, ExternalLink, Mail, Phone, Image,
  Loader, ArrowLeft, Settings, MoreVertical, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { committeeService } from '@services/committee.service';
import { eventService } from '@services/event.service';

// ─── Icon Map ────────────────────────────────────────────────────────────────
const ICON_MAP = {
  BookOpen, Heart, FileText, Users, Utensils, Scale,
  Trophy, DollarSign, Globe, UserPlus, Megaphone, HandHeart,
};

// ─── All 12 Committee Definitions (slug-keyed) ───────────────────────────────
const COMMITTEE_DEFAULTS = {
  academic:      { icon: 'BookOpen',  color: '#0C8950' },
  health:        { icon: 'Heart',     color: '#DC143C' },
  'research-journal': { icon: 'FileText', color: '#1976D2' },
  'social-program':   { icon: 'Users',    color: '#FFB300' },
  dietary:       { icon: 'Utensils',  color: '#0C8950' },
  judicial:      { icon: 'Scale',     color: '#4B5563' },
  sports:        { icon: 'Trophy',    color: '#FFB300' },
  auditing:      { icon: 'DollarSign',color: '#1976D2' },
  'foreign-affairs':  { icon: 'Globe',    color: '#0C8950' },
  membership:    { icon: 'UserPlus',  color: '#DC143C' },
  'media-publicity':  { icon: 'Megaphone',color: '#FFB300' },
  welfare:       { icon: 'HandHeart', color: '#0C8950' },
};

const TABS = [
  { id: 'details',       label: 'Details',       icon: Edit3 },
  { id: 'members',       label: 'Members',       icon: Users },
  { id: 'events',        label: 'Events',        icon: Calendar },
  { id: 'documents',     label: 'Documents',     icon: FileText },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'achievements',  label: 'Achievements',  icon: Award },
  { id: 'analytics',     label: 'Analytics',     icon: BarChart2 },
];

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function CommitteeAdminDashboard() {
  const [committees, setCommittees]       = useState([]);
  const [activeCommittee, setActive]      = useState(null);
  const [activeTab, setActiveTab]         = useState('details');
  const [loading, setLoading]             = useState(true);
  const [sidebarOpen, setSidebarOpen]     = useState(true);

  useEffect(() => {
    loadCommittees();
  }, []);

  async function loadCommittees() {
    try {
      const data = await committeeService.getAll();
      setCommittees(data);
      if (data.length > 0) setActive(data[0]);
    } catch (e) {
      toast.error('Failed to load committees');
    } finally {
      setLoading(false);
    }
  }

  function handleCommitteeUpdate(updated) {
    setCommittees(prev => prev.map(c => c.id === updated.id ? updated : c));
    setActive(updated);
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Panel</p>
              <h2 className="font-bold text-gray-900 text-lg">Committees</h2>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft size={18} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Committee List */}
        <nav className="flex-1 overflow-y-auto py-2">
          {committees.map(c => {
            const defaults = COMMITTEE_DEFAULTS[c.slug] || {};
            const Icon = ICON_MAP[defaults.icon] || BookOpen;
            const isActive = activeCommittee?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { setActive(c); setActiveTab('details'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-lmsa-50 text-lmsa-700 border-r-2 border-lmsa-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-lmsa-600' : 'bg-gray-100'}`}>
                  <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.member_count || 0} members</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={14} />
              Back to Admin
            </Link>
          </div>
        )}
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeCommittee ? (
          <>
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {(() => {
                  const defaults = COMMITTEE_DEFAULTS[activeCommittee.slug] || {};
                  const Icon = ICON_MAP[defaults.icon] || BookOpen;
                  return (
                    <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">{activeCommittee.name}</h1>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    activeCommittee.status === 'active'
                      ? 'bg-lmsa-50 text-lmsa-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeCommittee.status || 'active'}
                  </span>
                </div>
              </div>
              <Link
                to={`/committees/${activeCommittee.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm text-lmsa-600 border border-lmsa-200 rounded-lg hover:bg-lmsa-50 transition-colors"
              >
                <Eye size={15} />
                View Public Page
                <ExternalLink size={13} />
              </Link>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 shrink-0">
              <div className="flex gap-1 overflow-x-auto">
                {TABS.map(tab => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-lmsa-600 text-lmsa-600'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <TabIcon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details'       && <DetailsTab committee={activeCommittee} onSave={handleCommitteeUpdate} />}
              {activeTab === 'members'       && <MembersTab committee={activeCommittee} onUpdate={handleCommitteeUpdate} />}
              {activeTab === 'events'        && <EventsTab  committee={activeCommittee} />}
              {activeTab === 'documents'     && <DocumentsTab committee={activeCommittee} />}
              {activeTab === 'announcements' && <AnnouncementsTab committee={activeCommittee} />}
              {activeTab === 'achievements'  && <AchievementsTab committee={activeCommittee} />}
              {activeTab === 'analytics'     && <AnalyticsTab committee={activeCommittee} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Settings size={48} className="mx-auto mb-3 opacity-30" />
              <p>Select a committee to manage</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Details ─────────────────────────────────────────────────────────────
function DetailsTab({ committee, onSave }) {
  const [form, setForm] = useState({
    name:           committee.name || '',
    description:    committee.description || '',
    mandate:        committee.mandate || [''],
    key_activities: committee.key_activities || [''],
    email:          committee.email || '',
    status:         committee.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  // Keep form in sync if committee switches
  useEffect(() => {
    setForm({
      name:           committee.name || '',
      description:    committee.description || '',
      mandate:        committee.mandate?.length ? committee.mandate : [''],
      key_activities: committee.key_activities?.length ? committee.key_activities : [''],
      email:          committee.email || '',
      status:         committee.status || 'active',
    });
  }, [committee.id]);

  function addItem(field) {
    setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  }

  function removeItem(field, idx) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  }

  function updateItem(field, idx, val) {
    setForm(f => {
      const arr = [...f[field]];
      arr[idx] = val;
      return { ...f, [field]: arr };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await committeeService.update(committee.id, {
        ...form,
        mandate:        form.mandate.filter(Boolean),
        key_activities: form.key_activities.filter(Boolean),
      });
      onSave(updated);
      toast.success('Committee updated successfully');
    } catch (e) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Committee Name</Label>
            <input
              className="input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label>Contact Email</Label>
            <input
              className="input"
              type="email"
              placeholder="committee@lmsa.org"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
          <div className="col-span-2">
            <Label>Description</Label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Committee Mandate" subtitle="List the official responsibilities of this committee">
        <div className="space-y-2">
          {form.mandate.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-lmsa-100 flex items-center justify-center shrink-0 mt-2.5">
                <span className="text-xs font-bold text-lmsa-600">{idx + 1}</span>
              </div>
              <input
                className="input flex-1"
                value={item}
                placeholder="Add mandate item..."
                onChange={e => updateItem('mandate', idx, e.target.value)}
              />
              <button onClick={() => removeItem('mandate', idx)} className="mt-2 text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('mandate')}
            className="flex items-center gap-2 text-sm text-lmsa-600 hover:text-lmsa-700 mt-2"
          >
            <Plus size={14} /> Add Mandate Item
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Key Activities" subtitle="Programs and activities this committee runs">
        <div className="grid grid-cols-2 gap-2">
          {form.key_activities.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                value={item}
                placeholder="Activity name..."
                onChange={e => updateItem('key_activities', idx, e.target.value)}
              />
              <button onClick={() => removeItem('key_activities', idx)} className="text-gray-400 hover:text-red-500">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addItem('key_activities')}
          className="flex items-center gap-2 text-sm text-lmsa-600 hover:text-lmsa-700 mt-3"
        >
          <Plus size={14} /> Add Activity
        </button>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Members ─────────────────────────────────────────────────────────────
function MembersTab({ committee, onUpdate }) {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setModal]   = useState(false);
  const [search, setSearch]     = useState('');
  const [newMember, setNew]     = useState({ user_id: '', position: 'Member', year: '' });
  const [userResults, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [committee.id]);

  async function loadMembers() {
    setLoading(true);
    try {
      const data = await committeeService.getMembers(committee.id);
      setMembers(data);
    } catch {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }

  async function searchUsers(q) {
    if (!q || q.length < 2) { setUsers([]); return; }
    setSearching(true);
    try {
      const results = await committeeService.searchUsers(q);
      setUsers(results);
    } finally {
      setSearching(false);
    }
  }

  async function addMember() {
    if (!newMember.user_id) { toast.error('Select a user'); return; }
    try {
      await committeeService.addMember(committee.id, newMember);
      toast.success('Member added');
      setModal(false);
      setNew({ user_id: '', position: 'Member', year: '' });
      setUsers([]);
      loadMembers();
    } catch {
      toast.error('Failed to add member');
    }
  }

  async function removeMember(memberId) {
    if (!confirm('Remove this member?')) return;
    try {
      await committeeService.removeMember(committee.id, memberId);
      setMembers(m => m.filter(x => x.id !== memberId));
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  }

  async function updateRole(memberId, position) {
    try {
      await committeeService.updateMemberRole(committee.id, memberId, position);
      setMembers(m => m.map(x => x.id === memberId ? { ...x, position } : x));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  }

  const ROLES = ['Chair', 'Vice Chair', 'Secretary', 'Member'];
  const filtered = members.filter(m =>
    m.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900">Committee Members</h2>
          <p className="text-sm text-gray-500">{members.length} members total</p>
        </div>
        <button onClick={() => setModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-lmsa-600" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No members found</td></tr>
              ) : filtered.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {member.profile_photo_url ? (
                        <img src={member.profile_photo_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-lmsa-100 flex items-center justify-center text-lmsa-700 font-bold text-sm">
                          {member.full_name?.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">Year {member.year_level}</td>
                  <td className="px-4 py-3">
                    <select
                      value={member.position}
                      onChange={e => updateRole(member.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-lmsa-500"
                    >
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeMember(member.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <Modal title="Add Committee Member" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <Label>Search Student</Label>
              <input
                className="input"
                placeholder="Type name or email..."
                onChange={e => searchUsers(e.target.value)}
              />
              {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
              {userResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                  {userResults.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { setNew(f => ({ ...f, user_id: u.id })); setUsers([]); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-lmsa-50 text-left ${newMember.user_id === u.id ? 'bg-lmsa-50' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-lmsa-100 flex items-center justify-center text-xs font-bold text-lmsa-700">
                        {u.full_name?.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.full_name}</p>
                        <p className="text-xs text-gray-400">Year {u.year_level} • {u.email}</p>
                      </div>
                      {newMember.user_id === u.id && <Check size={14} className="ml-auto text-lmsa-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Role / Position</Label>
              <select className="input" value={newMember.position} onChange={e => setNew(f => ({ ...f, position: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="btn flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button onClick={addMember} className="btn btn-primary flex-1">Add Member</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Tab: Events ──────────────────────────────────────────────────────────────
function EventsTab({ committee }) {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', event_type: 'academic',
    location: '', start_datetime: '', end_datetime: '',
    registration_required: false, max_attendees: '', fee: '0',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadEvents(); }, [committee.id]);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await committeeService.getEvents(committee.id);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  async function createEvent() {
    setSaving(true);
    try {
      await committeeService.createEvent(committee.id, form);
      toast.success('Event created');
      setShowForm(false);
      setForm({ title:'', description:'', event_type:'academic', location:'', start_datetime:'', end_datetime:'', registration_required:false, max_attendees:'', fee:'0' });
      loadEvents();
    } catch {
      toast.error('Failed to create event');
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    try {
      await committeeService.deleteEvent(committee.id, id);
      setEvents(e => e.filter(x => x.id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  }

  const EVENT_TYPES = ['academic','social','community','sports','general_assembly','symposium'];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900">Committee Events</h2>
          <p className="text-sm text-gray-500">{events.length} events total</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {/* Create Event Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">New Event</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Event Title</Label>
              <input className="input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </div>
            <div>
              <Label>Event Type</Label>
              <select className="input" value={form.event_type} onChange={e => setForm(f => ({...f, event_type: e.target.value}))}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
              </select>
            </div>
            <div>
              <Label>Location</Label>
              <input className="input" placeholder="Venue or online" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
            </div>
            <div>
              <Label>Start Date & Time</Label>
              <input className="input" type="datetime-local" value={form.start_datetime} onChange={e => setForm(f => ({...f, start_datetime: e.target.value}))} />
            </div>
            <div>
              <Label>End Date & Time</Label>
              <input className="input" type="datetime-local" value={form.end_datetime} onChange={e => setForm(f => ({...f, end_datetime: e.target.value}))} />
            </div>
            <div>
              <Label>Fee (USD, 0 for free)</Label>
              <input className="input" type="number" min="0" value={form.fee} onChange={e => setForm(f => ({...f, fee: e.target.value}))} />
            </div>
            <div>
              <Label>Max Attendees (optional)</Label>
              <input className="input" type="number" min="0" placeholder="Unlimited" value={form.max_attendees} onChange={e => setForm(f => ({...f, max_attendees: e.target.value}))} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="reg_req" checked={form.registration_required} onChange={e => setForm(f => ({...f, registration_required: e.target.checked}))} className="w-4 h-4 accent-lmsa-600" />
              <label htmlFor="reg_req" className="text-sm text-gray-700">Require registration</label>
            </div>
            <div className="col-span-2 flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button onClick={createEvent} disabled={saving} className="btn btn-primary flex items-center gap-2">
                {saving ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-lmsa-600" /></div>
      ) : events.length === 0 ? (
        <EmptyState icon={Calendar} message="No events yet" sub="Create the first event for this committee" />
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="text-center bg-lmsa-50 rounded-lg px-3 py-2 min-w-[52px]">
                  <p className="text-xs text-lmsa-600 font-semibold">{new Date(ev.start_datetime).toLocaleString('default',{month:'short'})}</p>
                  <p className="text-xl font-bold text-lmsa-700">{new Date(ev.start_datetime).getDate()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{ev.location} • {ev.event_type}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ev.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                      ev.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                      'bg-lmsa-50 text-lmsa-700'
                    }`}>{ev.status}</span>
                    {ev.registration_required && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Registration required</span>
                    )}
                    {ev.fee > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">${ev.fee}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/events/${ev.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                  <ExternalLink size={15} />
                </Link>
                <button onClick={() => deleteEvent(ev.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Documents ───────────────────────────────────────────────────────────
function DocumentsTab({ committee }) {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef                 = useRef(null);
  const [meta, setMeta]         = useState({ title: '', category: 'report', access_level: 'members' });

  useEffect(() => { loadDocs(); }, [committee.id]);

  async function loadDocs() {
    setLoading(true);
    try {
      const data = await committeeService.getDocuments(committee.id);
      setDocs(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!meta.title) { toast.error('Enter a document title first'); return; }
    setUploading(true);
    try {
      await committeeService.uploadDocument(committee.id, file, meta);
      toast.success('Document uploaded');
      loadDocs();
      setMeta({ title: '', category: 'report', access_level: 'members' });
      fileRef.current.value = '';
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function deleteDoc(id) {
    if (!confirm('Delete this document?')) return;
    try {
      await committeeService.deleteDocument(committee.id, id);
      setDocs(d => d.filter(x => x.id !== id));
      toast.success('Document deleted');
    } catch { toast.error('Delete failed'); }
  }

  const CATEGORIES = ['charter', 'bylaws', 'report', 'minutes', 'newsletter', 'study_material', 'other'];
  const ACCESS_LEVELS = ['public', 'members', 'executive', 'admin'];

  const catIcon = (cat) => {
    const icons = { charter: '📜', bylaws: '⚖️', report: '📊', minutes: '📝', newsletter: '📰', study_material: '📚', other: '📄' };
    return icons[cat] || '📄';
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="font-bold text-gray-900">Documents & Resources</h2>
        <p className="text-sm text-gray-500">Upload charters, meeting minutes, reports, and other files</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Document</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-3 sm:col-span-1">
            <Label>Document Title</Label>
            <input className="input" placeholder="e.g. Meeting Minutes Jan 2026" value={meta.title} onChange={e => setMeta(f => ({...f, title: e.target.value}))} />
          </div>
          <div>
            <Label>Category</Label>
            <select className="input" value={meta.category} onChange={e => setMeta(f => ({...f, category: e.target.value}))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <Label>Access Level</Label>
            <select className="input" value={meta.access_level} onChange={e => setMeta(f => ({...f, access_level: e.target.value}))}>
              {ACCESS_LEVELS.map(a => <option key={a} value={a}>{a.replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-lmsa-400 hover:bg-lmsa-50 transition-colors"
        >
          {uploading ? (
            <><Loader size={24} className="animate-spin mx-auto mb-2 text-lmsa-600" /><p className="text-sm text-gray-500">Uploading...</p></>
          ) : (
            <><Upload size={24} className="mx-auto mb-2 text-gray-400" /><p className="text-sm text-gray-600 font-medium">Click to upload file</p><p className="text-xs text-gray-400 mt-1">PDF, DOC, images up to 10MB</p></>
          )}
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.jpg,.png,.xlsx" />
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-lmsa-600" /></div>
      ) : docs.length === 0 ? (
        <EmptyState icon={FileText} message="No documents uploaded" sub="Upload charters, reports, and meeting minutes" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Document</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Access</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Uploaded</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{catIcon(doc.category)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-400">{doc.file_type?.toUpperCase()} • {doc.file_size ? `${Math.round(doc.file_size/1024)}KB` : '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{doc.category?.replace('_',' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${doc.access_level === 'public' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {doc.access_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Download size={14} />
                      </a>
                      <button onClick={() => deleteDoc(doc.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Announcements ───────────────────────────────────────────────────────
function AnnouncementsTab({ committee }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setForm]   = useState(false);
  const [form, setFormData]   = useState({ title: '', message: '', type: 'info', pinned: false });
  const [saving, setSaving]   = useState(false);

  useEffect(() => { load(); }, [committee.id]);

  async function load() {
    setLoading(true);
    try { setItems(await committeeService.getAnnouncements(committee.id)); }
    finally { setLoading(false); }
  }

  async function create() {
    if (!form.title || !form.message) { toast.error('Fill all fields'); return; }
    setSaving(true);
    try {
      await committeeService.createAnnouncement(committee.id, form);
      toast.success('Announcement created');
      setForm(false);
      setFormData({ title:'', message:'', type:'info', pinned:false });
      load();
    } catch { toast.error('Failed to create announcement'); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm('Delete this announcement?')) return;
    try {
      await committeeService.deleteAnnouncement(committee.id, id);
      setItems(i => i.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  }

  const TYPE_STYLES = {
    info:    'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-lmsa-50 border-lmsa-200 text-lmsa-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    urgent:  'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500">Committee-specific announcements shown on the public page</p>
        </div>
        <button onClick={() => setForm(v => !v)} className="btn btn-primary flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <input className="input" value={form.title} onChange={e => setFormData(f=>({...f,title:e.target.value}))} />
            </div>
            <div>
              <Label>Message</Label>
              <textarea className="input resize-none" rows={3} value={form.message} onChange={e => setFormData(f=>({...f,message:e.target.value}))} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Type</Label>
                <select className="input" value={form.type} onChange={e => setFormData(f=>({...f,type:e.target.value}))}>
                  {['info','success','warning','urgent'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setFormData(f=>({...f,pinned:e.target.checked}))} className="w-4 h-4 accent-lmsa-600" />
                <label htmlFor="pinned" className="text-sm text-gray-700">Pin to top</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setForm(false)} className="btn flex-1 bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={create} disabled={saving} className="btn btn-primary flex-1">
                {saving ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-lmsa-600" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} message="No announcements" sub="Create announcements to display on the committee page" />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`rounded-xl border p-4 ${TYPE_STYLES[item.type] || TYPE_STYLES.info} relative`}>
              {item.pinned && <span className="absolute top-3 right-10 text-xs font-semibold opacity-60">📌 Pinned</span>}
              <div className="flex justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                <button onClick={() => remove(item.id)} className="opacity-50 hover:opacity-100"><Trash2 size={14} /></button>
              </div>
              <p className="text-sm mt-1 opacity-80">{item.message}</p>
              <p className="text-xs mt-2 opacity-50">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Achievements ────────────────────────────────────────────────────────
function AchievementsTab({ committee }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setForm]   = useState(false);
  const [form, setFormData]   = useState({ title: '', description: '', date: '', badge_emoji: '🏆' });
  const [saving, setSaving]   = useState(false);

  useEffect(() => { load(); }, [committee.id]);

  async function load() {
    setLoading(true);
    try { setItems(await committeeService.getAchievements(committee.id)); }
    finally { setLoading(false); }
  }

  async function create() {
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      await committeeService.createAchievement(committee.id, form);
      toast.success('Achievement added');
      setForm(false);
      setFormData({ title:'', description:'', date:'', badge_emoji:'🏆' });
      load();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm('Delete this achievement?')) return;
    try {
      await committeeService.deleteAchievement(committee.id, id);
      setItems(i => i.filter(x => x.id !== id));
    } catch { toast.error('Failed'); }
  }

  const EMOJIS = ['🏆','🥇','🎖️','⭐','🌟','💡','🎯','🏅','🎗️','🔬','📜','🤝'];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900">Achievements & Milestones</h2>
          <p className="text-sm text-gray-500">Highlight committee accomplishments on the public page</p>
        </div>
        <button onClick={() => setForm(v => !v)} className="btn btn-primary flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Achievement'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Badge Emoji</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setFormData(f=>({...f,badge_emoji:e}))}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${form.badge_emoji === e ? 'border-lmsa-600 bg-lmsa-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <input className="input" placeholder="e.g. Best Committee Award 2025" value={form.title} onChange={e => setFormData(f=>({...f,title:e.target.value}))} />
            </div>
            <div>
              <Label>Description</Label>
              <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setFormData(f=>({...f,description:e.target.value}))} />
            </div>
            <div>
              <Label>Date</Label>
              <input className="input" type="date" value={form.date} onChange={e => setFormData(f=>({...f,date:e.target.value}))} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setForm(false)} className="btn flex-1 bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={create} disabled={saving} className="btn btn-primary flex-1">
                {saving ? 'Saving...' : 'Add Achievement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-lmsa-600" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Award} message="No achievements yet" sub="Add milestones and accomplishments for this committee" />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 relative group">
              <button onClick={() => remove(item.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                <Trash2 size={14} />
              </button>
              <div className="text-3xl mb-2">{item.badge_emoji}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
              {item.date && <p className="text-xs text-gray-400 mt-2">{new Date(item.date).toLocaleDateString('default',{year:'numeric',month:'long'})}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────
function AnalyticsTab({ committee }) {
  const stats = [
    { label: 'Total Members', value: committee.member_count || 0, icon: Users, color: 'text-lmsa-600', bg: 'bg-lmsa-50' },
    { label: 'Active Events', value: committee.active_events || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Documents', value: committee.doc_count || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Page Views', value: committee.views || '—', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-4xl">
      <h2 className="font-bold text-gray-900 mb-6">Committee Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400">
        <BarChart2 size={48} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">Detailed analytics coming soon</p>
        <p className="text-sm mt-1">Connect Google Analytics or Supabase telemetry for charts</p>
      </div>
    </div>
  );
}

// ─── Shared UI Components ─────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
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

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size={32} className="animate-spin text-lmsa-600 mx-auto mb-3" />
        <p className="text-gray-500">Loading committees...</p>
      </div>
    </div>
  );
}