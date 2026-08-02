import { FlaskConical, Award, BookOpen, Users } from 'lucide-react';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <FlaskConical size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Research</h1>
              <p className="text-lg text-gray-600 mt-1">Opportunities & Journal</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            LMSA is committed to fostering a culture of research and innovation among medical students. 
            We provide resources, mentorship, and platforms for students to conduct and present their 
            research, contributing to the advancement of medical knowledge in Liberia and beyond.
          </p>
        </div>

        {/* Opportunities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lmsa-100 rounded-lg flex items-center justify-center">
                  <Award size={20} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Research Grants</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                LMSA offers small grants to support student-led research projects. Applications are 
                reviewed quarterly.
              </p>
              <button className="text-lmsa-600 font-medium text-sm hover:underline">
                Learn more →
              </button>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lmsa-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Collaborative Projects</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Join ongoing research projects led by faculty and senior students across multiple 
                medical schools.
              </p>
              <button className="text-lmsa-600 font-medium text-sm hover:underline">
                Learn more →
              </button>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lmsa-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">LMSA Medical Journal</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Publish your research in our peer-reviewed student medical journal. Submissions 
                accepted year-round.
              </p>
              <button className="text-lmsa-600 font-medium text-sm hover:underline">
                Submit paper →
              </button>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lmsa-100 rounded-lg flex items-center justify-center">
                  <FlaskConical size={20} className="text-lmsa-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Research Training</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Attend workshops on research methodology, data analysis, and scientific writing.
              </p>
              <button className="text-lmsa-600 font-medium text-sm hover:underline">
                View workshops →
              </button>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Priority Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Infectious Diseases (Malaria, TB, HIV)',
              'Maternal and Child Health',
              'Health Systems Strengthening',
              'Non-Communicable Diseases',
              'Mental Health',
              'Traditional Medicine Integration',
            ].map((area, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
