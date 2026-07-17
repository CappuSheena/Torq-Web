import { useEffect, useState } from 'react';
import { IconCloudPin } from '@tabler/icons-react';
import { API_BASE_URL } from '../lib/api';

// Dashboard weather card
function RideConditions({ authToken }) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWeather = async () => {
      setIsLoading(true);
      setError('');

      try {
        // No ?postcode= — the backend uses whatever this signed-in user saved.
        const response = await fetch(`${API_BASE_URL}/api/weather`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
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

{/* Generic loading state thingy. Then an error message if needed, otherwise round up the degrees and wind speed */}
      {isLoading ? (
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
