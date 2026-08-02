import { BookOpen } from 'lucide-react';
import CommitteePageTemplate from '../../components/committees/CommitteePageTemplate';

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
        photo: null,
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
