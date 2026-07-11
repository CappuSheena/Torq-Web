import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import ProfileHero from './ProfileHero';
import ProfileHeader from './ProfileHeader';
import BikeCard from './BikeCard';
import { API_BASE_URL } from '../lib/api';

// Profile screen (Docs/CLAUDE.md "Profile screen"): user header, the
// signed-in rider's bikes, and an entry point for adding another one.
// Bike profile and account settings live entirely here, not on the home
// dashboard.
function ProfilePage({ user, authToken, onLogout }) {
  // "Add another bike" opens an onboarding-style flow that hasn't been
  // designed yet (see Docs/CLAUDE.md) — for now it just reveals a note
  // instead of pretending to start a flow that doesn't exist.
  const [showAddBikeStubNote, setShowAddBikeStubNote] = useState(false);

  const [bikes, setBikes] = useState([]);
  const [bikesLoading, setBikesLoading] = useState(true);
  const [bikesError, setBikesError] = useState('');

  useEffect(() => {
    const loadBikes = async () => {
      setBikesLoading(true);
      setBikesError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/bikes`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load your bikes.');
        }

        setBikes(data.bikes || []);
      } catch (error) {
        setBikesError(error instanceof Error ? error.message : 'Unable to load your bikes.');
      } finally {
        setBikesLoading(false);
      }
    };

    if (authToken) loadBikes();
  }, [authToken]);

  return (
    <div>
      <ProfileHero displayName={user?.display_name} />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ProfileHeader user={user} onLogout={onLogout} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-text">My bikes</h2>

          {bikesLoading ? (
            <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
              Loading your bikes…
            </p>
          ) : bikesError ? (
            <p className="rounded-[20px] border border-accent/20 bg-accent/10 px-5 py-6 text-center text-sm text-accent">
              {bikesError}
            </p>
          ) : bikes.length === 0 ? (
            <p className="rounded-[20px] border border-white/10 bg-surface px-5 py-6 text-center text-sm text-muted">
              No bikes yet — add your first bike to start tracking maintenance, MOT, tax, and insurance dates.
            </p>
          ) : (
            <div className="space-y-4">
              {bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAddBikeStubNote((shown) => !shown)}
            className="w-full rounded-[20px] border border-dashed border-white/20 px-4 py-4 text-sm font-semibold text-muted transition hover:border-accent/50 hover:text-accent"
          >
            <span className="inline-flex items-center gap-2">
              <IconPlus size={16} /> Add another bike
            </span>
          </button>

          {showAddBikeStubNote && (
            <p className="text-center text-xs text-muted">
              The add-bike flow isn't built yet — coming soon.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
