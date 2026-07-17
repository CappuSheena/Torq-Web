import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/api';
import EventCard from './EventCard';
import HotspotRow from './HotspotRow';

// Community screen: upcoming events + riding hotspots. Both read-only, responsive to mobile/tablet, All dynamic tho
function CommunityPage() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');

  const [hotspots, setHotspots] = useState([]);
  const [hotspotsLoading, setHotspotsLoading] = useState(true);
  const [hotspotsError, setHotspotsError] = useState('');

  // Really cool thing I learned with React, called mounting. Its react-speak for "this component just got created and put on screen". The use effect here for loadEvents and loadHotspots end with an [] as their last argument. useEffect usually updates the front end when there is a change (like typing a name in an input) but here there is an empty array because there is nothing on the page that can change. It prevents looping (apparently)
  // Supposedly its good for crashing too; the events and hotspots are loaded in different useEffects, meaning if one fails to fetch something from the database, only that row (such as the events widget) crashes, but the other Hotspot tab can load in. It will display an error.



  // Fetch requests for all the data on the events on the table, places it into an array (line 35, setEvents(data.events))
  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      setEventsError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/events/upcoming`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load events right now.');
        }

        setEvents(data.events || []);
      } catch (error) {
        setEventsError(error instanceof Error ? error.message : 'Unable to load events right now.');
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);


  //Same as the above, fetches hotspot data and places it into an array.
  useEffect(() => {
    const loadHotspots = async () => {
      setHotspotsLoading(true);
      setHotspotsError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/hotspots`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load hotspots right now.');
        }

        setHotspots(data.hotspots || []);
      } catch (error) {
        setHotspotsError(error instanceof Error ? error.message : 'Unable to load hotspots right now.');
      } finally {
        setHotspotsLoading(false);
      }
    };

    loadHotspots();
  }, []);


  // Mapping in the data from events.js (which fetches from the database)
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text">Upcoming events</h2>

        {eventsLoading ? (
          <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
            Loading events…
          </p>
        ) : eventsError ? (
          <p className="rounded-[20px] border border-accent/20 bg-accent/10 px-5 py-6 text-center text-sm text-accent">
            {eventsError}
          </p>
          // If there is no events in the list (or all are in the past), it will show this
        ) : events.length === 0 ? (
          <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
            No upcoming events yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

 {/* Same as above, mapping in data from the hotspots.js (which fetches from the database too) */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text">Hotspots</h2>

        {hotspotsLoading ? (
          <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
            Loading hotspots…
          </p>
        ) : hotspotsError ? (
          <p className="rounded-[20px] border border-accent/20 bg-accent/10 px-5 py-6 text-center text-sm text-accent">
            {hotspotsError}
          </p>
            // If there is no hotspots in the list, it will show this
        ) : hotspots.length === 0 ? (
          <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
            No hotspots yet.
          </p>
        ) : (
          <div className="space-y-3">
            {hotspots.map((hotspot) => (
              <HotspotRow key={hotspot.id} hotspot={hotspot} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityPage;
