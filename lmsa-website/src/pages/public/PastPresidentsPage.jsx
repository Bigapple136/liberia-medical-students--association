import { Award, Star } from 'lucide-react';

const pastPresidents = [
  { name: 'Dr. James K. Doe', term: '2022-2023', achievement: 'Expanded membership by 30%' },
  { name: 'Mary T. Johnson', term: '2021-2022', achievement: 'Launched digital health initiative' },
  { name: 'Samuel P. Williams', term: '2020-2021', achievement: 'Led through pandemic challenges' },
  { name: 'Patricia N. Brown', term: '2019-2020', achievement: 'Established mentorship program' },
  { name: 'David M. Garcia', term: '2018-2019', achievement: 'Strengthened international partnerships' },
  { name: 'Elizabeth R. Davis', term: '2017-2018', achievement: 'Modernized organizational structure' },
];

export default function PastPresidentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Past Presidents</h1>
              <p className="text-lg text-gray-600 mt-1">Alumni Leadership Legacy</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">A Legacy of Excellence</h2>
          <p className="text-gray-700 leading-relaxed">
            Over the past 50+ years, LMSA has been led by extraordinary individuals who have shaped our 
            organization and gone on to become leaders in the medical field. Our past presidents represent 
            the best of medical student leadership and continue to contribute to our mission as alumni mentors 
            and advisors.
          </p>
        </div>

        {/* Presidents Timeline */}
        <div className="space-y-6">
          {pastPresidents.map((president, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Star size={32} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{president.name}</h3>
                      <p className="text-lmsa-600 font-medium">{president.term}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{president.achievement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Historical Note */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Complete historical records dating back to 1972 are being compiled. 
            Contact the LMSA archives for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
