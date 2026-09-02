import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { committeeService } from '@services/committee.service';
import { committeeFallbackList, getCommitteeVisual, isAcceptingApplications } from '@config/committees';
import { EditorialCallout, EditorialSectionHeader, EditorialStat } from '@components/common/EditorialSections';

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

  const totalMembers = useMemo(
    () => committees.reduce((sum, c) => sum + (Number(c.member_count) || 0), 0),
    [committees]
  );
  const recruiting = useMemo(() => committees.filter(isAcceptingApplications).length, [committees]);

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <EditorialSectionHeader
              eyebrow="Learn & lead / Committees"
              title="Where ideas become work that people can feel."
              description="LMSA committees create focused spaces for students to contribute to academic life, welfare, advocacy, service, and community."
            />
            <div className="editorial-prose">
              <p>
                Standing committees help LMSA give focused attention to critical issues while creating opportunities for
                members to contribute meaningfully to the mission.
              </p>
              <div className="editorial-stat-grid mt-8">
                <EditorialStat value={loading ? '—' : String(committees.length)} label="Committees" />
                <EditorialStat value={loading ? '—' : String(totalMembers)} label="Active members" />
                <EditorialStat value={loading ? '—' : String(recruiting)} label="Recruiting now" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          <EditorialSectionHeader
            eyebrow="Find your contribution"
            title="A committee for the question, skill, or cause you want to carry."
            description="Committee members are appointed annually and work throughout the year to develop programs, policies, and initiatives that advance LMSA’s goals."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="committee-card committee-card-skeleton" aria-hidden="true" />
                ))
              : committees.map(committee => {
                  const { icon: Icon, focus } = getCommitteeVisual(committee.slug);
                  const open = isAcceptingApplications(committee);
                  const openings = Number(committee.openings) || 0;

                  return (
                    <Link key={committee.slug} to={`/leadership/committees/${committee.slug}`} className="editorial-link-card">
                      <span className="editorial-link-card-icon" aria-hidden="true">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <div className="editorial-link-card-copy">
                        <h3>{committee.name}</h3>
                        <p>{committee.description || focus}</p>
                        <span className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.14em]">
                          <span className="text-gray-500">{committee.member_count ?? 0} members</span>
                          {open && (
                            <span className="text-lmsa-700">
                              {openings > 0 ? `${openings} openings` : 'Recruiting'}
                            </span>
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <EditorialCallout
            eyebrow="Make your contribution"
            title="You do not need to wait for a title to start doing meaningful work."
            description="Find a committee that fits your interests, then explore how to join the work."
            action={{ label: 'Join a committee', to: '/get-involved/committees' }}
          />
        </div>
      </section>
    </main>
  );
}
