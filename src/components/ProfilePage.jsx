import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import ProfileHero from './ProfileHero';
import ProfileHeader from './ProfileHeader';
import BikeCard from './BikeCard';
import { mockBikes } from '../data/profileContent';

// Profile screen (Docs/CLAUDE.md "Profile screen"): user header, the
// signed-in rider's bikes, and an entry point for adding another one.
// Bike profile and account settings live entirely here, not on the home
// dashboard.
function ProfilePage({ user, onLogout }) {
  // "Add another bike" opens an onboarding-style flow that hasn't been
  // designed yet (see Docs/CLAUDE.md) — for now it just reveals a note
  // instead of pretending to start a flow that doesn't exist.
  const [showAddBikeStubNote, setShowAddBikeStubNote] = useState(false);

  return (
    <div>
      <ProfileHero displayName={user?.display_name} />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ProfileHeader user={user} onLogout={onLogout} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-text">My bikes</h2>

          <div className="space-y-4">
            {mockBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>

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
