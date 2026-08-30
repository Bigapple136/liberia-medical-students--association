import { Award, Users, Target, CheckCircle } from 'lucide-react';

export default function LeadershipOpportunitiesPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Leadership Opportunities</h1>
              <p className="text-lg text-gray-600 mt-1">Run for Office and Lead</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            LMSA believes in developing the next generation of healthcare leaders. We offer numerous 
            opportunities for members to take on leadership roles, from class representatives to 
            executive committee positions.
          </p>
        </div>

        {/* Leadership Positions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Positions</h2>
          <div className="space-y-6">
            {[
              {
                level: 'Executive Committee',
                positions: ['President', 'Vice President', 'Secretary General', 'Treasurer', 'Public Relations Officer'],
                term: '1 year',
                eligibility: 'Full members in good standing',
              },
              {
                level: 'Class Representatives',
                positions: ['Class President', 'Assistant Class President'],
                term: '1 year',
                eligibility: 'All medical students',
              },
              {
                level: 'Committee Chairs',
                positions: ['Committee Chairperson', 'Deputy Chairperson'],
                term: '1 year',
                eligibility: 'Appointed by Executive Committee',
              },
            ].map((level, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{level.level}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {level.positions.map((position, pIndex) => (
                    <span
                      key={pIndex}
                      className="bg-lmsa-100 text-lmsa-700 text-sm px-3 py-1 rounded-full"
                    >
                      {position}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-lmsa-600" />
                    <span>Term: {level.term}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-lmsa-600" />
                    <span>{level.eligibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Develop essential leadership skills',
              'Build your professional network',
              'Make meaningful organizational impact',
              'Enhance your CV/resume',
              'Gain event planning experience',
              'Learn conflict resolution',
              'Improve public speaking abilities',
              'Prepare for future medical leadership',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-lmsa-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Lead?</h2>
          <p className="text-gray-700 mb-6">
            Elections are held annually. Prepare your candidacy and make your mark!
          </p>
          <button className="btn btn-primary">Learn About Elections</button>
        </div>
      </div>
    </div>
  );
}
