import heroImg from '../assets/heroImg.png';


// marketing copy only — no personalised stats, there's no signed-in user yet
function Hero({ onSignUpClick, onLogInClick }) {
  return (
    <div className="relative left-1/2 -mx-[50vw] w-screen min-h-[460px] overflow-hidden">
      {/* Full-bleed hero photo */}
      <img
        src={heroImg}
        alt="Triumph Street Triple parked on a wet rooftop at dusk"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-page via-page/85 to-page/10" />

      {/* Top edge fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-page to-transparent" />

      {/* Bottom edge fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-page to-transparent" />

      {/* The glow behind the headline*/}
      <div className="pointer-events-none absolute -top-64 -right-64 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />

      <div className="relative z-10 mx-auto grid h-full max-w-6xl gap-8 p-8 md:grid-cols-[1.35fr_1fr] md:items-center">
        <div>
          <p className="text-sm font-medium text-accent">Built for Glasgow riders</p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl leading-tight">
            Keep the ride ready and the community close.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
            Track maintenance, service and MOT reminders in one place, stay ride-ready with the pre-ride checklist, and find your local riding community.
          </p>

          {/* CTA Buttons - LINK TO LOG IN AND SIGN UP*/}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-black transition-all hover:bg-accent/90 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-accent/20"
              onClick={onSignUpClick}
            >
              Get started for free
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-text transition-all hover:border-white/40 hover:bg-white/5 active:scale-95"
              onClick={onLogInClick}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;