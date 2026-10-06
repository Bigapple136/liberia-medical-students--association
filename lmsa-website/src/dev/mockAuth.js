// Dev-only mock auth for the admin UI preview harness (T42).
// The preview entry imports this BEFORE AuthContext/services, so the
// `supabase` and `api` singletons are these stubs everywhere.
// Not imported by any production entry; keep-or-remove at review time.

export const supabase = null;

const members = [
  {
    id: 1,
    applicant_name: 'Junior Sylla',
    applicant_email: 'junior.sylla@ul.edu.lr',
    membership_type: 'full',
    application_status: 'pending',
    submitted_at: '2026-10-01T09:00:00Z',
  },
  {
    id: 2,
    applicant_name: 'Amina Kromah',
    applicant_email: 'amina.kromah@ul.edu.lr',
    membership_type: 'associate',
    application_status: 'approved',
    submitted_at: '2026-09-28T14:30:00Z',
  },
  {
    id: 3,
    applicant_name: 'Peter Quiwa',
    applicant_email: 'peter.quiwa@ul.edu.lr',
    membership_type: 'full',
    application_status: 'rejected',
    submitted_at: '2026-09-25T11:20:00Z',
  },
];

export const api = {
  get: async () => ({
    data: {
      user: {
        id: 'preview-user',
        email: 'stone@lmsa.org.lr',
        full_name: 'Stone Kollie',
        role: 'super_admin',
        membership_status: 'active',
      },
      applications: members,
    },
  }),
};
