import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Download, FileText, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Photo from '@components/common/Photo';
import { documentService } from '@services/document.service';
import { stockPhotos } from '@config/images';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [materials, loading, error]);

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

  const renderLibrary = () => {
    if (loading) {
      return (
        <ul className="mt-10" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <li key={row} className="grid gap-y-3 py-6 lg:grid-cols-[1.35fr_1fr_auto] lg:gap-x-10">
              <div className="h-7 w-2/3 animate-pulse bg-lmsa-100" />
              <div className="h-4 w-40 animate-pulse bg-lmsa-100" />
              <div className="h-4 w-24 animate-pulse bg-lmsa-100" />
            </li>
          ))}
        </ul>
      );
    }

    if (error || materials.length === 0) {
      return (
        <div className="reveal-on-scroll mt-10 bg-lmsa-100 p-7 md:p-10">
          <FileText size={26} className="text-lmsa-800" aria-hidden="true" />
          <h3 className="mt-4 max-w-[26ch] font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
            {error ? 'The materials did not load.' : 'Nothing published in this category yet.'}
          </h3>
          <p className="mt-3 max-w-[52ch] text-pretty text-base leading-7 text-lmsa-900">
            {error
              ? 'Something went wrong on our end, so the list is empty rather than accurate. Try again, or go straight to the document library.'
              : 'Materials appear here as members and faculty contribute them. The wider document library may already have what you need.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {error ? (
              <button
                type="button"
                onClick={loadMaterials}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-lmsa-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-900 focus-visible:ring-offset-2"
              >
                Try again
              </button>
            ) : null}
            <Link
              to="/documents"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900"
            >
              Browse the document library
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <ul className="mt-10">
          {materials.map((doc, index) => (
            <li
              key={doc.id}
              className="grid gap-y-3 py-6 lg:grid-cols-[1.35fr_1fr_auto] lg:items-baseline lg:gap-x-10 lg:py-7"
            >
              <div
                className="reveal-on-scroll"
                style={{ transitionDelay: `${Math.min(index, 4) * 60}ms` }}
              >
                <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="mt-1 max-w-[52ch] text-pretty text-base leading-7 text-gray-700">
                    {doc.description}
                  </p>
                )}
              </div>

              <p
                className="reveal-on-scroll text-base leading-7 text-gray-700"
                style={{ transitionDelay: `${Math.min(index, 4) * 60 + 60}ms` }}
              >
                {[formatFileSize(doc.file_size), doc.file_type?.replace('.', '').toUpperCase()]
                  .filter(Boolean)
                  .join(' · ')}
                {doc.created_at && <span className="mt-1 block text-gray-600">{formatDate(doc.created_at)}</span>}
                {doc.downloads > 0 && (
                  <span className="mt-1 block text-gray-600">
                    {doc.downloads} download{doc.downloads !== 1 ? 's' : ''}
                  </span>
                )}
              </p>

              <button
                type="button"
                onClick={() => handleDownload(doc)}
                disabled={downloading === doc.id}
                className="reveal-on-scroll inline-flex min-h-11 items-center gap-1.5 justify-self-start whitespace-nowrap text-base font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-900 focus-visible:ring-offset-2 disabled:opacity-60 lg:justify-self-end"
                style={{ transitionDelay: `${Math.min(index, 4) * 60 + 120}ms` }}
              >
                {downloading === doc.id ? (
                  <>
                    <Loader size={15} className="animate-spin" aria-hidden="true" />
                    Opening
                  </>
                ) : (
                  <>
                    <Download size={15} aria-hidden="true" />
                    Download
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[64ch] text-base leading-7 text-gray-700">
          Looking for constitutions, reports, or newsletters?{' '}
          <Link
            to="/documents"
            className="font-semibold text-lmsa-800 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-lmsa-900 hover:decoration-lmsa-900"
          >
            Browse the full document library
          </Link>
          .
        </p>
      </>
    );
  };

  return (
    <main className="editorial-page resources-page">
      {/* Who the material comes from, before the list of it. */}
      <section className="editorial-section py-16 md:py-24">
        <div className="site-container">
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <h2 className="reveal-on-scroll font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
                Shared by the students ahead of you.
              </h2>
              <p className="reveal-on-scroll mt-5 max-w-[52ch] text-pretty text-xl leading-8 text-gray-700" style={{ transitionDelay: '60ms' }}>
                Senior students, faculty, and alumni contribute the guides and notes that carried them
                through the same courses you are taking now.
              </p>
              <p className="reveal-on-scroll mt-4 max-w-[52ch] text-pretty text-base leading-7 text-gray-700" style={{ transitionDelay: '90ms' }}>
                None of it is a shortcut around the work. It is the work, annotated by someone who has
                already done it.
              </p>
            </div>

            <figure className="reveal-on-scroll lg:pt-2" style={{ transitionDelay: '120ms' }}>
              <Photo
                src={stockPhotos.sections.learn.src}
                alt={stockPhotos.sections.learn.alt}
                fallbackGradient="bg-lmsa-800"
                className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-[420px]"
                imgClassName="photo-drift"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Three stages, set as type rather than three boxed cards. */}
      <section className="editorial-section editorial-section-muted py-16 md:py-24">
        <div className="site-container">
          <div className="reveal-on-scroll max-w-2xl">
            <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
              Find support for the stage you are in.
            </h2>
            <p className="mt-5 max-w-[56ch] text-pretty text-base leading-7 text-gray-700">
              Each stage of training asks something different of you. Use these focus areas to decide
              what to look for in the library below.
            </p>
          </div>

          <ol className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12 lg:mt-12">
            {STAGES.map(({ stage, note, focus }, index) => (
              <li
                key={stage}
                className="reveal-on-scroll"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3 className="font-serif text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-lmsa-900">
                  {stage}
                </h3>
                <p className="mt-2 max-w-[34ch] text-pretty text-base leading-7 text-gray-700">{note}</p>
                <ul className="mt-5 space-y-3 text-base leading-7 text-gray-700">
                  {focus.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* A wide breath of the work itself, between the advice and the list. */}
      <section className="editorial-section py-0">
        <div className="site-container">
          <figure className="reveal-on-scroll">
            <Photo
              src={stockPhotos.stories.researchCompetition.src}
              alt={stockPhotos.stories.researchCompetition.alt}
              fallbackGradient="bg-lmsa-900"
              className="aspect-[4/3] w-full sm:aspect-[21/9]"
            />
          </figure>
        </div>
      </section>

      <section id="library" className="editorial-section scroll-mt-28 py-16 md:py-24">
        <div className="site-container">
          <div className="reveal-on-scroll flex flex-wrap items-end justify-between gap-x-16 gap-y-4">
            <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-lmsa-900 md:text-[2.25rem]">
              Study materials, ready to use.
            </h2>
            <p className="max-w-[40ch] text-pretty text-base leading-7 text-gray-600">
              Everything below comes from the LMSA document library and opens right here.
            </p>
          </div>

          {renderLibrary()}
        </div>
      </section>

      {/* The ask: this library is only as good as what members put in it. */}
      <section className="bg-lmsa-900 py-16 text-lmsa-50 md:py-24">
        <div className="site-container">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="reveal-on-scroll">
              <h2 className="font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[2.25rem]">
                Have a guide that helped you?
              </h2>
              <p className="mt-4 max-w-[44ch] text-pretty text-base leading-7 text-lmsa-100">
                Share it with the next student who needs a clearer way in. Members and faculty can
                contribute to the library at any time.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-lmsa-50 px-6 text-sm font-semibold text-lmsa-900 transition-colors hover:bg-white"
                >
                  Contact LMSA
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/documents"
                  className="inline-flex min-h-11 items-center text-base font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
                >
                  Browse the document library
                </Link>
              </div>
            </div>

            <figure className="reveal-on-scroll h-full" style={{ transitionDelay: '90ms' }}>
              <Photo
                src={stockPhotos.sections.connect.src}
                alt={stockPhotos.sections.connect.alt}
                fallbackGradient="bg-gray-900"
                className="aspect-[16/9] w-full lg:aspect-auto lg:h-full lg:min-h-[320px]"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="editorial-section pb-16 pt-8 md:pb-24">
        <div className="site-container">
          <p className="max-w-[64ch] text-base leading-7 text-gray-600">
            Photographs on this page are licensed stock images used while LMSA’s own photography is
            being collected: Mike McInnerney, Freshh Connection, Dan Meyers, and You X Ventures via
            Unsplash.
          </p>
        </div>
      </section>
    </main>
  );
}
