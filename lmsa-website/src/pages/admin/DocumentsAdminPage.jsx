// ============================================
// FILE: src/pages/admin/DocumentsAdminPage.jsx
// Admin interface for managing general (org-wide) documents
// Adapted from CommitteeAdminDashboard.jsx's DocumentsTab, minus the
// committee scope.
// ============================================
import { useState, useEffect, useRef } from 'react';
import {
  FileText, Upload, Download, Trash2, Loader, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { documentService } from '@services/document.service';

// ─── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES = ['constitution', 'bylaws', 'report', 'journal', 'newsletter', 'study_material', 'other'];
const ACCESS_LEVELS = ['public', 'members', 'executive', 'admin'];

const EMPTY_META = {
  title: '',
  description: '',
  category: 'report',
  access_level: 'members',
};

const catIcon = (cat) => {
  const icons = {
    constitution: '📜',
    bylaws: '⚖️',
    report: '📊',
    journal: '📓',
    newsletter: '📰',
    study_material: '📚',
    other: '📄',
  };
  return icons[cat] || '📄';
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function DocumentsAdminPage() {
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [meta, setMeta]           = useState(EMPTY_META);
  const fileRef                   = useRef(null);

  async function loadDocs() {
    setLoading(true);
    try {
      const data = await documentService.getAllAdmin();
      setDocs(data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!meta.title.trim()) { toast.error('Enter a document title first'); return; }
    setUploading(true);
    try {
      await documentService.upload(file, {
        title: meta.title.trim(),
        description: meta.description.trim(),
        category: meta.category,
        access_level: meta.access_level,
      });
      toast.success('Document uploaded');
      setMeta(EMPTY_META);
      if (fileRef.current) fileRef.current.value = '';
      loadDocs();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function deleteDoc(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await documentService.deleteDocument(id);
      setDocs(d => d.filter(x => x.id !== id));
      toast.success('Document deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  async function handleDownload(id) {
    try {
      const fileUrl = await documentService.download(id);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Failed to download document');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lmsa-600 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Documents & Resources</h1>
            <p className="text-sm text-gray-500">
              {docs.length} general document{docs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lmsa-600 rounded-lg hover:bg-lmsa-700 transition-colors self-start sm:self-auto"
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* ── Upload Form ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload New Document</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-2">
            <Label>Document Title</Label>
            <input
              className="input"
              placeholder="e.g. LMSA Constitution"
              value={meta.title}
              onChange={e => setMeta(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Access Level</Label>
            <select className="input" value={meta.access_level} onChange={e => setMeta(f => ({ ...f, access_level: e.target.value }))}>
              {ACCESS_LEVELS.map(a => <option key={a} value={a}>{a.replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <input
              className="input"
              placeholder="Brief description of this document (optional)"
              value={meta.description}
              onChange={e => setMeta(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <Label>Category</Label>
            <select className="input" value={meta.category} onChange={e => setMeta(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
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

      {/* ── Documents List ──────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin text-lmsa-600" size={28} />
        </div>
      ) : docs.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No documents uploaded"
          sub="Upload charters, bylaws, reports, and other org-wide resources"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Document</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Access</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Downloads</th>
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
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-400">
                          {doc.file_type?.toUpperCase()} • {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : '—'}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{doc.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{doc.category?.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      doc.access_level === 'public' ? 'bg-green-50 text-green-700'
                        : doc.access_level === 'members' ? 'bg-blue-50 text-blue-700'
                        : doc.access_level === 'executive' ? 'bg-amber-50 text-amber-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      <Filter size={11} />
                      {doc.access_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{doc.downloads ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => deleteDoc(doc.id, doc.title)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared UI Components ──────────────────────────────────────────────────
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
