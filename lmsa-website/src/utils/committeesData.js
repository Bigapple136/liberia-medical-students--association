// LMSA's twelve constitutional standing committees.
// Single source of truth for the public committees index
// (CommitteesPage.jsx) and the committee detail template's offline
// fallback (CommitteePageTemplate.jsx). Content mirrors the committee
// mandates documented in docs/LMSA STANDING COMMITTEES - COMPLETE PAGES.md.

export const ALL_COMMITTEES_DATA = {
  academic: {
    name: 'Academic Committee',
    icon: 'BookOpen',
    description: 'The Academic Committee plans and executes all functions related to LMSA\'s academic affairs, including symposia, conferences, and student academic support.',
    mandate: [
      'Plan and execute clinical and pre-clinical conferences',
      'Organize and conduct intellectual discourses',
      'Assist library staff with journals and periodicals',
      'Plan convenient library schedules for students',
      'Execute at least two symposia per academic year',
      'Select topics and invite participants for academic events',
    ],
    key_activities: ['Annual Medical Symposium', 'Clinical Skills Workshops', 'Academic Mentorship Program', 'Study Group Coordination', 'Library Resource Management', 'Guest Speaker Series'],
    // The year's academic programme, read by CommitteePageTemplate as the
    // page's spine. Everything here follows from the constitutional mandate
    // (two symposia, library schedules, topics and speakers) rather than from a
    // calendar: `when` is relative on purpose, because exact dates belong in
    // the events list and a stale date on this rail reads as a broken promise.
    //
    // DRAFTED from the mandate, pending correction by the committee. Nothing is
    // marked `done` until the committee says so.
    term_plan: [
      {
        when: 'Throughout the year',
        title:
          'Run at least two symposia, one clinical and one pre-clinical, on topics students have asked for',
        // The standing programme this entry is carried out as. Printed on the
        // rail so a student hunting for the symposium by name finds it on the
        // entry that runs it, rather than in a second list of the same work.
        programme: 'Annual Medical Symposium',
        status: 'ongoing',
      },
      {
        when: 'Before the first symposium',
        title:
          'Agree the year’s topics with students, then invite the speakers and panellists to teach them',
        programme: 'Guest Speaker Series',
        status: 'planned',
      },
      {
        when: 'Each semester',
        title:
          'Hold clinical-skills and pre-clinical workshops alongside the taught timetable, not on top of it',
        programme: 'Clinical Skills Workshops',
        status: 'planned',
      },
      {
        when: 'Start of each semester',
        title:
          'Publish a library schedule that fits exam blocks and clinical rotations, agreed with library staff',
        status: 'planned',
      },
      {
        when: 'Each semester',
        title:
          'Keep the library’s journals and periodicals current, and tell students what has arrived',
        programme: 'Library Resource Management',
        status: 'ongoing',
      },
      {
        when: 'Before exams',
        title:
          'Run peer study groups and revision sessions for the cohort facing exams',
        programme: 'Study Group Coordination',
        status: 'planned',
      },
    ],
  },
  health: {
    name: 'Health Committee',
    icon: 'Heart',
    description: 'Keeps the places students learn and live clean and safe, and runs the programmes that help students look after themselves and each other.',
    mandate: [
      'Keep dormitories, lecture halls, and the grounds around them clean and safe',
      'Hold every LMSA facility to a health standard the association sets and can defend',
      'Run health programmes for members, from screenings to first-aid training',
      'Represent students wherever health authorities make decisions that affect them',
      'Inspect on a regular schedule, and follow up until what is broken gets fixed',
      'Publish health information students can use, not just notices on a board',
    ],
    key_activities: [
      'Inspect dormitories and academic buildings on a schedule',
      'Run health awareness campaigns through the semester',
      'Train members in first aid and emergency response',
      'Support mental health programmes',
      'Organise vaccination drives with health authorities',
      'Host wellness workshops on nutrition, stress, and sleep',
    ],
    // The committee's plan for the current term, read by
    // CommitteePageTemplate as the page's spine (report -> inspect -> fix ->
    // publish). Each entry is what the committee intends to do, where it stands
    // and when. `when` is deliberately relative ("Start of term", "Before
    // exams") rather than a calendar date: exact dates belong in the events
    // list, and a stale date here would read as a broken promise.
    //
    // DRAFTED from the constitutional mandate, pending correction by the
    // committee. Statuses are `ongoing` for continuous work and `planned` for
    // what is still ahead; nothing is marked `done` until the committee says so.
    term_plan: [
      {
        when: 'Throughout the term',
        title:
          'Inspect dormitories, lecture halls and the grounds around them, and log every fault found',
        status: 'ongoing',
      },
      {
        when: 'Start of term',
        title:
          'Publish the health standard every LMSA facility is held to, so students know what to expect',
        status: 'planned',
      },
      {
        when: 'Mid-term',
        title:
          'Run first-aid and emergency-response training for members, with a practical assessment',
        status: 'planned',
      },
      {
        when: 'Mid-term',
        title:
          'Organise a vaccination drive with the county health authority',
        status: 'planned',
      },
      {
        when: 'Before exams',
        title:
          'Hold wellness workshops on nutrition, stress and sleep, and open the mental-health programme to every student',
        status: 'planned',
      },
      {
        when: 'End of term',
        title:
          'Publish what was inspected, what was fixed and what is still outstanding',
        status: 'planned',
      },
    ],
  },
  'research-journal': {
    name: 'Research & Journal Committee',
    icon: 'FileText',
    description: 'The Research & Journal Committee gathers, organizes, edits, and publishes data for LMSA\'s official journal and newsletters while promoting research among members.',
    mandate: [
      'Publish one journal per academic year',
      'Publish at least two newsletters per semester',
      'Gather and organize content for publications',
      'Edit and review submitted articles',
      'Promote research culture among students',
      'May publish yearbook',
    ],
    key_activities: ['LMSA Journal Publication', 'Quarterly Newsletters', 'Research Symposium', 'Student Research Projects', 'Publication Workshops', 'Medical Writing Training'],
  },
  'social-program': {
    name: 'Social & Program Committee',
    icon: 'Users',
    description: 'The Social & Program Committee plans and executes all social events, including the end-of-year program, initiation ceremony, and other student engagement activities.',
    mandate: [
      'Plan and execute the annual end-of-year program',
      'Organize the initiation ceremony for new students',
      'Coordinate social events and student networking activities',
      'Foster community spirit and student cohesion',
      'Manage entertainment and recreational programs',
      'Organize inter-class social events',
    ],
    key_activities: ['End-of-Year Program', 'Initiation Ceremony', 'Cultural Nights', 'Inter-Class Games', 'Networking Mixers', 'Student Talent Shows'],
  },
  dietary: {
    name: 'Dietary Committee',
    icon: 'Utensils',
    description: 'The Dietary Committee works directly with dietary staff to improve meal programs and ensure students have access to adequate and nutritious food throughout the academic year.',
    mandate: [
      'Liaise with dietary staff on meal planning and quality',
      'Advocate for improved nutritional standards in student meals',
      'Monitor cafeteria hygiene and food safety standards',
      'Gather student feedback on dietary services',
      'Negotiate meal package improvements with administration',
      'Report dietary concerns to LMSA executive committee',
    ],
    key_activities: ['Cafeteria Inspections', 'Nutrition Awareness Month', 'Student Dietary Surveys', 'Food Safety Workshops', 'Menu Review Meetings', 'Healthy Eating Campaigns'],
  },
  judicial: {
    name: 'Judicial Committee',
    icon: 'Scale',
    description: 'The Judicial Committee handles all legal matters within LMSA, upholds student rights, interprets the constitution, and ensures due process in disciplinary proceedings.',
    mandate: [
      'Handle and adjudicate legal matters within LMSA',
      'Uphold and protect student rights and liberties',
      'Interpret the LMSA Constitution when disputes arise',
      'Ensure due process in all disciplinary proceedings',
      'Review and recommend constitutional amendments',
      'Serve as the appeals body for executive decisions',
    ],
    key_activities: ['Constitution Review Sessions', 'Student Rights Workshops', 'Disciplinary Hearings', 'Legal Aid Clinics', 'Ethics Training', 'Constitutional Debates'],
  },
  sports: {
    name: 'Sports Committee',
    icon: 'Trophy',
    description: 'The Sports Committee promotes physical health, sportsmanship, and team spirit through organized athletics, inter-class competitions, and recreational sports programs.',
    mandate: [
      'Organize and supervise inter-class sports competitions',
      'Promote physical fitness and active lifestyles among students',
      'Coordinate LMSA\'s participation in external sports events',
      'Manage sports equipment and facilities',
      'Recognize and celebrate athletic achievements',
      'Ensure fair play and sportsmanship in all events',
    ],
    key_activities: ['Inter-Class Football Tournament', 'Annual Sports Day', 'Basketball League', 'Table Tennis Championship', 'LMSA Olympics', 'Fitness Boot Camps'],
  },
  auditing: {
    name: 'Auditing Committee',
    icon: 'DollarSign',
    description: 'The Auditing Committee ensures full financial transparency and accountability by auditing LMSA\'s accounts and reporting findings to the membership.',
    mandate: [
      'Audit all LMSA financial accounts and transactions',
      'Prepare and present financial reports to general assembly',
      'Ensure proper accounting and record-keeping standards',
      'Monitor budget allocations and expenditures',
      'Investigate any financial discrepancies or irregularities',
      'Recommend financial policies and controls',
    ],
    key_activities: ['Semester Financial Audits', 'Annual Report Preparation', 'Budget Review Sessions', 'Financial Transparency Reports', 'Expense Verification', 'Dues Collection Oversight'],
  },
  'foreign-affairs': {
    name: 'Foreign Affairs Committee',
    icon: 'Globe',
    description: 'The Foreign Affairs Committee coordinates international opportunities, exchange programs, and global health partnerships for LMSA members.',
    mandate: [
      'Identify and promote international exchange opportunities',
      'Coordinate relationships with international medical student organizations',
      'Facilitate student participation in global health conferences',
      'Disseminate information on international scholarships and fellowships',
      'Represent LMSA at international medical student events',
      'Promote cross-cultural understanding and global health awareness',
    ],
    key_activities: ['IFMSA Exchange Programs', 'Global Health Conferences', 'International Scholarship Database', 'Cultural Exchange Events', 'Global Health Symposium', 'Study Abroad Guidance'],
  },
  membership: {
    name: 'Membership Committee',
    icon: 'UserPlus',
    description: 'The Membership Committee recruits new members, manages member registration, oversees ID card issuance, and maintains the LMSA membership database.',
    mandate: [
      'Recruit and onboard new LMSA members',
      'Manage membership registration and renewal processes',
      'Oversee the issuance and management of student ID cards',
      'Maintain accurate and up-to-date membership records',
      'Verify membership eligibility and dues payment',
      'Conduct membership drives at the start of each semester',
    ],
    key_activities: ['Membership Drives', 'ID Card Distribution', 'New Member Orientations', 'Membership Database Management', 'Dues Collection', 'Member Verification'],
  },
  'media-publicity': {
    name: 'Media & Publicity Committee',
    icon: 'Megaphone',
    description: 'The Media & Publicity Committee manages all LMSA communications, social media presence, branding, and promotional activities to amplify the organization\'s voice.',
    mandate: [
      'Manage LMSA\'s official social media accounts and website',
      'Create promotional materials for LMSA events and programs',
      'Document LMSA events through photography and videography',
      'Draft and distribute official press releases and communications',
      'Maintain consistent LMSA brand identity across all platforms',
      'Coordinate media coverage for major LMSA events',
    ],
    key_activities: ['Social Media Management', 'Event Photography', 'LMSA Newsletter Design', 'Press Releases', 'Promotional Videos', 'Brand Guidelines'],
  },
  welfare: {
    name: 'Welfare Committee',
    icon: 'HeartHandshake',
    description: 'The Welfare Committee ensures the holistic wellbeing of all LMSA members, providing support services, advocacy, and resources for students in need.',
    mandate: [
      'Identify and address student welfare needs and concerns',
      'Advocate for improved student living and learning conditions',
      'Coordinate support services for students in distress',
      'Manage emergency assistance funds for members in need',
      'Promote mental health awareness and resources',
      'Liaise with university administration on student welfare issues',
    ],
    key_activities: ['Mental Health Awareness Month', 'Emergency Fund Management', 'Student Counseling Referrals', 'Welfare Surveys', 'Accommodation Advocacy', 'Financial Aid Guidance'],
  },
};
