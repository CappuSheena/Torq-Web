import Hero from './Hero';
import FeatureCard from './FeatureCard';
import PhonePreview from './PhonePreview';
import { featureCards } from '../data/homeContent';

// The public marketing page — hero, feature cards and the phone preview.
// Lives at "/" (see App.jsx's <Routes>).
function HomePage({ onSignUpClick, onLogInClick }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="space-y-6">
        <Hero onSignUpClick={onSignUpClick} onLogInClick={onLogInClick} />

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
  );
}

export default HomePage;
