// Static guide content, no database table and no API call. Six to start,
// easy to add more later by just adding another object to this array.
export const guides = [
  {
    id: 'check-your-oil',
    title: 'How to check your oil',
    summary: 'Quick checks to keep your engine oil at a safe level.',
    content:
      '1. Get the bike upright and level, on a paddock stand or the centre stand if you have one.\n' +
      "2. Start the engine and let it idle for a minute or two, then switch off and wait another minute for oil to settle back into the sump.\n" +
      '3. Check the level against the sight glass or dipstick, it should sit between the min and max marks.\n' +
      "4. If it's low, top up a little at a time with the oil grade listed in your owner's manual, then recheck.\n" +
      "5. Don't overfill, too much oil can cause as many problems as too little.",
  },
  {
    id: 'checking-your-brakes',
    title: 'Checking your brakes',
    summary: 'How to check pad wear and brake feel before a ride.',
    content:
      '1. Squeeze the front brake lever, it should feel firm, not soft or spongy.\n' +
      '2. Look through the caliper at the pads, most have a wear line or groove, if the material is close to that line they need replacing soon.\n' +
      '3. Check the brake fluid reservoir is between the min and max marks.\n' +
      '4. Push the bike forward and apply the front brake, it should stop the wheel without any grinding noise.\n' +
      '5. Check the rear brake pedal has a similar firm feel and reasonable travel before it bites.',
  },
  {
    id: 'checking-tyre-pressure-and-tread',
    title: 'Checking tyre pressure and tread',
    summary: 'Correct pressures and legal tread depth checks.',
    content:
      "1. Check pressures when the tyres are cold, ideally before you've ridden anywhere that day.\n" +
      "2. Use the pressures listed in your owner's manual or on the sticker on the swingarm or chain guard, front and rear are usually different.\n" +
      '3. Check tread depth with a gauge or the coin test, the UK legal minimum is 1mm across three quarters of the tread width.\n' +
      '4. Look over the whole tyre for cuts, bulges, or anything embedded in the tread.\n' +
      "5. Uneven wear across the tyre can be a sign the pressure's been wrong for a while, worth a proper check if you spot it.",
  },
  {
    id: 'chain-maintenance',
    title: 'Chain maintenance',
    summary: 'Keeping your chain tensioned, clean and lubricated.',
    content:
      "1. Check chain slack in the middle of the lower run, most bikes want somewhere around 25 to 35mm, check your manual for the exact figure.\n" +
      '2. Rotate the back wheel by hand and feel for tight spots, a chain that tensions unevenly as it rotates needs attention.\n' +
      '3. Clean off old grime with a proper chain cleaner and a soft brush, not petrol or harsh solvents.\n' +
      '4. Once clean and dry, apply chain lube to the inside of the chain while slowly rotating the wheel.\n' +
      '5. Let it soak in for a few minutes, then wipe off any excess so it doesn\'t fling onto the wheel or tyre.',
  },
  {
    id: 'checking-your-lights-and-indicators',
    title: 'Checking your lights and indicators',
    summary: 'Quick electrical check before every ride.',
    content:
      '1. Check the headlight on both dip and main beam.\n' +
      '2. Check the tail light comes on with the ignition.\n' +
      '3. Pull the front brake and press the rear brake pedal separately, the brake light should come on for both.\n' +
      '4. Check all four indicators flash, front left, front right, rear left, rear right.\n' +
      '5. Check the number plate light if your bike has one, easy to forget and an easy fail on an MOT.',
  },
  {
    id: 'battery-care',
    title: 'Battery care',
    summary: 'Keeping your battery healthy, especially over winter.',
    content:
      '1. Check the terminals are clean, tight, and free from any white or green corrosion.\n' +
      "2. If the bike's going to sit unused for more than a couple of weeks, connect a smart charger or trickle charger rather than leaving it to drain.\n" +
      '3. Avoid letting the battery run completely flat, deep discharges shorten its life.\n' +
      "4. On older non-sealed batteries, check the electrolyte level is above the minimum line and top up with distilled water if it isn't.\n" +
      "5. If the bike's struggling to start even after charging, the battery may just be old, most last around four to five years.",
  },
];
