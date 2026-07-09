import { IconDeviceMobile } from '@tabler/icons-react';

// Phone mockup placeholder — swap for the real screen design once it's added and designed.
function PhonePreview() {
  return (
    <div className="rounded-[20px] border border-accent/50 bg-surface p-5 shadow-flat">
      <div className="w-fit rounded-2xl border border-accent/30 bg-accent/10 p-3 text-accent">
        <IconDeviceMobile size={28} />
      </div>
      <h2 className="font-display mt-4 text-lg font-medium text-text">See it on your phone</h2>
      <p className="mt-2 max-w-md text-base leading-6 text-muted">
        Your profile, bikes and reminders travel with you. A full preview of the mobile screens is
        coming soon.
      </p>
      <div className="mt-5 flex justify-center">
        <div className="flex h-72 w-40 flex-col items-center justify-center gap-3 rounded-[28px] border border-accent/30 bg-page/70 text-accent/80">
          <IconDeviceMobile size={32} />
          <p className="text-xs text-white/80">Preview coming soon</p>
        </div>
      </div>
    </div>
  );
}

export default PhonePreview;
