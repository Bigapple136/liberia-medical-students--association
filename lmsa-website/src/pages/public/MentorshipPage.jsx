import { Users, Heart, CheckCircle, MessageCircle } from 'lucide-react';

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-lmsa-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-lmsa-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Mentorship Program</h1>
              <p className="text-lg text-gray-600 mt-1">Connect with Senior Students</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Program</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The LMSA Mentorship Program pairs junior medical students with senior students who provide 
            academic guidance, career advice, and personal support. This peer-to-peer mentorship has 
            been one of our most successful initiatives, helping thousands of students navigate the 
            challenges of medical school.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Mentors are carefully matched based on academic interests, career goals, and personal 
            preferences to ensure productive and meaningful relationships.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Apply',
                desc: 'Fill out the mentorship application form',
                icon: MessageCircle,
              },
              {
                step: '2',
                title: 'Get Matched',
                desc: 'We pair you with a compatible mentor',
                icon: Users,
              },
              {
                step: '3',
                title: 'Connect',
                desc: 'Meet regularly with your mentor',
                icon: Heart,
              },
              {
                step: '4',
                title: 'Grow',
                desc: 'Achieve your academic and career goals',
                icon: CheckCircle,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-lmsa-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-lmsa-600" />
                  </div>
                  <div className="text-3xl font-bold text-lmsa-600 mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Mentorship</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Academic support and study strategies',
              'Career guidance and specialty exploration',
              'Emotional support during challenging times',
              'Networking opportunities',
              'Research collaboration opportunities',
              'Leadership skill development',
              'Transition support between clinical years',
              'Exam preparation assistance',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-lmsa-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-lmsa-50 rounded-2xl border-2 border-lmsa-200 p-8 text-center">
            <Users size={48} className="text-lmsa-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find a Mentor</h2>
            <p className="text-gray-700 mb-6">
              Junior students: Get matched with an experienced mentor
            </p>
            <button className="btn btn-primary">Apply as Mentee</button>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center">
            <Heart size={48} className="text-lmsa-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Mentor</h2>
            <p className="text-gray-700 mb-6">
              Senior students: Share your knowledge and experience
            </p>
            <button className="btn btn-primary">Apply as Mentor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
