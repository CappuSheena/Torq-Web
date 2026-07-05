import {
  IconBike,
  IconCalendarEvent,
  IconChecklist,
  IconChevronRight,
  IconMapPin,
  IconMenu2,
  IconMoon,
  IconShieldCheck,
  IconSparkles,
  IconTool,
  IconUser,
} from '@tabler/icons-react';

const dashboardCards = [
  {
    title: 'Maintenance status',
    description: 'Service and MOT reminders in one place.',
    icon: IconTool,
    accent: 'accent',
  },
  {
    title: 'Pre-ride checklist',
    description: 'A simple safety routine before every ride.',
    icon: IconChecklist,
    accent: 'secondary',
  },
  {
    title: 'Community',
    description: 'Local rides, guides and events around Glasgow.',
    icon: IconMapPin,
    accent: 'accent',
  },
];

const quickActions = [
  { label: 'Service due', value: 'In 14 days' },
  { label: 'MOT', value: 'Due soon' },
  { label: 'Ride score', value: 'Good' },
];

function App() {
  return (
    <div className="min-h-screen bg-page text-text">
      <header className="border-b border-white/10 bg-page/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <IconBike size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[0.2em] text-text">TORQ</p>
              <p className="text-xs text-muted">Glasgow riders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-muted sm:inline-flex">
              Sign in
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text sm:hidden">
              <IconMenu2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.5fr_0.7fr] lg:px-8 lg:py-8">
        <section className="space-y-6">
          <div className="rounded-[20px] border border-white/10 bg-surface p-5 shadow-flat">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-accent">Today for you</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Keep the ride ready and the community close.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                  Track maintenance, review your checklist, and discover the next Glasgow meetup from one simple home screen.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent sm:flex">
                <IconSparkles size={24} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {quickActions.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-page/60 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  type="button"
                  className="group rounded-[20px] border border-white/10 bg-surface p-4 text-left shadow-flat transition hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-2xl border border-white/10 bg-page/70 p-3 text-text">
                      <Icon size={22} />
                    </div>
                    <div className="rounded-full p-1 text-muted transition group-hover:text-accent">
                      <IconChevronRight size={18} />
                    </div>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-text">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text">Bike snapshot</p>
                <p className="text-sm text-muted">Default bike</p>
              </div>
              <div className="rounded-full bg-secondary/15 p-2 text-secondary">
                <IconShieldCheck size={18} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-page/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <IconBike size={20} />
                </div>
                <div>
                  <p className="font-semibold text-text">Honda CBR600RR</p>
                  <p className="text-sm text-muted">2021 • 8,240 miles</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">Last service</span>
                <span className="font-medium text-text">14 Apr</span>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Upcoming calendar</p>
              <div className="rounded-full bg-accent/10 p-2 text-accent">
                <IconCalendarEvent size={18} />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-page/60 p-3">
                <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                <div>
                  <p className="text-sm font-medium text-text">MOT renewal</p>
                  <p className="text-xs text-muted">Fri • 12 Jul</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-page/60 p-3">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                <div>
                  <p className="text-sm font-medium text-text">Glasgow ride meet</p>
                  <p className="text-xs text-muted">Sun • 14 Jul</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> maintenance</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> meet</span>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
            <div className="flex items-center gap-2 text-sm font-semibold text-text">
              <IconMoon size={18} className="text-accent" />
              Ride conditions
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Good for riding this evening. Light winds and a dry forecast around Glasgow.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-page/60 p-3 text-sm text-text">
              <IconUser size={16} className="text-secondary" />
              Weather preview ready for the full app later.
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
