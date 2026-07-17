import {
  IconCircleDot,
  IconDisc,
  IconBulb,
  IconDroplet,
  IconSettings,
  IconBriefcase,
} from '@tabler/icons-react';

// Static list for now
const CHECKLIST_ITEMS = [
  {
    icon: IconCircleDot,
    title: 'Tyres and pressure',
    description: 'Check tread depth and inflation before setting off.',
  },
  {
    icon: IconDisc,
    title: 'Brakes',
    description: 'Test front and rear brake feel and response.',
  },
  {
    icon: IconBulb,
    title: 'Lights and indicators',
    description: 'Confirm headlight, brake light and indicators work.',
  },
  {
    icon: IconDroplet,
    title: 'Oil and fluid levels',
    description: 'Check engine oil, coolant and brake fluid levels.',
  },
  {
    icon: IconSettings,
    title: 'Chain and drive',
    description: 'Check chain tension and lubrication.',
  },
  {
    icon: IconBriefcase,
    title: 'Controls and mirrors',
    description: 'Check mirrors, cables and levers move freely.',
  },
];

// Read-only checklist. Mapped in from the above array so it's easy to add and remove items. Icons, titles and description
function PreRideChecklist() {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-semibold text-text">Pre-ride checklist</h2>

      <div className="rounded-[20px] border border-white/10 bg-surface shadow-flat">
        {CHECKLIST_ITEMS.map((item, index) => (
          <div
            key={item.title}
            className={`flex items-start gap-3 p-4 ${
              index !== CHECKLIST_ITEMS.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <item.icon size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-semibold text-text">{item.title}</p>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PreRideChecklist;
