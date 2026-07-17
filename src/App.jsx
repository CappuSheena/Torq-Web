import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import OnboardingOverlay from './components/OnboardingOverlay';
import ProfilePage from './components/ProfilePage';
import CommunityPage from './components/CommunityPage';
import Footer from './components/Footer';
import { onboardingSlides } from './data/homeContent';
import { API_BASE_URL } from './lib/api';

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
  const navigate = useNavigate();
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
    // Last slide's button closes the popup and sends the rider to their dashboard.
    if (onboardingStep === onboardingSlides.length - 1) {
      closeOnboarding();
      navigate('/dashboard');
      return;
    }
    setOnboardingStep((step) => step + 1);
  };

  const goToPreviousSlide = () => setOnboardingStep((step) => Math.max(0, step - 1));

  const handleAuthSubmit = async ({ mode, email, password, displayName, postcode }) => {
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
            postcode,
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
      
        // This is the login path for people who already have an account.
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
      // Existing users land straight on their dashboard after signing in.
      navigate('/dashboard');
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

  const goToDashboard = () => navigate('/dashboard');
  const goToCommunity = () => navigate('/community');
  const goToHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-page text-text">
      <Header
        onSignUpClick={openSignUp}
        onLogInClick={openLogIn}
        onProfileClick={goToDashboard}
        onCommunityClick={goToCommunity}
        onLogoClick={goToHome}
        isAuthenticated={isAuthenticated}
        user={authUser}
        onLogout={handleLogout}
        isLoading={authLoading}
      />

      <Routes>
        <Route path="/" element={<HomePage onSignUpClick={openSignUp} onLogInClick={openLogIn} />} />
        <Route
          path="/dashboard"
          // Profile is authenticated-only — bounce back to the home page for a
          // signed-out visitor. Direct navigation/refresh lands here before
          // restoreSession's /api/auth/me call resolves, so wait for authLoading
          // to clear before deciding — otherwise a valid session gets redirected
          // away before it has a chance to restore.
          element={
            authLoading ? (
              <p className="px-4 py-10 text-center text-sm text-muted">Checking session…</p>
            ) : isAuthenticated ? (
              <ProfilePage user={authUser} authToken={authToken} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/community"
          // Same auth-gate as /dashboard above.
          element={
            authLoading ? (
              <p className="px-4 py-10 text-center text-sm text-muted">Checking session…</p>
            ) : isAuthenticated ? (
              <CommunityPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
          authToken={authToken}
        />
      )}
    </div>
  );
}

export default App;