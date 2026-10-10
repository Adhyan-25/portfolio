// Interests shown under "Outside the terminal" in the About section and printed
// by the `interests` terminal command. Click a chip to see its details.
//
//   id       unique, no spaces
//   name     the chip label
//   details  rows shown when the chip is selected: { label, value, href? }
//            (add `href` to turn the value into a link)
//
// Entries marked SAMPLE are placeholder wording to be replaced with your own.
// Real examples to add: your half marathon best under Running, and the workout
// split you follow under Working out.

export const interests = [
  {
    id: 'running',
    name: 'Running',
    details: [
      // SAMPLE
      { label: 'Favourite distance', value: 'Half marathon' },
      { label: 'Why I run', value: 'To reset my head between long coding sessions' },
    ],
  },
  {
    id: 'working-out',
    name: 'Working out',
    details: [
      // SAMPLE
      { label: 'Approach', value: 'Strength training, consistency over intensity' },
      { label: 'Split', value: 'Push / pull / legs' },
    ],
  },
  {
    id: 'philosophy',
    name: 'Reading philosophy',
    details: [
      // SAMPLE
      { label: 'Drawn to', value: 'Stoicism and existentialism' },
    ],
  },
  {
    id: 'classic-literature',
    name: 'Classic literature',
    details: [
      { label: 'Favourite author', value: 'Fyodor Dostoevsky' },
      // SAMPLE
      { label: 'Where I would start', value: 'Crime and Punishment' },
    ],
  },
  {
    id: 'music',
    name: 'Listening to music',
    details: [
      { label: 'Favourite artist', value: 'Jagjit Singh' },
      { label: 'YouTube Music', value: '@adhyan3947', href: 'https://music.youtube.com/@adhyan3947' },
    ],
  },
];
