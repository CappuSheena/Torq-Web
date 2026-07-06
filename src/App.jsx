import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import PhonePreview from './components/PhonePreview';
import OnboardingOverlay from './components/OnboardingOverlay';
import Footer from './components/Footer';
import { featureCards, onboardingSlides } from './data/homeContent';

// Lays out the home page from the components in src/components/ and holds
// the one piece of state the page needs: whether onboarding is open.
function App() {
  // null = onboarding closed, a number = open on that slide index
  const [onboardingStep, setOnboardingStep] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('register');
  const isOnboardingOpen = onboardingStep !== null;

  const openOnboarding = (mode = 'register') => {
    setOnboardingMode(mode);
    setOnboardingStep(0);
  };
  const openSignUp = () => openOnboarding('register');
  const openLogIn = () => openOnboarding('login');
  const closeOnboarding = () => setOnboardingStep(null);

  const goToNextSlide = () => {
    // last slide's button closes the popup instead of advancing further
    if (onboardingStep === onboardingSlides.length - 1) {
      closeOnboarding();
      return;
    }
    setOnboardingStep((step) => step + 1);
  };

  const goToPreviousSlide = () => setOnboardingStep((step) => Math.max(0, step - 1));

  return (
    <div className="min-h-screen bg-page text-text">
      <Header onSignUpClick={openSignUp} onLogInClick={openLogIn} />

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
        />
      )}
    </div>
  );
}

export default App;