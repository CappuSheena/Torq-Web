import { IconX } from '@tabler/icons-react';
import { onboardingSlides } from '../data/homeContent';

function OnboardingOverlay({ step, onNext, onBack, onClose }) {
  const slide = onboardingSlides[step];
  const isLastSlide = step === onboardingSlides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-[20px] border border-white/10 bg-surface p-5 shadow-flat">
        {/* one progress segment per slide */}
        <div className="flex gap-1.5">
          {onboardingSlides.map((_, index) => (
            <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-accent transition-all ${
                  index <= step ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close onboarding"
          className="ml-auto mt-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:text-accent"
        >
          <IconX size={18} />
        </button>

        <h2 className="mt-2 text-xl font-semibold text-text">{slide.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{slide.body}</p>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={step === 0}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-text disabled:opacity-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-page transition hover:bg-accent/90"
          >
            {isLastSlide ? 'Get started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingOverlay;
