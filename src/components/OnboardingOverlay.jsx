import { useEffect, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

// Slide count is dynamic, driven by however many entries are in this array.
import { onboardingSlides } from '../data/homeContent';
import { API_BASE_URL } from '../lib/api';

// API Ninjas' Makes/Models list endpoints are paywalled on the free tier (only the spec-search endpoint works), so Make stays a curated static list rather than something fetched live.
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
  // 'register' or 'login', toggled by the rider, changes the whole flow.
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  // Optional, used by the dashboard weather card. No format checking here the backend validates it against postcodes.io when weather is looked up.
  const [postcode, setPostcode] = useState('');
  const [bikeMake, setBikeMake] = useState('Triumph');
  // Model is picked from live search results, not typed free text, so we
  // never cache the wrong bike's spec. Manual entry is the fallback.
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
  // id of the bike created at the key-dates step, used to PATCH mileage/service info onto it at the maintenance step further on.
  const [createdBikeId, setCreatedBikeId] = useState(null);
  const [currentMileage, setCurrentMileage] = useState('');
  // Toggle between recording last service by date or by mileage, only one is stored, whichever mode is active when the rider continues.
  const [serviceInputMode, setServiceInputMode] = useState('date');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [lastServiceMileage, setLastServiceMileage] = useState('');
  const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
  const [saveMaintenanceError, setSaveMaintenanceError] = useState('');

  // Hides the back button from the first step
  const showBackButton = step > 0;
  // Title and body text for the current step.
  const currentTitle = step === 0 ? (mode === 'register' ? 'Create your account' : 'Log in to TORQ') : slide.title;
  const currentBody =
    step === 0
      ? mode === 'register'
        ? 'Start with your email and password to unlock TORQ.'
        : 'Enter your account details to access TORQ.'
      : slide.body;

  // Toggles between register and login modes, updating the form fields and button labels accordingly.
  const toggleLoginMode = () => {
    setMode((current) => (current === 'register' ? 'login' : 'register'));
  };

  // User starts to type. Wait 400ms after the last keystroke (debounce) before searching. Ask our backend, which asks API Ninjas (in motorcycles.js). Then store the results for the dropdown list. clearTimeout cancels an olxd search if you type again
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

  // Make affects which spec results are valid, so changing it clears anything picked/typed against the previous make.
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

  // Keeps the full API Ninjas result (spec and all) to send as-is later.
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

  // Saves the bike to POST /api/bikes:
  //   the Model/Year come from selectedBike, or the manual entry fields
  //   then Key dates come from whatever was passed in (clicking Skip sends nulls to the DB).
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
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          make: bikeMake,
          model,
          year,
          //This just says pass on the info provided OR make it null because it was skipped.
          mot_date: motDate || null,
          tax_date: taxDate || null,
          insurance_date: insuranceDate || null,
          spec: selectedBike || null, // null if manual entry
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save your bike.');
      }

      // Stashed so the maintenance step (further on) can PATCH mileage and service info onto this same bike instead of creating another one.
      setCreatedBikeId(data.bike?.id ?? null);
      return true;
    } catch (error) {
      setSaveBikeError(error instanceof Error ? error.message : 'Unable to save your bike.');
      return false;
    } finally {
      setIsSavingBike(false);
    }
  };

  // Step 2's "Continue" saves whatever dates were entered; "Skip" saves the bike with all three dates left null.
  const handleContinueWithDates = async () => {
    const saved = await createBike({ motDate: motDue, taxDate: taxDue, insuranceDate: insuranceDue });
    if (saved) onNext();
  };

  const handleSkipDates = async () => {
    const saved = await createBike({ motDate: null, taxDate: null, insuranceDate: null });
    if (saved) onNext();
  };

  // Maintenance step!!  PATCH the bike created back at the key-dates step with current mileage and last service info. Only one of lastServiceDate/lastServiceMileage is sent, whichever mode was active. This is controlled by a toggle on the modal.
  const saveMaintenance = async ({ mileageValue, lastServiceDateValue, lastServiceMileageValue }) => {
    // No bike id means bike creation failed earlier, nothing to attach maintenance info to, so just let the rider move on.
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

  // Step 0: submit login/register. Step 1: require a bike before advancing.
  // Everything else: just advance.
  const handlePrimaryAction = async (event) => {
    event.preventDefault();

    if (step === 0) {
      await onAuthSubmit({
        mode,
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        postcode: postcode.trim(),
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

  // Step 0: "Create account"/"Log in". Last step: "Go to dashboard". Else: "Continue".
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
          {/* Progress bar: one span per slide, orange up to the current step. */}
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
                <>
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Postcode (optional)</label>
                    <input
                      value={postcode}
                      onChange={(event) => setPostcode(event.target.value)}
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-text placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="e.g. G1 1XQ"
                    />
                    <p className="text-xs text-muted">Used to show local weather on your dashboard.</p>
                  </div>
                </>
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

              {/* Set by onAuthSubmit in App.jsx for bad login or duplicate email */}
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

          {/* NEED TO ADD THE MATH FUNCTIONS TO CALCULATE DATES. Scope for future */}
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

          {/* Last service: toggle picks date or mileage, only one gets sent. */}
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

          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent">
                <IconCheck size={34} />
              </div>
              <h3 className="text-xl font-semibold text-text">You're all set</h3>
              <p className="text-sm leading-6 text-muted">Your bike profile is ready. Welcome to TORQ.</p>
            </div>
          )}

          {/* Key-dates/maintenance steps get Continue/Skip instead of the usual submit button. */}
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
