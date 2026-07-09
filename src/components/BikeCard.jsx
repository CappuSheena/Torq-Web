import { useState } from 'react';
import {
  IconChevronDown,
  IconChevronUp,
  IconGauge,
  IconEngine,
  IconBolt,
  IconRotate2,
  IconWeight,
  IconClockHour4,
} from '@tabler/icons-react';

// Anything due within this many days is flagged as "due soon" — matches the
// rough first-pass rule in Docs/CLAUDE.md, tune later once real usage data exists.
const DUE_SOON_THRESHOLD_DAYS = 30;

// Days between now and a date string. Negative means the date has passed.
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diffMs = new Date(dateStr) - new Date();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Docs/CLAUDE.md: colour only the single soonest key date, so one bad date
// isn't masked by two fine ones (and two "urgent" dates don't compete for
// attention). Overdue dates count too — they're the most urgent case.
function getUrgentKeyDateKey(bike) {
  const candidates = [
    { key: 'mot', date: bike.motDate },
    { key: 'tax', date: bike.taxDate },
    { key: 'insurance', date: bike.insuranceDate },
  ]
    .map((candidate) => ({ ...candidate, days: daysUntil(candidate.date) }))
    .filter((candidate) => candidate.days !== null);

  if (candidates.length === 0) return null;

  const soonest = candidates.reduce((a, b) => (a.days < b.days ? a : b));
  return soonest.days <= DUE_SOON_THRESHOLD_DAYS ? soonest.key : null;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Rough relative-time label for the "specs synced x ago" line — doesn't need
// to be precise, just enough to tell the rider the cache isn't stale.
function timeAgo(isoString) {
  if (!isoString) return 'never';
  const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

// One stacked bike card from the Profile screen's "My bikes" list. Starts
// collapsed and expands in place to reveal key dates, specs and (eventually)
// a per-bike maintenance calendar — keeps the collapsed list scannable when
// a rider has more than one bike.
function BikeCard({ bike }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const urgentKey = getUrgentKeyDateKey(bike);

  const keyDates = [
    { key: 'mot', label: 'MOT', date: bike.motDate },
    { key: 'tax', label: 'Tax', date: bike.taxDate },
    { key: 'insurance', label: 'Insurance', date: bike.insuranceDate },
  ];

  return (
    <div className="rounded-[20px] border border-white/10 bg-surface shadow-flat">
      <button
        type="button"
        onClick={() => setIsExpanded((open) => !open)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          {/* No nickname field — title is always Make - Model - Year, in that order */}
          <p className="font-display text-xl font-semibold text-text">
            {bike.make} - {bike.model} - {bike.year}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <IconGauge size={14} /> {bike.mileage.toLocaleString()} mi · Last service{' '}
            {formatDate(bike.lastServiceDate)}
          </p>
        </div>

        {isExpanded ? (
          <IconChevronUp size={18} className="shrink-0 text-muted" />
        ) : (
          <IconChevronDown size={18} className="shrink-0 text-muted" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-5 border-t border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Key dates</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {keyDates.map((item) => (
                <div
                  key={item.key}
                  className={`rounded-2xl border px-3 py-2 text-center ${
                    item.key === urgentKey
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-white/10 text-muted'
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wide">{item.label}</p>
                  <p className="mt-1 text-sm font-medium">{formatDate(item.date)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Specs</p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-text sm:grid-cols-4">
              <div className="flex items-center gap-1.5">
                <IconEngine size={14} className="text-muted" /> {bike.specs.engine}
              </div>
              <div className="flex items-center gap-1.5">
                <IconBolt size={14} className="text-muted" /> {bike.specs.power}
              </div>
              <div className="flex items-center gap-1.5">
                <IconRotate2 size={14} className="text-muted" /> {bike.specs.torque}
              </div>
              <div className="flex items-center gap-1.5">
                <IconWeight size={14} className="text-muted" /> {bike.specs.kerbWeight}
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <IconClockHour4 size={12} /> Specs synced {timeAgo(bike.lastSyncedAt)}
            </p>
          </div>

          {/* Per-bike maintenance calendar isn't built yet — stubbed for now, same as the add-bike flow */}
          <p className="rounded-2xl border border-dashed border-white/10 px-3 py-2 text-center text-xs text-muted">
            Full maintenance calendar coming soon
          </p>
        </div>
      )}
    </div>
  );
}

export default BikeCard;
