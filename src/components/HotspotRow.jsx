import { useState } from 'react';
import { IconMapPin, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// One row in the Hotspots list. Same collapsed-button/expand-below shape as and EventCard and BikeCard, uses a thumbnail image
function HotspotRow({ hotspot }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-[20px] border border-white/10 bg-surface shadow-flat">
      <button
        type="button"
        onClick={() => setIsExpanded((open) => !open)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        {/* No image_url = no thumbnail slot at all, row just stays text-only. */}
        {hotspot.imageUrl && (
          <img src={hotspot.imageUrl} alt={hotspot.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        )}

        <div className="flex-1">
          <p className="font-semibold text-text">{hotspot.name}</p>
          {hotspot.location && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <IconMapPin size={14} className="shrink-0" />
              {hotspot.location}
            </p>
          )}
        </div>

        {isExpanded ? (
          <IconChevronUp size={18} className="shrink-0 text-muted" />
        ) : (
          <IconChevronDown size={18} className="shrink-0 text-muted" />
        )}
      </button>

      {isExpanded && hotspot.description && (
        <div className="border-t border-white/10 p-4">
          <p className="text-sm leading-6 text-muted">{hotspot.description}</p>
        </div>
      )}
    </div>
  );
}

export default HotspotRow;
