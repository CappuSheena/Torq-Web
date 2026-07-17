import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import ProfileHero from './ProfileHero';
import ProfileHeader from './ProfileHeader';
import RideConditions from './RideConditions';
import FeaturedEvent from './FeaturedEvent';
import BikeCard from './BikeCard';
import { API_BASE_URL } from '../lib/api';

function ProfilePage({ user, authToken, onLogout }) {
  // Add-bike flow isn't built yet, so this just toggles a "coming soon" note.
  const [showAddBikeStubNote, setShowAddBikeStubNote] = useState(false);

  const [bikes, setBikes] = useState([]);
  const [bikesLoading, setBikesLoading] = useState(true);
  const [bikesError, setBikesError] = useState('');

  // Fetches this user's bikes (created earlier in OnboardingOverlay.jsx) so nike card has something to render

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

{/* //Something I want to add in future! Reopens the add bike menu. Not needed for graded unit. */}
          <button
            type="button"
            onClick={() => setShowAddBikeStubNote((shown) => !shown)}
            className="w-full rounded-[20px] border border-dashed border-white/20 px-4 py-4 text-sm font-semibold text-muted transition hover:border-accent/50 hover:text-accent"
          >
            <span className="inline-flex items-center gap-2">
              <IconPlus size={16} /> Add another bike
            </span>
          </button>
{/* But because it isnt needed I just added this little stub that says coming soon. */}
          {showAddBikeStubNote && (
            <p className="text-center text-xs text-muted">
              The add-bike flow isn't built yet — coming soon.
            </p>
          )}
        </section>
        {/* Single column on mobile, 50/50 from tablet size up up. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RideConditions authToken={authToken} />
          <FeaturedEvent />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
