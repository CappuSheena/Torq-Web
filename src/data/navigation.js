// Shared between the desktop horizontal nav (Header.jsx) and the mobile drawer
// (MobileMenu) so the two never drift out of sync. "Profile" is the only
// entry wired to a real route right now — the rest have no pages built yet.
export const navItems = [
  { key: 'checklist', label: 'Checklist' },
  { key: 'community', label: 'Community' },
  { key: 'dashboard', label: 'Dashboard' },
];
