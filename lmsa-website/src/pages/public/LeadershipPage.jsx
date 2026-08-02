import { User } from 'lucide-react';
import Card from '@components/common/Card';

export default function LeadershipPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">LMSA Leadership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Meet the dedicated leaders guiding our association towards excellence
          </p>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">Executive Committee</h2>
            <p className="text-gray-600">Academic Year 2025-2026</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {executives.map((exec, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-lmsa-50 flex items-center justify-center">
                  <User size={48} className="text-lmsa-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-1">{exec.name}</h3>
                <p className="text-lmsa-600 font-medium mb-2">{exec.position}</p>
                <p className="text-sm text-gray-600 text-balance">{exec.bio}</p>
              </Card>
            ))}
          </div>

          {/* Organizational Structure */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center uppercase tracking-tight">Organizational Structure</h2>
            <Card>
              <div className="space-y-4">
                <div className="border-l-4 border-lmsa-600 pl-4">
                  <h3 className="font-bold text-lg">General Assembly</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Supreme decision-making body comprising all registered members
                  </p>
                </div>
                <div className="border-l-4 border-lmsa-400 pl-4 ml-8">
                  <h3 className="font-bold text-lg">Executive Committee</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Elected officers responsible for day-to-day operations
                  </p>
                </div>
                <div className="border-l-4 border-lmsa-200 pl-4 ml-16">
                  <h3 className="font-bold text-lg">Standing Committees</h3>
                  <p className="text-gray-600 text-sm text-balance">
                    Academic, Finance, Welfare, Events, and Public Relations
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Join Leadership */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Interested in Leadership?</h2>
            <p className="text-gray-600 mb-6 text-balance">
              Elections are held annually. Get involved and make a difference!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const executives = [
  {
    name: 'Student Name',
    position: 'President',
    bio: 'Final year medical student passionate about student advocacy'
  },
  {
    name: 'Student Name',
    position: 'Vice President',
    bio: 'Fourth year student focused on academic excellence'
  },
  {
    name: 'Student Name',
    position: 'General Secretary',
    bio: 'Third year student ensuring transparent communication'
  },
  {
    name: 'Student Name',
    position: 'Financial Secretary',
    bio: 'Fourth year student managing association finances'
  },
  {
    name: 'Student Name',
    position: 'Public Relations Officer',
    bio: 'Second year student building our public presence'
  },
  {
    name: 'Student Name',
    position: 'Academic Director',
    bio: 'Fifth year student leading academic initiatives'
  }
];
