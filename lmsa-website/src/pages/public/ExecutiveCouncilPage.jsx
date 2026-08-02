import { Users, Building2 } from 'lucide-react';

export default function ExecutiveCouncilPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Executive Council</h1>
              <p className="text-lg text-gray-600 mt-1">Class Presidents & Student Representatives</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the Executive Council?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Executive Council is the representative body of LMSA, composed of class presidents and 
            student representatives from all medical schools in Liberia. This council serves as the voice 
            of medical students at the institutional level and ensures that every class has direct 
            representation in LMSA governance.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Council members are elected by their peers and serve one-year terms, working closely with 
            the Executive Committee to implement programs and address student concerns.
          </p>
        </div>

        {/* Structure */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Council Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-lmsa-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users size={20} className="text-lmsa-600" />
                Class Presidents
              </h3>
              <p className="text-gray-700 text-sm">
                Each medical school class elects a president who represents their cohort in the 
                Executive Council. They serve as the primary liaison between their class and LMSA leadership.
              </p>
            </div>
            <div className="p-6 bg-lmsa-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users size={20} className="text-lmsa-600" />
                Student Representatives
              </h3>
              <p className="text-gray-700 text-sm">
                Additional representatives may be appointed to ensure adequate representation from 
                all campuses and special programs.
              </p>
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Responsibilities</h2>
          <div className="space-y-4">
            {[
              'Represent student concerns and feedback to LMSA leadership',
              'Coordinate campus-wide events and initiatives',
              'Participate in monthly council meetings',
              'Support recruitment and membership drives',
              'Assist with academic support programs',
              'Promote student welfare and engagement',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
