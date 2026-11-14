import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Loader,
  Mail,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { committeeService } from '@services/committee.service';
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

   The Health Committee's work is not a description of a remit: it is a service
   with a loop — someone reports a problem, the committee inspects it, follows
   it up, and publishes the outcome. That loop is the page's spine, and it wants
   a different order from a committee whose work is mostly academic.

   `mandate: 'hidden'` drops the constitutional register from the page
   altogether: a student who arrives with a blocked drain is not here to read
   the constitution, and the committee asked for the register to come off rather
   than sit under the programme. Any committee without a profile keeps the
   current order and the current wording. */
const COMMITTEE_PROFILES = {
  health: {
    mandate: 'hidden',
    // The page closes on the loop it opened with, not on what a committee is:
    // the association-wide "one of twelve standing committees" pitch belongs on
    // the committees index, not under this committee's work.
    contact: 'compact',
    closing: {
      title: 'The record stays open until the fault is closed.',
      body: 'Every report is checked on site, dated and logged. Where a fix needs the administration, the committee takes it there and keeps the record open until it is done.',
      action: 'Report an issue',
      secondary: { label: 'See this term’s plan', href: '#committee-plan-title' },
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
    reportIssue: {
      subject: {
        value: 'health',
        label: 'A health or sanitation issue',
      },
      title: 'Something broken or unsafe? Say so.',
      intro:
        'A tap that has not worked for a month, a hall that is not cleaned, a dormitory with no water. These reach the committee before anything else on this page does.',
      steps: [
        {
          title: 'You report it',
          text: 'Use the form below or write to the committee. Say what is wrong and where. One report is enough.',
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
  const [news, setNews] = useState([]);
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

        const [m, ev, d, ann, ach] = await Promise.allSettled([
          committeeService.getMembers(data.id),
          committeeService.getEvents(data.id),
          committeeService.getDocuments(data.id),
          committeeService.getAnnouncements(data.id),
          committeeService.getAchievements(data.id),
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
  const profile = COMMITTEE_PROFILES[slug] || {};
  const reportIssue = profile.reportIssue || null;
  const closingNote = profile.closing || null;
  // The contact band is shared with the other committees' pages as they stand;
  // only a profile that asks for it gets the compact treatment.
  const compactContact = profile.contact === 'compact';
  const newsBrief = profile.alsoInNews || null;
  const upcomingBrief = upcomingEvents.slice(0, 3);
  // Where the brief is rendered the calendar has already been shown; keeping it
  // in "On the record" too would list the same events twice on one page.
  const eventsShownAbove = Boolean(newsBrief);
  // The mandate sits above the work by default; on a committee that runs a
  // service the work comes first and the mandate is a footnote.
  const mandateHidden = profile.mandate === 'hidden';

  /* Follows an in-page jump to the contact form. An anchor jump leaves focus
     on <body>, so a keyboard or screen-reader user who takes the page's main
     action starts reading the document again from the top. Focus the heading
     they actually landed on, and pre-fill the subject when the jump came from
     the report block. */
  function goToContact(subject) {
    if (subject) setContactForm(f => ({ ...f, subject }));
    requestAnimationFrame(() =>
      document.getElementById('committee-contact-title')?.focus()
    );
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
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
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
              className="mb-7 inline-flex min-h-6 items-center gap-2 text-[14px] font-medium text-lmsa-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
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

            {committee.description && (
              <p className="mt-6 max-w-[52ch] text-[19px] leading-8 text-lmsa-50">
                {committee.description}
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
            {!status && committee.unavailable && answered && (
              <p className="mt-6 text-[15px] leading-6 text-lmsa-100">
                Recruitment details could not be loaded.
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* When the round is open the action leaves the page, because the
                  application lives on the join page. When it is not, the page's
                  own action is the one on it: writing to the committee. */}
              {status?.open ? (
                <Link
                  to="/get-involved/committees"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  Apply to join
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href="#committee-contact"
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

      {/* ---------- Notices pinned by the committee ---------- */}
      {pinned.length > 0 && (
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

      {/* ---------- What the committee is doing this term ----------
          The plan is the spine of a service committee: what it intends to do,
          where each piece stands, and roughly when. It is drawn from the
          bundled registry because no API field carries a plan yet, and it is
          printed only when there is one — a committee that has not published a
          plan gets no empty section. */}
      {termPlan.length > 0 && (
        <section className="bg-lmsa-50" aria-labelledby="committee-plan-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <div className="reveal-on-scroll max-w-3xl">
              <h2
                id="committee-plan-title"
                className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
              >
                What we are doing this term.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
                Planned from the mandate, with where each piece stands. The
                committee keeps this list up to date as the term moves.
              </p>
            </div>

            {/* The rail is the plan's structure: a time column, the entry, and
                its state. Set on hairlines like the site's other registers so
                it reads as a schedule rather than a set of promises. */}
            <ol className="mt-14 border-t border-lmsa-200 lg:max-w-[68rem]">
              {termPlan.map(item => (
                <li
                  key={`${item.when}-${item.title}`}
                  className="reveal-on-scroll grid gap-y-3 border-b border-lmsa-200 py-6 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-x-10"
                >
                  <p className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-lmsa-600">
                    {item.when}
                  </p>
                  <p className="max-w-[52ch] text-[19px] leading-8 text-lmsa-900">
                    {item.title}
                  </p>
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
          </div>
        </section>
      )}

      {/* ---------- What the committee is for ----------
          Skipped entirely where the mandate is the footnote: the register is
          the committee's remit, and for a service committee it belongs under
          the programme, not in front of it. */}
      {!mandateHidden && (
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
                        className="pt-[0.4rem] text-[13px] font-semibold tabular-nums text-lmsa-600"
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
      {activities.length > 0 && (
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
                  className="reveal-on-scroll border-t border-gray-200 pt-5"
                >
                  <span
                    aria-hidden="true"
                    className="text-[13px] font-semibold tabular-nums text-lmsa-600"
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

      {/* ---------- Report an issue ----------
          The page's one dark interruption, placed where intent is highest: a
          student who has just read what the committee does and has a problem.
          The button preselects the issue subject on the contact form below, so
          the report does not arrive as a general inquiry — it reuses the form
          already on the page rather than adding an endpoint. */}
      {reportIssue && (
        <section className="bg-lmsa-900 text-white" aria-labelledby="committee-report-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16 lg:px-8">
            <div className="reveal-on-scroll">
              <h2
                id="committee-report-title"
                className="max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.0] tracking-[-0.045em]"
              >
                {reportIssue.title}
              </h2>
              <p className="mt-6 max-w-[46ch] text-[19px] leading-8 text-lmsa-100">
                {reportIssue.intro}
              </p>
              <a
                href="#committee-contact"
                onClick={() => goToContact(reportIssue.subject.value)}
                className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Report an issue
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>

            <ol className="reveal-on-scroll border-t border-lmsa-700">
              {reportIssue.steps.map((step, index) => (
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

      {/* ---------- What is happening: calendar + health reporting ----------
          Two clocks on one band. The left column is what is scheduled and can
          still change; the right is what has already been published, carried by
          the association's `health` news category rather than a committee field
          that does not exist. Either column can be empty without collapsing the
          other, and with both empty the section does not render at all. */}
      {newsBrief && (upcomingBrief.length > 0 || news.length > 0) && (
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
                {upcomingBrief.length > 0
                  ? news.length > 0
                    ? 'What the committee has scheduled next, and what its work has been reported as.'
                    : 'What the committee has scheduled next.'
                  : "What the committee's work has been reported as."}
              </p>
            </div>

            <div
              className={`mt-14 grid gap-14 lg:gap-16 ${
                upcomingBrief.length > 0 && news.length > 0
                  ? 'lg:grid-cols-[1fr_1fr]'
                  : 'lg:grid-cols-[minmax(0,32rem)]'
              }`}
            >
              {upcomingBrief.length > 0 && (
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
      {members.length > 0 && (
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

      {/* ---------- Records: notices, events, documents, milestones ---------- */}
      {(notices.length > 0 ||
        (!eventsShownAbove && upcomingEvents.length > 0) ||
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

            {!eventsShownAbove && upcomingEvents.length > 0 && (
              <div className="mt-16">
                <h3 className="text-[20px] font-semibold text-lmsa-900">
                  Coming up
                </h3>
                <ul className="mt-6 space-y-8">
                  {upcomingEvents.map(event => (
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
          <div
            className={`grid lg:items-start lg:gap-x-16 ${
              compactContact
                ? 'gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-y-10'
                : 'gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-y-14'
            }`}
          >
            <div className="reveal-on-scroll lg:col-start-1 lg:row-start-1">
              <h2
                id="committee-contact-title"
                tabIndex={-1}
                className={`${
                  compactContact
                    ? 'max-w-[22ch] text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.12] tracking-[-0.03em] '
                    : 'max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.04em] '
                }font-bold text-lmsa-900 focus:outline-none`}
              >
                Write to the committee.
              </h2>
              <p
                className={`max-w-[46ch] text-gray-800 ${
                  compactContact ? 'mt-3 text-[17px] leading-7' : 'mt-5 text-[19px] leading-8'
                }`}
              >
                A question about the work, a request for a document, or an idea
                for the year ahead.
              </p>

              {!loading && members.length === 0 && (
                <p className="mt-6 max-w-[46ch] text-[17px] leading-7 text-gray-800">
                  {committee.unavailable
                    ? 'This year’s roster could not be loaded.'
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
                  whole height of the form and left a dead gap under the copy. */}
              <div className="mt-8 max-w-[46ch]">
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
                      className="inline-flex min-h-12 items-center rounded-lg bg-lmsa-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
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
              onSubmit={sendContact}
              className={`reveal-on-scroll lg:col-start-2 lg:row-start-1 ${
                compactContact
                  ? 'space-y-4 rounded-lg border border-gray-200 bg-white p-5 sm:p-6'
                  : 'space-y-5'
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
                  <option value="">General inquiry</option>
                  <option value="join">Joining this committee</option>
                  <option value="event">An event</option>
                  <option value="resource">A document or resource</option>
                  {reportIssue && (
                    <option value={reportIssue.subject.value}>
                      {reportIssue.subject.label}
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
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 disabled:opacity-60"
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
                  href="#committee-contact"
                  onClick={() => goToContact(reportIssue?.subject.value)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                >
                  {closingNote.action}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                {closingNote.secondary && (
                  <a
                    href={closingNote.secondary.href}
                    className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-100 underline decoration-2 underline-offset-[6px] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
                  >
                    {closingNote.secondary.label}
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
