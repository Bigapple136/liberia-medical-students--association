import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function CommitteePageTemplate({
  name,
  icon: Icon,
  description,
  mandate,
  keyActivities,
  currentChair,
  members,
  upcomingEvents,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-lmsa-600 rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
              <p className="text-lmsa-600 font-medium">LMSA Standing Committee</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mt-4">
            {description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mandate */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Committee Mandate</h2>
              <ul className="space-y-3">
                {mandate.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-lmsa-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-lmsa-600 rounded-full" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Key Activities */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Activities</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {keyActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-lmsa-50 rounded-lg border border-lmsa-200"
                  >
                    <p className="text-sm font-medium text-gray-900">{activity}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Events */}
            {upcomingEvents && upcomingEvents.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-lmsa-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span className="text-sm text-lmsa-600 font-medium whitespace-nowrap ml-4">
                          {event.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TODO: Add Past Events Section */}
            <section className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Past Events & Achievements</p>
              <p className="text-sm text-gray-500 mt-1">Content coming soon</p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Committee Chair */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Committee Chair</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-lmsa-100 rounded-full flex items-center justify-center text-lmsa-600 font-bold text-xl">
                  {currentChair.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentChair.name}</p>
                  <p className="text-sm text-gray-600">{currentChair.year}</p>
                </div>
              </div>
              <a
                href={`mailto:${currentChair.email}`}
                className="block w-full px-4 py-2 bg-lmsa-600 text-white text-center rounded-lg hover:bg-lmsa-700 transition-colors text-sm font-medium"
              >
                Contact Chair
              </a>
            </div>

            {/* Committee Members */}
            {members && members.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Committee Members</h3>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.position} • {member.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Join Committee CTA */}
            <div className="bg-lmsa-600 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">Join This Committee</h3>
              <p className="text-sm text-lmsa-100 mb-4">
                Get involved and make an impact in this area
              </p>
              <Link
                to="/get-involved/committees"
                className="block w-full px-4 py-2 bg-white text-lmsa-600 text-center rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Express Interest
              </Link>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-lmsa-600 hover:underline">
                  Committee Charter →
                </a>
                <a href="#" className="block text-sm text-lmsa-600 hover:underline">
                  Meeting Minutes →
                </a>
                <a href="#" className="block text-sm text-lmsa-600 hover:underline">
                  Annual Report →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">📝 Content To Be Added:</h3>
          <ul className="space-y-2 text-yellow-800">
            <li>• Committee member photos and full bios</li>
            <li>• Past events and achievements gallery</li>
            <li>• Detailed activity reports</li>
            <li>• Meeting schedules and minutes</li>
            <li>• Project documentation</li>
            <li>• Committee charter and guidelines</li>
            <li>• Application forms for new members</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
