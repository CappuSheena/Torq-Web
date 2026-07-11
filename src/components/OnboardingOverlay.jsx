// I started with trying to add the abillity to add your own 'avatar' to your profile but this is OOS. There is some code here relating to it (like the cmaera icon and possibly routing the img url in the db) that meeds to be removed.

import { useEffect, useState } from 'react';
import {
  IconCamera,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

// importing the onboarding slides from homeContent.js. Simillar to the feature cards, it is dynamic and will update with however many cards are in the array.
import { onboardingSlides } from '../data/homeContent';
import { API_BASE_URL } from '../lib/api';

// API Ninjas' makes/models list endpoints are paywalled on the free tier
// (only the spec-search endpoint works), so Make stays a curated static
// list rather than something fetched live.
const BIKE_MAKES = [
  'Triumph',
  'Honda',
  'Yamaha',
  'Kawasaki',
  'Suzuki',
  'Ducati',
  'BMW',
  'KTM',
  'Harley-Davidson',
  'Aprilia',
  'Royal Enfield',
  'Indian',
  'Moto Guzzi',
];

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
  authToken,
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
  const [bikeMake, setBikeMake] = useState('Triumph');
  // Model is a live search against /api/motorcycles/spec rather than free
  // text — picking an exact result avoids silently attaching the wrong
  // bike's spec (e.g. typing "cbf" and getting whatever fuzzy-matched
  // first). selectedBike holds the exact chosen result (which *is* the
  // full spec object); manual entry is the explicit fallback when a bike
  // genuinely isn't in API Ninjas' data.
  const [modelQuery, setModelQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedBike, setSelectedBike] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualYear, setManualYear] = useState('');
  // option user input
  const [motDue, setMotDue] = useState('');
  const [taxDue, setTaxDue] = useState('');
  const [insuranceDue, setInsuranceDue] = useState('');
  const [specError, setSpecError] = useState('');
  const [isSavingBike, setIsSavingBike] = useState(false);
  const [saveBikeError, setSaveBikeError] = useState('');
  // id of the bike created at the key-dates step, used to PATCH mileage/
  // service info onto it at the maintenance step further on.
  const [createdBikeId, setCreatedBikeId] = useState(null);
  const [currentMileage, setCurrentMileage] = useState('');
  // Toggle between recording last service by date or by mileage — only one
  // is stored, whichever mode is active when the rider continues.
  const [serviceInputMode, setServiceInputMode] = useState('date');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [lastServiceMileage, setLastServiceMileage] = useState('');
  const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
  const [saveMaintenanceError, setSaveMaintenanceError] = useState('');

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

  // This runs every time modelQuery changes (i.e. every keystroke in the
  // Model box) and is what actually talks to our backend to search for
  // bikes. Plain-English walkthrough:
  //   1. If we're in manual-entry mode, or a bike is already picked, don't
  //      search at all — there's nothing to look up.
  //   2. Don't bother searching for 1 letter, it'd return junk.
  //   3. Wait 400ms (setTimeout) before actually sending the request. This
  //      is called "debouncing" — if you type "cbf" that's 3 keystrokes,
  //      and without the wait we'd fire off 3 separate searches. Waiting
  //      400ms after the LAST keystroke means we only search once, after
  //      you've paused typing.
  //   4. Ask our own backend (GET /api/motorcycles/spec) for matches — our
  //      backend then goes and asks API Ninjas (see motorcycles.js) and
  //      hands the results back to us.
  //   5. Save whatever came back into searchResults, which is what draws
  //      the clickable list on screen.
  // The "return () => clearTimeout(timeoutId)" at the end is React's way of
  // cancelling the previous 400ms timer if you type another letter before
  // it fires — otherwise old searches could finish after newer ones and
  // overwrite them with stale results.
  useEffect(() => {
    if (isManualEntry || selectedBike) return;

    const trimmedQuery = modelQuery.trim();
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    setSearchLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ make: bikeMake, model: trimmedQuery });
        const response = await fetch(`${API_BASE_URL}/api/motorcycles/spec?${params.toString()}`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to search right now.');
        }

        const results = data.results || [];
        setSearchResults(results);
        setSearchError(results.length === 0 ? `No matches for "${trimmedQuery}".` : '');
      } catch (error) {
        setSearchResults([]);
        setSearchError(error instanceof Error ? error.message : 'Unable to search right now.');
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [modelQuery, bikeMake, isManualEntry, selectedBike]);

  // Make affects which spec results are valid, so changing it clears
  // anything picked/typed against the previous make.
  const handleMakeChange = (event) => {
    setBikeMake(event.target.value);
    setSelectedBike(null);
    setModelQuery('');
    setSearchResults([]);
    setSearchError('');
    setIsManualEntry(false);
    setManualModel('');
    setManualYear('');
  };

  // Called when the rider clicks one of the search results. `result` is
  // one whole object from the API Ninjas response (make, model, year,
  // engine, power, everything) — we just hang onto the entire thing as
  // "the chosen bike". It gets sent to the backend as-is later when we
  // actually save the bike, no second lookup needed.
  const handleSelectResult = (result) => {
    setSelectedBike(result);
    setSearchResults([]);
    setSpecError('');
  };

  const handleClearSelection = () => {
    setSelectedBike(null);
    setModelQuery('');
    setSearchResults([]);
  };

  const handleCancelManualEntry = () => {
    setIsManualEntry(false);
    setManualModel('');
    setManualYear('');
  };

  // This is the last step of the whole chain — it actually saves the bike.
  // By this point we already have everything we need sitting in state:
  // bikeMake (dropdown), and either selectedBike (the exact result they
  // clicked, which includes the full spec) or manualModel/manualYear (typed
  // by hand, no spec). We just package it all up and POST it to our own
  // backend at /api/bikes, which is the file backend/src/routes/bikes.js —
  // that's the bit that actually writes the row into the MySQL database.
  // Called via whatever key-date values are passed in (Skip explicitly
  // passes nulls). Returns whether it succeeded so the caller knows
  // whether it's safe to advance to the next slide.
  const createBike = async ({ motDate, taxDate, insuranceDate }) => {
    setSaveBikeError('');
    setIsSavingBike(true);

    try {
      const model = selectedBike ? selectedBike.model : manualModel.trim();
      const year = selectedBike ? Number(selectedBike.year) : Number(manualYear);

      const response = await fetch(`${API_BASE_URL}/api/bikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The backend needs to know WHO is creating this bike. authToken
          // is the JWT we got back when the user registered/logged in
          // (see App.jsx) — sending it here lets the backend's
          // authenticateToken middleware work out req.user.user_id.
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          make: bikeMake,
          model,
          year,
          mot_date: motDate || null,
          tax_date: taxDate || null,
          insurance_date: insuranceDate || null,
          // selectedBike already IS the full spec object from API Ninjas
          // (or null if the rider used manual entry) — we just forward it
          // straight through. The backend stringifies it and stores it.
          spec: selectedBike || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save your bike.');
      }

      // Stashed so the maintenance step (further on) can PATCH mileage and
      // service info onto this same bike instead of creating another one.
      setCreatedBikeId(data.bike?.id ?? null);
      return true;
    } catch (error) {
      setSaveBikeError(error instanceof Error ? error.message : 'Unable to save your bike.');
      return false;
    } finally {
      setIsSavingBike(false);
    }
  };

  // Step 2's "Continue" saves whatever dates were entered; "Skip for now"
  // saves the bike with all three dates left null.
  const handleContinueWithDates = async () => {
    const saved = await createBike({ motDate: motDue, taxDate: taxDue, insuranceDate: insuranceDue });
    if (saved) onNext();
  };

  const handleSkipDates = async () => {
    const saved = await createBike({ motDate: null, taxDate: null, insuranceDate: null });
    if (saved) onNext();
  };

  // Maintenance step — PATCHes the bike created back at the key-dates step
  // with current mileage and last-service info. Only one of
  // lastServiceDate/lastServiceMileage is sent, whichever mode was active.
  const saveMaintenance = async ({ mileageValue, lastServiceDateValue, lastServiceMileageValue }) => {
    // No bike id means bike creation failed earlier — nothing to attach
    // maintenance info to, so just let the rider move on.
    if (!createdBikeId) return true;

    setSaveMaintenanceError('');
    setIsSavingMaintenance(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bikes/${createdBikeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          mileage: mileageValue,
          last_service: lastServiceDateValue,
          last_service_mileage: lastServiceMileageValue,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save your maintenance details.');
      }

      return true;
    } catch (error) {
      setSaveMaintenanceError(
        error instanceof Error ? error.message : 'Unable to save your maintenance details.'
      );
      return false;
    } finally {
      setIsSavingMaintenance(false);
    }
  };

  const handleContinueWithMaintenance = async () => {
    const saved = await saveMaintenance({
      mileageValue: currentMileage.trim() ? Number(currentMileage) : null,
      lastServiceDateValue: serviceInputMode === 'date' && lastServiceDate ? lastServiceDate : null,
      lastServiceMileageValue:
        serviceInputMode === 'mileage' && lastServiceMileage.trim() ? Number(lastServiceMileage) : null,
    });
    if (saved) onNext();
  };

  const handleSkipMaintenance = () => {
    onNext();
  };

  // usual prevent default. Step 0 calls onAuthSubmit (register/login). Step 1
  // just checks a bike has actually been picked (via search) or manually
  // entered before advancing. Any other step just advances.
  const handlePrimaryAction = async (event) => {
    event.preventDefault();

    if (step === 0) {
      await onAuthSubmit({
        mode,
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });
      return;
    }

    if (step === 1) {
      const hasConfirmedBike = Boolean(selectedBike) || (isManualEntry && manualModel.trim() && manualYear);
      if (!hasConfirmedBike) {
        setSpecError(
          isManualEntry
            ? 'Please fill in model and year.'
            : 'Please search and select your bike, or add it manually.'
        );
        return;
      }
      setSpecError('');
      onNext();
      return;
    }

    onNext();
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

{/* Make is a curated static list (API Ninjas' makes/models list endpoints
    are paywalled on the free tier). Model is a live search against
    /api/motorcycles/spec — the rider picks an exact result rather than
    typing free text, so we never silently cache the wrong bike's spec. */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Make</label>
                <select
                  value={bikeMake}
                  onChange={handleMakeChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {BIKE_MAKES.map((make) => (
                    <option key={make}>{make}</option>
                  ))}
                </select>
              </div>

              {selectedBike ? (
                <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-text">{selectedBike.model}</p>
                    <p className="text-xs text-muted">
                      {selectedBike.year}
                      {selectedBike.type ? ` · ${selectedBike.type}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs font-semibold text-accent transition hover:text-accent/80"
                  >
                    Change
                  </button>
                </div>
              ) : isManualEntry ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Model</label>
                    <input
                      value={manualModel}
                      onChange={(event) => setManualModel(event.target.value)}
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="e.g. Street Triple 765 R"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Year</label>
                    <input
                      value={manualYear}
                      onChange={(event) => setManualYear(event.target.value)}
                      type="number"
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <p className="text-xs text-muted">
                    We won't have spec data cached for this bike, but you can still track its maintenance.{' '}
                    <button
                      type="button"
                      onClick={handleCancelManualEntry}
                      className="text-accent underline transition hover:text-accent/80"
                    >
                      Search instead
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Model</label>
                  <input
                    value={modelQuery}
                    onChange={(event) => setModelQuery(event.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Search e.g. Street Triple"
                  />

                  {searchLoading && <p className="text-xs text-muted">Searching…</p>}

                  {!searchLoading && searchResults.length > 0 && (
                    <div className="max-h-56 space-y-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0D1520] p-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={`${result.model}-${result.year}-${index}`}
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5"
                        >
                          <span className="font-medium text-text">{result.model}</span>{' '}
                          <span className="text-muted">
                            · {result.year}
                            {result.type ? ` · ${result.type}` : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!searchLoading && searchError && (
                    <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
                      {searchError}
                    </div>
                  )}

                  {!searchLoading && modelQuery.trim().length >= 2 && searchResults.length === 0 && (
                    <button
                      type="button"
                      onClick={() => setIsManualEntry(true)}
                      className="text-xs font-semibold text-accent underline transition hover:text-accent/80"
                    >
                      Can't find your bike? Add it manually
                    </button>
                  )}
                </div>
              )}

              {specError && (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
                  {specError}
                </div>
              )}
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

              {saveBikeError && (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
                  {saveBikeError}
                </div>
              )}
            </div>
          )}

{/* Mileage is always shown; last service can be recorded either as a date
    or as an odometer reading at the time — the toggle picks which one gets
    sent, the other stays null. */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Current mileage</label>
                <input
                  value={currentMileage}
                  onChange={(event) => setCurrentMileage(event.target.value)}
                  type="number"
                  min="0"
                  className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="e.g. 8250"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Last serviced</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceInputMode('date')}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                      serviceInputMode === 'date'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 text-muted hover:text-text'
                    }`}
                  >
                    By date
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceInputMode('mileage')}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                      serviceInputMode === 'mileage'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 text-muted hover:text-text'
                    }`}
                  >
                    By mileage
                  </button>
                </div>

                {serviceInputMode === 'date' ? (
                  <input
                    value={lastServiceDate}
                    onChange={(event) => setLastServiceDate(event.target.value)}
                    type="date"
                    className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                ) : (
                  <input
                    value={lastServiceMileage}
                    onChange={(event) => setLastServiceMileage(event.target.value)}
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="e.g. 6000"
                  />
                )}
              </div>

              {saveMaintenanceError && (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
                  {saveMaintenanceError}
                </div>
              )}
            </div>
          )}

