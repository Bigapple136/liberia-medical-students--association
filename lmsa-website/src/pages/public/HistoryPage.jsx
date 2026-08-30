import { BookOpen, Calendar } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our History</h1>
              <p className="text-lg text-gray-600 mt-1">50+ Years of Medical Excellence</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Beginning (1972)</h2>
              <p className="text-gray-700 leading-relaxed">
                The Liberia Medical Students&apos; Association (LMSA) was founded in 1972 by a small group of visionary 
                medical students who recognized the need for a unified voice in medical education. What started as 
                a modest gathering of 15 students has grown into one of the most influential student organizations 
                in Liberia&apos;s medical landscape.
              </p>
            </div>

            <div className="mb-8 p-6 bg-lmsa-50 rounded-xl border-l-4 border-lmsa-600">
              <p className="text-lmsa-800 font-medium italic">
                &quot;Education is the foundation of progress, but unity is the bridge that takes us there.&quot;
              </p>
              <p className="text-lmsa-600 text-sm mt-2">— Founding Members, 1972</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Growth & Expansion (1980s-1990s)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Despite the challenges of civil unrest, LMSA demonstrated remarkable resilience. The association 
                continued to advocate for medical students and maintained its commitment to academic excellence. 
                During this period, LMSA:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Calendar size={18} className="text-lmsa-600 mt-1 flex-shrink-0" />
                  <span>Established partnerships with international medical organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar size={18} className="text-lmsa-600 mt-1 flex-shrink-0" />
                  <span>Launched the first annual medical symposium</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar size={18} className="text-lmsa-600 mt-1 flex-shrink-0" />
                  <span>Created standing committees to address specialized areas</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modern Era (2000s-Present)</h2>
              <p className="text-gray-700 leading-relaxed">
                Today, LMSA represents thousands of medical students across Liberia, with chapters at multiple 
                medical schools. The association has evolved to embrace technology, global health initiatives, 
                and innovative approaches to medical education while staying true to its founding principles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl font-bold text-lmsa-600 mb-2">50+</div>
                <div className="text-gray-600">Years of Service</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl font-bold text-lmsa-600 mb-2">12</div>
                <div className="text-gray-600">Standing Committees</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl font-bold text-lmsa-600 mb-2">1000s</div>
                <div className="text-gray-600">Members Represented</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
