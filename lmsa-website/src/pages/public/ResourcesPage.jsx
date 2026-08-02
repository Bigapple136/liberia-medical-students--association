import { BookOpen, Download, FileText, Video } from 'lucide-react';

const resources = [
  {
    category: 'Pre-Clinical Years',
    items: [
      { title: 'Anatomy Study Guide', type: 'PDF', icon: FileText },
      { title: 'Biochemistry Notes', type: 'Document', icon: FileText },
      { title: 'Physiology Videos', type: 'Video Series', icon: Video },
      { title: 'Pharmacology Basics', type: 'PDF', icon: FileText },
    ],
  },
  {
    category: 'Clinical Years',
    items: [
      { title: 'Clinical Skills Handbook', type: 'PDF', icon: FileText },
      { title: 'Case Studies Collection', type: 'Document', icon: FileText },
      { title: 'OSCE Preparation Guide', type: 'PDF', icon: FileText },
      { title: 'Patient Communication Tips', type: 'Video', icon: Video },
    ],
  },
  {
    category: 'Exam Preparation',
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Resources</h1>
          <p className="text-lg text-gray-600">Materials & Guides for Medical Students</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Access a comprehensive collection of study materials, guides, and resources curated by 
            LMSA to support your medical education journey. These resources are contributed by senior 
            students, faculty, and alumni.
          </p>
        </div>

        {/* Resources by Category */}
        <div className="space-y-8">
          {resources.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-lmsa-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon size={20} className="text-lmsa-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{item.type}</p>
                      <button className="text-lmsa-600 font-medium text-sm hover:underline flex items-center gap-1">
                        <Download size={14} />
                        Access
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contribution CTA */}
        <div className="mt-8 bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contribute Resources</h2>
          <p className="text-gray-700 mb-6">
            Have study materials to share? Help fellow students by contributing to our resource library
          </p>
          <button className="btn btn-primary">Submit Resources</button>
        </div>
      </div>
    </div>
  );
}
