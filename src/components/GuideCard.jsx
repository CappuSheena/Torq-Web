import { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// One card in the Guides list. Same toggle as EventCard/BikeCard's specs, collapsed shows title and summary, "See more" reveals the full content.
function GuideCard({ guide }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
      <p className="text-base font-semibold text-text">{guide.title}</p>
      <p className="mt-1 text-sm text-muted">{guide.summary}</p>

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

        {isExpanded && (
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{guide.content}</p>
        )}
      </div>
    </div>
  );
}

export default GuideCard;
