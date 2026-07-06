import { useMemo, useState } from 'react';
import {
  IconCamera,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { onboardingSlides } from '../data/homeContent';

function OnboardingOverlay({ step, onNext, onBack, onClose }) {
  const slide = onboardingSlides[step];
  const isLastSlide = step === onboardingSlides.length - 1;
  const [mode, setMode] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bikeMake, setBikeMake] = useState('Triumph');
  const [bikeModel, setBikeModel] = useState('Street Triple 765 R');
  const [bikeYear, setBikeYear] = useState('2020');
  const [motDue, setMotDue] = useState('');
  const [taxDue, setTaxDue] = useState('');
  const [insuranceDue, setInsuranceDue] = useState('');

  const isStepFour = step === 3;
  const showBackButton = step > 0;

  const currentTitle = step === 0 ? (mode === 'register' ? 'Create your account' : 'Log in to TORQ') : slide.title;
  const currentBody =
    step === 0
      ? mode === 'register'
        ? 'Start with your email and password to unlock TORQ’s maintenance dashboard.'
        : 'Enter your account details to access TORQ.'
      : slide.body;

  const stepLabel = useMemo(() => {
    if (isStepFour) {
      return `Step ${step + 1} of ${onboardingSlides.length} · optional`;
    }
    return `Step ${step + 1} of ${onboardingSlides.length}`;
  }, [isStepFour, step]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);

    if (!file) {
      setAvatarPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleLoginMode = () => {
    setMode((current) => (current === 'register' ? 'login' : 'register'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-surface p-6 shadow-flat">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-accent/90">{stepLabel}</p>
            <h2 className="font-display text-2xl font-semibold text-text">{currentTitle}</h2>
            <p className="text-sm leading-6 text-muted">{currentBody}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close onboarding"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-accent hover:text-accent"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          {onboardingSlides.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 flex-1 rounded-full transition ${index <= step ? 'bg-accent' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <div className="space-y-5">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="name@email.com"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Password</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <span>{mode === 'register' ? 'Already have an account?' : 'Need an account?'}</span>
                <button
                  type="button"
                  onClick={toggleLoginMode}
                  className="text-accent transition hover:text-accent/80"
                >
                  {mode === 'register' ? 'Log in' : 'Register'}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Display name</label>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Gordy"
                />
              </div>

              <div className="space-y-3">
                <span className="block text-sm font-medium text-text">Avatar</span>
                <label className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-white/10 bg-[#0D1520] px-4 py-4 transition hover:border-accent">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-accent transition group-hover:bg-accent/10">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <IconCamera size={24} />
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Make</label>
                <select
                  value={bikeMake}
                  onChange={(event) => setBikeMake(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option>Triumph</option>
                  <option>Honda</option>
                  <option>Yamaha</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Model</label>
                <select
                  value={bikeModel}
                  onChange={(event) => setBikeModel(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option>Street Triple 765 R</option>
                  <option>CB650R</option>
                  <option>MT-07</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Year</label>
                <select
                  value={bikeYear}
                  onChange={(event) => setBikeYear(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">MOT due</label>
                <input
                  value={motDue}
                  onChange={(event) => setMotDue(event.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Tax due</label>
                <input
                  value={taxDue}
                  onChange={(event) => setTaxDue(event.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text">Insurance renews</label>
                <input
                  value={insuranceDue}
                  onChange={(event) => setInsuranceDue(event.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent">
                <IconCheck size={34} />
              </div>
              <h3 className="text-xl font-semibold text-text">You're all set</h3>
              <p className="text-sm leading-6 text-muted">Your bike profile is ready. Welcome to TORQ.</p>
            </div>
          )}
        </div>

        <div className={`mt-6 ${step === 3 ? 'flex gap-3' : 'text-right'}`}>
          {step === 3 ? (
            <>
              <button
                type="button"
                onClick={onNext}
                className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={onNext}
                className="flex-1 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-page transition hover:bg-accent/90"
              >
                Continue
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between">
              {showBackButton ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-text"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-page transition hover:bg-accent/90"
              >
                {isLastSlide ? 'Go to dashboard' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingOverlay;
