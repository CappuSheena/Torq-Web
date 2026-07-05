import { IconMoon, IconUser } from '@tabler/icons-react';

// Ride conditions sits on the generic home screen, to show users what they can be expecting to see. 
function RideConditions() {
  return (
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
  );
}

export default RideConditions;
