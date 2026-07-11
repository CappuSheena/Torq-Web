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

// Anything due within this many days is flagged as "due soon" 
const DUE_SOON_THRESHOLD_DAYS = 30;

// The four headline specs shown collapsed, mapped to the actual API Ninjas
// field names cached in bikes.spec_json (there's no "kerb weight" field —
// total_weight is the closest match). Everything else in spec_json shows
// up under "See more" instead of being hardcoded here.
const HEADLINE_SPEC_KEYS = ['engine', 'power', 'torque', 'total_weight'];
// Excluded from "See more" too — make/model/year are already the card title.
const SEE_MORE_EXCLUDED_KEYS = [...HEADLINE_SPEC_KEYS, 'make', 'model', 'year'];

function getHeadlineSpecValue(spec, key) {
  return spec?.[key] || 'Not available';
}

// front_wheel_travel -> "Front wheel travel". Change how the text/input looks on the frontend.
function formatSpecLabel(key) {
  const label = key.split('_').join(' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Days between now and a date string. Negative means the date has passed.
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diffMs = new Date(dateStr) - new Date();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Colour only the single soonest key date in Orange to highlight it
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

// Rough relative-time label for the "specs synced x ago" line. It  doesn't need
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
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const urgentKey = getUrgentKeyDateKey(bike);

  const keyDates = [
    { key: 'mot', label: 'MOT', date: bike.motDate },
    { key: 'tax', label: 'Tax', date: bike.taxDate },
    { key: 'insurance', label: 'Insurance', date: bike.insuranceDate },
  ];

  const remainingSpecEntries = Object.entries(bike.spec || {}).filter(
    ([key, value]) => !SEE_MORE_EXCLUDED_KEYS.includes(key) && value !== null && value !== ''
  );

  return (
    <div className="rounded-[20px] border border-white/10 bg-surface shadow-flat">
      <button
        type="button"
        onClick={() => setIsExpanded((open) => !open)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          <p className="font-display text-xl font-semibold text-text">
            {bike.make} - {bike.model} - {bike.year}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <IconGauge size={14} />{' '}
            {typeof bike.mileage === 'number' ? `${bike.mileage.toLocaleString()} mi` : 'Mileage not logged'} · Last
            service {formatDate(bike.lastServiceDate)}
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
                <IconEngine size={14} className="text-muted" /> {getHeadlineSpecValue(bike.spec, 'engine')}
              </div>
              <div className="flex items-center gap-1.5">
                <IconBolt size={14} className="text-muted" /> {getHeadlineSpecValue(bike.spec, 'power')}
              </div>
              <div className="flex items-center gap-1.5">
                <IconRotate2 size={14} className="text-muted" /> {getHeadlineSpecValue(bike.spec, 'torque')}
              </div>
              <div className="flex items-center gap-1.5">
                <IconWeight size={14} className="text-muted" /> {getHeadlineSpecValue(bike.spec, 'total_weight')}
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <IconClockHour4 size={12} /> Specs synced {timeAgo(bike.lastSyncedAt)}
            </p>

            {remainingSpecEntries.length > 0 && (
              <div className="mt-3">
                {/* pressing this button opens a spoiler with ALL the specs that the API returns. */}
                <p className="py-1 text-xs">Click below to see all the specs of your bike!</p>
                <button
                  type="button"
                  onClick={() => setShowAllSpecs((open) => !open)}
                  aria-expanded={showAllSpecs}
                  className="flex items-center gap-1 text-xs font-semibold text-accent transition hover:text-accent/80"
                >
                  See more
                  {showAllSpecs ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                </button>

                {showAllSpecs && (
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-text sm:grid-cols-3">
                    {remainingSpecEntries.map(([key, value]) => (
                      <div key={key}>
                        <p className="text-[11px] uppercase tracking-wide text-muted">{formatSpecLabel(key)}</p>
                        <p className="mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BikeCard;
