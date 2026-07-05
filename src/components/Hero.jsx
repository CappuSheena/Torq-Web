// marketing copy only — no personalised stats, there's no signed-in user yet
function Hero() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-5 shadow-flat">
      <p className="text-sm font-medium text-accent">Built for Glasgow riders</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
        Keep the ride ready and the community close.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        Track your maintenance, service and MOT reminders in one place, always be ride-ready with
        our pre-ride checklist, and take part in the community — sign up to make it yours.
      </p>
    </div>
  );
}

export default Hero;
