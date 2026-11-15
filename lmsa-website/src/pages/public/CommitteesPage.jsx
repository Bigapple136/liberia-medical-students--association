import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { committeeService } from '@services/committee.service';
import {
  committeeFallbackList,
  getCommitteeVisual,
  getRecruitmentStatus,
  isAcceptingApplications,
} from '@config/committees';
import { stockPhotos } from '@config/images';

/* Committees page.

   Rebuilt to the roster/register language the leadership pages now use:
   - PublicLayout already renders the header, the /leadership/committees PageHero
     and the footer. The old page rendered its own <main> inside the layout's,
     which put a second main landmark on every visit; this version renders none
     of that.
   - The old body was a grid of twelve identical icon cards, which is the device
     the house style replaces with type. Committees are now a register: name in
     the left column, the work and the recruitment state on the right, with space
     doing the separating instead of borders.
   - The "Active members" figure is gone. It summed `member_count` across
     committees, so a student on two committees counted twice, and it printed
     "0" for every committee whenever the API was unreachable.
   - Recruitment state comes from getRecruitmentStatus, the single answer the
     rest of the site uses. Offline fallback rows carry `unavailable`, so this
     page says nothing about their recruitment instead of claiming "not
     recruiting", and it never prints a member count it does not have.
   - Committees taking applications are listed first: it is the only ordering a
     visitor can act on.

   Copy is the page's own; no committee, deadline or membership figure is
   invented. Pictures are the project's configured stock, credited on the page. */

const APPOINTMENT_POINTS = [
  'Members are appointed annually, not elected.',
  'Chairs are chosen from members already doing the work.',
  'Appointments are made by the Executive Committee.',
];

