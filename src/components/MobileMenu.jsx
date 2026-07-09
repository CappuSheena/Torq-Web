import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { navItems } from '../data/navigation';

function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated = false,
  user = null,
  onLogout,
  onSignUpClick,
  onLogInClick,
  onProfileClick,
  isLoading = false,
}) {
  useEffect(() => {
    // Lock background scroll while the drawer is open.
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  // Close the drawer when the Escape key is pressed. Accessibillity
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle navigation item clicks. If the user is not authenticated, clicking any nav item opens
  // the sign-up overlay instead. If authenticated, "dashboard" is wired to the real Profile page
  // (only its nav label reads "Dashboard"); everything else still has no page built, so it just
  // closes the menu. REMOVE THIS WHEN NEW ROUTES ARE ADDED
  const handleNavClick = (key) => {
    if (!isAuthenticated) {
      onSignUpClick();
      return;
    }
    if (key === 'dashboard') {
      onProfileClick?.();
    }
    onClose();
  };

  // Handle sign-up, log-in, and log-out button clicks. These will call the appropriate callbacks passed in as props and then close the menu.
  const handleSignUp = () => {
    onSignUpClick();
    onClose();
  };

  const handleLogIn = () => {
    onLogInClick();
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="sm:hidden">
      {/* click outside the drawer to close */}
      <div
        aria-hidden="true"
        // changing the opacity and adding a little transition to make it look spicy.
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-page shadow-flat transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text transition hover:border-accent/50 hover:text-accent"
          >
            <IconX size={18} />
          </button>
        </div>

{/* // PLACEHOLDER FOR NAV BUTTONS. These are the same as the header nav buttons, but in a vertical layout for mobile. They will eventually link to the appropriate pages when those routes are added. For now, they just close the menu or open the sign-up overlay if the user is not authenticated. */}
        <nav className="flex flex-col divide-y divide-white/10 border-y border-white/10 px-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item.key)}
              className="py-4 text-left text-sm text-text transition hover:text-accent"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 py-6">
          {isLoading ? (
            <p className="text-sm text-muted">Checking session…</p>
          ) : isAuthenticated ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-text">{user?.display_name || user?.email || 'Signed in'}</p>
                <p className="text-xs text-muted">Signed in</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSignUp}
                className="w-full rounded-full bg-accent border border-white/10 px-4 py-2 text-sm text-black transition-all hover:bg-accent/90 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-accent/20"
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={handleLogIn}
                className="w-full rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
