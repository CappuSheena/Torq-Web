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
    image: '/assets/screenshots/key-dates.png',
    imageAlt: 'Bike profile card showing MOT, tax and insurance key dates',
  },
  {
    title: 'Shared calendar',
    description: 'See every service date and bike meet on one colour-coded calendar once you sign in.',
    icon: IconCalendarEvent,
    featured: true,
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

// Onboarding is a UI stub for now — slides and copy are placeholders for the new flow.
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
    title: "You're all set",
    body: 'Your bike profile is ready — head to the dashboard to see your maintenance summary.',
  },
];