{/* // // The final slide shows a big tick and a message that the user is signed up. It also has a button to go to the dashboard. */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent">
                <IconCheck size={34} />
              </div>
              <h3 className="text-xl font-semibold text-text">You're all set</h3>
              <p className="text-sm leading-6 text-muted">Your bike profile is ready. Welcome to TORQ.</p>
            </div>
          )}

{/* //If the user is on the key-dates or maintenance step, show Continue/Skip instead of the usual submit button. Skipping puts null values in for whatever wasn't filled in but lets them move on. The user dashboard will contain the abillity to edit their profile later. */}
          <div className={`mt-6 ${step === 2 || step === 3 ? 'flex gap-3' : 'text-right'}`}>
            {step === 2 ? (
              <>
                <button
                  type="button"
                  onClick={handleSkipDates}
                  disabled={isSavingBike}
                  className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleContinueWithDates}
                  disabled={isSavingBike}
                  className="flex-1 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-page transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingBike ? 'Saving…' : 'Continue'}
                </button>
              </>
            ) : step === 3 ? (
              <>
                <button
                  type="button"
                  onClick={handleSkipMaintenance}
                  disabled={isSavingMaintenance}
                  className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleContinueWithMaintenance}
                  disabled={isSavingMaintenance}
                  className="flex-1 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-page transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingMaintenance ? 'Saving…' : 'Continue'}
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
