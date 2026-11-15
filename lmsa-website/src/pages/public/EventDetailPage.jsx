import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Loader, MapPin, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventService } from '@services/event.service';
import { useAuth } from '@context/AuthContext';

function formatDate(start, end) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  if (!start) return 'Date TBD';
  const startDate = new Date(start).toLocaleDateString('default', options);
  if (end && new Date(end).toDateString() !== new Date(start).toDateString()) {
    return `${startDate} - ${new Date(end).toLocaleDateString('default', options)}`;
  }
  return startDate;
}

function formatTime(start, end) {
  if (!start) return 'Time TBD';
  const startTime = new Date(start).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
  if (!end) return startTime;
  const endTime = new Date(end).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
  return `${startTime} - ${endTime}`;
}

function MetaItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 border border-gray-200 bg-white p-4">
      <Icon size={18} className="mt-0.5 shrink-0 text-lmsa-700" aria-hidden="true" />
      <div>
        <p className="text-[13px] font-semibold text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-lmsa-900">{children}</p>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setEvent(await eventService.getBySlug(slug));
    } catch (err) {
      setEvent(null);
      // A 404 means the event is gone, and no amount of retrying will bring
      // it back. Anything else means the request itself failed, which is
      // worth offering a retry for.
      setFailed(err?.response?.status !== 404);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEvent();
  }, [loadEvent]);

  async function handleRegister() {
    if (!event) return;
    setRegistering(true);
    try {
      await eventService.register(event.id);
      setRegistered(true);
      toast.success('You’re registered! See you there.');
    } catch (err) {
      // Unauthenticated users get a 401 — the api interceptor already
      // redirects to /login. Avoid a confusing raw error toast for that case.
      if (err?.response?.status !== 401) {
        toast.error('Registration didn’t go through. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <main className="editorial-page">
        <div className="flex min-h-[60vh] items-center justify-center" role="status">
          <Loader size={32} className="animate-spin text-lmsa-700" aria-hidden="true" />
          <span className="sr-only">Loading event…</span>
        </div>
      </main>
    );
  }

  if (failed) {
    return (
      <main className="editorial-page">
        <section className="editorial-section">
          <div className="site-container">
            <div className="mx-auto max-w-2xl bg-white p-10 text-center md:p-14">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-4xl">
                We couldn’t load that event.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Something went wrong on our end or with your connection. The event itself may still be on the calendar.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={loadEvent}
                  className="inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 hover:text-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Try again
                </button>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:text-lmsa-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back to all events
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="editorial-page">
        <section className="editorial-section">
          <div className="site-container">
            <div className="mx-auto max-w-2xl bg-white p-10 text-center md:p-14">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-4xl">
                We couldn’t find that event.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600">
                It may have been removed or the link may be incorrect. Everything on the calendar is a click away.
              </p>
              <Link
                to="/events"
                className="mt-8 inline-flex items-center gap-2 border border-lmsa-200 bg-lmsa-50 px-6 py-3 text-sm font-semibold text-lmsa-700 transition-colors hover:bg-lmsa-100 hover:text-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to all events
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const now = new Date();
  const eventEnded = new Date(event.end_datetime || event.start_datetime) < now;
  const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
  const deadlinePassed = deadline ? deadline < now : false;
  const spotsFilled = event.max_attendees ? Math.min(event.registration_count ?? 0, event.max_attendees) : null;
  const eventFull = event.max_attendees ? (event.registration_count ?? 0) >= event.max_attendees : false;

  return (
    <main className="editorial-page">
      <article className="editorial-section">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-lmsa-700 transition-colors hover:text-lmsa-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
              All events
            </Link>

            <header className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-lmsa-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-lmsa-700">
                  {event.event_type}
                </span>
                {eventEnded && (
                  <span className="bg-gray-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
                    Concluded
                  </span>
                )}
              </div>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-lmsa-900 md:text-5xl">
                {event.title}
              </h1>
            </header>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MetaItem icon={Calendar} label="Date">
                <time dateTime={event.start_datetime || undefined}>{formatDate(event.start_datetime, event.end_datetime)}</time>
              </MetaItem>
              <MetaItem icon={Clock} label="Time">
                {formatTime(event.start_datetime, event.end_datetime)}
              </MetaItem>
              <MetaItem icon={MapPin} label="Location">
                {event.location}
              </MetaItem>
            </div>

            {event.image_url && (
              <figure className="mt-8 overflow-hidden border border-gray-200 bg-lmsa-50">
                <img src={event.image_url} alt={event.title} className="w-full object-cover" />
              </figure>
            )}

            <div className="editorial-prose mt-10 border-t border-gray-200 pt-10">
              <p>{event.description}</p>
            </div>

            {event.registration_required && (
              <div className="mt-10 bg-white p-6 md:p-8">
                <p className="text-[13px] font-semibold text-lmsa-700">Registration</p>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">
                  {deadline && (
                    <span className="flex items-center gap-2">
                      <Calendar size={15} className="text-lmsa-700" aria-hidden="true" />
                      Register by{' '}
                      <time dateTime={event.registration_deadline}>
                        {deadline.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                    </span>
                  )}
                  {spotsFilled != null && (
                    <span className="flex items-center gap-2">
                      <Users size={15} className="text-lmsa-700" aria-hidden="true" />
                      {spotsFilled} of {event.max_attendees} spots filled
                    </span>
                  )}
                  {event.fee > 0 && <span>Fee: ${Number(event.fee).toFixed(2)}</span>}
                </div>

                {eventEnded ? (
                  <p className="mt-5 text-sm text-gray-600">This event has ended, so registration is closed.</p>
                ) : deadlinePassed ? (
                  <p className="mt-5 text-sm text-gray-600">The registration deadline has passed.</p>
                ) : eventFull && !registered ? (
                  <p className="mt-5 text-sm text-gray-600">This event is full. Contact the team to join a waiting list.</p>
                ) : !user ? (
                  <div className="mt-5">
                    <p className="text-sm text-gray-600">You’ll need to sign in to your member account to register.</p>
                    <Link
                      to="/login"
                      className="mt-4 inline-flex items-center gap-2 bg-lmsa-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                    >
                      Sign in to register
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={registered || registering}
                    className="mt-5 inline-flex items-center gap-2 bg-lmsa-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-lmsa-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    {registering ? (
                      <Loader size={16} className="animate-spin" aria-hidden="true" />
                    ) : registered ? (
                      <Check size={16} aria-hidden="true" />
                    ) : null}
                    {registered ? 'Registered - see you there' : registering ? 'Registering…' : 'Register for this event'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      <section className="editorial-section pt-0">
        <div className="site-container">
          <section className="editorial-callout editorial-callout-green">
            <div>
              <h2>More moments on the LMSA calendar.</h2>
              <p>Workshops, ceremonies, service activities, and gatherings shaping the student community.</p>
            </div>
            <Link to="/events" className="editorial-callout-action">
              Browse all events
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
