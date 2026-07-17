// Shared between the desktop horizontal nav (Header.jsx) and the mobile drawer (MobileMenu) so the two never drift out of sync. Dashboard and Community are wired to real routes, checklist still has no page of its own yet.
export const navItems = [
  { key: 'checklist', label: 'Checklist' },
  { key: 'community', label: 'Community' },
  { key: 'dashboard', label: 'Dashboard' },
];
