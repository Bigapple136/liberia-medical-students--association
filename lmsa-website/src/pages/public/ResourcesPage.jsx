import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Download, FileText, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';
import { documentService } from '@services/document.service';

const STAGES = [
  {
    stage: 'Pre-Clinical Years',
    note: 'Build a reliable foundation for the science behind practice.',
    focus: [
      'Anatomy, physiology, and biochemistry fundamentals',
      'Study rhythms that survive a heavy lecture load',
      'Finding seniors who took the same courses recently',
    ],
  },
  {
    stage: 'Clinical Years',
    note: 'Translate knowledge into confidence at the bedside.',
    focus: [
      'History-taking and examination technique',
      'Case presentations and ward etiquette',
      'Learning from patients without losing the textbook',
    ],
  },
  {
    stage: 'Exam Preparation',
    note: 'Study with structure when the stakes feel highest.',
    focus: [
      'Planning revision backwards from the exam date',
      'Practicing under real constraints, not ideal ones',
      'Study groups that hold each other accountable',
    ],
  },
];

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

function MaterialCardSkeleton() {
  return (
    <div className="flex flex-col border border-gray-200 bg-white p-6">
      <div className="h-10 w-10 animate-pulse bg-gray-100" />
      <div className="mt-4 h-6 w-4/5 animate-pulse bg-gray-100" />
      <div className="mt-3 h-4 w-full animate-pulse bg-gray-100" />
      <div className="mt-6 h-11 w-full animate-pulse bg-gray-100" />
    </div>
  );
}

export default function ResourcesPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await documentService.getAll({ category: 'study_material' });
      setMaterials(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  async function handleDownload(doc) {
    setDownloading(doc.id);
    try {
      await documentService.download(doc.id);
    } catch {
      // Failure is per-document; keep the list intact.
      toast.error('Could not open the resource. Please try again.');
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
            eyebrow="Learn & lead / Study resources"
            title="The right resource can change how a difficult week feels."
            description="LMSA curates practical study materials, guides, and shared knowledge for the realities of medical training."
          />
          <div className="editorial-note max-w-3xl">
            <p>These resources are contributed by senior students, faculty, and alumni who remember what it feels like to learn something for the first time.</p>
            <span>Shared knowledge, made useful</span>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Where you are"
            title="Find support for the stage you are in."
            description="Each stage of training asks something different of you. Use these focus areas to decide what to look for in the library below."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {STAGES.map(({ stage, note, focus }) => (
              <article key={stage} className="flex flex-col border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-lmsa-900">{stage}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{note}</p>
                <ul className="mt-5 space-y-2.5 border-t border-gray-200 pt-5">
                  {focus.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-gray-700">
                      <span className="mt-2.5 h-1 w-1 shrink-0 bg-lmsa-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="From the library"
            title="Study materials, ready to use."
            description="Everything below comes from the LMSA document library and is available to download right now."
          />

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, index) => (
                <MaterialCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white px-6 py-16 text-center">
              <AlertCircle size={32} className="mx-auto text-gray-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">We could not load the study materials</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">Something went wrong on our end. Check your connection and try again.</p>
              <button
                type="button"
                onClick={loadMaterials}
                className="mt-6 inline-flex items-center gap-2 bg-lmsa-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          ) : materials.length === 0 ? (
            <div className="border border-gray-200 bg-white px-6 py-16 text-center">
              <FileText size={32} className="mx-auto text-gray-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-lmsa-900">No study materials published yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                Materials appear here as members and faculty contribute them. The wider document library may already have what you need.
              </p>
              <Link
                to="/documents"
                className="mt-6 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Browse the document library
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((doc) => (
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

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-sm text-gray-500">
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
                        <Download size={15} aria-hidden="true" />
                        Download
                      </>
                    )}
                  </button>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && materials.length > 0 && (
            <p className="mt-8 text-sm text-gray-600">
              Looking for constitutions, reports, or newsletters?{' '}
              <Link to="/documents" className="font-semibold text-lmsa-700 underline decoration-lmsa-300 underline-offset-4 hover:text-lmsa-900">
                Browse the full document library
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Keep the library growing"
            title="Have a study guide or resource that helped you?"
            description="Share it with the next student who needs a clearer way in."
            tone="green"
            action={{ label: 'Contact LMSA', to: '/contact' }}
          />
        </div>
      </section>
    </main>
  );
}
