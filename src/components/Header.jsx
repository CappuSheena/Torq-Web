import { IconHelmet, IconMenu2 } from '@tabler/icons-react';

function Header({ onSignInClick }) {
  return (
    <header className="border-b border-white/10 bg-page/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <IconHelmet size={20} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.2em] text-text">TORQ</p>
            <p className="text-xs text-muted">Glasgow riders</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* no real auth yet — opens the onboarding stub */}
          <button
            type="button"
            onClick={onSignInClick}
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent sm:inline-flex"
          >
            Sign in
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text transition hover:border-accent/50 hover:text-accent sm:hidden"
          >
            <IconMenu2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
