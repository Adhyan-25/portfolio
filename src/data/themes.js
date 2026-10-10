// Colour themes offered by the footer switcher, the command palette and the
// `theme` terminal command. The actual colours live in src/styles/tokens.css
// under :root[data-theme='<id>'].
//
// To add a theme: add an entry here and a matching CSS block in tokens.css.

export const DEFAULT_THEME = 'green';

export const themes = [
  { id: 'green', label: 'Green', description: 'Muted green phosphor (default)' },
  { id: 'amber', label: 'Amber', description: 'Classic amber monochrome' },
  { id: 'mono', label: 'Mono', description: 'Warm white on charcoal' },
];
