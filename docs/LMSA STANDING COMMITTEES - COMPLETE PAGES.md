// ============================================
// LMSA STANDING COMMITTEES - COMPLETE PAGES
// ============================================

// ============================================
// FILE: src/pages/leadership/CommitteesPage.jsx
// Main committees overview page
// ============================================
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  FileText, 
  Users, 
  Utensils, 
  Scale,
  Trophy,
  DollarSign,
  Globe,
  UserPlus,
  Megaphone,
  HandHeart
} from 'lucide-react';

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Standing Committees
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Our 12 standing committees drive LMSA's mission forward, each focusing on 
            specific aspects of student life, academics, and community engagement.
          </p>
        </div>
      </div>

      {/* Committees Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((committee, index) => (
            <CommitteeCard key={index} committee={committee} />
          ))}
        </div>
      </div>

      {/* Join a Committee CTA */}
      <div className="bg-lmsa-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Join a Committee?
          </h2>
          <p className="text-lmsa-100 mb-8 max-w-2xl mx-auto">
            Get involved in LMSA's work by joining one of our committees. 
            Make a difference in student life and develop leadership skills.
          </p>
          <Link
            to="/get-involved/committees"
            className="inline-block px-8 py-3 bg-white text-lmsa-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Join a Committee
          </Link>
        </div>
      </div>
    </div>
  );
}

