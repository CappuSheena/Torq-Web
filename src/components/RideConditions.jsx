import { IconMoon, IconMapPin, IconCloudPin } from '@tabler/icons-react';

// Ride conditions sits on the generic home screen, to show users what they can be expecting to see. 
function RideConditions() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
      <div className="flex items-center gap-2 text-sm font-semibold text-text">
        <IconCloudPin size={16} className="text-secondary text-accent" />Ride conditions
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        
        Find out the current conditions to ride
        
      </p>
    </div>
  );
}

export default RideConditions;
