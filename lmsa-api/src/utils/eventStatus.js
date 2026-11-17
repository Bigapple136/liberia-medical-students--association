// ─── Event status ────────────────────────────────────────────────────────────
// A status is two things at once: a decision and a fact of the calendar.
//
// `draft` (not announced) and `cancelled` (called off) are decisions, and so is
// `completed` — once a person has said an event was held, a clock is in no
// position to disagree. Everything else describes where the event sits in time,
// and a stored value goes stale the moment the date passes: events sit in the
// past still labelled "Upcoming" until somebody remembers to edit them.
//
// So it is derived on read, from the dates, while the column keeps whatever the
// organiser last chose. Nothing writes back. An admin who saves an event from a
// form that displayed a derived `completed` persists that value, which is the
// same answer the clock would give.

const EDITORIAL_STATUSES = new Set(['draft', 'cancelled', 'completed']);

const toTime = (value) => (value ? new Date(value).getTime() : NaN);

export const deriveEventStatus = (event, now = Date.now()) => {
  if (!event) return event;
  if (EDITORIAL_STATUSES.has(event.status)) return event.status;

  const start = toTime(event.start_datetime);

  // An event with no start date says nothing about where it sits in time, so
  // its stored status is the only answer available.
  if (Number.isNaN(start)) return event.status;

  const end = toTime(event.end_datetime);

  // An event with no end runs until it is marked otherwise: it is "ongoing"
  // from its start rather than silently completed the second it begins.
  if (!Number.isNaN(end) && now >= end) return 'completed';
  if (now >= start) return 'ongoing';
  return 'upcoming';
};
