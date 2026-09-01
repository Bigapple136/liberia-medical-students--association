import { BookOpen, Download, FileText, Video } from 'lucide-react';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const resources = [
  {
    category: 'Pre-Clinical Years',
    note: 'Build a reliable foundation for the science behind practice.',
    items: [
      { title: 'Anatomy Study Guide', type: 'PDF', icon: FileText },
      { title: 'Biochemistry Notes', type: 'Document', icon: FileText },
      { title: 'Physiology Videos', type: 'Video Series', icon: Video },
      { title: 'Pharmacology Basics', type: 'PDF', icon: FileText },
    ],
  },
  {
    category: 'Clinical Years',
    note: 'Translate knowledge into confidence at the bedside.',
    items: [
      { title: 'Clinical Skills Handbook', type: 'PDF', icon: FileText },
      { title: 'Case Studies Collection', type: 'Document', icon: FileText },
      { title: 'OSCE Preparation Guide', type: 'PDF', icon: FileText },
      { title: 'Patient Communication Tips', type: 'Video', icon: Video },
    ],
  },
  {
    category: 'Exam Preparation',
    note: 'Study with structure when the stakes feel highest.',
    items: [
      { title: 'Past Exam Papers (2020-2025)', type: 'Archive', icon: Download },
      { title: 'MCQ Practice Bank', type: 'Online', icon: FileText },
      { title: 'Exam Strategies Guide', type: 'PDF', icon: FileText },
      { title: 'Study Group Resources', type: 'Toolkit', icon: BookOpen },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
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
          <EditorialSectionHeader eyebrow="Browse the library" title="Find support for the stage you are in." description="Start with your current year, then use these materials to study with more focus and less friction." />
          <div className="space-y-12">
            {resources.map((section, sectionIndex) => (
              <div key={section.category}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-gray-300 pb-4">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-lmsa-900">{section.category}</h2>
                  <p className="text-sm text-gray-600">{section.note}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {section.items.map(({ title, type, icon: Icon }) => (
                    <article key={title} className="editorial-link-card">
                      <span className="editorial-link-card-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.5} /></span>
                      <div className="editorial-link-card-copy">
                        <span className="editorial-card-eyebrow">0{sectionIndex + 1} / {type}</span>
                        <h3>{title}</h3>
                      </div>
                      <button type="button" className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-lmsa-700 hover:text-lmsa-900">
                        <Download size={15} aria-hidden="true" />
                        Access resource
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
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