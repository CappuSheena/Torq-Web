import { useEffect, useState } from 'react';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import { API_BASE_URL } from '../lib/api';
import eventsPlaceholder from '../assets/eventsPlaceholder.png';

// Small "what's coming up" preview card for the profile page
function FeaturedEvent() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Runs once on mount, no auth header needed, events aren't user-specific.
  useEffect(() => {
    const loadFeaturedEvent = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/events/featured`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load events right now.');
        }

        // null is a valid response (no upcoming event), not an error.
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load events right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedEvent();
  }, []);

  // e.g. "2 Aug 2026"
  const formattedDate = event
    ? new Date(event.eventDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-surface shadow-flat">
      {/* Real event photo once one exists, placeholder until then. */}
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

        {isLoading ? (
          <p className="mt-3 text-sm leading-6 text-muted">Loading events…</p>
        ) : error ? (
          <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
        ) : !event ? (
          <p className="mt-3 text-sm leading-6 text-muted">No upcoming events yet.</p>
        ) : (
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
