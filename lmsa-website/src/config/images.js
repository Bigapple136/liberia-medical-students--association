/**
 * Stock Photography Configuration
 *
 * CURATED STOCK PHOTOS — TO BE REPLACED WITH REAL LMSA PHOTOGRAPHY
 * -----------------------------------------------------------------
 * All images below are from Unsplash (free for commercial use, no attribution required).
 * Before shipping to production, these must be replaced with actual LMSA photos:
 *   - Real student portraits and group photos
 *   - Actual LMSA events (symposia, medical camps, volunteer work)
 *   - A.M. Dogliotti College of Medicine campus shots
 *   - Committee and leadership team photos
 *
 * TODO: Replace all stock photos with real LMSA photography before launch.
 * TODO: Add Supabase Storage upload flow for admin-managed images.
 * TODO: Consider using next-gen formats (WebP/AVIF) with fallbacks.
 */

// Direct Unsplash URLs — use ?w= for responsive sizing, ?q= for quality
const UNSPLASH_BASE = 'https://images.unsplash.com';

export const stockPhotos = {
  // ---- Hero / Page Backgrounds ----
  hero: {
    home: {
      src: `${UNSPLASH_BASE}/photo-1576091160550-2173dba999ef?w=1200&q=80`,
      alt: 'Healthcare professional with stethoscope',
      credit: 'Nappy / Unsplash',
      gradient: 'from-lmsa-900/90 to-lmsa-800/70',
    },
    about: {
      src: `${UNSPLASH_BASE}/photo-1579684385127-1ef15d508118?w=1200&q=80`,
      alt: 'A surgical team gathered under the operating light',
      credit: 'Google for Startups / Unsplash',
      gradient: 'from-lmsa-900/90 to-lmsa-700/70',
    },
    membership: {
      src: `${UNSPLASH_BASE}/photo-1523240795612-9a054b0db644?w=1200&q=80`,
      alt: 'Students gathered together',
      credit: 'Priscilla Du Preez / Unsplash',
      gradient: 'from-lmsa-900/90 to-blue-800/70',
    },
    leadership: {
      src: `${UNSPLASH_BASE}/photo-1557804506-669a67965ba0?w=1200&q=80`,
      alt: 'Team collaboration and leadership',
      credit: 'Mimi Thian / Unsplash',
      gradient: 'from-gray-900/90 to-lmsa-800/70',
    },
    events: {
      src: `${UNSPLASH_BASE}/photo-1540575467063-178a50c2df87?w=1200&q=80`,
      alt: 'Conference event with audience',
      credit: 'Pop & Zebra / Unsplash',
      gradient: 'from-amber-800/90 to-amber-700/70',
    },
    news: {
      src: `${UNSPLASH_BASE}/photo-1499750310107-5fef28a66643?w=1200&q=80`,
      alt: 'Writing and storytelling',
      credit: 'Unsplash',
      gradient: 'from-lmsa-900/90 to-teal-800/70',
    },
    volunteer: {
      src: `${UNSPLASH_BASE}/photo-1559027615-cd4628902d4a?w=1200&q=80`,
      alt: 'Community service and volunteering',
      credit: 'Kat Yukawa / Unsplash',
      gradient: 'from-lmsa-900/90 to-lmsa-700/70',
    },
    mentorship: {
      src: `${UNSPLASH_BASE}/photo-1516321318423-f06f85e504b3?w=1200&q=80`,
      alt: 'Mentorship and guidance',
      credit: 'Mike McInnerney / Unsplash',
      gradient: 'from-amber-800/90 to-lmsa-800/70',
    },
    research: {
      src: `${UNSPLASH_BASE}/photo-1532187863486-abf9dbad1b69?w=1200&q=80`,
      alt: 'Laboratory research',
      credit: 'Dan Meyers / Unsplash',
      gradient: 'from-blue-800/90 to-blue-700/70',
    },
    partnership: {
      src: `${UNSPLASH_BASE}/photo-1556761175-5973dc0f32e7?w=1200&q=80`,
      alt: 'Professional partnership and collaboration',
      credit: 'Mimi Thian / Unsplash',
      gradient: 'from-lmsa-900/90 to-lmsa-800/70',
    },
  },

  // ---- Story / Feature Cards ----
  stories: {
    symposium: {
      src: `${UNSPLASH_BASE}/photo-1576091160399-112ba8d25d1d?w=800&q=80`,
      alt: 'Medical conference presentation',
      credit: 'Online Marketing / Unsplash',
    },
    researchCompetition: {
      src: `${UNSPLASH_BASE}/photo-1532094349884-543bc11b234d?w=800&q=80`,
      alt: 'Glass beakers and a stirring rod on a laboratory bench',
      credit: 'Dan Meyers / Unsplash',
    },
    medicalCamp: {
      src: `${UNSPLASH_BASE}/photo-1576765608535-5f04d1e3f289?w=800&q=80`,
      alt: 'Community health outreach',
      credit: 'Nappy / Unsplash',
    },
  },

  // ---- Section / Feature Illustrations ----
  sections: {
    learn: {
      src: `${UNSPLASH_BASE}/photo-1456513080510-7bf3a84b82f8?w=600&q=80`,
      alt: 'Open medical textbooks and study materials',
      credit: 'Freshh Connection / Unsplash',
    },
    lead: {
      src: `${UNSPLASH_BASE}/photo-1552664730-d307ca884978?w=600&q=80`,
      alt: 'Team leadership workshop',
      credit: 'Crew / Unsplash',
    },
    connect: {
      src: `${UNSPLASH_BASE}/photo-1521737711867-e3b97375f902?w=600&q=80`,
      alt: 'Networking and connection',
      credit: 'You X Ventures / Unsplash',
    },
  },
};

