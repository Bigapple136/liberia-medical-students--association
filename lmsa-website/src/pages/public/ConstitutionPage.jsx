import { FileText, Download } from 'lucide-react';

export default function ConstitutionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Constitution</h1>
              <p className="text-lg text-gray-600 mt-1">LMSA Bylaws and Governing Documents</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Constitution</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The LMSA Constitution serves as the foundational governing document of our organization, 
            establishing the structure, principles, and procedures that guide our operations and 
            decision-making processes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            It outlines the rights and responsibilities of members, the structure of our leadership, 
            and the mechanisms through which we ensure accountability and democratic governance.
          </p>
        </div>

        {/* Key Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Sections</h2>
          <div className="space-y-4">
            {[
              { number: 'Article I', title: 'Name and Purpose', desc: 'Official name and organizational objectives' },
              { number: 'Article II', title: 'Membership', desc: 'Eligibility, categories, and member rights' },
              { number: 'Article III', title: 'Governance Structure', desc: 'Executive committee and organizational hierarchy' },
              { number: 'Article IV', title: 'Elections & Appointments', desc: 'Democratic processes and term limits' },
              { number: 'Article V', title: 'Committees', desc: 'Standing and ad-hoc committee structures' },
              { number: 'Article VI', title: 'Financial Management', desc: 'Dues, budgeting, and fiscal responsibility' },
              { number: 'Article VII', title: 'Amendments', desc: 'Process for constitutional changes' },
            ].map((article, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-lmsa-600 font-bold text-sm flex-shrink-0">{article.number}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <Download size={48} className="text-lmsa-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Constitution</h2>
          <p className="text-gray-700 mb-6">
            Access the complete LMSA Constitution document (PDF)
          </p>
          <button className="btn btn-primary inline-flex items-center gap-2" disabled>
            <Download size={18} />
            Download PDF
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Document will be available soon. Contact us for immediate access.
          </p>
        </div>
      </div>
    </div>
  );
}