export default function CommitteesPage() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Same source as /get-involved/committees: GET /api/committees. The two
  // pages used to carry two different hardcoded lists (12 here, 7 there),
  // which is how the numbers drifted apart.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await committeeService.getAll();
        if (active) setCommittees(Array.isArray(data) ? data : []);
      } catch {
        if (active) setCommittees(committeeFallbackList);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Matches the shared .reveal-on-scroll styles in index.css, which already
    // collapse to a static state under prefers-reduced-motion.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const recruiting = useMemo(() => committees.filter(isAcceptingApplications).length, [committees]);
  const offline = useMemo(() => committees.some((c) => c.unavailable), [committees]);

  // Stable sort: open committees first, everything else in the order the
  // association lists them.
  const ordered = useMemo(() => {
    const rank = (committee) => (isAcceptingApplications(committee) ? 0 : 1);
    return committees
      .map((committee, index) => ({ committee, index }))
      .sort((a, b) => rank(a.committee) - rank(b.committee) || a.index - b.index)
      .map(({ committee }) => committee);
  }, [committees]);

  const workPhoto = stockPhotos.sections.connect;
  const meetingPhoto = stockPhotos.sections.lead;
  const servicePhoto = stockPhotos.stories.symposium;

  /** One line about where the committee stands, or null when that is unknown. */
  function statusOf(committee) {
    const status = getRecruitmentStatus(committee);
    const closes = status.deadline ? `Closes ${status.deadline}.` : null;

    if (status.state === 'open') {
      const seats =
        status.remaining === null
          ? 'Accepting applications'
          : `${status.remaining} ${status.remaining === 1 ? 'seat' : 'seats'} open`;
      return { text: [seats, closes].filter(Boolean).join(' · '), open: true };
    }
    if (status.state === 'full') return { text: 'All seats filled.', open: false };
    if (status.state === 'closed') {
      return { text: `Applications closed${status.deadline ? ` on ${status.deadline}` : ''}.`, open: false };
    }
    if (status.state === 'not-recruiting') return { text: 'Not taking applications this round.', open: false };
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* ---------- Why committees exist ---------- */}
      <section className="bg-paper" aria-labelledby="committees-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="committees-title"
              className="max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              A committee for the thing you care about.
            </h2>
            <p className="mt-7 max-w-[54ch] text-[17px] leading-7 text-gray-800">
              Standing committees help LMSA give focused attention to critical issues while creating
              opportunities for members to contribute meaningfully to the mission.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-7 text-gray-800">
              Each one works throughout the year to develop programs, policies, and initiatives that
              advance LMSA’s goals.
            </p>

            {!loading && (
              <p className="mt-8 text-[15px] font-semibold text-lmsa-900">
                {committees.length} committees
                {offline
                  ? ' · recruitment details unavailable'
                  : recruiting > 0
                    ? ` · ${recruiting} accepting applications`
                    : ' · none accepting applications right now'}
              </p>
            )}
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={workPhoto.src}
              alt="Students working together around a table with laptops"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="eager"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {workPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- The register ---------- */}
      <section id="register" className="scroll-mt-24 bg-white" aria-labelledby="register-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="reveal-on-scroll max-w-3xl">
            <h2
              id="register-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-lmsa-900"
            >
              The register.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Every standing committee, what it works on, and where it stands this round. Committees
              taking applications come first.
            </p>
          </div>

          {loading ? (
            <p className="mt-14 flex items-center gap-3 text-[17px] text-gray-700" aria-live="polite">
              <Loader className="animate-spin text-lmsa-700" size={18} aria-hidden="true" />
              Loading the register…
            </p>
          ) : (
            <>
              {offline && (
                <div className="reveal-on-scroll mt-12 bg-paper px-6 py-5">
                  <p className="max-w-[56ch] text-[15px] leading-6 text-lmsa-900">
                    We couldn’t load this round’s recruitment details, so the register lists the
                    standing committees without a status.
                  </p>
                </div>
              )}

              <ul className="mt-14 space-y-12 md:space-y-14">
                {ordered.map((committee, index) => {
                  const { focus } = getCommitteeVisual(committee.slug);
                  const status = statusOf(committee);
                  const members =
                    !committee.unavailable && Number(committee.member_count) > 0
                      ? `${committee.member_count} ${Number(committee.member_count) === 1 ? 'member' : 'members'}`
                      : null;

                  return (
                    <li
                      key={committee.slug}
                      className="reveal-on-scroll"
                      style={{ transitionDelay: `${index % 3 * 40}ms` }}
                    >
                      <div className="grid gap-3 md:grid-cols-[0.38fr_1fr] md:gap-12">
                        <div>
                          {/* The name is the link: twelve identical "what this
                              committee does" links said the same thing on every
                              row, and the row is about one committee. */}
                          <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900">
                            <Link
                              to={`/leadership/committees/${committee.slug}`}
                              className="-my-2 inline-flex min-h-12 items-center gap-2 rounded py-2 transition-colors hover:text-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                            >
                              {committee.name}
                              <ArrowRight size={18} aria-hidden="true" className="text-lmsa-700" />
                            </Link>
                          </h3>
                          {members && (
                            <p className="mt-1.5 text-[15px] leading-6 text-gray-700">{members}</p>
                          )}
                        </div>

                        <div>
                          <p className="max-w-[56ch] text-[17px] leading-7 text-gray-800">
                            {committee.description || focus}
                          </p>

                          {status && (
                            <p
                              className={`mt-3 max-w-[52ch] text-[15px] leading-6 ${
                                status.open ? 'font-semibold text-lmsa-700' : 'text-gray-700'
                              }`}
                            >
                              {status.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* ---------- How appointment works ---------- */}
      <section className="bg-lmsa-900 text-white" aria-labelledby="appointment-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="appointment-title"
              className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            >
              No ballot, no campaign.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-lmsa-50">
              Committee seats are appointed, which makes the work itself the application.
            </p>

            <ul className="mt-10 space-y-4">
              {APPOINTMENT_POINTS.map((point) => (
                <li key={point} className="max-w-[46ch] text-[17px] leading-7 text-white">
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/get-involved/committees"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-50 px-6 text-[15px] font-semibold text-lmsa-900 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                Join a committee
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/about/constitution#elections"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-50 underline decoration-lmsa-400 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lmsa-900"
              >
                How appointments are made
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={meetingPhoto.src}
              alt="A meeting in progress, with notes on a wall and people working at a table"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-lmsa-100">
              Photo: {meetingPhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Closing action ---------- */}
      <section className="bg-white" aria-labelledby="committees-next-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="reveal-on-scroll">
            <h2
              id="committees-next-title"
              className="max-w-[16ch] text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em] text-lmsa-900"
            >
              You do not need a title to start.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[20px] leading-8 text-gray-700">
              Find a committee that fits your interests, then explore how to join the work.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/get-involved/committees"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lmsa-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                Join a committee
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/leadership"
                className="inline-flex min-h-12 items-center text-[15px] font-semibold text-lmsa-700 underline decoration-2 underline-offset-[6px] transition-colors hover:decoration-lmsa-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                See how leadership is elected
              </Link>
            </div>
          </div>

          <figure className="reveal-on-scroll">
            <img
              src={servicePhoto.src}
              alt="A clinician in a white coat with a stethoscope, looking at a phone"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[13px] leading-5 text-gray-600">
              Photo: {servicePhoto.credit}
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
