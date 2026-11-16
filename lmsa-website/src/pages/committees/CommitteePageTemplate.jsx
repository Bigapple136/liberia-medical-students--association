import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  Loader,
  Mail,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { committeeService } from '@services/committee.service';
import { eventService } from '@services/event.service';
import { newsService } from '@services/news.service';
import { getRecruitmentStatus } from '@config/committees';
import { ALL_COMMITTEES_DATA } from '@utils/committeesData';
import { stockPhotos } from '@config/images';

export { ALL_COMMITTEES_DATA };

/* One committee's page.

   Rebuilt on the same language as /leadership/committees and /leadership:

   - PublicLayout already renders the header, the footer and the skip link, so
     this page renders none of those. It also no longer sits under the layout's
     generic /leadership/committees/:slug PageHero: that hero drew its title from
     the URL ("Research Journal") above the page's own gradient banner, so every
     committee opened with two headers and a heading that was not its name. This
     page owns its header, because the name, description, photograph and
     recruitment state all come from the committee itself.
   - The five tabs are gone. Tabs hid the mandate, the roster and the paperwork
     behind clicks, and most of the tabs are empty for a committee that has not
     published members, events or documents yet. Sections now appear when they
     have something in them, in the order a visitor wants them: what the
     committee is for, the work, who does it, then its records and how to reach
     it.
   - Cards, icons, badges and gradient banners are replaced by type and space,
     the same register the committees list uses.
   - Counts are printed only when they are known: the old header showed three
     tiles (members, events, docs) that read "0 / 0 / 0" whenever the API was
     unreachable, which said the committee had no members and no events. Offline
     fallback data is marked `unavailable`, so this page states that the
     recruitment details are unavailable instead of guessing "not recruiting".

   No committee, chair, member, event or document on this page is invented: every
   name comes from the API, and the sections that have no data are not printed. */

/** Where the committee stands this round, or null when that is not known. */
function statusLine(recruitment) {
  switch (recruitment.state) {
    case 'open': {
      const seats =
        recruitment.remaining === null
          ? 'Accepting applications'
          : `${recruitment.remaining} ${recruitment.remaining === 1 ? 'seat' : 'seats'} open`;
      return {
        open: true,
        text: `${seats}${recruitment.deadline ? ` · closes ${recruitment.deadline}` : ''}`,
      };
    }
    case 'full':
      return { open: false, text: 'All seats are filled this round.' };
    case 'closed':
      return {
        open: false,
        text: `Applications closed${recruitment.deadline ? ` on ${recruitment.deadline}` : ''}.`,
      };
    case 'not-recruiting':
      return { open: false, text: 'Not taking applications this round.' };
    default:
      return null;
  }
}

/* Per-committee imagery. The default photos are shared by every committee page,
   and for a committee whose subject is not in that set they read as someone
   else's page: the Health Committee opened on students with laptops and showed
   a stethoscope phone close-up under "What members take on". Health is about
   sanitation, outreach, and looking after people, so it borrows the
   community-health pictures instead. Committees not listed here keep the shared
   set unchanged. */
const COMMITTEE_PHOTOS = {
  academic: {
    // The shared `stories.symposium` photo is a clinician looking at a phone,
    // not the room full of people the alt text promises. The events hero is
    // actually a conference audience, which is what a symposium page should
    // open on.
    opening: {
      hero: 'events',
    },
    // The plan section carries this one now that the mandate band is gone: a
    // table of open books says "academic" in a way the workshop photograph —
    // people at a wall of sticky notes — did not.
    planning: {
      section: 'learn',
    },
  },
  'research-journal': {
    // The shared "what members take on" photo is a stethoscope on a coat: it
    // says clinician, not editor, and this page is about what gets written and
    // published. The library photograph is the honest one for a shelf of work.
    practising: {
      section: 'learn',
      alt: 'Open medical textbooks and study materials',
    },
  },
  health: {
    opening: {
      hero: 'volunteer',
      alt: 'Volunteers working together at a community service project',
    },
    practising: {
      story: 'medicalCamp',
      alt: 'A community health outreach session',
    },
  },
};

/* Per-committee structure, not styling.

   The Health Committee's work is not a description of a remit. It runs health
   programmes and activities — training, drives, workshops, and the inspections
   behind them — open to students and the wider community, not only to members.
   A reader arrives for what the committee puts on; reporting a fault is the
   standing offer underneath. That wants a different order from a committee
   whose work is mostly academic.

   `mandate: 'hidden'` drops the constitutional register from the page
   altogether: a student who arrives with a blocked drain is not here to read
   the constitution, and the committee asked for the register to come off rather
   than sit under the programme. Any committee without a profile keeps the
   current order and the current wording. */
const COMMITTEE_PROFILES = {
  health: {
    // `tabs` is a layout, not a style: the page becomes three views of one
    // committee instead of one long scroll. A visitor who came from a search for
    // health news, a student asking what is on, and someone deciding whether to
    // join want three different pages — on a single scroll each of them reads
    // two-thirds of what they did not ask for, and the fault report, which is
    // one duty among several, ends up reading as the page's subject.
    //
    // Now: what is on and what has been published. The work: the programme and
    // the fault-reporting duty. People: who is on the committee and how to join.
    // Each panel carries its own action, so the hero carries none. Every other
    // committee keeps the stacked page — one layout is not the house style.
    layout: 'tabs',
    // The hero says who the work is for, because it is the one thing about
    // this committee a reader can get wrong: the programmes are not an
    // internal members' benefit.
    intro:
      'The committee runs the health programme for students and the wider community, not only members: first-aid training, vaccination drives and wellness workshops. It also inspects the places students live and learn, and follows a fault until it is fixed.',
    mandate: 'hidden',
    // The plan rail already carries the committee's work, with a time and a
    // status on each entry: inspecting on a schedule, publishing the standard,
    // first-aid training, the vaccination drive, wellness and mental health,
    // then publishing what was fixed. The activities band repeated five of
    // those six in different words, dropped the timing, and carried a
    // full-screen stock photograph of a clinic that is not LMSA's. It is the
    // same call Academic makes: the spine says it once.
    activities: 'hidden',
    // The page closes on the loop it opened with, not on what a committee is:
    // the association-wide "one of twelve standing committees" pitch belongs on
    // the committees index, not under this committee's work.
    contact: 'compact',
    closing: {
      title: 'The record stays open until the fault is closed.',
      body: 'Every report is checked on site, dated and logged. Where a fix needs the administration, the committee takes it there and keeps the record open until it is done.',
      action: 'Report an issue',
      secondary: {
        label: 'See what’s on this term',
        href: '#committee-plan-title',
      },
    },
    // Health has no committee-scoped news endpoint, but the admin editor files
    // health reporting under the shared `health` news category. `alsoInNews`
    // pulls those posts onto the page and lifts the calendar out of the records
    // section so scheduling and reporting sit together, ahead of the roster.
    alsoInNews: {
      category: 'health',
      heading: 'Health notes',
      intro: 'Reporting filed under Health in the association news.',
    },
    ask: {
      actionLabel: 'Report an issue',
      subject: {
        value: 'health',
        label: 'A health or sanitation issue',
      },
      title: 'Something broken or unsafe? Say so.',
      intro:
        'A tap that has not worked for a month, a hall that is not cleaned, a dormitory with no water. Reporting it starts the committee’s own loop: inspected on site, dated, and followed up until it is fixed.',
      steps: [
        {
          title: 'You report it',
          // "Below" pointed at a form half a page further down once the report
          // loop moved to the top of this page, so it says where the form is.
          text: 'Use the form at the foot of this page, or write to the committee. Say what is wrong and where. One report is enough.',
        },
        {
          title: 'It gets inspected and logged',
          text: 'A member checks the site and records the finding with a date, so the same fault cannot be quietly forgotten.',
        },
        {
          title: 'It is followed up until it is fixed',
          text: 'If the fix needs the administration, the committee takes it there and keeps the record open until it closes.',
        },
      ],
    },
  },

  /* Research & Journal is a publisher. Its output already exists on this site
     — the documents library files journals and newsletters as categories — and
     the registry-shaped page never said so, so a student who wanted to read the
     journal had no route to it. The page now points at the shelves, and closes
     on the thing the committee actually needs from students, which is copy. */
  'research-journal': {
    // The registry sentence names the committee twice and buries the product
    // ("gathers, organizes, edits, and publishes data for LMSA's official
    // journal..."). Same claims, stated as what comes out.
    intro:
      'Publishes LMSA’s journal once a year and a newsletter twice a semester, gathered, edited and reviewed by students before it goes out.',
    support: {
      navLabel: 'Publications',
      title: 'Where the writing lives.',
      intro:
        'The committee edits and publishes; these are the shelves the results go on, and the desk to start from.',
      links: [
        {
          label: 'The journal',
          to: '/documents?category=journal',
          description:
            'Every issue the association has filed, in one place in the documents library.',
        },
        {
          label: 'Newsletters',
          to: '/documents?category=newsletter',
          description:
            'Two a semester, filed alongside the journal so the archive reads in order.',
        },
        {
          label: 'Research desk',
          to: '/academics/research',
          description:
            'What the association offers a student starting a project of their own.',
        },
      ],
    },
    // The default closing is the association-wide "one of twelve standing
    // committees" pitch, which belongs on the index. This one stays on the
    // committee: what it publishes, and what it needs to publish it.
    closing: {
      title: 'What gets published is what gets submitted.',
      body: 'One journal a year and a newsletter twice a semester, edited and reviewed before they go out. Everything published is filed in the documents library, where any member can read it.',
      action: 'Submit your work',
      secondary: { label: 'Open the documents library', href: '/documents' },
    },
  },

  /* Academic is a programme, not a service desk, so its spine is the year's
     plan: two symposia and the workshops between them. The page then has to do
     two jobs the default order cannot — show a student where the committee's
     support already exists (study resources, mentorship, research, symposia),
     and give them a way to change the programme rather than just read it. */
  academic: {
    // The constitutional register is the floor the plan was built from, not a
    // section a student came for, so it folds shut at the end of the plan.
    mandate: 'footnote',
    // The named programmes are printed on the plan rail itself, so the band
    // that listed them separately is gone.
    activities: 'hidden',
    // The registry describes the committee in the third person, for a directory
    // entry ("plans and executes all functions related to LMSA's academic
    // affairs"). That sentence is the first thing a visitor reads here, so the
    // page opens on what the committee actually runs this year instead. Same
    // claims — symposia, workshops, student-chosen topics — written for the
    // person reading it. The registry line still stands on the committees index.
    // The "topics come from students" half of this lives in the ask band and
    // the closing note, both of which ask for something; saying it here too
    // would be the third time on one page.
    intro:
      'The committee runs the year’s academic programme: two symposia, one clinical and one pre-clinical, and the workshops between them.',
    // The association files academic reporting under the shared `academic`
    // news category, so the page carries that reporting without a
    // committee-scoped news endpoint.
    alsoInNews: {
      category: 'academic',
      heading: 'Academic notes',
      intro: 'Reporting filed under Academic in the association news.',
    },
    support: {
      title: 'Where to take a study question.',
      intro:
        'The committee runs the programme. These are the desks it keeps open all year, for the questions that do not need a whole symposium.',
      links: [
        {
          label: 'Study resources',
          to: '/academics/resources',
          description:
            'Past papers, guides and tools the committee keeps current for every year group.',
        },
        {
          label: 'Mentorship',
          to: '/academics/mentorship',
          description:
            'Matched with a student further along the same path, for the advice a syllabus cannot give.',
        },
        {
          label: 'Research',
          to: '/academics/research',
          description:
            'Turn a question into a project, with guidance on where to start and who to ask.',
        },
        {
          label: 'Symposia',
          to: '/academics/symposia',
          description:
            'What is coming up, what past symposia covered, and how to present at the next one.',
        },
        {
          label: 'Career centre',
          to: '/academics/career-center',
          description:
            'Where the degree can go, and what the next step after it takes.',
        },
      ],
    },
    ask: {
      actionLabel: 'Suggest a topic',
      subject: {
        // The value is what lands in the committee's inbox subject line, so it
        // is written to be read there rather than as a slug.
        value: 'Academic programme topic',
        label: 'A topic or speaker for the academic programme',
      },
      title: 'A topic worth an afternoon? Name it.',
      intro:
        'Symposia and workshops are only as good as the questions students bring. If there is something you want taught, argued or demonstrated, it starts here — one suggestion is enough.',
      steps: [
        {
          title: 'You name the topic',
          text: 'Use the form below or write to the committee. Say what you want covered and, if you know of one, who should teach it.',
        },
        {
          title: 'The committee chooses and invites',
          text: 'Suggestions are weighed against the year’s plan and the time a session takes. The committee approaches the speakers and panellists.',
        },
        {
          title: 'It goes on the calendar',
          text: 'Scheduled sessions appear on this page and in the events list, so you can see your idea become an hour.',
        },
      ],
    },
    closing: {
      title: 'The programme is only as good as what students ask for.',
      body: 'Two symposia a year, and the workshops between them, are built from the questions students bring. Suggesting a topic takes a minute and changes what the committee runs.',
      action: 'Suggest a topic',
      secondary: { label: 'See the term’s plan', href: '#committee-plan-title' },
    },
  },
};

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(
  value,
  options = { year: 'numeric', month: 'long', day: 'numeric' }
) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', options);
}