function CommitteeCard({ committee }) {
  const Icon = committee.icon;
  
  return (
    <Link
      to={committee.path}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-lmsa-600 transition-all group"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-lmsa-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lmsa-600 transition-colors">
          <Icon className="w-6 h-6 text-lmsa-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-lmsa-600 transition-colors">
            {committee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {committee.description}
          </p>
          <div className="flex items-center text-sm text-lmsa-600 font-medium">
            Learn more →
          </div>
        </div>
      </div>
    </Link>
  );
}

const committees = [
  {
    name: 'Academic Committee',
    icon: BookOpen,
    description: 'Organizes symposia, conferences, and academic support programs',
    path: '/committees/academic',
  },
  {
    name: 'Health Committee',
    icon: Heart,
    description: 'Ensures sanitation and manages student health initiatives',
    path: '/committees/health',
  },
  {
    name: 'Research & Journal',
    icon: FileText,
    description: 'Publishes LMSA journal, newsletters, and promotes research',
    path: '/committees/research-journal',
  },
  {
    name: 'Social & Program',
    icon: Users,
    description: 'Plans social events, end-of-year program, and initiation',
    path: '/committees/social-program',
  },
  {
    name: 'Dietary Committee',
    icon: Utensils,
    description: 'Works with dietary staff on student meal programs',
    path: '/committees/dietary',
  },
  {
    name: 'Judicial Committee',
    icon: Scale,
    description: 'Handles legal matters and upholds student rights',
    path: '/committees/judicial',
  },
  {
    name: 'Sports Committee',
    icon: Trophy,
    description: 'Promotes sports, athletics, and inter-class competitions',
    path: '/committees/sports',
  },
  {
    name: 'Auditing Committee',
    icon: DollarSign,
    description: 'Audits LMSA finances and reports to members',
    path: '/committees/auditing',
  },
  {
    name: 'Foreign Affairs',
    icon: Globe,
    description: 'Coordinates international opportunities and exchanges',
    path: '/committees/foreign-affairs',
  },
  {
    name: 'Membership Committee',
    icon: UserPlus,
    description: 'Recruits members and manages ID cards',
    path: '/committees/membership',
  },
  {
    name: 'Media & Publicity',
    icon: Megaphone,
    description: 'Manages LMSA media and promotional activities',
    path: '/committees/media-publicity',
  },
  {
    name: 'Welfare Committee',
    icon: HandHeart,
    description: 'Ensures student welfare and support services',
    path: '/committees/welfare',
  },
];

// ============================================
// INDIVIDUAL COMMITTEE PAGES
// Template structure for all 12 committees
// ============================================

// ============================================
// FILE: src/pages/committees/AcademicCommittee.jsx
// ============================================
import { BookOpen, Users, Calendar, FileText } from 'lucide-react';

export default function AcademicCommittee() {
  return (
    <CommitteePageTemplate
      name="Academic Committee"
      icon={BookOpen}
      description="The Academic Committee plans and executes all functions related to LMSA's academic affairs, including symposia, conferences, and student academic support."
      mandate={[
        'Plan and execute clinical and pre-clinical conferences',
        'Organize and conduct intellectual discourses',
        'Assist library staff with journals and periodicals',
        'Plan convenient library schedules for students',
        'Execute at least two symposia per academic year',
        'Select topics and invite participants for academic events',
      ]}
      keyActivities={[
        'Annual Medical Symposium',
        'Clinical Skills Workshops',
        'Academic Mentorship Program',
        'Study Group Coordination',
        'Library Resource Management',
        'Guest Speaker Series',
      ]}
      currentChair={{
        name: 'Dr. John Smith',
        year: 'Year 4',
        email: 'academic@lmsa.org',
        photo: null, // TODO: Add photo
      }}
      members={[
        { name: 'Jane Doe', year: 'Year 3', position: 'Vice Chair' },
        { name: 'Michael Brown', year: 'Year 2', position: 'Secretary' },
        { name: 'Sarah Wilson', year: 'Year 3', position: 'Member' },
        { name: 'David Lee', year: 'Year 2', position: 'Member' },
      ]}
      upcomingEvents={[
        {
          title: 'Annual Medical Symposium 2026',
          date: 'April 20, 2026',
          description: 'Innovations in Tropical Medicine',
        },
        {
          title: 'Clinical Skills Workshop',
          date: 'April 18, 2026',
          description: 'Hands-on suturing and wound care training',
        },
      ]}
    />
  );
}

// ============================================
// FILE: src/pages/committees/HealthCommittee.jsx
// ============================================
export function HealthCommittee() {
  return (
    <CommitteePageTemplate
      name="Health Committee"
      icon={Heart}
      description="The Health Committee ensures the general sanitation of dormitories, academic buildings, and their environs while planning health-related functions for LMSA members."
      mandate={[
        'Ensure satisfactory sanitation of dormitories and academic buildings',
        'Maintain acceptable health standards in all LMSA facilities',
        'Plan and execute health-related functions for members',
        'Coordinate with health authorities on student health matters',
        'Conduct regular health and sanitation inspections',
        'Promote health awareness among students',
      ]}
      keyActivities={[
        'Campus Health Inspections',
        'Health Awareness Campaigns',
        'First Aid Training',
        'Mental Health Support Programs',
        'COVID-19 Prevention Measures',
        'Vaccination Drives',
      ]}
      currentChair={{
        name: 'Mary Johnson',
        year: 'Year 3',
        email: 'health@lmsa.org',
        photo: null,
      }}
      members={[]} // TODO: Add members
      upcomingEvents={[]} // TODO: Add events
    />
  );
}

// ============================================
// FILE: src/pages/committees/ResearchJournalCommittee.jsx
// ============================================
export function ResearchJournalCommittee() {
  return (
    <CommitteePageTemplate
      name="Research & Journal Committee"
      icon={FileText}
      description="The Research & Journal Committee gathers, organizes, edits, and publishes data for LMSA's official journal and newsletters while promoting research among members."
      mandate={[
        'Publish one journal per academic year',
        'Publish at least two newsletters per semester',
        'Gather and organize content for publications',
        'Edit and review submitted articles',
        'Promote research culture among students',
        'May publish yearbook',
      ]}
      keyActivities={[
        'LMSA Journal Publication',
        'Quarterly Newsletters',
        'Research Symposium',
        'Student Research Projects',
        'Publication Workshops',
        'Medical Writing Training',
      ]}
      currentChair={{
        name: 'Peter Davis',
        year: 'Year 4',
        email: 'research@lmsa.org',
        photo: null,
      }}
      members={[]} // TODO: Add members
      upcomingEvents={[]} // TODO: Add events
    />
  );
}

// ============================================
// REUSABLE COMMITTEE PAGE TEMPLATE
// ============================================
function CommitteePageTemplate({
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

// ============================================
// REMAINING 9 COMMITTEE PAGES - STUB FILES
// Create these files with similar structure
// ============================================

/*
FILE: src/pages/committees/SocialProgramCommittee.jsx
FILE: src/pages/committees/DietaryCommittee.jsx
FILE: src/pages/committees/JudicialCommittee.jsx
FILE: src/pages/committees/SportsCommittee.jsx
FILE: src/pages/committees/AuditingCommittee.jsx
FILE: src/pages/committees/ForeignAffairsCommittee.jsx
FILE: src/pages/committees/MembershipCommittee.jsx
FILE: src/pages/committees/MediaPublicityCommittee.jsx
FILE: src/pages/committees/WelfareCommittee.jsx

Each will use the CommitteePageTemplate with their specific data.
Copy the structure from AcademicCommittee.jsx and update the details.
*/

// ============================================
// ADD TO routes.jsx
// ============================================
/*
// Committees routes
<Route path="/committees/academic" element={<AcademicCommittee />} />
<Route path="/committees/health" element={<HealthCommittee />} />
<Route path="/committees/research-journal" element={<ResearchJournalCommittee />} />
<Route path="/committees/social-program" element={<SocialProgramCommittee />} />
<Route path="/committees/dietary" element={<DietaryCommittee />} />
<Route path="/committees/judicial" element={<JudicialCommittee />} />
<Route path="/committees/sports" element={<SportsCommittee />} />
<Route path="/committees/auditing" element={<AuditingCommittee />} />
<Route path="/committees/foreign-affairs" element={<ForeignAffairsCommittee />} />
<Route path="/committees/membership" element={<MembershipCommittee />} />
<Route path="/committees/media-publicity" element={<MediaPublicityCommittee />} />
<Route path="/committees/welfare" element={<WelfareCommittee />} />
*/

// ============================================
// TODO LIST FOR COMMITTEE PAGES
// ============================================
/*
✅ COMPLETED:
- Main committees overview page
- Committee card grid with icons
- Reusable committee page template
- Academic Committee full page
- Health Committee full page
- Research & Journal Committee full page
- Navigation integration
- Responsive design

📝 TODO - CONTENT NEEDED:
1. Complete remaining 9 committee pages (copy template)
2. Add real committee chair names and photos
3. Add all committee member details
4. Populate upcoming events for each committee
5. Add past events and achievements
6. Create photo galleries for committee activities
7. Add meeting minutes and reports
8. Create committee charter documents
9. Add member application forms
10. Populate resources section with real links

📝 TODO - FEATURES:
1. Add committee contact forms
2. Create committee event calendar integration
3. Add member directory per committee
4. Implement file upload for committee reports
5. Add committee-specific announcements
6. Create committee achievement badges
7. Add social sharing for committee events
8. Implement committee newsletter signup

📝 TODO - TECHNICAL:
1. Create committee data models in database
2. Build API endpoints for committee CRUD
3. Add admin interface for managing committees
4. Implement member assignment to committees
5. Create notification system for committee events
6. Add analytics tracking for committee pages
*/