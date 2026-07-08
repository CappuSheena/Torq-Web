// I started with trying to add the abillity to add your own 'avatar' to your profile but this is OOS. There is some code here relating to it (like the cmaera icon and possibly routing the img url in the db) that meeds to be removed.

import { useState } from 'react';
import {
  IconCamera,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

// importing the onboarding slides from homeContent.js. Simillar to the feature cards, it is dynamic and will update with however many cards are in the array.
import { onboardingSlides } from '../data/homeContent';

function OnboardingOverlay({
  // Props for managing the onboarding flow
  step,
  initialMode = 'register',
  onNext,
  onBack,
  onClose,
  onAuthSubmit,
  authError,
  isSubmitting,
}) {
  // Determine the current slide and whether it's the last one
  const slide = onboardingSlides[step];
  const isLastSlide = step === onboardingSlides.length - 1;
  // State for managing form inputs and mode (register/login). It starts with set mode to 'register' by default, but can be changed to 'login' if the user clicks the toggle, and will change the flow as req
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  //Legacy code for avatar upload, leaving it for now because it works without it
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  // this will be populated with ninja API
  const [bikeMake, setBikeMake] = useState('Triumph');
  const [bikeModel, setBikeModel] = useState('Street Triple 765 R');
  const [bikeYear, setBikeYear] = useState('2020');
  // option user input
  const [motDue, setMotDue] = useState('');
  const [taxDue, setTaxDue] = useState('');
  const [insuranceDue, setInsuranceDue] = useState('');

  // Hides the back button from the first step
  const showBackButton = step > 0;
//The title and body text for the current step. 
  const currentTitle = step === 0 ? (mode === 'register' ? 'Create your account' : 'Log in to TORQ') : slide.title;
  const currentBody =
    step === 0
      ? mode === 'register'
        ? 'Start with your email and password to unlock TORQ.'
        : 'Enter your account details to access TORQ.'
      : slide.body;

      // legacy code
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

  // Toggles between register and login modes, updating the form fields and button labels accordingly.
  const toggleLoginMode = () => {
    setMode((current) => (current === 'register' ? 'login' : 'register'));
  };

  // usual prevent default, then if the step ISNT 0, it will just move onto the next step. If it is 0, it calls onAuthSubmit with the mode, email, password, and displayName. This is where the actual registration or login happens.
  const handlePrimaryAction = async (event) => {
    event.preventDefault();

    if (step !== 0) {
      onNext();
      return;
    }

    await onAuthSubmit({
      mode,
      email: email.trim(),
      password,
      displayName: displayName.trim(),
    });
  };

  // The main orange button label changes based on current step AND mode. If the user is on the first step, it will say "Create account" or "Log in" depending on the mode. If the user is on the last step, it will say "Go to dashboard". Otherwise, it will say "Continue".
  const primaryButtonLabel =
    step === 0
      ? mode === 'register'
        ? isSubmitting
          ? 'Creating account…'
          : 'Create account'
        : isSubmitting
          ? 'Logging in…'
          : 'Log in'
      : isLastSlide
        ? 'Go to dashboard'
        : 'Continue';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-surface p-6 shadow-flat">
        <div className="mb-4 flex gap-2">
          {/* // The progress bar at the top of the overlay. They show how many steps are in the onboarding process and which step the user is currently on. The current step is highlighted with the accent orange, otherwise its grey. It used map to LOOP through the onboardingSlides array and create a span for each step. This keeps it dynamic! The span is given the orange colour if the index is less than or equal to the current step, otherwise it is given a class of white (with low opacity) */}
          {onboardingSlides.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 flex-1 rounded-full transition ${index <= step ? 'bg-accent' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
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

        <form className="space-y-5" onSubmit={handlePrimaryAction}>
          {step === 0 && (
            <div className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Display name</label>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Gordy"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="name@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Password</label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="••••••••"
                />
              </div>

{/* // If left empty, returns Fetch request error. Otherwise it shows a dedicated auth er. It comes from the parent component 'onAuthSubmit' in App.JSX , which is called when the user submits the form. It will return an error if the email or password is invalid, or if the user already exists (for registration).  */}
              {authError && (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
                  {authError}
                </div>
              )}

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

{/* //PLACEHOLDER BIKE INFO. Will be updated with NinjaAPI to pull bike info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
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

{/* // Not palceholder because the user has the option to manually add their MOT etc. NEED TO ADD THE MATH FUNCTIONS TO CALCULATE DATES */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">MOT due</label>
                <input
                  value={motDue}
                  onChange={(event) => setMotDue(event.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Tax due</label>
                <input
                  value={taxDue}
                  onChange={(event) => setTaxDue(event.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
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

{/* // // The final slide shows a big tick and a message that the user is signed up. It also has a button to go to the dashboard. */}
          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent">
                <IconCheck size={34} />
              </div>
              <h3 className="text-xl font-semibold text-text">You're all set</h3>
              <p className="text-sm leading-6 text-muted">Your bike profile is ready. Welcome to TORQ.</p>
            </div>
          )}

{/* //If the user is on the second step, it will show continue or Skip. This puts a null value in teh users MOT etc dates but lets them move on. The user dashboard will contain the abillity to edit their profile later. */}
          <div className={`mt-6 ${step === 2 ? 'flex gap-3' : 'text-right'}`}>
            {step === 2 ? (
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
              // This just says if it isn't step 2 then show a back button.
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
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-page transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {primaryButtonLabel}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default OnboardingOverlay;
