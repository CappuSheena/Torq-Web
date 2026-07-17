// This card populates with the data fetched into CommunityPage.jsx. This just populates the card componnet (such as styling and data).

import { useState } from 'react';
import { IconCalendar, IconMapPin, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// e.g. "2 Aug 2026"
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// One card in the Upcoming events grid. Collapsed shows date/name/location, "See more" reveals the full description which is the same toggle as BikeCard's specs and EventCard
function EventCard({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-surface shadow-flat">
      {/* No image_url = no img tag at all, not even a blank box. React renders nothing*/}
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.name} className="h-40 w-full object-cover" />
      )}

      <div className="p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-accent">
          <IconCalendar size={14} />
          {formatDate(event.eventDate)}
        </p>
        <p className="mt-1 text-base font-semibold text-text">{event.name}</p>
        {event.location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <IconMapPin size={14} className="shrink-0" />
            {event.location}
          </p>
        )}

        {event.description && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsExpanded((open) => !open)}
              aria-expanded={isExpanded}
              className="flex items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent/80"
            >
              {isExpanded ? 'See less' : 'See more'}
              {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </button>

            {isExpanded && <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
