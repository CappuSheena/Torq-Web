import { useEffect, useState } from 'react';
import { IconCloudPin } from '@tabler/icons-react';
import { API_BASE_URL } from '../lib/api';

// Small dashboard weather card. Calls our OWN backend's GET /api/weather —
// never postcodes.io or Open-Meteo directly from the browser (same "always
// go through our own backend" pattern the motorcycle spec search uses).
// See backend/src/routes/weather.js for the actual postcode -> coordinates
// -> weather chain; this component just shows whatever it sends back.
//
// No ride-suitability score yet (Good/caution/poor) — that's a separate,
// later task. This is just: show the current temperature and conditions.
function RideConditions({ authToken }) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWeather = async () => {
      setIsLoading(true);
      setError('');

      try {
        // No ?postcode= here on purpose — leaving it off tells the backend
        // "use whatever postcode this signed-in user already saved" (see
        // weather.js). The Authorization header is how it knows who "this
        // signed-in user" is.
        const response = await fetch(`${API_BASE_URL}/api/weather`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          // e.g. "Add a postcode to your profile..." or "...valid postcode"
          // — whatever the backend decided went wrong, straight to the rider.
          throw new Error(data.error || 'Unable to load the weather right now.');
        }

        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load the weather right now.');
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken) loadWeather();
  }, [authToken]);

  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
      <div className="flex items-center gap-2 text-sm font-semibold text-text">
        <IconCloudPin size={16} className="text-accent" />
        Ride conditions
      </div>

      {isLoading ? (
        // Loading and error states both matter here (CLAUDE.md NFR10) — never
        // just leave this card blank while the fetch is in flight or failed.
        <p className="mt-3 text-sm leading-6 text-muted">Checking the weather…</p>
      ) : error ? (
        <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
      ) : (
        <div className="mt-3">
          <p className="text-2xl font-semibold text-text">{Math.round(weather.temperature)}°C</p>
          <p className="text-sm text-muted">
            {weather.conditionText} · wind {Math.round(weather.windSpeed)} km/h
          </p>
        </div>
      )}
    </div>
  );
}

export default RideConditions;
