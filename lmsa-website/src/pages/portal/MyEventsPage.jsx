import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import { dashboardService } from '@services/dashboard.service';
import { eventService } from '@services/event.service';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Confirmation dialog for cancelling an event registration (spec §4.3).
 *
 * Names the consequence before the destructive action ("your spot is
 * released") and the recovery path ("re-register while registration is
 * open"). Esc, backdrop-free like NominationDialog but with a real scrim
 * (bg-black/40 — NominationDialog's `bg-lmsa-950/60` resolves to no class
 * in the Tailwind scale and renders transparent).
 */
function CancelConfirmDialog({ event, busy, error, onConfirm, onClose }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => confirmRef.current?.focus(), 60);

    function handleKeyDown(keyEvent) {
      if (keyEvent.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-registration-title"
        aria-describedby="cancel-registration-description"
        className="w-full max-w-md bg-white p-6 sm:p-8"
      >
        <h2 id="cancel-registration-title" className="text-xl font-bold text-lmsa-900">
          Cancel registration?
        </h2>
        <p id="cancel-registration-description" className="mt-3 text-sm leading-6 text-gray-700">
          Your spot in <span className="font-semibold">{event.title}</span> will be
          released. You can re-register from the event page while registration is open.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="primary" onClick={onClose} disabled={busy}>
            Keep registration
          </Button>
          {/* Native button (not <Button>) so the ref can receive initial focus —
              Button.jsx does not forward refs. Classes match the danger variant. */}
          <button
            type="button"
            ref={confirmRef}
            disabled={busy}
            onClick={onConfirm}
            className="btn btn-danger inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy && <Spinner size="sm" />}
            {busy ? 'Cancelling…' : 'Cancel registration'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * My Events (spec §4.3): registered upcoming events with cancellation.
 * Registrations come from GET /dashboard/my-events (max 5); cancelling
 * calls DELETE /events/:id/register — a hard delete, so the confirm names
 * the consequence and the list reloads from server truth afterwards.
 */
export default function MyEventsPage() {
  const [events, setEvents] = useState(null); // null = unavailable
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null); // event awaiting confirmation
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const cancelTriggerRef = useRef(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getMyUpcomingEvents();
      setEvents(data || []);
    } catch {
      setEvents(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const closeCancelDialog = useCallback(() => {
    setCancelTarget(null);
    setCancelError(null);
    // Return focus to the row's cancel trigger (§4.7, matching the shell
    // drawer). If the row was removed (successful cancel), the node is
    // detached and focus() is a harmless no-op.
    requestAnimationFrame(() => cancelTriggerRef.current?.focus?.());
  }, []);

  const openCancelDialog = useCallback((event) => {
    cancelTriggerRef.current = document.activeElement;
    setCancelError(null);
    setCancelTarget(event);
  }, []);

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelTarget || cancelling) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await eventService.unregister(cancelTarget.id);
      setCancelTarget(null);
      toast.success('Registration cancelled — your spot is released.');
      await loadEvents(); // re-sync from the server; the list is small
    } catch (error) {
      // Dialog stays open with the event untouched; the member can retry
      // or keep the registration — nothing is silently lost.
      setCancelError(
        error?.response?.data?.message || 'Could not cancel your registration. Please try again.'
      );
    } finally {
      setCancelling(false);
    }
  }, [cancelTarget, cancelling, loadEvents]);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Events</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Events you are registered for. You can cancel a registration here.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4" aria-hidden="true">
          <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
        </div>
      ) : events === null ? (
        <Card>
          <p className="py-6 text-center text-sm text-gray-600">
            Your events could not be loaded.{' '}
            <button
              type="button"
              onClick={loadEvents}
              className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
            >
              Try again
            </button>
          </p>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <Calendar size={32} className="mx-auto text-gray-400 mb-3" aria-hidden="true" />
            <p className="text-gray-600 mb-1">No upcoming events registered</p>
            <p className="text-sm text-gray-500">
              Browse{' '}
              <Link to="/events" className="text-lmsa-600 hover:underline">
                upcoming events
              </Link>{' '}
              to register.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-lmsa-600 flex-shrink-0 mt-1" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg">{event.title}</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="flex-shrink-0" aria-hidden="true" />
                      {formatDate(event.start_datetime)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-stretch sm:items-end gap-1 shrink-0">
                  {event.slug && (
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex min-h-[44px] items-center justify-end gap-1 text-sm font-medium text-lmsa-600 hover:text-lmsa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2"
                    >
                      Event page <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => openCancelDialog(event)}
                    className="inline-flex min-h-[44px] items-center justify-end text-sm font-medium text-red-700 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  >
                    Cancel registration
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {cancelTarget && (
        <CancelConfirmDialog
          event={cancelTarget}
          busy={cancelling}
          error={cancelError}
          onConfirm={handleConfirmCancel}
          onClose={closeCancelDialog}
        />
      )}
    </div>
  );
}
