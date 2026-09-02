import { CreditCard, DollarSign, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialCallout, EditorialSectionHeader } from '@components/common/EditorialSections';

const paymentNotes = [
  { icon: CreditCard, title: 'Online payment', items: ['Mobile money (MTN, Orange)', 'Bank transfer', 'Payment portal (coming soon)'] },
  { icon: DollarSign, title: 'In-person payment', items: ['Cash to class representative', 'Direct to LMSA office', 'At LMSA events'] },
];

const importantInformation = [
  ['Payment deadline', 'Dues must be paid by October 31st each year'],
  ['Grace period', '30-day grace period after deadline'],
  ['Financial hardship', 'Payment plans and waivers available upon request'],
  ['Receipt', 'Always request and keep your payment receipt'],
];

export default function DuesPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Membership / Dues"
            title="A transparent contribution to a shared student infrastructure."
            description="Review the current fee structure, payment routes, and the practical details that keep your membership active."
          />
          <div className="editorial-stat-grid">
            <div className="editorial-stat"><strong>$25</strong><span>Full member</span><small>Annual membership for currently enrolled medical students.</small></div>
            <div className="editorial-stat"><strong>$15</strong><span>Associate member</span><small>Annual membership for prospective students and affiliates.</small></div>
            <div className="editorial-stat"><strong>Oct 31</strong><span>Payment deadline</span><small>A 30-day grace period follows the annual deadline.</small></div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Annual fee structure" title="Know the cost before you apply." description="Membership dues are paid yearly. Honorary membership is offered by invitation." />
          <div className="overflow-x-auto border-y border-gray-200 bg-white">
            <table className="w-full min-w-[620px]">
              <caption className="sr-only">Annual membership fee structure by membership type</caption>
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Membership type</th>
                  <th scope="col" className="px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Annual fee</th>
                  <th scope="col" className="px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Payment frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 bg-lmsa-50">
                  <td className="px-5 py-5 font-semibold text-lmsa-900">Full Member</td>
                  <td className="px-5 py-5 text-center text-xl font-semibold text-lmsa-700">$25</td>
                  <td className="px-5 py-5 text-center text-gray-700">Yearly</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-5 py-5 font-semibold text-lmsa-900">Associate Member</td>
                  <td className="px-5 py-5 text-center text-xl font-semibold text-lmsa-700">$15</td>
                  <td className="px-5 py-5 text-center text-gray-700">Yearly</td>
                </tr>
                <tr>
                  <td className="px-5 py-5 font-semibold text-lmsa-900">Honorary Member</td>
                  <td className="px-5 py-5 text-center text-gray-600">By invitation</td>
                  <td className="px-5 py-5 text-center text-gray-700">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="site-container">
          <EditorialSectionHeader eyebrow="Ways to pay" title="Choose the route that works for you." description="If you are unsure which payment option to use, reach out before sending your dues." />
          <div className="grid gap-4 md:grid-cols-2">
            {paymentNotes.map(({ icon: Icon, title, items }) => (
              <article key={title} className="border-t-4 border-lmsa-600 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center bg-lmsa-50 text-lmsa-700" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
                <h3 className="mt-7 text-2xl font-semibold text-lmsa-900">{title}</h3>
                <ul className="mt-4 space-y-3 text-base leading-7 text-gray-700">
                  {items.map((item) => <li key={item} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-lmsa-600" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <EditorialSectionHeader eyebrow="Important information" title="A few details to keep your membership in good standing." description="Save these reminders when you plan your application or renewal." />
            <div className="editorial-article-list">
              {importantInformation.map(([label, detail], index) => (
                <div key={label} className="editorial-article-row">
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span><b className="font-semibold text-lmsa-900">{label}:</b> {detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-start gap-4 border-l-2 border-lmsa-600 bg-white p-6">
            <Info size={22} className="mt-1 shrink-0 text-lmsa-700" aria-hidden="true" />
            <p className="text-sm leading-6 text-gray-700">Payment questions and hardship requests can be discussed with the LMSA team before the deadline.</p>
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Ready when you are"
            title="Activate your place in the LMSA community."
            description="Review your membership category, then start the application process."
            action={{ label: 'Start your membership', to: '/membership#apply' }}
          />
          <p className="mt-5 text-center text-sm text-gray-500">
            Need a quick comparison? <Link to="/membership/categories" className="font-semibold text-lmsa-700 hover:text-lmsa-900">View membership types</Link>
          </p>
        </div>
      </section>
    </main>
  );
}