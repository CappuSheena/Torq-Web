import { useEffect, useState } from 'react';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import { API_BASE_URL } from '../lib/api';
import eventsPlaceholder from '../assets/eventsPlaceholder.png';

// Small "what's coming up" preview card for the profile page. Read-only —
// no RSVP, no link through to a full events page (that page doesn't exist
// yet), just a preview of the soonest upcoming event.
function FeaturedEvent() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Empty [] at the bottom means this only runs once, right when the card
  // first appears on screen — there's nothing to re-fetch on since this
  // card doesn't depend on any props (unlike RideConditions, which re-runs
  // when authToken changes).
  useEffect(() => {
    const loadFeaturedEvent = async () => {
      setIsLoading(true);
      setError('');

      try {
        // This endpoint is public (no auth header needed) — events aren't
        // tied to a user, everyone sees the same one. See backend/src/routes/events.js.
        const response = await fetch(`${API_BASE_URL}/api/events/featured`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load events right now.');
        }

        // data.event is null when there's nothing upcoming — that's a normal,
        // valid response, not an error, so it just gets stored as-is.
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load events right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedEvent();
  }, []);

  // event_date comes back from MySQL as an ISO datetime string — format it
  // as something a rider can actually read at a glance, e.g. "2 Aug 2026".
  const formattedDate = event
    ? new Date(event.eventDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-surface shadow-flat">
      {/* Image area — real event photo once one exists (image_url), the
          placeholder graphic until then. Same rounded top corners as the
          card itself.
          event?.imageUrl uses optional chaining so this doesn't crash while
          event is still null (loading, or no event) — it just falls back
          to the placeholder in that case too. */}
      <img
        src={event?.imageUrl || eventsPlaceholder}
        alt={event ? event.name : 'Upcoming TORQ event'}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text">
          <IconCalendar size={16} className="text-accent" />
          Featured event
        </div>

        {/* Four possible states, checked in order: still loading, the fetch
            failed, the fetch worked but there's no upcoming event, or we
            actually have one to show. Only one of these ever renders. */}
        {isLoading ? (
          <p className="mt-3 text-sm leading-6 text-muted">Loading events…</p>
        ) : error ? (
          <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
        ) :(
          <div className="mt-3 space-y-2">
            <p className="text-sm font-semibold text-accent">{formattedDate}</p>
            <p className="text-base font-semibold text-text">{event.name}</p>
            {event.location && (
              <p className="flex items-center gap-1.5 text-sm text-muted">
                <IconMapPin size={14} className="shrink-0" />
                {event.location}
              </p>
            )}
            {event.description && <p className="text-sm leading-6 text-muted">{event.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedEvent;
