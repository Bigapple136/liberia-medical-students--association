import { Eye, Target, Heart } from 'lucide-react';

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mission & Vision</h1>
          <p className="text-lg text-gray-600">Our Goals and Core Values</p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="w-14 h-14 bg-lmsa-100 rounded-xl flex items-center justify-center mb-6">
              <Target size={28} className="text-lmsa-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To unite, represent, and empower medical students across Liberia through advocacy, 
              academic support, and professional development, while fostering a commitment to 
              improving healthcare outcomes in our communities.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Advocate for medical student rights and welfare</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Promote excellence in medical education</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Support research and innovation in healthcare</span>
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="w-14 h-14 bg-lmsa-100 rounded-xl flex items-center justify-center mb-6">
              <Eye size={28} className="text-lmsa-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Liberia where every medical student has access to quality education, resources, 
              and opportunities to become competent, compassionate healthcare professionals who 
              will lead the transformation of our nation&apos;s health system.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Equitable access to medical education</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Student-led healthcare innovation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-lmsa-600 rounded-full mt-2 flex-shrink-0" />
                <span>Global partnerships and collaboration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-lmsa-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Excellence', desc: 'Commitment to the highest standards in education and practice' },
              { title: 'Unity', desc: 'Strength through collaboration and mutual support' },
              { title: 'Integrity', desc: 'Transparency, accountability, and ethical conduct' },
              { title: 'Service', desc: 'Dedication to community health and wellbeing' },
            ].map((value, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
