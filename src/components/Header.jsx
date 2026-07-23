import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IconMenu2, IconX } from '@tabler/icons-react';
import logoPng from '../assets/logo.png';
import logoWebp from '../assets/logo.webp';
import MobileMenu from './MobileMenu';
import { navItems } from '../data/navigation';

// this header function assumes the user is not signed in automatically, and will show the sign up and log in buttons. If the user is signed in, it will show their name and a log out button. The header is responsive and will show a mobile menu on smaller screens. The mobile menu is a separate component that is imported here. The header SHOULD also shows a loading state while the session check is running.
function Header({
  onSignUpClick,
  onLogInClick,
  onProfileClick,
  onCommunityClick,
  onGuidesClick,
  onLogoClick,
  isAuthenticated = false,
  user = null,
  onLogout,
  isLoading = false,
}) {
  // The header changes based on whether the user has a valid session.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Used to underline/colour the active nav item
  const location = useLocation();

  // Same rule as the mobile drawer: signed-out taps open sign-up
  const handleNavClick = (key) => {
    if (!isAuthenticated) {
      onSignUpClick();
      return;
    }
    if (key === 'dashboard') {
      onProfileClick?.();
    }
    if (key === 'community') {
      onCommunityClick?.();
    }
    if (key === 'guides') {
      onGuidesClick?.();
    }
  };

  return (
    <header className="border-b border-white/10 bg-page/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Clicking logo takes user back to home */}
        <button type="button" onClick={onLogoClick} className="flex items-center gap-3">
          <div className="flex h-10 w-20 items-center justify-center rounded-full p-1">
            {/* WebP first, PNG fallback for older browsers */}
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <img
                src={logoPng}
                alt="TORQ logo"
                width={130}
                height={130}
                className="h-full w-full object-contain"
                // decoding="async" is used to tell the browser to decode the image asynchronously, which can improve page load
                decoding="async"
              />
            </picture>
          </div>
          <div className="text-left">
            <p className="font-display text-6xl font-bold tracking-[0.2em] text-text">TORQ</p>
            <p className="text-xs text-muted font-family font-medium">Maintainance Made Measy</p>
          </div>
        </button>

        <div className="flex items-center gap-6">
          {/* Tablet/desktop nav, mobile gets the same items via the hamburger drawer instead */}
          <nav className="hidden items-center gap-6 sm:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === `/${item.key}`;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item.key)}
                  className={`text-sm font-medium transition ${
                    isActive ? 'text-accent underline underline-offset-4' : 'text-muted hover:text-text'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {isLoading ? (
            // While the session check is still running, show a loading state.
            <div className="hidden text-sm text-muted sm:block">Checking session…</div>
          ) : isAuthenticated ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-text">{user?.display_name || user?.email || 'Signed in'}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onSignUpClick}
                className="hidden rounded-full bg-accent border border-white/10 px-4 py-2 text-sm text-black transition-all hover:bg-accent/90 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-accent/20 sm:inline-flex"
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={onLogInClick}
                className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent sm:inline-flex"
              >
                Log in
              </button>
            </>
          )}
           {/* The mobile menu button is always shown on smaller screens, and toggles the mobile menu open and closed. It uses 3 lines or an X to show menu state. The button has appropriate aria attributes for accessibility too */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text transition hover:border-accent/50 hover:text-accent sm:hidden"
          >
            {/* Mobile menu buttons, hamburger or X with their REM sizes */}
            {isMobileMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </button>
        </div>
      </div>

{/* // The mobile menu is a separate component that is rendered here. It receives props to control its open state, authentication state, and callbacks for logging out and opening the sign up and log in modals. The mobile menu is hidden on larger screens and only shown when the hamburger button is clicked on smaller screens. */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
        onSignUpClick={onSignUpClick}
        onLogInClick={onLogInClick}
        onProfileClick={onProfileClick}
        onCommunityClick={onCommunityClick}
        onGuidesClick={onGuidesClick}
        isLoading={isLoading}
      />
    </header>
  );
}

export default Header;
