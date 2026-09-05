import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Download, FileText, Loader, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { documentService } from '@services/document.service';
import { EditorialSectionHeader } from '@components/common/EditorialSections';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All documents' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'bylaws', label: 'Bylaws' },
  { value: 'report', label: 'Reports' },
  { value: 'journal', label: 'Journals' },
  { value: 'newsletter', label: 'Newsletters' },
  { value: 'study_material', label: 'Study materials' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_BADGES = {
  constitution: 'bg-blue-50 text-blue-700',
  bylaws: 'bg-purple-50 text-purple-700',
  report: 'bg-amber-50 text-amber-700',
  journal: 'bg-indigo-50 text-indigo-700',
  newsletter: 'bg-cyan-50 text-cyan-700',
  study_material: 'bg-lmsa-50 text-lmsa-700',
  other: 'bg-gray-100 text-gray-700',
};

const ACCESS_BADGES = {
  public: 'bg-lmsa-50 text-lmsa-700',
  members: 'bg-blue-50 text-blue-700',
  executive: 'bg-amber-50 text-amber-700',
  admin: 'bg-red-50 text-red-700',
};

function categoryLabel(value) {
  return CATEGORY_OPTIONS.find((option) => option.value === value)?.label || value.replace('_', ' ');
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
}

function DocumentCardSkeleton() {
  return (
    <div className="flex flex-col border border-gray-200 bg-white p-6">
      <div className="h-10 w-10 animate-pulse bg-gray-100" />
      <div className="mt-4 h-6 w-4/5 animate-pulse bg-gray-100" />
      <div className="mt-3 h-4 w-full animate-pulse bg-gray-100" />
      <div className="mt-2 h-4 w-2/3 animate-pulse bg-gray-100" />
      <div className="mt-6 h-11 w-full animate-pulse bg-gray-100" />
    </div>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState('');
  const [downloading, setDownloading] = useState(null);

  const loadDocuments = useCallback(async (activeCategory) => {
    setLoading(true);
    setError(false);
    try {
      const params = {};
      if (activeCategory) params.category = activeCategory;
      const data = await documentService.getAll(params);
      setDocuments(data || []);
    } catch {
      setError(true);
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
      // Failure is per-document; keep the list intact.
      toast.error('Could not open the document. Please try again.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            as="h1"
            eyebrow="Learn & lead / Documents"
            title="The library of record for LMSA’s work."
            description="Browse and download the association’s publications, governing documents, reports, and resources."
          />
          <div className="flex flex-wrap gap-2 border-t border-lmsa-200 pt-6" role="group" aria-label="Filter documents by category">
            {CATEGORY_OPTIONS.map(({ value, label }) => {
              const active = category === value;
              return (
                <button
                  key={value || 'all'}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(value)}
                  className={`border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 ${
                    active
                      ? 'border-lmsa-900 bg-lmsa-900 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-lmsa-400 hover:text-lmsa-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          {loading ? (
            <div role="status" aria-label="Loading documents">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <DocumentCardSkeleton key={index} />
                ))}
              </div>
              <span className="sr-only">Loading documents…</span>
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <FileText size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">We couldn’t load the documents</h2>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Something went wrong on our end or with your connection. Try again in a moment.
              </p>
              <button
                type="button"
                onClick={() => loadDocuments(category)}
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <FileText size={40} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">
                {category ? `No ${categoryLabel(category).toLowerCase()} yet` : 'No documents available yet'}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                {category
                  ? 'Nothing has been published in this category so far.'
                  : 'Publications and resources will appear here as they are added.'}
              </p>
              {category && (
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  Show all documents
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <article key={doc.id} className="flex flex-col border border-gray-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-lmsa-50 text-lmsa-600" aria-hidden="true">
                      <FileText size={20} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-lg font-semibold tracking-[-0.02em] text-lmsa-900">{doc.title}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                        {[doc.file_type?.replace('.', ''), formatFileSize(doc.file_size)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>

                  {doc.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{doc.description}</p>}

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {doc.category && (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${CATEGORY_BADGES[doc.category] || 'bg-gray-100 text-gray-700'}`}>
                        {categoryLabel(doc.category)}
                      </span>
                    )}
                    {doc.access_level && (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${ACCESS_BADGES[doc.access_level] || 'bg-gray-100 text-gray-700'}`}>
                        {doc.access_level}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    {doc.created_at && <time dateTime={doc.created_at}>{formatDate(doc.created_at)}</time>}
                    {doc.downloads > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Download size={13} aria-hidden="true" />
                        {doc.downloads} download{doc.downloads !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    disabled={downloading === doc.id}
                    className="mt-5 flex w-full items-center justify-center gap-2 bg-lmsa-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    {downloading === doc.id ? (
                      <>
                        <Loader size={14} className="animate-spin" aria-hidden="true" />
                        Opening…
                      </>
                    ) : (
                      <>
                        <Download size={14} aria-hidden="true" />
                        Download
                      </>
                    )}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <section className="editorial-callout editorial-callout-green">
            <div>
              <p className="editorial-overline">Keep learning</p>
              <h2>Looking for study materials and guides?</h2>
              <p>The study resources library collects tools for every stage of your training.</p>
            </div>
            <Link to="/academics/resources" className="editorial-callout-action">
              Browse study resources
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
