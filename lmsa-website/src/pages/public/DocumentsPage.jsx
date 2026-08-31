import { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Loader, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentService } from '@services/document.service';
import Select from '@components/common/Select';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'bylaws', label: 'Bylaws' },
  { value: 'report', label: 'Reports' },
  { value: 'journal', label: 'Journals' },
  { value: 'newsletter', label: 'Newsletters' },
  { value: 'study_material', label: 'Study Materials' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_COLORS = {
  constitution:    'bg-blue-100 text-blue-700',
  bylaws:          'bg-purple-100 text-purple-700',
  report:          'bg-amber-100 text-amber-700',
  journal:         'bg-indigo-100 text-indigo-700',
  newsletter:      'bg-cyan-100 text-cyan-700',
  study_material:  'bg-green-100 text-green-700',
  other:           'bg-gray-100 text-gray-700',
};

const ACCESS_COLORS = {
  public:   'bg-green-100 text-green-700',
  members:  'bg-blue-100 text-blue-700',
  executive:'bg-amber-100 text-amber-700',
  admin:    'bg-red-100 text-red-700',
};

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('');
  const [downloading, setDownloading] = useState(null);

  const loadDocuments = useCallback(async (cat) => {
    setLoading(true);
    try {
      const params = {};
      if (cat) params.category = cat;
      const data = await documentService.getAll(params);
      setDocuments(data || []);
    } catch {
      toast.error('Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments(category);
  }, [category, loadDocuments]);

  async function handleDownload(doc) {
    setDownloading(doc.id);
    try {
      await documentService.download(doc.id);
    } catch {
      toast.error('Failed to download document');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-lg text-gray-600">
            Browse and download LMSA publications, reports, and resources
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-400 shrink-0" />
            <div className="w-64">
              <Select
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size={32} className="animate-spin text-lmsa-600" />
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">
              {category
                ? `No ${category.replace('_', ' ')} documents found.`
                : 'No documents available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-lmsa-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-lmsa-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{doc.title}</h3>
                    {doc.file_type && (
                      <span className="text-xs text-gray-500 uppercase font-medium">
                        {doc.file_type.replace('.', '')}
                      </span>
                    )}
                  </div>
                </div>

                {doc.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {doc.category && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[doc.category] || 'bg-gray-100 text-gray-700'}`}>
                      {doc.category.replace('_', ' ')}
                    </span>
                  )}
                  {doc.access_level && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${ACCESS_COLORS[doc.access_level] || 'bg-gray-100 text-gray-700'}`}>
                      {doc.access_level}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{formatDate(doc.created_at)}</span>
                  {doc.file_size > 0 && (
                    <span>{formatFileSize(doc.file_size)}</span>
                  )}
                  {doc.downloads > 0 && (
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {doc.downloads}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloading === doc.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-lmsa-600 text-white font-medium rounded-lg hover:bg-lmsa-700 transition-colors disabled:opacity-50"
                >
                  {downloading === doc.id ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