export default function CommitteePageTemplate() {
  const { slug } = useParams();

  // The constitutional registry is bundled, so the page can paint the committee
  // straight away instead of holding a spinner over the API. It starts marked
  // `unavailable`, which is what keeps the page from claiming anything about
  // recruitment it has not been told yet; the request replaces it with the live
  // record, or with null when the API says there is no such committee.
  const [committee, setCommittee] = useState(() => {
    const bundled = ALL_COMMITTEES_DATA[slug];
    return bundled ? { ...bundled, slug, id: slug, unavailable: true } : null;
  });
  const [answered, setAnswered] = useState(false);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [docs, setDocs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [news, setNews] = useState([]);
  const [searchParams] = useSearchParams();
  const railRef = useRef(null);
  // Set by a tab click so the rail brings itself back into view after the panel
  // swaps; a first load and a deep link should not jump.
  const tabChangedRef = useRef(false);

  const profile = COMMITTEE_PROFILES[slug] || {};
  // The only layout that departs from the stacked page: one committee presented
  // as three views instead of one scroll. It is built around the programme
  // ledger — the page fetches it, prints it, and lets it carry the dates instead
  // of a separate calendar.
  const tabsLayout = profile.layout === 'tabs';
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSending, setSending] = useState(false);
  const [newsletterEmail, setNlEmail] = useState('');
  const [nlSent, setNlSent] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const bundled = ALL_COMMITTEES_DATA[slug];
      setCommittee(
        bundled ? { ...bundled, slug, id: slug, unavailable: true } : null
      );
      setAnswered(false);
      setLoading(true);
      setMembers([]);
      setEvents([]);
      setDocs([]);
      setAnnouncements([]);
      setAchievements([]);
      setProgrammes([]);
      setNews([]);

      try {
        let data;
        try {
          data = await committeeService.getBySlug(slug);
        } catch (err) {
          // A 404 is the API's authoritative answer that no active committee has
          // this slug, so yield null and let the not-found state render. Falling
          // back to the bundled data here would resurrect a deactivated
          // committee's page; the bundled copy stays only for other failures
          // (API unreachable / offline setup mode).
          data =
            err?.response?.status === 404
              ? null
              : bundled
                ? { ...bundled, slug, id: slug, unavailable: true }
                : null;
        }
        if (!active) return;
        setCommittee(data);
        setAnswered(true);
        if (!data) {
          setLoading(false);
          return;
        }

        // When the committee is the bundled copy (the API never answered), its
        // related endpoints cannot answer either, and the page would sit on a
        // "loading the roster" spinner forever. Those sections simply stay
        // empty, which is the honest state offline.
        if (data.unavailable) {
          setLoading(false);
          return;
        }

        const [m, ev, d, ann, ach, prog] = await Promise.allSettled([
          committeeService.getMembers(data.id),
          // The public events list, not the authenticated committee route. The
          // latter gives a member everything (drafts included) and a stranger
          // nothing — both wrong for a page meant to be read by the public. This
          // route drops draft events and draft programmes' sessions for anyone
          // who is not staff, so the page shows one list to everyone
          // (docs/16-public-and-portal-boundary.md §3).
          eventService.getAll({ committee: slug }),
          committeeService.getDocuments(data.id),
          committeeService.getAnnouncements(data.id),
          committeeService.getAchievements(data.id),
          // Only a committee whose page is built around the programme prints a
          // ledger, so the other ten do not ask for one. An anonymous visitor
          // gets published programmes only — the API decides that from the
          // caller's role, not from anything the page sends.
          COMMITTEE_PROFILES[slug]?.layout === 'tabs'
            ? committeeService.getProgrammes(data.id)
            : Promise.resolve([]),
        ]);
        if (!active) return;
        setMembers(
          m.status === 'fulfilled' && Array.isArray(m.value) ? m.value : []
        );
        setEvents(
          ev.status === 'fulfilled' && Array.isArray(ev.value) ? ev.value : []
        );
        setDocs(
          d.status === 'fulfilled' && Array.isArray(d.value) ? d.value : []
        );
        setAnnouncements(
          ann.status === 'fulfilled' && Array.isArray(ann.value)
            ? ann.value
            : []
        );
        setAchievements(
          ach.status === 'fulfilled' && Array.isArray(ach.value)
            ? ach.value
            : []
        );
        // No programmes published, or the request failed: the section does not
        // render at all. A public page does not carry a "no programmes yet"
        // placeholder, and it does not fall back to bundled copy either — the
        // fixtures are gone, so there is nothing to show that nobody published.
        setProgrammes(
          prog.status === 'fulfilled' && Array.isArray(prog.value)
            ? prog.value
            : []
        );
      } catch {
        // Only the request itself failed; the committee is simply unreadable.
        if (active) toast.error('Committee not found');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  /* Health posts are association-wide news, not committee records, so they are
     fetched on their own: the page keeps its latest health reporting even when
     the committee endpoint is the bundled offline fallback. A committee without
     `alsoInNews` never requests anything here. */
  const newsCategory = COMMITTEE_PROFILES[slug]?.alsoInNews?.category;

  useEffect(() => {
    if (!newsCategory) {
      setNews([]);
      return undefined;
    }
    let active = true;

    (async () => {
      try {
        const { posts } = await newsService.getAll({
          category: newsCategory,
          limit: 3,
        });
        if (active) setNews(Array.isArray(posts) ? posts.slice(0, 3) : []);
      } catch {
        // No published health reporting yet, or the news endpoint is down. The
        // section simply does not appear; nothing else on the page depends on it.
        if (active) setNews([]);
      }
    })();

    return () => {
      active = false;
    };
  }, [newsCategory]);

  useEffect(() => {
    // Matches the shared .reveal-on-scroll styles in index.css, which already
    // collapse to a static state under prefers-reduced-motion.
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document
      .querySelectorAll('.reveal-on-scroll')
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, slug]);

  const chair = useMemo(
    () =>
      members.find(m => /^chair(person)?$/i.test((m.position || '').trim())),
    [members]
  );
  const viceChair = useMemo(
    () => members.find(m => /vice[\s-]?chair/i.test(m.position || '')),
    [members]
  );
  const others = useMemo(
    () => members.filter(m => m !== chair && m !== viceChair),
    [members, chair, viceChair]
  );
  const board = useMemo(
    () => [chair, viceChair].filter(Boolean),
    [chair, viceChair]
  );

  const upcomingEvents = useMemo(
    () =>
      events.filter(
        ev => ev.status !== 'completed' && ev.status !== 'cancelled'
      ),
    [events]
  );
  const pastEvents = useMemo(
    () => events.filter(ev => ev.status === 'completed'),
    [events]
  );
  const pinned = useMemo(
    () => announcements.filter(a => a.pinned),
    [announcements]
  );
  const notices = useMemo(
    () => announcements.filter(a => !a.pinned),
    [announcements]
  );

  /* The Now tab's first block: the nearest sessions a reader can turn up to,
     across every programme, each labelled with the programme it belongs to so
     the two tabs point at each other. Sort is by start time — the committee's
     own order means something within a programme, not across them. */
  const nextSessions = useMemo(
    () =>
      upcomingEvents
        .filter(event => new Date(event.start_datetime) >= new Date())
        .sort(
          (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
        )
        .slice(0, 3)
        .map(event => ({
          ...event,
          programmeName:
            programmes.find(programme => programme.id === event.programme_id)
              ?.name || null,
        })),
    [upcomingEvents, programmes]
  );

  /* Notices and announcements are one stream of updates to a reader; the pinned
     flag says which to keep, not which kind of thing it is. Newest first, three
     at most — a public page is not an archive. */
  const updates = useMemo(
    () =>
      [...announcements]
        .sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        )
        .slice(0, 3),
    [announcements]
  );

  // A tab is only offered when it has something in it. `Now` can be empty on a
  // committee with nothing published and no dates; `The work` always carries the
  // fault-reporting duty and `People` always carries the way in.
  const nowHasContent =
    nextSessions.length > 0 || updates.length > 0 || news.length > 0;
  const tabItems = [
    { id: 'now', label: 'Now' },
    { id: 'work', label: 'The work' },
    { id: 'people', label: 'People' },
  ].filter(tab => tab.id !== 'now' || nowHasContent);

  // The URL is the tab's state: `?view=work` survives a reload and can be sent
  // to someone. An unknown or absent value lands on the first tab that exists.
  const requestedTab = searchParams.get('view');
  const activeTab = tabItems.some(tab => tab.id === requestedTab)
    ? requestedTab
    : tabItems[0].id;

  useEffect(() => {
    // The flag is cleared inside the frame, not before it: StrictMode runs
    // effects twice in development, and clearing it early turned the second,
    // surviving pass into a no-op that left the reader at the top of the page.
    if (!tabChangedRef.current) return;
    requestAnimationFrame(() => {
      tabChangedRef.current = false;
      railRef.current?.scrollIntoView({ block: 'start' });
    });
  }, [activeTab]);

  const fallback = ALL_COMMITTEES_DATA[slug];
  const committeeCount = Object.keys(ALL_COMMITTEES_DATA).length;
  const mandate =
    (committee?.mandate?.length ? committee.mandate : fallback?.mandate) || [];
  const activities =
    (committee?.key_activities?.length
      ? committee.key_activities
      : fallback?.key_activities) || [];
  const termPlan =
    (committee?.term_plan?.length ? committee.term_plan : fallback?.term_plan) ||
    [];
  const ask = profile.ask || null;
  const support = profile.support || null;
  const heroIntro = profile.intro || null;
  const closingNote = profile.closing || null;
  // The contact band is shared with the other committees' pages as they stand;
  // only a profile that asks for it gets the compact treatment.
  const compactContact = profile.contact === 'compact';
  const newsBrief = profile.alsoInNews || null;
  const upcomingBrief = upcomingEvents.slice(0, 3);
  // The mandate sits above the work by default; a committee whose page is its
  // programme puts the work first and the mandate in a footnote.
  const mandateHidden = profile.mandate === 'hidden';
  // 'footnote' keeps the register on the page as a disclosure inside the plan
  // section, so the duties stay findable without a band of their own.
  const mandateFootnote = profile.mandate === 'footnote';
  const activitiesHidden = profile.activities === 'hidden';
  // Health's programmes are records now, not prose: the committee maintains them
  // in the dashboard and the API derives each one's state from its sessions'
  // datetimes, so nothing on this page types a programme's status and a
  // programme cannot go on claiming to run after its last session has ended.
  // Academic still reads its plan from the bundled registry until it moves over.
  const planHasContent = tabsLayout
    ? programmes.length > 0
    : termPlan.length > 0;

  // The server returns them in reading order (running, upcoming, announced,
  // finished, with the committee's own order breaking ties), so grouping is all
  // that happens here. Empty groups are dropped rather than printed as headings
  // with nothing underneath them.
  const programmeGroups = [
    {
      id: 'running',
      heading: 'Running now',
      dot: 'h-[7px] w-[7px] rounded-full bg-lmsa-600',
      items: programmes.filter(programme => programme.state === 'running'),
    },
    {
      id: 'upcoming',
      heading: 'Still ahead',
      dot: 'h-[7px] w-[7px] rounded-full border border-lmsa-600',
      items: programmes.filter(programme => programme.state === 'upcoming'),
    },
    {
      id: 'announced',
      heading: 'Dates to be announced',
      dot: 'h-[7px] w-[7px] rounded-full border border-dashed border-lmsa-600',
      items: programmes.filter(programme => programme.state === 'announced'),
    },
    {
      id: 'finished',
      heading: 'Earlier in the term',
      dot: 'h-[7px] w-[7px] rounded-full bg-lmsa-200',
      items: programmes.filter(programme => programme.state === 'finished'),
    },
  ].filter(group => group.items.length > 0);

  // A committee with nothing published has no plan section, so a closing link
  // pointing at one would be a dead anchor. The report band is the page's
  // standing offer and stays put.
  const closingSecondary =
    closingNote?.secondary &&
    (closingNote.secondary.href !== '#committee-plan-title' || planHasContent)
      ? closingNote.secondary
      : null;

  // The programme ledger already carries the dates its sessions fall on, and the
  // tabbed page lists the nearest ones on `Now`, so the page never prints them a
  // third time as a calendar column: the programme is the calendar. Its
  // published reporting stays — that is the other clock on that band and
  // nothing else shows it. Where the calendar *is* shown, the records section
  // leaves upcoming events out, so one page never lists the same three dates
  // twice.
  const calendarShown = upcomingBrief.length > 0 && !tabsLayout;
  // A session already printed under its programme above is not listed again
  // here: what this section can still add is the one-off events that belong to
  // no programme.
  const recordsUpcoming =
    tabsLayout && planHasContent
      ? upcomingEvents.filter(event => !event.programme_id)
      : upcomingEvents;

  /* Follows an in-page jump to the contact form. An anchor jump leaves focus
     on <body>, so a keyboard or screen-reader user who takes the page's main
     action starts reading the document again from the top. Focus what they
     actually landed on, and pre-fill the subject when the jump came from the
     report block. A jump aimed at the form itself focuses its first field, so
     the next Tab keeps moving through the fields rather than past them. */
  /* Same idea for the in-page index: a heading marker is not focusable, so the
     jump would leave a keyboard user's focus behind at the top of the page.
     Focusing the heading they arrived at also means the next Tab starts from
     that section rather than from the hero. */
  function jumpTo(id) {
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  function goToContact(subject, { focusField = false } = {}) {
    if (subject) setContactForm(f => ({ ...f, subject }));
    requestAnimationFrame(() => {
      const landed = document.getElementById(
        focusField ? 'committee-contact-name' : 'committee-contact-title'
      );
      landed?.focus();
    });
  }

  async function sendContact(event) {
    event.preventDefault();
    // `required` counts whitespace as filled, so trim before deciding there is
    // something to send — otherwise a spaces-only form mails a blank message.
    const trimmed = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      message: contactForm.message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      toast.error('Please fill in every field — spaces alone are not enough.');
      return;
    }
    setSending(true);
    try {
      await committeeService.submitContactForm(committee.id, {
        ...contactForm,
        ...trimmed,
      });
      toast.success('Message sent. The committee will get back to you.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Your message did not send. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function subscribeNewsletter(event) {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    try {
      await committeeService.subscribeNewsletter(committee.id, email);
      setNlSent(true);
      toast.success('You are subscribed to updates from this committee.');
    } catch {
      toast.error('That subscription did not go through. Please try again.');
    }
  }

  if (!committee && !answered) {
    return (
      <section className="bg-lmsa-900 text-white" aria-busy="true">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <p
            className="flex items-center gap-3 text-[17px] text-lmsa-50"
            aria-live="polite"
          >
            <Loader
              className="animate-spin text-lmsa-200"
              size={18}
              aria-hidden="true"
            />
            Loading this committee…
          </p>
        </div>
      </section>
    );
  }

  if (!committee) {
    return (
      <section className="bg-paper" aria-labelledby="committee-missing-title">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <h1
            id="committee-missing-title"
            className="max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
          >
            No committee at this address.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[19px] leading-8 text-gray-800">
            The committee may have been renamed or is no longer standing. The
            register lists every committee that is.
          </p>
          <Link
            to="/leadership/committees"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
          >
            See the register
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const recruitment = getRecruitmentStatus(committee);
  const status = statusLine(recruitment);
  // An index for a long page, listing only the sections this committee has.
  // The contact entry appears only when the hero's button leaves the page (the
  // round is open and it goes to the join page); when it is closed the button
  // already lands on the form, and a second route to the same anchor 40px
  // below is not navigation. When nothing is left the nav is not rendered at
  // all — an empty <nav> landmark announces "On this page" and offers nothing.
  // A tabbed page is three short views with its tabs above them, so it needs no
  // index; the stacked page does.
  const onPageLinks = tabsLayout ? [] : [
    {
      // Listed only when there is a plan to reach. The hero's action goes to
      // the form (or, when the round is open, off the page), so this is the one
      // route to the programme rather than a second one to somewhere else.
      label: 'This term’s plan',
      href: '#committee-plan-title',
      jump: 'committee-plan-title',
      shown: planHasContent,
    },
    {
      label: support?.navLabel || 'Study support',
      href: '#committee-support-title',
      jump: 'committee-support-title',
      shown: Boolean(support?.links?.length),
    },
    {
      label: 'Write to the committee',
      href: '#committee-contact',
      jump: 'contact',
      shown: Boolean(status?.open),
    },
  ].filter(item => item.shown);
  const photos = stockPhotos;
  const photoOverrides = COMMITTEE_PHOTOS[slug] || {};
  // An override names a `hero`, `sections`, or `stories` photo; the alt text
  // belongs to the picture actually shown, so it travels with the override.
  // A missing key falls back to the shared photo rather than printing nothing.
  function pickPhoto(slot, fallback, fallbackAlt) {
    const override = photoOverrides[slot];
    if (override) {
      const found = override.hero
        ? photos.hero[override.hero]
        : override.section
          ? photos.sections[override.section]
          : photos.stories[override.story];
      if (found) return { ...found, alt: override.alt || found.alt };
    }
    return { ...fallback, alt: fallbackAlt || fallback.alt };
  }
  const opening = pickPhoto(
    'opening',
    photos.sections.connect,
    'Students working together around a table with laptops'
  );
  const planning = pickPhoto(
    'planning',
    photos.sections.lead,
    'A woman arranging notes on a wall covered in sticky notes'
  );
  const practising = pickPhoto(
    'practising',
    photos.stories.symposium,
    'A clinician in a white coat with a stethoscope, looking at a phone'
  );
  // The closing picture is shown in a 547px slot, so it is asked for at 800px
  // rather than the 1200 a full hero needs: less to download on a phone.
  const closing = {
    ...photos.hero.membership,
    src: photos.hero.membership.src.replace('w=1200', 'w=800'),
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Header ---------- */}
      <section
        className="bg-lmsa-900 text-white"
        aria-labelledby="committee-title"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 md:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            {/* Wayfinding sits above the title rather than under the primary
                action: stacked after "Ask the committee" it read as a third,
                competing button. */}
            <Link
              to="/leadership/committees"
              className="mb-7 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-lmsa-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              All committees
            </Link>

            <h1
              id="committee-title"
              className="max-w-[20ch] text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[1.0] tracking-[-0.045em]"
            >
              {committee.name}
            </h1>

            {(heroIntro || committee.description) && (
              <p className="mt-6 max-w-[52ch] text-[19px] leading-8 text-lmsa-50">
                {heroIntro || committee.description}
              </p>
            )}

            {status && (
              <p
                className={`mt-6 text-[15px] leading-6 ${
                  status.open ? 'font-semibold text-lmsa-100' : 'text-lmsa-100'
                }`}
              >
                {status.text}
              </p>
            )}
            {/* A failed recruitment lookup used to be reported here, under the
                intro and above the page's own action. For a standing committee
                that message is about a number this page never otherwise shows,
                and the index already says when recruitment details are
                unavailable — so the hero stays on the work. */}

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* When the round is open the action leaves the page, because the
                  application lives on the join page. When it is not, the page's
                  own action is the one on it: writing to the committee. */}
              {/* A tabbed page puts its actions in its panels — applying under
                  People, reporting under The work — so the hero carries only the
                  committee's address, which every tab can use. */}
              {tabsLayout ? null : status?.open ? (
                <Link
                  to="/get-involved/committees"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  Apply to join
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href="#committee-contact-form"
                  onClick={() => goToContact()}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  Ask the committee
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              )}
              {committee.email && (
                <a
                  href={`mailto:${committee.email}`}
                  className="inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  <Mail size={16} aria-hidden="true" />
                  Email the committee
                </a>
              )}
            </div>

            {/* An index for a long page, set as plain underlined text rather
                than as buttons so the action above keeps the weight a primary
                action needs. See `onPageLinks` for what is listed and why. */}
            {onPageLinks.length > 0 && (
              <nav
                aria-label="On this page"
                className="mt-6 flex flex-wrap items-center gap-x-6 text-[15px] font-semibold text-lmsa-100"
              >
                {onPageLinks.map(item => (
                  <a
                    key={item.jump}
                    href={item.href}
                    onClick={() => {
                      // The report entry lands on the form with its subject
                      // already set, exactly as the ask band's button does.
                      if (item.jump === 'contact-form') {
                        goToContact(ask.subject.value, { focusField: true });
                      } else if (item.jump === 'contact') {
                        goToContact();
                      } else {
                        jumpTo(item.jump);
                      }
                    }}
                    className="inline-flex min-h-11 items-center underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={opening.src}
              alt={opening.alt}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {opening.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- The rail (tabbed layout) ----------
          Three views of one committee. Links rather than ARIA tabs: each view
          has a URL that can be sent to someone or reloaded, and the back button
          does the obvious thing. The active one is marked with a rule and
          `aria-current`, not by colour alone. A one-tab rail would be noise, so
          the rail only renders when there is a choice to make. */}
      {tabsLayout && tabItems.length > 1 && (
        <nav
          ref={railRef}
          aria-label="Sections of this committee’s page"
          className="scroll-mt-28 border-b border-lmsa-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="-mb-px flex gap-8 overflow-x-auto">
              {tabItems.map(tab => (
                <li key={tab.id} className="shrink-0">
                  <Link
                    to={`/leadership/committees/${slug}${
                      tab.id === 'now' ? '' : `?view=${tab.id}`
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    onClick={() => {
                      tabChangedRef.current = true;
                    }}
                    className={`inline-flex min-h-[56px] items-center border-b-2 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 ${
                      activeTab === tab.id
                        ? 'border-lmsa-600 text-lmsa-900'
                        : 'border-transparent text-gray-600 hover:text-lmsa-800'
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* ---------- Now: the next three things to turn up to ----------
          The tab answers one question — is there anything for me this week — so
          dates lead and nothing sits above them. Each row names its programme so
          a reader can go straight from the date to the work it belongs to. */}
      {tabsLayout && activeTab === 'now' && nextSessions.length > 0 && (
        <section className="bg-paper" aria-labelledby="committee-now-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="reveal-on-scroll flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2
                id="committee-now-title"
                className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                Next up.
              </h2>
              <Link
                to="/events"
                className="text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
              >
                All events
              </Link>
            </div>

            <ul className="mt-10 border-t border-lmsa-200">
              {nextSessions.map(session => {
                const registrationOpen =
                  Boolean(session.registration_required) &&
                  (!session.registration_deadline ||
                    new Date(session.registration_deadline) > new Date());
                const timing = [
                  formatDate(session.start_datetime, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  }),
                  new Date(session.start_datetime).toLocaleTimeString('en-GB', {
                    hour: 'numeric',
                    minute: '2-digit',
                  }),
                  session.venue || session.location,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <li
                    key={session.id || session.slug}
                    className="grid gap-y-2 border-b border-lmsa-200 py-6 md:grid-cols-[16rem_1fr] md:items-baseline md:gap-x-10"
                  >
                    <p className="text-balance text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-lmsa-700">
                      {timing}
                    </p>
                    <div>
                      <p className="text-[21px] font-semibold leading-7 text-lmsa-900">
                        {session.title}
                      </p>
                      {session.programmeName && (
                        <p className="mt-1 max-w-[52ch] text-[15px] leading-6 text-gray-700">
                          {session.programmeName}
                        </p>
                      )}
                      {session.slug && (
                        <Link
                          to={`/events/${session.slug}`}
                          className="mt-2 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
                        >
                          {registrationOpen ? 'Register' : 'Session details'}
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Updates (tabbed layout) ----------
          Notices and announcements are one stream to a reader; `pinned` decides
          what to keep at the top, not what kind of thing it is. The pinned band
          below is the stacked page's treatment; a tabbed page reads it as a list
          with dates. */}
      {tabsLayout && activeTab === 'now' && updates.length > 0 && (
        <section className="bg-white" aria-labelledby="committee-updates-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <h2
              id="committee-updates-title"
              className="max-w-[20ch] text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.04em] text-lmsa-900"
            >
              Updates from the committee.
            </h2>
            <ul className="mt-8 max-w-[64ch] border-t border-lmsa-200">
              {updates.map(update => (
                <li
                  key={update.id}
                  className="border-b border-lmsa-200 py-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-[17px] font-semibold leading-7 text-lmsa-900">
                      {update.title}
                    </p>
                    {formatDate(update.created_at) && (
                      <p className="shrink-0 text-[14px] leading-6 text-gray-600">
                        {formatDate(update.created_at)}
                      </p>
                    )}
                  </div>
                  {update.message && (
                    <p className="mt-1 text-[17px] leading-7 text-gray-800">
                      {update.message}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Notices pinned by the committee ---------- */}
      {!tabsLayout && pinned.length > 0 && (
        <section className="bg-lmsa-50" aria-label="Pinned notices">
          <ul className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
            {pinned.map(notice => (
              <li key={notice.id} className="max-w-[62ch]">
                <p className="text-[17px] font-semibold leading-7 text-lmsa-900">
                  {notice.title}
                </p>
                {notice.message && (
                  <p className="mt-1 text-[17px] leading-7 text-gray-800">
                    {notice.message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- The programme: what the committee is running ----------
          The programme is the spine of the page where a committee publishes
          one. A reader arrives
          for what the committee puts on — training, drives, workshops — not for
          a description of a remit, so it opens the page with a timing and a
          state on every entry. On a tabbed committee it is fetched: the
          committee maintains its programmes in the dashboard and the API derives
          each one's state from its sessions. Printed only when there is a
          published programme, so a committee with nothing announced yet gets no
          empty section and the hero keeps its reporting action. */}
      {planHasContent &&
        (!tabsLayout || activeTab === 'work') && (
        <section className="bg-lmsa-50" aria-labelledby="committee-plan-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              {/* The closing section links here; the offset clears the sticky
                  header (112px on desktop) rather than hiding this under it. */}
              <h2
                id="committee-plan-title"
                tabIndex={-1}
                className="scroll-mt-32 max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lmsa-600"
              >
                {tabsLayout
                  ? 'This term’s programme.'
                  : 'What we are doing this term.'}
              </h2>
              <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
                {tabsLayout
                  ? 'Open to students and the wider community, not only members. Every programme below carries its state and its timing, so you can see what is running and what is coming. Underneath them is the standard they are held to, and the record published at the end of the term.'
                  : 'Planned from the mandate, with where each piece stands. The committee keeps this list up to date as the term moves.'}
              </p>
            </div>

            {/* The rail is the plan's structure: a time column, the entry, and
                its state. Set on hairlines like the site's other registers so
                it reads as a schedule rather than a set of promises. */}
            {/* The ledger names the programmes and answers the state
                question in the same breath: what is running now, then what is
                still ahead, each row led by the programme a student would ask
                for by name. The two machinery entries follow as their own
                ledger — they are not things to turn up to. */}
            {tabsLayout && programmes.length > 0 && (
              <div className="mt-14 lg:max-w-[68rem]">
                {/* State comes first, as it does on the rest of this page, and
                    each row is led by the programme's own name — what a reader
                    came to find and what they would ask for by name. */}
                {programmeGroups.map((group, index) => (
                  <div
                    key={group.id}
                    className={`reveal-on-scroll ${index > 0 ? 'mt-14' : ''}`}
                  >
                    <h3 className="flex items-center gap-3 border-b border-lmsa-200 pb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-lmsa-700">
                      <span aria-hidden="true" className={group.dot} />
                      {group.heading}
                    </h3>
                    <ul>
                      {group.items.map(programme => (
                        <ProgrammeEntry
                          key={programme.id}
                          programme={programme}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {!tabsLayout && (
            <ol className="mt-14 border-t border-lmsa-200 lg:max-w-[68rem]">
              {termPlan.map(item => (
                <li
                  key={`${item.when}-${item.title}`}
                  className="reveal-on-scroll grid gap-y-3 border-b border-lmsa-200 py-6 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-x-10 lg:grid-cols-[16rem_1fr_auto]"
                >
                  {/* The time column is wide enough at desktop for the longest
                      timing phrase the plan uses ("Before the first symposium"
                      measures 246px at this size and tracking); the old 10rem
                      column broke every label after a word or two and left the
                      rail looking mis-set. Where a phrase still outgrows its
                      column, at tablet widths or with new data, it balances
                      rather than orphaning one word. */}
                  <p className="text-balance text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-lmsa-700">
                    {item.when}
                  </p>
                  <div>
                    <p className="max-w-[52ch] text-[19px] leading-8 text-lmsa-900">
                      {item.title}
                    </p>
                    {/* The name a student would ask for by name — "Clinical
                        Skills Workshops" — belongs on the entry that runs it,
                        not in a second list of the same programmes. */}
                    {item.programme && (
                      <p className="mt-2 text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-lmsa-700">
                        {item.programme}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-lmsa-700">
                    <span
                      aria-hidden="true"
                      className={`h-[7px] w-[7px] rounded-full ${
                        item.status === 'ongoing'
                          ? 'bg-lmsa-600'
                          : 'border border-lmsa-600'
                      }`}
                    />
                    {item.status === 'ongoing' ? 'Ongoing' : 'Planned'}
                  </span>
                </li>
              ))}
            </ol>
            )}

            {mandateFootnote && mandate.length > 0 && (
              <>
                {/* With the mandate and activity bands gone, the plan is the
                    section that carries a photograph, and a session in progress
                    is what the rail above describes. */}
                <figure className="reveal-on-scroll mt-16 lg:max-w-[52rem]">
                  <img
                    src={planning.src}
                    alt={planning.alt}
                    className="aspect-[16/9] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                    Photo: {planning.credit}
                  </figcaption>
                </figure>

                {/* The register used to be a band above the programme, saying
                    in the constitution's words what the plan says in the
                    committee's. It keeps its place on the page as evidence,
                    folded shut. */}
                <details className="group mt-14 border-t border-lmsa-200 pt-6 lg:max-w-[68rem]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm text-[19px] font-semibold leading-7 text-lmsa-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
                    Written into the constitution.
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-lmsa-700 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-4 max-w-[52ch] text-[17px] leading-7 text-gray-800">
                    The duties the constitution sets for this committee — the
                    floor the plan above is built on.
                  </p>
                  <ul className="mt-6 border-t border-lmsa-200">
                    {mandate.map(item => (
                      <li
                        key={item}
                        className="border-b border-lmsa-200 py-4 text-[17px] leading-7 text-lmsa-900"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/about/constitution#elections"
                    className="mt-6 inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                  >
                    Read the constitution
                  </Link>
                </details>
              </>
            )}
          </div>
        </section>
      )}

      {/* ---------- The report loop: the tabbed page's standing offer ----------
          Reporting is not why this page is opened — the programme is — but it is
          the committee's other duty and the one thing here no other committee
          offers. So it follows the programme, on paper: read after the work it
          is an offer; read before it, it asked a student to have a problem
          first. The three steps are the promise about what happens after a
          report lands, so they sit beside the invitation rather than below it. */}
      {tabsLayout && ask && activeTab === 'work' && (
        <section className="bg-paper" aria-labelledby="committee-ask-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
              <div className="reveal-on-scroll">
                <h2
                  id="committee-ask-title"
                  tabIndex={-1}
                  className="max-w-[16ch] scroll-mt-32 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.0] tracking-[-0.045em] text-lmsa-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lmsa-600"
                >
                  {ask.title}
                </h2>
                <p className="mt-6 max-w-[46ch] text-[19px] leading-8 text-gray-800">
                  {ask.intro}
                </p>
                <a
                  href="#committee-contact-form"
                  onClick={() =>
                    goToContact(ask.subject.value, { focusField: true })
                  }
                  className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {ask.actionLabel || 'Report an issue'}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>

              <ol className="reveal-on-scroll border-t border-lmsa-200">
                {ask.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-lmsa-200 py-5 md:grid-cols-[3.5rem_1fr] md:gap-x-6"
                  >
                    <span
                      aria-hidden="true"
                      className="pt-[0.3rem] text-[13px] font-semibold tabular-nums text-lmsa-700"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[19px] font-semibold leading-7 text-lmsa-900">
                        {step.title}
                      </p>
                      <p className="mt-1 max-w-[44ch] text-[17px] leading-7 text-gray-800">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ---------- What the committee is for ----------
          Skipped entirely where the mandate is the footnote: the register is
          the committee's remit, and a page built around its programme puts that
          programme in front of it rather than this. */}
      {!mandateHidden && !mandateFootnote && (
      <section className="bg-paper" aria-labelledby="committee-mandate-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="committee-mandate-title"
              className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              Written into the constitution.
            </h2>
            {mandate.length === 0 && (
              <p className="mt-5 max-w-[48ch] text-[19px] leading-8 text-gray-800">
                The constitution sets this committee up; its written mandate is
                not published yet.
              </p>
            )}
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16">
            <figure className="reveal-on-scroll">
              <img
                src={planning.src}
                alt={planning.alt}
                className="aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                Photo: {planning.credit}
              </figcaption>
            </figure>

            <div className="reveal-on-scroll">
              {/* The duties read as a register, so they are set as numbered
                  ledger rows: the numeral is the label column, the duty the
                  entry. Six sentences stacked as plain paragraphs read as one
                  block and cannot be counted or scanned. */}
              {mandate.length > 0 && (
                <ol className="border-t border-lmsa-200">
                  {mandate.map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-lmsa-200 py-5 md:grid-cols-[3.5rem_1fr] md:gap-x-6"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-[0.4rem] text-[13px] font-semibold tabular-nums text-lmsa-700"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="max-w-[44ch] text-[19px] leading-8 text-lmsa-900">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
              <Link
                to="/about/constitution#elections"
                className="mt-8 inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Read the constitution
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ---------- The work ---------- */}
      {!activitiesHidden && activities.length > 0 && (
        <section className="bg-white" aria-labelledby="committee-work-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-work-title"
                className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                What members take on.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
                {mandateHidden
                  ? 'Six pieces of work the committee runs through the year.'
                  : 'The mandate above is what the constitution requires. This is what it looks like over a term.'}
              </p>
            </div>

            {/* A rule above each entry, the way the site sets its article
                ledgers, so the list reads as a programme rather than a
                paragraph that happens to be broken into lines. */}
            <ol className="mt-12 grid gap-x-16 gap-y-9 md:grid-cols-2">
              {activities.map((activity, index) => (
                <li
                  key={activity}
                  className="reveal-on-scroll border-t border-lmsa-200 pt-5"
                >
                  <span
                    aria-hidden="true"
                    className="text-[13px] font-semibold tabular-nums text-lmsa-700"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 max-w-[40ch] text-[19px] leading-8 text-gray-800">
                    {activity}
                  </p>
                </li>
              ))}
            </ol>

            <figure className="reveal-on-scroll mt-16">
              <img
                src={practising.src}
                alt={practising.alt}
                className="aspect-[16/9] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
                Photo: {practising.credit}
              </figcaption>
            </figure>

          </div>
        </section>
      )}

      {/* ---------- Study support routes ----------
          Academic work is mostly done elsewhere on the site: the library, the
          mentorship scheme, the research desk. A student who lands here looking
          for help does not need another description of the committee's remit,
          so these routes sit under the programme, set as a ledger rather than a
          set of cards. Only a profile with routes gets the section. */}
      {support && support.links?.length > 0 && (
        <section className="bg-paper" aria-labelledby="committee-support-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-support-title"
                tabIndex={-1}
                className="scroll-mt-32 max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lmsa-600"
              >
                {support.title}
              </h2>
              {support.intro && (
                <p className="mt-5 max-w-[52ch] text-[19px] leading-8 text-gray-800">
                  {support.intro}
                </p>
              )}
            </div>

            <ul className="mt-12 grid gap-x-16 md:grid-cols-2">
              {support.links.map((link, index) => (
                <li
                  key={link.to}
                  className={`reveal-on-scroll border-t border-lmsa-200 py-6 ${
                    // An odd count would otherwise leave a hole in the last row;
                    // the final row closes the ledger across the full width.
                    index === support.links.length - 1 &&
                    support.links.length % 2 === 1
                      ? 'md:col-span-2'
                      : ''
                  }`}
                >
                  <Link
                    to={link.to}
                    className="group inline-flex min-h-11 items-center gap-2 text-[19px] font-semibold leading-7 text-lmsa-900 underline decoration-2 decoration-lmsa-200 underline-offset-[6px] transition-colors hover:decoration-lmsa-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                  >
                    {link.label}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="translate-y-[2px] transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                  <p className="mt-2 max-w-[44ch] text-[17px] leading-7 text-gray-800">
                    {link.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Ask the committee for something ----------
          The page's one dark interruption, placed where intent is highest: a
          student who has just read what the committee does and wants it to do
          something. Academic lets them propose a topic here. The button
          preselects the subject on the contact form below, so the message does
          not arrive as a general enquiry — it reuses the form already on the
          page rather than adding an endpoint.

          The tabbed layout skips this band: its ask is the reason that tab
          exists, so it renders on paper inside `The work` instead, and the dark
          band would only be the same invitation a second time. */}
      {ask && !tabsLayout && (
        <section className="bg-lmsa-900 text-white" aria-labelledby="committee-ask-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16 lg:px-8">
            <div className="reveal-on-scroll">
              <h2
                id="committee-ask-title"
                className="max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.0] tracking-[-0.045em]"
              >
                {ask.title}
              </h2>
              <p className="mt-6 max-w-[46ch] text-[19px] leading-8 text-lmsa-100">
                {ask.intro}
              </p>
              <a
                href="#committee-contact-form"
                onClick={() => goToContact(ask.subject.value, { focusField: true })}
                className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                {ask.actionLabel || 'Ask the committee'}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>

            <ol className="reveal-on-scroll border-t border-lmsa-700">
              {ask.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-lmsa-700 py-5 md:grid-cols-[3.5rem_1fr] md:gap-x-6"
                >
                  <span
                    aria-hidden="true"
                    className="pt-[0.3rem] text-[13px] font-semibold tabular-nums text-lmsa-200"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[19px] font-semibold leading-7 text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 max-w-[46ch] text-[17px] leading-7 text-lmsa-100">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- What is happening: health reporting ----------
          What has already been published, carried by the association's `health`
          news category rather than a committee field that does not exist. The
          scheduled half of this band has moved onto the programme ledger above
          wherever a committee publishes programmes; on a committee that does
          not, the calendar column still renders here. Either column can be
          empty without collapsing the other, and with both empty the section
          does not render at all. */}
      {(!tabsLayout || activeTab === 'now') &&
        newsBrief &&
        (calendarShown || news.length > 0) && (
        <section className="bg-lmsa-50" aria-labelledby="committee-happening-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-happening-title"
                className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                What is happening.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[19px] leading-8 text-gray-800">
                {calendarShown
                  ? news.length > 0
                    ? 'What the committee has scheduled next, and what its work has been reported as.'
                    : 'What the committee has scheduled next.'
                  : "What the committee's work has been reported as."}
              </p>
            </div>

            <div
              className={`mt-14 grid gap-14 lg:gap-16 ${
                calendarShown && news.length > 0
                  ? 'lg:grid-cols-[1fr_1fr]'
                  : 'lg:grid-cols-[minmax(0,32rem)]'
              }`}
            >
              {calendarShown && (
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-lmsa-200 pb-3">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-lmsa-700">
                      On the calendar
                    </h3>
                    <Link
                      to="/events"
                      className="shrink-0 text-[14px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-900"
                    >
                      All events
                    </Link>
                  </div>
                  <ul className="mt-6 space-y-8">
                    {upcomingBrief.map(event => (
                      <EventRow key={event.id || event.slug} event={event} />
                    ))}
                  </ul>
                </div>
              )}

              {news.length > 0 && (
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-lmsa-200 pb-3">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-lmsa-700">
                      {newsBrief.heading}
                    </h3>
                    <Link
                      to="/news"
                      className="shrink-0 text-[14px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-4 transition-colors hover:decoration-lmsa-900"
                    >
                      All news
                    </Link>
                  </div>
                  <p className="mt-4 text-[15px] leading-6 text-gray-700">
                    {newsBrief.intro}
                  </p>
                  <ul className="mt-6 space-y-7">
                    {news.map(post => (
                      <li key={post.id || post.slug} className="reveal-on-scroll">
                        {formatDate(post.published_at, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }) && (
                          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-600">
                            {formatDate(post.published_at, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                        <Link
                          to={`/news/${post.slug}`}
                          className="mt-1 inline-block text-[19px] font-semibold leading-7 text-lmsa-900 underline decoration-2 decoration-lmsa-200 underline-offset-[6px] transition-colors hover:decoration-lmsa-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="mt-2 max-w-[56ch] text-[16px] leading-7 text-gray-800">
                            {post.excerpt}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Who does the work ----------
          Only when there is a roster. A committee that has not published its
          members used to get a full section whose whole content was an apology;
          that fact belongs in one line beside the contact form, not a screen. */}
      {members.length > 0 &&
        (!tabsLayout || activeTab === 'people') && (
        <section className="bg-paper" aria-labelledby="committee-people-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-people-title"
                className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                Who is serving this year.
              </h2>
            </div>

            {board.length > 0 && (
              <ul className="mt-14 space-y-10">
                {board.map(member => (
                  <li
                    key={member.id || member.full_name}
                    className="reveal-on-scroll grid gap-4 md:grid-cols-[0.38fr_1fr] md:gap-12"
                  >
                    <div className="flex items-center gap-4">
                      {member.profile_photo_url ? (
                        <img
                          src={member.profile_photo_url}
                          alt={member.full_name}
                          className="h-16 w-16 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lmsa-100 text-lg font-bold text-lmsa-800"
                        >
                          {initialsOf(member.full_name)}
                        </span>
                      )}
                      <div>
                        <p className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900">
                          {member.full_name}
                        </p>
                        <p className="mt-1 text-[15px] leading-6 text-gray-700">
                          {member.position}
                          {member.year_level
                            ? ` · Year ${member.year_level}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    {member.bio && (
                      <p className="max-w-[56ch] text-[17px] leading-7 text-gray-800">
                        {member.bio}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {others.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  {others.length} {others.length === 1 ? 'member' : 'members'}
                </h3>
                <ul className="mt-6 grid gap-x-16 gap-y-4 md:grid-cols-2">
                  {others.map(member => (
                    <li
                      key={member.id || member.full_name}
                      className="reveal-on-scroll flex flex-wrap items-baseline gap-x-3 text-[17px] leading-7"
                    >
                      <span className="font-semibold text-lmsa-900">
                        {member.full_name}
                      </span>
                      {member.position && (
                        <span className="text-gray-700">{member.position}</span>
                      )}
                      {member.year_level && (
                        <span className="text-gray-700">
                          Year {member.year_level}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Join the committee (tabbed layout) ----------
          The way in, in public. Two readers reach this tab: a student asking how
          to join, and a resident asking what they can do if they are not joining
          at all. Both are answered, because the page is the association's public
          face and most of its readers are not members. Only the first is gated
          on a recruitment round — reporting a fault never is. */}
      {tabsLayout && activeTab === 'people' && (
        <section className="bg-lmsa-50" aria-labelledby="committee-join-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
              <div className="reveal-on-scroll">
                <h2
                  id="committee-join-title"
                  className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
                >
                  Join the committee.
                </h2>
                <p className="mt-5 max-w-[48ch] text-[19px] leading-8 text-gray-800">
                  Standing committees are staffed by students, and applications
                  are made online — you will be asked to sign in before you write
                  your statement.
                </p>
                {status && (
                  <p className="mt-4 text-[15px] leading-6 text-gray-700">
                    {status.text}
                  </p>
                )}
                {status?.open ? (
                  <Link
                    to="/get-involved/committees"
                    className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                  >
                    Apply to join
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    to="/get-involved/committees"
                    className="mt-8 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
                  >
                    How committee recruitment works
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </div>

              <div className="reveal-on-scroll border-t border-lmsa-200 pt-8 lg:border-t-0 lg:border-l lg:pl-16 lg:pt-0">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Not applying?
                </h3>
                <p className="mt-4 max-w-[46ch] text-[17px] leading-7 text-gray-800">
                  Anyone can report a faulty tap, a hall that is not cleaned, or a
                  dormitory with no water — staff, neighbours and students alike.
                  A member inspects what is reported, dates the finding, and keeps
                  the record open until the fault is fixed.
                </p>
                <a
                  href="#committee-contact-form"
                  onClick={() =>
                    goToContact(ask?.subject?.value, { focusField: true })
                  }
                  className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  {ask?.actionLabel || 'Report an issue'}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Records: notices, events, documents, milestones ---------- */}
      {!tabsLayout &&
        (notices.length > 0 ||
        (!calendarShown && recordsUpcoming.length > 0) ||
        pastEvents.length > 0 ||
        docs.length > 0 ||
        achievements.length > 0) && (
        <section className="bg-white" aria-labelledby="committee-records-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-records-title"
                className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                On the record.
              </h2>
            </div>

            {notices.length > 0 && (
              <div className="mt-14">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Notices
                </h3>
                <ul className="mt-6 space-y-5">
                  {notices.map(notice => (
                    <li
                      key={notice.id}
                      className="reveal-on-scroll max-w-[62ch]"
                    >
                      <p className="text-[17px] font-semibold leading-7 text-lmsa-900">
                        {notice.title}
                      </p>
                      {notice.message && (
                        <p className="mt-1 text-[17px] leading-7 text-gray-800">
                          {notice.message}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!calendarShown && recordsUpcoming.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Coming up
                </h3>
                <ul className="mt-6 space-y-8">
                  {recordsUpcoming.map(event => (
                    <EventRow key={event.id || event.slug} event={event} />
                  ))}
                </ul>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Already held
                </h3>
                <ul className="mt-6 space-y-6">
                  {pastEvents.map(event => (
                    <EventRow key={event.id || event.slug} event={event} past />
                  ))}
                </ul>
              </div>
            )}

            {docs.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Documents
                </h3>
                <ul className="mt-6 max-w-[68ch] space-y-6">
                  {docs.map(doc => (
                    <DocumentRow key={doc.id || doc.file_url} doc={doc} />
                  ))}
                </ul>
              </div>
            )}

            {achievements.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Milestones
                </h3>
                <ul className="mt-6 space-y-6">
                  {achievements.map((achievement, index) => (
                    <li
                      key={achievement.id || index}
                      className="reveal-on-scroll max-w-[58ch]"
                    >
                      <p className="text-[17px] font-semibold leading-7 text-lmsa-900">
                        {achievement.title}
                      </p>
                      {achievement.description && (
                        <p className="mt-1 text-[17px] leading-7 text-gray-800">
                          {achievement.description}
                        </p>
                      )}
                      {formatDate(achievement.date, {
                        year: 'numeric',
                        month: 'long',
                      }) && (
                        <p className="mt-1 text-[15px] leading-6 text-gray-700">
                          {formatDate(achievement.date, {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Contact ---------- */}
      <section
        id="committee-contact"
        className="scroll-mt-24 bg-paper"
        aria-labelledby="committee-contact-title"
      >
        <div
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
            compactContact ? 'py-14 md:py-16' : 'py-20 md:py-28'
          }`}
        >
          {/* The copy is one block on desktop and a set of loose items on a
              phone (`contents`), which is what lets the form sit between the
              copy and the newsletter without a second copy of either in the
              DOM. With no gap on the wrapper, the spacing a block would have
              supplied comes from the children's own margins. */}
          <div
            className={`grid lg:items-start lg:gap-x-16 ${
              compactContact
                ? 'gap-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-y-10'
                : 'gap-0 lg:grid-cols-[1.05fr_0.95fr] lg:gap-y-14'
            }`}
          >
            <div className="reveal-on-scroll contents lg:col-start-1 lg:row-start-1 lg:block">
              <h2
                id="committee-contact-title"
                tabIndex={-1}
                className={`${
                  compactContact
                    ? 'max-w-[22ch] text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.12] tracking-[-0.03em] '
                    : 'max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.04em] '
                }font-bold text-lmsa-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lmsa-600`}
              >
                Write to the committee.
              </h2>
              <p
                className={`max-w-[46ch] text-gray-800 ${
                  compactContact ? 'mt-3 text-[17px] leading-7' : 'mt-5 text-[19px] leading-8'
                }`}
              >
                {/* The report block sends people to this form, so the tabbed
                    page names the thing that arrives here rather than leaving
                    the reader to work out that a fault is reported here. */}
                {tabsLayout
                  ? 'Report a fault, ask about the work, or request a document.'
                  : 'A question about the work, a request for a document, or an idea for the year ahead.'}
              </p>

              {!loading && members.length === 0 && (
                <p className="mt-6 max-w-[46ch] text-[17px] leading-7 text-gray-800">
                  {committee.unavailable
                    ? 'Committee members for this year: we couldn’t load the roster. Refresh the page, or write to the committee for the current list.'
                    : 'This year’s roster is not published yet. Seats are appointed by the Executive Committee at the start of the year.'}
                </p>
              )}

              {committee.email && (
                <p className="mt-6 max-w-[46ch] text-[17px] leading-7 text-gray-800">
                  Or write directly to{' '}
                  <a
                    href={`mailto:${committee.email}`}
                    className="font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
                  >
                    {committee.email}
                  </a>
                  .
                </p>
              )}

              {/* Sits in the same column as the copy rather than in the grid's
                  second row: placed in the row instead, it waited below the
                  whole height of the form and left a dead gap under the copy.
                  On a phone it follows the form, because a subscription offered
                  before the form asked for a message buries the thing the
                  section exists for. */}
              <div className="order-last mt-8 max-w-[46ch] lg:order-none">
                <h3 className="text-[17px] font-semibold text-lmsa-900">
                  Updates from this committee
                </h3>
                {nlSent ? (
                  <p
                    className="mt-3 text-[16px] leading-7 text-lmsa-700"
                    role="status"
                  >
                    You are on the list. Updates will arrive at{' '}
                    {newsletterEmail}.
                  </p>
                ) : (
                  <form
                    onSubmit={subscribeNewsletter}
                    className="mt-3 flex flex-wrap gap-3"
                  >
                    <label
                      htmlFor="committee-newsletter-email"
                      className="sr-only"
                    >
                      Email address for committee updates
                    </label>
                    <input
                      id="committee-newsletter-email"
                      type="email"
                      placeholder="you@example.com"
                      className="input min-h-12 flex-1 sm:min-w-[14rem]"
                      value={newsletterEmail}
                      onChange={e => setNlEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-12 items-center rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* The form is set as a contained card rather than a bare column: a
                full-bleed form read as a second page section and pulled weight
                away from the work above it. */}
            <form
              id="committee-contact-form"
              onSubmit={sendContact}
              className={`reveal-on-scroll scroll-mt-24 lg:col-start-2 lg:row-start-1 lg:mt-0 ${
                compactContact
                  ? 'mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-5 sm:p-6'
                  : 'mt-10 space-y-5'
              }`}
            >
              {/* Only the compact card pairs the name and email fields; the
                  shared layout keeps its single column of fields. */}
              <div className={compactContact ? 'grid gap-4 sm:grid-cols-2' : 'space-y-5'}>
                <div>
                  <label
                    htmlFor="committee-contact-name"
                    className="block text-[15px] font-semibold text-lmsa-900"
                  >
                    Your name
                  </label>
                  <input
                    id="committee-contact-name"
                    className="input mt-2 min-h-12"
                    value={contactForm.name}
                    onChange={e =>
                      setContactForm(f => ({ ...f, name: e.target.value }))
                    }
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="committee-contact-email"
                    className="block text-[15px] font-semibold text-lmsa-900"
                  >
                    Your email
                  </label>
                  <input
                    id="committee-contact-email"
                    className="input mt-2 min-h-12"
                    type="email"
                    value={contactForm.email}
                    onChange={e =>
                      setContactForm(f => ({ ...f, email: e.target.value }))
                    }
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="committee-contact-subject"
                  className="block text-[15px] font-semibold text-lmsa-900"
                >
                  What is this about?
                </label>
                <select
                  id="committee-contact-subject"
                  className="input mt-2 min-h-12"
                  value={contactForm.subject}
                  onChange={e =>
                    setContactForm(f => ({ ...f, subject: e.target.value }))
                  }
                >
                  <option value="">General enquiry</option>
                  <option value="join">Joining this committee</option>
                  <option value="event">An event</option>
                  <option value="resource">A document or resource</option>
                  {ask && (
                    <option value={ask.subject.value}>
                      {ask.subject.label}
                    </option>
                  )}
                  <option value="other">Something else</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="committee-contact-message"
                  className="block text-[15px] font-semibold text-lmsa-900"
                >
                  Your message
                </label>
                <textarea
                  id="committee-contact-message"
                  className="input mt-2 resize-none"
                  rows={4}
                  value={contactForm.message}
                  onChange={e =>
                    setContactForm(f => ({ ...f, message: e.target.value }))
                  }
                  maxLength={2000}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={contactSending}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {contactSending ? (
                  <>
                    <Loader
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail size={16} aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      {closingNote ? (
        <section
          className="bg-lmsa-900 text-white"
          aria-labelledby="committee-next-title"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="reveal-on-scroll max-w-[62ch]">
              <h2
                id="committee-next-title"
                className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.9rem)] font-bold leading-[1.04] tracking-[-0.04em]"
              >
                {closingNote.title}
              </h2>
              <p className="mt-5 max-w-[52ch] text-[19px] leading-8 text-lmsa-50">
                {closingNote.body}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="#committee-contact-form"
                  onClick={() => goToContact(ask?.subject?.value, { focusField: true })}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  {closingNote.action}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                {closingSecondary && (
                  <a
                    href={closingSecondary.href}
                    className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-100 underline decoration-2 underline-offset-[6px] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                  >
                    {closingSecondary.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
      <section
        className="bg-lmsa-900 text-white"
        aria-labelledby="committee-next-title"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="committee-next-title"
              className="max-w-[16ch] text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em]"
            >
              One of {committeeCount} standing committees.
            </h2>
            <p className="mt-5 max-w-[50ch] text-[20px] leading-8 text-lmsa-50">
              Committee seats are appointed each year by the Executive
              Committee. The register shows the work every committee does, and
              which ones are taking names now.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/get-involved/committees"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Join a committee
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={closing.src}
              alt="Students studying together at a library table"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {closing.credit}
            </figcaption>
          </figure>
        </div>
      </section>
      )}
    </div>
  );
}

/* ---------- Rows ---------- */

/* What the page itself already says about who its work is for. A programme's
   audience line is printed only when it says something different: repeating one
   sentence on every row is noise, and a row that omits it is not hiding
   anything. */
const PAGE_AUDIENCE = 'open to students and the wider community';

const normaliseAudience = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\.$/, '');

/* One programme in the tabbed page's ledger.

   The name is the row's heading, because that is what a student came to find.
   The next session is stated as a fact — day, time, place — rather than as a
   promise, and what has already happened is a count, not a second list of the
   same dates.

   Nothing here decides a state. `state`, `sessions` and `past_session_count` all
   arrive computed from the sessions' datetimes, so an entry cannot claim to be
   running after its last session has ended just because nobody edited a label. A
   programme with no sessions says so and links nowhere. */
function ProgrammeEntry({ programme }) {
  const next = programme.sessions?.[0] || null;
  const past = programme.past_session_count || 0;

  const day = next
    ? formatDate(next.start_datetime, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null;
  const time = next
    ? new Date(next.start_datetime).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;
  const place = next ? next.venue || next.location : null;

  // The timing column says what a reader can act on: a programme that is on or
  // coming leads with its next session. A finished or undated one leaves the
  // column empty rather than repeating the group heading above it — what it has
  // to say is in the row itself ("2 sessions already held this term").
  const timing =
    programme.state === 'running' || programme.state === 'upcoming'
      ? [day, time, place].filter(Boolean).join(' · ')
      : '';

  // Registration belongs to the session, not the programme: this is the same
  // link either way, named for what the reader would go there to do.
  const registrationOpen =
    Boolean(next?.registration_required) &&
    (!next.registration_deadline ||
      new Date(next.registration_deadline) > new Date());

  const audience =
    programme.audience &&
    normaliseAudience(programme.audience) !== PAGE_AUDIENCE
      ? programme.audience
      : null;

  return (
    <li className="grid gap-y-2 border-b border-lmsa-200 py-6 md:grid-cols-[16rem_1fr] md:items-baseline md:gap-x-10">
      <p className="text-balance text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-lmsa-700">
        {timing}
      </p>
      <div>
        <p className="text-[21px] font-semibold leading-7 text-lmsa-900">
          {programme.name}
        </p>
        {programme.summary && (
          <p className="mt-1.5 max-w-[52ch] text-[17px] leading-7 text-gray-800">
            {programme.summary}
          </p>
        )}
        {audience && (
          <p className="mt-2 max-w-[52ch] text-[15px] leading-6 text-gray-700">
            {audience}
          </p>
        )}
        {past > 0 && (
          <p className="mt-2 text-[15px] leading-6 text-gray-700">
            {past} session{past === 1 ? '' : 's'} already held this term
          </p>
        )}
        {next?.slug && (
          <Link
            to={`/events/${next.slug}`}
            className="mt-2 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
          >
            {registrationOpen ? 'Register' : 'Session details'}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </li>
  );
}

function EventRow({ event, past }) {
  const start = formatDate(event.start_datetime);
  const time = event.start_datetime
    ? new Date(event.start_datetime).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <li
      className={`reveal-on-scroll max-w-[64ch] ${past ? 'text-gray-700' : ''}`}
    >
      <p
        className={`text-[19px] font-semibold leading-7 ${past ? 'text-gray-800' : 'text-lmsa-900'}`}
      >
        {event.title}
      </p>
      <p className="mt-1 text-[15px] leading-6 text-gray-700">
        {[start, time].filter(Boolean).join(' · ')}
        {event.location ? (
          <>
            <span aria-hidden="true"> · </span>
            <MapPin
              size={13}
              className="inline align-[-1px]"
              aria-hidden="true"
            />{' '}
            {event.location}
          </>
        ) : null}
      </p>
      {event.description && (
        <p className="mt-2 text-[17px] leading-7 text-gray-800">
          {event.description}
        </p>
      )}
      {!past && event.slug && (
        <Link
          to={`/events/${event.slug}`}
          className="mt-2 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
        >
          Event details
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </li>
  );
}

function DocumentRow({ doc }) {
  const category = doc.category ? doc.category.replace(/_/g, ' ') : null;
  const size = doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : null;
  const added = formatDate(doc.created_at);

  return (
    <li className="reveal-on-scroll grid gap-2 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
      <div>
        <p className="text-[17px] font-semibold leading-7 text-lmsa-900">
          {doc.title}
        </p>
        <p className="mt-1 text-[15px] leading-6 text-gray-700">
          {[category, added, size].filter(Boolean).join(' · ')}
        </p>
      </div>
      {doc.file_url && (
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900"
        >
          <Download size={15} aria-hidden="true" />
          Open
        </a>
      )}
    </li>
  );
}
