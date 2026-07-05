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
  {
    title: 'Shared calendar',
    description: 'See every service date and bike meet on one colour-coded calendar once you sign in.',
    icon: IconCalendarEvent,
  },
];

// Onboarding is a UI stub for now — slides and copy are placeholders. The array shows how many slides there are, and the content is used to populate the screen. Over time I will change the onboard to include an actual login screen (email/password) that talks to mySQL database. 
export const onboardingSlides = [
  {
    title: 'Welcome to TORQ',
    body: 'Everything you need to keep your bike road-legal and ride-ready, built for Glasgow riders.',
  },
  {
    title: 'Stay on top of maintenance',
    body: "We'll remind you before your service, MOT, tax or insurance is due — no spreadsheets required.",
  },
  {
    title: "You're almost set",
    body: 'Add your bike next and your dashboard will fill in with everything above.',
  },
];
