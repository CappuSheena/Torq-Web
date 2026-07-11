// 

import {
  IconCalendarEvent,
  IconChecklist,
  IconMapPin,
  IconTool,
} from '@tabler/icons-react';

// feature cards that appear on the home page, with title, description and icon for each. They will populate the page with however many cards are in the array.
export const featureCards = [
  {
    title: 'Maintenance status',
    description:
      'Track your servicing, MOT and insurance renewals in one place, with reminders before anything lapses.',
    icon: IconTool,
    featured: true,
    //PLACEHOLDER IMG - WILL BE REPLACED WITH SCREENSHOT OF FEATURE
    image: '/assets/screenshots/key-dates.png',
    imageAlt: 'Bike profile card showing MOT, tax and insurance key dates',
  },
  {
    title: 'Shared calendar',
    description: 'See every service date and bike meet on one colour-coded calendar once you sign in.',
    icon: IconCalendarEvent,
    featured: true,
    //PLACEHOLDER IMG - WILL BE REPLACED WITH SCREENSHOT OF FEATURE
    image: '/assets/screenshots/calendar.png',
    imageAlt: 'Mini calendar with colour-coded maintenance and bike meet dates',
  },
  {
    title: 'Pre-ride checklist',
    description: 'Always be ride-ready with a simple safety checklist before every ride.',
    icon: IconChecklist,
  },
  {
    title: 'Community',
    description: 'Take part in the community — local rides, guides and events around Glasgow.',
    icon: IconMapPin,
  },
];

// Onboarding slides that appear when a new user signs up. Each slide has a title and body text. The slides are used in the OnboardingOverlay component. Like the features, any other slides added here update automatically and also expand the slider bar. HOWEVER these are ONLY the title and body text. The progress bar at the top reads how many entries are here.
// go to the onboardingOverlay.jsx component, reorder the step numbers and add new inputs.
export const onboardingSlides = [
  {
    title: 'Create your account',
    body: 'Start with your email and password before creating your bikes profile.',
  },
  {
    title: 'Add your bike',
    body: 'Pick your make, model and year so TORQ can tailor reminders to your machine.',
  },
  {
    title: 'Key dates (optional)',
    body: 'Add MOT, tax and insurance renewals now or skip this step and do it later.',
  }, 
  {
    title: 'Maintenance',
    body: 'Let us know your mileage and last service date so TORQ can suggest when your next service is due.',
  },
  {
    title: "You're all set",
    body: 'Your bike profile is ready — head to the dashboard to see your maintenance summary.',
  },

];
