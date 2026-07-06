import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import PhonePreview from './components/PhonePreview';
import OnboardingOverlay from './components/OnboardingOverlay';
import Footer from './components/Footer';
import { featureCards, onboardingSlides } from './data/homeContent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_STORAGE_KEY = 'torq_token';

// Keep the auth details in one place so the header and onboarding flow can share them.

// Lays out the home page from the components in src/components/ and holds
// the one piece of state the page needs: whether onboarding is open.
function App() {
  // null = onboarding closed, a number = open on that slide index
  const [onboardingStep, setOnboardingStep] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('register');
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  // Track whether the modal is open and whether the user is considered signed in.
  const isOnboardingOpen = onboardingStep !== null;
  const isAuthenticated = Boolean(authUser) || Boolean(authToken);

  useEffect(() => {
    // On page load, check whether a saved token is still valid and restore the session if it is.
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('invalid session');
        }

        const data = await response.json().catch(() => ({}));
        setAuthUser(data.user || null);
        setAuthToken(storedToken);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthUser(null);
        setAuthToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const persistAuth = (token, user) => {
    // Save the token for now so the user stays signed in after refreshes.
    // A future version should swap this for an httpOnly cookie for better security.
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);
    setAuthUser(user);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setAuthUser(null);
  };

  const openOnboarding = (mode = 'register') => {
    setOnboardingMode(mode);
    setOnboardingStep(0);
    setAuthError('');
  };
  const openSignUp = () => openOnboarding('register');
  const openLogIn = () => openOnboarding('login');
  const closeOnboarding = () => {
    setOnboardingStep(null);
    setAuthError('');
  };

  const goToNextSlide = () => {
    // last slide's button closes the popup instead of advancing further
    if (onboardingStep === onboardingSlides.length - 1) {
      closeOnboarding();
      return;
    }
    setOnboardingStep((step) => step + 1);
  };

  const goToPreviousSlide = () => setOnboardingStep((step) => Math.max(0, step - 1));

  const handleAuthSubmit = async ({ mode, email, password, displayName }) => {
    // Send the form data to the backend and update the app state based on the result.
    setAuthSubmitting(true);
    setAuthError('');

    try {
      if (mode === 'register') {
        // Create the account first, then immediately sign the user in so they can continue.
        const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            display_name: displayName,
          }),
        });

        const registerData = await registerResponse.json().catch(() => ({}));

        if (!registerResponse.ok) {
          throw new Error(registerData.error || 'Unable to create your account.');
        }

        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json().catch(() => ({}));

        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Unable to sign you in.');
        }

        persistAuth(loginData.token, loginData.user);
        goToNextSlide();
        return true;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        // This is the login path for people who already have an account.
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Incorrect email or password');
      }

      persistAuth(data.token, data.user);
      closeOnboarding();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete that request.';
      setAuthError(message === 'Invalid email or password.' ? 'Incorrect email or password' : message);
      return false;
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Clear the saved token and drop the user back to the signed-out state.
    clearAuth();
    closeOnboarding();
  };

  return (
    <div className="min-h-screen bg-page text-text">
      <Header
        onSignUpClick={openSignUp}
        onLogInClick={openLogIn}
        isAuthenticated={isAuthenticated}
        user={authUser}
        onLogout={handleLogout}
        isLoading={authLoading}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="space-y-6">
          <Hero onSignUpClick={openSignUp} onLogInClick={openLogIn} />

          {/* featureCards lives in data/homeContent.js */}
          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((card) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                featured={card.featured}
                image={card.image}
                imageAlt={card.imageAlt}
              />
            ))}
          </div>

          <PhonePreview />
        </section>
      </main>

      <Footer />

      {isOnboardingOpen && (
        <OnboardingOverlay
          step={onboardingStep}
          initialMode={onboardingMode}
          onNext={goToNextSlide}
          onBack={goToPreviousSlide}
          onClose={closeOnboarding}
          onAuthSubmit={handleAuthSubmit}
          authError={authError}
          isSubmitting={authSubmitting}
        />
      )}
    </div>
  );
}

export default App;