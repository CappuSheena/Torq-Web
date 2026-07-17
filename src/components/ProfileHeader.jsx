import { IconUserCircle } from '@tabler/icons-react';

// User header for the Profile screen: display name, email, and the edit/logout actions (Docs/CLAUDE.md "Profile screen" spec).
function ProfileHeader({ user, onLogout }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[20px] border border-white/10 bg-surface p-6 text-center shadow-flat sm:flex-row sm:text-left">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-page text-muted">
        <IconUserCircle size={48} />
      </div>

      <div className="flex-1">
        <h2 className="font-display text-2xl font-semibold text-text">{user?.display_name || 'Rider'}</h2>
        <p className="text-sm text-muted">{user?.email}</p>
      </div>

      <div className="flex gap-3">
        {/* PLACEHOLDER - NEED TO CREATE EDIT MODAL */}
        <button
          type="button"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-text transition hover:border-accent/50 hover:text-accent"
        >
          Edit my profile
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
