import { ArrowRight, FileText, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EditorialCallout,
  EditorialSectionHeader,
} from '@components/common/EditorialSections';

const articles = [
  { number: 'Article I', title: 'Name and Purpose', description: 'Official name and organizational objectives' },
  { number: 'Article II', title: 'Membership', description: 'Eligibility, categories, and member rights' },
  { number: 'Article III', title: 'Governance Structure', description: 'Executive committee and organizational hierarchy' },
  { number: 'Article IV', id: 'elections', title: 'Elections & Appointments', description: 'Democratic processes and term limits' },
  { number: 'Article V', title: 'Committees', description: 'Standing and ad-hoc committee structures' },
  { number: 'Article VI', title: 'Financial Management', description: 'Dues, budgeting, and fiscal responsibility' },
  { number: 'Article VII', title: 'Amendments', description: 'Process for constitutional changes' },
];

export default function ConstitutionPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="A shared foundation"
              title="Good governance makes student leadership possible."
              description="The LMSA Constitution gives the association a clear structure for representation, accountability, and democratic decision-making."
            />
            <div className="editorial-prose">
              <p>
                The constitution is the foundational governing document of our organization. It
                establishes the structure, principles, and procedures that guide our operations.
              </p>
              <p>
                It outlines the rights and responsibilities of members, the structure of our
                leadership, and the mechanisms through which we hold ourselves accountable.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="border border-gray-200 bg-white p-5">
                  <Scale size={22} className="text-lmsa-700" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-semibold text-lmsa-900">Fair process</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">Clear procedures help every member understand how decisions are made.</p>
                </div>
                <div className="border border-gray-200 bg-white p-5">
                  <ShieldCheck size={22} className="text-lmsa-700" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-semibold text-lmsa-900">Shared trust</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">Accountability protects the work and the people who give it their time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Inside the document"
            title="The articles that hold LMSA together."
            description="Use this overview to find the part of our governing framework you want to understand."
          />
          <div className="editorial-article-list">
            {articles.map((article) => (
              <div key={article.number} id={article.id} className="editorial-article-row scroll-mt-28">
                <strong>{article.number}</strong>
                <div>
                  <h3 className="text-lg font-semibold text-lmsa-900">{article.title}</h3>
                  <span className="mt-1 block">{article.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <div className="grid items-center gap-10 border border-lmsa-200 bg-lmsa-50 p-8 md:grid-cols-[120px_1fr_auto] md:p-10">
            <div className="flex h-20 w-20 items-center justify-center bg-lmsa-900 text-lmsa-200">
              <FileText size={38} strokeWidth={1.2} aria-hidden="true" />
            </div>
            <div>
              <p className="editorial-overline">The complete document</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-lmsa-900">Download the LMSA Constitution</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700">The PDF is being prepared. Contact us for immediate access or questions about our governing document.</p>
            </div>
            <button type="button" className="inline-flex items-center gap-2 border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-500" disabled>
              Coming soon
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Questions about governance?"
            title="A healthy association makes room for questions."
            description="Reach out to the LMSA team if you need immediate access or want to understand how the constitution applies to your work."
            tone="ink"
            action={{ label: 'Contact LMSA', to: '/contact' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Looking for the people responsible for the work? <Link to="/leadership" className="font-semibold text-lmsa-700 hover:text-lmsa-900">Meet our leadership</Link>
          </p>
        </div>
      </section>
    </main>
  );
}