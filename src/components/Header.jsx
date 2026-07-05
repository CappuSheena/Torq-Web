import { IconMenu2 } from '@tabler/icons-react';
import logoPng from '../assets/logo.png';
import logoWebp from '../assets/logo.webp';

function Header({ onSignInClick }) {
  return (
    <header className="border-b border-white/10 bg-page/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
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
                decoding="async"
              />
            </picture>
          </div>
          <div>
            <p className="font-display text-6xl font-bold tracking-[0.2em] text-text">TORQ</p>
            <p className="text-xs text-muted font-family font-medium">Maintainance Made Measy</p>
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
