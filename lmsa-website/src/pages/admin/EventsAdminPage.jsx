// ============================================
// FILE: src/pages/admin/EventsAdminPage.jsx
// Admin interface for managing events
// ============================================
import { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, Pencil, Trash2, Loader, Filter,
  Clock, Users, X, Save, ChevronDown, ChevronUp,
  Image, MapPin, CheckCircle, PlayCircle, Ban
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eventService } from '@services/event.service';
import { committeeService } from '@services/committee.service';
import Select from '@components/common/Select';

// ─── Constants ─────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { value: 'draft',     label: 'Draft',     color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'upcoming',  label: 'Upcoming',  color: 'bg-lmsa-50 text-lmsa-700 border-lmsa-200' },
  { value: 'ongoing',   label: 'Ongoing',   color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'completed', label: 'Completed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'all',       label: 'All',       color: 'bg-blue-50 text-blue-700 border-blue-200' },
];

const STATUS_OPTIONS = STATUS_FILTERS.filter(f => f.value !== 'all');

const EVENT_TYPE_OPTIONS = [
  { value: 'academic',          label: 'Academic' },
  { value: 'social',            label: 'Social' },
  { value: 'community',         label: 'Community' },
  { value: 'sports',            label: 'Sports' },
  { value: 'general_assembly',  label: 'General Assembly' },
  { value: 'symposium',         label: 'Symposium' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  event_type: 'academic',
  location: '',
  venue: '',
  start_datetime: '',
  end_datetime: '',
  registration_required: false,
  max_attendees: '',
  registration_deadline: '',
  fee: '',
  image_url: '',
  committee_id: '',
  status: 'draft',
};

// ─── Helpers ────────────────────────────────────────────────────────────────
// Convert a value from a <input type="datetime-local"> ("YYYY-MM-DDTHH:mm")
// to a timestamp string Supabase accepts, and back again for display.
function toTimestamp(value) {
  if (!value) return null;
  // datetime-local gives "YYYY-MM-DDTHH:mm"; append seconds for Supabase.
  return value.includes(':') && value.length === 16 ? `${value}:00` : value;
}

function toDateInputValue(value) {
  if (!value) return '';
  // Take "YYYY-MM-DDTHH:mm" portion from a stored timestamp.
  return String(value).slice(0, 16);
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function EventsAdminPage() {
  const [events, setEvents]             = useState([]);
  const [committees, setCommittees]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId]     = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    loadCommittees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  async function loadEvents() {
    setLoading(true);
    try {
      const params = activeFilter !== 'all' ? { status: activeFilter } : {};
      const data = await eventService.getAll(params);
      setEvents(data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  async function loadCommittees() {
    try {
      const data = await committeeService.getAll();
      setCommittees(data);
    } catch {
      // Committee association is optional; non-fatal if it fails.
    }
  }

  function handleCreateNew() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function handleEdit(event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingEvent(null);
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingEvent(null);
    loadEvents();
  }

  async function handleDelete(event) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await eventService.delete(event.id);
      toast.success('Event deleted');
      loadEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  }

  async function handleQuickStatus(event, newStatus) {
    if (newStatus === 'cancelled') {
      if (!window.confirm(`Cancel "${event.title}"? This will mark it as cancelled.`)) return;
    }
    try {
      await eventService.update(event.id, { ...event, status: newStatus });
      toast.success(`Event ${newStatus}`);
      loadEvents();
    } catch {
      toast.error(`Failed to ${newStatus} event`);
    }
  }

  const draftCount = events.filter(e => e.status === 'draft').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Events Management</h1>
            <p className="text-sm text-gray-500">
              {activeFilter === 'all'
                ? `${events.length} total events`
                : `${events.length} ${activeFilter} event${events.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
            New Event
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
        <EventForm
          event={editingEvent}
          committees={committees}
          onSave={handleFormSaved}
          onClose={handleFormClose}
        />
      )}

      {/* ── Events List ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin text-lmsa-600" size={28} />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          message={`No ${activeFilter === 'all' ? '' : activeFilter + ' '}events`}
          sub={activeFilter === 'all' ? 'Create your first event to get started' : 'Try a different filter'}
        />
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              expanded={expandedId === event.id}
              onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
              onEdit={() => handleEdit(event)}
              onDelete={() => handleDelete(event)}
              onQuickStatus={handleQuickStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────
function EventCard({ event, expanded, onToggle, onEdit, onDelete, onQuickStatus }) {
  const statusInfo = STATUS_FILTERS.find(f => f.value === event.status) || STATUS_FILTERS[0];
  const [regs, setRegs]             = useState(null);
  const [loadingRegs, setLoadingRegs] = useState(false);

  async function loadRegistrations() {
    if (regs !== null) return; // already loaded
    setLoadingRegs(true);
    try {
      const data = await eventService.getRegistrations(event.id);
      setRegs(data);
    } catch {
      toast.error('Failed to load registrations');
      setRegs([]);
    } finally {
      setLoadingRegs(false);
    }
  }

  function handleToggleRegs(e) {
    e.stopPropagation();
    if (!expanded) return;
    if (regs === null) loadRegistrations();
    else setRegs(null); // collapse the list (null = not loaded/closed)
  }

  const regCount = regs ? regs.length : (event.registration_count ?? 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
      {/* Card Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Thumbnail */}
          {event.image_url ? (
            <img
              src={event.image_url}
              alt=""
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-gray-400" />
            </div>
          )}

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm truncate">{event.title}</p>
              {event.event_type && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
                  {event.event_type.replace('_', ' ')}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color} border`}>
                {event.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
              {event.start_datetime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(event.start_datetime).toLocaleDateString()}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {event.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users size={12} /> {regCount} registered
              </span>
            </div>
          </div>
        </div>

        {/* Expand */}
        <div className="flex items-center gap-2 shrink-0">
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          {event.description && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
          )}

          {/* Registrations */}
          <div className="border-t border-gray-200 pt-3">
            <button
              onClick={handleToggleRegs}
              disabled={loadingRegs}
              className="flex items-center gap-2 text-sm font-medium text-lmsa-700 hover:underline disabled:opacity-50"
            >
              {loadingRegs ? <Loader size={14} className="animate-spin" /> : <Users size={14} />}
              {regs ? 'Hide registrations' : `View registrations (${regCount})`}
            </button>

            {regs && (
              <div className="mt-2 space-y-1">
                {regs.length === 0 ? (
                  <p className="text-sm text-gray-400">No registrations yet.</p>
                ) : (
                  regs.map(r => (
                    <div
                      key={r.registration_id}
                      className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {r.full_name || 'Unknown user'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{r.email}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
                        {r.registration_status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick status transitions */}
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Change status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.filter(s => s.value !== event.status).map(s => {
                const Icon = s.value === 'cancelled' ? Ban
                  : s.value === 'ongoing' ? PlayCircle
                  : s.value === 'completed' ? CheckCircle
                  : null;
                const cls = s.value === 'cancelled'
                  ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'
                  : s.value === 'completed'
                  ? 'text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'
                  : s.value === 'ongoing'
                  ? 'text-green-700 bg-green-50 border border-green-200 hover:bg-green-100'
                  : 'text-lmsa-700 bg-lmsa-50 border border-lmsa-200 hover:bg-lmsa-100';
                return (
                  <button
                    key={s.value}
                    onClick={(e) => { e.stopPropagation(); onQuickStatus(event, s.value); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${cls}`}
                  >
                    {Icon && <Icon size={14} />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit / Delete */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
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

// ─── Create / Edit Form ──────────────────────────────────────────────────
function EventForm({ event, committees, onSave, onClose }) {
  const isEditing = !!event;
  const [form, setForm] = useState(() => {
    if (event) {
      return {
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || 'academic',
        location: event.location || '',
        venue: event.venue || '',
        start_datetime: toDateInputValue(event.start_datetime),
        end_datetime: toDateInputValue(event.end_datetime),
        registration_required: !!event.registration_required,
        max_attendees: event.max_attendees ?? '',
        registration_deadline: toDateInputValue(event.registration_deadline),
        fee: event.fee ?? '',
        image_url: event.image_url || '',
        committee_id: event.committee_id || '',
        status: event.status || 'draft',
      };
    }
    return { ...EMPTY_FORM };
  });
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.start_datetime) {
      toast.error('Start date/time is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        event_type: form.event_type,
        location: form.location.trim() || null,
        venue: form.venue.trim() || null,
        start_datetime: toTimestamp(form.start_datetime),
        end_datetime: toTimestamp(form.end_datetime),
        registration_required: !!form.registration_required,
        max_attendees: form.max_attendees === '' ? null : Number(form.max_attendees),
        registration_deadline: toTimestamp(form.registration_deadline),
        fee: form.fee === '' ? 0 : Number(form.fee),
        image_url: form.image_url.trim() || null,
        committee_id: form.committee_id || null,
        status: form.status,
      };

      if (isEditing) {
        await eventService.update(event.id, payload);
        toast.success('Event updated');
      } else {
        // Backend forces status to 'upcoming' on create, so set the
        // chosen status explicitly via an immediate update if it differs.
        const created = await eventService.create(payload);
        if (payload.status && payload.status !== 'upcoming') {
          await eventService.update(created.id, { status: payload.status });
        }
        toast.success('Event created');
      }
      onSave();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to save event';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const committeeOptions = [
    { value: '', label: 'None (general event)' },
    ...committees.map(c => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">
          {isEditing ? 'Edit Event' : 'New Event'}
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
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label required>Description</Label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            className="input resize-none"
            rows={6}
            placeholder="Describe the event..."
            required
          />
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Event Type"
            value={form.event_type}
            onChange={e => handleChange('event_type', e.target.value)}
            options={EVENT_TYPE_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Location + Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Location</Label>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              className="input"
              placeholder="City / online"
            />
          </div>
          <div>
            <Label>Venue</Label>
            <input
              type="text"
              value={form.venue}
              onChange={e => handleChange('venue', e.target.value)}
              className="input"
              placeholder="Specific venue / hall"
            />
          </div>
        </div>

        {/* Start + End */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Start Date &amp; Time</Label>
            <input
              type="datetime-local"
              value={form.start_datetime}
              onChange={e => handleChange('start_datetime', e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <Label>End Date &amp; Time</Label>
            <input
              type="datetime-local"
              value={form.end_datetime}
              onChange={e => handleChange('end_datetime', e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Registration deadline */}
        <div>
          <Label>Registration Deadline</Label>
          <input
            type="datetime-local"
            value={form.registration_deadline}
            onChange={e => handleChange('registration_deadline', e.target.value)}
            className="input"
          />
        </div>

        {/* Registration required + max attendees + fee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.registration_required}
              onChange={e => handleChange('registration_required', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-lmsa-600 focus:ring-lmsa-500"
            />
            Registration required
          </label>
          <div>
            <Label>Max Attendees</Label>
            <input
              type="number"
              min="0"
              value={form.max_attendees}
              onChange={e => handleChange('max_attendees', e.target.value)}
              className="input"
              placeholder="Unlimited"
            />
          </div>
          <div>
            <Label>Fee (USD)</Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.fee}
              onChange={e => handleChange('fee', e.target.value)}
              className="input"
              placeholder="0"
            />
          </div>
        </div>

        {/* Committee association */}
        <div>
          <Label>Committee (optional)</Label>
          <Select
            value={form.committee_id}
            onChange={e => handleChange('committee_id', e.target.value)}
            options={committeeOptions}
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
              value={form.image_url}
              onChange={e => handleChange('image_url', e.target.value)}
              className="input pl-9"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

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
            {isEditing ? 'Save Changes' : 'Create Event'}
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
