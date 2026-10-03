import { useEffect, useState } from 'react';
import { Loader, RefreshCw, User } from 'lucide-react';
import { executiveService } from '@services/executive.service';

/**
 * Past Presidents — real data only (T36).
 *
 * The previous version of this page presented six fabricated people as real
 * LMSA history. This page now renders exclusively from
 * GET /api/executive/past-presidents (executive_positions where
 * position_name = 'President' and status = 'completed'). Until an admin
 * records real past leadership in the admin panel, this page shows its
 * honest empty state — no invented names, terms, or achievements.
 *
 * The old fabricated "achievement" line is gone entirely: nothing in
 * executive_positions or users genuinely represents a president's term
 * record, and a self-written profile bio would be a poor substitute.
 */
export default function PastPresidentsPage() {
  const [positions, setPositions] = useState(null); // null = fetch failed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadPastPresidents() {
    setLoading(true);
    setError(false);
    try {
      const data = await executiveService.getPastPresidents();
      setPositions(data || []);
    } catch {
      setPositions(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPastPresidents();
  }, []);

  return (
    <main className="editorial-page">
      <section className="editorial-section">
        <div className="site-container">
          <div className="editorial-split">
            <div>
              <p className="section-kicker">Learn &amp; lead / Leadership</p>
              <h1>Past Presidents</h1>
            </div>
            <div className="editorial-prose">
              <p>
                The students who have held the association&apos;s highest office.
                Each completed term below is drawn from LMSA&apos;s official
                leadership records.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-muted">
        <div className="site-container">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader className="animate-spin text-lmsa-600" size={28} aria-label="Loading past presidents" />
            </div>
          ) : error ? (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-lmsa-900">Couldn&apos;t load past presidents</h2>
              <p className="mt-1 text-gray-600">Something went wrong. Please try again in a moment.</p>
              <button
                type="button"
                onClick={loadPastPresidents}
                className="mt-4 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-4 py-2 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : !positions || positions.length === 0 ? (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-lmsa-900">No past presidents on record yet</h2>
              <p className="mx-auto mt-2 max-w-prose text-gray-600">
                Completed presidencies will appear here once they are recorded in
                LMSA&apos;s official leadership records. Historical records are
                being compiled — no names are listed until they can be verified.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {positions.map((position, index) => (
                <article
                  key={position.id || index}
                  className="flex flex-col border border-gray-200 bg-white p-6 sm:flex-row sm:items-start sm:gap-6"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lmsa-50 text-lmsa-700">
                    {position.holder_photo_url ? (
                      <img
                        src={position.holder_photo_url}
                        alt={position.holder_name || 'Past president'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={29} strokeWidth={1.4} aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-4 flex-1 sm:mt-0">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-lmsa-700">
                      President
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-lmsa-900">
                      {position.holder_name || 'Name not on record'}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-lmsa-700">
                      {position.academic_year ? `${position.academic_year} term` : 'Term year not on record'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Complete historical records dating back to 1972 are being compiled.{' '}
            <a href="/contact" className="font-semibold text-lmsa-700 hover:text-lmsa-900">
              Contact LMSA
            </a>{' '}
            to help verify or contribute records.
          </p>
        </div>
      </section>
    </main>
  );
}
