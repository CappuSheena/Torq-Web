import { IconDeviceMobile } from '@tabler/icons-react';

// Phone mockup placeholder — swap for the real screen design once it's added and designed.
function PhonePreview() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-5 shadow-flat">
      <h2 className="font-display text-lg font-medium text-text">See it on your phone</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Your profile, bikes and reminders travel with you. A full preview of the mobile screens is
        coming soon.
      </p>
      <div className="mt-5 flex justify-center">
        <div className="flex h-72 w-40 flex-col items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-page/70 text-muted">
          <IconDeviceMobile size={32} />
          <p className="text-xs">Preview coming soon</p>
        </div>
      </div>
    </div>
  );
}

export default PhonePreview;
