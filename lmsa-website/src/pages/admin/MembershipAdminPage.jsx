// ============================================
// FILE: src/pages/admin/MembershipAdminPage.jsx
// Admin interface for reviewing membership applications
// ============================================
import { useState, useEffect } from 'react';
import {
  UserPlus, Check, X, Loader, Filter,
  Mail, BookOpen, Hash, FileText,
  ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { membershipService } from '@services/membership.service';

// ─── Status Config ──────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { value: 'pending',   label: 'Pending',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'approved',  label: 'Approved',  color: 'bg-lmsa-50 text-lmsa-700 border-lmsa-200' },
  { value: 'rejected',  label: 'Rejected',  color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'all',       label: 'All',       color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const MEMBERSHIP_TYPES = {
  full:      { label: 'Full Member',      color: 'bg-lmsa-50 text-lmsa-700' },
  associate: { label: 'Associate Member', color: 'bg-blue-50 text-blue-700' },
  honorary:  { label: 'Honorary Member',  color: 'bg-purple-50 text-purple-700' },
  veteran:   { label: 'Veteran Member',   color: 'bg-amber-50 text-amber-700' },
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function MembershipAdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('pending');
  const [expandedId, setExpandedId]     = useState(null);

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await membershipService.getAll(activeFilter);
      setApplications(data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  function handleStatusUpdate(id, newStatus) {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, application_status: newStatus } : a)
    );
  }

  const pendingCount = applications.filter(a => a.application_status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
            <UserPlus size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Membership Applications</h1>
            <p className="text-sm text-gray-500">
              {activeFilter === 'all'
                ? `${applications.length} total applications`
                : `${applications.length} ${activeFilter} application${applications.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        {activeFilter !== 'pending' && (
          <button
            onClick={() => setActiveFilter('pending')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            View Pending Queue
          </button>
        )}
      </div>

      {/* ── Status Filter Tabs ────────────────────────────────────────── */}
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
            {f.value === 'pending' && pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-200 text-amber-800">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Applications List ─────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin text-lmsa-600" size={28} />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          message={`No ${activeFilter === 'all' ? '' : activeFilter + ' '}applications`}
          sub={activeFilter === 'pending' ? 'All caught up!' : 'Try a different filter'}
        />
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              expanded={expandedId === app.id}
              onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Application Card ───────────────────────────────────────────────────────
function ApplicationCard({ application, expanded, onToggle, onStatusUpdate }) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [acting, setActing]           = useState(false);

  const app = application;
  const typeInfo = MEMBERSHIP_TYPES[app.membership_type] || MEMBERSHIP_TYPES.full;
  const statusInfo = STATUS_FILTERS.find(f => f.value === app.application_status) || STATUS_FILTERS[3];

  async function handleAction(status) {
    if (acting) return;
    setActing(true);
    try {
      await membershipService.updateStatus(app.id, status, reviewNotes);
      toast.success(`Application ${status}`);
      onStatusUpdate(app.id, status);
      setReviewNotes('');
      onToggle();
    } catch {
      toast.error(`Failed to ${status} application`);
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
      {/* Card Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Applicant Avatar */}
          <div className="w-10 h-10 rounded-full bg-lmsa-100 flex items-center justify-center text-lmsa-700 font-bold text-sm shrink-0">
            {app.applicant_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
          </div>

          {/* Applicant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm">{app.applicant_name || 'Unknown'}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color} border`}>
                {app.application_status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail size={12} /> {app.applicant_email}
              </span>
              {app.applicant_year_level && (
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> Year {app.applicant_year_level}
                </span>
              )}
              {app.applicant_student_id && (
                <span className="flex items-center gap-1">
                  <Hash size={12} /> {app.applicant_student_id}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date + Expand */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}
          </span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {/* Review Notes */}
          <div className="mb-4">
            <Label>Review Notes (optional)</Label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Add notes for the applicant..."
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          {app.application_status === 'pending' ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleAction('rejected')}
                disabled={acting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {acting ? <Loader size={14} className="animate-spin" /> : <X size={14} />}
                Reject
              </button>
              <button
                onClick={() => handleAction('approved')}
                disabled={acting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors disabled:opacity-50"
              >
                {acting ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                Approve
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText size={14} />
              {app.review_notes ? `Review note: "${app.review_notes}"` : 'No review notes'}
              {app.reviewed_at && (
                <span className="text-xs text-gray-400 ml-auto">
                  Reviewed {new Date(app.reviewed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared UI Components ───────────────────────────────────────────────────
function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
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
