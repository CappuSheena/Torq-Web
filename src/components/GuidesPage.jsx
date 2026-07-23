import { useState } from 'react';
import { guides } from '../data/guides';
import GuideCard from './GuideCard';

// Guides screen: static content, no fetch, no loading/error state needed
// since there's no network call, unlike Community's events/hotspots.
function GuidesPage() {
  const [searchText, setSearchText] = useState('');

  // Case-insensitive substring match against title or summary. Small local
  // array, so a plain filter on every keystroke is fine, no debounce needed.
  const query = searchText.trim().toLowerCase();
  const filteredGuides = query
    ? guides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(query) || guide.summary.toLowerCase().includes(query)
      )
    : guides;

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h2 className="font-display text-2xl font-semibold text-text">Guides</h2>

      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        type="text"
        placeholder="Search guides"
        className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />

      {filteredGuides.length === 0 ? (
        <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
          No guides match your search.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GuidesPage;
